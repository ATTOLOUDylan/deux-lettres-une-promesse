import { AUTO, Game, Scale } from 'phaser';
import { PreloadScene } from './scenes/PreloadScene';
import { LevelScene } from './scenes/LevelScene';
import { EndingScene } from './scenes/EndingScene';
import { VIEW_W, VIEW_H } from './levels';

let game: Game | null = null;

export function startGame(parent: string) {
  if (game) return game;
  game = new Game({
    type: AUTO,
    parent,
    width: VIEW_W,
    height: VIEW_H,
    backgroundColor: '#0b1030',
    scale: { mode: Scale.FIT, autoCenter: Scale.CENTER_BOTH },
    physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 1800 }, debug: false } },
    scene: [PreloadScene, LevelScene, EndingScene],
  });
  return game;
}
