# CAHIER DES CHARGES — DEUX LETTRES, UNE PROMESSE

Jeu narratif romantique 2D (aventure, exploration, énigmes), personnalisé, destiné à une seule personne.
Langue : français. Plateforme : navigateur, ordinateur et téléphone (paysage). Mode : solo.

**Stack RÉELLE : React 19 + TypeScript + Vite + Phaser 4.0.0. Il n'y a PAS de Vue.**
Lancer : `npm run dev`. Build : `npm run build`.

---

# 0. ÉTAT ACTUEL DU PROJET (à lire en premier)

Une version 1 jouable existe déjà. Elle doit être ÉTENDUE, jamais réécrite.

## Code existant
- `src/App.tsx` : machine d'états title → playing → ending, HUD, toasts, modale de lettre.
- `src/lovegame/game.ts` : configuration Phaser (1280x720, Scale.FIT, physique arcade).
- `src/lovegame/scenes/` : `PreloadScene` (charge les ressources, crée les animations),
  `LevelScene` (un niveau paramétré par `levels.ts` : marche, saut, plateformes à sens unique,
  rochers, cœurs, coffre, prince qui accueille puis arrive au coffre), `EndingScene`.
- `src/lovegame/levels.ts` : 2 niveaux (jardin enchanté, pont des étoiles).
- `src/lovegame/bus.ts` : EventEmitter React ↔ Phaser. `controls.ts` : commandes tactiles.
- `src/lovegame/audio.ts` : musique, baisse du volume pendant les lettres.
- `src/lovegame/content/story.ts` et `letters.ts` : textes et chemins audio.
- `src/components/` : `LetterModal`, `AudioPlayer`, `TouchControls`.
- `public/assets/` : sprites de l'héroïne (préfixe `her-`) et du prince (`him-`), décors
  (jardin, pont, scène finale, écran titre), coffre fermé/ouvert, cœur, rocher, plateforme, halo.
- Le dossier `src/game/` vient du template d'origine et n'est plus utilisé.

## Contenu déjà intégré
- La lettre 1, la lettre 2 et la promesse finale sont DÉJÀ écrites et intégrées dans le jeu
  (textes et audios). NE JAMAIS les modifier, les reformuler ni les dupliquer.
  Les textes de référence sont dans `src/lovegame/content/letters.ts` et `docs/CONTENU.md`.
- Si `docs/CONTENU.md` ne dit rien sur un détail personnel de notre histoire,
  écrire `[À COMPLÉTER]` plutôt que d'inventer.

## Correspondance avec ce cahier
- Niveau « jardin » existant → base du chapitre 3 (chasse aux fragments).
- Niveau « pont » existant → base du chapitre 4 (pont des étoiles).
- Les chapitres 0, 1, 2 et 5 et l'épilogue sont à créer.
- La mécanique actuelle « cœurs → coffre → lettre » doit être conservée et réutilisée.

---

# 1. MISSION GÉNÉRALE

La joueuse revit notre histoire à travers une aventure interactive : elle incarne l'héroïne,
explore des environnements, parle à des personnages, résout des énigmes, retrouve des souvenirs
et reconstitue une phrase romantique, jusqu'à retrouver son amoureux.

L'expérience doit être romantique et émotionnelle, drôle et légère, interactive (de vrais
objectifs), assez longue pour être une vraie aventure, personnalisée, et immersive (animations,
décors, dialogues, ma vraie voix). Ce n'est PAS un diaporama de lettres précédé de quelques sauts.

## 1.1. Règles non négociables
1. Ne pas réécrire le projet depuis zéro.
2. Ne pas supprimer ou casser les fonctionnalités existantes qui marchent.
3. Ne pas supposer l'existence d'un fichier, d'une classe ou d'une scène sans l'avoir inspecté.
4. Pas d'architecture parallèle : étendre l'architecture existante.
5. Ne pas remplacer React, TypeScript ou Phaser.
6. Pas de clonage de voix : les dialogues parlés seront mes vrais enregistrements.
7. Ne pas inventer d'événements personnels présentés comme des faits.
8. Pas d'énigmes artificiellement difficiles ou répétitives.
9. Aucune mauvaise réponse ne bloque définitivement la progression.
10. Pas de composant ou de fichier gigantesque : découper par responsabilité.

---

