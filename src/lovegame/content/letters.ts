// ⚠️ Remplace les textes par tes vraies lettres, et dépose tes enregistrements dans
// public/assets/audio/letters/lettre-1.mp3 et lettre-2.mp3
import { asset } from '../assets';

export interface Letter {
  title: string;
  paragraphs: string[];
  audio: string;
}

export const letters: Letter[] = [
  {
    title: 'Première lettre — Ce que tu es pour moi',
    paragraphs: [
      '[Paragraphe 1 de ta première lettre.]',
      '[Paragraphe 2 : ce que tu apprécies chez elle.]',
      '[Paragraphe 3 : ce qu’elle représente pour toi.]',
    ],
    audio: asset('audio/letters/lettre-1.mp3'),
  },
  {
    title: 'Seconde lettre — Notre avenir',
    paragraphs: [
      '[Paragraphe 1 de ta seconde lettre.]',
      '[Paragraphe 2 : tes engagements, la confiance, la patience.]',
      '[Paragraphe 3 : la vie que tu veux construire avec elle.]',
    ],
    audio: asset('audio/letters/lettre-2.mp3'),
  },
];
