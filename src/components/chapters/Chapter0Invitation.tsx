import { useState } from 'react';
import { CHAPTER_0_CONTENT, MapLocation } from '../../lovegame/content/chapter0';
import DialogueBox from '../DialogueBox';
import PuzzleModal from '../puzzles/PuzzleModal';
import { progressionStore } from '../../lovegame/state/ProgressionStore';

interface Chapter0InvitationProps {
  onComplete: () => void;
  onBackToTitle?: () => void;
}

type Step = 'envelope' | 'letter' | 'cupidon' | 'map' | 'puzzle' | 'completed';

export default function Chapter0Invitation({ onComplete, onBackToTitle }: Chapter0InvitationProps) {
  const [step, setStep] = useState<Step>('envelope');
  const [envelopeOpening, setEnvelopeOpening] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation>(CHAPTER_0_CONTENT.mapLocations[0]);

  const handleOpenEnvelope = () => {
    if (envelopeOpening) return;
    setEnvelopeOpening(true);
    // Animation de rupture du sceau et déploiement du papier
    window.setTimeout(() => {
      setStep('letter');
      setEnvelopeOpening(false);
    }, 700);
  };

  const handleFinishLetter = () => {
    setStep('cupidon');
  };

  const handleDialogueClose = () => {
    // Une fois le dialogue de Cupidon terminé, on affiche la carte
    setStep('map');
  };

  const handleOpenPuzzle = () => {
    setStep('puzzle');
  };

  const handlePuzzleClose = () => {
    // Si l'énigme a été résolue, on passe à la complétion
    if (progressionStore.isPuzzleSolved(CHAPTER_0_CONTENT.puzzleId)) {
      setStep('completed');
    } else {
      // Sinon on revient sur la carte
      setStep('map');
    }
  };

  const handleFinalTransition = () => {
    progressionStore.completeChapter('chapitre-0', 'chapitre-1');
    onComplete();
  };

  return (
    <div className="chapter0-container" role="main">
      {/* ÉTAPE 1 : Enveloppe Scellée */}
      {step === 'envelope' && (
        <div className="chapter0-stage">
          <div className="chapter0-header-badge">
            <span>{CHAPTER_0_CONTENT.title}</span>
          </div>

          <div
            className={`sealed-envelope ${envelopeOpening ? 'opening' : ''}`}
            onClick={handleOpenEnvelope}
            role="button"
            tabIndex={0}
            aria-label="Ouvrir l'enveloppe scellée"
          >
            <div className="envelope-back" />
            <div className="envelope-paper-peek" />
            <div className="envelope-flap" />
            <div className="envelope-front" />
            <div className="envelope-seal">
              <span className="seal-heart">{CHAPTER_0_CONTENT.envelope.sealText}</span>
            </div>
            <div className="envelope-glow" />
          </div>

          <p className="envelope-prompt">
            {CHAPTER_0_CONTENT.envelope.openPrompt} ✨
          </p>

          {onBackToTitle && (
            <button className="chapter0-back-btn" onClick={onBackToTitle}>
              ← Retour au menu
            </button>
          )}
        </div>
      )}

      {/* ÉTAPE 2 : Lettre d'Invitation Personnelle */}
      {step === 'letter' && (
        <div className="chapter0-stage">
          <div className="invitation-letter-card">
            <div className="letter-header-banner">
              <h2>{CHAPTER_0_CONTENT.letter.header}</h2>
              <span className="letter-salutation">{CHAPTER_0_CONTENT.letter.salutation}</span>
            </div>

            <div className="letter-text-body">
              {CHAPTER_0_CONTENT.letter.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="letter-footer">
              <p className="letter-closing">{CHAPTER_0_CONTENT.letter.closing}</p>
              <button className="letter-continue-btn" onClick={handleFinishLetter}>
                {CHAPTER_0_CONTENT.letter.continueButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 : Dialogue d'apparition de Cupidon */}
      {step === 'cupidon' && (
        <div className="chapter0-stage">
          <div className="cupidon-scene-backdrop">
            <div className="cupidon-floating-figure" aria-hidden="true">
              <span className="cupidon-halo">✨</span>
              <span className="cupidon-emoji">👼</span>
              <span className="cupidon-bag">📜</span>
            </div>
          </div>
          <DialogueBox
            dialogueId="cupidon-ch0-intro-1"
            onClose={handleDialogueClose}
          />
        </div>
      )}

      {/* ÉTAPE 4 : Carte Féerique de l'Aventure */}
      {step === 'map' && (
        <div className="chapter0-stage">
          <div className="adventure-map-container">
            <div className="map-header">
              <span className="map-badge">Carte du Voyage</span>
              <h2>Notre Histoire d'Amour</h2>
              <p className="map-subtitle">
                Chaque lieu abrite un chapitre de vos souvenirs et de votre promesse
              </p>
            </div>

            {/* Grille des étapes de la carte */}
            <div className="map-locations-grid">
              {CHAPTER_0_CONTENT.mapLocations.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;

                return (
                  <div
                    key={loc.id}
                    className={`map-location-card ${isSelected ? 'selected' : ''} ${loc.status}`}
                    onClick={() => setSelectedLocation(loc)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="location-icon-wrap">
                      <span className="location-icon">{loc.icon}</span>
                      {loc.status === 'locked' && <span className="location-lock">🔒</span>}
                      {loc.status === 'accessible' && <span className="location-sparkle">✨</span>}
                    </div>
                    <div className="location-info">
                      <span className="location-subtitle">{loc.subtitle}</span>
                      <strong className="location-name">{loc.name}</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Détail du lieu sélectionné */}
            <div className="map-selected-detail">
              <div className="detail-head">
                <span className="detail-icon">{selectedLocation.icon}</span>
                <div>
                  <h3>{selectedLocation.name}</h3>
                  <span className="detail-sub">{selectedLocation.subtitle}</span>
                </div>
              </div>
              <p className="detail-desc">{selectedLocation.description}</p>
            </div>

            {/* Guide Cupidon & Déverrouillage */}
            <div className="map-guide-banner">
              <span className="guide-avatar">👼</span>
              <div className="guide-text">
                <strong>Cupidon :</strong> « Dylan a scellé le portail de l’Université avec un cadenas magique ! Résous le Code du Cœur pour ouvrir la route. »
              </div>
            </div>

            <div className="map-actions">
              <button className="map-unlock-btn" onClick={handleOpenPuzzle}>
                {progressionStore.isPuzzleSolved(CHAPTER_0_CONTENT.puzzleId)
                  ? 'Code du Cœur déjà résolu ✨ Passer au portail'
                  : 'Résoudre le Code du Cœur 🔐'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 5 : Énigme du Code du Cœur */}
      {step === 'puzzle' && (
        <PuzzleModal
          puzzleId={CHAPTER_0_CONTENT.puzzleId}
          onClose={handlePuzzleClose}
        />
      )}

      {/* ÉTAPE 6 : Complétion du Chapitre 0 & Transition */}
      {step === 'completed' && (
        <div className="chapter0-stage">
          <div className="chapter0-completion-card">
            <div className="completion-icon">✨ 🏛️ ✨</div>
            <h2>{CHAPTER_0_CONTENT.transition.congrats}</h2>
            <p className="completion-message">
              {CHAPTER_0_CONTENT.transition.message}
            </p>
            <div className="completion-reward-badge">
              <span>Portail de l’Université déverrouillé</span>
            </div>
            <button className="completion-start-btn" onClick={handleFinalTransition}>
              {CHAPTER_0_CONTENT.transition.buttonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
