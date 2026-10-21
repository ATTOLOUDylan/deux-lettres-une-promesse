# CONTEXTE RÉEL DU PROJET (prioritaire sur le cahier des charges)

Stack réelle : React 19 + TypeScript + Vite + Phaser 4.0.0. PAS de Vue.
Lancer : `npm run dev`. Build : `npm run build`.

## Code existant (version 1 déjà jouable)
- src/App.tsx : machine d'états title → playing → ending, HUD, toasts, modale de lettre.
- src/lovegame/game.ts : config Phaser (1280x720, Scale.FIT, arcade physics).
- src/lovegame/scenes/ : PreloadScene (charge tout + crée les animations), LevelScene (un niveau
  paramétré par levels.ts : déplacement, saut, plateformes à sens unique, cœurs, coffre, prince),
  EndingScene.
- src/lovegame/levels.ts : configuration des 2 niveaux (jardin, pont).
- src/lovegame/bus.ts : EventEmitter React <-> Phaser. src/lovegame/controls.ts : commandes tactiles.
- src/lovegame/audio.ts : musique + baisse du volume pendant les lettres.
- src/lovegame/content/ : story.ts (textes) et letters.ts (lettres + chemins audio).
- src/components/ : LetterModal, AudioPlayer, TouchControls.
- public/assets/ : sprites de l'héroïne (her-*) et du prince (him-*), décors, coffre, cœur, rocher, plateforme.
- Le dossier src/game/ vient du template d'origine et n'est plus utilisé.

## Règles d'architecture
1. Phaser = monde de jeu (déplacement, collisions, PNJ, objets). React = interfaces HTML
   (dialogues, énigmes, lettres, menus), car plus simples et plus fiables sur mobile.
2. Communication uniquement via bus.ts. Événements documentés dans bus.ts.
3. Tous les textes dans src/lovegame/content/. Aucun texte en dur dans les scènes ou composants.
4. Un seul état de progression, dans un store dédié. Jamais d'état dupliqué entre React et Phaser.
5. Ressources dans public/assets, chargées via asset() de assets.ts.
6. Ne pas réécrire ce qui fonctionne. Étendre.

## Règles de travail
- Inspecter le code avant de modifier. Ne jamais supposer qu'un fichier existe.
- Expliquer l'approche en quelques lignes, puis modifier uniquement les fichiers nécessaires.
- Lancer `npm run build` après chaque étape. Ne jamais affirmer qu'un test a réussi sans l'avoir exécuté.
- Pas de clonage de voix : les dialogues parlés seront mes vrais enregistrements, avec chemins configurables
  et comportement de secours si le fichier manque.
- Ne rien inventer de personnel : utiliser docs/CONTENU.md, sinon mettre [À COMPLÉTER].
- Public cible : joueuse sur téléphone en paysage. Boutons grands, pas d'action précise au doigt.
- Fin de chaque étape : lister fichiers créés/modifiés, tests faits, problèmes restants.