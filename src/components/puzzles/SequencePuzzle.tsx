import { useState, useEffect, useRef } from 'react';
import { SequenceItem, SequencePuzzleDefinition } from '../../lovegame/content/puzzles';

interface SequencePuzzleProps {
  puzzle: SequencePuzzleDefinition;
  onAttempt: (isCorrect: boolean, feedback?: string) => void;
  isCompleted: boolean;
}

export default function SequencePuzzle({
  puzzle,
  onAttempt,
  isCompleted,
}: SequencePuzzleProps) {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const timeoutRefs = useRef<number[]>([]);

  const clearTimers = () => {
    timeoutRefs.current.forEach((t) => window.clearTimeout(t));
    timeoutRefs.current = [];
  };

  const playSequence = () => {
    if (isCompleted || isPlayingDemo) return;
    clearTimers();
    setIsPlayingDemo(true);
    setPlayerInput([]);
    setActiveItemIndex(null);

    puzzle.sequence.forEach((itemId, step) => {
      const itemIdx = puzzle.items.findIndex((it) => it.id === itemId);
      const onTime = (step + 1) * 750;
      const offTime = onTime + 450;

      const t1 = window.setTimeout(() => {
        setActiveItemIndex(itemIdx);
      }, onTime);

      const t2 = window.setTimeout(() => {
        setActiveItemIndex(null);
        if (step === puzzle.sequence.length - 1) {
          setIsPlayingDemo(false);
        }
      }, offTime);

      timeoutRefs.current.push(t1, t2);
    });
  };

  useEffect(() => {
    // Joue la séquence une première fois à l'affichage
    const startTimer = window.setTimeout(() => {
      playSequence();
    }, 400);
    return () => {
      window.clearTimeout(startTimer);
      clearTimers();
    };
  }, []);

  const handleItemClick = (item: SequenceItem) => {
    if (isCompleted || isPlayingDemo) return;

    // Flash visuel sur le bouton cliqué
    const itemIdx = puzzle.items.findIndex((it) => it.id === item.id);
    setActiveItemIndex(itemIdx);
    window.setTimeout(() => setActiveItemIndex(null), 250);

    const nextInput = [...playerInput, item.id];
    setPlayerInput(nextInput);

    // Vérification du pas actuel
    const currentStep = nextInput.length - 1;
    if (item.id !== puzzle.sequence[currentStep]) {
      // Erreur immédiate
      onAttempt(false, 'Mauvaise lanterne touchée ! Observe bien la séquence.');
      setPlayerInput([]);
      return;
    }

    // Si toute la séquence est correctement complétée
    if (nextInput.length === puzzle.sequence.length) {
      onAttempt(true);
    }
  };

  return (
    <div className="puzzle-sequence-wrap">
      <div className="sequence-status-banner">
        <span>
          {isPlayingDemo
            ? 'Observe bien la séquence lumineuse…'
            : isCompleted
            ? 'Séquence validée ! ✨'
            : `Répète la séquence (${playerInput.length} / ${puzzle.sequence.length}) :`}
        </span>
      </div>

      <div className="sequence-items-row">
        {puzzle.items.map((item, idx) => {
          const isGlowing = activeItemIndex === idx;
          return (
            <button
              key={item.id}
              className={`sequence-item-btn ${isGlowing ? 'glow' : ''}`}
              style={{
                borderColor: item.color,
                boxShadow: isGlowing ? `0 0 25px ${item.color}` : 'none',
              }}
              disabled={isPlayingDemo || isCompleted}
              onClick={() => handleItemClick(item)}
            >
              <span className="sequence-icon">{item.icon || '🏮'}</span>
              <span className="sequence-name" style={{ color: item.color }}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="sequence-actions">
        {!isCompleted && (
          <button className="secondary" disabled={isPlayingDemo} onClick={playSequence}>
            ↺ Revoir la séquence
          </button>
        )}
      </div>
    </div>
  );
}