# 2. MÉTHODE DE TRAVAIL

## Étape A — Audit (aucune modification de code)
Inspecter : `package.json`, la configuration Phaser, les scènes, le déplacement et le saut,
les collisions, la caméra, les animations, les cœurs/coffres/récompenses, les interfaces de
dialogue et de lettres, l'audio, la navigation entre scènes, les contrôles clavier et tactiles,
les ressources, et toute sauvegarde existante. Produire `docs/AUDIT.md` : éléments
réutilisables, éléments à compléter, vrais problèmes techniques (Phaser 4, mobile, performances).
Ne pas déduire qu'une fonctionnalité manque parce qu'elle n'a pas été trouvée du premier coup.

## Étape B — Plan
Plan en phases indépendantes. Pour chaque phase : fichiers existants concernés, nouveaux
fichiers, fonctionnalités réutilisées, risques de régression, tests, critères de fin.
Présenter le plan AVANT de modifier le code.

## Étape C — Implémentation, phase par phase
Pour chaque phase : inspecter, expliquer brièvement l'approche, modifier uniquement les
fichiers nécessaires, respecter les conventions du dépôt, lancer `npm run build`, puis
rapporter les fichiers créés/modifiés, les tests réellement faits et les problèmes restants.
Ne jamais prétendre qu'un test a réussi sans l'avoir exécuté.

---

# 3. CONCEPT NARRATIF

La joueuse reçoit une invitation mystérieuse. Des souvenirs sont dispersés dans plusieurs
lieux ; pour retrouver le garçon qui l'attend, elle doit les reconstituer.

**Cupidon le stagiaire** (nom provisoire) l'accompagne : maladroit, bavard, drôle, persuadé
d'être expert en amour. Il donne des indices, commente les erreurs, détend l'ambiance. Il ne
monopolise pas l'histoire : le couple reste au centre.

Structure : 1) invitation mystérieuse, 2) retrouver le garçon de l'université, 3) laboratoire
des sentiments, 4) chasse aux fragments de phrase, 5) pont des étoiles et le futur, 6) retrouver
son amoureux, 7) promesse finale.

Durée cible : 30 à 40 minutes, avec de vrais moments de gameplay et pas seulement des dialogues.

---

# 4. DIRECTION ARTISTIQUE ET COMMANDES

Style dessin animé 2D romantique, chaleureux, féerique, cohérent avec les images existantes
(palette bleu nuit, vert émeraude, or, rose). Lieux : université, salles de cours, couloirs,
jardin enchanté, zone de puzzles, pont sous les étoiles, clairière des retrouvailles.
Lumières douces, lucioles, cœurs lumineux, particules, transitions, animations de réussite et
d'échec. Ne pas surcharger : les moments émotionnels restent lisibles.

Personnages : l'héroïne (jouable), le prince/amoureux, Cupidon, et des PNJ de l'université
avec des répliques différentes. Réutiliser en priorité les sprites existants.

Les nouvelles images seront produites séparément (ChatGPT). Lister tout ce qui manque dans
`docs/ASSETS_A_FAIRE.md` (nom de fichier, taille, poses, description) et utiliser des
formes/placeholders provisoires en attendant.

Commandes : ordinateur (flèches ou A/D, saut, E ou Entrée pour interagir) et téléphone
(boutons tactiles déjà existants). Pas d'interaction exigeant une précision excessive au doigt.
Les puzzles doivent se jouer en touchant (par exemple, toucher deux cartes pour les échanger),
pas seulement en glissant.

---

# 5. CHAPITRE 0 — L'INVITATION MYSTÉRIEUSE

Objectif : introduire l'aventure et donner envie de la suite.

Déroulement : scène d'introduction ; enveloppe lumineuse à ouvrir ; message personnel ;
apparition de Cupidon ; carte (université, jardin, pont) ; première énigme ; chemin vers
l'université.

Message d'introduction : « À la personne qui a changé ma vie sans même le savoir au début… »
(modifiable).

Cupidon : « Bonjour, mademoiselle ! Je suis responsable de cette mission sentimentale.
J'ai un diplôme en amour, un master en bisous et… » (il regarde ses papiers) « Mince.
J'ai oublié le dossier. Bon, on va improviser. »

