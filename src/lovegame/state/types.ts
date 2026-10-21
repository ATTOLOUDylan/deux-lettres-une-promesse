export type ChapterId =
  | 'chapitre-0'
  | 'chapitre-1'
  | 'chapitre-2'
  | 'chapitre-3'
  | 'chapitre-4'
  | 'chapitre-5'
  | 'epilogue';

export type ChapterStatus = 'locked' | 'accessible' | 'in_progress' | 'completed';

export type MissionStatus = 'not_started' | 'active' | 'completed';

export interface ProgressionState {
  version: number;
  currentChapter: ChapterId;
  chapters: Record<ChapterId, ChapterStatus>;
  missions: Record<string, MissionStatus>;
  solvedPuzzles: string[]; // Identifiants uniques des énigmes résolues
  collectedFragments: string[]; // Ex: ['TU', 'ES', 'MON', 'PLUS', 'BEAU', 'HASARD']
  unlockedLetters: number[]; // Index des lettres débloquées [0, 1]
  optionalMemories: string[]; // Souvenirs facultatifs découverts
  collectedHeartsByLevel: Record<number, number>; // Record des cœurs ramassés par niveau
  openedChestsByLevel: Record<number, boolean>; // Coffres déjà ouverts
  hiddenHeartsFound: string[]; // Identifiants uniques des cœurs secrets trouvés
  updatedAt: number;
}
