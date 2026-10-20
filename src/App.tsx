import { useCallback, useEffect, useRef, useState } from 'react';
import { startGame } from './lovegame/game';
import { bus } from './lovegame/bus';
import { startMusic, setMusicEnabled } from './lovegame/audio';
import { story } from './lovegame/content/story';
import { asset } from './lovegame/assets';
import LetterModal from './components/LetterModal';
import TouchControls from './components/TouchControls';
import './lovegame/styles.css';

type Phase = 'title' | 'playing' | 'ending';
interface Hud { level: number; title: string; hearts: number; required: number; total: number }

function renderIntroText(text: string) {
  return text.split('\n\n').map((paragraph, pIdx) => {
    const parts = paragraph.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={pIdx}>
        {parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
  });
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('title');
  const [hud, setHud] = useState<Hud | null>(null);
  const [letter, setLetter] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [hint, setHint] = useState(true);
  const [music, setMusic] = useState(true);
  const fromGame = useRef(false);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onHud = (h: Hud) => setHud(h);
    const onToast = (t: string) => {
      setToast(t);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(null), 3200);
    };
    const onChest = (i: number) => { fromGame.current = true; setLetter(i); };
    const onEnding = () => setPhase('ending');
    bus.on('hud', onHud);
    bus.on('toast', onToast);
    bus.on('chest-opened', onChest);
    bus.on('ending-ready', onEnding);
    return () => {
      bus.off('hud', onHud);
      bus.off('toast', onToast);
      bus.off('chest-opened', onChest);
      bus.off('ending-ready', onEnding);
    };
  }, []);

  const begin = useCallback(() => {
    startGame('game-container');
    startMusic();
    setPhase('playing');
    setHint(true);
    window.setTimeout(() => setHint(false), 9000);
  }, []);

  const closeLetter = () => {
    const i = letter;
    setLetter(null);
    if (fromGame.current && i !== null) {
      fromGame.current = false;
      bus.emit('letter-closed', i);
    }
  };

  const restart = () => {
    setPhase('playing');
    setHud(null);
    bus.emit('restart');
  };

  const toggleMusic = () => { setMusic(!music); setMusicEnabled(!music); };

  return (
    <div className="app">
      <div id="game-container" />

      {phase === 'title' && (
        <div className="title-screen" style={{ backgroundImage: `url(${asset('backgrounds/title.jpg')})` }}>
          <div className="title-box">
            <h1>{story.title}</h1>
            <p className="names">{story.names}</p>
            <div className="intro">{renderIntroText(story.intro)}</div>
            <button className="primary" onClick={begin}>{story.startButton}</button>
          </div>
        </div>
      )}

      {phase !== 'title' && (
        <button className="music-btn" onClick={toggleMusic} aria-label="Musique">{music ? '🔊' : '🔇'}</button>
      )}

      {phase === 'playing' && hud && (
        <div className="hud">
          <span className="chapter">{hud.title}</span>
          <span className="hearts">❤ {hud.hearts} / {hud.required}</span>
        </div>
      )}
      {phase === 'playing' && hint && <div className="hint">{isTouch ? story.controlsHintTouch : story.controlsHintDesktop}</div>}
      {toast && <div className="toast">{toast}</div>}

      {phase === 'playing' && isTouch && letter === null && <TouchControls />}
      {phase === 'playing' && <div className="rotate-hint">↻ Tourne ton téléphone en mode paysage</div>}

      {phase === 'ending' && letter === null && (
        <>
          <div className="ending-top"><p>{story.endingMessage}</p></div>
          <div className="ending-bottom">
            <button className="primary" onClick={() => { fromGame.current = false; setLetter(0); }}>Relire les lettres</button>
            <button onClick={restart}>Recommencer l’aventure</button>
          </div>
        </>
      )}

      {letter !== null && <LetterModal index={letter} onClose={closeLetter} onSwitch={fromGame.current ? undefined : setLetter} />}
    </div>
  );
}
