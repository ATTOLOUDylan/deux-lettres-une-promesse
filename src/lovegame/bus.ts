import { Events } from 'phaser';

/**
 * Canal de communication React <-> Phaser.
 * Événements :
 *  - 'hud'           {level, title, hearts, required, total}   (Phaser -> React)
 *  - 'toast'         string                                    (Phaser -> React)
 *  - 'chest-opened'  levelIndex                                (Phaser -> React)
 *  - 'letter-closed' levelIndex                                (React  -> Phaser)
 *  - 'ending-ready'                                            (Phaser -> React)
 *  - 'restart'                                                 (React  -> Phaser)
 */
export const bus = new Events.EventEmitter();
