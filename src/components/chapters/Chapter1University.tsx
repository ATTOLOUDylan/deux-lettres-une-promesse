import { useState } from 'react';
import { UNIVERSITY_CONTENT, UNIVERSITY_NPCS, UNIVERSITY_ROOMS, UniversityNpc, UniversityRoomConfig } from '../../lovegame/content/university';
import DialogueBox from '../DialogueBox';
import PuzzleModal from '../puzzles/PuzzleModal';
import { progressionStore, useProgression } from '../../lovegame/state/ProgressionStore';
import { HIDDEN_HEARTS, OPTIONAL_MEMORIES, OptionalMemory } from '../../lovegame/content/collectibles';
import LibraryCatModal from '../modals/LibraryCatModal';
import MemoryModal from '../modals/MemoryModal';
import { bus } from '../../lovegame/bus';

interface Chapter1UniversityProps {
  onComplete: () => void;
  onBackToMenu?: () => void;
}

type ActiveView = 'hub' | 'dialogue' | 'flashback_a' | 'puzzle_b' | 'encounter_c' | 'completed';

export default function Chapter1University({ onComplete, onBackToMenu }: Chapter1UniversityProps) {
  const progression = useProgression();
  const [activeView, setActiveView] = useState<ActiveView>('hub');
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);
  const [roomAlert, setRoomAlert] = useState<string | null>(null);
  const [showCatModal, setShowCatModal] = useState<boolean>(false);
  const [selectedMemory, setSelectedMemory] = useState<OptionalMemory | null>(null);

  const hasLieuIndice = !!progression.missions['indice_lieu_rencontre'];
  const hasObjetIndice = !!progression.missions['objet_distrait_trouve'];
  const hasCle = !!progression.missions['cle_gardien_obtenue'];
  const hasSouvenirA = !!progression.missions['souvenir_hesitation_vu'];
  const hasPuzzleB = progressionStore.isPuzzleSolved('puzzle-souvenirs-intro');
  const isEncounterDone = !!progression.missions['premiere_rencontre_validee'];

  // Interaction PNJ
  const handleTalkToNpc = (npc: UniversityNpc) => {
    setActiveDialogueId(npc.dialogueId);
    setActiveView('dialogue');
  };

  // Interaction Salle
  const handleEnterRoom = (room: UniversityRoomConfig) => {
    setRoomAlert(null);
    if (!room.isUnlocked(progression)) {
      setRoomAlert(room.lockedReason);
      return;
    }

    if (room.id === 'salle-a') {
      setActiveDialogueId('flashback-hesitation-garcon');
      setActiveView('flashback_a');
    } else if (room.id === 'salle-b') {
      setActivePuzzleId(room.puzzleId || 'puzzle-souvenirs-intro');
      setActiveView('puzzle_b');
    } else if (room.id === 'salle-c') {
      setActiveDialogueId('rencontre-garcon-salut');
      setActiveView('encounter_c');
    }
  };

  const handleDialogueClose = () => {
    setActiveDialogueId(null);
    if (activeView === 'encounter_c' || progression.missions['premiere_rencontre_validee']) {
      progressionStore.unlockMemory('souvenir-premiere-rencontre');
      setActiveView('completed');
    } else {
      setActiveView('hub');
    }
  };

  const handlePuzzleClose = () => {
    setActivePuzzleId(null);
    setActiveView('hub');
  };

  const handleFinishChapter = () => {
    progressionStore.completeChapter('chapitre-1', 'chapitre-2');
    onComplete();
  };

  const handleHeartClick = (heartId: string) => {
    const isNew = progressionStore.unlockHiddenHeart(heartId);
    const info = HIDDEN_HEARTS.find((h) => h.id === heartId);
    if (info) {
      bus.emit('toast', isNew ? `💖 ${info.anecdote}` : `💖 Déjà trouvé : ${info.title}`);
    }
  };

  const handleMemoryClick = (memoryId: string) => {
    progressionStore.unlockMemory(memoryId);
    const mem = OPTIONAL_MEMORIES.find((m) => m.id === memoryId);
    if (mem) {
      setSelectedMemory(mem);
      bus.emit('toast', `✨ Souvenir débloqué : ${mem.title} !`);
    }
  };

  return (
    <div className="chapter1-container" role="main">
      {/* HUB PRINCIPAL DU COULOIR DE L'UNIVERSITÉ */}
      {(activeView === 'hub' || activeView === 'dialogue') && (
        <div className="chapter1-hub">
          {/* En-tête */}
          <div className="hub-header">
            <div className="hub-badge">
              <span>{UNIVERSITY_CONTENT.title}</span>
            </div>
            <h2>Le Couloir de l’Université</h2>
            <p className="hub-subtitle">{UNIVERSITY_CONTENT.hubSubtitle}</p>
          </div>

          {/* Bandeau d'aide féline : Le Chat de la Bibliothèque */}
          <div
            className="cat-helper-banner"
            onClick={() => setShowCatModal(true)}
            role="button"
            tabIndex={0}
          >
            <span className="cat-banner-avatar">🐱</span>
            <div className="cat-banner-text">
              <strong>Le Chat de la Bibliothèque est assoupi ici…</strong>
              <span>« Besoin d’un indice ou envie de papouilles ? Viens me parler ! »</span>
            </div>
            <button type="button" className="cat-banner-btn">
              Parler au Chat 🐾
            </button>
          </div>

          {/* Alertes d'accès aux salles */}
          {roomAlert && (
            <div className="room-alert-box" role="alert">
              <span className="room-alert-icon">🔒</span>
              <p>{roomAlert}</p>
            </div>
          )}

          {/* Bandeau d'indices collectés */}
          <div className="clues-dashboard">
            <span className="clues-title">{UNIVERSITY_CONTENT.cluesHeader}</span>
            <div className="clues-badges-row">
              <div className={`clue-chip ${hasLieuIndice ? 'found' : 'missing'}`}>
                <span>🏫 Lieu :</span> {hasLieuIndice ? 'Salle de cours déserte' : 'À découvrir…'}
              </div>
              <div className={`clue-chip ${hasObjetIndice ? 'found' : 'missing'}`}>
                <span>📝 Objet :</span> {hasObjetIndice ? 'Carnet de notes' : 'À découvrir…'}
              </div>
              <div className={`clue-chip ${hasCle ? 'found' : 'missing'}`}>
                <span>🗝️ Clé :</span> {hasCle ? 'Clé de la Salle C obtenue' : 'À obtenir du Gardien'}
              </div>
            </div>
          </div>

          {/* Section 1 : Les 3 PNJ à interroger */}
          <div className="hub-section">
            <h3 className="section-title">Personnes présentes dans le couloir</h3>
            <div className="npcs-grid">
              {UNIVERSITY_NPCS.map((npc) => {
                const isDone = !!progression.missions[npc.missionKey];
                return (
                  <div
                    key={npc.id}
                    className={`npc-card ${isDone ? 'done' : ''}`}
                    onClick={() => handleTalkToNpc(npc)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="npc-avatar-wrap" style={{ borderColor: npc.color }}>
                      <span className="npc-avatar">{npc.avatar}</span>
                    </div>
                    <div className="npc-info">
                      <strong className="npc-name" style={{ color: npc.color }}>
                        {npc.name}
                      </strong>
                      <span className="npc-role">{npc.role}</span>
                      <span className="npc-loc">{npc.location}</span>
                    </div>
                    <button className="npc-talk-btn">
                      {isDone ? 'Reparler 💬' : 'Interroger 💬'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2 : Les 3 Salles à explorer */}
          <div className="hub-section">
            <h3 className="section-title">Salles et Souvenirs du bâtiment</h3>
            <div className="rooms-grid">
              {UNIVERSITY_ROOMS.map((room) => {
                const isUnlocked = room.isUnlocked(progression);
                let isCompleted = false;
                if (room.id === 'salle-a') isCompleted = hasSouvenirA;
                if (room.id === 'salle-b') isCompleted = hasPuzzleB;
                if (room.id === 'salle-c') isCompleted = isEncounterDone;

                return (
                  <div
                    key={room.id}
                    className={`room-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => handleEnterRoom(room)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="room-icon-wrap">
                      <span className="room-icon">{room.icon}</span>
                      {!isUnlocked && <span className="room-lock-badge">🔒</span>}
                      {isCompleted && <span className="room-check-badge">✓</span>}
                    </div>
                    <div className="room-info">
                      <strong className="room-name">{room.name}</strong>
                      <span className="room-subtitle">{room.subtitle}</span>
                      <p className="room-desc">{room.description}</p>
                    </div>
                    <button className="room-enter-btn">
                      {isUnlocked ? (isCompleted ? 'Revisiter ✨' : 'Entrer 🚪') : 'Verrouillée 🔒'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3 : Objets & Cœurs secrets du couloir (Facultatif) */}
          <div className="hub-section optional-collectibles-section">
            <div className="section-title-wrap">
              <span className="section-icon">✨</span>
              <h3 className="section-title">Recoins Secrets & Souvenirs Facultatifs</h3>
            </div>
            <p className="section-hint">
              Activités secondaires non obligatoires pour dénicher des anecdotes et de précieux souvenirs.
            </p>

            <div className="collectibles-grid">
              {/* Cœur Secret 1 */}
              {(() => {
                const isFound = progressionStore.isHeartFound('coeur-cache-univ-1');
                return (
                  <div
                    className={`collectible-card ${isFound ? 'collected' : 'uncollected'}`}
                    onClick={() => handleHeartClick('coeur-cache-univ-1')}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="collectible-icon">{isFound ? '💖' : '🤍'}</span>
                    <div className="collectible-info">
                      <strong>Cœur du Tableau</strong>
                      <span>{isFound ? 'Découvert (anecdote révélée)' : 'Derrière les affiches…'}</span>
                    </div>
                    <span className="collectible-status">{isFound ? 'Trouvé ✨' : 'Inspecter 🔍'}</span>
                  </div>
                );
              })()}

              {/* Cœur Secret 2 */}
              {(() => {
                const isFound = progressionStore.isHeartFound('coeur-cache-univ-2');
                return (
                  <div
                    className={`collectible-card ${isFound ? 'collected' : 'uncollected'}`}
                    onClick={() => handleHeartClick('coeur-cache-univ-2')}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="collectible-icon">{isFound ? '💖' : '🤍'}</span>
                    <div className="collectible-info">
                      <strong>Cœur de la Bibliothèque</strong>
                      <span>{isFound ? 'Découvert (anecdote révélée)' : 'Près des rayonnages…'}</span>
                    </div>
                    <span className="collectible-status">{isFound ? 'Trouvé ✨' : 'Inspecter 🔍'}</span>
                  </div>
                );
              })()}

              {/* Souvenir Note */}
              {(() => {
                const isUnlocked = progressionStore.isMemoryUnlocked('souvenir-note-encourageante');
                return (
                  <div
                    className={`collectible-card ${isUnlocked ? 'collected' : 'uncollected'}`}
                    onClick={() => handleMemoryClick('souvenir-note-encourageante')}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="collectible-icon">📝</span>
                    <div className="collectible-info">
                      <strong>Mot d’Encouragement</strong>
                      <span>{isUnlocked ? 'Relire le mot' : 'Glissé sous un livre…'}</span>
                    </div>
                    <span className="collectible-status">{isUnlocked ? 'Débloqué ✨' : 'Découvrir 🔍'}</span>
                  </div>
                );
              })()}

              {/* Souvenir Porte-clé */}
              {(() => {
                const isUnlocked = progressionStore.isMemoryUnlocked('souvenir-porte-cle-complice');
                return (
                  <div
                    className={`collectible-card ${isUnlocked ? 'collected' : 'uncollected'}`}
                    onClick={() => handleMemoryClick('souvenir-porte-cle-complice')}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="collectible-icon">🗝️</span>
                    <div className="collectible-info">
                      <strong>Porte-Clé Complice</strong>
                      <span>{isUnlocked ? 'Examiner le souvenir' : 'Dans un casier entrouvert…'}</span>
                    </div>
                    <span className="collectible-status">{isUnlocked ? 'Débloqué ✨' : 'Découvrir 🔍'}</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {onBackToMenu && (
            <button className="hub-back-btn" onClick={onBackToMenu}>
              ← Revoir la carte du voyage
            </button>
          )}
        </div>
      )}

      {/* MODALE DU CHAT DE LA BIBLIOTHÈQUE */}
      {showCatModal && (
        <LibraryCatModal onClose={() => setShowCatModal(false)} />
      )}

      {/* MODALE DE SOUVENIR FACULTATIF */}
      {selectedMemory && (
        <MemoryModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}

      {/* OVERLAY DIALOGUE (PNJ OU HISTOIRE) */}
      {activeDialogueId && (
        <DialogueBox
          dialogueId={activeDialogueId}
          onClose={handleDialogueClose}
        />
      )}

      {/* SALLE A : FLASHBACK VISUEL D'HÉSITATION */}
      {activeView === 'flashback_a' && !activeDialogueId && (
        <div className="flashback-stage">
          <div className="flashback-visual-card">
            <div className="flashback-halo">✨</div>
            <h3>Le Souvenir Perdu</h3>
            <p className="flashback-caption">
              Ce jour-là, Dylan faisait les cent pas dans le couloir, le cœur battant à tout rompre,
              avant de trouver le courage de venir te parler…
            </p>
            <div className="flashback-actors">
              <span className="actor-him">👦 Dylan (stressé)</span>
              <span className="actor-cupidon">👼 Cupidon (« Allez champion ! »)</span>
            </div>
            <button
              className="flashback-exit-btn"
              onClick={() => setActiveView('hub')}
            >
              Retourner dans le couloir 🏛️
            </button>
          </div>
        </div>
      )}

      {/* SALLE B : ÉNIGME DU TABLEAU DES SOUVENIRS */}
      {activeView === 'puzzle_b' && activePuzzleId && (
        <PuzzleModal
          puzzleId={activePuzzleId}
          onClose={handlePuzzleClose}
        />
      )}

      {/* ÉCRAN DE COMPLÉTION DU CHAPITRE 1 */}
      {activeView === 'completed' && (
        <div className="chapter1-completion-stage">
          <div className="chapter1-completion-card">
            <div className="completion-star-icon">💖 ✨ 🏛️</div>
            <h2>{UNIVERSITY_CONTENT.rewardTitle}</h2>
            <div className="memory-fragment-box">
              <span className="fragment-label">Souvenir gravé dans votre histoire :</span>
              <strong className="fragment-text">{UNIVERSITY_CONTENT.rewardDesc}</strong>
            </div>
            <p className="completion-summary">{UNIVERSITY_CONTENT.transitionMessage}</p>
            <button className="chapter1-finish-btn" onClick={handleFinishChapter}>
              {UNIVERSITY_CONTENT.nextChapterButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
