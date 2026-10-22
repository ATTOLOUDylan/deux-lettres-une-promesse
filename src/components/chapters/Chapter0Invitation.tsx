import { useState } from 'react';
import { CHAPTER_0_CONTENT } from '../../lovegame/content/chapter0';
import { asset } from '../../lovegame/assets';
import { bus } from '../../lovegame/bus';
import PuzzleModal from '../puzzles/PuzzleModal';
import { progressionStore } from '../../lovegame/state/ProgressionStore';
import EnveloppeMysterieuse from './EnveloppeMysterieuse';
import CupidScene from './CupidScene';
import UniversityGateCinematic from './UniversityGateCinematic';

interface Chapter0InvitationProps {
  onComplete: () => void;
  onBackToTitle?: () => void;
}

type Step = 'envelope' | 'letter' | 'cupidon' | 'map' | 'puzzle' | 'completed';

export default function Chapter0Invitation({ onComplete, onBackToTitle }: Chapter0InvitationProps) {
  const [step, setStep] = useState<Step>('envelope');
  const [selectedLocationId, setSelectedLocationId] = useState<number>(1);
  const [cupidMessage, setCupidMessage] = useState(
    "Dylan a scellé le portail de l'Université avec un cadenas magique ! Résous le Code du Cœur pour ouvrir la route."
  );

  const journeyLocations = [
    {
      id: 1,
      title: "L'Université",
      chapter: "Chapitre 1 & 2",
      image: asset('map/c1.jpg'),
      description: "Là où tout a commencé : les regards timides dans la salle de classe, les premiers mots et le laboratoire des sentiments.",
      unlocked: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/><polyline points="2 22 2 7 22 7 22 22"/>
        </svg>
      ),
    },
    {
      id: 2,
      title: "Le Jardin Enchanté",
      chapter: "Chapitre 3",
      image: asset('map/c2.jpg'),
      description: "Une chasse aux fragments de phrase lumineuse (« TU ES MON PLUS BEAU HASARD ») au milieu des lucioles.",
      unlocked: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v14m-3-4a3 3 0 1 1 3-3m-3 3a3 3 0 1 0 3 3m0-6a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3-3"/>
        </svg>
      ),
    },
    {
      id: 3,
      title: "Le Pont des Étoiles",
      chapter: "Chapitre 4",
      image: asset('map/c3.jpg'),
      description: "L'ascension sous les étoiles, les trois épreuves de la confiance et la découverte de la seconde lettre.",
      unlocked: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
    },
    {
      id: 4,
      title: "La Clairière & La Promesse",
      chapter: "Chapitre 5 & Épilogue",
      image: asset('map/c4.jpg'),
      description: "Le lieu secret où Dylan t'attend en personne pour te remettre sa promesse pour la vie.",
      unlocked: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      ),
    },
  ];

  const handleSelectLocation = (loc: (typeof journeyLocations)[0]) => {
    setSelectedLocationId(loc.id);
    if (!loc.unlocked) {
      setCupidMessage(`${loc.title} est encore verrouillé… Termine d'abord les chapitres précédents !`);
      bus.emit('toast', `🔒 ${loc.title} est encore verrouillé… Termine d'abord l'étape précédente !`);
    } else {
      setCupidMessage("L'Université est accessible ! Résous le Code du Cœur pour briser le cadenas magique et commencer l'aventure.");
      bus.emit('toast', "🏛️ Étape 1 : L'Université — Clique sur « Résoudre le Code du Cœur » pour ouvrir la route ✨");
    }
  };

  const handleDialogueClose = () => {
    // Une fois le dialogue de Cupidon terminé, on affiche la carte
    setStep('map');
  };

  const handleOpenPuzzle = () => {
    if (progressionStore.isPuzzleSolved(CHAPTER_0_CONTENT.puzzleId)) {
      setStep('completed');
    } else {
      setStep('puzzle');
    }
  };

  const handlePuzzleClose = () => {
    // Si l'énigme a été résolue, on termine le chapitre 0 et on passe directement au Chapitre 1
    if (progressionStore.isPuzzleSolved(CHAPTER_0_CONTENT.puzzleId)) {
      handleFinalTransition();
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
      {/* ÉTAPE 1 & 2 : Enveloppe Mystérieuse & Lettre (Composant Lovable animé) */}
      {(step === 'envelope' || step === 'letter') && (
        <EnveloppeMysterieuse
          letterTitle={CHAPTER_0_CONTENT.letter.salutation}
          letterBody={CHAPTER_0_CONTENT.letter.paragraphs}
          letterSignature="— Dylan, avec tout mon amour ♡"
          onOpened={() => setStep('cupidon')}
          onBack={onBackToTitle}
        />
      )}

      {/* ÉTAPE 3 : Dialogue & Rencontre avec Cupidon (Composant Lovable CupidScene) */}
      {step === 'cupidon' && (
        <CupidScene
          onComplete={handleDialogueClose}
          onBack={onBackToTitle}
        />
      )}

      {/* ÉTAPE 4 : Carte du Voyage (Design Lovable 100% Fidèle et Responsive) */}
      {step === 'map' && (
        <div
          className="journey-v2-main"
          style={{ backgroundImage: `url(${asset('map/bg.jpg')})` }}
          role="main"
        >
          {/* Dégradé féerique d'ambiance */}
          <div className="journey-v2-overlay" />

          {/* 14 étoiles scintillantes */}
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="journey-v2-twinkle"
              style={{
                top: `${(i * 37) % 60 + 3}%`,
                left: `${(i * 53) % 95 + 2}%`,
                animationDelay: `${(i % 5) * 0.6}s`,
              }}
            />
          ))}

          <div className="journey-v2-content">
            {/* Barre supérieure : Bouton Retour + Note épinglée */}
            <div className="journey-v2-topbar">
              {onBackToTitle ? (
                <button
                  type="button"
                  onClick={onBackToTitle}
                  aria-label="Retour au menu"
                  title="Retour au menu principal"
                  className="journey-v2-back-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
                  </svg>
                </button>
              ) : <div />}

              <div className="journey-v2-pinned-note">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" strokeWidth="1" style={{ margin: '0 auto 4px', display: 'block' }}>
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
                Ton aventure<br />commence ici…
              </div>
            </div>

            {/* En-tête de la Carte */}
            <header className="journey-v2-header">
              <span className="journey-v2-header-badge">
                ♥ CARTE DU VOYAGE ♥
              </span>
              <div className="journey-v2-header-card">
                <h1 className="journey-v2-title">
                  Notre Histoire d'Amour
                </h1>
                <p className="journey-v2-subtitle">
                  Chaque lieu abrite un chapitre de vos souvenirs et de votre promesse.
                </p>
              </div>
            </header>

            {/* Grille / Défilement des 4 Lieux */}
            <section className="journey-v2-cards-section" aria-label="Lieux de l'aventure">
              {journeyLocations.map((loc) => {
                const isSelected = selectedLocationId === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    aria-label={`${loc.title} – ${loc.unlocked ? 'accessible' : 'verrouillé'}`}
                    className={`journey-v2-card ${loc.unlocked ? 'aura' : 'gold-frame'} ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="journey-v2-card-image-wrap">
                      <img
                        src={loc.image}
                        alt={loc.title}
                        loading="lazy"
                        className="journey-v2-card-image"
                      />
                      <span className="journey-v2-card-badge-num">
                        {loc.id}
                      </span>
                      {!loc.unlocked && (
                        <span className="journey-v2-card-lock-badge" title="Verrouillé">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </span>
                      )}
                    </div>

                    <div className="journey-v2-card-body">
                      <h3 className="journey-v2-card-title">
                        <span>{loc.icon}</span>
                        <span>{loc.title}</span>
                      </h3>
                      <p className="journey-v2-card-chapter">{loc.chapter}</p>

                      <div className="journey-v2-card-divider">
                        <span className="journey-v2-divider-line" />
                        {loc.unlocked ? (
                          <span className="journey-v2-pill-unlocked">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                            </svg>
                            Accessible
                          </span>
                        ) : (
                          <span className="journey-v2-pill-locked">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            Verrouillé
                          </span>
                        )}
                        <span className="journey-v2-divider-line" />
                      </div>

                      <p className="journey-v2-card-desc">{loc.description}</p>

                      <div className="journey-v2-card-footer-divider">
                        <span className="journey-v2-divider-line" />
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#281a38" stroke="#281a38" strokeWidth="1">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                        <span className="journey-v2-divider-line" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </section>

            {/* Section Inférieure : Bulle de Cupidon + Bouton d'Action Doré */}
            <section className="journey-v2-bottom-section">
              <div className="journey-v2-cupid-box">
                <img
                  src={asset('map/cupid.png')}
                  alt="Cupidon"
                  className="journey-v2-cupid-img"
                />
                <div className="journey-v2-cupid-text">
                  <p className="journey-v2-cupid-name">Cupidon :</p>
                  <p className="journey-v2-cupid-msg">{cupidMessage}</p>
                </div>
                <div className="journey-v2-cupid-heart">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#281a38" stroke="#281a38" strokeWidth="1">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                </div>
              </div>

              <div className="journey-v2-action-col">
                <button
                  type="button"
                  onClick={handleOpenPuzzle}
                  className="journey-v2-btn-gold"
                  title="Résoudre le Code du Cœur pour ouvrir l'Université"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>{progressionStore.isPuzzleSolved(CHAPTER_0_CONTENT.puzzleId) ? "Continuer le voyage" : "Résoudre le Code du Cœur"}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
                <p className="journey-v2-bottom-quote">
                  Parce que chaque étape nous rapproche… ♡
                </p>
              </div>
            </section>
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

      {/* ÉTAPE 6 : Complétion du Chapitre 0 & Transition du Grand Portail */}
      {step === 'completed' && (
        <UniversityGateCinematic
          onComplete={handleFinalTransition}
          onBackToMenu={onBackToTitle}
          initialStage="gate_opened"
        />
      )}
    </div>
  );
}
