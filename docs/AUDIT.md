# AUDIT TECHNIQUE & ARCHITECTURAL — DEUX LETTRES, UNE PROMESSE

**Date de l'audit** : 21 octobre 2026  
**Documents de référence consultés** :
- `docs/CONTEXTE_PROJET.md` (règle absolue : fait foi en cas de conflit)
- `docs/CAHIER_DES_CHARGES.md`
- Code source réel du dépôt (`package.json`, `src/`, `public/assets/`, `vite/`)

---

## 1. Ce qui est réutilisable (État des lieux du code existant)

L'audit approfondi du dépôt montre qu'une base technique solide et opérationnelle est déjà en place. Conformément à la règle d'architecture n°6 (*« Ne pas réécrire ce qui fonctionne. Étendre. »*), ces fondations doivent être conservées et enrichies.

### 1.1. Socle technique et build
- **`package.json`** :
  - Stack : **Phaser 4.0.0**, **React 19.0.0**, **TypeScript 5.7.2**, **Vite 6.3.1**.
  - Scripts opérationnels : `dev`, `build`, `dev-nolog`, `build-nolog`.
- **`vite/config.dev.mjs` & `vite/config.prod.mjs`** :
  - Configuration Vite avec plugin React officiel (`@vitejs/plugin-react`).
  - Minification Terser et découpage manuel de Phaser (`manualChunks: { phaser: ['phaser'] }`).
  - Base configurée en chemin relatif (`base: './'`), idéal pour tout hébergement statique.
- **`src/main.tsx`** :
  - Point d'entrée React 19 propre avec `ReactDOM.createRoot` et `React.StrictMode`.

### 1.2. Moteur Phaser & pont de communication
- **`src/lovegame/game.ts`** :
  - Moteur de jeu singleton instancié avec une résolution native de **1280x720**.
  - Gestion du redimensionnement via `Scale.FIT` et centrage automatique `Scale.CENTER_BOTH`.
  - Moteur physique `Arcade Physics` avec gravité globale de 1800.
- **`src/lovegame/bus.ts`** :
  - `EventEmitter` Phaser partagé assurant un découplage parfait entre Phaser et React.
  - Événements déjà en production : `hud`, `toast`, `chest-opened`, `letter-closed`, `ending-ready`, `restart`.
- **`src/lovegame/controls.ts`** :
  - État réactif et mutable des commandes (`left`, `right`, `jump`, `jumpPressed`, `actionPressed`), lu par la boucle `update` de Phaser à chaque frame.
- **`src/lovegame/assets.ts`** :
  - Helper `asset(path)` préfixé par `import.meta.env.BASE_URL` pour garantir des chemins d'accès sans faille en développement local comme en production.

### 1.3. Scènes de jeu existantes (`src/lovegame/scenes/`)
- **`PreloadScene.ts`** :
  - Écran de chargement avec jauge de progression textuelle `load.on('progress')`.
  - Chargement centralisé des sprites, décors, coffres, cœurs, plateformes et halo.
  - Génération globale des animations (`her-idle`, `her-walk`, `him-idle`, `him-wave`, `him-walk`, `him-read`).
- **`LevelScene.ts`** :
  - Moteur de niveau de plateforme 2D paramétrable via une interface `LevelConfig` :
    - Gestion fluide de la physique de l'héroïne (vitesse 270, saut 720, taille de hitbox 80x240, buffer de sol et coyote time de 110ms).
    - Animations dynamiques de saut et atterrissage (`her-jump_1` en montée, `her-jump_2` en descente, `her-jump_3` à la réception).
    - Caméra asservie au joueur avec amortissement (`startFollow(..., 0.1, 0.1)`) et transitions douces (`fadeIn`, `fadeOut`).
    - Décors infinis en miroir (`setFlipX` alterné) et 45 particules de lucioles dorées animées par des tweens sinusoïdaux.
    - Plateformes solides et plateformes unidirectionnelles franchissables par en dessous (`checkCollision.down = false`).
    - Collectables cœurs avec lévitation, tween d'absorption et condition de déverrouillage de coffre (`required`).
    - Coffre interactif animé (`chest_closed` -> `chest_open`), halo lumineux pulsé et fontaine de 12 cœurs jaillissants.
    - Apparition et marche du prince rejoignant le coffre avant le déclenchement de la lettre.