Énigme du code du cœur : cœur = 2, étoile = 3, lune = 1. Question : cœur + étoile + lune.
Réponses proposées : 5, 6, 7. Bonne réponse : 6. Une erreur déclenche une remarque drôle de
Cupidon et autorise une nouvelle tentative.

Réussite : enveloppe ouverte, dialogue terminé, énigme résolue, transition vers l'université.

---

# 6. CHAPITRE 1 — RETROUVER LE GARÇON DE L'UNIVERSITÉ

Vrai niveau d'exploration. La joueuse te retrouve en interrogeant des personnages et en
explorant des salles.

## 6.1. Trois personnages à interroger

**A — L'étudiante curieuse** : « Tu cherches un garçon ? Ici ? Ma sœur, tu dois être plus
précise. Il y en a qui cherchent les cours, d'autres les notes… et certains cherchent
clairement l'amour. » Question : « Dans quel endroit vous êtes-vous retrouvés seuls pour la
première fois ? » Choix : la cour / la bibliothèque / une salle de cours. Bonne réponse
provisoire : salle de cours (CONFIGURABLE, à valider avec moi).

**B — L'étudiant distrait** : « Oui, je vois de qui tu parles ! Enfin… je crois. Je confonds
peut-être avec le gars qui vend des beignets. » Il propose trois objets-indices. L'objet correct
est configurable et ne doit pas être présenté comme un souvenir réel sans ma validation.

**C — Le gardien** : « Ah ! Le jeune homme qui pose beaucoup de questions et qui passe
parfois ici avec un air bizarre ? » Puis : « Bon, quand on est amoureux, on devient un peu
bizarre. C'est presque scientifique. » Il donne une clé ou un indice qui débloque une salle.

## 6.2. Trois salles

**Salle A — Le souvenir perdu** : flashback où le garçon remarque la fille et hésite.
Garçon : « Bon… j'y vais. Non. Pas maintenant. Bon, si. Attends… »
Cupidon : « Courage, champion ! Tu ne vas pas négocier avec tes propres jambes toute la journée ! »

**Salle B — Le tableau des souvenirs** : trois symboles (sourire, cadeau, cœur) à remettre dans
l'ordre narratif : 1) premiers échanges, 2) cadeaux et complicité, 3) sentiments amoureux.
Une erreur donne un retour visuel et permet de recommencer.

**Salle C — La salle du courage** : interaction avec une porte. À chaque étape, un fragment de
la scène se révèle ; le garçon du flashback finit par se décider à parler à la fille.
Animation visible obligatoire, pas une simple succession de clics.

## 6.3. Rejouer la première rencontre
La joueuse entre dans la salle de la première rencontre, repère le garçon, va vers lui et
déclenche la conversation.
Garçon : « Salut… ça va ? »
Choix : « Oui, et toi ? » / « Tu voulais me dire quelque chose ? » / « Pourquoi tu as l'air
aussi stressé ? » (chaque réponse rejoint la suite).
Réplique : « En vrai, je voulais juste venir te parler depuis un moment… mais je ne savais pas
trop comment faire. » Puis : « Je suis content d'avoir finalement osé. »
La scène se termine par des particules lumineuses qui matérialisent un fragment de souvenir.

## 6.4. Récompense
Le fragment obtenu débloque le chapitre suivant. Si c'est simple à faire, ajouter un journal
ou une galerie pour revisiter les souvenirs.

---

# 7. CHAPITRE 2 — LE LABORATOIRE DES SENTIMENTS

## 7.1. Remettre l'histoire dans l'ordre
Cinq cartes : 1) premiers échanges, 2) cadeaux et rires, 3) rumeur « vous étiez ensemble »,
4) la question « Est-ce que tu es amoureux de moi ? », 5) aveu des sentiments.
Validation de la séquence. En cas d'erreur, un indice sans donner toute la solution.
Cupidon : « Non, non, non ! Tu viens de faire une avance rapide dans votre histoire. Même les
séries romantiques ne vont pas aussi vite ! »

## 7.2. L'enquête sur la rumeur
Trois étudiants : A « Moi, je dis qu'ils sont ensemble ! » ; B « Mais ils ont dit que non ! » ;
C « Oui, mais pourquoi vous souriez comme ça quand vous en parlez ? »
Interroger les trois révèle le mot « sentiments ». Les indices découverts sont conservés.

