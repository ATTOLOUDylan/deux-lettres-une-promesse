export type PuzzleType = 'choice' | 'chronology' | 'sequence' | 'word_assembly';

export interface BasePuzzleDefinition {
  id: string;
  title: string;
  instruction: string;
  type: PuzzleType;
  hints: string[]; // Indices progressifs sans donner la solution directe
  errorReactions?: string[]; // Réactions humoristiques de Cupidon
  successMessage: string;
  rewardDescription?: string;
  fragmentReward?: string;
  actionOnSuccess?: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface ChoicePuzzleDefinition extends BasePuzzleDefinition {
  type: 'choice';
  question: string;
  options: ChoiceOption[];
}

export interface ChronologyItem {
  id: string;
  title: string;
  description?: string;
  correctOrder: number; // 0, 1, 2...
}

export interface ChronologyPuzzleDefinition extends BasePuzzleDefinition {
  type: 'chronology';
  items: ChronologyItem[];
}

export interface SequenceItem {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface SequencePuzzleDefinition extends BasePuzzleDefinition {
  type: 'sequence';
  sequence: string[]; // Liste des IDs dans l'ordre requis
  items: SequenceItem[];
}

export interface WordAssemblyPuzzleDefinition extends BasePuzzleDefinition {
  type: 'word_assembly';
  targetWords: string[]; // Ex: ['TU', 'ES', 'MON', 'PLUS', 'BEAU', 'HASARD']
}

export type PuzzleDefinition =
  | ChoicePuzzleDefinition
  | ChronologyPuzzleDefinition
  | SequencePuzzleDefinition
  | WordAssemblyPuzzleDefinition;

export const PUZZLES: Record<string, PuzzleDefinition> = {
  // --- ÉNIGME DE DÉMONSTRATION DU CHAPITRE 0 : Le code du cœur ---
  'puzzle-heart-code': {
    id: 'puzzle-heart-code',
    title: 'Le Code Secret du Cœur',
    instruction: 'Cupidon le stagiaire a laissé une formule magique pour déverrouiller la suite :',
    type: 'choice',
    question: 'Sachant que ❤ = 2, ⭐ = 3 et 🌙 = 1, combien vaut : ❤ + ⭐ + 🌙 ?',
    options: [
      {
        id: 'opt-5',
        text: '5',
        isCorrect: false,
        feedback: 'Presque ! Mais Cupidon a recompté sur ses petits doigts ailés et il trouve un tout petit peu plus… 😂',
      },
      {
        id: 'opt-6',
        text: '6',
        isCorrect: true,
        feedback: 'Bravo ! Le compte est parfait, le cadenas du cœur s’illumine ! ✨',
      },
      {
        id: 'opt-7',
        text: '7',
        isCorrect: false,
        feedback: 'Oula, trop d’amour dans ce calcul ! Tu as ajouté un bonus d’affection ! 🤣',
      },
    ],
    hints: [
      'Prends chaque symbole séparément : le cœur vaut 2, l’étoile vaut 3, et la lune vaut 1.',
      'Fais une addition pas à pas : 2 + 3 font 5, auquel tu ajoutes la valeur de la lune…',
    ],
    errorReactions: [
      'Cupidon : « Non, non, non ! Réessaie, il n’y a aucun chrono, prends ton temps ! »',
      'Cupidon : « Même moi qui suis stagiaire, je crois qu’il y a un petit pépin dans le calcul ! 👼 »',
    ],
    successMessage: 'Le code magique 6 a déverrouillé le portail du cœur !',
    rewardDescription: 'Clé d’accès au voyage romantique',
    actionOnSuccess: 'heart_code_solved',
  },

  // --- ÉNIGME DU CHAPITRE 1 : Tableau des souvenirs (Chronologie) ---
  'puzzle-souvenirs-intro': {
    id: 'puzzle-souvenirs-intro',
    title: 'Le Tableau des Souvenirs',
    instruction: 'Touche une carte puis une autre pour les échanger et remettre les étapes dans l’ordre historique :',
    type: 'chronology',
    items: [
      {
        id: 'card-sentiments',
        title: '3. Les Sentiments Avoués',
        description: 'Quand le cœur a finalement avoué ce qu’il cachait depuis le début.',
        correctOrder: 2,
      },
      {
        id: 'card-rencontre',
        title: '1. Les Premiers Échanges',
        description: 'Ce fameux jour où le courage a vaincu la timidité dans la salle de classe.',
        correctOrder: 0,
      },
      {
        id: 'card-complicite',
        title: '2. Cadeaux & Rires',
        description: 'La complicité qui grandit, les attentions partagées et la fameuse rumeur.',
        correctOrder: 1,
      },
    ],
    hints: [
      'Pense au début : tout commence par la première conversation à l’université.',
      'L’aveu des sentiments vient couronner toute la complicité qui s’était installée.',
    ],
    errorReactions: [
      'Cupidon : « Attention, tu viens de mélanger le temps ! Même les séries télévisées ne font pas des flashbacks aussi audacieux ! 😂 »',
    ],
    successMessage: 'L’ordre de votre histoire a été parfaitement rétabli !',
    rewardDescription: 'Fragment de souvenir du premier regard',
    actionOnSuccess: 'souvenirs_ordered',
  },

  // --- ÉNIGME DU CHAPITRE 3 : Les Lanternes qui se souviennent (Séquence) ---
  'puzzle-lanterns': {
    id: 'puzzle-lanterns',
    title: 'Les Lanternes de la Mémoire',
    instruction: 'Observe l’ordre dans lequel les lanternes s’illuminent, puis reproduis la séquence exacte :',
    type: 'sequence',
    sequence: ['lan-bleue', 'lan-doree', 'lan-blanche'],
    items: [
      { id: 'lan-bleue', name: 'Lanterne Bleue', color: '#4da6ff', icon: '🏮' },
      { id: 'lan-doree', name: 'Lanterne Dorée', color: '#ffd97a', icon: '🏮' },
      { id: 'lan-blanche', name: 'Lanterne Céleste', color: '#ffffff', icon: '🏮' },
    ],
    hints: [
      'La première lanterne à s’allumer est celle qui rappelle la nuit.',
      'La lanterne dorée s’allume au milieu, suivie de la lanterne céleste.',
    ],
    errorReactions: [
      'Cupidon : « Oups ! La lumière s’est éteinte… Ce n’est pas grave, regarde bien la séquence à nouveau ! »',
    ],
    successMessage: 'Les trois lanternes brillent à l’unisson dans la nuit !',
    rewardDescription: 'Fragment : PLUS',
    fragmentReward: 'PLUS',
    actionOnSuccess: 'lanterns_cleared',
  },

  // --- ÉNIGME DU CHAPITRE 3 : Le Coffre Capricieux (Choix multiple) ---
  'puzzle-coffre-capricieux': {
    id: 'puzzle-coffre-capricieux',
    title: 'Le Coffre Capricieux',
    instruction: 'Une énigme poétique est gravée sur le coffre magique :',
    type: 'choice',
    question: '« Je peux commencer par un regard, grandir avec des rires et changer une vie sans faire de bruit. Qui suis-je ? »',
    options: [
      {
        id: 'opt-capricieux-1',
        text: 'L’amitié passagère',
        isCorrect: false,
        feedback: 'Non, ce sentiment va bien plus loin et dure bien plus longtemps !',
      },
      {
        id: 'opt-capricieux-2',
        text: 'L’amour ❤️',
        isCorrect: true,
        feedback: 'Exactement ! Le coffre s’ouvre doucement en libérant une pluie d’étoiles !',
      },
      {
        id: 'opt-capricieux-3',
        text: 'Le hasard absolu',
        isCorrect: false,
        feedback: 'Le hasard n’est qu’une étincelle, le trésor est bien plus grand !',
      },
    ],
    hints: [
      'Pense à ce qui remplit le cœur de Dylan depuis le tout premier jour.',
      'C’est le sentiment le plus beau et le plus puissant qui unit deux êtres.',
    ],
    errorReactions: [
      'Cupidon : « Allons ma poupée, c’est le mot d’ordre de tout mon métier ! 👼 »',
    ],
    successMessage: 'Le coffre capricieux a reconnu la réponse du cœur !',
    rewardDescription: 'Fragment : BEAU',
    fragmentReward: 'BEAU',
    actionOnSuccess: 'coffre_capricieux_solved',
  },

  // --- ÉNIGME DU CHAPITRE 3 : Assemblage de la Phrase Magique ---
  'puzzle-phrase-hasard': {
    id: 'puzzle-phrase-hasard',
    title: 'La Constellation Secrète',
    instruction: 'Touche les mots pour composer la phrase romantique dans le bon ordre :',
    type: 'word_assembly',
    targetWords: ['TU', 'ES', 'MON', 'PLUS', 'BEAU', 'HASARD'],
    hints: [
      'La phrase commence par désigner la personne la plus importante : « TU »…',
      'Le mot « HASARD » est le joyau qui vient clore cette phrase.',
    ],
    errorReactions: [
      'Cupidon : « C’est poétique, mais ce n’est pas tout à fait l’ordre de cette promesse ! Réessaie doucement. »',
    ],
    successMessage: '« TU ES MON PLUS BEAU HASARD » résonne dans le ciel étoilé ! ✨',
    rewardDescription: 'Passage vers le Pont des Étoiles',
    actionOnSuccess: 'phrase_assembled',
  },

  // --- ÉNIGMES DU CHAPITRE 4 : Les Étoiles de la Confiance (Valeurs du couple) ---
  'puzzle-valeurs-1': {
    id: 'puzzle-valeurs-1',
    title: 'Étoile de la Confiance I — Grandir Ensemble',
    instruction: 'Une question brille dans la constellation du pont :',
    type: 'choice',
    question: 'Qu’est-ce qui aide une relation à grandir avec le temps ?',
    options: [
      {
        id: 'opt-val-1-a',
        text: 'Ne jamais avoir le moindre désaccord',
        isCorrect: false,
        feedback: 'Les désaccords existent dans tous les couples, l’important est la façon dont on s’écoute et se respecte !',
      },
      {
        id: 'opt-val-1-b',
        text: 'S’écouter, se parler et faire des efforts réciproques ❤️',
        isCorrect: true,
        feedback: 'Exactement ! C’est le dialogue sincère et les efforts mutuels qui rendent un amour inébranlable ! ✨',
      },
      {
        id: 'opt-val-1-c',
        text: 'Attendre que tout se règle tout seul avec le temps',
        isCorrect: false,
        feedback: 'L’amour demande du soin, de la présence et de l’attention au quotidien.',
      },
    ],
    hints: [
      'Pense à ce qui nous permet de nous comprendre même lorsque les journées sont intenses.',
      'C’est le dialogue bienveillant et la volonté d’avancer à deux.',
    ],
    errorReactions: [
      'Cupidon : « Réfléchis bien ma poupée, le secret d’un grand amour repose sur le cœur et la parole ! 👼 »',
    ],
    successMessage: 'La première Étoile de la Confiance brille d’une lueur d’or pur ! ✨',
    rewardDescription: 'Lumière de l’Écoute',
    actionOnSuccess: 'valeur_1_solved',
  },

  'puzzle-valeurs-2': {
    id: 'puzzle-valeurs-2',
    title: 'Étoile de la Confiance II — Soutenir les Rêves',
    instruction: 'La deuxième étoile du pont scintille doucement :',
    type: 'choice',
    question: 'Comment soutenir au mieux les rêves et les projets de l’autre ?',
    options: [
      {
        id: 'opt-val-2-a',
        text: 'Lui demander d’abandonner ses projets',
        isCorrect: false,
        feedback: 'Jamais ! Ses passions et ses projets méritent de grandir et de rayonner.',
      },
      {
        id: 'opt-val-2-b',
        text: 'Décider à sa place de ce qui est mieux pour elle',
        isCorrect: false,
        feedback: 'Chacun est libre de ses choix, l’autre est là pour épauler avec tendresse.',
      },
      {
        id: 'opt-val-2-c',
        text: 'L’encourager et chercher à grandir ensemble ❤️',
        isCorrect: true,
        feedback: 'Merveilleux ! Être le premier soutien de ses ambitions et s’élever à deux ! ✨',
      },
    ],
    hints: [
      'Un véritable amour donne des ailes pour voler plus haut.',
      'C’est croire en elle et être fier de ses réussites.',
    ],
    errorReactions: [
      'Cupidon : « L’amour n’enferme jamais, il fait grandir ! Réessaie doucement. »',
    ],
    successMessage: 'La deuxième Étoile de la Confiance s’illumine dans la voûte céleste ! ✨',
    rewardDescription: 'Lumière du Soutien',
    actionOnSuccess: 'valeur_2_solved',
  },

  'puzzle-valeurs-3': {
    id: 'puzzle-valeurs-3',
    title: 'Étoile de la Confiance III — Face aux Obstacles',
    instruction: 'La troisième étoile murmure sa question :',
    type: 'choice',
    question: 'Face à un obstacle imprévu sur le chemin, quelle est notre vraie force ?',
    options: [
      {
        id: 'opt-val-3-a',
        text: 'Se parler, chercher des solutions et avancer ensemble ❤️',
        isCorrect: true,
        feedback: 'Bravo ! Rien ne peut ébranler deux personnes qui se font confiance et restent soudées ! ✨',
      },
      {
        id: 'opt-val-3-b',
        text: 'Faire comme si le problème n’existait pas',
        isCorrect: false,
        feedback: 'Ignorer un obstacle ne le fait pas disparaître, mieux vaut l’aborder avec maturité.',
      },
      {
        id: 'opt-val-3-c',
        text: 'Tout abandonner immédiatement',
        isCorrect: false,
        feedback: 'Notre projet de vie a trop de valeur pour renoncer devant les difficultés !',
      },
    ],
    hints: [
      'La solution réside dans l’union et le courage de faire face ensemble.',
    ],
    errorReactions: [
      'Cupidon : « Ne te décourage pas ! Rappelle-toi comment Dylan et toi surmontez les doutes ! 👼 »',
    ],
    successMessage: 'Les trois Étoiles de la Confiance éclairent désormais tout le pont stellaire ! ✨',
    rewardDescription: 'Lumière de l’Union',
    actionOnSuccess: 'valeur_3_solved',
  },
};
