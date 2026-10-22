import { useState, useEffect, useRef, useCallback } from 'react';
import { AUTO, Game, Scale } from 'phaser';
import { UNIVERSITY_CONTENT, HALLWAY_CONFIG } from '../../lovegame/content/university';
import { UniversityHallwayScene } from '../../lovegame/scenes/UniversityHallwayScene';
import DialogueBox from '../DialogueBox';
import PuzzleModal from '../puzzles/PuzzleModal';
import { progressionStore, useProgression } from '../../lovegame/state/ProgressionStore';
import { HIDDEN_HEARTS, OPTIONAL_MEMORIES, OptionalMemory } from '../../lovegame/content/collectibles';
import LibraryCatModal from '../modals/LibraryCatModal';
import MemoryModal from '../modals/MemoryModal';
import UniversityGateCinematic from './UniversityGateCinematic';
import ClassroomEncounter from './ClassroomEncounter';
import { bus } from '../../lovegame/bus';
import { VIEW_W, VIEW_H } from '../../lovegame/levels';
import './Chapter1University.css';

interface Chapter1UniversityProps {
  onComplete: () => void;
  onBackToMenu?: () => void;
}

type ActiveView = 'corridor' | 'puzzle_b' | 'classroom_c' | 'completed';

// Définition des points de navigation scénarisés (1 à 10 - Style Maquette)
const NAV_POINTS = [
  { id: 'board', x: HALLWAY_CONFIG.noticeboardX, label: 'Tableau d’affichage', type: 'view' },
  { id: 'npc-etudiante', x: HALLWAY_CONFIG.studentGirlX, label: 'L’Étudiante Curieuse', type: 'npc' },
  { id: 'salle-a', x: HALLWAY_CONFIG.doorAX, label: 'Salle A', type: 'door' },
  { id: 'bench', x: HALLWAY_CONFIG.benchX, label: 'Le Banc', type: 'view' },
  { id: 'npc-distrait', x: HALLWAY_CONFIG.studentBoyX, label: 'L’Étudiant Distrait', type: 'npc' },
  { id: 'souvenir-note', x: HALLWAY_CONFIG.memoryNoteX, label: 'Petit mot caché', type: 'memory' },
  { id: 'chat-bibliotheque', x: HALLWAY_CONFIG.catX, label: 'Chat de la Bibliothèque', type: 'cat' },
  { id: 'salle-b', x: HALLWAY_CONFIG.doorBX, label: 'Salle B', type: 'door' },
  { id: 'npc-gardien', x: HALLWAY_CONFIG.guardX, label: 'Le Gardien Bienveillant', type: 'npc' },
  { id: 'salle-c', x: HALLWAY_CONFIG.doorCX, label: 'Salle C', type: 'door' },
];