## 7.3. La question qui change tout
Un téléphone interactif affiche : « Est-ce que tu es amoureux de moi ? »
Choix : « Non, pas du tout. » / « Oui, je crois que je suis amoureux de toi. » / « Je dois
demander à Cupidon. » La deuxième réponse déclenche le flashback de l'aveu.
Cupidon : « Voilà ! Enfin quelqu'un qui répond clairement. J'ai cru que j'allais devoir
organiser une réunion de crise. »
Le flashback rappelle : l'aveu, le refus initial, la proposition de « faux couple », le moment
où elle dit qu'elle l'aime. À adapter à notre histoire réelle ; ne pas présenter comme
dialogues exacts ce que je n'ai pas fourni.

## 7.4. Première lettre
À la fin du chapitre, un coffre sous un arbre lumineux s'ouvre et affiche la lettre 1.
La lettre 1 est DÉJÀ intégrée : réutiliser le système existant (LetterModal, AudioPlayer),
ne pas recréer ni modifier son contenu. Elle doit rester relisible plus tard, sans fermeture
automatique. La fin de la lecture déclenche le chapitre suivant.

---

# 8. CHAPITRE 3 — LA CHASSE AUX FRAGMENTS DE PHRASE

Phrase cible : **« TU ES MON PLUS BEAU HASARD »** (élément de jeu ; ne remplace pas les lettres).
Six fragments : TU, ES, MON, PLUS, BEAU, HASARD, cachés dans le décor ou obtenus par énigmes
et coffres. Base technique : le niveau « jardin » existant.

## 8.1. Épreuve A — Les plateformes du courage
Plateformes fixes, mobiles, temporaires, obstacles simples, zones secrètes, points de contrôle
si nécessaire. Collisions fiables, sauts adaptés au tactile. Une chute n'oblige jamais à
recommencer tout le chapitre.

## 8.2. Épreuve B — Les lanternes qui se souviennent
Trois lanternes (bleue, dorée, blanche) s'allument dans un ordre ; la joueuse reproduit la
séquence. Gérer : présentation, saisie, validation, échec, nouvelle tentative, récompense.
Séquence courte pour rester amusante.

## 8.3. Épreuve C — Le coffre capricieux
« Je peux commencer par un regard, grandir avec des rires et changer une vie sans faire de
bruit. Qui suis-je ? » Réponse : l'amour. Zone de sélection plutôt que saisie stricte.
Une erreur : indice humoristique de Cupidon.

## 8.4. Assemblage final
Afficher les six fragments dans un ordre aléatoire ; la joueuse les assemble (par touches
successives sur mobile). Validation indépendante de l'ordre de découverte. Succès : les mots
s'illuminent, la phrase s'affiche au centre, une constellation se dessine, le passage vers le
pont des étoiles s'ouvre.
Cupidon : « Oh… c'est beau. Je vais pleurer. Attends, je suis un professionnel, je ne dois
pas pleurer… Bon, d'accord, je pleure un tout petit peu. Mais c'est à cause de la poussière
magique ! »

---

# 9. CHAPITRE 4 — LE PONT DES ÉTOILES

Atmosphère tournée vers le futur, les efforts réciproques et le soutien mutuel. Difficulté
légèrement plus élevée, ton toujours chaleureux. Base technique : le niveau « pont » existant.

## 9.1. Les étoiles de la confiance (trois questions)
1. Qu'est-ce qui aide une relation à grandir ? A. Ne jamais avoir de désaccord. B. S'écouter,
   se parler et faire des efforts. C. Attendre que tout se règle tout seul. → **B**
2. Comment soutenir les rêves de l'autre ? A. Lui demander d'abandonner ses projets. B. Décider
   à sa place ce qui est mieux pour elle. C. L'encourager et chercher à grandir ensemble. → **C**
3. Que faire face à un obstacle ? A. Se parler, chercher des solutions et avancer ensemble.
   B. Faire comme si le problème n'existait pas. C. Tout abandonner immédiatement. → **A**
Ce n'est pas un test moral : elles racontent les valeurs du couple. Une mauvaise réponse permet
de recommencer sans jugement.

## 9.2. Les trois fragments de l'avenir
Trois zones reliées par des plateformes : le courage, le travail, le soutien. Un fragment par
zone, à placer sur un socle au centre du pont. Les trois réunis, le coffre final s'ouvre.
Cupidon : « Félicitations ! Tu as trouvé les trois ingrédients d'une relation solide. Moi,
j'aurais ajouté le chocolat… mais apparemment, personne ne m'écoute dans cette équipe. »

