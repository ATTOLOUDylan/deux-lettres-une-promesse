import { useCallback, useEffect, useRef, useState } from 'react';
import { startGame } from './lovegame/game';
import { bus } from './lovegame/bus';
import { startMusic, setMusicEnabled } from './lovegame/audio';
import { story } from './lovegame/content/story';
import { asset } from './lovegame/assets';
import LetterModal from './components/LetterModal';
import TouchControls from './components/TouchControls';
import DialogueBox from './components/DialogueBox';
import PuzzleModal from './components/puzzles/PuzzleModal';
import Chapter0Invitation from './components/chapters/Chapter0Invitation';
import Chapter1University from './components/chapters/Chapter1University';
import Chapter5Clearing from './components/chapters/Chapter5Clearing';
import EpiloguePromise from './components/chapters/EpiloguePromise';
import EndingDashboard from './components/chapters/EndingDashboard';
import { progressionStore, useProgression } from './lovegame/state/ProgressionStore';
import './lovegame/styles.css';

type Phase = 'title' | 'chapter0' | 'chapter1' | 'playing' | 'chapter5' | 'epilogue' | 'ending';
interface Hud { level: number; title: string; hearts: number; required: number; total: number }

function renderFormattedText(text: string) {
  return text.split('\n\n').map((paragraph, pIdx) => {
    let p = paragraph.trim();
    if (!p) return null;

    let isHeader = false;
    if (p.startsWith('# ')) {
      isHeader = true;
      p = p.slice(2);
    }

    const parts = p.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    const content = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={partIdx}>{part.slice(1, -1)}</em>;
      }
      return part;
    });

    if (isHeader) {
      return <h2 key={pIdx} className="formatted-title">{content}</h2>;
    }
    return <p key={pIdx}>{content}</p>;
  });
}

const isTouch = typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window);

