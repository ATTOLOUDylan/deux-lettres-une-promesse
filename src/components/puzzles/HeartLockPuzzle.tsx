import { useState, useRef, useEffect, useCallback } from "react";
import { CodeLockPuzzleDefinition } from "../../lovegame/content/puzzles";
import { asset } from "../../lovegame/assets";
import UniversityGateCinematic from "../chapters/UniversityGateCinematic";
import "./HeartLockPuzzle.css";

// Synthesizer Web Audio API léger et sans dépendance externe
class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Clic mécanique doux lors de la rotation d'un cadran
  playGearClick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.045);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio bloqué ou non supporté
    }
  }

  // Petit son sourd comique lors d'une erreur
  playErrorThud() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }

  // Déclic métallique d'ouverture du cadenas
  playShackleSnap() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(980, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  // Carillon féerique lors de la réussite
  playChimeChord() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.85);
      });
    } catch {}
  }
}

const sfx = new SoundEffects();

// Les phases de l'animation spectaculaire
type UnlockPhase =
  | "idle"
  | "phase1_confirm"
  | "phase2_energy"
  | "phase3_rotation"
  | "phase4_open"
  | "gate_cinematic"
  | "phase6_victory";

export interface HeartLockPuzzleProps {
  puzzle: CodeLockPuzzleDefinition;
  onClose: () => void;
  onSuccess: () => void;
  alreadySolved?: boolean;
  onBackToTitle?: () => void;
}