## 9.3. Deuxième lettre
La lettre 2 est DÉJÀ intégrée : ne pas la modifier ni la dupliquer (les deux copies envoyées
précédemment correspondent à une seule lettre). Ajouter seulement la mise en scène : pendant
la lecture, une maison lumineuse encore incomplète se construit (fenêtres, porte, jardin,
lumières). C'est la métaphore d'un futur construit par des actes, pas d'un avenir garanti.
Ne pas créer de conflit familial artificiel ni faire porter l'avenir à un seul partenaire.

---

# 10. CHAPITRE 5 — RETROUVER SON AMOUREUX

Trois éléments déjà obtenus ouvrent trois portes successives : le souvenir de l'université,
la phrase reconstituée, les fragments de l'avenir. Chaque porte montre une courte animation
d'une étape de notre histoire. Ensuite, un chemin lumineux mène à une clairière, où la joueuse
rejoint le personnage masculin et déclenche la scène finale.

Dialogues (un fichier audio distinct par réplique, remplaçable) :
- « Alors… tu m'as enfin retrouvé. 😂❤️ »
- « Je crois que tu as mérité quelques explications. Et cette fois, je n'ai pas de salle de classe pour me cacher derrière. »
- « J'aurais pu simplement t'écrire une lettre. Mais je voulais te faire vivre quelque chose. Te faire sourire, te faire rire, te rappeler notre histoire… et te montrer ce que tu représentes pour moi. »
- « Je ne sais pas encore exactement à quoi ressemblera tout notre avenir. Mais je sais que j'ai envie de faire les efforts nécessaires, de continuer à avancer et de construire quelque chose de vrai avec toi. »
- « Merci d'être entrée dans mon histoire. Et merci d'y être encore aujourd'hui. »

---

# 11. ÉPILOGUE — LA PROMESSE FINALE

Aucune nouvelle énigme après les retrouvailles. Musique douce, personnages qui se rapprochent,
lucioles et constellation de la phrase. Une enveloppe affiche : « Une dernière chose, ma poupée… »
La joueuse l'ouvre pour lancer le dernier enregistrement.

La promesse est DÉJÀ intégrée (texte et audio) : la réutiliser telle quelle via le système de
lettres existant.

Dernier choix : « Ma poupée, veux-tu continuer à écrire cette histoire avec moi ? »
- « Oui, continuons notre histoire ❤️ »
- « Attends… j'ai encore envie de te faire travailler ! 😂 » → animation comique de Cupidon :
  « Pardon ?! Après toutes ces énigmes ? Même moi, je demande une pause ! 😂 »
  puis retour à l'écran précédent ou revoir des souvenirs.
Le jeu ne culpabilise JAMAIS la joueuse si elle choisit la réponse humoristique.

Écran final : titres des deux lettres, souvenirs débloqués, revoir la promesse, rejouer les
énigmes ou explorer les souvenirs facultatifs.

---

# 12. ACTIVITÉS SECONDAIRES (jamais bloquantes)

- **Cœurs cachés** : jusqu'à 8 par grande zone, visibles ou cachés (derrière le décor, sur des
  plateformes, dans des salles facultatives). Non obligatoires. Récompenses : anecdote,
  dialogue, animation, souvenir facultatif, élément cosmétique. (Le système de cœurs existant
  sert déjà à réveiller les coffres : le conserver.)
- **Le chat de la bibliothèque** : indices humoristiques. « Le garçon est sûrement dans la
  salle 4 ! Enfin… ou 5. J'ai une très mauvaise mémoire. Et je suis un chat, j'ai des standards. »
  Peut donner un indice supplémentaire si la joueuse est bloquée.
