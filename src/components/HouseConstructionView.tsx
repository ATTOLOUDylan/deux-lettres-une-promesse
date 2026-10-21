import { useState } from 'react';

interface HouseConstructionViewProps {
  stage?: number; // 0 à 5
  onStageChange?: (stage: number) => void;
}

const STAGES = [
  {
    step: 1,
    title: 'Fondations',
    label: 'Les Fondations d’Amour',
    desc: 'Un socle de respect, d’honnêteté et de confiance partagée.',
    motto: '« Poser les premières pierres ensemble. »',
  },
  {
    step: 2,
    title: 'Murs',
    label: 'Les Murs & La Charpente',
    desc: 'La structure solide d’un foyer où chacun se sent écouté et en sécurité.',
    motto: '« Un abri contre les tempêtes du dehors. »',
  },
  {
    step: 3,
    title: 'Toit',
    label: 'Le Toit Protecteur',
    desc: 'Protéger nos rêves communs et veiller l’un sur l’autre chaque jour.',
    motto: '« Sous ce toit, nous construirons notre bonheur. »',
  },
  {
    step: 4,
    title: 'Fenêtres',
    label: 'La Porte & Les Fenêtres',
    desc: 'Une porte ouverte au bonheur et des fenêtres allumées de rires.',
    motto: '« Une douce lueur dorée qui brille dans la nuit. »',
  },
  {
    step: 5,
    title: 'Jardin',
    label: 'Le Jardin Fleuri',
    desc: 'Faire éclore nos projets avec patience, soin et tendresse.',
    motto: '« Un jardin qui grandit avec nos efforts quotidiens. »',
  },
  {
    step: 6,
    title: 'Foyer',
    label: 'L’Âme du Foyer',
    desc: 'Guirlandes d’étoiles, chaleur humaine et amour vivant au quotidien.',
    motto: '« Construire demain, avec toi, notre foyer. ❤️ »',
  },
];