- **`EndingScene.ts`** :
  - Séquence cinématique de fin : marche automatique de l'héroïne vers le prince, face-à-face attendri, halo doré et flot continu de cœurs montant vers le ciel.

### 1.4. Interfaces React & Audio (`src/components/`, `src/App.tsx`, `src/lovegame/audio.ts`)
- **`src/App.tsx`** :
  - Machine d'états d'affichage (`title` -> `playing` -> `ending`).
  - HUD élégant en overlay (chapitre, compte des cœurs).
  - Gestion des alertes temporaires (`toast`).
  - Formateur typographique markdown personnalisé (`renderFormattedText`) gérant les titres `#`, le gras `**` et l'italique `*`.
  - Carte finale des retrouvailles avec défilement fluide et boutons d'action.
- **`src/components/LetterModal.tsx`** :
  - Fenêtre modale de lecture stylisée comme un papier à lettre féerique, avec sprite animé de l'héroïne lisant son courrier (`reader-a` / `reader-b`).
  - Onglets de bascule entre les lettres lors de la relecture.
  - Formateur inline pour le gras et l'italique.
- **`src/components/AudioPlayer.tsx`** :
  - Lecteur audio HTML5 avec boutons lecture/pause, réécoute au début, barre de progression dynamique.
  - Gestion automatique du fallback gracieux si le fichier audio est absent (`audio-missing` : *« L’enregistrement audio arrive bientôt… »*).
  - Déclenchement automatique de la baisse du volume de fond (`duckMusic`).
- **`src/components/TouchControls.tsx`** :
  - Commandes tactiles optimisées pour smartphone en paysage : touches larges, séparation gauche/droite, utilisation de `setPointerCapture` pour éviter les pertes d'appui lors des glissements.
- **`src/lovegame/audio.ts`** :
  - Gestionnaire audio pour la musique de fond avec boucle infinie, gestion de la sourdine et fonction `duckMusic(on)` (atténue la musique à 0.08 pendant la voix).

### 1.5. Contenu textuel et visuel déjà présent
- **`src/lovegame/content/letters.ts`** :
  - **Lettre 1** (*Ce que tu as éveillé en moi ❤️*) : texte complet, vérifié et authentique.
  - **Lettre 2** (*Le futur que je veux construire avec toi ❤️*) : texte complet, vérifié et authentique.
- **`src/lovegame/content/story.ts`** :
  - Noms des partenaires : *Dylan ATTOLOU & Hougni Soulyhatou*.
  - Message d'introduction complet avec bouton *« Entrer dans notre histoire »*.
  - Message de **Promesse finale** complet.
- **`public/assets/`** :
  - Personnages découpés : héroïne (13 sprites) et prince (10 sprites).
  - Décors 1280x720 : `title.jpg`, `garden.jpg`, `bridge.jpg`, `final.jpg`.
  - Objets : `chest_closed.png`, `chest_open.png`, `heart.png`, `rock.png`, `platform.png`, `glow.png`.

> **Note sur le code mort** :  
> Le dossier `src/game/` et le composant `src/PhaserGame.tsx` proviennent du gabarit Phaser d'origine. Ils ne sont ni importés ni utilisés par l'application réelle (`App.tsx` instancie directement `startGame` de `src/lovegame/game.ts`).

---

## 2. Ce qui manque par rapport au Cahier des Charges

Le cahier des charges décrit une véritable aventure de 30 à 40 minutes composée de 6 chapitres (du Chapitre 0 au Chapitre 5) et d'un épilogue, ponctuée de dialogues, de choix, d'énigmes et de progression non bloquante.

Voici l'inventaire précis des éléments manquants :

### 2.1. Chapitres et déroulement narratif
1. **Chapitre 0 — L'invitation mystérieuse** :
   - Manque : Séquence d'ouverture avec enveloppe lumineuse interactive.
   - Manque : Apparition et dialogue d'introduction de Cupidon le stagiaire.
   - Manque : Énigme mathématique du code du cœur (`cœur = 2, étoile = 3, lune = 1` -> total 6).
   - Manque : Carte stylisée montrant les lieux du voyage.
