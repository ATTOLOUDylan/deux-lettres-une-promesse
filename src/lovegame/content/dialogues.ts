import { ProgressionState } from '../state/types';

export interface DialogueOption {
  text: string;
  next?: string; // ID du nœud de dialogue suivant
  condition?: (state: ProgressionState) => boolean;
  action?: string; // Action déclenchée sur la progression (ex: 'cupidon_intro_finished')
  puzzleId?: string; // Déclenche l'ouverture d'une énigme
}

export interface DialogueNode {
  id: string;
  speaker: {
    name: string;
    avatar?: string;
    title?: string;
    color?: string;
  };
  text: string;
  options?: DialogueOption[];
  next?: string; // Utilisé quand il n'y a pas de choix multiple (clic/tap pour avancer)
  condition?: (state: ProgressionState) => boolean;
  action?: string;
  audio?: string;
}

export type DialoguesMap = Record<string, DialogueNode>;

export const DIALOGUES: DialoguesMap = {
  // --- CHAPITRE 0 : L'Invitation Mystérieuse ---
  'cupidon-ch0-intro-1': {
    id: 'cupidon-ch0-intro-1',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      color: '#ff8fb8',
      avatar: '👼',
    },
    text: 'Bonjour mademoiselle ! Je suis Cupidon le stagiaire, responsable officiel de cette mission sentimentale ! J’ai un diplôme en amour, un master en bisous et… attends…',
    next: 'cupidon-ch0-intro-2',
  },
  'cupidon-ch0-intro-2': {
    id: 'cupidon-ch0-intro-2',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      color: '#ff8fb8',
      avatar: '👼',
    },
    text: '(Il fouille frénétiquement dans sa sacoche ailée) Mince. J’ai oublié le dossier officiel ! Bon, pas de panique, on va improviser avec élégance !',
    options: [
      {
        text: 'Un stagiaire pour guider notre amour ? 😂',
        next: 'cupidon-ch0-stagiaire',
      },
      {
        text: 'Que devons-nous faire maintenant ?',
        next: 'cupidon-ch0-mission',
      },
    ],
  },
  'cupidon-ch0-stagiaire': {
    id: 'cupidon-ch0-stagiaire',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      color: '#ff8fb8',
      avatar: '👼',
    },
    text: 'Hé ! Je suis très compétent quand je m’applique ! Et puis Dylan a tout préparé pour toi avec son cœur. Regarde, j’ai quand même réussi à sauver la carte de votre aventure !',
    options: [
      {
        text: 'Montre-moi la carte de notre voyage ! 🗺️',
        action: 'view_ch0_map',
      },
    ],
  },
  'cupidon-ch0-mission': {
    id: 'cupidon-ch0-mission',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      color: '#ff8fb8',
      avatar: '👼',
    },
    text: 'Dylan t’a préparé un voyage à travers vos plus beaux souvenirs jusqu’à votre avenir. Regarde, j’ai sauvé la carte de votre aventure dans ma sacoche !',
    options: [
      {
        text: 'Montre-moi la carte de notre voyage ! 🗺️',
        action: 'view_ch0_map',
      },
    ],
  },

  // --- DÉMONSTRATION : Premier contact avec Cupidon le stagiaire ---
  'cupidon-jardin-intro-1': {
    id: 'cupidon-jardin-intro-1',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      color: '#ff8fb8',
      avatar: '👼',
    },
    text: 'Bonjour mademoiselle ! Je suis Cupidon le stagiaire, responsable assermenté de votre voyage romantique ! J’ai un master en bisous, un diplôme en sentiments et… attends…',
    next: 'cupidon-jardin-intro-2',
  },
  'cupidon-jardin-intro-2': {
    id: 'cupidon-jardin-intro-2',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      color: '#ff8fb8',
      avatar: '👼',
    },
    text: '(Il fouille frénétiquement dans sa sacoche) Mince… j’ai oublié le dossier officiel ! Bon, pas d’inquiétude, on va improviser avec élégance !',
    options: [
      {
        text: 'Un stagiaire ?! C’est rassurant… 😂',
        next: 'cupidon-jardin-humour',
      },
      {
        text: 'Dylan m’a laissé une énigme ici ? 🧩',
        next: 'cupidon-jardin-enigme',
      },
      {
        text: 'Que dois-je faire dans ce jardin ?',
        next: 'cupidon-jardin-mission',
      },
    ],
  },
  'cupidon-jardin-enigme': {
    id: 'cupidon-jardin-enigme',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      color: '#ff8fb8',
      avatar: '👼',
    },
    text: 'Exactement ! Dylan m’a confié « Le Code Secret du Cœur ». C’est une formule qu’il a préparée spécialement pour toi. Prête à tenter ta chance ?',
    options: [
      {
        text: 'Oui ! Ouvrir l’énigme du cœur ✨',
        puzzleId: 'puzzle-heart-code',
      },
      {
        text: 'Dis-moi d’abord ce que je dois faire dans le jardin',
        next: 'cupidon-jardin-mission',
      },
    ],
  },
  'cupidon-jardin-humour': {
    id: 'cupidon-jardin-humour',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      color: '#ff8fb8',
      avatar: '👼',
    },
    text: 'Hé ! Un stagiaire très motivé, s’il vous plaît ! Et puis l’amour n’a pas besoin de protocole rigide. Dylan a préparé ce monde avec tout son cœur. Avancez et laissez-vous porter !',
    options: [
      {
        text: 'C’est parti ! ✨',
        action: 'cupidon_intro_done',
      },
    ],
  },
  'cupidon-jardin-mission': {
    id: 'cupidon-jardin-mission',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      color: '#ff8fb8',
      avatar: '👼',
    },
    text: 'Votre mission est simple : suivez le sentier, ramassez les cœurs pour réveiller le coffre magique au bout du jardin. Une lettre très spéciale vous y attend !',
    options: [
      {
        text: 'Je vais le retrouver ! ❤️',
        action: 'cupidon_intro_done',
      },
    ],
  },

  // --- CHAPITRE 1 : L'Université & Les Trois PNJ ---
  'etudiante-curieuse-intro': {
    id: 'etudiante-curieuse-intro',
    speaker: {
      name: 'L’Étudiante Curieuse',
      title: 'Observatrice du campus',
      avatar: '👩‍🎓',
      color: '#7bc4ff',
    },
    text: 'Tu cherches un garçon ? Ici ? Ma sœur, tu dois être plus précise ! Il y en a qui cherchent les cours, d’autres les notes… et certains cherchent clairement l’amour.',
    options: [
      {
        text: 'Peux-tu m’aider à le retrouver ?',
        next: 'etudiante-curieuse-question',
      },
      {
        text: 'Je cherche Dylan, le futur mari de ma vie ! ❤️',
        next: 'etudiante-curieuse-question',
      },
    ],
  },
  'etudiante-curieuse-question': {
    id: 'etudiante-curieuse-question',
    speaker: {
      name: 'L’Étudiante Curieuse',
      title: 'Observatrice du campus',
      avatar: '👩‍🎓',
      color: '#7bc4ff',
    },
    text: 'Pour être sûre qu’on parle du même : dans quel endroit vous êtes-vous retrouvés seuls pour la première fois ?',
    options: [
      {
        text: 'Dans la cour centrale de l’université',
        next: 'etudiante-curieuse-erreur',
      },
      {
        text: 'À la bibliothèque universitaire',
        next: 'etudiante-curieuse-erreur',
      },
      {
        text: 'Dans une salle de cours déserte 🏫',
        next: 'etudiante-curieuse-success',
      },
    ],
  },
  'etudiante-curieuse-erreur': {
    id: 'etudiante-curieuse-erreur',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      avatar: '👼',
      color: '#ff8fb8',
    },
    text: 'Hmm, pas tout à fait ! Dylan m’a confié qu’il n’y avait aucun prof ni aucun autre élève dans la pièce ce jour-là… Prends le temps de réfléchir, ma poupée !',
    options: [
      {
        text: 'Laisse-moi rechoisir !',
        next: 'etudiante-curieuse-question',
      },
    ],
  },
  'etudiante-curieuse-success': {
    id: 'etudiante-curieuse-success',
    speaker: {
      name: 'L’Étudiante Curieuse',
      title: 'Observatrice du campus',
      avatar: '👩‍🎓',
      color: '#7bc4ff',
    },
    text: 'Exactement ! Une salle de cours ! Je l’ai vu passer vers le fond du couloir tout à l’heure, l’air concentré et stressé comme s’il préparait un discours important !',
    options: [
      {
        text: 'Merci beaucoup ! Je vais vérifier là-bas ✨',
        action: 'indice_lieu_rencontre',
      },
    ],
  },

  // PNJ B : L'étudiant distrait
  'etudiant-distrait-intro': {
    id: 'etudiant-distrait-intro',
    speaker: {
      name: 'L’Étudiant Distrait',
      title: 'Spécialiste des pauses beignets',
      avatar: '🍩',
      color: '#ffd97a',
    },
    text: 'Oui, je vois de qui tu parles ! Enfin… je crois. Je confonds peut-être avec le gars qui vend des beignets. Quoique non, lui il n’avait pas de beignets dans les mains !',
    options: [
      {
        text: 'Tu te rappelles ce qu’il tenait ?',
        next: 'etudiant-distrait-objets',
      },
    ],
  },
  'etudiant-distrait-objets': {
    id: 'etudiant-distrait-objets',
    speaker: {
      name: 'L’Étudiant Distrait',
      title: 'Spécialiste des pauses beignets',
      avatar: '🍩',
      color: '#ffd97a',
    },
    text: 'Il tenait un objet bien précis contre lui en marchant… attends, c’était quoi déjà ?',
    options: [
      {
        text: 'Un sachet de beignets chauds 🍩',
        next: 'etudiant-distrait-erreur',
      },
      {
        text: 'Un carnet de notes et un stylo 📝 [À COMPLÉTER]',
        next: 'etudiant-distrait-success',
      },
      {
        text: 'Des écouteurs avec sa musique 🎧',
        next: 'etudiant-distrait-erreur',
      },
    ],
  },
  'etudiant-distrait-erreur': {
    id: 'etudiant-distrait-erreur',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      avatar: '👼',
      color: '#ff8fb8',
    },
    text: 'Haha non ! Ça c’est notre ami distrait qui a faim ! Dylan tenait quelque chose de studieux pour se donner une contenance ! 😂',
    options: [
      {
        text: 'Je choisis à nouveau !',
        next: 'etudiant-distrait-objets',
      },
    ],
  },
  'etudiant-distrait-success': {
    id: 'etudiant-distrait-success',
    speaker: {
      name: 'L’Étudiant Distrait',
      title: 'Spécialiste des pauses beignets',
      avatar: '🍩',
      color: '#ffd97a',
    },
    text: 'Ah oui, c’est ça ! Il serrait son carnet de notes très fort et répétait quelque chose à voix basse en marchant vers la Salle C !',
    options: [
      {
        text: 'Super indice, merci ! 📝',
        action: 'objet_distrait_trouve',
      },
    ],
  },

  // PNJ C : Le gardien
  'gardien-intro': {
    id: 'gardien-intro',
    speaker: {
      name: 'Le Gardien Bienveillant',
      title: 'Détenteur des clés du bâtiment',
      avatar: '🗝️',
      color: '#e5a8ff',
    },
    text: 'Ah ! Le jeune homme qui pose beaucoup de questions et qui passe parfois ici avec un air bizarre ?',
    options: [
      {
        text: 'Oui ! C’est Dylan ! Où est-il ?',
        next: 'gardien-cle',
      },
    ],
  },
  'gardien-cle': {
    id: 'gardien-cle',
    speaker: {
      name: 'Le Gardien Bienveillant',
      title: 'Détenteur des clés du bâtiment',
      avatar: '🗝️',
      color: '#e5a8ff',
    },
    text: 'Bon, quand on est amoureux, on devient un peu bizarre. C’est presque scientifique. Tiens, prends cette clé de la Salle C. Il s’y est enfermé tout à l’heure pour rassembler son courage !',
    options: [
      {
        text: 'Merci beaucoup monsieur ! 🗝️',
        action: 'cle_gardien_obtenue',
      },
    ],
  },

  // Salle A : Flashback Hésitation
  'flashback-hesitation-garcon': {
    id: 'flashback-hesitation-garcon',
    speaker: {
      name: 'Dylan (Souvenir)',
      title: 'Ce jour-là, dans le couloir',
      avatar: '👦',
      color: '#ffd97a',
    },
    text: 'Bon… j’y vais. Non. Pas maintenant. Bon, si. Attends… Mes mains tremblent un peu là, non ? Si je vais lui parler maintenant, je vais avoir l’air bête… Allez Dylan, un peu de courage !',
    next: 'flashback-hesitation-cupidon',
  },
  'flashback-hesitation-cupidon': {
    id: 'flashback-hesitation-cupidon',
    speaker: {
      name: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      avatar: '👼',
      color: '#ff8fb8',
    },
    text: 'Courage, champion ! Tu ne vas pas négocier avec tes propres jambes toute la journée ! Elle est juste dans la salle, vas-y avant qu’elle ne parte ! 😂',
    options: [
      {
        text: 'C’est trop mignon… 😂❤️',
        action: 'souvenir_hesitation_vu',
      },
    ],
  },

  // Salle C : Rencontre avec le garçon
  'rencontre-garcon-salut': {
    id: 'rencontre-garcon-salut',
    speaker: {
      name: 'Dylan',
      title: 'Dans la salle de cours',
      avatar: '👦',
      color: '#ffd97a',
    },
    text: 'Salut… ça va ?',
    options: [
      {
        text: 'Oui, et toi ? 😊',
        next: 'rencontre-garcon-explication',
      },
      {
        text: 'Tu voulais me dire quelque chose ?',
        next: 'rencontre-garcon-explication',
      },
      {
        text: 'Pourquoi tu as l’air aussi stressé ? 🤣',
        next: 'rencontre-garcon-explication',
      },
    ],
  },
  'rencontre-garcon-explication': {
    id: 'rencontre-garcon-explication',
    speaker: {
      name: 'Dylan',
      title: 'Dans la salle de cours',
      avatar: '👦',
      color: '#ffd97a',
    },
    text: 'En vrai, je voulais juste venir te parler depuis un moment… mais je ne savais pas trop comment faire. J’avais préparé plein de scénarios dans ma tête ! Mais ce jour-là, j’ai utilisé tout le courage que j’avais. Et je suis tellement content d’avoir osé. ❤️',
    options: [
      {
        text: 'Moi aussi, je suis contente que tu aies osé ❤️',
        action: 'premiere_rencontre_validee',
      },
    ],
  },
};
