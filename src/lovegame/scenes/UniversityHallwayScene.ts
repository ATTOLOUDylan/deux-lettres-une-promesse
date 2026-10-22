import { Scene, Input, GameObjects, Physics } from 'phaser';
import { bus } from '../bus';
import { controls } from '../controls';
import { asset } from '../assets';
import { HALLWAY_CONFIG } from '../content/university';
import { progressionStore } from '../state/ProgressionStore';

// Échelles d'affichage.
// L'héroïne (HEROINE_SCALE) est la référence du jeu : ses sprites font 308 px de
// haut, soit ≈ 222 px à l'écran (idem dans LevelScene). Toutes les autres échelles
// sont déduites de cette référence à partir des boîtes englobantes réellement
// mesurées dans les PNG, afin que les proportions de la scène restent crédibles :
//   - étudiants   : portraits 1536 px  -> ≈ 1,0× l'héroïne
//   - gardien     : portrait adulte    -> ≈ 1,1× l'héroïne
//   - portes      : 1536 px            -> ≈ 2 m, soit ≈ 1,35× l'héroïne
//   - banc/plante : props larges       -> mobilier à l'échelle du couloir
const HEROINE_SCALE = 0.72;
const NPC_SCALE = 0.15; // étudiants
const GUARD_SCALE = 0.16; // gardien (adulte, un peu plus grand)
const DOOR_SCALE = 0.2; // portes des salles
const PROP_SCALE = 0.17; // tableau d'affichage et plante
const BENCH_SCALE = 0.15; // banc (large et bas)
const SPEED = 280;
const JUMP = 650;

// Largeur native du décor panoramique : il est affiché à l'échelle 1:1 (net)
// puis répété en miroir afin de prolonger le couloir sans couture visible.
const BG_NATIVE_W = 1983;

// Icônes vectorielles des invites d'interaction (aucun emoji autocollant)
type PromptIcon = 'talk' | 'door' | 'lock' | 'heart' | 'note' | 'cat';

interface InteractiveSpot {
  id: string;
  type: 'npc' | 'door' | 'cat' | 'heart' | 'memory';
  x: number;
  label: string;
  icon: PromptIcon;
  container: GameObjects.Container;
  prompt: GameObjects.Container;
  promptShown?: boolean;
  plaqueText?: GameObjects.Text;
  triggerDistance?: number;
}

export class UniversityHallwayScene extends Scene {
  private player!: GameObjects.Sprite;
  private playerShadow?: GameObjects.Ellipse;
  private spots: InteractiveSpot[] = [];
  private doorCSprite?: GameObjects.Image;
  private doorCLight?: GameObjects.Image;
  private startX = HALLWAY_CONFIG.startX;
  private isPausedForModal = false;

  constructor() {
    super('UniversityHallway');
  }

  init(data?: { startX?: number }) {
    if (data && typeof data.startX === 'number') {
      this.startX = data.startX;
    }
  }

  preload() {
    // 1. Décor panoramique du couloir
    this.load.image('bg-hallway-long', asset('backgrounds/university_hallway_long.png'));

    // 2. Portes des salles
    this.load.image('door-a', asset('objects/door_room_a.png'));
    this.load.image('door-b', asset('objects/door_room_b.png'));
    this.load.image('door-c-closed', asset('objects/door_room_c_closed.png'));
    this.load.image('door-c-open', asset('objects/door_room_c_open.png'));

    // 3. Éléments de décor (props)
    this.load.image('prop-bench', asset('objects/prop_bench.png'));
    this.load.image('prop-noticeboard', asset('objects/prop_noticeboard.png'));
    this.load.image('prop-plant', asset('objects/prop_plant.png'));

    // 4. Personnages PNJ en pied
    this.load.image('npc-student-girl', asset('characters/npcs/student_girl_full.png'));
    this.load.image('npc-student-boy', asset('characters/npcs/student_boy_full.png'));
    this.load.image('npc-campus-guard', asset('characters/npcs/campus_guard_full.png'));

    // 5. Sprites de l'héroïne
    const herFrames = ['idle_0', 'idle_1', 'walk_0', 'walk_1', 'walk_2', 'walk_3'];
    herFrames.forEach((frame) => {
      if (!this.textures.exists(`her-${frame}`)) {
        this.load.image(`her-${frame}`, asset(`characters/heroine/${frame}.png`));
      }
    });

    // 6. Objets à collectionner et effets
    if (!this.textures.exists('heart')) {
      this.load.image('heart', asset('objects/heart.png'));
    }
    if (!this.textures.exists('glow')) {
      this.load.image('glow', asset('effects/glow.png'));
    }
  }

