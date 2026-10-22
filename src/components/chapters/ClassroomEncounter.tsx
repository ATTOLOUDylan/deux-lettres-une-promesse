import { useState } from 'react';
import { asset } from '../../lovegame/assets';
import DialogueBox from '../DialogueBox';
import { progressionStore } from '../../lovegame/state/ProgressionStore';
import { bus } from '../../lovegame/bus';

interface ClassroomEncounterProps {
  onComplete: () => void;
  onExit: () => void;
}

export default function ClassroomEncounter({ onComplete, onExit }: ClassroomEncounterProps) {
  const [activeDialogue, setActiveDialogue] = useState<string | null>('rencontre-garcon-salut');
  const [inspectedObject, setInspectedObject] = useState<string | null>(null);
  const [isDialogueFinished, setIsDialogueFinished] = useState<boolean>(false);

  const handleDialogueClose = () => {
    setActiveDialogue(null);
    setIsDialogueFinished(true);
    progressionStore.unlockMemory('souvenir-premiere-rencontre');
    bus.emit('toast', '✨ Moment gravé à jamais dans votre cœur ❤️');
  };

  const handleInspectChalkboard = () => {
    setInspectedObject('tableau');
  };

  const handleInspectNotebook = () => {
    setInspectedObject('carnet');
  };

  return (
    <div
      className="classroom-stage"
      style={{
        backgroundImage: `url(${asset('backgrounds/university_classroom.jpg')})`,
      }}
    >
      <div className="classroom-atmosphere-overlay" />

      {/* Bouton retour vers le couloir */}
      <button
        type="button"
        className="classroom-exit-btn"
        onClick={onExit}
        title="Retourner dans le couloir"
      >
        ← Couloir
      </button>

      {/* Dylan dans la salle de classe */}
      <div className="classroom-dylan-presence">
        <div className="dylan-sprite-card" onClick={() => !activeDialogue && setActiveDialogue('rencontre-garcon-salut')}>
          <div className="dylan-halo" />
          <img
            src={asset('characters/hero/dylan_portrait.jpg')}
            alt="Dylan dans la salle"
            className="dylan-full-sprite"
          />
          <div className="dylan-nameplate">
            <span>Dylan ❤️</span>
          </div>
        </div>
      </div>

      {/* Objets interactifs dans la salle */}
      <div className="classroom-hotspots">
        {/* Le tableau noir */}
        <button
          type="button"
          className="hotspot-item hotspot-chalkboard"
          onClick={handleInspectChalkboard}
          title="Regarder le tableau noir"
        >
          <span className="hotspot-icon">📝</span>
          <span className="hotspot-label">Le tableau</span>
        </button>

        {/* Le carnet sur la table */}
        <button
          type="button"
          className="hotspot-item hotspot-desk"
          onClick={handleInspectNotebook}
          title="Examiner le carnet de Dylan"
        >
          <span className="hotspot-icon">📖</span>
          <span className="hotspot-label">Le carnet</span>
        </button>
      </div>

      {/* Dialogue actif */}
      {activeDialogue && (
        <DialogueBox
          dialogueId={activeDialogue}
          onClose={handleDialogueClose}
        />
      )}

      {/* Fenêtre d'inspection d'objet */}
      {inspectedObject === 'tableau' && (
        <div className="object-modal-overlay" onClick={() => setInspectedObject(null)}>
          <div className="object-modal-card" onClick={(e) => e.stopPropagation()}>
            <span className="modal-icon">🏫</span>
            <h3>Le Tableau de la Salle C</h3>
            <p>
              Quelqu’un a effacé les équations du cours précédent. Tout en bas, dans un coin discret,
              se trouve un petit cœur esquissé à la craie blanche avec deux lettres : <strong>D &amp; …</strong>
            </p>
            <button className="primary" onClick={() => setInspectedObject(null)}>
              Sourire et refermer 😊
            </button>
          </div>
        </div>
      )}

      {inspectedObject === 'carnet' && (
        <div className="object-modal-overlay" onClick={() => setInspectedObject(null)}>
          <div className="object-modal-card" onClick={(e) => e.stopPropagation()}>
            <span className="modal-icon">📔</span>
            <h3>Le Carnet de Notes de Dylan</h3>
            <p>
              Sur la première page, plusieurs phrases raturées : <br />
              <em>« Salut, je m'appelle Dylan… »</em> (barré) <br />
              <em>« Tu as compris le dernier cours ? »</em> (barré) <br />
              <em>« Sois juste toi-même, dis-lui bonjour. »</em> (entouré d’une étoile ✨)
            </p>
            <button className="primary" onClick={() => setInspectedObject(null)}>
              Refermer avec tendresse ❤️
            </button>
          </div>
        </div>
      )}

      {/* Écran de victoire / accomplissement après dialogue */}
      {isDialogueFinished && !activeDialogue && (
        <div className="classroom-completion-banner">
          <div className="completion-content">
            <span className="completion-icon">💖</span>
            <div className="completion-texts">
              <h4>Votre Premier Instant Gravé</h4>
              <p>Tu as retrouvé Dylan. La complicité commence ici…</p>
            </div>
            <button
              type="button"
              className="completion-btn"
              onClick={onComplete}
            >
              Passer au Chapitre Suivant ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
