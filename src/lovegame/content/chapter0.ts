export interface MapLocation {
  id: string;
  name: string;
  subtitle: string;
  status: 'accessible' | 'locked' | 'completed';
  icon: string;
  description: string;
}

export const CHAPTER_0_CONTENT = {
  chapterId: 'chapitre-0',
  title: 'Chapitre 0 — L’Invitation Mystérieuse',
  envelope: {
    senderTag: 'Un message scellé pour toi…',
    sealText: '❤',
    openPrompt: 'Touche l’enveloppe pour briser le sceau',
  },
  letter: {
    header: 'À la personne qui a changé ma vie sans même le savoir au début…',
    salutation: 'Ma poupée,',
    paragraphs: [
      `Si tu tiens cette lettre entre tes mains, c’est que le voyage a commencé. Tu m’avais demandé deux lettres d’amour, mais je voulais t’offrir bien plus que de simples mots sur du papier.`,
      `Je voulais que tu puisses revivre notre chemin, sentir chaque émotion et découvrir ce qui a grandi dans mon cœur depuis ce fameux premier jour à l’université.`,
      `Tout au long de cette aventure, chaque énigme, chaque lieu et chaque secret a été préparé avec tendresse pour toi. Il n’y a aucun chrono à battre, rien à prouver à personne : avance à ton rythme, ma poupée, et laisse-toi guider.`,
      `Au bout de ce chemin, je serai là pour t’attendre. Et j’ai tant de choses à te raconter.`,
    ],
    closing: 'Prête à franchir le seuil de notre histoire ?',
    continueButton: 'Découvrir la suite ✨',
  },
  cupidonDialogue: {
    intro1: {
      speaker: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      avatar: '👼',
      text: 'Bonjour mademoiselle ! Je suis Cupidon le stagiaire, responsable officiel de cette mission sentimentale ! J’ai un diplôme en amour, un master en bisous et… attends…',
    },
    intro2: {
      speaker: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      avatar: '👼',
      text: '(Il fouille frénétiquement dans sa sacoche ailée) Mince. J’ai oublié le dossier officiel ! Bon, pas de panique, on va improviser avec élégance !',
    },
    mapPresentation: {
      speaker: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      avatar: '👼',
      text: 'Mais j’ai quand même réussi à sauver la carte de votre voyage romantique ! Regarde un peu les étapes qui t’attendent pour retrouver Dylan…',
    },
    puzzlePrompt: {
      speaker: 'Cupidon le stagiaire',
      title: 'Guide officiel (en période d’essai)',
      avatar: '👼',
      text: 'Avant de pouvoir ouvrir la première porte vers l’Université, Dylan m’a confié une petite formule secrète : le Code du Cœur ! C’est pour vérifier que c’est bien toi… Prête à relever le défi ?',
    },
  },
  mapLocations: [
    {
      id: 'loc-universite',
      name: 'L’Université',
      subtitle: 'Chapitre 1 & 2',
      status: 'accessible',
      icon: '🏛️',
      description: 'Là où tout a commencé : les regards timides dans la salle de classe, les premiers mots et le laboratoire des sentiments.',
    },
    {
      id: 'loc-jardin',
      name: 'Le Jardin Enchanté',
      subtitle: 'Chapitre 3',
      status: 'locked',
      icon: '🌸',
      description: 'Une chasse aux fragments de phrase lumineuse (« TU ES MON PLUS BEAU HASARD ») au milieu des lucioles.',
    },
    {
      id: 'loc-pont',
      name: 'Le Pont des Étoiles',
      subtitle: 'Chapitre 4',
      status: 'locked',
      icon: '✨',
      description: 'L’ascension sous les étoiles, les trois épreuves de la confiance et la découverte de la seconde lettre.',
    },
    {
      id: 'loc-retrouvailles',
      name: 'La Clairière & La Promesse',
      subtitle: 'Chapitre 5 & Épilogue',
      status: 'locked',
      icon: '💖',
      description: 'Le lieu secret où Dylan t’attend en personne pour te remettre sa promesse pour la vie.',
    },
  ] as MapLocation[],
  puzzleId: 'puzzle-heart-code',
  transition: {
    congrats: 'Le Code du Cœur a fonctionné ! ✨',
    message: 'Le portail des souvenirs s’ouvre doucement devant toi… Direction l’Université !',
    buttonText: 'Entrer dans l’Université 🏛️',
  },
};
