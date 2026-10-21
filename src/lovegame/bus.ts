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
 *  - 'progression-updated' ProgressionState                   (Store  -> React & Phaser)
 *  - 'progression-reset'                                       (Store  -> React & Phaser)
 *  - 'start-dialogue'      string (dialogueId)                 (Phaser -> React)
 *  - 'dialogue-closed'     string (dialogueId)                 (React  -> Phaser)
 *  - 'start-puzzle'        string (puzzleId)                   (Phaser / React -> React)
 *  - 'puzzle-solved'       {puzzleId, newlySolved}             (React  -> Store & Phaser)
 *  - 'puzzle-closed'       string (puzzleId)                   (React  -> Phaser)
 */
export const bus = new Events.EventEmitter();
