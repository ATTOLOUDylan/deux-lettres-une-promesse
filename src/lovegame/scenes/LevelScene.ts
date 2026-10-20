import { Scene, Input, GameObjects, Physics } from 'phaser';
import { bus } from '../bus';
import { controls } from '../controls';
import { LEVELS, LevelConfig, VIEW_W, VIEW_H } from '../levels';
import { story } from '../content/story';

const SCALE = 0.72; // taille d'affichage des personnages
const SPEED = 270;
const JUMP = 720;

export class LevelScene extends Scene {
  private levelIndex = 0;
  private cfg!: LevelConfig;
  private player!: Physics.Arcade.Sprite;
  private hearts!: Physics.Arcade.Group;
  private chest!: GameObjects.Image;
  private glow!: GameObjects.Image;
  private prompt!: GameObjects.Text;
  private bubble?: GameObjects.Text;
  private greeter?: GameObjects.Sprite;
  private collected = 0;
  private busy = false;
  private chestUnlocked = false;
  private chestOpened = false;
  private lastGround = 0;
  private wasAir = false;
  private landUntil = 0;
  private keys!: {
    left: Input.Keyboard.Key; right: Input.Keyboard.Key; a: Input.Keyboard.Key; d: Input.Keyboard.Key;
    up: Input.Keyboard.Key; w: Input.Keyboard.Key; space: Input.Keyboard.Key; e: Input.Keyboard.Key; enter: Input.Keyboard.Key;
  };

  constructor() {
    super('Level');
  }

  init(data: { level?: number }) {
    this.levelIndex = data?.level ?? 0;
  }