export default function HeartLockPuzzle({
  puzzle,
  onClose,
  onSuccess,
  alreadySolved = false,
  onBackToTitle,
}: HeartLockPuzzleProps) {
  // Les 3 cadrans démarrent sur 0
  const [digits, setDigits] = useState<number[]>([0, 0, 0]);
  const [unlockPhase, setUnlockPhase] = useState<UnlockPhase>(alreadySolved ? "phase6_victory" : "idle");
  const [hintIndex, setHintIndex] = useState<number>(0);
  const [errorReaction, setErrorReaction] = useState<string | null>(null);
  const [cupidShake, setCupidShake] = useState(false);
  const lastErrorIdxRef = useRef<number>(-1);
  const animTimeouts = useRef<number[]>([]);

  // Nettoyage des timers lors du démontage
  useEffect(() => {
    return () => {
      animTimeouts.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Modification d'un cadran
  const turnDial = (dialIndex: number, delta: number) => {
    if (unlockPhase !== "idle") return;
    sfx.playGearClick();
    setErrorReaction(null);
    setDigits((prev) =>
      prev.map((val, idx) => (idx === dialIndex ? (val + delta + 10) % 10 : val))
    );
  };

  // Affichage progressif des indices
  const handleShowHint = () => {
    if (hintIndex < puzzle.hints.length) {
      setHintIndex((prev) => prev + 1);
    }
  };

  // Validation du code
  const handleValidate = () => {
    if (unlockPhase !== "idle") return;

    const entered = digits.join("");
    if (entered === puzzle.answer) {
      // Séquence spectaculaire d'ouverture en 6 phases !
      launchSpectacularUnlock();
    } else {
      // Réaction humoristique de Cupidon cyclique sans répétition
      sfx.playErrorThud();
      setCupidShake(true);
      setTimeout(() => setCupidShake(false), 600);

      const reactions = puzzle.errorReactions || [
        "« Tu viens de coder “l’amour compliqué” ! 😂 »",
        "« Même mon arc est plus précis que ça ! »",
        "« Le cadenas te demande une preuve d’amour, pas un numéro au hasard ! »",
        "« Aïe… mon instinct de Cupidon vient de prendre un coup. 😭 »",
        "« On se rapproche… enfin, je crois. Ne me demande pas de vérifier ! »",
      ];

      let nextIdx = (lastErrorIdxRef.current + 1) % reactions.length;
      if (nextIdx === lastErrorIdxRef.current) {
        nextIdx = (nextIdx + 1) % reactions.length;
      }
      lastErrorIdxRef.current = nextIdx;
      setErrorReaction(reactions[nextIdx] ?? reactions[0]);
    }
  };

  // Séquence spectaculaire d'ouverture en 6 phases
  const launchSpectacularUnlock = useCallback(() => {
    // Vérification prefers-reduced-motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setUnlockPhase("phase6_victory");
      sfx.playChimeChord();
      onSuccess();
      return;
    }

    // Phase 1 : Confirmation de la combinaison (500 ms)
    setUnlockPhase("phase1_confirm");
    sfx.playGearClick();

    // Phase 2 : Le cadenas se charge en énergie (750 ms)
    const t2 = window.setTimeout(() => {
      setUnlockPhase("phase2_energy");
    }, 500);

    // Phase 3 : Rotation mécanique des rouages (600 ms)
    const t3 = window.setTimeout(() => {
      setUnlockPhase("phase3_rotation");
      sfx.playShackleSnap();
    }, 1250);

    // Phase 4 : Ouverture du cadenas (1000 ms)
    const t4 = window.setTimeout(() => {
      setUnlockPhase("phase4_open");
      sfx.playChimeChord();
      onSuccess(); // Progression enregistrée dès l'ouverture du cadenas
    }, 1850);

    // Phase 5 : Lancement de la Scène Cinématique du Grand Portail de l'Université
    const t5 = window.setTimeout(() => {
      setUnlockPhase("gate_cinematic");
    }, 2850);

    animTimeouts.current.push(t2, t3, t4, t5);
  }, [onSuccess]);

  const isAnimating = unlockPhase !== "idle" && unlockPhase !== "phase6_victory" && unlockPhase !== "gate_cinematic";
  const isUnlockedVisual = unlockPhase === "phase4_open" || unlockPhase === "gate_cinematic" || unlockPhase === "phase6_victory";

  if (unlockPhase === "gate_cinematic") {
    return (
      <UniversityGateCinematic
        onComplete={onClose}
        onBackToMenu={onBackToTitle || onClose}
      />
    );
  }

  return (
    <div className="heartlock-stage" role="dialog" aria-modal="true" aria-label="Énigme du Cadenas du Cœur">
      {/* 1. Arrière-plan romantique nocturne avec château illuminé */}
      <img
        src={asset("cupid/terrace-bg.jpg")}
        alt=""
        aria-hidden="true"
        className="heartlock-bg"
      />
      <div className="heartlock-backdrop-veil" aria-hidden="true" />

      {/* Particules féeriques & pétales */}
      <div className="heartlock-fx-layer" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="hl-twinkle-star"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 45}%`,
              animationDelay: `${(i * 0.4) % 3}s`,
            }}
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="hl-floating-petal"
            style={{
              left: `${(i * 29) % 95}%`,
              width: `${10 + (i % 6)}px`,
              height: `${10 + (i % 6)}px`,
              animationDelay: `${(i * 1.5) % 10}s`,
              animationDuration: `${9 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      {/* 2. Barre supérieure de navigation */}
      <header className="heartlock-topbar">
        <button
          type="button"
          onClick={onBackToTitle || onClose}
          disabled={isAnimating}
          aria-label="Retour au menu principal"
          className="hl-btn-circle"
          title="Retourner au menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </button>

        <div className="hl-top-medallion">
          <span className="hl-medallion-heart">♥</span>
          <span className="hl-medallion-line1">Chapitre 0 —</span>
          <span className="hl-medallion-line2">L’Invitation Mystérieuse</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isAnimating}
          className="hl-btn-pill"
          title="Fermer et retourner à la carte"
        >
          <span>Passer</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m13 17 5-5-5-5"/>
            <path d="m6 17 5-5-5-5"/>
          </svg>
        </button>
      </header>

      {/* 3. Grand Panneau Central en Verre Dépoli */}
      <div className="heartlock-panel">
        {/* Ornements d'angle ❦ */}
        <span className="hl-corner tl" aria-hidden="true">❦</span>
        <span className="hl-corner tr" aria-hidden="true">❦</span>
        <span className="hl-corner bl" aria-hidden="true">❦</span>
        <span className="hl-corner br" aria-hidden="true">❦</span>

        {/* En-tête du panneau : Badge 🔐 Énigme, Titre et Croix de fermeture */}
        <div className="hl-panel-header">
          <div className="hl-header-center">
            <span className="hl-badge-enigme">🔐 Énigme</span>
            <h1 className="hl-title-text">{puzzle.title}</h1>
          </div>
          <button
            type="button"
            className="hl-close-btn"
            onClick={onClose}
            disabled={isAnimating}
            aria-label="Fermer l'énigme et revenir à la carte"
            title="Revenir à la carte"
          >
            ✕
          </button>
        </div>

        {/* Consigne et Cupidon souriant avec son arc */}
        <div className="hl-cupid-row">
          <div className={`hl-cupid-avatar-wrap ${cupidShake ? "hl-cupid-shake" : ""}`}>
            <img
              src={asset("cupid/cupid.png")}
              alt="Cupidon"
              className="hl-cupid-avatar-img"
            />
          </div>
          <div className="hl-speech-bubble">
            <p>Dylan a verrouillé le portail de l’Université avec un cadenas doré en forme de cœur.</p>
            <p>« Trois rouages, trois secrets gravés dans le métal. Écoute ton cœur, tourne les rouages… et devine. »</p>
          </div>
        </div>

        {/* Cadenas Doré 3D au Centre */}
        <div className="hl-lock-container">
          <div
            className="hl-lock-wrapper"
            style={{
              transform: isUnlockedVisual
                ? "translateY(-14px) scale(1.08)"
                : unlockPhase === "phase2_energy"
                ? "scale(1.04)"
                : "scale(1)",
            }}
          >
            {/* Onde de choc lumineuse en phase 4 */}
            {unlockPhase === "phase4_open" && <div className="hl-shockwave" />}

            {/* Cercle magique et halo rayonnant */}
            <div className="hl-lock-magic-ring" />
            <div className="hl-lock-sunburst" />

            {/* Cœurs orbitaux lumineux */}
            <span className="hl-orbit-heart" style={{ top: "15%", left: "5%" }}>💖</span>
            <span className="hl-orbit-heart" style={{ top: "20%", right: "8%", animationDelay: "1.2s" }}>✨</span>
            <span className="hl-orbit-heart" style={{ bottom: "10%", left: "15%", animationDelay: "0.6s" }}>💕</span>
            <span className="hl-orbit-heart" style={{ bottom: "12%", right: "12%", animationDelay: "1.8s" }}>✨</span>

            {/* Cadenas SVG haute fidélité */}
            <svg
              className="hl-svg-lock"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Dégradé or brillant pour le corps */}
                <radialGradient id="goldHeartBody" cx="40%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fff9d6" />
                  <stop offset="25%" stopColor="#ffd97a" />
                  <stop offset="65%" stopColor="#d4941e" />
                  <stop offset="100%" stopColor="#7a4e0a" />
                </radialGradient>

                {/* Dégradé métallique pour l'anse */}
                <linearGradient id="goldShackle" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff4b8" />
                  <stop offset="35%" stopColor="#ffd97a" />
                  <stop offset="70%" stopColor="#b37c18" />
                  <stop offset="100%" stopColor="#fff4b8" />
                </linearGradient>

                {/* Filtre de brillance métallique */}
                <filter id="goldShine" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ffd97a" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* L'Anse (Shackle) métallique pivotante */}
              <g
                className={`hl-shackle-path ${isUnlockedVisual ? "hl-shackle-open" : ""}`}
              >
                {/* Anneau doré courbé */}
                <path
                  d="M 62 82 V 46 C 62 20 138 20 138 46 V 82"
                  stroke="url(#goldShackle)"
                  strokeWidth="15"
                  strokeLinecap="round"
                  filter="url(#goldShine)"
                />
                <path
                  d="M 62 82 V 46 C 62 22 138 22 138 46 V 82"
                  stroke="#fffce8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </g>

              {/* Le Corps en Cœur volumétrique */}
              <g filter="url(#goldShine)">
                {/* Ombre portée du cœur */}
                <path
                  d="M 100 185 C 15 130 18 68 64 68 C 84 68 96 82 100 90 C 104 82 116 68 136 68 C 182 68 185 130 100 185 Z"
                  fill="#543306"
                  transform="translate(0, 4)"
                  opacity="0.4"
                />

                {/* Cœur extérieur or massif */}
                <path
                  d="M 100 185 C 15 130 18 68 64 68 C 84 68 96 82 100 90 C 104 82 116 68 136 68 C 182 68 185 130 100 185 Z"
                  fill="url(#goldHeartBody)"
                  stroke="#fff5c0"
                  strokeWidth="3.5"
                />

                {/* Liseré et gravures ciselées */}
                <path
                  d="M 100 172 C 28 122 30 78 66 78 C 82 78 94 90 100 96 C 106 90 118 78 134 78 C 170 78 172 122 100 172 Z"
                  fill="none"
                  stroke="#fff2b2"
                  strokeWidth="1.8"
                  strokeDasharray="4 2"
                  opacity="0.75"
                />

                {/* Volutes baroques gravées */}
                <path
                  d="M 72 102 C 60 112 75 132 86 138"
                  fill="none"
                  stroke="#8f5b08"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 128 102 C 140 112 125 132 114 138"
                  fill="none"
                  stroke="#8f5b08"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Le Trou de Serrure */}
                <g
                  className={`hl-keyhole ${
                    unlockPhase === "phase3_rotation" || isUnlockedVisual ? "hl-keyhole-glow" : ""
                  }`}
                >
                  <circle cx="100" cy="116" r="8" fill="#1f112b" />
                  <polygon points="94,118 106,118 103,136 97,136" fill="#1f112b" />
                  <circle cx="100" cy="116" r="9" stroke="#ffd97a" strokeWidth="1.5" fill="none" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* 4. Les Trois Rouages (Dials) */}
        <div className="heartlock-dials-grid">
          {puzzle.dials.map((dial, idx) => {
            const isCorrect = digits[idx] === parseInt(puzzle.answer[idx] ?? "-1", 10);
            const showSuccessGlow = unlockPhase !== "idle" && isCorrect;

            return (
              <div
                key={dial.id}
                className={`hl-dial-card ${showSuccessGlow ? "correct-glow" : ""}`}
              >
                {/* Filet lumineux en Phase 1 */}
                {unlockPhase === "phase1_confirm" && <div className="hl-energy-beam" />}

                <div className="hl-dial-header">
                  <span>{idx === 0 ? "💛" : idx === 1 ? "🧡" : "❤️"}</span>
                  <span>{dial.label}</span>
                </div>

                <div className="hl-dial-riddle">{dial.riddle}</div>

                {/* Boîte du compteur */}
                <div className="hl-counter-box">
                  <button
                    type="button"
                    className="hl-arrow-btn"
                    onClick={() => turnDial(idx, 1)}
                    disabled={isAnimating || alreadySolved}
                    aria-label={`Augmenter le chiffre du ${dial.label}`}
                  >
                    ▲
                  </button>

                  <div
                    className={`hl-digit-screen ${showSuccessGlow ? "correct" : ""}`}
                    aria-live="polite"
                  >
                    <span className="hl-digit-number">{digits[idx]}</span>
                  </div>

                  <button
                    type="button"
                    className="hl-arrow-btn"
                    onClick={() => turnDial(idx, -1)}
                    disabled={isAnimating || alreadySolved}
                    aria-label={`Diminuer le chiffre du ${dial.label}`}
                  >
                    ▼
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Réaction humoristique de Cupidon lors d'une mauvaise combinaison */}
        {errorReaction && (
          <div className="hl-error-bubble" role="alert">
            <span style={{ fontSize: "24px" }}>👼</span>
            <div>
              <strong>Cupidon :</strong> {errorReaction}
            </div>
          </div>
        )}

        {/* 5. Ligne inférieure : Indices et Bouton d'Ouverture */}
        <div className="heartlock-bottom-row">
          <button
            type="button"
            className="hl-hint-btn"
            onClick={handleShowHint}
            disabled={isAnimating || hintIndex >= puzzle.hints.length}
          >
            <span>💡</span>
            <span>
              {hintIndex === 0
                ? "Besoin d’un indice ?"
                : hintIndex < puzzle.hints.length
                ? `Indice suivant (${hintIndex}/${puzzle.hints.length})`
                : "Tous les indices révélés"}
            </span>
          </button>

          <button
            type="button"
            className="hl-validate-btn"
            onClick={handleValidate}
            disabled={isAnimating || alreadySolved}
          >
            <span>☘</span>
            <span>
              {alreadySolved
                ? "Cœur déjà ouvert ✨"
                : isAnimating
                ? "Ouverture en cours…"
                : "Ouvrir mon cœur 💛"}
            </span>
          </button>
        </div>

        {/* Tiroir d'indices progressifs */}
        {hintIndex > 0 && (
          <div className="hl-hints-panel" role="region" aria-label="Indices">
            {puzzle.hints.slice(0, hintIndex).map((hint, i) => (
              <div key={i} className="hl-hint-item">
                <span className="hl-hint-lvl">Indice {i + 1} :</span>
                <span>{hint}</span>
              </div>
            ))}
          </div>
        )}



        {/* =========================================================================
            PHASE 6 : BANNIÈRE DE VICTOIRE, CUPIDON ET RÉCOMPENSE
            ========================================================================= */}
        {unlockPhase === "phase6_victory" && (
          <div className="hl-victory-card" role="region" aria-label="Victoire">
            <h2 className="hl-victory-title">Cœur ouvert ✨</h2>

            <div className="hl-cupid-wing-arrow-scene">
              <img
                src={asset("cupid/cupid.png")}
                alt="Cupidon"
                className="hl-victory-cupid-img"
              />
              <div className="hl-cupid-victory-dialogue">
                <p style={{ margin: "0 0 6px", fontWeight: "bold", color: "#a51028" }}>
                  « Clic… 3… clic… 2… clic… 1… Un silence. Puis : “3… 2… 1… JE T’AIME !! 💘” »
                </p>
                <p style={{ margin: 0, fontStyle: "italic", opacity: 0.9 }}>
                  (La flèche s’est plantée dans son aile !) « Aïe ! Tout va bien ! C’était… une démonstration professionnelle. 😅 »
                </p>
              </div>
            </div>

            <div className="hl-reward-badge">
              <span>🗝️</span>
              <span>Clé d’accès au voyage romantique</span>
            </div>

            <button
              type="button"
              className="hl-continue-btn"
              onClick={() => {
                setUnlockPhase("gate_cinematic");
              }}
            >
              <span>Entrer dans l’Université</span>
              <span>🏛️</span>
            </button>
          </div>
        )}
      </div>

      {/* 6. Bouton Retour au menu en bas à gauche */}
      <button
        type="button"
        onClick={onBackToTitle || onClose}
        disabled={isAnimating}
        className="hl-btn-pill"
        style={{ marginTop: "14px", alignSelf: "flex-start" }}
      >
        <span>←</span>
        <span>Retour au menu</span>
      </button>
    </div>
  );
}
