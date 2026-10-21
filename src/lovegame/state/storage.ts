import { ChapterId, ProgressionState } from './types';

export const CURRENT_PROGRESSION_VERSION = 1;
export const STORAGE_KEY = 'deux_lettres_progression_v1';

export function createInitialProgressionState(): ProgressionState {
  return {
    version: CURRENT_PROGRESSION_VERSION,
    currentChapter: 'chapitre-3', // Par défaut sur le chapitre 3 (jardin) tant que les chapitres 0-2 sont en cours d'ajout
    chapters: {
      'chapitre-0': 'accessible',
      'chapitre-1': 'locked',
      'chapitre-2': 'locked',
      'chapitre-3': 'accessible',
      'chapitre-4': 'locked',
      'chapitre-5': 'locked',
      'epilogue': 'locked',
    },
    missions: {},
    solvedPuzzles: [],
    collectedFragments: [],
    unlockedLetters: [],
    optionalMemories: [],
    collectedHeartsByLevel: {},
    openedChestsByLevel: {},
    hiddenHeartsFound: [],
    updatedAt: Date.now(),
  };
}

export function loadProgression(): ProgressionState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return createInitialProgressionState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialProgressionState();
    }

    const parsed = JSON.parse(raw) as Partial<ProgressionState>;
    // Vérification de la compatibilité de version
    if (!parsed || parsed.version !== CURRENT_PROGRESSION_VERSION) {
      return createInitialProgressionState();
    }

    // Fusion de sécurité avec l'état initial pour parer à tout champ manquant
    const initial = createInitialProgressionState();
    return {
      version: CURRENT_PROGRESSION_VERSION,
      currentChapter: (parsed.currentChapter as ChapterId) || initial.currentChapter,
      chapters: { ...initial.chapters, ...(parsed.chapters || {}) },
      missions: { ...(parsed.missions || {}) },
      solvedPuzzles: Array.isArray(parsed.solvedPuzzles) ? parsed.solvedPuzzles : [],
      collectedFragments: Array.isArray(parsed.collectedFragments) ? parsed.collectedFragments : [],
      unlockedLetters: Array.isArray(parsed.unlockedLetters) ? parsed.unlockedLetters : [],
      optionalMemories: Array.isArray(parsed.optionalMemories) ? parsed.optionalMemories : [],
      collectedHeartsByLevel: { ...(parsed.collectedHeartsByLevel || {}) },
      openedChestsByLevel: { ...(parsed.openedChestsByLevel || {}) },
      hiddenHeartsFound: Array.isArray(parsed.hiddenHeartsFound) ? parsed.hiddenHeartsFound : [],
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
    };
  } catch (err) {
    console.warn('[Progression] Erreur lors du chargement depuis localStorage, réinitialisation :', err);
    return createInitialProgressionState();
  }
}

export function saveProgression(state: ProgressionState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    state.updatedAt = Date.now();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[Progression] Impossible de sauvegarder dans localStorage :', err);
  }
}

export function clearProgression(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[Progression] Erreur lors de la suppression de la sauvegarde :', err);
  }
}
