import { Scene } from 'phaser';
import { bus } from '../bus';
import { VIEW_W, VIEW_H } from '../levels';

export class EndingScene extends Scene {
  constructor() {
    super('Ending');
  }

  create() {
    const groundY = 590;
    const S = 0.85;
    this.add.image(0, 0, 'bg-final').setOrigin(0, 0).setDisplaySize(VIEW_W, VIEW_H);
    this.cameras.main.fadeIn(900);

    const glow = this.add.image(660, 420, 'glow').setScale(1.3).setAlpha(0).setDepth(2);

    const prince = this.add.sprite(900, groundY, 'him-wave').setOrigin(0.5, 1).setScale(S).setFlipX(true).setDepth(5);
    prince.anims.play('him-wave');

    const her = this.add.sprite(-120, groundY, 'her-walk_0').setOrigin(0.5, 1).setScale(S).setDepth(6);
    her.anims.play('her-walk');

    this.tweens.add({
      targets: her,
      x: 560,
      duration: 4200,
      ease: 'Sine.easeOut',
      onComplete: () => {
        her.anims.stop();
        her.setTexture('her-end_0').setFlipX(true); // tournée vers lui
        prince.anims.stop();
        prince.setTexture('him-end').setFlipX(false); // sa pose finale regarde vers la gauche
        this.tweens.add({ targets: glow, alpha: 0.65, duration: 1500, yoyo: true, repeat: -1 });
        this.floatHearts();
        this.time.delayedCall(2200, () => bus.emit('ending-ready'));
      },
    });

    bus.on('restart', this.onRestart, this);
    this.events.once('shutdown', () => bus.off('restart', this.onRestart, this));
  }

  private floatHearts() {
    this.time.addEvent({
      delay: 350,
      loop: true,
      callback: () => {
        const h = this.add.image(480 + Math.random() * 360, 520, 'heart').setScale(0.1 + Math.random() * 0.12).setAlpha(0.95).setDepth(8);
        this.tweens.add({ targets: h, y: 120 + Math.random() * 120, x: h.x + (Math.random() - 0.5) * 160, alpha: 0, duration: 3500 + Math.random() * 1500, onComplete: () => h.destroy() });
      },
    });
  }

  private onRestart() {
    this.cameras.main.fadeOut(500);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Level', { level: 0 }));
  }
}
