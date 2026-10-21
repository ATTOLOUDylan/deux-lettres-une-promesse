import { useState } from 'react';
import { letters } from '../lovegame/content/letters';
import { asset } from '../lovegame/assets';
import AudioPlayer from './AudioPlayer';
import HouseConstructionView from './HouseConstructionView';
import { useProgression } from '../lovegame/state/ProgressionStore';

interface LetterModalProps {
  index: number;
  onClose: () => void;
  onSwitch?: (newIndex: number) => void; // Permet de basculer d'un écrit à un autre
  isJournalMode?: boolean; // Relecture libre depuis l'écran journal
}

function formatInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default function LetterModal({ index, onClose, onSwitch, isJournalMode }: LetterModalProps) {
  const progression = useProgression();
  const currentIndex = Math.max(0, Math.min(index, letters.length - 1));
  const currentLetter = letters[currentIndex];
  const [houseStage, setHouseStage] = useState(0);

  const handleSelectTab = (targetIdx: number) => {
    if (onSwitch) {
      onSwitch(targetIdx);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (currentIndex !== 1) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) return;
    const ratio = scrollTop / maxScroll;
    const computedStage = Math.min(5, Math.floor(ratio * 5.99));
    setHouseStage(computedStage);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="letter-modal">
        {/* En-tête avec avatar animé de Dylan lisant */}
        <div className="letter-head">
          <span className="reader-wrap" aria-hidden="true">
            <img className="reader reader-a" src={asset('characters/hero/read_0.png')} alt="" />
            <img className="reader reader-b" src={asset('characters/hero/read_1.png')} alt="" />
          </span>
          <div className="letter-head-text">
            {isJournalMode && <span className="journal-badge">Journal de nos Écrits</span>}
            <h2>{currentLetter.title}</h2>
          </div>
        </div>

        {/* Onglets de navigation entre les 3 écrits (Lettre 1, Lettre 2, Promesse) */}
        {onSwitch && (
          <div className="letter-tabs" role="tablist">
            {letters.map((lettre, i) => {
              // Vérifie si l'écrit est débloqué
              const isUnlocked =
                isJournalMode ||
                progression.unlockedLetters.includes(i) ||
                i === currentIndex ||
                (i === 2 && progression.chapters['epilogue'] === 'completed');

              return (
                <button
                  key={lettre.id}
                  role="tab"
                  aria-selected={i === currentIndex}
                  className={`letter-tab-btn ${i === currentIndex ? 'on' : ''} ${!isUnlocked ? 'locked' : ''}`}
                  onClick={() => isUnlocked && handleSelectTab(i)}
                  disabled={!isUnlocked}
                  title={!isUnlocked ? 'Cet écrit n’a pas encore été découvert dans l’aventure' : lettre.title}
                >
                  {lettre.tabLabel} {!isUnlocked && '🔒'}
                </button>
              );
            })}
          </div>
        )}

        {/* Lecteur Audio personnalisé : une seule voix à la fois + fallback chaleureux */}
        <AudioPlayer
          key={currentLetter.id}
          src={currentLetter.audio}
          fallbackMessage={`L’enregistrement vocal de Dylan pour « ${currentLetter.tabLabel} » n’a pas encore été déposé. Tu peux lire chaque mot avec tout ton cœur en attendant ! ❤️`}
        />

        {/* Pour la Lettre 2 : la maison qui se construit pendant la lecture */}
        {currentIndex === 1 && (
          <HouseConstructionView
            stage={houseStage}
            onStageChange={(s) => setHouseStage(s)}
          />
        )}

        {/* Corps du texte complet */}
        <div className="letter-body" onScroll={handleScroll}>
          {currentLetter.paragraphs.map((p, pIdx) => (
            <p key={pIdx}>{formatInline(p)}</p>
          ))}
        </div>

        {/* Pied de page : pas de fermeture automatique, contrôle utilisateur explicite */}
        <div className="letter-modal-footer">
          <button className="primary" onClick={onClose}>
            {isJournalMode ? 'Fermer le journal' : 'Continuer l’aventure'}
          </button>
        </div>
      </div>
    </div>
  );
}
