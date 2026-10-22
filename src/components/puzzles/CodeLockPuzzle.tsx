import { useState } from 'react';
import { CodeLockPuzzleDefinition } from '../../lovegame/content/puzzles';

interface CodeLockPuzzleProps {
  puzzle: CodeLockPuzzleDefinition;
  onAttempt: (isCorrect: boolean, feedback?: string) => void;
  isCompleted: boolean;
}

// Un cadenas à rouages : chaque rouage cache un chiffre à déduire d'une devinette.
export default function CodeLockPuzzle({
  puzzle,
  onAttempt,
  isCompleted,
}: CodeLockPuzzleProps) {
  // Chaque rouage démarre sur 0 (aucun chiffre de la solution n'est révélé d'avance)
  const [digits, setDigits] = useState<number[]>(puzzle.dials.map(() => 0));

  const turnDial = (index: number, delta: number) => {
    if (isCompleted) return;
    setDigits((prev) =>
      prev.map((value, i) => (i === index ? (value + delta + 10) % 10 : value)),
    );
  };

  const handleValidate = () => {
    if (isCompleted) return;
    const attempt = digits.join('');
    onAttempt(attempt === puzzle.answer);
  };

  return (
    <div className="codelock-puzzle">
      <div className="codelock-heart" aria-hidden>
        <span className="codelock-heart-icon">❤</span>
        <span className="codelock-shackle" />
      </div>

      <div className="codelock-dials">
        {puzzle.dials.map((dial, index) => (
          <div key={dial.id} className="codelock-dial-col">
            <p className="codelock-dial-label">{dial.label}</p>
            <p className="codelock-dial-riddle">{dial.riddle}</p>

            <div className="codelock-dial">
              <button
                type="button"
                className="codelock-arrow"
                onClick={() => turnDial(index, 1)}
                disabled={isCompleted}
                aria-label="Augmenter le chiffre"
              >
                ▲
              </button>
              <div
                className={`codelock-digit ${isCompleted ? 'codelock-digit-open' : ''}`}
                aria-live="polite"
              >
                {digits[index]}
              </div>
              <button
                type="button"
                className="codelock-arrow"
                onClick={() => turnDial(index, -1)}
                disabled={isCompleted}
                aria-label="Diminuer le chiffre"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="codelock-validate"
        onClick={handleValidate}
        disabled={isCompleted}
      >
        {isCompleted ? 'Cœur ouvert ✨' : 'Ouvrir mon cœur 💛'}
      </button>
    </div>
  );
}