export default function Chapter1University({ onComplete, onBackToMenu }: Chapter1UniversityProps) {
  const progression = useProgression();
  const [showCutscene, setShowCutscene] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<ActiveView>('corridor');
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [showCatModal, setShowCatModal] = useState<boolean>(false);
  const [selectedMemory, setSelectedMemory] = useState<OptionalMemory | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isPhaserReady, setIsPhaserReady] = useState<boolean>(false);

  const phaserGameRef = useRef<Game | null>(null);
  const noticeTimerRef = useRef<number | undefined>(undefined);

  const hasLieuIndice = !!progression.missions['indice_lieu_rencontre'];
  const hasObjetIndice = !!progression.missions['objet_distrait_trouve'];
  const hasCle = !!progression.missions['cle_gardien_obtenue'];

  const triggerNotice = useCallback((msg: string) => {
    setNoticeMessage(msg);
    window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNoticeMessage(null), 4500);
  }, []);

  // Initialisation Phaser
  useEffect(() => {
    if (showCutscene || activeView !== 'corridor') return;

    const containerId = 'university-hallway-phaser-container';
    if (!phaserGameRef.current) {
      console.log('[Chapter1] Initialisation de la scène panoramique...');
      const game = new Game({
        type: AUTO,
        parent: containerId,
        width: VIEW_W,
        height: VIEW_H,
        backgroundColor: '#0b1030',
        scale: { mode: Scale.FIT, autoCenter: Scale.CENTER_BOTH },
        scene: [UniversityHallwayScene],
        // Désactiver explicitement le clavier global pour éviter les interférences
        input: { keyboard: true }, 
      });

      game.events.once('ready', () => {
        console.log('[Chapter1] Phaser est prêt.');
        // On attend un court instant que la scène soit créée
        setTimeout(() => setIsPhaserReady(true), 500);
      });

      phaserGameRef.current = game;
    }

    return () => {
      if (phaserGameRef.current) {
        console.log('[Chapter1] Destruction de la scène.');
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
        setIsPhaserReady(false);
      }
    };
  }, [showCutscene, activeView]);

  // Logique de navigation scénarisée
  const handleNavigate = async (point: typeof NAV_POINTS[0]) => {
    if (isTransitioning || !isPhaserReady || activeDialogueId || showCatModal || selectedMemory) {
      console.log('[Chapter1] Navigation bloquée :', { isTransitioning, isPhaserReady, activeDialogueId });
      return;
    }

    setIsTransitioning(true);
    
    try {
      const scene = phaserGameRef.current?.scene.getScene('UniversityHallway') as UniversityHallwayScene;
      
      if (!scene) {
        console.warn('[Chapter1] Scène non trouvée !');
        setIsTransitioning(false);
        return;
      }

      console.log(`[Chapter1] Déplacement vers : ${point.label} (x=${point.x})`);
      await scene.focusOn(point.x);

      // Déclencher l'interaction correspondante
      if (point.type === 'view') {
        if (point.id === 'board') {
          const isNew = progressionStore.unlockHiddenHeart('coeur-cache-univ-1');
          if (isNew) bus.emit('toast', '💖 Dylan passait au moins 10 minutes à relire ses messages avant d’oser appuyer sur “Envoyer” ! 😂');
        }
      } else if (point.type === 'npc') {
        if (point.id === 'npc-etudiante') setActiveDialogueId('etudiante-curieuse-intro');
        else if (point.id === 'npc-distrait') setActiveDialogueId('etudiant-distrait-intro');
        else if (point.id === 'npc-gardien') {
          const isNew = progressionStore.unlockHiddenHeart('coeur-cache-univ-2');
          if (isNew) bus.emit('toast', '💖 Le jour de votre premier regard, le rythme cardiaque de Dylan a battu tous les records universitaires !');

          if (hasCle) setActiveDialogueId('gardien-deja-cle');
          else if (hasLieuIndice && hasObjetIndice) setActiveDialogueId('gardien-intro');
          else if (!hasLieuIndice && !hasObjetIndice) setActiveDialogueId('gardien-refus-deux-indices');
          else if (!hasLieuIndice && hasObjetIndice) setActiveDialogueId('gardien-refus-lieu');
          else if (hasLieuIndice && !hasObjetIndice) setActiveDialogueId('gardien-refus-objet');
        }
      } else if (point.type === 'door') {
        if (point.id === 'salle-a') setActiveDialogueId('flashback-hesitation-garcon');
        else if (point.id === 'salle-b') {
          setActivePuzzleId('puzzle-souvenirs-intro');
          setActiveView('puzzle_b');
        } else if (point.id === 'salle-c') {
          if (!hasCle) {
            triggerNotice('🔒 La Salle C est fermée à double tour ! Réunis la piste pour obtenir la clé du Gardien.');
          } else {
            setActiveView('classroom_c');
          }
        }
      } else if (point.type === 'cat') {
        setShowCatModal(true);
      } else if (point.type === 'memory') {
        const mem = OPTIONAL_MEMORIES.find(m => m.id === 'souvenir-note-encourageante');
        if (mem) {
          progressionStore.unlockMemory(mem.id);
          setSelectedMemory(mem);
        }
      }
    } catch (error) {
      console.error('[Chapter1] Erreur lors de la navigation :', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleDialogueClose = () => {
    const wasDialogue = activeDialogueId;
    setActiveDialogueId(null);
    if (wasDialogue === 'gardien-cle' || (progression.missions['cle_gardien_obtenue'] && !hasCle)) {
      bus.emit('university-key-obtained');
      triggerNotice('🗝️ Clé de la Salle C obtenue ! Tu peux maintenant aller retrouver Dylan au bout du couloir.');
    }
  };

  if (showCutscene) {
    return <UniversityGateCinematic onComplete={() => setShowCutscene(false)} onBackToMenu={onBackToMenu} initialStage="campus_arrival" />;
  }

  if (activeView === 'completed') {
    return (
      <div className="chapter1-completion-stage">
        <div className="chapter1-completion-card">
          <div className="completion-star-icon">💖 ✨ 🏛️</div>
          <h2>{UNIVERSITY_CONTENT.rewardTitle}</h2>
          <div className="memory-fragment-box">
            <span className="fragment-label">Souvenir gravé dans votre histoire :</span>
            <strong className="fragment-text">{UNIVERSITY_CONTENT.rewardDesc}</strong>
          </div>
          <p className="completion-summary">{UNIVERSITY_CONTENT.transitionMessage}</p>
          <button className="chapter1-finish-btn" onClick={() => { progressionStore.completeChapter('chapitre-1', 'chapitre-2'); onComplete(); }}>
            {UNIVERSITY_CONTENT.nextChapterButton}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="corridor-viewport" role="main">
      <header className="corridor-topbar">
        <div className="corridor-title-group">
          <span className="topbar-badge">Chapitre 1</span>
          <h2 className="topbar-heading">Couloir de l’Université</h2>
        </div>

        <div className="corridor-clues-hud">
          <div className={`clue-pill ${hasLieuIndice ? 'done' : ''}`}>
            <span>🏫 {hasLieuIndice ? 'Lieu : Salle C ✓' : 'Lieu : Inconnu'}</span>
          </div>
          <div className={`clue-pill ${hasObjetIndice ? 'done' : ''}`}>
            <span>📝 {hasObjetIndice ? 'Objet : Carnet ✓' : 'Objet : Inconnu'}</span>
          </div>
          <div className={`clue-pill ${hasCle ? 'done' : ''}`}>
            <span>🗝️ {hasCle ? 'Clé de Salle C ✓' : 'Clé : Verrouillée'}</span>
          </div>
        </div>

        <div className="corridor-actions-group">
          <button type="button" className="topbar-btn cat-btn" onClick={() => setShowCatModal(true)}>
            <span>Chat</span>
          </button>
          <button type="button" className="topbar-btn replay-btn" onClick={() => setShowCutscene(true)}>
            🎬 Arrivée
          </button>
          {onBackToMenu && <button type="button" className="topbar-btn menu-btn" onClick={onBackToMenu}>← Menu</button>}
        </div>
      </header>

      {noticeMessage && <div className="corridor-toast-notice">{noticeMessage}</div>}

      <div id="university-hallway-phaser-container" className="university-hallway-canvas" />

      {/* Interface de navigation numérotée (Style Maquette) */}
      <nav className="corridor-nav-ui">
        {NAV_POINTS.map((point, index) => (
          <button
            key={point.id}
            className={`nav-bubble ${isTransitioning || !isPhaserReady ? 'disabled' : ''}`}
            onClick={() => handleNavigate(point)}
            title={point.label}
          >
            {isPhaserReady ? index + 1 : '...'}
          </button>
        ))}
      </nav>

      {activeView === 'classroom_c' && (
        <ClassroomEncounter
          onComplete={() => { progressionStore.unlockMemory('souvenir-premiere-rencontre'); setActiveView('completed'); }}
          onExit={() => setActiveView('corridor')}
        />
      )}

      {activeDialogueId && <DialogueBox dialogueId={activeDialogueId} onClose={handleDialogueClose} />}
      {activeView === 'puzzle_b' && activePuzzleId && (
        <PuzzleModal puzzleId={activePuzzleId} onClose={() => { setActivePuzzleId(null); setActiveView('corridor'); }} />
      )}
      {showCatModal && <LibraryCatModal onClose={() => setShowCatModal(false)} />}
      {selectedMemory && <MemoryModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />}
    </div>
  );
}
