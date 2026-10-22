import { useState } from 'react';
import { EPILOGUE_DATA } from '../../lovegame/content/chapter5';
import LetterModal from '../LetterModal';

interface EpiloguePromiseProps {
  onComplete: () => void;
  onBackToMenu?: () => void;
}

export default function EpiloguePromise({
  onComplete,
}: EpiloguePromiseProps) {
  // État : 'envelope' -> 'letter_open' -> 'proposal' -> 'celebration' | 'cupidon_comic'
  const [step, setStep] = useState<
    'envelope' | 'letter_open' | 'proposal' | 'celebration' | 'cupidon_comic'
  >('envelope');

  const handleOpenEnvelope = () => {
    setStep('letter_open');
  };

  const handleCloseLetter = () => {
    setStep('proposal');
  };

  const handleChooseYes = () => {
    setStep('celebration');
  };

  const handleChooseFunny = () => {
    setStep('cupidon_comic');
  };

  return (
    <div className="epilogue-screen">
      {/* ========================================================= */}
      {/* ÉTAPE 1 : L'ENVELOPPE « UNE DERNIÈRE CHOSE, MA POUPÉE... » */}
      {/* ========================================================= */}
      {step === 'envelope' && (
        <div className="epilogue-envelope-view">
          <div className="envelope-halo-light" />
          <div className="epilogue-envelope-box">
            <span className="epilogue-subtitle">Épilogue — La Promesse Finale</span>
            <h2 className="epilogue-main-title">{EPILOGUE_DATA.envelopeTitle}</h2>

            <div
              className="epilogue-interactive-envelope"
              onClick={handleOpenEnvelope}
              role="button"
              tabIndex={0}
            >
              <div className="envelope-paper-texture">
                <div className="envelope-fold" />
                <div className="wax-seal-heart">
                  <span>❤</span>
                </div>
              </div>
              <p className="envelope-prompt-text">{EPILOGUE_DATA.envelopeSubtitle}</p>
            </div>

            <button
              type="button"
              className="envelope-open-button primary"
              onClick={handleOpenEnvelope}
            >
              Ouvrir la promesse de Dylan ❤️
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ÉTAPE 2 : LA PROMESSE DANS LETTER MODAL (index 2) */}
      {/* ========================================================= */}
      {step === 'letter_open' && (
        <LetterModal
          index={2}
          onClose={handleCloseLetter}
        />
      )}

      {/* ========================================================= */}
      {/* ÉTAPE 3 : LE CHOIX FINAL DE DYLAN */}
      {/* ========================================================= */}
      {step === 'proposal' && (
        <div className="epilogue-proposal-view">
          <div className="proposal-card">
            <div className="proposal-decor">
              <span className="ring-icon">💍</span>
            </div>

            <h2 className="proposal-question">
              {EPILOGUE_DATA.finalProposal.question}
            </h2>

            <p className="proposal-context">
              Après toutes ces épreuves, ces rires, ces souvenirs et cette promesse sincère,
              la réponse t’appartient entièrement.
            </p>

            <div className="proposal-options">
              <button
                type="button"
                className="proposal-btn yes-btn"
                onClick={handleChooseYes}
              >
                {EPILOGUE_DATA.finalProposal.choiceYes}
              </button>

              <button
                type="button"
                className="proposal-btn funny-btn"
                onClick={handleChooseFunny}
              >
                {EPILOGUE_DATA.finalProposal.choiceFunny}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* RÉPONSE A : CÉLÉBRATION ROMANTIQUE */}
      {/* ========================================================= */}
      {step === 'celebration' && (
        <div className="epilogue-celebration-view">
          <div className="celebration-card">
            <div className="celebration-fireworks">
              <span>🎆</span>
              <span>❤️</span>
              <span>✨</span>
              <span>💍</span>
              <span>🌟</span>
            </div>

            <h2>Notre plus beau chapitre commence…</h2>

            <div className="celebration-speech-bubble">
              <span className="speech-avatar">🤵❤️</span>
              <p>{EPILOGUE_DATA.finalProposal.dylanYesAnswer}</p>
            </div>

            <button
              type="button"
              className="primary finish-adventure-btn"
              onClick={onComplete}
            >
              Découvrir notre Journal d’Amour & Écran Final 🌟
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* RÉPONSE B : ANIMATION COMIQUE DE CUPIDON (SANS CULPABILITÉ) */}
      {/* ========================================================= */}
      {step === 'cupidon_comic' && (
        <div className="epilogue-cupidon-view">
          <div className="cupidon-comic-card">
            <div className="cupidon-comic-avatar">👼💦</div>
            <h3 className="cupidon-exclamation">Une pause s’il vous plaît ! 😂</h3>

            <div className="cupidon-quote-box">
              <p>
                « Pardon ?! Après toutes ces énigmes, ces sauts de plateformes et ces constellations ?
                Même moi, Cupidon le stagiaire, je demande une pause syndicale ! 😂 »
              </p>
              <p className="cupidon-subnote">
                (Il s’essuie le front avec son aile)
                <br />
                « Bon d’accord, Dylan continuera à travailler dur pour vous deux et pour votre futur foyer…
                mais laisse-lui au moins reprendre son souffle ! 🤣❤️ »
              </p>
            </div>

            <div className="cupidon-actions">
              <button
                type="button"
                className="primary"
                onClick={handleChooseYes}
              >
                Bon d’accord, je dis oui quand même ! ❤️
              </button>
              <button
                type="button"
                className="secondary"
                onClick={onComplete}
              >
                Accéder directement au Journal d’Amour 📖
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