export default function HouseConstructionView({
  stage: controlledStage,
  onStageChange,
}: HouseConstructionViewProps) {
  const [internalStage, setInternalStage] = useState(2);
  const currentStage = controlledStage !== undefined ? controlledStage : internalStage;
  const stageInfo = STAGES[Math.min(currentStage, STAGES.length - 1)];

  const handleSelectStage = (idx: number) => {
    setInternalStage(idx);
    if (onStageChange) onStageChange(idx);
  };

  return (
    <div className="house-construction-card">
      <div className="house-header">
        <div className="house-badge">
          <span>🏡 Le Foyer que nous bâtissons</span>
        </div>
        <span className="house-stage-number">
          Étape {currentStage + 1} / {STAGES.length}
        </span>
      </div>

      {/* Scène SVG animée de la maison en construction */}
      <div className="house-canvas-wrap">
        <svg
          viewBox="0 0 500 220"
          className="house-svg"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Illustration du futur foyer en cours de construction"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#141033" />
              <stop offset="60%" stopColor="#221845" />
              <stop offset="100%" stopColor="#301b50" />
            </linearGradient>

            <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#483664" />
              <stop offset="100%" stopColor="#332449" />
            </linearGradient>

            <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c04562" />
              <stop offset="100%" stopColor="#7a253b" />
            </linearGradient>

            <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff9d6" stopOpacity="1" />
              <stop offset="50%" stopColor="#ffd97a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f4b942" stopOpacity="0.1" />
            </radialGradient>

            <filter id="glowEffect" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ciel & étoiles de fond */}
          <rect x="0" y="0" width="500" height="220" fill="url(#skyGrad)" rx="14" />

          {/* Étoiles scintillantes */}
          {[
            { cx: 45, cy: 35, r: 1.5 },
            { cx: 90, cy: 55, r: 1 },
            { cx: 130, cy: 25, r: 1.8 },
            { cx: 200, cy: 40, r: 1.2 },
            { cx: 310, cy: 30, r: 1.5 },
            { cx: 370, cy: 50, r: 1 },
            { cx: 440, cy: 35, r: 2 },
            { cx: 470, cy: 70, r: 1.2 },
          ].map((st, i) => (
            <circle
              key={i}
              cx={st.cx}
              cy={st.cy}
              r={st.r}
              fill="#ffd97a"
              opacity={0.7}
              className="twinkle-star"
              style={{ animationDelay: `${(i % 4) * 0.5}s` }}
            />
          ))}

          {/* Croissant de lune romantique */}
          <path
            d="M 440 25 A 18 18 0 1 0 455 55 A 14 14 0 1 1 440 25 Z"
            fill="#ffe8a3"
            opacity={0.85}
            filter="url(#glowEffect)"
          />

          {/* Collines d'arrière-plan */}
          <path d="M 0 195 Q 120 170 260 190 T 500 185 L 500 220 L 0 220 Z" fill="#1d1538" />

          {/* Sol du jardin */}
          <path d="M 0 200 Q 250 190 500 200 L 500 220 L 0 220 Z" fill="#294532" />

          {/* ========================================================= */}
          {/* ÉTAPE 0 : LES FONDATIONS EN PIERRE */}
          {/* ========================================================= */}
          {currentStage >= 0 && (
            <g className="house-part foundation-part">
              {/* Grand socle en pierre */}
              <rect x="180" y="180" width="140" height="18" fill="#58486e" stroke="#756291" strokeWidth="1.5" rx="3" />
              {/* Lignes de pierres */}
              <line x1="220" y1="180" x2="220" y2="198" stroke="#3b2f4f" strokeWidth="1.5" />
              <line x1="260" y1="180" x2="260" y2="198" stroke="#3b2f4f" strokeWidth="1.5" />
              <line x1="295" y1="180" x2="295" y2="198" stroke="#3b2f4f" strokeWidth="1.5" />
              {/* Petits piliers de charpente */}
              <rect x="185" y="125" width="10" height="55" fill="#a47248" opacity={0.6} />
              <rect x="305" y="125" width="10" height="55" fill="#a47248" opacity={0.6} />
            </g>
          )}

          {/* ========================================================= */}
          {/* ÉTAPE 1 : LES MURS & LA STRUCTURE */}
          {/* ========================================================= */}
          {currentStage >= 1 && (
            <g className="house-part walls-part">
              {/* Corps principal des murs */}
              <rect x="185" y="115" width="130" height="66" fill="url(#wallGrad)" stroke="#c68f5a" strokeWidth="2" rx="2" />
              {/* Poutres en bois apparentes */}
              <line x1="185" y1="148" x2="315" y2="148" stroke="#a47248" strokeWidth="2" />
              <line x1="250" y1="115" x2="250" y2="181" stroke="#a47248" strokeWidth="2" />
            </g>
          )}

          {/* ========================================================= */}
          {/* ÉTAPE 2 : LE TOIT PROTECTEUR & CHEMINÉE */}
          {/* ========================================================= */}
          {currentStage >= 2 && (
            <g className="house-part roof-part">
              {/* Cheminée */}
              <rect x="280" y="60" width="16" height="30" fill="#753549" stroke="#99465e" strokeWidth="1" />
              <line x1="278" y1="60" x2="298" y2="60" stroke="#ffd97a" strokeWidth="1.5" />

              {/* Fumée de cheminée en petits cœurs */}
              {currentStage >= 5 && (
                <g className="chimney-smoke">
                  <text x="284" y="52" fontSize="11" fill="#ffb3c6" opacity="0.8">❤</text>
                  <text x="290" y="38" fontSize="14" fill="#ffb3c6" opacity="0.6">❤</text>
                  <text x="298" y="24" fontSize="16" fill="#ffd97a" opacity="0.4">✨</text>
                </g>
              )}

              {/* Toit triangulaire */}
              <polygon points="170,116 250,68 330,116" fill="url(#roofGrad)" stroke="#ffd97a" strokeWidth="2" />
              {/* Lattes du toit */}
              <line x1="210" y1="92" x2="290" y2="92" stroke="#521b2a" strokeWidth="1.5" />
              <line x1="230" y1="80" x2="270" y2="80" stroke="#521b2a" strokeWidth="1.5" />
            </g>
          )}

          {/* ========================================================= */}
          {/* ÉTAPE 3 : LA PORTE & LES FENÊTRES LUMINEUSES */}
          {/* ========================================================= */}
          {currentStage >= 3 && (
            <g className="house-part windows-part">
              {/* Porte d'entrée en bois */}
              <rect x="236" y="138" width="28" height="43" fill="#8c5832" stroke="#c68f5a" strokeWidth="1.5" rx="3" />
              <circle cx="260" cy="160" r="2.5" fill="#ffd97a" />
              {/* Petit porche au-dessus de la porte */}
              <line x1="230" y1="138" x2="270" y2="138" stroke="#c68f5a" strokeWidth="2" />

              {/* Fenêtre gauche allumée */}
              <rect x="198" y="132" width="24" height="26" fill="url(#windowGlow)" stroke="#c68f5a" strokeWidth="1.5" rx="2" />
              <line x1="210" y1="132" x2="210" y2="158" stroke="#8c5832" strokeWidth="1" />
              <line x1="198" y1="145" x2="222" y2="145" stroke="#8c5832" strokeWidth="1" />

              {/* Fenêtre droite allumée */}
              <rect x="278" y="132" width="24" height="26" fill="url(#windowGlow)" stroke="#c68f5a" strokeWidth="1.5" rx="2" />
              <line x1="290" y1="132" x2="290" y2="158" stroke="#8c5832" strokeWidth="1" />
              <line x1="278" y1="145" x2="302" y2="145" stroke="#8c5832" strokeWidth="1" />

              {/* Halo de lumière douce projeté au sol devant la porte */}
              <ellipse cx="250" cy="186" rx="28" ry="8" fill="#ffd97a" opacity="0.3" filter="url(#glowEffect)" />
            </g>
          )}

          {/* ========================================================= */}
          {/* ÉTAPE 4 : LE JARDIN & LES FLEURS */}
          {/* ========================================================= */}
          {currentStage >= 4 && (
            <g className="house-part garden-part">
              {/* Sentier en pierres menant à la porte */}
              <path d="M 242 182 Q 235 198 225 215 L 275 215 Q 262 198 258 182 Z" fill="#58486e" opacity="0.75" />
              {/* Petits pas japonais */}
              <ellipse cx="248" cy="190" rx="6" ry="2.5" fill="#84739c" />
              <ellipse cx="245" cy="198" rx="8" ry="3" fill="#84739c" />
              <ellipse cx="250" cy="207" rx="10" ry="3.5" fill="#84739c" />

              {/* Buissons de roses à gauche */}
              <circle cx="165" cy="188" r="12" fill="#32633e" />
              <circle cx="155" cy="192" r="10" fill="#244d2f" />
              <circle cx="162" cy="184" r="3" fill="#ff4d79" />
              <circle cx="168" cy="189" r="2.5" fill="#ffd97a" />
              <circle cx="156" cy="189" r="2.5" fill="#ff4d79" />

              {/* Buissons fleuris à droite */}
              <circle cx="335" cy="188" r="12" fill="#32633e" />
              <circle cx="345" cy="192" r="10" fill="#244d2f" />
              <circle cx="332" cy="184" r="3" fill="#ff7da7" />
              <circle cx="340" cy="187" r="2.5" fill="#ffd97a" />
              <circle cx="346" cy="189" r="2.5" fill="#ff4d79" />
            </g>
          )}

          {/* ========================================================= */}
          {/* ÉTAPE 5 : GUIRLANDES D'ÉTOILES & LUCIOLLES */}
          {/* ========================================================= */}
          {currentStage >= 5 && (
            <g className="house-part fireflies-part">
              {/* Guirlande lumineuse sous le toit */}
              <path d="M 175 117 Q 212 125 250 119 Q 288 125 325 117" fill="none" stroke="#ffd97a" strokeWidth="1" strokeDasharray="2,3" />
              {[185, 205, 225, 250, 275, 295, 315].map((gx, idx) => (
                <circle
                  key={idx}
                  cx={gx}
                  cy={120 + (idx % 2 === 0 ? 2 : 0)}
                  r={2.5}
                  fill="#fff9d6"
                  filter="url(#glowEffect)"
                  className="fairy-bulb"
                />
              ))}

              {/* Lucioles flottantes dorées */}
              {[
                { x: 130, y: 155 },
                { x: 175, y: 168 },
                { x: 325, y: 160 },
                { x: 370, y: 172 },
                { x: 250, y: 95 },
              ].map((pos, idx) => (
                <circle
                  key={idx}
                  cx={pos.x}
                  cy={pos.y}
                  r={2}
                  fill="#ffd97a"
                  filter="url(#glowEffect)"
                  className="floating-firefly"
                  style={{ animationDelay: `${idx * 0.4}s` }}
                />
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* Détails de l'étape en cours */}
      <div className="house-stage-info">
        <h4 className="house-stage-title">{stageInfo.label}</h4>
        <p className="house-stage-desc">{stageInfo.desc}</p>
        <span className="house-stage-motto">{stageInfo.motto}</span>
      </div>

      {/* Sélecteur tactile d'étapes */}
      <div className="house-stepper-bar">
        {STAGES.map((s, idx) => {
          const isActive = idx === currentStage;
          const isPassed = idx <= currentStage;
          return (
            <button
              key={s.step}
              type="button"
              className={`house-step-btn ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
              onClick={() => handleSelectStage(idx)}
              title={s.label}
            >
              <span className="step-num">{s.step}</span>
              <span className="step-name">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Note poétique du projet */}
      <div className="house-moral-note">
        <span>✨ Un foyer ne naît pas tout fait : il se bâtit chaque jour, pas à pas, par nos actes et notre amour.</span>
      </div>
    </div>
  );
}
