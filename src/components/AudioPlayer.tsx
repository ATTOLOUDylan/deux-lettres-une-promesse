import { useEffect, useRef, useState } from 'react';
import { duckMusic } from '../lovegame/audio';

export default function AudioPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const a = new Audio(src);
    ref.current = a;
    setPlaying(false);
    setMissing(false);
    setProgress(0);
    a.addEventListener('error', () => setMissing(true));
    a.addEventListener('timeupdate', () => setProgress(a.duration ? a.currentTime / a.duration : 0));
    a.addEventListener('ended', () => { setPlaying(false); duckMusic(false); });
    return () => {
      a.pause();
      a.src = '';
      duckMusic(false);
    };
  }, [src]);

  const toggle = () => {
    const a = ref.current;
    if (!a || missing) return;
    if (a.paused) {
      a.play().then(() => { setPlaying(true); duckMusic(true); }).catch(() => setMissing(true));
    } else {
      a.pause();
      setPlaying(false);
      duckMusic(false);
    }
  };
  const restart = () => {
    const a = ref.current;
    if (!a || missing) return;
    a.currentTime = 0;
    a.play().then(() => { setPlaying(true); duckMusic(true); }).catch(() => setMissing(true));
  };

  if (missing) return <div className="audio-missing">🎙️ L’enregistrement audio arrive bientôt…</div>;
  return (
    <div className="audio-player">
      <button onClick={toggle} aria-label={playing ? 'Pause' : 'Écouter'}>{playing ? '⏸ Pause' : '▶ Écouter'}</button>
      <button onClick={restart} aria-label="Réécouter depuis le début">↺ Réécouter</button>
      <div className="audio-bar"><div style={{ width: `${progress * 100}%` }} /></div>
    </div>
  );
}
