import { useState } from 'react';
import { PUZZLES, PuzzleDefinition } from '../../lovegame/content/puzzles';
import { progressionStore, useProgression } from '../../lovegame/state/ProgressionStore';
import { bus } from '../../lovegame/bus';
import MultipleChoicePuzzle from './MultipleChoicePuzzle';
import ChronologyPuzzle from './ChronologyPuzzle';
import SequencePuzzle from './SequencePuzzle';
import WordAssemblyPuzzle from './WordAssemblyPuzzle';

interface PuzzleModalProps {
  puzzleId: string;
  onClose: () => void;
}

export default function PuzzleModal({ puzzleId, onClose }: PuzzleModalProps) {
  const puzzle: PuzzleDefinition | undefined = PUZZLES[puzzleId];
  const progression = useProgression();
  const alreadySolved = progression.solvedPuzzles.includes(puzzleId);

  const [solved, setSolved] = useState<boolean>(alreadySolved);
  const [hintIndex, setHintIndex] = useState<number>(0);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);

  if (!puzzle) {
    return null;
  }

  const handleSuccess = () => {
    const isNew = progressionStore.solvePuzzle(puzzle.id);
    if (puzzle.fragmentReward) {
      progressionStore.collectFragment(puzzle.fragmentReward);
    }
    if (isNew && puzzle.actionOnSuccess) {
      progressionStore.setMissionStatus(puzzle.actionOnSuccess, 'completed');
    }
    setSolved(true);
    setActiveReaction(null);
    bus.emit('puzzle-solved', { puzzleId: puzzle.id, newlySolved: isNew });
  };

  const handleError = (feedback?: string) => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (feedback) {
      setActiveReaction(feedback);
    } else if (puzzle.errorReactions && puzzle.errorReactions.length > 0) {
      const reaction = puzzle.errorReactions[(nextAttempts - 1) % puzzle.errorReactions.length];
      setActiveReaction(reaction);
    } else {
      setActiveReaction('Oups ! Essaie encore, tu as tout le temps.');
    }
  };

  const handleAttempt = (isCorrect: boolean, feedback?: string) => {
    if (isCorrect) {
      handleSuccess();
    } else {
      handleError(feedback);
    }
  };

  const handleShowNextHint = () => {
    if (hintIndex < puzzle.hints.length) {
      setHintIndex((prev) => prev + 1);
    }
  };

  const handleClose = () => {
    bus.emit('puzzle-closed', puzzle.id);
    onClose();
  };

  return (
    <div className="puzzle-overlay" role="dialog" aria-modal="true">
      <div className="puzzle-modal">
        {/* En-tête */}
        <div className="puzzle-header">
          <div className="puzzle-title-wrap">
            <span className="puzzle-badge">Énigme</span>
            <h2>{puzzle.title}</h2>
          </div>
          <button
            className="puzzle-close-btn"
            onClick={handleClose}
            aria-label="Fermer l'énigme"
          >
            ✕
          </button>
        </div>

        {/* Consigne */}
        <p className="puzzle-instruction">{puzzle.instruction}</p>

        {/* Corps de l'énigme */}
        <div className="puzzle-body">
          {puzzle.type === 'choice' && (
            <MultipleChoicePuzzle
              puzzle={puzzle}
              onAttempt={handleAttempt}
              isCompleted={solved}
            />
          )}

          {puzzle.type === 'chronology' && (
            <ChronologyPuzzle
              puzzle={puzzle}
              onAttempt={handleAttempt}
              isCompleted={solved}
            />
          )}

          {puzzle.type === 'sequence' && (
            <SequencePuzzle
              puzzle={puzzle}
              onAttempt={handleAttempt}
              isCompleted={solved}
            />
          )}

          {puzzle.type === 'word_assembly' && (
            <WordAssemblyPuzzle
              puzzle={puzzle}
              onAttempt={handleAttempt}
              isCompleted={solved}
            />
          )}
        </div>

        {/* Réaction humoristique en cas d'erreur */}
        {activeReaction && !solved && (
          <div className="puzzle-reaction-box" role="alert">
            <span className="puzzle-reaction-avatar">👼</span>
            <div className="puzzle-reaction-text">{activeReaction}</div>
          </div>
        )}

        {/* Zone des indices progressifs */}
        {puzzle.hints.length > 0 && !solved && (
          <div className="puzzle-hints-section">
            {hintIndex === 0 ? (
              <button
                type="button"
                className="puzzle-hint-toggle"
                onClick={handleShowNextHint}
              >
                💡 Besoin d’un indice ? ({puzzle.hints.length} disponible{puzzle.hints.length > 1 ? 's' : ''})
              </button>
            ) : (
              <div className="puzzle-hints-list">
                {puzzle.hints.slice(0, hintIndex).map((hint, idx) => (
                  <div key={idx} className="puzzle-hint-item">
                    <span className="puzzle-hint-number">Indice {idx + 1} :</span> {hint}
                  </div>
                ))}
                {hintIndex < puzzle.hints.length && (
                  <button
                    type="button"
                    className="puzzle-hint-more"
                    onClick={handleShowNextHint}
                  >
                    💡 Un autre indice ?
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bannière de Réussite & Récompense */}
        {solved && (
          <div className="puzzle-success-banner">
            <div className="puzzle-success-icon">✨ 🎉 ✨</div>
            <h3>Énigme résolue !</h3>
            <p className="puzzle-success-message">{puzzle.successMessage}</p>
            {puzzle.rewardDescription && (
              <div className="puzzle-reward">
                <span className="puzzle-reward-tag">Récompense :</span>{' '}
                <strong>{puzzle.rewardDescription}</strong>
                {alreadySolved && (
                  <span className="puzzle-reward-recorded"> (déjà enregistrée dans tes souvenirs)</span>
                )}
              </div>
            )}
            <button className="puzzle-continue-btn" onClick={handleClose}>
              Continuer l’aventure ❤
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