  create() {
    const cfg = LEVELS[this.levelIndex];
    this.cfg = cfg;
    this.collected = 0;
    this.busy = false;
    this.chestUnlocked = false;
    this.chestOpened = false;
    this.wasAir = false;
    this.bubble = undefined;
    this.greeter = undefined;

    // Le sol = bas du monde physique : le personnage s'y pose.
    this.physics.world.setBounds(0, 0, cfg.worldW, cfg.groundY);
    this.cameras.main.setBounds(0, 0, cfg.worldW, VIEW_H);

    // Décor : tuiles en miroir pour un défilement sans coupure visible.
    const tiles = Math.ceil(cfg.worldW / VIEW_W);
    for (let i = 0; i < tiles; i++) {
      this.add.image(i * VIEW_W, 0, cfg.bg).setOrigin(0, 0).setDisplaySize(VIEW_W, VIEW_H).setFlipX(i % 2 === 1).setDepth(0);
    }

    // Lucioles
    for (let i = 0; i < 45; i++) {
      const c = this.add.circle(Math.random() * cfg.worldW, 120 + Math.random() * (cfg.groundY - 100), 2 + Math.random() * 2, 0xffe9a0, 0.9).setDepth(12);
      this.tweens.add({
        targets: c,
        x: c.x + (Math.random() - 0.5) * 120,
        y: c.y - 30 - Math.random() * 60,
        alpha: 0.15,
        duration: 2000 + Math.random() * 2500,
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2000,
        ease: 'Sine.easeInOut',
      });
    }

    const solids: GameObjects.Rectangle[] = [];

    // Obstacles
    cfg.rocks.forEach((x) => {
      this.add.image(x, cfg.groundY + 10, 'rock').setOrigin(0.5, 1).setScale(0.42).setDepth(5);
      const r = this.add.rectangle(x, cfg.groundY - 28, 64, 56, 0x000000, 0);
      this.physics.add.existing(r, true);
      solids.push(r);
    });

    // Plateformes (on peut les traverser par en dessous)
    cfg.platforms.forEach((p) => {
      const w = 420 * 0.6;
      const h = 146 * 0.6;
      this.add.image(p.x, p.surfaceY + 0.14 * h, 'platform').setScale(0.6).setDepth(5);
      const r = this.add.rectangle(p.x, p.surfaceY + 5, w * 0.85, 10, 0x000000, 0);
      this.physics.add.existing(r, true);
      const body = r.body as Physics.Arcade.StaticBody;
      body.checkCollision.down = false;
      body.checkCollision.left = false;
      body.checkCollision.right = false;
      solids.push(r);
    });

    // Coffre
    this.glow = this.add.image(cfg.chestX, cfg.groundY - 70, 'glow').setScale(0.65).setAlpha(0).setDepth(5);
    this.chest = this.add.image(cfg.chestX, cfg.groundY + 8, 'chest_closed').setOrigin(0.5, 1).setScale(0.4).setDepth(6);
    this.prompt = this.add
      .text(cfg.chestX, cfg.groundY - 190, '', { fontFamily: 'Georgia, serif', fontSize: '22px', color: '#fff6d6', backgroundColor: '#1a1040cc', padding: { x: 12, y: 8 }, align: 'center' })
      .setOrigin(0.5)
      .setDepth(20)
      .setVisible(false);

    // Cœurs
    this.hearts = this.physics.add.group({ allowGravity: false, immovable: true });
    cfg.hearts.forEach((h, i) => {
      const s = this.hearts.create(h.x, h.y, 'heart') as Physics.Arcade.Sprite;
      s.setScale(0.45).setDepth(7);
      this.tweens.add({ targets: s, y: h.y - 10, duration: 900 + (i % 3) * 150, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    });

    // Héroïne
    this.player = this.physics.add.sprite(cfg.startX, cfg.groundY, 'her-idle_0').setOrigin(0.5, 1).setScale(SCALE).setDepth(10);
    const bw = 80;
    const bh = 240;
    this.player.body!.setSize(bw, bh);
    this.player.body!.setOffset((this.player.width - bw) / 2, this.player.height - bh);
    this.player.setCollideWorldBounds(true);
    this.player.anims.play('her-idle');
    solids.forEach((s) => this.physics.add.collider(this.player, s));
    this.physics.add.overlap(this.player, this.hearts, (_p, h) => this.collectHeart(h as Physics.Arcade.Sprite));

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.fadeIn(700);

    // Prince qui accueille (niveau 1)
    if (cfg.princeGreeting) {
      this.greeter = this.add.sprite(cfg.princeGreeting, cfg.groundY, 'him-wave').setOrigin(0.5, 1).setScale(SCALE).setFlipX(true).setDepth(8);
      this.greeter.anims.play('him-wave');
      this.bubble = this.makeBubble(cfg.princeGreeting, cfg.groundY - 250, story.princeGreeting);
    }

    // Clavier
    const kb = this.input.keyboard!;
    this.keys = {
      left: kb.addKey('LEFT'), right: kb.addKey('RIGHT'), a: kb.addKey('A'), d: kb.addKey('D'),
      up: kb.addKey('UP'), w: kb.addKey('W'), space: kb.addKey('SPACE'), e: kb.addKey('E'), enter: kb.addKey('ENTER'),
    };

    bus.on('letter-closed', this.onLetterClosed, this);
    this.events.once('shutdown', () => bus.off('letter-closed', this.onLetterClosed, this));

    this.emitHud();
  }

  private makeBubble(x: number, y: number, text: string) {
    return this.add
      .text(x, y, text, { fontFamily: 'Georgia, serif', fontSize: '22px', color: '#2a1a40', backgroundColor: '#fff8e6', padding: { x: 14, y: 10 }, wordWrap: { width: 320 }, align: 'center' })
      .setOrigin(0.5, 1)
      .setDepth(20);
  }

  private emitHud() {
    bus.emit('hud', {
      level: this.levelIndex,
      title: story.levelTitles[this.levelIndex],
      hearts: this.collected,
      required: this.cfg.required,
      total: this.cfg.hearts.length,
    });
  }

  private collectHeart(h: Physics.Arcade.Sprite) {
    if (!h.active) return;
    h.disableBody(true, false);
    this.tweens.killTweensOf(h);
    this.tweens.add({ targets: h, scale: 0.9, alpha: 0, y: h.y - 40, duration: 350, onComplete: () => h.destroy() });
    this.collected++;
    this.emitHud();
    if (!this.chestUnlocked && this.collected >= this.cfg.required) {
      this.chestUnlocked = true;
      this.tweens.add({ targets: this.glow, alpha: 0.7, duration: 600, yoyo: true, repeat: -1 });
      bus.emit('toast', 'Le coffre s’est réveillé ✨ Va le retrouver !');
    }
  }

  update(time: number) {
    const body = this.player.body as Physics.Arcade.Body;
    const onGround = body.blocked.down || body.touching.down;
    if (onGround) this.lastGround = time;

    const jp = Input.Keyboard.JustDown(this.keys.space) || Input.Keyboard.JustDown(this.keys.up) || Input.Keyboard.JustDown(this.keys.w) || controls.jumpPressed;
    const act = Input.Keyboard.JustDown(this.keys.e) || Input.Keyboard.JustDown(this.keys.enter) || controls.actionPressed;
    controls.jumpPressed = false;
    controls.actionPressed = false;

    // Bulle du prince : disparaît quand on l'a dépassé
    if (this.greeter && this.player.x > this.cfg.princeGreeting! + 330) {
      const g = this.greeter;
      const b = this.bubble;
      this.greeter = undefined;
      this.bubble = undefined;
      this.tweens.add({ targets: [g, b], alpha: 0, duration: 800, onComplete: () => { g.destroy(); b?.destroy(); } });
    }

    if (this.busy) {
      this.player.setVelocityX(0);
      return;
    }

    const left = this.keys.left.isDown || this.keys.a.isDown || controls.left;
    const right = this.keys.right.isDown || this.keys.d.isDown || controls.right;
    let dir = 0;
    if (left && !right) dir = -1;
    if (right && !left) dir = 1;
    this.player.setVelocityX(dir * SPEED);
    if (dir !== 0) this.player.setFlipX(dir < 0);

    if (jp && time - this.lastGround < 110) {
      this.player.setVelocityY(-JUMP);
      this.lastGround = -1000;
    }

    // Animation
    if (!onGround) {
      this.wasAir = true;
      this.player.anims.stop();
      this.player.setTexture(body.velocity.y < -80 ? 'her-jump_1' : 'her-jump_2');
    } else {
      if (this.wasAir) {
        this.wasAir = false;
        this.landUntil = time + 110;
      }
      if (time < this.landUntil) {
        this.player.anims.stop();
        this.player.setTexture('her-jump_3');
      } else if (dir !== 0) {
        this.player.anims.play('her-walk', true);
      } else {
        this.player.anims.play('her-idle', true);
      }
    }

    // Coffre
    const near = !this.chestOpened && Math.abs(this.player.x - this.cfg.chestX) < 160;
    if (near) {
      const touch = this.sys.game.device.input.touch;
      const missing = this.cfg.required - this.collected;
      this.prompt.setText(this.chestUnlocked ? (touch ? 'Appuie sur ❤ pour ouvrir' : 'Appuie sur E pour ouvrir') : `Verrouillé : encore ${missing} ❤`);
      this.prompt.setVisible(true);
      if (act) {
        if (this.chestUnlocked && onGround) this.openChest();
        else if (!this.chestUnlocked) bus.emit('toast', `Il te faut encore ${missing} cœur${missing > 1 ? 's' : ''} pour réveiller ce coffre`);
      }
    } else {
      this.prompt.setVisible(false);
    }
  }

  private openChest() {
    this.busy = true;
    this.chestOpened = true;
    this.prompt.setVisible(false);
    this.tweens.killTweensOf(this.glow);
    this.player.setFlipX(false);
    this.player.anims.stop();
    this.player.setTexture('her-interact_0');

    this.time.delayedCall(350, () => {
      this.player.setTexture('her-interact_1');
      this.chest.setTexture('chest_open');
      this.glow.setAlpha(0.9);
      this.tweens.add({ targets: this.glow, scale: 1.1, alpha: 0.5, duration: 1200, yoyo: true, repeat: -1 });
      for (let i = 0; i < 12; i++) {
        const h = this.add.image(this.cfg.chestX + (Math.random() - 0.5) * 80, this.cfg.groundY - 90, 'heart').setScale(0.15 + Math.random() * 0.15).setDepth(15);
        this.tweens.add({ targets: h, y: h.y - 160 - Math.random() * 120, x: h.x + (Math.random() - 0.5) * 200, alpha: 0, duration: 1400 + Math.random() * 800, delay: i * 70, onComplete: () => h.destroy() });
      }
    });
    this.time.delayedCall(1100, () => this.princeEnters());
  }

  private princeEnters() {
    const { chestX, groundY, princeFinalPose } = this.cfg;
    const prince = this.add.sprite(chestX + 700, groundY, 'him-walk_0').setOrigin(0.5, 1).setScale(SCALE).setFlipX(true).setDepth(8);
    prince.anims.play('him-walk');
    const targetX = chestX + 220;
    this.tweens.add({
      targets: prince,
      x: targetX,
      duration: 2200,
      ease: 'Sine.easeOut',
      onComplete: () => {
        prince.anims.play(princeFinalPose === 'read' ? 'him-read' : 'him-wave');
        this.player.setTexture('her-idle_0');
        this.time.delayedCall(1700, () => bus.emit('chest-opened', this.levelIndex));
      },
    });
  }

  private onLetterClosed(index: number) {
    if (index !== this.levelIndex) return;
    this.cameras.main.fadeOut(900);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (this.levelIndex < LEVELS.length - 1) this.scene.restart({ level: this.levelIndex + 1 });
      else this.scene.start('Ending');
    });
  }
}
