import { useState } from 'react';
import { letters } from '../../lovegame/content/letters';
import LetterModal from '../LetterModal';
import { progressionStore, useProgression } from '../../lovegame/state/ProgressionStore';
import { HIDDEN_HEARTS, OPTIONAL_MEMORIES, OptionalMemory } from '../../lovegame/content/collectibles';
import MemoryModal from '../modals/MemoryModal';
import LibraryCatModal from '../modals/LibraryCatModal';

interface EndingDashboardProps {
  onReplayChapter: (chapter: 'chapter0' | 'chapter1' | 'game' | 'chapter5' | 'epilogue') => void;
  onResetSave: () => void;
}

export default function EndingDashboard({
  onReplayChapter,
  onResetSave,
}: EndingDashboardProps) {
  const [activeLetter, setActiveLetter] = useState<number | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<OptionalMemory | null>(null);
  const [showCatModal, setShowCatModal] = useState<boolean>(false);
  const progression = useProgression();

  return (
    <div className="ending-dashboard-screen">
      <div className="dashboard-container">
        {/* En-tête Romantique */}
        <header className="dashboard-hero">
          <div className="hero-decor-stars">✨ 🌟 💖 🌟 ✨</div>
          <h1 className="hero-title">Deux Lettres, Une Promesse</h1>
          <p className="hero-dedication">
            Dédié avec tout mon amour à <strong>Hougni Soulyhatou</strong>,<br />
            écrit et créé par <strong>Dylan ATTOLOU</strong>.
          </p>
          <div className="hero-badge">
            <span>🎉 Aventure Terminée avec Amour & Succès ! 🎉</span>
          </div>
        </header>

        {/* Section 1 : Le Journal de nos Écrits */}
        <section className="dashboard-section">
          <div className="section-title-wrap">
            <span className="section-icon">📖</span>
            <h2>Le Journal de nos Écrits</h2>
          </div>
          <p className="section-subtext">
            Chaque mot, chaque promesse et chaque enregistrement vocal restent précieusement conservés ici pour toujours.
          </p>

          <div className="letters-shelf">
            {letters.map((lettre, idx) => (
              <div
                key={lettre.id}
                className="letter-shelf-card"
                onClick={() => setActiveLetter(idx)}
                role="button"
                tabIndex={0}
              >
                <div className="card-badge-num">Écrit {idx + 1}</div>
                <h3 className="card-letter-title">{lettre.title}</h3>
                <span className="card-action-hint">
                  {idx === 1 ? '🏡 Relire avec la maison' : idx === 2 ? '💍 Réécouter la promesse' : '📜 Relire la lettre'}
                </span>
                <button
                  type="button"
                  className="card-read-btn primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLetter(idx);
                  }}
                >
                  Ouvrir & écouter ❤
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 : Les Souvenirs & Épreuves Accomplies */}
        <section className="dashboard-section memories-section">
          <div className="section-title-wrap">
            <span className="section-icon">✨</span>
            <h2>Les Souvenirs de Notre Histoire</h2>
          </div>

          <div className="memories-grid">
            <div className="memory-badge-card">
              <span className="badge-icon">🏛️</span>
              <h4>L’Université</h4>
              <p>Le courage d’aborder celle qui allait tout changer.</p>
            </div>
            <div className="memory-badge-card">
              <span className="badge-icon">🌌</span>
              <h4>La Constellation</h4>
              <p>« TU ES MON PLUS BEAU HASARD » gravé dans les étoiles.</p>
            </div>
            <div className="memory-badge-card">
              <span className="badge-icon">💎</span>
              <h4>L’Avenir</h4>
              <p>Courage, Travail & Soutien pour bâtir notre foyer.</p>
            </div>
            <div className="memory-badge-card">
              <span className="badge-icon">💍</span>
              <h4>La Promesse</h4>
              <p>Des actes réels pour mériter de t’appeler ma femme.</p>
            </div>
          </div>
        </section>

        {/* Section 2.b : Galerie des Souvenirs Facultatifs */}
        <section className="dashboard-section optional-memories-dashboard-section">
          <div className="section-title-wrap">
            <span className="section-icon">🌸</span>
            <h2>Galerie des Souvenirs Facultatifs</h2>
            <span className="section-counter-badge">
              {OPTIONAL_MEMORIES.filter((m) => progressionStore.isMemoryUnlocked(m.id)).length} /{' '}
              {OPTIONAL_MEMORIES.length} découverts
            </span>
          </div>
          <p className="section-subtext">
            Objets précieux et clins d’œil dispersés dans notre voyage. Cliquer sur un souvenir débloqué pour le contempler.
          </p>

          <div className="optional-memories-grid">
            {OPTIONAL_MEMORIES.map((mem) => {
              const isUnlocked = progressionStore.isMemoryUnlocked(mem.id);
              return (
                <div
                  key={mem.id}
                  className={`optional-memory-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => {
                    if (isUnlocked) setSelectedMemory(mem);
                  }}
                  role="button"
                  tabIndex={isUnlocked ? 0 : -1}
                >
                  <div className="opt-mem-icon-wrap">
                    <span className="opt-mem-icon">{isUnlocked ? mem.icon : '🔒'}</span>
                  </div>
                  <div className="opt-mem-info">
                    <h4 className="opt-mem-title">{isUnlocked ? mem.title : 'Souvenir Secret'}</h4>
                    <span className="opt-mem-loc">📍 {mem.location}</span>
                    <p className="opt-mem-desc">
                      {isUnlocked ? mem.subtitle : 'À explorer dans le monde (non obligatoire)'}
                    </p>
                  </div>
                  <span className="opt-mem-status-badge">
                    {isUnlocked ? 'Contempler ✨' : 'Caché 🔍'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2.c : Cœurs Secrets & Anecdotes */}
        <section className="dashboard-section hidden-hearts-dashboard-section">
          <div className="section-title-wrap">
            <span className="section-icon">💖</span>
            <h2>Cœurs Cachés & Anecdotes Découvertes</h2>
            <span className="section-counter-badge">
              {HIDDEN_HEARTS.filter((h) => progressionStore.isHeartFound(h.id)).length} /{' '}
              {HIDDEN_HEARTS.length} trouvés
            </span>
          </div>
          <p className="section-subtext">
            Cœurs secrets parsemés dans l’Université, le Jardin et le Pont des Étoiles.
          </p>

          <div className="hidden-hearts-grid">
            {HIDDEN_HEARTS.map((h) => {
              const isFound = progressionStore.isHeartFound(h.id);
              return (
                <div
                  key={h.id}
                  className={`hidden-heart-card ${isFound ? 'found' : 'missing'}`}
                >
                  <span className="heart-icon">{isFound ? '💖' : '🤍'}</span>
                  <div className="heart-details">
                    <strong className="heart-title">{h.title}</strong>
                    {isFound ? (
                      <p className="heart-anecdote">{h.anecdote}</p>
                    ) : (
                      <p className="heart-hint">Indice : {h.hint}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clin d'œil au Chat de la Bibliothèque */}
          <div className="cat-call-box">
            <span className="cat-call-icon">🐱</span>
            <div className="cat-call-text">
              <strong>Le Chat de la Bibliothèque</strong>
              <p>« Miaou… Tu as aimé le voyage ? Viens me faire un câlin félin avant de partir ! »</p>
            </div>
            <button
              type="button"
              className="cat-call-btn"
              onClick={() => setShowCatModal(true)}
            >
              Parler au Chat 🐾
            </button>
          </div>
        </section>

        {/* Section 3 : Rejouabilité & Accès Direct aux Chapitres */}
        <section className="dashboard-section replay-section">
          <div className="section-title-wrap">
            <span className="section-icon">🎮</span>
            <h2>Revivre les Moments Forts</h2>
          </div>

          <div className="replay-buttons-row">
            <button
              type="button"
              className="replay-btn"
              onClick={() => onReplayChapter('chapter0')}
            >
              📜 Revoir l’Invitation (Chapitre 0)
            </button>
            <button
              type="button"
              className="replay-btn"
              onClick={() => onReplayChapter('chapter1')}
            >
              🏛️ Revivre l’Université (Chapitre 1)
            </button>
            <button
              type="button"
              className="replay-btn"
              onClick={() => onReplayChapter('game')}
            >
              🌿 Rejouer les Niveaux (Jardin & Pont)
            </button>
            <button
              type="button"
              className="replay-btn"
              onClick={() => onReplayChapter('chapter5')}
            >
              💫 Les Retrouvailles dans la Clairière (Chapitre 5)
            </button>
            <button
              type="button"
              className="replay-btn highlight"
              onClick={() => onReplayChapter('epilogue')}
            >
              💍 Revivre La Promesse (Épilogue)
            </button>
          </div>
        </section>

        {/* Pied de page avec bouton de réinitialisation sécurisé */}
        <footer className="dashboard-footer">
          <button
            type="button"
            className="reset-progress-link"
            onClick={() => {
              if (
                window.confirm(
                  'Veux-tu réinitialiser entièrement la progression et recommencer l’aventure depuis le tout début ?'
                )
              ) {
                onResetSave();
              }
            }}
          >
            ↺ Recommencer l’aventure à zéro
          </button>
        </footer>
      </div>

      {/* Modale de relecture de lettre / promesse */}
      {activeLetter !== null && (
        <LetterModal
          index={activeLetter}
          isJournalMode={true}
          onSwitch={(newIdx) => setActiveLetter(newIdx)}
          onClose={() => setActiveLetter(null)}
        />
      )}

      {/* Modale d'inspection d'un souvenir facultatif */}
      {selectedMemory !== null && (
        <MemoryModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}

      {/* Modale du Chat de la Bibliothèque */}
      {showCatModal && (
        <LibraryCatModal onClose={() => setShowCatModal(false)} />
      )}
    </div>
  );
}
