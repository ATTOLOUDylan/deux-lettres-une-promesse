export type CupidMood = "proud" | "rummage" | "serious" | "wink";

export interface DialogueLine {
  speaker: string;
  mood: CupidMood;
  /** Stage direction shown in italics before the line (optional). */
  action?: string;
  text: string;
}

export const CHAPTER0_TITLE = ["Chapitre 0 —", "L’Invitation Mystérieuse"] as const;

export const CUPID_INTRO: DialogueLine[] = [
  {
    speaker: "Cupidon",
    mood: "proud",
    text: "Bonjour, mademoiselle ! Je suis responsable de cette mission sentimentale. J’ai un diplôme en amour, un master en bisous et…",
  },
  {
    speaker: "Cupidon",
    mood: "rummage",
    action: "Il fouille rapidement dans sa sacoche.",
    text: "Attends… il est où, mon dossier ?",
  },
  {
    speaker: "Cupidon",
    mood: "rummage",
    action: "Il retourne sa sacoche et regarde autour de lui.",
    text: "Mince. J’ai oublié le dossier. Bon, on va improviser. 😄",
  },
  {
    speaker: "Cupidon",
    mood: "serious",
    text: "Bon, mademoiselle, j’ai une mission très importante pour toi. Dylan a préparé quelque chose de spécial. Mais je ne peux pas tout te révéler maintenant… sinon, où serait la surprise ?",
  },
  {
    speaker: "Cupidon",
    mood: "wink",
    text: "Si tu veux découvrir ce qu’il t’a préparé, tu vas devoir me suivre. Promis, je vais essayer de ne pas perdre le reste du dossier ! 😂",
  },
];

/** Route of the next step (Carte du Voyage). */
export const NEXT_STEP_ROUTE = "/carte" as const;
