export const VIEW_W = 1280;
export const VIEW_H = 720;

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
  hearts: { x: number; y: number }[];
  princeGreeting?: number; // x du prince qui accueille (niveau 1)
  princeFinalPose: 'wave' | 'read';
}

export const LEVELS: LevelConfig[] = [
  {
    key: 'garden',
    bg: 'bg-garden',
    worldW: 4000,
    groundY: 560,
    startX: 250,
    chestX: 3550,
    required: 5,
    rocks: [1250, 2050, 2900],
    platforms: [
      { x: 1650, surfaceY: 440 },
      { x: 2500, surfaceY: 440 },
      { x: 2760, surfaceY: 360 },
    ],
    hearts: [
      { x: 850, y: 470 },
      { x: 1000, y: 440 },
      { x: 1250, y: 400 },
      { x: 1650, y: 380 },
      { x: 2050, y: 390 },
      { x: 2500, y: 380 },
      { x: 2760, y: 300 },
      { x: 3200, y: 470 },
    ],
    princeGreeting: 560,
    princeFinalPose: 'wave',
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
      { x: 2350, surfaceY: 395 },
      { x: 2610, surfaceY: 315 },
    ],
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
