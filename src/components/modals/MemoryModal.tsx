import { OptionalMemory } from '../../lovegame/content/collectibles';

interface MemoryModalProps {
  memory: OptionalMemory;
  onClose: () => void;
}

export default function MemoryModal({ memory, onClose }: MemoryModalProps) {
  return (
    <div className="memory-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="memory-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="memory-modal-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>

        <div className="memory-card-sparkles">
          <span>✨</span>
          <span>💖</span>
          <span>🌟</span>
        </div>

        <div className="memory-icon-header">
          <div className="memory-icon-circle">
            <span className="memory-icon">{memory.icon}</span>
          </div>
          <span className="memory-type-badge">Souvenir Facultatif Découvert</span>
          <h3 className="memory-card-title">{memory.title}</h3>
          <span className="memory-card-subtitle">{memory.subtitle}</span>
        </div>

        <div className="memory-location-tag">
          <span className="location-pin">📍</span>
          <span>{memory.location}</span>
        </div>

        <div className="memory-body-box">
          <p className="memory-main-text">{memory.text}</p>
          <div className="memory-poetic-quote">
            <span className="quote-mark">“</span>
            <em>{memory.poeticNote}</em>
            <span className="quote-mark">”</span>
          </div>
        </div>

        <div className="memory-modal-actions">
          <button
            type="button"
            className="memory-confirm-btn"
            onClick={onClose}
          >
            Garder ce souvenir précieusement ✨
          </button>
        </div>
      </div>
    </div>
  );
}
