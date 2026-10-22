// Single source of truth for game progression (localStorage).
export const STORAGE_KEY = "deux-lettres-progress-v1";
export const TOTAL_LETTERS = 3;

export type ChapterId = "chapter0" | "chapter1" | "chapter2" | "chapter3" | "chapter4" | "chapter5" | "epilogue";

export interface Progress {
  started: boolean;
  completed: ChapterId[];
  lettersUnlocked: string[];
  solvedPuzzles: string[];
}

export const emptyProgress = (): Progress => ({
  started: false,
  completed: [],
  lettersUnlocked: [],
  solvedPuzzles: [],
});

export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    return { ...emptyProgress(), ...JSON.parse(raw) };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: Progress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("progress-changed"));
}

export function resetProgress() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("progress-changed"));
}

export const isDone = (p: Progress, c: ChapterId) => p.completed.includes(c);

export function hasProgress(p: Progress) {
  return p.started || p.completed.length > 0 || p.lettersUnlocked.length > 0 || p.solvedPuzzles.length > 0;
}

export type PrimaryState = "start" | "university" | "continue";

export function primaryState(p: Progress): PrimaryState {
  if (isDone(p, "chapter0") && !isDone(p, "chapter1")) return "university";
  if (hasProgress(p)) return "continue";
  return "start";
}

export const lettersCount = (p: Progress) => Math.min(new Set(p.lettersUnlocked).size, TOTAL_LETTERS);
export const bonusUnlocked = (p: Progress) => isDone(p, "chapter5");
