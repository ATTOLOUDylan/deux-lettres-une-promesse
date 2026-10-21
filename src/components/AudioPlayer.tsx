import { useEffect, useRef, useState, useCallback } from 'react';
import { duckMusic } from '../lovegame/audio';

// Coordinateur global : garantit qu'une seule lecture audio vocale a lieu à la fois
let activeVoiceInstance: (() => void) | null = null;

interface AudioPlayerProps {
  src: string;
  fallbackMessage?: string;
}

export default function AudioPlayer({ src, fallbackMessage }: AudioPlayerProps) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('0:00');
  const [durationFormatted, setDurationFormatted] = useState('0:00');

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const stopPlayback = useCallback(() => {
    const a = ref.current;
    if (a) {
      a.pause();
    }
    setPlaying(false);
    duckMusic(false);
    if (activeVoiceInstance === stopPlayback) {
      activeVoiceInstance = null;
    }
  }, []);

  useEffect(() => {
    const a = new Audio(src);
    ref.current = a;
    setPlaying(false);
    setMissing(false);
    setProgress(0);
    setCurrentTimeFormatted('0:00');
    setDurationFormatted('0:00');

    const onError = () => {
      setMissing(true);
      setPlaying(false);
      duckMusic(false);
    };

    const onTimeUpdate = () => {
      if (a.duration && isFinite(a.duration) && a.duration > 0) {
        setProgress(a.currentTime / a.duration);
        setCurrentTimeFormatted(formatSeconds(a.currentTime));
      }
    };

    const onLoadedMetadata = () => {
      if (a.duration && isFinite(a.duration)) {
        setDurationFormatted(formatSeconds(a.duration));
      }
    };

    const onEnded = () => {
      setPlaying(false);
      duckMusic(false);
      if (activeVoiceInstance === stopPlayback) {
        activeVoiceInstance = null;
      }
    };

    a.addEventListener('error', onError);
    a.addEventListener('timeupdate', onTimeUpdate);
    a.addEventListener('loadedmetadata', onLoadedMetadata);
    a.addEventListener('ended', onEnded);

    return () => {
      a.removeEventListener('error', onError);
      a.removeEventListener('timeupdate', onTimeUpdate);
      a.removeEventListener('loadedmetadata', onLoadedMetadata);
      a.removeEventListener('ended', onEnded);
      a.pause();
      a.src = '';
      duckMusic(false);
      if (activeVoiceInstance === stopPlayback) {
        activeVoiceInstance = null;
      }
    };
  }, [src, stopPlayback]);

  const toggle = () => {
    const a = ref.current;
    if (!a || missing) return;

    if (a.paused) {
      // S'il y a déjà une autre voix en train de jouer, on l'interrompt
      if (activeVoiceInstance && activeVoiceInstance !== stopPlayback) {
        activeVoiceInstance();
      }

      a.play()
        .then(() => {
          setPlaying(true);
          duckMusic(true);
          activeVoiceInstance = stopPlayback;
        })
        .catch(() => {
          setMissing(true);
          duckMusic(false);
        });
    } else {
      stopPlayback();
    }
  };

  const restart = () => {
    const a = ref.current;
    if (!a || missing) return;

    if (activeVoiceInstance && activeVoiceInstance !== stopPlayback) {
      activeVoiceInstance();
    }

    a.currentTime = 0;
    a.play()
      .then(() => {
        setPlaying(true);
        duckMusic(true);
        activeVoiceInstance = stopPlayback;
      })
      .catch(() => {
        setMissing(true);
        duckMusic(false);
      });
  };

  if (missing) {
    return (
      <div className="audio-missing-box">
        <span className="audio-missing-icon">🎙️</span>
        <p className="audio-missing-text">
          {fallbackMessage ||
            'L’enregistrement vocal de Dylan n’a pas encore été déposé pour cet écrit. Tu peux lire le texte avec tout ton cœur en attendant ! ❤️'}
        </p>
      </div>
    );
  }

  return (
    <div className="audio-player-container">
      <div className="audio-player-controls">
        <button
          className="audio-play-btn"
          onClick={toggle}
          aria-label={playing ? 'Mettre en pause la lecture vocale' : 'Écouter la voix de Dylan'}
        >
          {playing ? '⏸ Mettre en pause' : '▶ Écouter la voix de Dylan'}
        </button>
        <button
          className="audio-restart-btn"
          onClick={restart}
          aria-label="Réécouter depuis le début"
        >
          ↺ Réécouter
        </button>
      </div>

      <div className="audio-timeline-wrap">
        <span className="audio-time">{currentTimeFormatted}</span>
        <div className="audio-bar" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="audio-time">{durationFormatted}</span>
      </div>
    </div>
  );
}
