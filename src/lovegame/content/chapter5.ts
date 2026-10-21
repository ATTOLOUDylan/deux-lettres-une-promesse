import { asset } from '../assets';

export interface GateInfo {
  id: string;
  number: number;
  title: string;
  requiredItem: string;
  icon: string;
  memoryTitle: string;
  memoryText: string;
}

export interface FinalDialogueLine {
  id: string;
  speaker: string;
  avatar: string;
  text: string;
  audio: string;
}

export const CHAPTER_5_GATES: GateInfo[] = [
  {
    id: 'gate-1',
    number: 1,
    title: 'La Porte des Premiers Pas',
    requiredItem: 'Le Souvenir de l’Université',
    icon: '🏛️',
    memoryTitle: 'Flashback : Ce jour où tout a basculé',
    memoryText:
      'Ce fameux jour où nous étions seuls dans la salle de classe. Un garçon qui n’avait presque jamais le courage d’aborder les filles a puisé dans une force qu’il ne soupçonnait pas. Une simple conversation… qui allait changer toute une vie.',
  },
  {
    id: 'gate-2',
    number: 2,
    title: 'La Porte de la Complicité',
    requiredItem: 'La Phrase Reconstituée',
    icon: '🌌',
    memoryTitle: 'Flashback : « TU ES MON PLUS BEAU HASARD »',
    memoryText:
      'La rumeur qui courait à l’université, les sourires échangés, les rires complices et ce message inoubliable : « Est-ce que tu es amoureux de moi ? ». Le hasard n’était qu’une étincelle, le cœur a fait le reste.',
  },
  {
    id: 'gate-3',
    number: 3,
    title: 'La Porte de l’Avenir',
    requiredItem: 'Les Trois Fragments de l’Avenir',
    icon: '💎',
    memoryTitle: 'Flashback : Courage, Travail & Soutien',
    memoryText:
      'Les piliers d’une relation solide : le courage d’affronter les doutes, le travail sérieux pour mériter la confiance de ta famille, et le soutien inconditionnel pour que chacun grandisse et accomplisse ses rêves.',
  },
];

export const CHAPTER_5_DIALOGUES: FinalDialogueLine[] = [
  {
    id: 'dlg-1',
    speaker: 'Dylan',
    avatar: 'him-smile',
    text: 'Alors… tu m’as enfin retrouvé. 😂❤️',
    audio: asset('audio/dialogues/chapitre5_replique_1.mp3'),
  },
  {
    id: 'dlg-2',
    speaker: 'Dylan',
    avatar: 'him-wave',
    text: 'Je crois que tu as mérité quelques explications. Et cette fois, je n’ai pas de salle de classe pour me cacher derrière.',
    audio: asset('audio/dialogues/chapitre5_replique_2.mp3'),
  },
  {
    id: 'dlg-3',
    speaker: 'Dylan',
    avatar: 'him-read',
    text: 'J’aurais pu simplement t’écrire une lettre. Mais je voulais te faire vivre quelque chose. Te faire sourire, te faire rire, te rappeler notre histoire… et te montrer ce que tu représentes pour moi.',
    audio: asset('audio/dialogues/chapitre5_replique_3.mp3'),
  },
  {
    id: 'dlg-4',
    speaker: 'Dylan',
    avatar: 'him-smile',
    text: 'Je ne sais pas encore exactement à quoi ressemblera tout notre avenir. Mais je sais que j’ai envie de faire les efforts nécessaires, de continuer à avancer et de construire quelque chose de vrai avec toi.',
    audio: asset('audio/dialogues/chapitre5_replique_4.mp3'),
  },
  {
    id: 'dlg-5',
    speaker: 'Dylan',
    avatar: 'him-end',
    text: 'Merci d’être entrée dans mon histoire. Et merci d’y être encore aujourd’hui. ❤️',
    audio: asset('audio/dialogues/chapitre5_replique_5.mp3'),
  },
];

export const EPILOGUE_DATA = {
  envelopeTitle: 'Une dernière chose, ma poupée…',
  envelopeSubtitle: 'Touche l’enveloppe pour briser le sceau et écouter ma promesse ❤️',
  finalProposal: {
    question: 'Ma poupée, veux-tu continuer à écrire cette histoire avec moi ?',
    choiceYes: 'Oui, continuons notre histoire ❤️',
    choiceFunny: 'Attends… j’ai encore envie de te faire travailler ! 😂',
    cupidonComicReaction:
      '« Pardon ?! Après toutes ces énigmes ? Même moi, je demande une pause ! 😂 »\n(Il s’essuie le front avec son aile)\n« Bon d’accord, Dylan continuera à travailler dur pour vous deux… mais laisse-lui au moins reprendre son souffle ! 👼❤️ »',
    dylanYesAnswer:
      '« Merci de croire en nous, ma poupée. Je te promets que chaque jour, mes actes seront à la hauteur de mon amour pour toi. Notre plus beau chapitre commence maintenant. ❤️ »',
  },
};
