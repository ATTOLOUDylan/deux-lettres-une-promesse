import { asset } from './assets';

const MUSIC_VOL = 0.35;
let music: HTMLAudioElement | null = null;
let enabled = true;

function ensure() {
  if (!music) {
    music = new Audio(asset('audio/music/theme.mp3'));
    music.loop = true;
    music.volume = MUSIC_VOL;
  }
  return music;
}

/** À appeler après un clic (les navigateurs bloquent le son avant). Silencieux si le fichier n'existe pas. */
export function startMusic() {
  if (enabled) ensure().play().catch(() => {});
}
export function setMusicEnabled(on: boolean) {
  enabled = on;
  if (on) ensure().play().catch(() => {});
  else music?.pause();
}
/** Baisse la musique pendant la lecture d'une lettre. */
export function duckMusic(on: boolean) {
  if (music) music.volume = on ? 0.08 : MUSIC_VOL;
}
