import { useState } from 'react';
import {
  CHAPTER_5_GATES,
  CHAPTER_5_DIALOGUES,
  GateInfo,
} from '../../lovegame/content/chapter5';
import AudioPlayer from '../AudioPlayer';
import { asset } from '../../lovegame/assets';

interface Chapter5ClearingProps {
  onComplete: () => void;
  onBackToMenu?: () => void;
}

export default function Chapter5Clearing({
  onComplete,
  onBackToMenu,
}: Chapter5ClearingProps) {
  // Mode : 'gates' (les 3 portes) -> 'clearing' (dialogues avec Dylan)
  const [mode, setMode] = useState<'gates' | 'clearing'>('gates');
  const [openedGates, setOpenedGates] = useState<Record<string, boolean>>({
    'gate-1': false,
    'gate-2': false,
    'gate-3': false,
  });
  const [activeMemory, setActiveMemory] = useState<GateInfo | null>(null);

  // Index de réplique dans la clairière (0 à 4)
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const handleOpenGate = (gate: GateInfo) => {
    setOpenedGates((prev) => ({ ...prev, [gate.id]: true }));
    setActiveMemory(gate);
  };

  const allGatesOpened = Object.values(openedGates).every(Boolean);

  const handleNextDialogue = () => {
    if (dialogueIndex < CHAPTER_5_DIALOGUES.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const currentDialogue = CHAPTER_5_DIALOGUES[dialogueIndex];

  return (
    <div className="chapter5-screen">
      {/* ========================================================= */}
      {/* VUE 1 : LES TROIS PORTES DU DESTIN */}
      {/* ========================================================= */}
      {mode === 'gates' && (
        <div className="chapter5-gates-view">
          <div className="chapter5-header">
            <span className="chapter-tag">Chapitre 5 — Retrouver son Amoureux</span>
            <h2>Le Sanctuaire des Trois Portes</h2>
            <p className="chapter5-intro-p">
              Chaque étape de votre histoire a forgé une clé. Touche chaque porte pour libérer les
              souvenirs et ouvrir le chemin vers Dylan.
            </p>
          </div>

          <div className="gates-container">
            {CHAPTER_5_GATES.map((gate) => {
              const isOpened = openedGates[gate.id];
              return (
                <div
                  key={gate.id}
                  className={`gate-card ${isOpened ? 'opened' : 'sealed'}`}
                  onClick={() => !isOpened && handleOpenGate(gate)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="gate-arch">
                    <span className="gate-icon">{gate.icon}</span>
                    <div className="gate-doors-visual">
                      <div className="gate-leaf left" />
                      <div className="gate-leaf right" />
                    </div>
                  </div>
                  <div className="gate-info">
                    <span className="gate-num">Porte {gate.number}</span>
                    <h3 className="gate-title">{gate.title}</h3>
                    <span className="gate-req">
                      {isOpened ? '✨ Porte déverrouillée' : `Clé : ${gate.requiredItem}`}
                    </span>
                  </div>
                  {!isOpened && (
                    <button
                      type="button"
                      className="gate-unlock-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenGate(gate);
                      }}
                    >
                      Ouvrir avec notre souvenir ✨
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal / Bulle du Flashback lors de l'ouverture d'une porte */}
          {activeMemory && (
            <div className="gate-memory-overlay" onClick={() => setActiveMemory(null)}>
              <div
                className="gate-memory-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="memory-icon-wrap">{activeMemory.icon}</div>
                <h3>{activeMemory.memoryTitle}</h3>
                <p>{activeMemory.memoryText}</p>
                <button
                  type="button"
                  className="primary"
                  onClick={() => setActiveMemory(null)}
                >
                  Continuer vers la clairière ✨
                </button>
              </div>
            </div>
          )}

          {/* Bouton pour avancer vers la clairière une fois les 3 portes ouvertes */}
          {allGatesOpened && (
            <div className="luminous-path-banner">
              <div className="luminous-path-effect">
                <span>✨ 🌟 Un chemin de lumière dorée s’ouvre à travers les arbres… 🌟 ✨</span>
              </div>
              <button
                type="button"
                className="proceed-clearing-btn"
                onClick={() => setMode('clearing')}
              >
                Rejoindre Dylan dans la clairière ❤
              </button>
            </div>
          )}

          {onBackToMenu && (
            <div className="chapter5-footer">
              <button className="secondary" onClick={onBackToMenu}>
                ← Menu principal
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* VUE 2 : LA CLAIRIÈRE DES RETROUVAILLES & DIALOGUES */}
      {/* ========================================================= */}
      {mode === 'clearing' && (
        <div className="chapter5-clearing-view">
          <div className="clearing-scene-decor">
            {/* Héroïne et Dylan réunis */}
            <div className="actors-stage">
              <div className="actor hero-actor">
                <img
                  src={asset('characters/hero/read_0.png')}
                  alt="Dylan"
                  className="actor-img"
                />
                <span className="actor-nametag">Dylan</span>
              </div>
            </div>

            {/* Lucioles flottantes */}
            <div className="clearing-fireflies" aria-hidden="true">
              <span className="firefly f1">✨</span>
              <span className="firefly f2">🌟</span>
              <span className="firefly f3">✨</span>
              <span className="firefly f4">⭐</span>
            </div>
          </div>

          {/* Dialogue Box avec lecteur audio dédié par réplique */}
          <div className="clearing-dialogue-card">
            <div className="dialogue-card-head">
              <span className="speaker-badge">❤️ {currentDialogue.speaker}</span>
              <span className="dialogue-counter">
                Réplique {dialogueIndex + 1} / {CHAPTER_5_DIALOGUES.length}
              </span>
            </div>

            <div className="dialogue-text-content">
              <p className="dialogue-quote">« {currentDialogue.text} »</p>
            </div>

            {/* Lecteur audio individuel pour chaque réplique de Dylan */}
            <div className="dialogue-audio-wrap">
              <AudioPlayer
                key={currentDialogue.id}
                src={currentDialogue.audio}
                fallbackMessage={`L’enregistrement audio de Dylan pour cette réplique n’a pas encore été déposé. Tu peux lire ses mots avec tout ton cœur ! ❤️`}
              />
            </div>

            <div className="dialogue-card-actions">
              <button
                type="button"
                className="dialogue-next-btn primary"
                onClick={handleNextDialogue}
              >
                {dialogueIndex < CHAPTER_5_DIALOGUES.length - 1
                  ? 'Écouter la suite ➔'
                  : 'Découvrir la promesse finale ❤️'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
