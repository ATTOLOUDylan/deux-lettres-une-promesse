import { useState } from 'react';
import { asset } from '../../lovegame/assets';

interface UniversityArrivalCutsceneProps {
  onComplete: () => void;
}

interface NarrativeSlide {
  badge: string;
  title: string;
  text: string;
  quote?: string;
}

const NARRATIVE_SLIDES: NarrativeSlide[] = [
  {
    badge: '🏛️ Campus Universitaire — Fin d’après-midi',
    title: 'Une fin de journée dorée',
    text: 'Le soleil d’or commence à descendre sur le campus. Partout autour de toi, les rires et les conversations des étudiants s’estompent doucement avec la fin des cours.',
    quote: '« Tout semblait ordinaire ce jour-là… et pourtant. »',
  },
  {
    badge: '✨ Le Destin en marche',
    title: 'Quelque part dans ces allées',
    text: 'C’est dans cette atmosphère paisible qu’un jeune homme, un carnet serré contre son cœur, rassemblait tout son courage. Il attendait l’instant parfait pour t’adresser la parole.',
    quote: '« Tu ne le savais pas encore, mais nos chemins allaient se lier pour toujours. »',
  },
  {
    badge: '🚪 Devant le grand bâtiment',
    title: 'Franchir le seuil',
    text: 'Tu t’avances le long de l’allée arborée vers les portes vitrées du bâtiment principal. Une douce curiosité te pousse vers l’intérieur…',
    quote: '« Prête à revivre notre premier regard ? »',
  },
];

export default function UniversityArrivalCutscene({ onComplete }: UniversityArrivalCutsceneProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isTransitioningOut, setIsTransitioningOut] = useState<boolean>(false);

  const slide = NARRATIVE_SLIDES[currentStep];
  const isLastStep = currentStep === NARRATIVE_SLIDES.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setIsTransitioningOut(true);
      setTimeout(() => {
        onComplete();
      }, 900);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    setIsTransitioningOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div className={`cutscene-overlay ${isTransitioningOut ? 'fade-out-white' : ''}`}>
      {/* Fond animé avec effet Ken Burns */}
      <div
        className="cutscene-bg-campus"
        style={{
          backgroundImage: `url(${asset('backgrounds/university_campus.jpg')})`,
        }}
      />

      {/* Ambiance dorée & particules */}
      <div className="cutscene-atmosphere" />
      <div className="cutscene-vignette" />

      {/* Bouton pour passer l'intro */}
      <button
        type="button"
        className="cutscene-skip-btn"
        onClick={handleSkip}
        aria-label="Passer l’introduction"
      >
        Passer l’introduction ⏭️
      </button>

      {/* Boîte de narration cinématographique */}
      <div className="cutscene-dialogue-panel" onClick={handleNext}>
        <div className="cutscene-badge">
          <span>{slide.badge}</span>
        </div>

        <h3 className="cutscene-title">{slide.title}</h3>
        <p className="cutscene-text">{slide.text}</p>

        {slide.quote && (
          <p className="cutscene-quote">{slide.quote}</p>
        )}

        <div className="cutscene-footer">
          <div className="cutscene-dots">
            {NARRATIVE_SLIDES.map((_, idx) => (
              <span
                key={idx}
                className={`cutscene-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'passed' : ''}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="cutscene-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            {isLastStep ? 'Entrer dans le bâtiment 🏛️' : 'Continuer d’avancer ✨'}
          </button>
        </div>
      </div>
    </div>
  );
}
