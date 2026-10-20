import { Scene } from 'phaser';
import { asset } from '../assets';

const HER = ['idle_0', 'idle_1', 'interact_0', 'interact_1', 'end_0', 'walk_0', 'walk_1', 'walk_2', 'walk_3', 'jump_0', 'jump_1', 'jump_2', 'jump_3'];
const HIM = ['idle_0', 'idle_1', 'wave', 'end', 'walk_0', 'walk_1', 'walk_2', 'walk_3', 'read_0', 'read_1'];

export class PreloadScene extends Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    const txt = this.add
      .text(640, 360, 'Chargement… 0%', { fontFamily: 'Georgia, serif', fontSize: '28px', color: '#ffe9a8' })
      .setOrigin(0.5);
    this.load.on('progress', (p: number) => txt.setText(`Chargement… ${Math.round(p * 100)}%`));

    HER.forEach((n) => this.load.image(`her-${n}`, asset(`characters/heroine/${n}.png`)));
    HIM.forEach((n) => this.load.image(`him-${n}`, asset(`characters/hero/${n}.png`)));
    this.load.image('bg-garden', asset('backgrounds/garden.jpg'));
    this.load.image('bg-bridge', asset('backgrounds/bridge.jpg'));
    this.load.image('bg-final', asset('backgrounds/final.jpg'));
    this.load.image('chest_closed', asset('objects/chest_closed.png'));
    this.load.image('chest_open', asset('objects/chest_open.png'));
    this.load.image('heart', asset('objects/heart.png'));
    this.load.image('rock', asset('objects/rock.png'));
    this.load.image('platform', asset('objects/platform.png'));
    this.load.image('glow', asset('effects/glow.png'));
  }

  create() {
    const f = (prefix: string, names: string[]) => names.map((n) => ({ key: `${prefix}-${n}` }));
    const a = this.anims;
    a.create({ key: 'her-idle', frames: f('her', ['idle_0', 'idle_1']), frameRate: 2, repeat: -1 });
    a.create({ key: 'her-walk', frames: f('her', ['walk_0', 'walk_1', 'walk_2', 'walk_3']), frameRate: 8, repeat: -1 });
    a.create({ key: 'him-idle', frames: f('him', ['idle_0', 'idle_1']), frameRate: 2, repeat: -1 });
    a.create({ key: 'him-wave', frames: f('him', ['wave', 'idle_0']), frameRate: 2, repeat: -1 });
    a.create({ key: 'him-walk', frames: f('him', ['walk_0', 'walk_1', 'walk_2', 'walk_3']), frameRate: 8, repeat: -1 });
    a.create({ key: 'him-read', frames: f('him', ['read_0', 'read_1']), frameRate: 1, repeat: -1 });
    this.scene.start('Level', { level: 0 });
  }
}
