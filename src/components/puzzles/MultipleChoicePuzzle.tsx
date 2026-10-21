import { useState } from 'react';
import { ChoiceOption, ChoicePuzzleDefinition } from '../../lovegame/content/puzzles';

interface MultipleChoicePuzzleProps {
  puzzle: ChoicePuzzleDefinition;
  onAttempt: (isCorrect: boolean, feedback?: string) => void;
  isCompleted: boolean;
}

export default function MultipleChoicePuzzle({
  puzzle,
  onAttempt,
  isCompleted,
}: MultipleChoicePuzzleProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (opt: ChoiceOption) => {
    if (isCompleted) return;
    setSelectedId(opt.id);
    onAttempt(opt.isCorrect, opt.feedback);
  };

  return (
    <div className="puzzle-choice-wrap">
      <div className="puzzle-question">
        <p>{puzzle.question}</p>
      </div>
      <div className="puzzle-choice-options">
        {puzzle.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          let btnClass = 'puzzle-option-btn';
          if (isSelected) {
            btnClass += opt.isCorrect ? ' correct' : ' incorrect';
          }
          if (isCompleted && opt.isCorrect) {
            btnClass += ' correct';
          }
          return (
            <button
              key={opt.id}
              className={btnClass}
              disabled={isCompleted}
              onClick={() => handleSelect(opt)}
            >
              <span className="choice-indicator">❤</span>
              <span className="choice-text">{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