2. **Chapitre 1 — Retrouver le garçon de l'université** :
   - Manque : Décor et scène de l'université (salles de cours, couloirs).
   - Manque : Les 3 PNJ interactifs (étudiante curieuse, étudiant distrait, gardien) avec leurs dialogues et questions.
   - Manque : Les 3 salles thématiques (Salle A - flashback d'hésitation, Salle B - puzzle des 3 symboles à ordonner, Salle C - salle du courage avec porte animée).
   - Manque : Séquence interactive de la première rencontre avec dialogue à choix multiples et obtention du premier fragment de souvenir.
3. **Chapitre 2 — Le laboratoire des sentiments** :
   - Manque : Mini-jeu / puzzle d'ordonnancement chronologique des 5 cartes de la relation.
   - Manque : Enquête sur la rumeur auprès des 3 étudiants menant au mot-clé « sentiments ».
   - Manque : Interface interactive de smartphone simulant la question décisive : *« Est-ce que tu es amoureux de moi ? »* et déclenchant le flashback de l'aveu.
   - *(Note : L'ouverture de la Lettre 1 à l'issue de ce chapitre utilisera directement `LetterModal` existant).*
4. **Chapitre 3 — La chasse aux fragments de phrase** :
   - Manque : Système de collecte des 6 fragments de la phrase cible (**« TU ES MON PLUS BEAU HASARD »**).
   - Manque : Épreuve des 3 lanternes mnémotechniques (jeu de mémoire de séquence lumineuse).
   - Manque : Épreuve de la devinette du coffre capricieux (*« Qui suis-je ? -> L'amour »*).
   - Manque : Interface tactile d'assemblage des 6 mots pour former la phrase et déclencher l'illumination céleste.
5. **Chapitre 4 — Le pont des étoiles** :
   - Manque : Énigme des 3 étoiles de la confiance (3 questions relationnelles à choix multiples).
   - Manque : Récolte et pose des 3 fragments de l'avenir (courage, travail, soutien) sur un socle central.
   - Manque : Animation de la maison lumineuse qui s'édifie progressivement pendant la lecture de la Lettre 2.
6. **Chapitre 5 — Retrouver son amoureux** :
   - Manque : Séquence d'ouverture des 3 portes successives (alimentées par les 3 trophées des chapitres précédents : souvenir de l'université, phrase reconstituée, fragments d'avenir).
   - Manque : Cheminement vers la clairière et dialogues vocaux réplique par réplique entre les deux personnages.
7. **Épilogue étendu** :
   - Manque : Choix final interactif (*« Oui, continuons notre histoire ❤️ »* vs *« Attends… j'ai encore envie de te faire travailler ! 😂 »* avec réaction dépitée et humoristique de Cupidon).
   - Manque : Journal de bord / Galerie finale permettant de revisiter les souvenirs, relire les lettres et rejouer les énigmes sans effacer la sauvegarde.

### 2.2. Entités, PNJ et Personnages
- **Cupidon le stagiaire** : Aucun sprite, portrait ni animation n'existent actuellement.
- **PNJ de l'université** : Étudiante curieuse, étudiant distrait, gardien, étudiants de la rumeur, chat de la bibliothèque.
- **Placeholders visuels requis** : En attendant la création des illustrations définitives, des placeholders géométriques ou typés doivent être listés dans `docs/ASSETS_A_FAIRE.md`.

### 2.3. Systèmes et Modules logiciels manquants
- **Store de progression centralisé (`ProgressionStore.ts`)** :
  - Nécessité d'un état unique stockant le chapitre courant, les quêtes achevées, les énigmes résolues, les fragments collectés et les souvenirs débloqués.
- **Persistance locale (`localStorage`)** :
  - Actuellement, tout rafraîchissement réinitialise le jeu au début. Un système de sauvegarde transparent et sécurisé est nécessaire.
- **Système de dialogue universel (`DialogueBox.tsx`)** :
  - Composant React gérant l'affichage des répliques, le portrait du locuteur (Cupidon, Dylan, PNJ), les choix de réponses et les signaux de progression.
- **Composants d'énigmes réutilisables en React** :
  - Composant de tri/ordonnancement de cartes.
  - Composant de QCM / dialogue d'enquête.
  - Composant de mémorisation de séquence (lanternes).
  - Composant d'assemblage de mots au toucher.
- **Audios réels** :
  - Fichiers vocaux pour les répliques du Chapitre 5.
  - Musique `theme.mp3` et enregistrements `lettre-1.mp3`, `lettre-2.mp3` dans `public/assets/audio/`.

---

## 3. Analyse des Risques Techniques

### 3.1. Phaser 4.0.0
- **Constat** : Le projet tourne sous la version majeure `4.0.0`. Cette version fait évoluer certaines API internes par rapport à Phaser 3 et dispose de moins de ressources ou tutoriels communautaires en ligne.
- **Risque** : Tenter d'utiliser des bibliothèques externes tierces conçues pour Phaser 3 (ex. plugins de dialogue Phaser Canvas ou de texte riche) qui provoqueraient des régressions ou des incompatibilités de compilation.
- **Mesure d'atténuation (Conforme au Contexte Projet)** :  
  Appliquer strictement la règle d'architecture n°1 : **Phaser est réservé au monde physique 2D (mouvements, collisions, caméras, sprites, particules)**. Toutes les interactions riches (dialogues, énigmes, téléphones, modales, inventaires) sont déléguées à **React 19 en HTML/CSS**. Phaser n'a ainsi qu'à gérer des mécaniques d'arcade simples et stables.

### 3.2. Contraintes Mobile & Ergonomie tactile
- **Viewport et Barres d'adresse dynamiques** :
  - Sur iOS Safari et Chrome Android, l'affichage des barres d'adresse modifie la hauteur visible et peut masquer des boutons bas ou tronquer le canvas.
  - *Atténuation* : Utiliser `100dvh` / `inset: 0` avec gestion des `env(safe-area-inset-*)`, déjà initiée dans `styles.css`.
- **Sensibilité tactile sans précision excessive** :
  - Sur mobile en paysage, les interactions de glisser-déposer (drag-and-drop) sont souvent imprécises et sources de frustration.
  - *Atténuation* : Toutes les énigmes (assemblage de phrases, tri de cartes, lanternes) doivent fonctionner par **tapotements successifs** (toucher une carte puis une autre, ou toucher un mot pour l'ajouter à la phrase), avec des zones de contact d'au moins 48x48px.
- **Politique de lecture automatique Audio (Autoplay Policy)** :
  - Les navigateurs mobiles bloquent tout flux audio qui n'est pas déclenché par une action utilisateur directe.
  - *Atténuation* : La musique démarre lors du clic d'entrée (« Entrer dans notre histoire »). Les dialogues vocaux et les lettres disposent d'un déclencheur tactile explicite (bouton « Écouter » d'`AudioPlayer`).

### 3.3. Performances, Gestion Mémoire et Nettoyage
- **Cycle de vie Phaser <-> React** :
  - Le passage à 6 chapitres et plusieurs scènes pourrait engendrer des fuites de mémoire si les écouteurs sur `bus.ts` ou les instances de scènes ne sont pas nettoyés (`shutdown`, `destroy`).
  - *Atténuation* : Chaque composant React doit faire un `bus.off()` dans le cleanup de son `useEffect`. Chaque scène Phaser doit détruire ses tweens et détacher ses écouteurs dans son événement `events.once('shutdown')`.
- **Ressources graphiques** :
  - Le chargement de nombreux décors en haute résolution peut saturer la mémoire graphique des téléphones modestes.
  - *Atténuation* : Découpage des chargements d'assets par groupe de scènes ou chargement dynamique prédictif, tout en compressant les images (WebP ou JPEG optimisés).

---

## 4. Mapping des Niveaux Existants sur le Cahier des Charges

Le dépôt dispose déjà de deux niveaux de plateforme fonctionnels dans `src/lovegame/levels.ts` et `LevelScene.ts`. Voici comment ils s'articulent avec le cahier des charges :

```
[NIVEAUX ACTUELS]                     [CHAPITRES DU CAHIER DES CHARGES]
-------------------------------------------------------------------------
(À créer)                          -> Chapitre 0 : L'invitation mystérieuse
(À créer)                          -> Chapitre 1 : Retrouver le garçon de l'université
(À créer)                          -> Chapitre 2 : Le laboratoire des sentiments
                                       └─ Débouche sur : LETTRE 1 (déjà intégrée)
Niveau 1 : « garden » (Jardin)     -> Chapitre 3 : La chasse aux fragments de phrase
                                       ├─ Décor garden.jpg conservé
                                       ├─ Plateformes & obstacles réutilisés
                                       └─ Collecte des 6 mots au lieu des cœurs génériques
Niveau 2 : « bridge » (Pont)       -> Chapitre 4 : Le pont des étoiles
                                       ├─ Décor bridge.jpg conservé
                                       ├─ Épreuves de la confiance & fragments de l'avenir
                                       └─ Débouche sur : LETTRE 2 (déjà intégrée)
(À créer)                          -> Chapitre 5 : Retrouver son amoureux (3 portes)
Scène finale : « EndingScene »     -> ÉPILOGUE : La Promesse finale
                                       ├─ Décor final.jpg conservé
                                       ├─ Scène des retrouvailles & pluie de cœurs
                                       ├─ Carte de la PROMESSE (déjà intégrée)
                                       └─ Ajout : Choix interactif final & Galerie
```

1. **Niveau « Jardin » (`garden`) = Socle du Chapitre 3** :
   - La géométrie du monde (`worldW: 4000`, `groundY: 560`), le décor `garden.jpg`, les rochers et les plateformes à sens unique sont conservés.
   - La collecte est spécialisée : au lieu de cœurs anonymes, 6 fragments lumineux de la phrase (« TU », « ES », « MON », « PLUS », « BEAU », « HASARD ») sont disséminés, assortis de l'épreuve des lanternes et du coffre capricieux.
2. **Niveau « Pont » (`bridge`) = Socle du Chapitre 4** :
   - Le décor céleste `bridge.jpg`, la verticalité des sauts et le positionnement du coffre sont conservés.
   - Les points d'interaction sont connectés aux 3 étoiles de la confiance (QCM) et aux 3 socles de l'avenir, débouchant sur la seconde lettre.
3. **Scène « Ending » = Socle de l'Épilogue** :
   - L'animation de réunion des deux héros, le halo et les cœurs flottants sont conservés tels quels.
   - L'overlay accueille le choix final interactif (avec réplique humoristique de Cupidon) et l'accès à la galerie des souvenirs.

---

## 5. Plan en Phases d'Implémentation

Conformément à la méthode prescrite (Étape B), voici le plan d'action découpé en phases autonomes et vérifiables :

### Phase 1 — Socle d'Architecture, Store de Progression & Sauvegarde Locale
- **Objectif** : Mettre en place la colonne vertébrale des états et de la sauvegarde sans toucher au gameplay existant.
- **Fichiers existants concernés** :
  - `src/lovegame/bus.ts` (enrichissement du catalogue d'événements typés).
  - `src/App.tsx` (connexion au store de progression).
- **Nouveaux fichiers** :
  - `src/lovegame/state/ProgressionStore.ts` (gestion de l'état, déblocage des chapitres, stockage des trophées).
  - `src/lovegame/state/types.ts` (types TypeScript : chapitres, missions, énigmes, inventaire).
  - `src/lovegame/state/storage.ts` (sérialisation `localStorage` avec versionnage et fonction reset).
- **Fonctionnalités réutilisées** : `bus.ts`, système de toast de `App.tsx`.
- **Risques de régression** : Réinitialisation intempestive de session ou désynchronisation React/Phaser.
- **Critères de fin** :
  - L'état de progression est lisible et modifiable depuis React et Phaser via `bus.ts`.
  - Recharger la page restaure fidèlement la progression.
  - `npm run build` s'exécute avec 0 erreur TypeScript.

### Phase 2 — Système Universel de Dialogue React & Intégration de Cupidon
- **Objectif** : Créer l'interface de narration interactive pour Cupidon, le joueur et les PNJ.
- **Fichiers existants concernés** :
  - `src/App.tsx` (montage de l'overlay de dialogue).
  - `src/lovegame/styles.css` (mise en forme de la boîte de dialogue, animations de bulle).
- **Nouveaux fichiers** :
  - `src/components/DialogueBox.tsx` (composant React : avatar, nom, texte défilant, options de réponse, boutons larges).
  - `src/lovegame/content/dialogues.ts` (banque de dialogues externe : répliques de Cupidon, indices, PNJ).
- **Fonctionnalités réutilisées** : Typographie et variables CSS de `styles.css`.
- **Risques de régression** : Interférence des clics de dialogue avec le canvas Phaser sous-jacent.
- **Critères de fin** :
  - Un dialogue s'affiche, avance au toucher, gère des choix multiples et émet un événement de fin.
  - Désactivation automatique des commandes de marche du jeu pendant un dialogue.
  - `npm run build` OK.

### Phase 3 — Chapitre 0 : L'Invitation Mystérieuse
- **Objectif** : Concevoir la séquence d'introduction interactive avant le premier niveau de plateforme.
- **Fichiers existants concernés** :
  - `src/App.tsx` (branchement du Chapitre 0 entre le titre et le jeu).
  - `src/lovegame/content/story.ts`.
- **Nouveaux fichiers** :
  - `src/components/chapters/Chapter0Invitation.tsx` (enveloppe scellée, dialogue d'ouverture de Cupidon, énigme `2+3+1=6`).
  - `src/components/puzzles/HeartCodePuzzle.tsx` (mini-jeu de calcul tactile avec retours humoristiques en cas d'erreur).
- **Fonctionnalités réutilisées** : `AudioPlayer`, `styles.css`, `DialogueBox.tsx`.
- **Risques de régression** : Empêcher le démarrage du jeu pour les joueuses sur mobile.
- **Critères de fin** :
  - L'enveloppe s'ouvre au toucher.
  - Cupidon fait sa première intervention humoristique.
  - L'énigme du code du cœur autorise des essais infinis sans blocage et débloque l'accès à l'université.
  - `npm run build` OK.

### Phase 4 — Chapitres 1 & 2 : L'Université & Le Laboratoire des Sentiments
- **Objectif** : Implémenter la recherche du garçon à l'université, les flashbacks et la découverte de la Première Lettre.
- **Fichiers existants concernés** :
  - `src/lovegame/scenes/PreloadScene.ts` (chargement des décors et props de l'université).
  - `src/lovegame/content/letters.ts` (préservation stricte du contenu de la Lettre 1).
  - `src/components/LetterModal.tsx` (réutilisation pour la fin du Chapitre 2).
- **Nouveaux fichiers** :
  - `src/components/chapters/Chapter1University.tsx` ou scène Phaser dédiée `UniversityScene.ts` (exploration des 3 salles et interrogation des 3 PNJ).
  - `src/components/puzzles/ChronologyPuzzle.tsx` (remise dans l'ordre des 5 cartes de la relation).
  - `src/components/puzzles/PhoneInteractive.tsx` (téléphone interactif simulant la question décisive).
  - `docs/ASSETS_A_FAIRE.md` (inventaire des placeholders temporaires pour l'université et les PNJ).
- **Fonctionnalités réutilisées** : `LevelScene.ts` (moteur physique de marche et portes), `LetterModal.tsx`, `AudioPlayer.tsx`.
- **Risques de régression** : Conflit de coordonnées de collisions ou d'échelle de personnage dans les salles intérieures.
- **Critères de fin** :
  - Les 3 PNJ peuvent être interrogés.
  - Les flashbacks se déclenchent.
  - L'énigme du téléphone débouche sur la séquence d'ouverture du coffre et la lecture complète de la Lettre 1.
  - `npm run build` OK.

### Phase 5 — Chapitres 3 & 4 : Extension du Jardin (Fragments) & du Pont (Avenir)
- **Objectif** : Transformer les deux niveaux actuels en épreuves narratives complètes.
- **Fichiers existants concernés** :
  - `src/lovegame/levels.ts` (mise à jour des configs de niveau pour intégrer les fragments et socles).
  - `src/lovegame/scenes/LevelScene.ts` (détection des fragments de mots, déclenchement des puzzles).
  - `src/components/LetterModal.tsx` (déclenchement de la Lettre 2 à la fin du Chapitre 4).
- **Nouveaux fichiers** :
  - `src/components/puzzles/LanternPuzzle.tsx` (jeu des 3 lanternes mnémotechniques).
  - `src/components/puzzles/PhraseAssemblyPuzzle.tsx` (assemblage tactile des 6 fragments de « TU ES MON PLUS BEAU HASARD »).
  - `src/components/puzzles/ConfidenceQuiz.tsx` (QCM des 3 étoiles de la confiance).
- **Fonctionnalités réutilisées** : Décor `garden.jpg`, `bridge.jpg`, physique de saut, coffre animé, lecteur audio de la Lettre 2.
- **Risques de régression** : Cassure de la boucle de plateforme existante lors de la collecte des objets.
- **Critères de fin** :
  - Les 6 mots sont collectés et assemblés avec retour visuel céleste.
  - Les 3 étoiles de la confiance et fragments de l'avenir ouvrent le coffre de la Lettre 2.
  - `npm run build` OK.

### Phase 6 — Chapitre 5 & Épilogue : Retrouvailles, Choix Final & Promesse
- **Objectif** : Conclure l'aventure avec émotion, humour et pérennité.
- **Fichiers existants concernés** :
  - `src/lovegame/scenes/EndingScene.ts` (adaptation pour accueillir les dialogues des retrouvailles).
  - `src/App.tsx` (enrichissement de l'overlay de fin).
  - `src/lovegame/content/story.ts` (conservation stricte de la Promesse).
- **Nouveaux fichiers** :
  - `src/components/chapters/Chapter5Reunion.tsx` (déverrouillage des 3 portes successives et dialogue parlé).
  - `src/components/MemoryGallery.tsx` (galerie de souvenirs / relecture libre des lettres et énigmes).
- **Fonctionnalités réutilisées** : Carte de promesse finale, halo, pluie de cœurs de `EndingScene.ts`.
- **Risques de régression** : Superposition audio entre la musique et les dialogues parlés des retrouvailles.
- **Critères de fin** :
  - Les 3 portes s'ouvrent grâce aux accomplissements précédents.
  - Les dialogues finaux s'affichent réplique par réplique.
  - La promesse finale s'affiche dans son écrin doré.
  - Le choix final interactif (y compris la réponse humoristique avec Cupidon) fonctionne sans jamais punir la joueuse.
  - La galerie permet de tout revoir à volonté.
  - `npm run build` OK.

### Phase 7 — Audit Mobile, Optimisations & Recette Globale
- **Objectif** : Garantir une expérience sans accroc sur smartphone en conditions réelles.
- **Fichiers existants concernés** : Tous les composants UI et scènes.
- **Nouveaux fichiers** :
  - `docs/ASSETS_A_FAIRE.md` finalisé avec dimensions et spécifications pour la génération graphique externe.
- **Actions** :
  - Test de charge et nettoyage mémoire sur les transitions de scènes.
  - Vérification de la compatibilité tactile sur formats d'écran 16:9, 19.5:9 et 20:9 en paysage.
  - Vérification du comportement audio en cas de coupure ou mise en veille.
- **Critères de fin** :
  - Parcours complet d'une traite fluide du titre à l'épilogue.
  - Aucune erreur console ni fuite de mémoire.
  - `npm run build` réussi avec un bundle optimisé.

---

## 6. Synthèse et Prochaine Étape

L'audit confirme que **la version 1 existante est une excellente fondation** : la physique, la caméra, les contrôles tactiles, les lettres réelles et la promesse sont déjà en place. L'extension vers le cahier des charges complet se fera naturellement en superposant les mécaniques d'énigmes et de dialogues en React au-dessus du moteur physique de Phaser, tout en préservant l'intégrité absolue des textes personnels déjà intégrés.

**Prochaine action attendue** :  
Attendre la validation par l'utilisateur de cet audit et du découpage en phases avant d'entamer l'implémentation de la **Phase 1** (Store de progression, architecture d'états et sauvegarde).
