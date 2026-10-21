export const VIEW_W = 1280;
export const VIEW_H = 720;

export interface NpcConfig {
  id: string;
  name: string;
  x: number;
  dialogueId: string;
}

export interface MovingPlatformConfig {
  x: number;
  surfaceY: number;
  distance: number;
  speed?: number;
  axis?: 'x' | 'y';
}

export interface FragmentSpotConfig {
  word: string;
  x: number;
  y: number;
}

export interface InteractionSpotConfig {
  id: string;
  name: string;
  x: number;
  puzzleId: string;
  icon?: string;
  rewardWord?: string;
}

export interface CheckpointConfig {
  x: number;
  y: number;
}

export interface PedestalConfig {
  x: number;
  label: string;
  requiredFragments: string[];
  quote: string;
}

export interface OptionalCollectibleConfig {
  id: string;
  x: number;
  y: number;
  icon: string;
  label: string;
}

export interface LevelConfig {
  key: string;
  bg: string;
  worldW: number;
  groundY: number; // ligne où se posent les pieds
  startX: number;
  chestX: number;
  required: number; // cœurs nécessaires pour réveiller le coffre
  rocks: number[]; // obstacles au sol (x)
  platforms: { x: number; surfaceY: number }[];
  movingPlatforms?: MovingPlatformConfig[];
  hearts: { x: number; y: number }[];
  fragments?: FragmentSpotConfig[];
  optionalCollectibles?: OptionalCollectibleConfig[];
  checkpoints?: CheckpointConfig[];
  interactionSpots?: InteractionSpotConfig[];
  pedestal?: PedestalConfig;
  assemblyGate?: { x: number; puzzleId: string; label: string };
  princeGreeting?: number; // x du prince qui accueille (niveau 1)
  princeFinalPose: 'wave' | 'read';
  npcs?: NpcConfig[];
}

export const LEVELS: LevelConfig[] = [
  {
    key: 'garden',
    bg: 'bg-garden',
    worldW: 4200,
    groundY: 560,
    startX: 250,
    chestX: 3750,
    required: 5,
    rocks: [1350, 2150, 3050],
    platforms: [
      { x: 800, surfaceY: 440 },
      { x: 1450, surfaceY: 430 },
      { x: 2200, surfaceY: 420 },
      { x: 2650, surfaceY: 360 },
      { x: 3100, surfaceY: 420 },
    ],
    movingPlatforms: [
      { x: 1100, surfaceY: 400, distance: 150, speed: 2000, axis: 'x' },
      { x: 1850, surfaceY: 370, distance: 80, speed: 1800, axis: 'y' },
      { x: 2900, surfaceY: 330, distance: 140, speed: 2100, axis: 'x' },
    ],
    checkpoints: [
      { x: 250, y: 560 },
      { x: 1350, y: 560 },
      { x: 2350, y: 560 },
      { x: 3250, y: 560 },
    ],
    fragments: [
      { word: 'TU', x: 800, y: 380 },
      { word: 'ES', x: 1220, y: 320 },
      { word: 'MON', x: 2200, y: 350 },
      { word: 'HASARD', x: 3100, y: 320 },
    ],
    optionalCollectibles: [
      {
        id: 'souvenir-fleur-sechee',
        x: 1850,
        y: 280,
        icon: '🌸',
        label: 'Fleur Séchée (Facultatif)',
      },
    ],
    interactionSpots: [
      {
        id: 'spot-lanterns',
        name: 'Les Lanternes de la Mémoire',
        x: 1650,
        puzzleId: 'puzzle-lanterns',
        icon: '🏮',
        rewardWord: 'PLUS',
      },
      {
        id: 'spot-coffre-capricieux',
        name: 'Le Coffre Capricieux',
        x: 2650,
        puzzleId: 'puzzle-coffre-capricieux',
        icon: '✨',
        rewardWord: 'BEAU',
      },
    ],
    assemblyGate: {
      x: 3400,
      puzzleId: 'puzzle-phrase-hasard',
      label: 'L’Arche de la Constellation',
    },
    hearts: [
      { x: 800, y: 470 },
      { x: 1000, y: 450 },
      { x: 1450, y: 370 },
      { x: 1850, y: 310 },
      { x: 2200, y: 460 },
      { x: 2650, y: 300 },
      { x: 3100, y: 360 },
      { x: 3550, y: 470 },
    ],
    princeGreeting: 560,
    princeFinalPose: 'wave',
    npcs: [
      {
        id: 'cupidon',
        name: 'Cupidon',
        x: 420,
        dialogueId: 'cupidon-jardin-intro-1',
      },
    ],
  },
  {
    key: 'bridge',
    bg: 'bg-bridge',
    worldW: 4000,
    groundY: 510,
    startX: 250,
    chestX: 3550,
    required: 6,
    rocks: [1100, 1900, 2800],
    platforms: [
      { x: 1500, surfaceY: 395 },
      { x: 2350, surfaceY: 380 }, // Zone 1 : Le Courage
      { x: 2750, surfaceY: 310 }, // Zone 2 : Le Travail
      { x: 3200, surfaceY: 330 }, // Zone 3 : Le Soutien
    ],
    movingPlatforms: [
      { x: 1750, surfaceY: 380, distance: 150, speed: 2000, axis: 'x' },
      { x: 2550, surfaceY: 340, distance: 130, speed: 1900, axis: 'x' },
      { x: 2980, surfaceY: 360, distance: 90, speed: 1700, axis: 'y' },
    ],
    checkpoints: [
      { x: 250, y: 510 },
      { x: 1350, y: 510 },
      { x: 2000, y: 510 },
      { x: 2900, y: 510 },
    ],
    fragments: [
      { word: 'COURAGE', x: 2350, y: 310 },
      { word: 'TRAVAIL', x: 2750, y: 240 },
      { word: 'SOUTIEN', x: 3200, y: 260 },
    ],
    optionalCollectibles: [
      {
        id: 'souvenir-chocolat-reconfort',
        x: 2750,
        y: 190,
        icon: '🍫',
        label: 'Douceur Partagée (Facultatif)',
      },
    ],
    pedestal: {
      x: 2000,
      label: 'Le Socle de l’Avenir',
      requiredFragments: ['COURAGE', 'TRAVAIL', 'SOUTIEN'],
      quote:
        'Félicitations ! Tu as trouvé les trois ingrédients d’une relation solide. Moi, j’aurais ajouté le chocolat… mais apparemment, personne ne m’écoute dans cette équipe. 😂',
    },
    interactionSpots: [
      {
        id: 'spot-valeurs-1',
        name: 'Étoile de la Confiance I',
        x: 750,
        puzzleId: 'puzzle-valeurs-1',
        icon: '⭐',
      },
      {
        id: 'spot-valeurs-2',
        name: 'Étoile de la Confiance II',
        x: 1150,
        puzzleId: 'puzzle-valeurs-2',
        icon: '⭐',
      },
      {
        id: 'spot-valeurs-3',
        name: 'Étoile de la Confiance III',
        x: 1550,
        puzzleId: 'puzzle-valeurs-3',
        icon: '⭐',
      },
    ],
    assemblyGate: {
      x: 3400,
      puzzleId: 'pedestal-completed-barrier',
      label: 'L’Arche du Futur Foyer',
    },
    hearts: [
      { x: 800, y: 420 },
      { x: 1100, y: 340 },
      { x: 1500, y: 335 },
      { x: 1900, y: 330 },
      { x: 2350, y: 335 },
      { x: 2610, y: 255 },
      { x: 3100, y: 420 },
      { x: 3300, y: 420 },
    ],
    princeFinalPose: 'read',
  },
];
