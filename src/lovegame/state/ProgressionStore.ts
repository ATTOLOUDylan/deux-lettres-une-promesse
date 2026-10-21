import { useSyncExternalStore } from 'react';
import { ChapterId, ChapterStatus, MissionStatus, ProgressionState } from './types';
import { clearProgression, createInitialProgressionState, loadProgression, saveProgression } from './storage';
import { bus } from '../bus';

type Listener = () => void;

class ProgressionStore {
  private state: ProgressionState;
  private listeners = new Set<Listener>();

  constructor() {
    this.state = loadProgression();
  }

  public getState = (): Readonly<ProgressionState> => {
    return this.state;
  };

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify(): void {
    saveProgression(this.state);
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('[ProgressionStore] Erreur listener :', err);
      }
    });
    // Notification générale sur le bus pour les scènes Phaser
    bus.emit('progression-updated', this.state);
  }

  public hasSave(): boolean {
    return (
      this.state.unlockedLetters.length > 0 ||
      this.state.solvedPuzzles.length > 0 ||
      this.state.collectedFragments.length > 0 ||
      Object.keys(this.state.openedChestsByLevel).length > 0
    );
  }

  public setChapterStatus(id: ChapterId, status: ChapterStatus): void {
    if (this.state.chapters[id] === status) return;
    this.state.chapters[id] = status;
    this.notify();
  }

  public startChapter(id: ChapterId): void {
    this.state.currentChapter = id;
    this.state.chapters[id] = 'in_progress';
    this.notify();
  }

  public completeChapter(id: ChapterId, nextChapterId?: ChapterId): void {
    this.state.chapters[id] = 'completed';
    if (nextChapterId) {
      this.state.chapters[nextChapterId] = 'accessible';
      this.state.currentChapter = nextChapterId;
    }
    this.notify();
  }

  public setMissionStatus(id: string, status: MissionStatus): void {
    if (this.state.missions[id] === status) return;
    this.state.missions[id] = status;
    this.notify();
  }

  /**
   * Enregistre une énigme résolue.
   * Retourne true si nouvellement résolue (récompense unique), false si déjà résolue.
   */
  public solvePuzzle(puzzleId: string): boolean {
    if (this.state.solvedPuzzles.includes(puzzleId)) {
      return false;
    }
    this.state.solvedPuzzles = [...this.state.solvedPuzzles, puzzleId];
    this.notify();
    return true;
  }

  public isPuzzleSolved(puzzleId: string): boolean {
    return this.state.solvedPuzzles.includes(puzzleId);
  }

  /**
   * Collecte un fragment de phrase.
   * Retourne true si nouvellement collecté (récompense unique), false si déjà en inventaire.
   */
  public collectFragment(fragment: string): boolean {
    if (this.state.collectedFragments.includes(fragment)) {
      return false;
    }
    this.state.collectedFragments = [...this.state.collectedFragments, fragment];
    this.notify();
    return true;
  }

  /**
   * Débloque une lettre.
   * Retourne true si nouvellement débloquée (récompense unique), false si déjà débloquée.
   */
  public unlockLetter(letterIndex: number): boolean {
    if (this.state.unlockedLetters.includes(letterIndex)) {
      return false;
    }
    this.state.unlockedLetters = [...this.state.unlockedLetters, letterIndex].sort((a, b) => a - b);
    this.notify();
    return true;
  }

  public isLetterUnlocked(letterIndex: number): boolean {
    return this.state.unlockedLetters.includes(letterIndex);
  }

  /**
   * Débloque un souvenir facultatif.
   * Retourne true si nouvellement débloqué, false si déjà débloqué.
   */
  public unlockMemory(memoryId: string): boolean {
    if (this.state.optionalMemories.includes(memoryId)) {
      return false;
    }
    this.state.optionalMemories = [...this.state.optionalMemories, memoryId];
    this.notify();
    return true;
  }

  public isMemoryUnlocked(memoryId: string): boolean {
    return this.state.optionalMemories.includes(memoryId);
  }

  /**
   * Enregistre un cœur secret/caché trouvé.
   * Non obligatoire, purement facultatif.
   * Retourne true si nouvellement découvert, false si déjà trouvé.
   */
  public unlockHiddenHeart(heartId: string): boolean {
    const list = this.state.hiddenHeartsFound || [];
    if (list.includes(heartId)) {
      return false;
    }
    this.state.hiddenHeartsFound = [...list, heartId];
    this.notify();
    return true;
  }

  public isHeartFound(heartId: string): boolean {
    return (this.state.hiddenHeartsFound || []).includes(heartId);
  }

  /**
   * Enregistre l'ouverture d'un coffre pour un niveau.
   * Retourne true si premier déverrouillage, false si déjà ouvert.
   */
  public openChest(levelIndex: number): boolean {
    if (this.state.openedChestsByLevel[levelIndex]) {
      return false;
    }
    this.state.openedChestsByLevel = {
      ...this.state.openedChestsByLevel,
      [levelIndex]: true,
    };
    this.notify();
    return true;
  }

  public isChestOpened(levelIndex: number): boolean {
    return !!this.state.openedChestsByLevel[levelIndex];
  }

  /**
   * Enregistre le nombre de cœurs ramassés pour un niveau.
   */
  public recordHearts(levelIndex: number, count: number): void {
    const current = this.state.collectedHeartsByLevel[levelIndex] || 0;
    if (count > current) {
      this.state.collectedHeartsByLevel = {
        ...this.state.collectedHeartsByLevel,
        [levelIndex]: count,
      };
      this.notify();
    }
  }

  /**
   * Réinitialise totalement la progression (Bouton « Recommencer »).
   */
  public reset(): void {
    clearProgression();
    this.state = createInitialProgressionState();
    this.notify();
    bus.emit('progression-reset');
  }
}

export const progressionStore = new ProgressionStore();

const getSnapshot = () => progressionStore.getState();

/**
 * Hook React permettant de s'abonner aux changements du store de progression.
 */
export function useProgression(): Readonly<ProgressionState> {
  return useSyncExternalStore(
    progressionStore.subscribe,
    getSnapshot,
    getSnapshot
  );
}
