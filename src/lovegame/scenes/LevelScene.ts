import { Scene, Input, GameObjects, Physics } from 'phaser';
import { bus } from '../bus';
import { controls } from '../controls';
import {
  LEVELS,
  LevelConfig,
  NpcConfig,
  InteractionSpotConfig,
  VIEW_W,
  VIEW_H,
} from '../levels';
import { story } from '../content/story';
import { progressionStore } from '../state/ProgressionStore';
import { HIDDEN_HEARTS, OPTIONAL_MEMORIES } from '../content/collectibles';

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
  private npcs: {
    cfg: NpcConfig;
    container: GameObjects.Container;
    bubble: GameObjects.Text;
    prompt: GameObjects.Text;
  }[] = [];

  // Plateformes mobiles
  private movingPlatforms: {
    img: GameObjects.Image;
    collider: GameObjects.Rectangle;
    prevX: number;
    prevY: number;
    dx: number;
    dy: number;
  }[] = [];

  // Fragments à ramasser
  private fragmentItems: {
    word: string;
    container: GameObjects.Container;
    trigger: GameObjects.Rectangle;
  }[] = [];

  // Objets / Souvenirs facultatifs
  private optionalMemoryItems: {
    id: string;
    container: GameObjects.Container;
    trigger: GameObjects.Rectangle;
  }[] = [];

  // Points d'interaction (lanternes, coffre capricieux, stèles des valeurs)
  private spots: {
    cfg: InteractionSpotConfig;
    container: GameObjects.Container;
    bubble: GameObjects.Text;
    prompt: GameObjects.Text;
  }[] = [];

  // Socle Central de l'Avenir (Niveau Pont)
  private pedestalPrompt?: GameObjects.Text;
  private pedestalSockets: { circle: GameObjects.Arc; icon: GameObjects.Text; glow: GameObjects.Image }[] = [];

  // Checkpoints et retour de chute
  private checkpointSprites: {
    x: number;
    y: number;
    light: GameObjects.Image;
    activated: boolean;
  }[] = [];
  private currentCheckpoint = { x: 250, y: 560 };
  private isRespawning = false;

  // Arche d'assemblage / barrière
  private assemblyBarrier?: GameObjects.Rectangle;
  private assemblyGatePrompt?: GameObjects.Text;

  private dialogueActive = false;
  private collected = 0;
  private busy = false;
  private chestUnlocked = false;
  private chestOpened = false;
  private lastGround = 0;
  private wasAir = false;
  private landUntil = 0;
  private keys!: {
    left: Input.Keyboard.Key;
    right: Input.Keyboard.Key;
    a: Input.Keyboard.Key;
    d: Input.Keyboard.Key;
    up: Input.Keyboard.Key;
    w: Input.Keyboard.Key;
    space: Input.Keyboard.Key;
    e: Input.Keyboard.Key;
    enter: Input.Keyboard.Key;
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
    this.movingPlatforms = [];
    this.fragmentItems = [];
    this.spots = [];
    this.checkpointSprites = [];
    this.currentCheckpoint = { x: cfg.startX, y: cfg.groundY };
    this.isRespawning = false;
    this.assemblyBarrier = undefined;
    this.assemblyGatePrompt = undefined;
    this.pedestalPrompt = undefined;
    this.pedestalSockets = [];

    // Le sol = bas du monde physique : le personnage s'y pose.
    this.physics.world.setBounds(0, 0, cfg.worldW, cfg.groundY);
    this.cameras.main.setBounds(0, 0, cfg.worldW, VIEW_H);

    // Décor : tuiles en miroir pour un défilement sans coupure visible.
    const tiles = Math.ceil(cfg.worldW / VIEW_W);
    for (let i = 0; i < tiles; i++) {
      this.add
        .image(i * VIEW_W, 0, cfg.bg)
        .setOrigin(0, 0)
        .setDisplaySize(VIEW_W, VIEW_H)
        .setFlipX(i % 2 === 1)
        .setDepth(0);
    }

    // Lucioles / Étoiles flottantes
    const particleColor = this.levelIndex === 0 ? 0xffe9a0 : 0xaee6ff;
    for (let i = 0; i < 45; i++) {
      const c = this.add
        .circle(
          Math.random() * cfg.worldW,
          100 + Math.random() * (cfg.groundY - 80),
          2 + Math.random() * 2,
          particleColor,
          0.9
        )
        .setDepth(12);
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

    // Obstacles au sol
    cfg.rocks.forEach((x) => {
      this.add.image(x, cfg.groundY + 10, 'rock').setOrigin(0.5, 1).setScale(0.42).setDepth(5);
      const r = this.add.rectangle(x, cfg.groundY - 28, 64, 56, 0x000000, 0);
      this.physics.add.existing(r, true);
      solids.push(r);
    });

    // Plateformes fixes (traversables par en-dessous)
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

    // Plateformes mobiles
    if (cfg.movingPlatforms) {
      cfg.movingPlatforms.forEach((mp) => {
        const w = 420 * 0.55;
        const h = 146 * 0.55;
        const img = this.add.image(mp.x, mp.surfaceY + 0.14 * h, 'platform').setScale(0.55).setDepth(5);
        img.setTint(this.levelIndex === 0 ? 0xffd5e5 : 0xc7e4ff);

        // Halo féerique sous la plateforme mobile
        const platGlow = this.add.image(mp.x, mp.surfaceY + 0.14 * h + 10, 'glow').setScale(0.25).setAlpha(0.4).setDepth(4);
        this.tweens.add({ targets: platGlow, alpha: 0.7, scale: 0.32, duration: 1000, yoyo: true, repeat: -1 });

        const r = this.add.rectangle(mp.x, mp.surfaceY + 5, w * 0.85, 12, 0x000000, 0);
        this.physics.add.existing(r, false);
        const body = r.body as Physics.Arcade.Body;
        body.setAllowGravity(false);
        body.setImmovable(true);
        body.checkCollision.down = false;
        body.checkCollision.left = false;
        body.checkCollision.right = false;

        const mpObj = {
          img,
          collider: r,
          prevX: mp.x,
          prevY: mp.surfaceY + 5,
          dx: 0,
          dy: 0,
        };
        this.movingPlatforms.push(mpObj);

        const targetX = mp.axis === 'y' ? mp.x : mp.x + mp.distance;
        const targetY = mp.axis === 'y' ? mp.surfaceY + mp.distance : mp.surfaceY;

        this.tweens.add({
          targets: [img, platGlow, r],
          x: targetX,
          y: (target: GameObjects.GameObject) => {
            if (target === img) return targetY + 0.14 * h;
            if (target === platGlow) return targetY + 0.14 * h + 10;
            return targetY + 5;
          },
          duration: mp.speed || 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      });
    }

    // Checkpoints visuels (Lanternes / Pylônes célestes)
    if (cfg.checkpoints) {
      this.currentCheckpoint = { x: cfg.checkpoints[0].x, y: cfg.checkpoints[0].y };
      cfg.checkpoints.forEach((cp, idx) => {
        this.add.rectangle(cp.x, cfg.groundY - 26, 4, 52, 0x3d2c52).setDepth(4);
        this.add.circle(cp.x, cfg.groundY - 50, 8, 0xffd97a).setDepth(5);
        const light = this.add.image(cp.x, cfg.groundY - 50, 'glow').setScale(0.2).setAlpha(idx === 0 ? 0.75 : 0.2).setDepth(4);
        this.checkpointSprites.push({ x: cp.x, y: cp.y, light, activated: idx === 0 });
      });
    }

    // Zones de danger sous les plateformes
    const hazardRanges =
      this.levelIndex === 0
        ? [
            { minX: 1060, maxX: 1190 },
            { minX: 1780, maxX: 1930 },
            { minX: 2820, maxX: 2970 },
          ]
        : [
            { minX: 1680, maxX: 1820 },
            { minX: 2480, maxX: 2620 },
            { minX: 2920, maxX: 3050 },
          ];

    hazardRanges.forEach((hz) => {
      for (let hx = hz.minX + 15; hx < hz.maxX; hx += 35) {
        if (this.levelIndex === 0) {
          this.add.text(hx, cfg.groundY - 8, '🌹', { fontSize: '20px' }).setOrigin(0.5, 1).setDepth(4);
        } else {
          this.add.text(hx, cfg.groundY - 8, '☁️', { fontSize: '20px' }).setOrigin(0.5, 1).setDepth(4);
        }
        this.add.rectangle(hx, cfg.groundY - 4, 25, 8, this.levelIndex === 0 ? 0x3d1020 : 0x141033, 0.6).setDepth(3);
      }
    });

    // Coffre de fin de niveau
    this.glow = this.add.image(cfg.chestX, cfg.groundY - 70, 'glow').setScale(0.65).setAlpha(0).setDepth(5);
    this.chest = this.add.image(cfg.chestX, cfg.groundY + 8, 'chest_closed').setOrigin(0.5, 1).setScale(0.4).setDepth(6);
    this.prompt = this.add
      .text(cfg.chestX, cfg.groundY - 190, '', {
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        color: '#fff6d6',
        backgroundColor: '#1a1040cc',
        padding: { x: 12, y: 8 },
        align: 'center',
      })
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

    // Fragments flottants à ramasser
    if (cfg.fragments) {
      const collectedFragments = progressionStore.getState().collectedFragments;
      cfg.fragments.forEach((f) => {
        if (collectedFragments.includes(f.word)) return;

        const container = this.add.container(f.x, f.y).setDepth(15);
        const glow = this.add.image(0, 0, 'glow').setScale(0.3).setAlpha(0.65);
        this.tweens.add({ targets: glow, alpha: 0.35, scale: 0.36, duration: 900, yoyo: true, repeat: -1 });

        const badgeWidth = f.word.length > 5 ? 94 : 78;
        const badge = this.add.rectangle(0, 0, badgeWidth, 34, 0x161c42, 0.9);
        badge.setStrokeStyle(2, 0xffd97a);

        const txt = this.add
          .text(0, 0, `✨ ${f.word} ✨`, {
            fontFamily: 'Georgia, serif',
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#ffd97a',
          })
          .setOrigin(0.5);

        container.add([glow, badge, txt]);

        this.tweens.add({
          targets: container,
          y: f.y - 12,
          duration: 1100,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        const trigger = this.add.rectangle(f.x, f.y, badgeWidth, 50, 0x000000, 0);
        this.physics.add.existing(trigger, true);

        this.fragmentItems.push({ word: f.word, container, trigger });
      });
    }

    // Objets / Souvenirs facultatifs (Fleur séchée, Chocolat réconfort, etc.)
    this.optionalMemoryItems = [];
    if (cfg.optionalCollectibles) {
      cfg.optionalCollectibles.forEach((col) => {
        const container = this.add.container(col.x, col.y).setDepth(8);
        const glow = this.add.image(0, 0, 'glow').setScale(0.35).setAlpha(0.6);
        this.tweens.add({ targets: glow, alpha: 0.25, scale: 0.45, duration: 1000, yoyo: true, repeat: -1 });

        const icon = this.add.text(0, -6, col.icon, { fontSize: '26px' }).setOrigin(0.5);
        this.tweens.add({ targets: icon, y: -16, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        const label = this.add
          .text(0, 22, col.label, {
            fontFamily: 'Georgia, serif',
            fontSize: '12px',
            color: '#ffd97a',
            backgroundColor: '#1a1040cc',
            padding: { x: 6, y: 3 },
          })
          .setOrigin(0.5);

        container.add([glow, icon, label]);

        const trigger = this.add.rectangle(col.x, col.y, 60, 60, 0x000000, 0);
        this.physics.add.existing(trigger, true);

        this.optionalMemoryItems.push({ id: col.id, container, trigger });
      });
    }

    // Socle Central de l'Avenir (Niveau Pont)
    if (cfg.pedestal) {
      const pedX = cfg.pedestal.x;
      const pedY = cfg.groundY;
      const pedContainer = this.add.container(pedX, pedY).setDepth(9);

      const base = this.add.rectangle(0, -14, 110, 28, 0x22183d);
      base.setStrokeStyle(2, 0xffd97a);
      const pedestalGlow = this.add.image(0, -28, 'glow').setScale(0.4).setAlpha(0.5);
      this.tweens.add({ targets: pedestalGlow, alpha: 0.8, scale: 0.48, duration: 1200, yoyo: true, repeat: -1 });

      const gemOffsets = [-32, 0, 32];
      const gemColors = [0xff5277, 0xffd97a, 0x4da6ff];
      const gemIcons = ['💎', '🛠️', '🤝'];

      gemOffsets.forEach((ox, i) => {
        const socket = this.add.circle(ox, -28, 11, 0x140e28);
        socket.setStrokeStyle(1.5, gemColors[i]);
        const socketGlow = this.add.image(ox, -28, 'glow').setScale(0.2).setAlpha(0.3);
        const icon = this.add.text(ox, -28, gemIcons[i], { fontSize: '12px' }).setOrigin(0.5);
        pedContainer.add([socket, socketGlow, icon]);
        this.pedestalSockets.push({ circle: socket, icon, glow: socketGlow });
      });

      const tag = this.add
        .text(0, 10, cfg.pedestal.label, {
          fontFamily: 'Georgia, serif',
          fontSize: '14px',
          fontStyle: 'bold',
          color: '#ffd97a',
          backgroundColor: '#1a1040cc',
          padding: { x: 8, y: 4 },
        })
        .setOrigin(0.5);

      const bubble = this.add
        .text(0, -65, '✨', {
          fontFamily: 'Georgia, serif',
          fontSize: '22px',
          fontStyle: 'bold',
          color: '#1a1040',
          backgroundColor: '#ffd97a',
          padding: { x: 8, y: 4 },
        })
        .setOrigin(0.5);
      this.tweens.add({ targets: bubble, y: -72, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

      pedContainer.add([base, pedestalGlow, tag, bubble]);

      this.pedestalPrompt = this.add
        .text(pedX, pedY - 140, '', {
          fontFamily: 'Georgia, serif',
          fontSize: '17px',
          color: '#fff6d6',
          backgroundColor: '#1a1040e6',
          padding: { x: 10, y: 6 },
          align: 'center',
        })
        .setOrigin(0.5)
        .setDepth(25)
        .setVisible(false);
    }

    // Points d'interaction (Lanternes, Coffre Capricieux, Étoiles des Valeurs)
    if (cfg.interactionSpots) {
      cfg.interactionSpots.forEach((spot) => {
        const container = this.add.container(spot.x, cfg.groundY).setDepth(9);

        if (spot.id === 'spot-lanterns') {
          // 3 lanternes suspendues (bleue, dorée, blanche)
          const colors = [0x4da6ff, 0xffd97a, 0xffffff];
          [-28, 0, 28].forEach((offsetX, i) => {
            const wire = this.add.rectangle(offsetX, -110, 2, 45, 0x4a3b69);
            const lan = this.add.circle(offsetX, -85, 12, colors[i]);
            const lanGlow = this.add.image(offsetX, -85, 'glow').setScale(0.2).setAlpha(0.6);
            this.tweens.add({ targets: [lan, lanGlow], y: -90, duration: 800 + i * 200, yoyo: true, repeat: -1 });
            container.add([wire, lan, lanGlow]);
          });
        } else if (spot.id.startsWith('spot-valeurs-')) {
          // Stèles des étoiles de la confiance
          const obelisk = this.add.rectangle(0, -60, 28, 90, 0x22183d);
          obelisk.setStrokeStyle(1.5, 0xffd97a);
          const starGlow = this.add.image(0, -110, 'glow').setScale(0.35).setAlpha(0.7);
          this.tweens.add({ targets: starGlow, alpha: 0.35, scale: 0.42, duration: 1100, yoyo: true, repeat: -1 });
          const star = this.add.text(0, -110, '⭐', { fontSize: '26px' }).setOrigin(0.5);
          this.tweens.add({ targets: star, scale: 1.15, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
          container.add([obelisk, starGlow, star]);
        } else {
          // spot-coffre-capricieux
          const glow = this.add.image(0, -90, 'glow').setScale(0.35).setAlpha(0.6);
          this.tweens.add({ targets: glow, alpha: 0.3, scale: 0.3, duration: 1200, yoyo: true, repeat: -1 });
          const chestIcon = this.add.text(0, -90, '🎁', { fontSize: '32px' }).setOrigin(0.5);
          this.tweens.add({ targets: chestIcon, y: -98, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
          container.add([glow, chestIcon]);
        }

        const nameTag = this.add
          .text(0, -35, spot.name, {
            fontFamily: 'Georgia, serif',
            fontSize: '15px',
            color: '#ffd97a',
            backgroundColor: '#1a1040cc',
            padding: { x: 8, y: 4 },
          })
          .setOrigin(0.5);

        const bubble = this.add
          .text(0, -145, spot.icon || '!', {
            fontFamily: 'Georgia, serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#1a1040',
            backgroundColor: '#ffd97a',
            padding: { x: 8, y: 4 },
          })
          .setOrigin(0.5);
        this.tweens.add({ targets: bubble, y: -155, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        const prompt = this.add
          .text(spot.x, cfg.groundY - 185, '', {
            fontFamily: 'Georgia, serif',
            fontSize: '17px',
            color: '#fff6d6',
            backgroundColor: '#1a1040e6',
            padding: { x: 10, y: 6 },
            align: 'center',
          })
          .setOrigin(0.5)
          .setDepth(25)
          .setVisible(false);

        container.add([nameTag, bubble]);
        this.spots.push({ cfg: spot, container, bubble, prompt });
      });
    }

    // Arche de passage / Barrière
    if (cfg.assemblyGate) {
      const gateX = cfg.assemblyGate.x;
      this.add.rectangle(gateX - 35, cfg.groundY - 120, 10, 240, 0xffd97a, 0.7).setDepth(5);
      this.add.rectangle(gateX + 35, cfg.groundY - 120, 10, 240, 0xffd97a, 0.7).setDepth(5);
      this.add
        .text(gateX, cfg.groundY - 245, `🌌 ${cfg.assemblyGate.label} 🌌`, {
          fontFamily: 'Georgia, serif',
          fontSize: '17px',
          fontStyle: 'bold',
          color: '#ffd97a',
          backgroundColor: '#1a1040e6',
          padding: { x: 10, y: 6 },
        })
        .setOrigin(0.5)
        .setDepth(6);

      const isGateSolved =
        this.levelIndex === 0
          ? progressionStore.isPuzzleSolved(cfg.assemblyGate.puzzleId)
          : progressionStore.getState().missions['pedestal_completed'] === 'completed';

      if (!isGateSolved) {
        this.assemblyBarrier = this.add.rectangle(gateX + 40, cfg.groundY - 120, 14, 240, 0x7bc4ff, 0.35).setDepth(5);
        this.physics.add.existing(this.assemblyBarrier, true);
        solids.push(this.assemblyBarrier);
      }

      this.assemblyGatePrompt = this.add
        .text(gateX, cfg.groundY - 190, '', {
          fontFamily: 'Georgia, serif',
          fontSize: '17px',
          color: '#fff6d6',
          backgroundColor: '#1a1040e6',
          padding: { x: 10, y: 6 },
          align: 'center',
        })
        .setOrigin(0.5)
        .setDepth(25)
        .setVisible(false);
    }

    // Héroïne
    this.player = this.physics.add.sprite(cfg.startX, cfg.groundY, 'her-idle_0').setOrigin(0.5, 1).setScale(SCALE).setDepth(10);
    const bw = 80;
    const bh = 240;
    this.player.body!.setSize(bw, bh);
    this.player.body!.setOffset((this.player.width - bw) / 2, this.player.height - bh);
    this.player.setCollideWorldBounds(true);
    this.player.anims.play('her-idle');

    solids.forEach((s) => this.physics.add.collider(this.player, s));
    this.movingPlatforms.forEach((mp) => this.physics.add.collider(this.player, mp.collider));
    this.physics.add.overlap(this.player, this.hearts, (_p, h) => this.collectHeart(h as Physics.Arcade.Sprite));

    // Overlap pour les fragments à ramasser
    this.fragmentItems.forEach((item) => {
      this.physics.add.overlap(this.player, item.trigger, () => {
        this.collectFragmentItem(item.word, item.container, item.trigger);
      });
    });

    // Overlap pour les souvenirs facultatifs à ramasser
    this.optionalMemoryItems.forEach((item) => {
      this.physics.add.overlap(this.player, item.trigger, () => {
        this.collectOptionalMemory(item.id, item.container, item.trigger);
      });
    });

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.fadeIn(700);

    // Prince qui accueille (si configuré)
    if (cfg.princeGreeting) {
      this.greeter = this.add.sprite(cfg.princeGreeting, cfg.groundY, 'him-wave').setOrigin(0.5, 1).setScale(SCALE).setFlipX(true).setDepth(8);
      this.greeter.anims.play('him-wave');
      this.bubble = this.makeBubble(cfg.princeGreeting, cfg.groundY - 250, story.princeGreeting);
    }

    // Initialisation des PNJ
    this.dialogueActive = false;
    this.npcs = [];
    if (cfg.npcs) {
      cfg.npcs.forEach((npcCfg) => {
        const container = this.add.container(npcCfg.x, cfg.groundY);
        container.setDepth(9);

        const glow = this.add.image(0, -90, 'glow').setScale(0.35).setAlpha(0.6);
        this.tweens.add({ targets: glow, alpha: 0.3, scale: 0.3, duration: 1200, yoyo: true, repeat: -1 });

        const heart = this.add.image(0, -90, 'heart').setScale(0.35);
        this.tweens.add({ targets: heart, y: -98, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        const nameTag = this.add
          .text(0, -35, npcCfg.name, {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#ffd97a',
            backgroundColor: '#1a1040cc',
            padding: { x: 8, y: 4 },
          })
          .setOrigin(0.5);

        const bubble = this.add
          .text(0, -145, '!', {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#1a1040',
            backgroundColor: '#ffd97a',
            padding: { x: 10, y: 4 },
          })
          .setOrigin(0.5);
        this.tweens.add({ targets: bubble, y: -155, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        const prompt = this.add
          .text(npcCfg.x, cfg.groundY - 185, '', {
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            color: '#fff6d6',
            backgroundColor: '#1a1040e6',
            padding: { x: 10, y: 6 },
            align: 'center',
          })
          .setOrigin(0.5)
          .setDepth(25)
          .setVisible(false);

        container.add([glow, heart, nameTag, bubble]);
        this.npcs.push({ cfg: npcCfg, container, bubble, prompt });
      });
    }

    // Clavier
    const kb = this.input.keyboard!;
    this.keys = {
      left: kb.addKey('LEFT'),
      right: kb.addKey('RIGHT'),
      a: kb.addKey('A'),
      d: kb.addKey('D'),
      up: kb.addKey('UP'),
      w: kb.addKey('W'),
      space: kb.addKey('SPACE'),
      e: kb.addKey('E'),
      enter: kb.addKey('ENTER'),
    };

    bus.on('letter-closed', this.onLetterClosed, this);
    bus.on('progression-reset', this.onProgressionReset, this);
    bus.on('restart', this.onProgressionReset, this);
    bus.on('dialogue-closed', this.onDialogueClosed, this);
    bus.on('start-puzzle', this.onPuzzleStart, this);
    bus.on('puzzle-closed', this.onPuzzleClosed, this);
    bus.on('puzzle-solved', this.onPuzzleSolved, this);

    this.events.once('shutdown', () => {
      bus.off('letter-closed', this.onLetterClosed, this);
      bus.off('progression-reset', this.onProgressionReset, this);
      bus.off('restart', this.onProgressionReset, this);
      bus.off('dialogue-closed', this.onDialogueClosed, this);
      bus.off('start-puzzle', this.onPuzzleStart, this);
      bus.off('puzzle-closed', this.onPuzzleClosed, this);
      bus.off('puzzle-solved', this.onPuzzleSolved, this);
    });

    this.emitHud();
  }

  private collectFragmentItem(
    word: string,
    container: GameObjects.Container,
    trigger: GameObjects.Rectangle
  ) {
    if (!trigger.active) return;
    trigger.destroy();
    progressionStore.collectFragment(word);
    bus.emit('toast', `Fragment trouvé : « ${word} » ! ✨`);

    this.tweens.add({
      targets: container,
      y: container.y - 45,
      scale: 1.35,
      alpha: 0,
      duration: 500,
      ease: 'Back.easeIn',
      onComplete: () => container.destroy(),
    });
  }

  private collectOptionalMemory(
    id: string,
    container: GameObjects.Container,
    trigger: GameObjects.Rectangle
  ) {
    if (!trigger.active) return;
    trigger.destroy();
    const isNew = progressionStore.unlockMemory(id);
    const mem = OPTIONAL_MEMORIES.find((m) => m.id === id);
    if (mem) {
      bus.emit(
        'toast',
        isNew ? `✨ Souvenir découvert : « ${mem.title} » !` : `✨ Souvenir : ${mem.title}`
      );
    }

    this.tweens.add({
      targets: container,
      y: container.y - 50,
      scale: 1.4,
      alpha: 0,
      duration: 550,
      ease: 'Back.easeIn',
      onComplete: () => container.destroy(),
    });
  }

  private completePedestal() {
    this.busy = true;
    this.player.setVelocityX(0);
    this.player.anims.play('her-idle', true);
    if (this.pedestalPrompt) this.pedestalPrompt.setVisible(false);
    progressionStore.setMissionStatus('pedestal_completed', 'completed');

    // Allumer les 3 socles avec des halos étincelants
    this.pedestalSockets.forEach((s, idx) => {
      this.time.delayedCall(idx * 250, () => {
        this.tweens.add({
          targets: s.glow,
          alpha: 1,
          scale: 0.55,
          duration: 600,
          yoyo: true,
          repeat: -1,
        });
      });
    });

    // Dissoudre la barrière magique de l'arche finale
    if (this.assemblyBarrier) {
      this.tweens.add({
        targets: this.assemblyBarrier,
        alpha: 0,
        duration: 900,
        onComplete: () => {
          this.assemblyBarrier?.destroy();
          this.assemblyBarrier = undefined;
        },
      });
    }

    // Bulle de Cupidon
    const quote =
      this.cfg.pedestal?.quote ||
      'Félicitations ! Tu as trouvé les trois ingrédients d’une relation solide. Moi, j’aurais ajouté le chocolat… mais apparemment, personne ne m’écoute dans cette équipe. 😂';
    const bubble = this.makeBubble(this.cfg.pedestal!.x, this.cfg.groundY - 180, quote);
    bus.emit('toast', '✨ Les trois fragments de l’Avenir sont réunis sur le Socle !');

    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: bubble,
        alpha: 0,
        duration: 700,
        onComplete: () => {
          bubble.destroy();
          this.busy = false;
        },
      });
    });
  }

  private triggerCheckpointRespawn() {
    if (this.isRespawning) return;
    this.isRespawning = true;
    this.player.setVelocity(0, 0);

    this.tweens.add({
      targets: this.player,
      alpha: 0,
      duration: 180,
      onComplete: () => {
        this.player.setPosition(this.currentCheckpoint.x, this.currentCheckpoint.y);
        this.player.setVelocity(0, 0);
        bus.emit('toast', 'Oups ! Cupidon te rattrape au vol 🪽');
        this.tweens.add({
          targets: this.player,
          alpha: 1,
          duration: 250,
          onComplete: () => {
            this.isRespawning = false;
          },
        });
      },
    });
  }

  private onPuzzleStart() {
    this.busy = true;
    this.player.setVelocityX(0);
    this.player.anims.play('her-idle', true);
  }

  private onPuzzleClosed() {
    this.busy = false;
    if (
      this.cfg.assemblyGate &&
      progressionStore.isPuzzleSolved(this.cfg.assemblyGate.puzzleId) &&
      this.assemblyBarrier
    ) {
      this.assemblyBarrier.destroy();
      this.assemblyBarrier = undefined;
    }
  }

  private onPuzzleSolved(data: { puzzleId: string; newlySolved: boolean }) {
    if (data.puzzleId === 'puzzle-phrase-hasard') {
      if (this.assemblyBarrier) {
        this.tweens.add({
          targets: this.assemblyBarrier,
          alpha: 0,
          duration: 800,
          onComplete: () => {
            this.assemblyBarrier?.destroy();
            this.assemblyBarrier = undefined;
          },
        });
      }
      bus.emit('toast', 'L’Arche s’ouvre ! La constellation brille dans tout le ciel 🌟');
    }
  }

  private onDialogueClosed() {
    this.dialogueActive = false;
    this.busy = false;
  }

  private onProgressionReset() {
    this.scene.restart({ level: 0 });
  }

  private makeBubble(x: number, y: number, text: string) {
    return this.add
      .text(x, y, text, {
        fontFamily: 'Georgia, serif',
        fontSize: '20px',
        color: '#2a1a40',
        backgroundColor: '#fff8e6',
        padding: { x: 14, y: 10 },
        wordWrap: { width: 340 },
        align: 'center',
      })
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
    this.tweens.add({
      targets: h,
      scale: 0.9,
      alpha: 0,
      y: h.y - 40,
      duration: 350,
      onComplete: () => h.destroy(),
    });
    this.collected++;
    progressionStore.recordHearts(this.levelIndex, this.collected);
    this.emitHud();

    // Gestion des cœurs secrets / bonus au-delà du seuil requis (Activité secondaire facultative)
    if (this.collected > this.cfg.required) {
      const bonusIndex = this.collected - this.cfg.required;
      const zonePrefix = this.levelIndex === 0 ? 'coeur-cache-jardin-' : 'coeur-cache-pont-';
      const heartId = `${zonePrefix}${bonusIndex}`;
      const isNew = progressionStore.unlockHiddenHeart(heartId);
      const info = HIDDEN_HEARTS.find((item) => item.id === heartId);
      if (info) {
        bus.emit('toast', isNew ? `💖 ${info.anecdote}` : `💖 ${info.title} redécouvert !`);
      }
      // Effet cosmétique féerique doux sur l'héroïne
      this.player.setTint(0xffd5e5);
      this.time.delayedCall(1600, () => {
        if (this.player && this.player.active) {
          this.player.clearTint();
        }
      });
    }

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

    const jp =
      Input.Keyboard.JustDown(this.keys.space) ||
      Input.Keyboard.JustDown(this.keys.up) ||
      Input.Keyboard.JustDown(this.keys.w) ||
      controls.jumpPressed;
    const act =
      Input.Keyboard.JustDown(this.keys.e) ||
      Input.Keyboard.JustDown(this.keys.enter) ||
      controls.actionPressed;
    controls.jumpPressed = false;
    controls.actionPressed = false;

    // Mise à jour des plateformes mobiles et entraînement du joueur
    for (const mp of this.movingPlatforms) {
      mp.dx = mp.collider.x - mp.prevX;
      mp.dy = mp.collider.y - mp.prevY;
      mp.prevX = mp.collider.x;
      mp.prevY = mp.collider.y;
      (mp.collider.body as Physics.Arcade.Body).updateFromGameObject();

      const playerBody = this.player.body as Physics.Arcade.Body;
      const isStanding =
        playerBody.touching.down &&
        Math.abs(playerBody.bottom - mp.collider.y) < 14 &&
        this.player.x >= mp.collider.x - mp.collider.width / 2 - 15 &&
        this.player.x <= mp.collider.x + mp.collider.width / 2 + 15;

      if (isStanding) {
        this.player.x += mp.dx;
        this.player.y += mp.dy;
      }
    }

    // Gestion des points de contrôle
    for (const cp of this.checkpointSprites) {
      if (!cp.activated && this.player.x >= cp.x - 20) {
        cp.activated = true;
        this.currentCheckpoint = { x: cp.x, y: cp.y };
        this.tweens.add({ targets: cp.light, alpha: 0.85, scale: 0.32, duration: 400 });
        bus.emit('toast', 'Point de contrôle activé ✨');
      }
    }

    // Détection des dangers / chutes
    if (!this.isRespawning) {
      const hazardRanges =
        this.levelIndex === 0
          ? [
              { minX: 1060, maxX: 1190 },
              { minX: 1780, maxX: 1930 },
              { minX: 2820, maxX: 2970 },
            ]
          : [
              { minX: 1680, maxX: 1820 },
              { minX: 2480, maxX: 2620 },
              { minX: 2920, maxX: 3050 },
            ];
      const onGroundLevel = Math.abs(this.player.y - this.cfg.groundY) < 16;
      const inHazard = hazardRanges.some(
        (hz) => this.player.x >= hz.minX && this.player.x <= hz.maxX && onGroundLevel
      );
      if (inHazard || this.player.y > this.cfg.groundY + 30) {
        this.triggerCheckpointRespawn();
      }
    }

    // Bulle du prince : disparaît quand on l'a dépassé
    if (this.greeter && this.player.x > this.cfg.princeGreeting! + 330) {
      const g = this.greeter;
      const b = this.bubble;
      this.greeter = undefined;
      this.bubble = undefined;
      this.tweens.add({
        targets: [g, b],
        alpha: 0,
        duration: 800,
        onComplete: () => {
          g.destroy();
          b?.destroy();
        },
      });
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

    // Interaction avec les PNJ
    for (const npc of this.npcs) {
      const isNearNpc = Math.abs(this.player.x - npc.cfg.x) < 110 && !this.dialogueActive;
      if (isNearNpc) {
        const touch = this.sys.game.device.input.touch;
        npc.prompt.setText(touch ? 'Appuie sur ❤ pour parler' : 'Appuie sur E pour parler');
        npc.prompt.setVisible(true);

        if (act && !this.busy && !this.dialogueActive) {
          this.dialogueActive = true;
          this.busy = true;
          this.player.setVelocityX(0);
          this.player.anims.play('her-idle', true);
          npc.prompt.setVisible(false);
          bus.emit('start-dialogue', npc.cfg.dialogueId);
          break;
        }
      } else {
        npc.prompt.setVisible(false);
      }
    }

    // Interaction avec le Socle Central de l'Avenir (Niveau Pont)
    if (this.cfg.pedestal && this.pedestalPrompt) {
      const pedX = this.cfg.pedestal.x;
      const near = Math.abs(this.player.x - pedX) < 130 && !this.busy;
      const isCompleted = progressionStore.getState().missions['pedestal_completed'] === 'completed';

      if (near) {
        const touch = this.sys.game.device.input.touch;
        if (isCompleted) {
          this.pedestalPrompt.setText('Socle de l’Avenir illuminé ✨ (Courage, Travail, Soutien réunis)');
        } else {
          const gathered = this.cfg.pedestal.requiredFragments.filter((w) =>
            progressionStore.getState().collectedFragments.includes(w)
          );
          if (gathered.length >= this.cfg.pedestal.requiredFragments.length) {
            this.pedestalPrompt.setText(
              touch
                ? 'Appuie sur ❤ pour déposer les 3 fragments'
                : 'Appuie sur E pour déposer les 3 fragments'
            );
            if (act && !this.busy) {
              this.completePedestal();
            }
          } else {
            this.pedestalPrompt.setText(
              `Socle de l’Avenir (${gathered.length}/3) — Explore les trois îles célestes !`
            );
            if (act) {
              bus.emit('toast', 'Trouve les fragments du Courage, du Travail et du Soutien sur les hauteurs du pont !');
            }
          }
        }
        this.pedestalPrompt.setVisible(true);
      } else {
        this.pedestalPrompt.setVisible(false);
      }
    }

    // Interaction avec les Spots d'énigmes
    for (const spot of this.spots) {
      const isNear = Math.abs(this.player.x - spot.cfg.x) < 110 && !this.busy;
      const isSolved = progressionStore.isPuzzleSolved(spot.cfg.puzzleId);

      if (isNear) {
        const touch = this.sys.game.device.input.touch;
        if (isSolved) {
          spot.prompt.setText(`${spot.cfg.name} ✨ (Épreuve accomplie)`);
        } else {
          spot.prompt.setText(touch ? 'Appuie sur ❤ pour examiner' : 'Appuie sur E pour examiner');
          if (act && !this.busy) {
            this.busy = true;
            this.player.setVelocityX(0);
            this.player.anims.play('her-idle', true);
            spot.prompt.setVisible(false);
            bus.emit('start-puzzle', spot.cfg.puzzleId);
            break;
          }
        }
        spot.prompt.setVisible(true);
      } else {
        spot.prompt.setVisible(false);
      }
    }

    // Interaction avec l'Arche de Passage
    if (this.cfg.assemblyGate && this.assemblyGatePrompt) {
      const gateX = this.cfg.assemblyGate.x;
      const nearGate = Math.abs(this.player.x - gateX) < 130 && !this.busy;
      const isGateSolved =
        this.levelIndex === 0
          ? progressionStore.isPuzzleSolved(this.cfg.assemblyGate.puzzleId)
          : progressionStore.getState().missions['pedestal_completed'] === 'completed';

      if (nearGate) {
        const touch = this.sys.game.device.input.touch;

        if (isGateSolved) {
          this.assemblyGatePrompt.setText('L’Arche est ouverte ✨ Le passage vers le Prince est libre !');
        } else if (this.levelIndex === 0) {
          const collectedCount = progressionStore.getState().collectedFragments.length;
          if (collectedCount >= 6) {
            this.assemblyGatePrompt.setText(
              touch ? 'Appuie sur ❤ pour assembler la Constellation ✨' : 'Appuie sur E pour assembler la Constellation ✨'
            );
            if (act && !this.busy) {
              this.busy = true;
              this.player.setVelocityX(0);
              this.player.anims.play('her-idle', true);
              this.assemblyGatePrompt.setVisible(false);
              bus.emit('start-puzzle', this.cfg.assemblyGate.puzzleId);
            }
          } else {
            this.assemblyGatePrompt.setText(`Arche scellée : ${collectedCount}/6 fragments réunis`);
            if (act) {
              bus.emit('toast', `Trouve les 6 fragments cachés avant d’activer l’Arche ! (${collectedCount}/6)`);
            }
          }
        } else {
          // Niveau Pont
          this.assemblyGatePrompt.setText('Arche scellée : Dépose les 3 fragments sur le Socle de l’Avenir (x=2000)');
          if (act) {
            bus.emit('toast', 'Rassemble les fragments du Courage, du Travail et du Soutien sur le Socle au centre du pont !');
          }
        }
        this.assemblyGatePrompt.setVisible(true);
      } else {
        this.assemblyGatePrompt.setVisible(false);
      }
    }

    // Coffre final
    const near = !this.chestOpened && Math.abs(this.player.x - this.cfg.chestX) < 160;
    if (near) {
      const touch = this.sys.game.device.input.touch;
      const missing = this.cfg.required - this.collected;
      this.prompt.setText(
        this.chestUnlocked
          ? touch
            ? 'Appuie sur ❤ pour ouvrir'
            : 'Appuie sur E pour ouvrir'
          : `Verrouillé : encore ${missing} ❤`
      );
      this.prompt.setVisible(true);
      if (act) {
        if (this.chestUnlocked && onGround) this.openChest();
        else if (!this.chestUnlocked)
          bus.emit('toast', `Il te faut encore ${missing} cœur${missing > 1 ? 's' : ''} pour réveiller ce coffre`);
      }
    } else {
      this.prompt.setVisible(false);
    }
  }

  private openChest() {
    this.busy = true;
    this.chestOpened = true;
    progressionStore.openChest(this.levelIndex);
    progressionStore.unlockLetter(this.levelIndex);
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
        const h = this.add
          .image(this.cfg.chestX + (Math.random() - 0.5) * 80, this.cfg.groundY - 90, 'heart')
          .setScale(0.15 + Math.random() * 0.15)
          .setDepth(15);
        this.tweens.add({
          targets: h,
          y: h.y - 160 - Math.random() * 120,
          x: h.x + (Math.random() - 0.5) * 200,
          alpha: 0,
          duration: 1400 + Math.random() * 800,
          delay: i * 70,
          onComplete: () => h.destroy(),
        });
      }
    });
    this.time.delayedCall(1100, () => this.princeEnters());
  }

  private princeEnters() {
    const { chestX, groundY, princeFinalPose } = this.cfg;
    const prince = this.add
      .sprite(chestX + 700, groundY, 'him-walk_0')
      .setOrigin(0.5, 1)
      .setScale(SCALE)
      .setFlipX(true)
      .setDepth(8);
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
