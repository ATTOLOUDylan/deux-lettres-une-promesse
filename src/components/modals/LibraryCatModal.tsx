import { useState } from 'react';
import { LIBRARY_CAT_DATA } from '../../lovegame/content/collectibles';
import { bus } from '../../lovegame/bus';

interface LibraryCatModalProps {
  onClose: () => void;
}

export default function LibraryCatModal({ onClose }: LibraryCatModalProps) {
  const [currentSpeech, setCurrentSpeech] = useState<string>(LIBRARY_CAT_DATA.officialQuote);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAskClue = () => {
    setCurrentSpeech(LIBRARY_CAT_DATA.hints.general);
    setActionNotice('Le chat étire ses moustaches et te souffle un conseil précieux.');
  };

  const handleAskSecrets = () => {
    setCurrentSpeech(LIBRARY_CAT_DATA.hints.secrets);
    setActionNotice('Le chat remue la queue en direction des recoins scintillants.');
  };

  const handlePet = () => {
    setCurrentSpeech(LIBRARY_CAT_DATA.hints.purr);
    setActionNotice('✨ *Ronronnements chaleureux* — Tu as gagné la bénédiction du chat de la bibliothèque !');
    bus.emit('toast', '🐾 Ronrrr... Le chat de la bibliothèque ronronne de bonheur !');
  };

  return (
    <div className="cat-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cat-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="cat-modal-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>

        <div className="cat-header">
          <div className="cat-avatar-wrap">
            <span className="cat-avatar">{LIBRARY_CAT_DATA.avatar}</span>
            <span className="cat-glow-ring" />
          </div>
          <div className="cat-meta">
            <h3>{LIBRARY_CAT_DATA.name}</h3>
            <span className="cat-subtitle">{LIBRARY_CAT_DATA.title}</span>
          </div>
        </div>

        <div className="cat-dialogue-bubble">
          <p className="cat-speech-text">{currentSpeech}</p>
          {actionNotice && <p className="cat-notice-text">{actionNotice}</p>}
        </div>

        <div className="cat-actions-row">
          <button
            type="button"
            className="cat-action-btn secondary"
            onClick={handleAskClue}
          >
            🔍 Demander un indice
          </button>
          <button
            type="button"
            className="cat-action-btn secondary"
            onClick={handleAskSecrets}
          >
            ✨ Cœurs & Souvenirs cachés
          </button>
          <button
            type="button"
            className="cat-action-btn primary"
            onClick={handlePet}
          >
            🐾 Caresser le chat ❤️
          </button>
        </div>

        <div className="cat-footer-note">
          <span>* Activité et indices facultatifs — Le chat ne te laissera jamais bloquée ! *</span>
        </div>
      </div>
    </div>
  );
}
