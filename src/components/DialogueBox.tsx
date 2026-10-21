import { useEffect, useRef, useState, useCallback } from 'react';
import { DIALOGUES, DialogueNode, DialogueOption } from '../lovegame/content/dialogues';
import { progressionStore, useProgression } from '../lovegame/state/ProgressionStore';
import { duckMusic } from '../lovegame/audio';
import { bus } from '../lovegame/bus';

interface DialogueBoxProps {
  dialogueId: string;
  onClose: () => void;
}

export default function DialogueBox({ dialogueId, onClose }: DialogueBoxProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>(dialogueId);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const progression = useProgression();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typingTimerRef = useRef<number | undefined>(undefined);

  const node: DialogueNode | undefined = DIALOGUES[currentNodeId];

  // Nettoyage audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
      duckMusic(false);
    }
  }, []);

  const handleFinishDialogue = useCallback((actionName?: string) => {
    stopAudio();
    if (actionName) {
      progressionStore.setMissionStatus(actionName, 'completed');
    }
    bus.emit('dialogue-closed', currentNodeId);
    onClose();
  }, [currentNodeId, onClose, stopAudio]);

  // Gestion du nœud courant & machine à écrire
  useEffect(() => {
    if (!node) {
      handleFinishDialogue();
      return;
    }

    const fullText = node.text;
    setDisplayedText('');
    setIsTyping(true);

    // Audio optionnel pour cette réplique
    stopAudio();
    if (node.audio) {
      const a = new Audio(node.audio);
      audioRef.current = a;
      duckMusic(true);
      a.play().catch(() => {});
      a.addEventListener('ended', () => duckMusic(false));
    }

    let i = 0;
    const step = () => {
      i += 2;
      if (i >= fullText.length) {
        setDisplayedText(fullText);
        setIsTyping(false);
      } else {
        setDisplayedText(fullText.slice(0, i));
        typingTimerRef.current = window.setTimeout(step, 18);
      }
    };
    typingTimerRef.current = window.setTimeout(step, 18);

    return () => {
      window.clearTimeout(typingTimerRef.current);
      stopAudio();
    };
  }, [currentNodeId, node, stopAudio, handleFinishDialogue]);

  if (!node) return null;

  // Filtrage des options selon leurs conditions
  const availableOptions: DialogueOption[] = (node.options || []).filter((opt) => {
    return opt.condition ? opt.condition(progression) : true;
  });

  const handleBoxClick = () => {
    // Si le texte est encore en train de défiler, un tap le révèle immédiatement
    if (isTyping) {
      window.clearTimeout(typingTimerRef.current);
      setDisplayedText(node.text);
      setIsTyping(false);
      return;
    }

    // S'il y a des choix de réponses, on oblige à cliquer sur un choix
    if (availableOptions.length > 0) {
      return;
    }

    // S'il y a une réplique suivante, on avance
    if (node.next) {
      if (node.action) {
        progressionStore.setMissionStatus(node.action, 'completed');
      }
      setCurrentNodeId(node.next);
    } else {
      // Fin du dialogue
      handleFinishDialogue(node.action);
    }
  };

  const handleSelectOption = (option: DialogueOption, e: React.MouseEvent) => {
    e.stopPropagation();
    if (option.action) {
      progressionStore.setMissionStatus(option.action, 'completed');
    }

    if (option.puzzleId) {
      handleFinishDialogue(option.action);
      bus.emit('start-puzzle', option.puzzleId);
      return;
    }

    if (option.next) {
      setCurrentNodeId(option.next);
    } else {
      handleFinishDialogue(node.action);
    }
  };

  return (
    <div className="dialogue-overlay" onClick={handleBoxClick} role="dialog" aria-modal="true">
      <div className="dialogue-box">
        <div className="dialogue-header">
          {node.speaker.avatar && (
            <span className="dialogue-avatar" aria-hidden="true">
              {node.speaker.avatar}
            </span>
          )}
          <div className="dialogue-speaker-info">
            <span className="dialogue-speaker-name" style={{ color: node.speaker.color || 'var(--gold)' }}>
              {node.speaker.name}
            </span>
            {node.speaker.title && (
              <span className="dialogue-speaker-title">{node.speaker.title}</span>
            )}
          </div>
        </div>

        <div className="dialogue-content">
          <p>{displayedText}</p>
        </div>

        {!isTyping && availableOptions.length > 0 && (
          <div className="dialogue-options">
            {availableOptions.map((opt, idx) => (
              <button
                key={idx}
                className="dialogue-choice"
                onClick={(e) => handleSelectOption(opt, e)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        )}

        {!isTyping && availableOptions.length === 0 && (
          <div className="dialogue-prompt-hint">
            <span>{node.next ? 'Tap pour continuer ▶' : 'Tap pour fermer ✕'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