export default function App() {
  const [phase, setPhase] = useState<Phase>('title');
  const [hud, setHud] = useState<Hud | null>(null);
  const [letter, setLetter] = useState<number | null>(null);
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [puzzle, setPuzzle] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [hint, setHint] = useState(true);
  const [music, setMusic] = useState(true);
  const fromGame = useRef(false);
  const toastTimer = useRef<number | undefined>(undefined);
  const progression = useProgression();
  const hasSave =
    progression.unlockedLetters.length > 0 ||
    progression.solvedPuzzles.length > 0 ||
    progression.collectedFragments.length > 0 ||
    Object.keys(progression.openedChestsByLevel).length > 0;

  useEffect(() => {
    const onHud = (h: Hud) => setHud(h);
    const onToast = (t: string) => {
      setToast(t);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(null), 3200);
    };
    const onChest = (i: number) => {
      progressionStore.openChest(i);
      progressionStore.unlockLetter(i);
      fromGame.current = true;
      setLetter(i);
    };
    const onChapter5 = () => {
      progressionStore.completeChapter('chapitre-4', 'chapitre-5');
      setPhase('chapter5');
    };
    const onStartDialogue = (dialogueId: string) => {
      // Un dialogue ne doit pouvoir se déclencher qu'une fois à la fois
      setDialogue((current) => (current === null ? dialogueId : current));
    };
    const onStartPuzzle = (puzzleId: string) => {
      // Une énigme ne doit pouvoir s'ouvrir qu'une fois à la fois
      setPuzzle((current) => (current === null ? puzzleId : current));
    };

    bus.on('hud', onHud);
    bus.on('toast', onToast);
    bus.on('chest-opened', onChest);
    bus.on('ending-ready', onChapter5);
    bus.on('chapter-5-trigger', onChapter5);
    bus.on('start-dialogue', onStartDialogue);
    bus.on('start-puzzle', onStartPuzzle);

    return () => {
      bus.off('hud', onHud);
      bus.off('toast', onToast);
      bus.off('chest-opened', onChest);
      bus.off('ending-ready', onChapter5);
      bus.off('chapter-5-trigger', onChapter5);
      bus.off('start-dialogue', onStartDialogue);
      bus.off('start-puzzle', onStartPuzzle);
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
    progressionStore.reset();
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
            <div className="intro">{renderFormattedText(story.intro)}</div>
            <div className="title-actions">
              {progression.chapters['chapitre-0'] !== 'completed' ? (
                <button
                  className="primary"
                  onClick={() => {
                    startMusic();
                    setPhase('chapter0');
                  }}
                >
                  {story.startButton}
                </button>
              ) : progression.chapters['chapitre-1'] !== 'completed' ? (
                <>
                  <button
                    className="primary"
                    onClick={() => {
                      startMusic();
                      setPhase('chapter1');
                    }}
                  >
                    Entrer dans l’Université (Chapitre 1) 🏛️
                  </button>
                  <button
                    className="secondary"
                    onClick={() => {
                      startMusic();
                      setPhase('chapter0');
                    }}
                  >
                    📜 Revoir l’invitation & la carte
                  </button>
                </>
              ) : (
                <>
                  <button className="primary" onClick={begin}>
                    Continuer notre aventure
                  </button>
                  <button
                    className="secondary"
                    onClick={() => {
                      startMusic();
                      setPhase('chapter1');
                    }}
                  >
                    🏛️ Revoir l’Université (Chapitre 1)
                  </button>
                  <button
                    className="secondary"
                    onClick={() => {
                      startMusic();
                      setPhase('chapter0');
                    }}
                  >
                    📜 Revoir l’invitation (Chapitre 0)
                  </button>
                  {progression.chapters['chapitre-5'] === 'completed' && (
                    <>
                      <button
                        className="secondary"
                        onClick={() => {
                          startMusic();
                          setPhase('chapter5');
                        }}
                      >
                        🌸 Revoir les Retrouvailles (Chapitre 5)
                      </button>
                      <button
                        className="secondary"
                        onClick={() => {
                          startMusic();
                          setPhase('epilogue');
                        }}
                      >
                        💌 Revoir la Promesse (Épilogue)
                      </button>
                      <button
                        className="secondary"
                        onClick={() => {
                          startMusic();
                          setPhase('ending');
                        }}
                      >
                        🏆 Journal d’Amour & Écran Final
                      </button>
                    </>
                  )}
                </>
              )}
              {hasSave && progression.unlockedLetters.length > 0 && (
                <button
                  className="secondary"
                  onClick={() => {
                    fromGame.current = false;
                    setLetter(progression.unlockedLetters[0] ?? 0);
                  }}
                >
                  📖 Relire nos lettres & promesse ({progression.unlockedLetters.length}/3)
                </button>
              )}
              {hasSave && (
                <button
                  className="secondary"
                  onClick={() => {
                    if (window.confirm('Veux-tu réinitialiser ta progression et recommencer depuis le début ?')) {
                      progressionStore.reset();
                    }
                  }}
                >
                  ↺ Recommencer à zéro
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {phase === 'chapter0' && (
        <Chapter0Invitation
          onComplete={() => setPhase('chapter1')}
          onBackToTitle={() => setPhase('title')}
        />
      )}

      {phase === 'chapter1' && (
        <Chapter1University
          onComplete={begin}
          onBackToMenu={() => setPhase('title')}
        />
      )}

      {phase !== 'title' && (
        <button className="music-btn" onClick={toggleMusic} aria-label="Musique">{music ? '🔊' : '🔇'}</button>
      )}

      {phase === 'playing' && hud && (
        <div className="hud">
          <span className="chapter">{hud.title}</span>
          <span className="hearts">❤ {hud.hearts} / {hud.required}</span>
          {hud.level === 0 ? (
            <div className="fragments-bar" title="Fragments de la phrase secrète : TU ES MON PLUS BEAU HASARD">
              <span className="fragments-label">Phrase :</span>
              {['TU', 'ES', 'MON', 'PLUS', 'BEAU', 'HASARD'].map((word) => {
                const isCollected = progression.collectedFragments.includes(word);
                return (
                  <span
                    key={word}
                    className={`fragment-pill ${isCollected ? 'collected' : 'missing'}`}
                  >
                    {isCollected ? word : '???'}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="fragments-bar" title="Fragments de l’Avenir : COURAGE, TRAVAIL, SOUTIEN">
              <span className="fragments-label">Avenir :</span>
              {['COURAGE', 'TRAVAIL', 'SOUTIEN'].map((word) => {
                const isCollected = progression.collectedFragments.includes(word);
                return (
                  <span
                    key={word}
                    className={`fragment-pill ${isCollected ? 'collected' : 'missing'}`}
                  >
                    {isCollected ? word : '???'}
                  </span>
                );
              })}
            </div>
          )}
          {progression.unlockedLetters.length > 0 && (
            <button
              className="hud-journal-btn"
              onClick={() => {
                fromGame.current = false;
                setLetter(progression.unlockedLetters[0] ?? 0);
              }}
              title="Ouvrir le journal de nos lettres"
              aria-label="Ouvrir le journal de nos lettres"
            >
              📖 Journal ({progression.unlockedLetters.length})
            </button>
          )}
        </div>
      )}
      {phase === 'playing' && hint && <div className="hint">{isTouch ? story.controlsHintTouch : story.controlsHintDesktop}</div>}
      {toast && <div className="toast">{toast}</div>}

      {phase === 'playing' && isTouch && letter === null && dialogue === null && puzzle === null && <TouchControls />}
      {phase === 'playing' && <div className="rotate-hint">↻ Tourne ton téléphone en mode paysage</div>}

      {dialogue !== null && (
        <DialogueBox
          dialogueId={dialogue}
          onClose={() => setDialogue(null)}
        />
      )}

      {puzzle !== null && (
        <PuzzleModal
          puzzleId={puzzle}
          onClose={() => setPuzzle(null)}
        />
      )}

      {phase === 'chapter5' && (
        <Chapter5Clearing
          onComplete={() => {
            progressionStore.completeChapter('chapitre-5', 'epilogue');
            setPhase('epilogue');
          }}
          onBackToMenu={() => setPhase('title')}
        />
      )}

      {phase === 'epilogue' && (
        <EpiloguePromise
          onComplete={() => {
            progressionStore.completeChapter('epilogue');
            progressionStore.unlockLetter(2);
            setPhase('ending');
          }}
          onBackToMenu={() => setPhase('title')}
        />
      )}

      {phase === 'ending' && letter === null && (
        <EndingDashboard
          onReplayChapter={(ch) => {
            if (ch === 'chapter0') {
              startMusic();
              setPhase('chapter0');
            } else if (ch === 'chapter1') {
              startMusic();
              setPhase('chapter1');
            } else if (ch === 'chapter5') {
              startMusic();
              setPhase('chapter5');
            } else if (ch === 'epilogue') {
              startMusic();
              setPhase('epilogue');
            } else {
              begin();
              bus.emit('restart');
            }
          }}
          onResetSave={() => {
            progressionStore.reset();
            bus.emit('restart');
            setPhase('title');
          }}
        />
      )}

      {letter !== null && (
        <LetterModal
          index={letter}
          onClose={closeLetter}
          onSwitch={setLetter}
          isJournalMode={!fromGame.current}
        />
      )}
    </div>
  );
}
