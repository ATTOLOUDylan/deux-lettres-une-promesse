// ⚠️ Remplace les textes par tes vraies lettres, et dépose tes enregistrements dans
// public/assets/audio/letters/lettre-1.mp3 et lettre-2.mp3
import { asset } from '../assets';

export interface Letter {
  id: string;
  tabLabel: string;
  title: string;
  paragraphs: string[];
  audio: string;
}

export const letters: Letter[] = [
  {
    id: 'lettre-1',
    tabLabel: 'Lettre 1',
    title: 'Lettre 1 — Ce que tu as éveillé en moi ❤️',
    paragraphs: [
      'Ma poupée,',
      'Tu veux savoir quand j’ai compris que tu étais devenue si importante pour moi ?',
      'Je pourrais te parler de ce que je ressens aujourd’hui, mais je préfère te ramener au début de notre histoire, là où tout a commencé, sans que je sache encore ce qui m’attendait.',
      'Je me rappelle encore la première fois que je t’ai vue à l’université. J’ai ressenti une sensation bizarre, quelque chose qui a attiré mon attention sur toi. Au début, j’étais simplement curieux. J’ai commencé à t’observer un peu, à vouloir te connaître davantage, puis j’ai découvert une fille assez différente des autres que j’avais rencontrées.',
      'Tu sais, cette sensation, je ne la ressentais habituellement qu’avec certains garçons, ceux avec qui je pouvais imaginer une amitié très proche, une vraie compatibilité. Mais toi, tu étais la première fille à me faire ressentir ça. Alors, naturellement, j’ai voulu me rapprocher de toi pour devenir ton ami.',
      'Et là, si tu savais tous les scénarios que j’ai imaginés pour venir te parler ! 😂 J’avais préparé plein de plans dans ma tête, mais au moment de passer à l’action, le courage me manquait toujours.',
      'Jusqu’à ce fameux jour où nous nous sommes retrouvés seuls dans la salle. Je me suis dit : *« C’est maintenant ou jamais ! »*',
      'Ma poupée, ce jour-là, j’ai utilisé une quantité de courage que je ne savais même pas posséder. 🤣 J’étais tellement stressé ! Mais finalement, tout s’est bien passé, et aujourd’hui, je suis vraiment heureux d’avoir osé t’aborder.',
      'Parce qu’avec le temps, je t’ai découverte davantage. Tu étais amusante, abordable et surtout, tu étais la seule fille avec laquelle je me sentais aussi à l’aise. 🤧 Nous nous sommes rapprochés, nous avons partagé des moments, des cadeaux, des rires… jusqu’à ce que cette fameuse rumeur commence à circuler à l’université : celle qui disait que nous étions ensemble.',
      'Au début, je défendais l’idée que c’était faux. Mais honnêtement, cette rumeur ne me déplaisait pas tant que ça. Et à force de l’entendre, je crois que j’ai commencé à apprécier un peu trop cette idée. 😂',
      'Sans même m’en rendre compte, je développais des sentiments pour toi. Mes amis essayaient de me le faire comprendre, mais je refusais de l’admettre. J’avais peur de tomber amoureux, alors j’ai essayé de faire disparaître ce sentiment. Je pensais même prendre mes distances pour éviter de tout compliquer entre nous.',
      'Mais c’est justement à ce moment-là que tu m’as envoyé ce fameux message : **« Est-ce que tu es amoureux de moi ? »**',
      'Ma poupée, ce message a provoqué un véritable bug dans ma tête. 😂 Je ne savais plus quoi penser, j’étais complètement embrouillé. Puis, quelque chose en moi m’a dit : *« C’est peut-être ta chance. Ne la laisse pas passer. »*',
      'J’avais peur de t’avouer mes sentiments et de te perdre comme amie si les choses tournaient mal. Mais le courage que j’avais trouvé le jour de notre première conversation est revenu. Alors, je t’ai avoué ce que je ressentais.',
      'Tu avais d’abord refusé, puis tu as accepté de me donner une chance. Même si tu appelais ça un « faux couple », pour moi, c’était déjà une chance précieuse. À cette époque, je savais que quelque chose se passait dans mon cœur, mais je n\'avais pas encore totalement accepté que j\'étais amoureux de toi.',
      'Puis, au fil du temps, tu m\'as montré de nouvelles facettes de toi. Et chaque jour, je tombais un peu plus amoureux.',
      'Jusqu\'à ce fameux jour où tu m\'as dit qu\'au début, tu n\'étais pas amoureuse de moi, mais que maintenant, tu m\'aimais.',
      '**Ma poupée, si tu savais la joie que j\'ai ressentie à cet instant !** J\'ai passé la journée à repenser à tes paroles. Je me suis rappelé tout ce que mes amis me disaient depuis le début, et c\'est comme si mon cœur avait enfin accepté ce que j\'essayais de lui cacher depuis tout ce temps.',
      'Je ne pouvais plus nier mes sentiments. J\'étais réellement amoureux de toi, et je voulais désormais être avec toi pour de vrai.',
      'Je savais que tu avais des inquiétudes concernant notre différence de religion, puisque tu es musulmane et que je suis chrétien. Tu pensais que nous ne pourrions peut-être pas construire une relation ensemble. Mais moi, je refusais d\'abandonner cette idée. Je savais que de tels couples existaient et je voulais croire en notre histoire.',
      'Alors, je me suis donné un objectif : te montrer à quel point je t\'aimais, te donner des raisons de croire en nous et espérer qu\'un jour, ton amour pour moi serait aussi fort que le mien pour toi. Et visiblement, mes efforts ont fini par payer ! 🤣❤️',
      'Puis est arrivé ce jour où tu m\'as appelé pour me proposer qu\'on se mette officiellement en couple.',
      '**J\'avais l\'impression de rêver !** Tu ne peux pas imaginer à quel point j\'étais heureux. Après toutes mes hésitations, mes peurs, mes plans ratés et le courage que j\'avais dû rassembler, j\'allais enfin pouvoir vivre pleinement cette histoire avec toi.',
      'Quand je repense à tout cela, je réalise que notre histoire n\'a pas commencé par une grande déclaration d\'amour. Elle a commencé par une sensation étrange, une curiosité, une amitié, des rires, une rumeur et un garçon qui avait peur d\'avouer ce que son cœur ressentait déjà. 😂',
      'Et aujourd\'hui, ce garçon est heureux de ne pas avoir laissé sa peur décider à sa place.',
      'Mais il y a quelque chose d\'autre que je veux que tu saches.',
      'Au-delà de tous ces souvenirs, tu es devenue une personne qui compte énormément pour moi. Tu me donnes envie d\'avancer, de poursuivre mes rêves, de réussir et de croire davantage en moi. Quand je doute, ton soutien m\'aide à continuer. Quand je me décourage, tu me rappelles que je peux aller plus loin.',
      'Tu ne peux pas imaginer à quel point cela compte pour moi. Je ne veux pas seulement être heureux avec toi ; je veux aussi devenir un homme dont tu seras fière, tout comme je veux être là pour croire en toi et t\'encourager dans tes propres rêves.',
      '**Je veux que nous soyons deux personnes qui s\'aiment, se soutiennent et grandissent ensemble.**',
      'Alors, si tu me demandes quand j\'ai compris que je t\'aimais, je ne pourrais pas te donner une date exacte. Je crois que je suis tombé amoureux de toi petit à petit, à travers chaque souvenir, chaque sourire, chaque conversation et chaque émotion que nous avons partagée.',
      'Et si je devais recommencer cette histoire, malgré le stress de notre première conversation, les hésitations et toutes mes peurs, je crois que je trouverais encore le courage de venir te parler.',
      'Parce que ce jour-là, sans le savoir, je faisais le premier pas vers une personne qui allait devenir si précieuse à mes yeux.',
      '**Je t\'aime, ma poupée. Et je suis infiniment heureux que ce fameux jour à l\'université, j\'aie finalement trouvé le courage de venir vers toi.** ❤️',
      'Et ce n\'est que le début de tout ce que j\'ai encore envie de vivre avec toi…',
    ],
    audio: asset('audio/letters/lettre-1.mp3'),
  },
  {
    id: 'lettre-2',
    tabLabel: 'Lettre 2',
    title: 'Lettre 2 — Le futur que je veux construire avec toi ❤️',
    paragraphs: [
      'Ma poupée,',
      'Quand je pense à mon avenir, je ne pense plus seulement à mes rêves et à tout ce que je veux accomplir pour moi-même. Je pense aussi à nous, à tout ce dont nous avons parlé et à cette vie que nous voulons construire ensemble.',
      'Tu sais déjà ce que je souhaite : devenir un homme capable de réaliser ses projets, de prendre ses responsabilités et de construire un foyer avec la femme qu\'il aime. Et cette femme, c\'est toi.',
      'Je sais que notre chemin ne sera peut-être pas aussi simple que celui d\'autres couples. Je sais que convaincre ta famille demandera du temps, des efforts et surtout que je leur montre, par mes actes, que je suis sérieux dans mes intentions. Mais je ne veux pas me décourager avant même d\'avoir essayé. Je veux travailler, progresser et devenir quelqu\'un capable de défendre notre projet de vie avec maturité et responsabilité.',
      'Et si je veux autant réussir, c\'est aussi parce que tu me donnes envie d\'avancer. Ton soutien me rappelle que mes rêves méritent que je me batte pour eux. Tu me donnes envie de croire en mes capacités et de ne pas abandonner lorsque les choses deviennent difficiles.',
      'Je veux que tu sois fière de l\'homme que je deviens, ma poupée. Et je veux aussi être celui qui te soutiendra dans tes propres projets, celui qui croira en toi et qui t\'aidera à avancer sans jamais te demander de renoncer à ce qui compte pour toi.',
      '**Nous avons déjà parlé de notre avenir et de ce que nous voulons l\'un pour l\'autre. Maintenant, je veux travailler pour que nos actes soient à la hauteur de nos paroles.**',
      'Je ne prétends pas que tout sera facile, mais je veux faire ma part, apprendre, grandir et me préparer sérieusement à la vie que nous voulons partager.',
      'Parce que tu n\'es pas simplement une personne que j\'imagine dans mon avenir. Tu es la femme avec qui je veux le construire.',
      'Et lorsque je pense au jour où je pourrai enfin t\'appeler ma femme, je ne pense pas seulement à ce moment-là. Je pense à tout le chemin que nous aurons parcouru pour y arriver, à nos efforts, à nos sacrifices, à nos réussites et à cette fierté que nous ressentirons en sachant que nous n\'avons pas abandonné notre projet au premier obstacle.',
      '**Je t\'aime, ma poupée. Et je veux avancer aujourd\'hui pour être prêt à construire demain, avec toi, notre foyer.** ❤️',
    ],
    audio: asset('audio/letters/lettre-2.mp3'),
  },
  {
    id: 'promesse',
    tabLabel: 'La Promesse',
    title: 'Ma promesse pour toi, ma poupée ❤️',
    paragraphs: [
      'Ma poupée,',
      'Après t\'avoir raconté comment tu as pris une place dans mon cœur et comment j\'imagine notre avenir, il me reste une chose importante à te dire : la promesse que je veux te faire.',
      'Je ne peux pas te promettre une vie sans difficultés, ni te dire que je serai toujours parfait. Je suis encore en train d\'apprendre, de grandir et de devenir l\'homme que je souhaite être. Mais je peux te promettre de ne pas considérer que je sais déjà tout, et de continuer à faire des efforts pour moi, pour toi et pour la vie que nous voulons construire ensemble.',
      'Tu as cru en moi, tu m\'as soutenu et tu m\'as donné envie d\'aller plus loin, même dans les moments où je doutais de mes capacités. Alors, je veux être capable de t\'offrir ce même soutien. Je veux croire en toi, encourager tes rêves, être fier de tes réussites et te rappeler ta valeur lorsque tu l\'oublieras.',
      'Je veux que nous puissions grandir ensemble, nous aider à avancer et nous réjouir des victoires de l\'autre comme si elles étaient aussi les nôtres.',
      'Je te promets de faire de mon mieux pour que mes actes soient à la hauteur de mes paroles. De t\'écouter, de te respecter, de reconnaître mes erreurs et de ne jamais cesser d\'apprendre à mieux t\'aimer. Je veux prendre soin de notre relation, même lorsque la vie nous demandera davantage de patience et de courage.',
      'Je sais aussi que notre chemin vers le mariage demandera des efforts. Je veux travailler sérieusement pour réaliser mes projets, prendre mes responsabilités et montrer, par la personne que je deviens, que mon amour pour toi est sincère et que notre avenir est quelque chose que je prends au sérieux.',
      'Je ne veux pas seulement te dire que je veux devenir ton mari. **Je veux travailler chaque jour pour devenir un homme avec qui tu pourras construire un foyer, poursuivre tes rêves et te sentir aimée et respectée.**',
      'Et si Dieu nous le permet, j\'attends avec impatience ce jour où je pourrai prendre ta main, te regarder dans les yeux et t\'appeler enfin *ma femme*.',
      'Quand je pense à ce jour, je pense aussi à tout ce que nous aurons traversé pour y arriver. À notre rencontre à l\'université, à nos premiers moments, à nos hésitations, à nos rires et à tous ces souvenirs qui ont fait de nous ce que nous sommes aujourd\'hui.',
      'Je me dis que ce garçon qui avait presque peur de venir te parler ne pouvait pas imaginer qu\'un jour, il écrirait une promesse à celle qu\'il souhaite épouser. 😂❤️',
      'Ma poupée, je ne sais pas exactement à quoi ressemblera chaque étape de notre avenir, mais je sais ce que je veux y apporter : mon amour, mes efforts, ma sincérité et la volonté de continuer à avancer avec toi.',
      '**Ma promesse n\'est pas de ne jamais tomber, mais de continuer à grandir. Pas de tout réussir immédiatement, mais de travailler pour nos rêves. Pas de te promettre des mots parfaits, mais de faire de mon mieux pour que tu puisses voir mon amour dans mes actes.**',
      'Et surtout, je te promets de ne jamais oublier que derrière tous mes projets, mes ambitions et mes rêves de réussite, il y a aussi cette belle vie que je souhaite construire avec toi.',
      'Tu as pris une place dans mon cœur sans que je sache vraiment comment cela arriverait. Aujourd\'hui, je sais que je veux te donner une place dans mon avenir, dans mes projets et dans la famille que nous souhaitons construire.',
      'Je t\'aime profondément, ma poupée.',
      '**Aujourd\'hui, je suis ton amoureux. Demain, si Dieu nous le permet, je serai ton mari. Et à chaque étape de ce chemin, je veux continuer à être celui qui croit en toi, qui te soutient et qui avance à tes côtés.**',
      'À toi, ma poupée, ma future femme et celle avec qui je veux écrire les plus beaux chapitres de notre histoire. ❤️',
    ],
    audio: asset('audio/letters/promesse.mp3'),
  },
];
