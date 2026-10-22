import { ProgressionState } from '../state/types';

export interface UniversityNpc {
  id: string;
  name: string;
  role: string;
  avatar: string;
  fullSprite?: string;
  color: string;
  dialogueId: string;
  missionKey: string;
  location: string;
  x?: number;
}

export interface UniversityRoomConfig {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  isUnlocked: (state: ProgressionState) => boolean;
  lockedReason: string;
  type: 'flashback' | 'puzzle' | 'encounter';
  puzzleId?: string;
  x?: number;
}

// Configuration spatiale du couloir 2D scénarisé (de gauche à droite).
// Ces positions servent maintenant de cibles pour la caméra.
export const HALLWAY_CONFIG = {
  worldWidth: 3300,
  worldHeight: 720,
  groundY: 652,
  startX: 160,
  noticeboardX: 430,
  studentGirlX: 530,
  doorAX: 960,
  benchX: 1440,
  studentBoyX: 1530,
  catX: 1880,
  doorBX: 2240,
  guardX: 2640,
  doorCX: 3040,
  heart1X: 430,
  heart2X: 2710,
  memoryNoteX: 1400,
};

export const UNIVERSITY_NPCS: UniversityNpc[] = [
  {
    id: 'npc-etudiante',
    name: 'L’Étudiante Curieuse',
    role: 'Observatrice du campus',
    avatar: 'characters/npcs/student_girl.jpg',
    fullSprite: 'characters/npcs/student_girl_full.png',
    color: '#7bc4ff',
    dialogueId: 'etudiante-curieuse-intro',
    missionKey: 'indice_lieu_rencontre',
    location: 'Près du tableau d’affichage',
    x: 530,
  },
  {
    id: 'npc-distrait',
    name: 'L’Étudiant Distrait',
    role: 'Spécialiste des pauses beignets',
    avatar: 'characters/npcs/student_boy.jpg',
    fullSprite: 'characters/npcs/student_boy_full.png',
    color: '#ffd97a',
    dialogueId: 'etudiant-distrait-intro',
    missionKey: 'objet_distrait_trouve',
    location: 'Assis sur le banc du couloir',
    x: 1530,
  },
  {
    id: 'npc-gardien',
    name: 'Le Gardien Bienveillant',
    role: 'Détenteur des clés du bâtiment',
    avatar: 'characters/npcs/campus_guard.jpg',
    fullSprite: 'characters/npcs/campus_guard_full.png',
    color: '#e5a8ff',
    dialogueId: 'gardien-intro',
    missionKey: 'cle_gardien_obtenue',
    location: 'À l’entrée des salles de cours',
    x: 2640,
  },
];

export const UNIVERSITY_ROOMS: UniversityRoomConfig[] = [
  {
    id: 'salle-a',
    name: 'Salle A — Le Souvenir Perdu',
    subtitle: 'Flashback : L’hésitation du garçon',
    icon: '💭',
    description: 'Une salle suspendue dans le temps où l’on aperçoit Dylan hésitant à faire le premier pas.',
    isUnlocked: () => true,
    lockedReason: '',
    type: 'flashback',
    x: 960,
  },
  {
    id: 'salle-b',
    name: 'Salle B — Le Tableau des Souvenirs',
    subtitle: 'Énigme : L’ordre de l’histoire',
    icon: '🧩',
    description: 'Un tableau interactif où les étapes de votre complicité doivent être remises dans l’ordre chronologique.',
    isUnlocked: () => true,
    lockedReason: '',
    type: 'puzzle',
    puzzleId: 'puzzle-souvenirs-intro',
    x: 2240,
  },
  {
    id: 'salle-c',
    name: 'Salle C — La Salle du Courage',
    subtitle: 'La Première Rencontre Réelle',
    icon: '✨',
    description: 'La salle de classe où vous vous êtes retrouvés seuls pour la première fois. Dylan t’y attend.',
    isUnlocked: (state: ProgressionState) => !!state.missions['cle_gardien_obtenue'],
    lockedReason: 'La porte est verrouillée à double tour. Parle au Gardien pour obtenir la clé !',
    type: 'encounter',
    x: 3040,
  },
];

export const UNIVERSITY_CONTENT = {
  chapterId: 'chapitre-1',
  title: 'Chapitre 1 — Retrouver le garçon de l’université',
  hubSubtitle: 'Explore le couloir, interroge les étudiants et débloque les trois salles de souvenirs.',
  cluesHeader: 'Indices & Clés collectés :',
  rewardTitle: 'Fragment de Souvenir obtenu !',
  rewardDesc: '« Le Premier Regard & La Première Conversation dans la salle de classe »',
  transitionMessage: 'Félicitations ma poupée ! Tu as retrouvé Dylan et ravivé le souvenir de vos premiers mots. Le Laboratoire des Sentiments t’attend…',
  nextChapterButton: 'Passer au Chapitre 2 (Le Laboratoire des Sentiments) 🧪',
};