  create() {
    const W = HALLWAY_CONFIG.worldWidth;
    const H = HALLWAY_CONFIG.worldHeight;
    const groundY = HALLWAY_CONFIG.groundY;

    // Définition des limites du monde
    this.cameras.main.setBounds(0, 0, W, H);

    // 1. Décor unique du couloir
    for (let i = 0; i * BG_NATIVE_W < W; i++) {
      const tile = this.add.image(i * BG_NATIVE_W, 0, 'bg-hallway-long')
        .setOrigin(0, 0)
        .setDepth(0);
      if (i % 2 === 1) tile.setFlipX(true);
    }

    // Voile d'ambiance
    const lightOverlay = this.add.rectangle(0, 0, W, H, 0x141033, 0.12).setOrigin(0, 0).setDepth(1);
    this.tweens.add({
      targets: lightOverlay,
      alpha: 0.2,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 2. Création des animations de l'héroïne
    if (!this.anims.exists('her-idle')) {
      this.anims.create({
        key: 'her-idle',
        frames: [{ key: 'her-idle_0' }, { key: 'her-idle_1' }],
        frameRate: 2,
        repeat: -1,
      });
    }
    if (!this.anims.exists('her-walk')) {
      this.anims.create({
        key: 'her-walk',
        frames: [{ key: 'her-walk_0' }, { key: 'her-walk_1' }, { key: 'her-walk_2' }, { key: 'her-walk_3' }],
        frameRate: 8,
        repeat: -1,
      });
    }

    this.spots = [];

    // 3. Mise en place des éléments du décor et PNJ
    this.setupNoticeboardAndStudent(groundY);
    this.setupDoorA(groundY);
    this.setupBenchAndDistractedStudent(groundY);
    this.setupPlantAndLibraryCat(groundY);
    this.setupDoorB(groundY);
    this.setupGuard(groundY);
    this.setupDoorC(groundY);

    // 4. Création de l'héroïne
    this.playerShadow = this.add
      .ellipse(this.startX, groundY + 4, 108, 24, 0x000000, 0.3)
      .setDepth(14);

    this.player = this.add
      .sprite(this.startX, groundY, 'her-idle_0')
      .setOrigin(0.5, 1)
      .setScale(HEROINE_SCALE)
      .setDepth(15);

    this.player.anims.play('her-idle');

    // Caméra qui suit l'héroïne avec amorti fluide
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.fadeIn(500);

    this.setupEventBus();
  }

  // Méthode pour focaliser sur un point précis (utilisée par React)
  public async focusOn(targetX: number, duration: number = 1500) {
    if (!this.player) {
      console.warn('[UniversityHallwayScene] focusOn appelé avant que le joueur ne soit prêt.');
      return Promise.resolve();
    }

    // Déterminer la direction
    const startX = this.player.x;
    const dir = targetX > startX ? 1 : -1;
    
    // Arrêter toute animation en cours et tweens précédents sur le joueur
    this.tweens.killTweensOf([this.player, this.playerShadow]);
    
    this.player.setFlipX(dir < 0);
    this.player.anims.play('her-walk', true);

    // Arrêter le suivi automatique pendant le déplacement contrôlé
    this.cameras.main.stopFollow();

    return new Promise<void>((resolve) => {
      this.tweens.add({
        targets: [this.player, this.playerShadow],
        x: targetX,
        duration: duration,
        ease: 'Sine.easeInOut',
        onUpdate: () => {
          if (!this.player || !this.cameras.main) return;
          // La caméra suit manuellement pour un mouvement plus cinématique
          const camX = this.player.x - this.cameras.main.width / 2;
          this.cameras.main.scrollX = Phaser.Math.Clamp(camX, 0, HALLWAY_CONFIG.worldWidth - this.cameras.main.width);
        },
        onComplete: () => {
          if (this.player) {
            this.player.anims.play('her-idle', true);
            // Rétablir le suivi
            this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
          }
          resolve();
        }
      });
    });
  }

  // --- MISE EN PLACE DES ZONES INTERACTIVES (Version simplifiée sans Prompts) ---
  // ... (Je garde les méthodes setupXXX mais je retire les prompts flottants)
  private setupNoticeboardAndStudent(groundY: number) {
    const xBoard = HALLWAY_CONFIG.noticeboardX;
    const xGirl = HALLWAY_CONFIG.studentGirlX;

    this.add.image(xBoard, groundY - 118, 'prop-noticeboard').setOrigin(0.5, 0.5).setScale(PROP_SCALE).setDepth(4);

    const hasHeart1 = progressionStore.isHeartFound('coeur-cache-univ-1');
    if (!hasHeart1) {
      const heart1Container = this.add.container(xBoard + 60, groundY - 118).setDepth(6);
      heart1Container.add([this.add.image(0, 0, 'glow').setScale(0.16).setAlpha(0.45), this.add.image(0, 0, 'heart').setScale(0.35)]);
      this.tweens.add({ targets: heart1Container, y: groundY - 128, duration: 1200, yoyo: true, repeat: -1 });
    }

    const girlContainer = this.add.container(xGirl, groundY).setDepth(7);
    girlContainer.add([this.add.ellipse(0, 4, 96, 22, 0x000000, 0.32), this.add.image(0, 0, 'npc-student-girl').setOrigin(0.5, 1).setScale(NPC_SCALE)]);
  }

  private setupDoorA(groundY: number) {
    const xDoor = HALLWAY_CONFIG.doorAX;
    const doorContainer = this.add.container(xDoor, groundY).setDepth(5);
    doorContainer.add([this.add.image(0, 0, 'door-a').setOrigin(0.5, 1).setScale(DOOR_SCALE), 
      this.add.text(0, -300, 'SALLE A', { fontFamily: 'Cinzel, Georgia, serif', fontSize: '16px', color: '#ffd97a', backgroundColor: '#0b1030cc', padding: { x: 9, y: 3 } }).setOrigin(0.5, 0.5)]);
  }

  private setupBenchAndDistractedStudent(groundY: number) {
    const xBench = HALLWAY_CONFIG.benchX;
    const xBoy = HALLWAY_CONFIG.studentBoyX;
    const xNote = HALLWAY_CONFIG.memoryNoteX;
    this.add.image(xBench, groundY, 'prop-bench').setOrigin(0.5, 1).setScale(BENCH_SCALE).setDepth(6);

    const hasNote = progressionStore.getState().optionalMemories.includes('souvenir-note-encourageante');
    if (!hasNote) {
      const noteContainer = this.add.container(xNote, groundY - 18).setDepth(7);
      const notePaper = this.add.graphics().fillStyle(0xfff4d6, 0.95).fillRect(-10, -26, 20, 26).lineStyle(1.2, 0xc9a24a, 0.9).strokeRect(-10, -26, 20, 26);
      noteContainer.add([this.add.image(0, -10, 'glow').setScale(0.14).setAlpha(0.4), notePaper]);
      this.tweens.add({ targets: noteContainer, y: groundY - 24, duration: 1100, yoyo: true, repeat: -1 });
    }

    const boyContainer = this.add.container(xBoy, groundY).setDepth(8);
    boyContainer.add([this.add.ellipse(0, 4, 96, 22, 0x000000, 0.32), this.add.image(0, 0, 'npc-student-boy').setOrigin(0.5, 1).setScale(NPC_SCALE)]);
  }

  private setupPlantAndLibraryCat(groundY: number) {
    const xCat = HALLWAY_CONFIG.catX;
    this.add.image(xCat + 40, groundY, 'prop-plant').setOrigin(0.5, 1).setScale(PROP_SCALE).setDepth(6);
    const catContainer = this.add.container(xCat - 30, groundY).setDepth(7);
    const catFigure = this.add.graphics().lineStyle(2, 0xffd97a, 0.85).strokeEllipse(0, -18, 32, 32).strokeCircle(0, -40, 12);
    catContainer.add([this.add.ellipse(0, 3, 64, 16, 0x000000, 0.32), catFigure]);
    this.tweens.add({ targets: catContainer, y: groundY - 3, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private setupDoorB(groundY: number) {
    const xDoor = HALLWAY_CONFIG.doorBX;
    const doorContainer = this.add.container(xDoor, groundY).setDepth(5);
    doorContainer.add([this.add.image(0, 0, 'door-b').setOrigin(0.5, 1).setScale(DOOR_SCALE),
      this.add.text(0, -300, 'SALLE B', { fontFamily: 'Cinzel, Georgia, serif', fontSize: '16px', color: '#ffd97a', backgroundColor: '#0b1030cc', padding: { x: 9, y: 3 } }).setOrigin(0.5, 0.5)]);
  }

  private setupGuard(groundY: number) {
    const xGuard = HALLWAY_CONFIG.guardX;
    const xHeart2 = HALLWAY_CONFIG.heart2X;
    const hasHeart2 = progressionStore.isHeartFound('coeur-cache-univ-2');
    if (!hasHeart2) {
      const heart2Container = this.add.container(xHeart2, groundY - 140).setDepth(6);
      heart2Container.add([this.add.image(0, 0, 'glow').setScale(0.16).setAlpha(0.45), this.add.image(0, 0, 'heart').setScale(0.35)]);
      this.tweens.add({ targets: heart2Container, y: groundY - 150, duration: 1200, yoyo: true, repeat: -1 });
    }
    const guardContainer = this.add.container(xGuard, groundY).setDepth(8);
    guardContainer.add([this.add.ellipse(0, 4, 108, 24, 0x000000, 0.32), this.add.image(0, 0, 'npc-campus-guard').setOrigin(0.5, 1).setScale(GUARD_SCALE)]);
  }

  private setupDoorC(groundY: number) {
    const xDoor = HALLWAY_CONFIG.doorCX;
    const hasCle = !!progressionStore.getState().missions['cle_gardien_obtenue'];
    const doorContainer = this.add.container(xDoor, groundY).setDepth(5);
    this.doorCSprite = this.add.image(0, 0, hasCle ? 'door-c-open' : 'door-c-closed').setOrigin(0.5, 1).setScale(DOOR_SCALE);
    this.doorCLight = this.add.image(0, -200, 'glow').setScale(0.32).setAlpha(hasCle ? 0.5 : 0).setTint(0xffd97a);
    doorContainer.add([this.doorCLight, this.doorCSprite, this.add.text(0, -300, 'SALLE C', { fontFamily: 'Cinzel, Georgia, serif', fontSize: '16px', color: hasCle ? '#ffd97a' : '#ff8ea3', backgroundColor: '#0b1030cc', padding: { x: 9, y: 3 } }).setOrigin(0.5, 0.5)]);
  }

  update() {
    // Plus besoin d'update complexe car plus de physique libre
  }

  private setupEventBus() {
    const onKeyObtained = () => {
      if (this.doorCSprite) this.doorCSprite.setTexture('door-c-open');
      if (this.doorCLight) this.doorCLight.setAlpha(0.5);
    };
    bus.on('university-key-obtained', onKeyObtained);
    this.events.once('shutdown', () => bus.off('university-key-obtained', onKeyObtained));
  }

  getPlayerX(): number { return this.player ? this.player.x : this.startX; }
  setPlayerX(x: number) {
    if (this.player) {
      this.player.setX(x);
      this.cameras.main.scrollX = x - 640;
    }
  }
}