- **Souvenirs facultatifs** : objets dispersés (cadeaux, notes, fleurs, objets de l'université)
  qui débloquent un petit texte ou une animation. Ne pas inventer de signification personnelle.
- **Erreurs humoristiques** : toute erreur produit une réaction de Cupidon ou d'un personnage ;
  elle ne supprime jamais de progression, ne force pas à refaire un niveau, ne bloque pas une
  porte, ne fait pas perdre une lettre découverte.

---

# 13. ARCHITECTURE TECHNIQUE

À adapter après l'audit. Répartition souhaitée :

1. **Phaser** = monde de jeu (déplacement, collisions, PNJ, objets, caméra). **React** =
   interfaces HTML (dialogues, énigmes, lettres, menus, journal), plus fiables sur mobile.
   Communication uniquement via `bus.ts`, événements documentés.
2. **Chapitres** : états verrouillé / accessible / en cours / terminé, transitions pilotées
   par des conditions explicites.
3. **Missions** : identifiant stable, objectif, conditions de réussite, étapes, récompenses,
   indices, état. Ne pas disperser les conditions dans de nombreux handlers.
4. **Dialogues** : personnage, texte, réponses, dialogue suivant, conditions, audio optionnel,
   action de progression. Structure de données réutilisable dans `content/`.
5. **Énigmes** (séparées du déplacement) : sélection, ordre chronologique, séquence à
   reproduire, assemblage de fragments, indices. Chacune gère tentatives, erreurs, validation,
   récompense unique.
6. **Lettres et audios** : système existant à généraliser (lettre 1, lettre 2, promesse,
   répliques des retrouvailles). Une seule lecture vocale à la fois, musique baissée pendant
   la voix, relecture possible, chemins audio configurables, comportement de secours si
   un fichier manque.
7. **Sauvegarde locale** (localStorage) : chapitre courant, missions, énigmes, fragments,
   lettres débloquées, souvenirs. Format versionné, bouton « Recommencer », aucune donnée
   personnelle sensible.
8. **Un seul état de progression**, jamais dupliqué entre React et Phaser.
9. Tous les textes dans `src/lovegame/content/`, aucun texte en dur dans les scènes.

---

# 14. QUALITÉ

- **Performance** : pas de créations d'objets répétées, libérer les ressources aux
  transitions, pas de listeners dupliqués, arrêter les sons et animations inutiles, viser les
  téléphones modestes.
- **Ergonomie** : contrôles clairs, boutons tactiles grands, texte lisible, dialogues faciles
  à faire avancer, retours visuels de réussite et d'échec, lettres relisibles, aucun piège de
  progression.
- **Cohérence narrative** : chaque mission sert l'histoire ; l'humour n'interrompt pas un
  moment émotionnel ; les lettres restent fidèles à leur version originale.
- **Robustesse** : collisions, transitions de scène, progression après échec, récompenses
  uniques, fermeture des interfaces, audio interrompu, contrôles tactiles, sauvegarde et
  chargement, redémarrage d'un chapitre.

---

# 15. CRITÈRES D'ACCEPTATION

**Parcours** : l'introduction mène à l'université ; les trois personnages sont interrogeables ;
les salles proposent des activités distinctes ; la première rencontre est interactive ; la
lettre 1 s'ouvre au bon moment ; les six fragments sont collectables et la phrase
reconstituable ; le pont a ses propres épreuves ; la lettre 2 s'ouvre au bon moment ; les
objets récupérés ouvrent les portes ; la promesse finale s'écoute.

**Gameplay** : déplacements, sauts et collisions fiables ; interactions non déclenchées en
double ; énigmes à tentatives illimitées ; récompenses accordées une seule fois ; contrôles
tactiles utilisables ; facultatif non bloquant.

**Audio et présentation** : textes des lettres inchangés ; audios remplaçables sans toucher
aux scènes ; voix et musique non superposées ; dialogues lisibles ; transitions cohérentes ;
fin qui constitue une vraie conclusion.

**Technique** : le projet démarre ; `npm run build` réussit ; erreurs TypeScript corrigées ;
aucune fonctionnalité existante supprimée sans justification ; tests réellement exécutés
documentés ; problèmes restants signalés honnêtement.

---

# 16. INSTRUCTION FINALE

Commence UNIQUEMENT par l'audit (Étape A) et écris `docs/AUDIT.md`. Ne génère pas le jeu d'un
coup. Après l'audit, présente les éléments réutilisables, les risques, les écarts avec ce
cahier et l'ordre recommandé, puis attends ma validation avant d'implémenter la première phase.

Priorité absolue : l'expérience de la joueuse. Chaque déplacement, énigme, dialogue, souvenir
et animation doit lui faire vivre notre histoire, la faire rire, la toucher et lui donner
envie de découvrir la suite.