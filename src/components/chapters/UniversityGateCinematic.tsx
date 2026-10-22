import { useState, useEffect, useRef, useCallback } from 'react';
import { asset } from '../../lovegame/assets';
import './UniversityGateCinematic.css';

// Synthesizer Web Audio API pour les effets sonores cinématiques
class SoundEffectsCinematic {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Grincement sourd et majestueux des lourds battants en fer forgé
  playGateCreak() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.25);
    } catch {
      // Audio bloqué ou non supporté
    }
  }

  // Fanfare féerique lumineuse (accords scintillants de révélation)
  playMagicFanfare() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // Do - Mi - Sol - Do aigu
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 1.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.15);
      });
    } catch {
      // Ignorer
    }
  }

  // Souffle magique lors du travelling avant
  playTravellingWhoosh() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 1.6);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.85);
    } catch {
      // Ignorer
    }
  }
}

const sfx = new SoundEffectsCinematic();

export type CinematicStage =
  | 'gate_closed'
  | 'gate_opening'
  | 'gate_opened'
  | 'gate_travelling'
  | 'campus_arrival';

export interface UniversityGateCinematicProps {
  onComplete: () => void;
  onBackToMenu?: () => void;
  initialStage?: CinematicStage;
}

export default function UniversityGateCinematic({
  onComplete,
  onBackToMenu,
  initialStage = 'gate_closed',
}: UniversityGateCinematicProps) {
  const [stage, setStage] = useState<CinematicStage>(initialStage);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(true);
  const timeoutsRef = useRef<number[]>([]);

  const clearAllTimers = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  // Lancement automatique de l'ouverture du portail au démarrage
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
      setStage('campus_arrival');
      return;
    }

    if (initialStage === 'gate_closed') {
      // Phase A : La magie se propage (onde dorée au centre)
      const t1 = window.setTimeout(() => {
        setStage('gate_opening');
        sfx.playGateCreak();
      }, 700);

      // Phase B & C : Le grand portail s'ouvre complètement et révèle le paysage
      const t2 = window.setTimeout(() => {
        setStage('gate_opened');
        sfx.playMagicFanfare();
      }, 3000);

      timeoutsRef.current.push(t1, t2);
    }

    return () => clearAllTimers();
  }, [initialStage]);

  // Déclenchement du Travelling avant (Séquence 2)
  const handleStartTravelling = useCallback(() => {
    clearAllTimers();
    setStage('gate_travelling');
    sfx.playTravellingWhoosh();

    // Après 3.2s de travelling cinématographique, arrivée sur le campus
    const t = window.setTimeout(() => {
      setStage('campus_arrival');
      sfx.playMagicFanfare();
    }, 3200);

    timeoutsRef.current.push(t);
  }, []);

  // Passer directement (bouton Passer »)
  const handleSkip = useCallback(() => {
    clearAllTimers();
    if (stage === 'campus_arrival') {
      onComplete();
    } else {
      setStage('campus_arrival');
    }
  }, [stage, onComplete]);

  // Basculer la musique
  const toggleMusic = () => {
    setIsMusicOn((prev) => !prev);
  };

  const isGateWingOpened =
    stage === 'gate_opening' ||
    stage === 'gate_opened' ||
    stage === 'gate_travelling' ||
    stage === 'campus_arrival';

  const isGateWingExit = stage === 'gate_travelling' || stage === 'campus_arrival';

  return (
    <div
      className="ug-cinematic-stage"
      role="region"
      aria-label="Ouverture du grand portail de l'Université"
    >
      {/* =====================================================================
          COUCHE A : LE DÉCOR DU JEU (NET, SANS AUCUN TEXTE OU BOUTON)
          ===================================================================== */}
      {stage !== 'campus_arrival' && (
        <div className="ug-decor-layer">
          {/* Arrière-plan crépusculaire net : château universitaire & fontaine */}
          <div
            className={`ug-backdrop-layer ${stage === 'gate_travelling' ? 'travelling' : ''}`}
            aria-hidden="true"
          >
            <img
              src={asset('backgrounds/twilight_university_castle_clean.jpg')}
              alt="Château universitaire au crépuscule"
              className="ug-backdrop-img"
            />
            <div className="ug-atmosphere-veil" />
          </div>

          {/* Particules, étoiles scintillantes et pétales flottants */}
          <div className="ug-fx-layer" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={`star-${i}`}
                className="ug-star"
                style={{
                  left: `${(i * 31) % 96 + 2}%`,
                  top: `${(i * 19) % 55 + 4}%`,
                  animationDelay: `${(i * 0.4) % 3}s`,
                }}
              />
            ))}

            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={`petal-${i}`}
                className="ug-petal"
                style={{
                  left: `${(i * 23) % 94 + 3}%`,
                  width: `${10 + (i % 6)}px`,
                  height: `${10 + (i % 6)}px`,
                  animationDelay: `${(i * 1.3) % 9}s`,
                  animationDuration: `${8 + (i % 5)}s`,
                }}
              />
            ))}

            {/* Onde magique lumineuse au centre du portail lors de l'ouverture */}
            {(stage === 'gate_closed' || stage === 'gate_opening') && (
              <div className="ug-magic-flare" />
            )}
          </div>

          {/* Grand portail monumental en fer forgé doré (3D SVG indépendant) */}
          <div
            className={`ug-monumental-gate-container ${
              stage === 'gate_travelling' ? 'travelling' : ''
            }`}
            aria-hidden="true"
          >
            {/* PILIER DE PIERRE GAUCHE AVEC LANTERNE D'OR */}
            <div className={`ug-pillar-wrap ug-pillar-wrap-left ${isGateWingExit ? 'exit-left' : ''}`}>
              <div className="ug-lantern-glow" />
              <svg className="ug-pillar-svg" viewBox="0 0 130 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="stoneGradL" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1a1f3c" />
                    <stop offset="40%" stopColor="#2c3358" />
                    <stop offset="80%" stopColor="#3d4672" />
                    <stop offset="100%" stopColor="#1b203d" />
                  </linearGradient>
                  <linearGradient id="goldCapL" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff8e7" />
                    <stop offset="50%" stopColor="#ffd97a" />
                    <stop offset="100%" stopColor="#966d12" />
                  </linearGradient>
                </defs>
                {/* Pilier de pierre taillée */}
                <rect x="15" y="110" width="100" height="690" fill="url(#stoneGradL)" stroke="#ffd97a" strokeWidth="2" />
                {/* Rainures de blocs de pierre */}
                {[190, 270, 350, 430, 510, 590, 670].map((y) => (
                  <line key={y} x1="16" y1={y} x2="114" y2={y} stroke="#ffd97a" strokeWidth="1" opacity="0.4" />
                ))}
                {/* Chapiteau supérieur orné */}
                <path d="M 5 110 L 125 110 L 115 80 L 15 80 Z" fill="url(#goldCapL)" />
                {/* Lanterne en fer forgé et or */}
                <path d="M 40 80 L 90 80 L 95 30 L 35 30 Z" fill="rgba(255, 235, 170, 0.4)" stroke="url(#goldCapL)" strokeWidth="3" />
                <path d="M 35 30 L 65 5 L 95 30 Z" fill="url(#goldCapL)" />
                <circle cx="65" cy="5" r="5" fill="#fff8e7" />
                <circle cx="65" cy="52" r="14" fill="#ffd97a" />
              </svg>
            </div>

            {/* BATTANT GAUCHE EN FER FORGÉ AJOURÉ (SANS FOND NOIR, TRANSPARENCE TOTALE) */}
            <div
              className={`ug-gate-wing ug-gate-wing-left ${
                isGateWingExit ? 'exit' : isGateWingOpened ? 'opened' : 'closed'
              }`}
            >
              <svg
                className="ug-gate-svg"
                viewBox="0 0 400 800"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="gateGoldL" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff8e7" />
                    <stop offset="30%" stopColor="#ffd97a" />
                    <stop offset="70%" stopColor="#d49520" />
                    <stop offset="100%" stopColor="#754b03" />
                  </linearGradient>
                </defs>

                {/* Cadre principal en fer forgé doré ajouré (fill="none" pour laisser voir le paysage net) */}
                <path
                  d="M 20 80 L 380 80 Q 400 80 400 100 L 400 780 Q 400 800 380 800 L 20 800 Q 0 800 0 780 L 0 100 Q 0 80 20 80 Z"
                  fill="none"
                  stroke="url(#gateGoldL)"
                  strokeWidth="7"
                />

                {/* Arche supérieure élégante */}
                <path
                  d="M 10 90 Q 200 10 390 90"
                  stroke="url(#gateGoldL)"
                  strokeWidth="6"
                  fill="none"
                />

                {/* Flèches dorées (Finials) le long du sommet */}
                {[40, 90, 140, 190, 240, 290, 340].map((x, idx) => (
                  <g key={`finial-${idx}`}>
                    <path
                      d={`M ${x - 8} 80 L ${x} 35 L ${x + 8} 80 Z`}
                      fill="url(#gateGoldL)"
                    />
                    <circle cx={x} cy="35" r="4" fill="#fff8e7" />
                  </g>
                ))}

                {/* Barreaux verticaux en fer forgé doré */}
                {[40, 85, 130, 175, 220, 265, 310, 355].map((x, idx) => (
                  <g key={`bar-${idx}`}>
                    <line
                      x1={x}
                      y1="90"
                      x2={x}
                      y2="780"
                      stroke="url(#gateGoldL)"
                      strokeWidth="4.5"
                    />
                    {/* Nœuds décoratifs dorés */}
                    <circle cx={x} cy="260" r="5" fill="url(#gateGoldL)" />
                    <circle cx={x} cy="520" r="5" fill="url(#gateGoldL)" />
                  </g>
                ))}

                {/* Volutes et arabesques baroques gravées */}
                <path
                  d="M 40 260 C 130 180, 270 340, 360 260"
                  stroke="url(#gateGoldL)"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M 40 520 C 130 440, 270 600, 360 520"
                  stroke="url(#gateGoldL)"
                  strokeWidth="4"
                  fill="none"
                />

                {/* Poignée et rosace centrale dorée */}
                <circle cx="370" cy="420" r="14" fill="url(#gateGoldL)" />
                <circle cx="370" cy="420" r="7" fill="#a51028" />
              </svg>
            </div>

            {/* BATTANT DROIT EN FER FORGÉ AJOURÉ (SANS FOND NOIR, TRANSPARENCE TOTALE) */}
            <div
              className={`ug-gate-wing ug-gate-wing-right ${
                isGateWingExit ? 'exit' : isGateWingOpened ? 'opened' : 'closed'
              }`}
            >
              <svg
                className="ug-gate-svg"
                viewBox="0 0 400 800"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="gateGoldR" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fff8e7" />
                    <stop offset="30%" stopColor="#ffd97a" />
                    <stop offset="70%" stopColor="#d49520" />
                    <stop offset="100%" stopColor="#754b03" />
                  </linearGradient>
                </defs>

                {/* Cadre principal en fer forgé doré ajouré */}
                <path
                  d="M 20 80 L 380 80 Q 400 80 400 100 L 400 780 Q 400 800 380 800 L 20 800 Q 0 800 0 780 L 0 100 Q 0 80 20 80 Z"
                  fill="none"
                  stroke="url(#gateGoldR)"
                  strokeWidth="7"
                />

                {/* Arche supérieure élégante */}
                <path
                  d="M 10 90 Q 200 10 390 90"
                  stroke="url(#gateGoldR)"
                  strokeWidth="6"
                  fill="none"
                />

                {/* Flèches dorées (Finials) le long du sommet */}
                {[60, 110, 160, 210, 260, 310, 360].map((x, idx) => (
                  <g key={`finial-r-${idx}`}>
                    <path
                      d={`M ${x - 8} 80 L ${x} 35 L ${x + 8} 80 Z`}
                      fill="url(#gateGoldR)"
                    />
                    <circle cx={x} cy="35" r="4" fill="#fff8e7" />
                  </g>
                ))}

                {/* Barreaux verticaux en fer forgé doré */}
                {[45, 90, 135, 180, 225, 270, 315, 360].map((x, idx) => (
                  <g key={`bar-r-${idx}`}>
                    <line
                      x1={x}
                      y1="90"
                      x2={x}
                      y2="780"
                      stroke="url(#gateGoldR)"
                      strokeWidth="4.5"
                    />
                    {/* Nœuds décoratifs dorés */}
                    <circle cx={x} cy="260" r="5" fill="url(#gateGoldR)" />
                    <circle cx={x} cy="520" r="5" fill="url(#gateGoldR)" />
                  </g>
                ))}

                {/* Volutes et arabesques baroques gravées */}
                <path
                  d="M 40 260 C 130 340, 270 180, 360 260"
                  stroke="url(#gateGoldR)"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M 40 520 C 130 600, 270 440, 360 520"
                  stroke="url(#gateGoldR)"
                  strokeWidth="4"
                  fill="none"
                />

                {/* Poignée et rosace centrale dorée */}
                <circle cx="30" cy="420" r="14" fill="url(#gateGoldR)" />
                <circle cx="30" cy="420" r="7" fill="#a51028" />
              </svg>
            </div>

            {/* PILIER DE PIERRE DROIT AVEC LANTERNE D'OR */}
            <div className={`ug-pillar-wrap ug-pillar-wrap-right ${isGateWingExit ? 'exit-right' : ''}`}>
              <div className="ug-lantern-glow" />
              <svg className="ug-pillar-svg" viewBox="0 0 130 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="stoneGradR" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#1a1f3c" />
                    <stop offset="40%" stopColor="#2c3358" />
                    <stop offset="80%" stopColor="#3d4672" />
                    <stop offset="100%" stopColor="#1b203d" />
                  </linearGradient>
                  <linearGradient id="goldCapR" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fff8e7" />
                    <stop offset="50%" stopColor="#ffd97a" />
                    <stop offset="100%" stopColor="#966d12" />
                  </linearGradient>
                </defs>
                <rect x="15" y="110" width="100" height="690" fill="url(#stoneGradR)" stroke="#ffd97a" strokeWidth="2" />
                {[190, 270, 350, 430, 510, 590, 670].map((y) => (
                  <line key={y} x1="16" y1={y} x2="114" y2={y} stroke="#ffd97a" strokeWidth="1" opacity="0.4" />
                ))}
                <path d="M 5 110 L 125 110 L 115 80 L 15 80 Z" fill="url(#goldCapR)" />
                <path d="M 40 80 L 90 80 L 95 30 L 35 30 Z" fill="rgba(255, 235, 170, 0.4)" stroke="url(#goldCapR)" strokeWidth="3" />
                <path d="M 35 30 L 65 5 L 95 30 Z" fill="url(#goldCapR)" />
                <circle cx="65" cy="5" r="5" fill="#fff8e7" />
                <circle cx="65" cy="52" r="14" fill="#ffd97a" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          COUCHE B : LES ÉLÉMENTS D'INTERFACE REACT (INTERACTIFS & SÉPARÉS)
          ===================================================================== */}
      {stage !== 'campus_arrival' && (
        <>
          {/* Barre supérieure : Accueil, Bannière centrale & Passer */}
          <div className="ug-topbar">
            {onBackToMenu ? (
              <button
                type="button"
                className="ug-home-btn"
                onClick={onBackToMenu}
                aria-label="Retour au menu principal"
                title="Retourner au menu principal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </button>
            ) : (
              <div />
            )}

            {/* Bannière centrale dorée : Cœur ouvert ✨ */}
            {stage === 'gate_opened' && (
              <div className="ug-banner-wrap">
                <div className="ug-banner-card">
                  <h2 className="ug-banner-title">Cœur ouvert ✨</h2>
                  <p className="ug-banner-sub">
                    Le portail de l’Université s’ouvre devant toi…
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              className="ug-skip-btn"
              onClick={handleSkip}
              aria-label="Passer la cinématique"
              title="Passer à l'étape suivante"
            >
              <span>Passer »</span>
            </button>
          </div>

          {/* Cupidon taquin en bas à gauche avec sa bulle React */}
          {stage === 'gate_opened' && (
            <div className="ug-cupid-zone">
              <div className="ug-cupid-avatar-wrap">
                <img
                  src={asset('cupid/cupid.png')}
                  alt="Cupidon chibi"
                  className="ug-cupid-img"
                />
                <span className="ug-arrow-wing-badge" title="Flèche dans l'aile !">
                  💘
                </span>
              </div>
              <div className="ug-cupid-bubble">
                <p>
                  Aïe ! Tout va bien ! C’était… une démonstration professionnelle. 😅
                </p>
              </div>
            </div>
          )}

          {/* Badge récompense et Bouton Continuer l'aventure en bas à droite */}
          {stage === 'gate_opened' && (
            <div className="ug-action-zone">
              <div className="ug-reward-badge">
                <span>🗝️</span>
                <span>Clé d’accès au voyage romantique</span>
              </div>

              <button
                type="button"
                className="ug-continue-btn"
                onClick={handleStartTravelling}
              >
                <span>Continuer l’aventure</span>
                <span>💛</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* =====================================================================
          SÉQUENCE 3 : ARRIVÉE SUR LE CAMPUS (HEROINE DE DOS & PARCHEMIN REACT)
          ===================================================================== */}
      {stage === 'campus_arrival' && (
        <div className="ug-campus-stage">
          {/* Décor net : vue panoramique du campus avec l'héroïne de dos face au château */}
          <img
            src={asset('backgrounds/heroine_campus_arrival_clean.jpg')}
            alt="Arrivée sur le campus universitaire"
            className="ug-campus-bg"
          />
          <div className="ug-campus-sun-overlay" />

          {/* Barre inférieure gauche : Retour au menu */}
          <div className="ug-campus-bottom-bar">
            {onBackToMenu && (
              <button
                type="button"
                className="ug-home-btn"
                onClick={onBackToMenu}
                style={{ width: 'auto', padding: '10px 18px', gap: '8px' }}
                aria-label="Retour au menu principal"
              >
                <span>←</span>
                <span>Retour au menu</span>
              </button>
            )}

            <button
              type="button"
              className="ug-music-btn"
              onClick={toggleMusic}
              aria-label="Basculer la musique"
              title="Musique"
            >
              <span>{isMusicOn ? '🎵' : '🔇'}</span>
            </button>
          </div>

          {/* Panneau Parchemin React en bas à droite : Bienvenue à l'Université ! */}
          <div className="ug-campus-parchment">
            <h3 className="ug-parchment-title">Bienvenue à l’Université !</h3>
            <p className="ug-parchment-text">
              « Tu es enfin là… le début d’une nouvelle aventure, et ce n’est que le
              commencement. »
            </p>
            <p className="ug-parchment-quote">
              « Profite de chaque instant, ma poupée. ❤️ »
            </p>

            <button
              type="button"
              className="ug-enter-building-btn"
              onClick={onComplete}
              title="Entrer dans l’Université 🏛️"
            >
              <span>Entrer dans l’Université</span>
              <span>🏛️</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
