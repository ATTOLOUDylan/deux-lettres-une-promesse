import { useState } from 'react';
import { WordAssemblyPuzzleDefinition } from '../../lovegame/content/puzzles';

interface WordAssemblyPuzzleProps {
  puzzle: WordAssemblyPuzzleDefinition;
  onAttempt: (isCorrect: boolean, feedback?: string) => void;
  isCompleted: boolean;
}

export default function WordAssemblyPuzzle({
  puzzle,
  onAttempt,
  isCompleted,
}: WordAssemblyPuzzleProps) {
  // Mélange initial des mots
  const [availableWords, setAvailableWords] = useState<string[]>(() => {
    return [...puzzle.targetWords].sort(() => Math.random() - 0.5);
  });
  const [placedWords, setPlacedWords] = useState<string[]>([]);

  const handlePickWord = (word: string, indexInAvailable: number) => {
    if (isCompleted) return;
    const nextAvailable = [...availableWords];
    nextAvailable.splice(indexInAvailable, 1);
    const nextPlaced = [...placedWords, word];

    setAvailableWords(nextAvailable);
    setPlacedWords(nextPlaced);

    // Si tous les mots sont placés, vérification automatique
    if (nextPlaced.length === puzzle.targetWords.length) {
      const isMatch = nextPlaced.every((w, i) => w === puzzle.targetWords[i]);
      onAttempt(isMatch);
    }
  };

  const handleRemoveWord = (word: string, indexInPlaced: number) => {
    if (isCompleted) return;
    const nextPlaced = [...placedWords];
    nextPlaced.splice(indexInPlaced, 1);
    const nextAvailable = [...availableWords, word];

    setPlacedWords(nextPlaced);
    setAvailableWords(nextAvailable);
  };

  const handleResetWords = () => {
    if (isCompleted) return;
    setPlacedWords([]);
    setAvailableWords([...puzzle.targetWords].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="puzzle-words-wrap">
      <div className="words-instruction">
        <span>Touche les mots pour composer la phrase :</span>
      </div>

      <div className="words-assembled-tray">
        {placedWords.length === 0 ? (
          <span className="words-placeholder">Ta phrase apparaîtra ici…</span>
        ) : (
          placedWords.map((word, idx) => (
            <button
              key={`placed-${idx}`}
              className="word-chip placed"
              disabled={isCompleted}
              onClick={() => handleRemoveWord(word, idx)}
            >
              {word}
            </button>
          ))
        )}
      </div>

      <div className="words-available-tray">
        {availableWords.map((word, idx) => (
          <button
            key={`avail-${idx}`}
            className="word-chip available"
            disabled={isCompleted}
            onClick={() => handlePickWord(word, idx)}
          >
            {word}
          </button>
        ))}
      </div>

      {!isCompleted && placedWords.length > 0 && (
        <div className="words-actions">
          <button className="secondary" onClick={handleResetWords}>
            ↺ Réinitialiser la phrase
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="constellation-container">
          <div className="constellation-sky">
            <svg className="constellation-svg" viewBox="0 0 600 180">
              <defs>
                <linearGradient id="starLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffd97a" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#fff6d6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ffd97a" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <polyline
                points="40,110 135,50 230,120 330,45 435,100 540,75"
                className="constellation-line"
              />
              {[
                { x: 40, y: 110, word: 'TU' },
                { x: 135, y: 50, word: 'ES' },
                { x: 230, y: 120, word: 'MON' },
                { x: 330, y: 45, word: 'PLUS' },
                { x: 435, y: 100, word: 'BEAU' },
                { x: 540, y: 75, word: 'HASARD' },
              ].map((star, i) => (
                <g key={i} className="constellation-node" style={{ animationDelay: `${i * 0.18}s` }}>
                  <circle cx={star.x} cy={star.y} r="10" className="constellation-glow-circle" />
                  <circle cx={star.x} cy={star.y} r="4" className="constellation-core-circle" />
                  <text x={star.x} y={star.y - 14} textAnchor="middle" className="constellation-star-text">
                    {star.word}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="constellation-phrase-title">
            ✨ « TU ES MON PLUS BEAU HASARD » ✨
          </div>

          <div className="constellation-cupidon-quote">
            <span className="cupidon-quote-avatar">👼</span>
            <div className="cupidon-quote-text">
              <strong>Cupidon l’apprenti :</strong>
              <p>
                « Oh… c’est beau. Je vais pleurer. Attends, je suis un professionnel, je ne dois pas pleurer…
                Bon, d’accord, je pleure un tout petit peu. Mais c’est à cause de la poussière magique ! »
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
