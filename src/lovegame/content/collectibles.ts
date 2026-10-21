/**
 * Contenu officiel des objets facultatifs (aucun n'est obligatoire) :
 * - Cœurs cachés & anecdotes tendres/humoristiques
 * - Souvenirs facultatifs (fleurs, notes, objets) sans invention de faits privés (respect de docs/CONTENU.md)
 * - Le Chat de la Bibliothèque (indices humoristiques)
 */

export interface OptionalMemory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  location: string;
  text: string;
  poeticNote: string;
}

export interface HiddenHeartInfo {
  id: string;
  zone: 'university' | 'garden' | 'bridge';
  title: string;
  hint: string;
  anecdote: string;
}

export const OPTIONAL_MEMORIES: OptionalMemory[] = [
  {
    id: 'souvenir-fleur-sechee',
    title: 'La Fleur Séchée',
    subtitle: 'Un trésor délicatement préservé',
    icon: '🌸',
    location: 'Jardin Enchanté — Sur les hauteurs célestes',
    text: 'Une délicate fleur séchée, conservée avec soin comme un souvenir figé dans le temps. [À COMPLÉTER : jour où la fleur a été offerte ou cueillie].',
    poeticNote: 'Les fleurs fanent, mais la tendresse des premiers gestes reste intacte.',
  },
  {
    id: 'souvenir-note-encourageante',
    title: 'Le Petit Mot d’Encouragement',
    subtitle: 'Une pensée glissée discrètement',
    icon: '📝',
    location: 'Couloir de l’Université — Près de la bibliothèque',
    text: 'Un mot tracé à la main sur un coin de feuille : « Bon courage pour ta journée, tu es la meilleure ! » [À COMPLÉTER].',
    poeticNote: 'Quelques mots griffonnés à la dérobée suffisaient à illuminer toute une journée.',
  },
  {
    id: 'souvenir-porte-cle-complice',
    title: 'Le Porte-Clé Complice',
    subtitle: 'Un symbole de vos débuts',
    icon: '🗝️',
    location: 'L’Université — Casier du couloir',
    text: 'Un petit objet du quotidien devenu un clin d’œil secret et complice entre vous deux. [À COMPLÉTER].',
    poeticNote: 'Les souvenirs les plus précieux se nichent souvent dans les objets les plus simples.',
  },
  {
    id: 'souvenir-chocolat-reconfort',
    title: 'La Douceur Partagée',
    subtitle: 'Le remède à toutes les épreuves',
    icon: '🍫',
    location: 'Pont des Étoiles — Entre deux stèles de confiance',
    text: 'Une gourmandise partagée lors d’une pause bien méritée pour se redonner le sourire. [À COMPLÉTER].',
    poeticNote: 'Cupidon avait vu juste : le chocolat adoucit toutes les étapes d’une aventure !',
  },
  {
    id: 'souvenir-premiere-photo',
    title: 'L’Instantané Souriant',
    subtitle: 'Le reflet d’une complicité naissante',
    icon: '📸',
    location: 'La Clairière des Retrouvailles — Sous les lucioles',
    text: 'Une photo prise sur le vif où vos regards complices en disaient déjà bien plus long que tous les discours. [À COMPLÉTER].',
    poeticNote: 'Le début officiel de tous les albums et de toutes les aventures à venir.',
  },
];

export const HIDDEN_HEARTS: HiddenHeartInfo[] = [
  // --- UNIVERSITÉ ---
  {
    id: 'coeur-cache-univ-1',
    zone: 'university',
    title: 'Cœur Secret du Tableau d’Affichage',
    hint: 'Caché derrière une annonce de cours dans le couloir',
    anecdote: 'Anecdote : Dylan passait au moins 10 minutes à relire ses messages avant d’oser appuyer sur « Envoyer » ! 😂',
  },
  {
    id: 'coeur-cache-univ-2',
    zone: 'university',
    title: 'Cœur Secret de la Bibliothèque',
    hint: 'Niché tout près du panier du Chat lecteur',
    anecdote: 'Anecdote : Cupidon confirme que le jour de votre premier regard, le rythme cardiaque de Dylan a battu tous les records universitaires ! ❤️',
  },

  // --- JARDIN ENCHANTÉ ---
  {
    id: 'coeur-cache-jardin-1',
    zone: 'garden',
    title: 'Cœur Secret des Hauteurs',
    hint: 'Perché sur les branches les plus hautes du jardin enchanté',
    anecdote: 'Anecdote : Dylan s’était préparé une dizaine de phrases d’approche… avant d’oublier absolument tout au moment de te parler ! 🤣',
  },
  {
    id: 'coeur-cache-jardin-2',
    zone: 'garden',
    title: 'Cœur Secret de la Clairière Cachée',
    hint: 'Derrière les lanternes lumineuses',
    anecdote: 'Anecdote : « Tu es mon plus beau hasard »… et pourtant, le destin n’a jamais aussi bien fait les choses.',
  },
  {
    id: 'coeur-cache-jardin-3',
    zone: 'garden',
    title: 'Cœur Secret de l’Envolée',
    hint: 'Au-dessus du rocher moussu',
    anecdote: 'Anecdote : Le rire le plus communicatif de l’université a suffi à dissiper toutes les hésitations.',
  },

  // --- PONT DES ÉTOILES ---
  {
    id: 'coeur-cache-pont-1',
    zone: 'bridge',
    title: 'Cœur Secret de la Première Arche',
    hint: 'Suspendu dans le ciel nocturne au-dessus de la voie lactée',
    anecdote: 'Anecdote : Construire un avenir à deux, c’est choisir de faire équipe chaque jour avec le sourire.',
  },
  {
    id: 'coeur-cache-pont-2',
    zone: 'bridge',
    title: 'Cœur Secret de l’Étoile Filante',
    hint: 'Entre la plateforme du Travail et du Soutien',
    anecdote: 'Anecdote : Quand le doute s’installe, ton soutien est la lumière qui remet tout en marche.',
  },
  {
    id: 'coeur-cache-pont-3',
    zone: 'bridge',
    title: 'Cœur Secret du Foyer Lumineux',
    hint: 'Tout près du socle central où scintillent les trois gemmes',
    anecdote: 'Anecdote : Une maison solide a trois piliers : du courage, des actes, et un amour sincère qui grandit chaque jour. 🏡',
  },
];

export const LIBRARY_CAT_DATA = {
  name: 'Le Chat de la Bibliothèque',
  avatar: '🐱',
  title: 'Gardien félin des secrets & observateur nonchalant',
  color: '#ffb27a',
  officialQuote:
    '« Miaou… Tu cherches le garçon ? Le garçon est sûrement dans la salle 4 ! Enfin… ou 5. J’ai une très mauvaise mémoire. Et je suis un chat, j’ai des standards. »',
  hints: {
    general:
      '« Si tu es perdue dans le couloir, parle au Gardien à l’entrée des salles : il a la clé de la Salle C. Et écoute bien l’étudiante curieuse, elle a l’œil affûté ! Miaou ! »',
    puzzles:
      '« Pour les énigmes, prends ton temps. Même Cupidon a séché sur le code du cœur ! Et rappelle-toi : aucune mauvaise réponse ne te punit. »',
    secrets:
      '« Ronron… Tu as remarqué les reflets qui brillent près des casiers et sur les étagères ? Ce sont des cœurs cachés et de doux souvenirs. Rien ne presse, mais c’est joli à regarder ! »',
    purr:
      '« Ronrrr… ronrrr… Tu gratouilles exactement au bon endroit. Tiens, prends un peu de chance féline pour ton voyage ! ✨ »',
  },
};
