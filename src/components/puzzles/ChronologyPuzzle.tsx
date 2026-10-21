import { useState } from 'react';
import { ChronologyItem, ChronologyPuzzleDefinition } from '../../lovegame/content/puzzles';

interface ChronologyPuzzleProps {
  puzzle: ChronologyPuzzleDefinition;
  onAttempt: (isCorrect: boolean, feedback?: string) => void;
  isCompleted: boolean;
}

export default function ChronologyPuzzle({
  puzzle,
  onAttempt,
  isCompleted,
}: ChronologyPuzzleProps) {
  // Mélange initial déterminé par la définition
  const [items, setItems] = useState<ChronologyItem[]>(() => {
    return [...puzzle.items].sort((a, b) => b.correctOrder - a.correctOrder);
  });
  const [firstSelectedIndex, setFirstSelectedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    if (isCompleted) return;

    if (firstSelectedIndex === null) {
      setFirstSelectedIndex(index);
    } else if (firstSelectedIndex === index) {
      // Annulation de la sélection
      setFirstSelectedIndex(null);
    } else {
      // Échange des deux cartes
      const newItems = [...items];
      const temp = newItems[firstSelectedIndex];
      newItems[firstSelectedIndex] = newItems[index];
      newItems[index] = temp;
      setItems(newItems);
      setFirstSelectedIndex(null);

      // Vérification immédiate
      const isOrdered = newItems.every((it, idx) => it.correctOrder === idx);
      if (isOrdered) {
        onAttempt(true);
      }
    }
  };

  const handleValidateManual = () => {
    if (isCompleted) return;
    const isOrdered = items.every((it, idx) => it.correctOrder === idx);
    onAttempt(isOrdered);
  };

  return (
    <div className="puzzle-chronology-wrap">
      <div className="chronology-hint-banner">
        <span>Toucher une carte puis une autre pour les échanger :</span>
      </div>
      <div className="chronology-cards-list">
        {items.map((item, idx) => {
          const isSelected = firstSelectedIndex === idx;
          const isCorrectPosition = isCompleted && item.correctOrder === idx;
          return (
            <div
              key={item.id}
              className={`chronology-card ${isSelected ? 'selected' : ''} ${isCorrectPosition ? 'correct' : ''}`}
              onClick={() => handleCardClick(idx)}
            >
              <div className="chronology-card-badge">{idx + 1}</div>
              <div className="chronology-card-body">
                <h4>{item.title}</h4>
                {item.description && <p>{item.description}</p>}
              </div>
              <div className="chronology-swap-icon">{isSelected ? '✓ Sélectionné' : '⇄ Échanger'}</div>
            </div>
          );
        })}
      </div>
      {!isCompleted && (
        <button className="primary puzzle-validate-btn" onClick={handleValidateManual}>
          Vérifier l’ordre
        </button>
      )}
    </div>
  );
}
