import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Landmark, Flower2, Star, Lock, X } from "lucide-react";
import bg from "@/assets/bg.jpg";
import c1 from "@/assets/c1.jpg";
import c2 from "@/assets/c2.jpg";
import c3 from "@/assets/c3.jpg";
import c4 from "@/assets/c4.jpg";
import cupid from "@/assets/cupid.png";
import { LocationCard, type Location } from "@/components/journey/LocationCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Carte du Voyage – Notre Histoire d'Amour" },
      { name: "description", content: "Chaque lieu abrite un chapitre de vos souvenirs et de votre promesse." },
      { property: "og:title", content: "Carte du Voyage – Notre Histoire d'Amour" },
      { property: "og:description", content: "Chaque lieu abrite un chapitre de vos souvenirs et de votre promesse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JourneyMap,
});

// Code du Cœur à personnaliser
const HEART_CODE = "AMOUR";
const STORAGE_KEY = "journey-progress";

const LOCATIONS: Location[] = [
  { id: 1, title: "L'Université", chapter: "Chapitre 1 & 2", image: c1, icon: <Landmark className="h-6 w-6" />,
    description: <>Là où tout a commencé : les regards timides dans la salle de classe, les premiers mots et le laboratoire des sentiments.</> },
  { id: 2, title: "Le Jardin Enchanté", chapter: "Chapitre 3", image: c2, icon: <Flower2 className="h-6 w-6" />,
    description: <>Une chasse aux fragments de phrase lumineuse (« TU ES MON PLUS BEAU HASARD ») au milieu des lucioles.</> },
  { id: 3, title: "Le Pont des Étoiles", chapter: "Chapitre 4", image: c3, icon: <Star className="h-6 w-6 fill-current" />,
    description: <>L'ascension sous les étoiles, les trois épreuves de la confiance et la découverte de la seconde lettre.</> },
  { id: 4, title: "La Clairière & La Promesse", chapter: "Chapitre 5 & Épilogue", image: c4, icon: <Heart className="h-6 w-6 fill-current" />,
    description: <>Le lieu secret où Dylan t'attend en personne pour te remettre sa promesse pour la vie.</> },
];

const INTRO = "Dylan a scellé le portail de l'Université avec un cadenas magique ! Résous le Code du Cœur pour ouvrir la route.";

function JourneyMap() {
  // progress = number of unlocked locations (1 = only the University visible as accessible)
  const [progress, setProgress] = useState(1);
  const [codeSolved, setCodeSolved] = useState(false);
  const [message, setMessage] = useState(INTRO);
  const [selected, setSelected] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const p = JSON.parse(saved);
      setProgress(p.progress ?? 1);
      setCodeSolved(!!p.codeSolved);
    }
  }, []);

  const save = (p: number, solved: boolean) => {
    setProgress(p);
    setCodeSolved(solved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress: p, codeSolved: solved }));
  };

  const select = (loc: Location) => {
    setSelected(loc.id);
    if (loc.id > progress) {
      setMessage(`${loc.title} est encore verrouillé… Termine d'abord les chapitres précédents !`);
    } else if (loc.id === 1 && !codeSolved) {
      setMessage(INTRO);
    } else {
      setMessage(`${loc.title} — ${loc.chapter}. Le chemin est ouvert, ton aventure continue !`);
    }
  };

  return (
    <main
      className="relative min-h-dvh overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/30 via-night/40 to-night/60" />
      {[...Array(14)].map((_, i) => (
        <span
          key={i}
          className="twinkle pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-gold-soft"
          style={{ top: `${(i * 37) % 60 + 3}%`, left: `${(i * 53) % 95 + 2}%`, animationDelay: `${(i % 5) * 0.6}s` }}
        />
      ))}

      <div className="relative mx-auto flex min-h-dvh max-w-7xl flex-col px-3 py-4 sm:px-4 md:px-8">
        {/* top bar */}
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start sm:flex sm:justify-between">
          <button
            type="button"
            onClick={() => history.back()}
            aria-label="Retour"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-night/80 text-gold-soft transition active:scale-95 sm:h-12 sm:w-12 sm:hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <div className="hidden rotate-[-6deg] rounded-sm bg-parchment px-4 py-3 text-center font-hand text-lg leading-tight text-ink shadow-lg md:block">
            <Heart className="mx-auto mb-1 h-4 w-4 fill-rose text-rose" />
            Ton aventure
            <br />
            commence ici…
          </div>
        </div>

        {/* header */}
        <header className="-mt-8 flex flex-col items-center sm:-mt-10 md:-mt-14">
          <span className="z-10 rounded-full border-2 border-gold bg-night px-4 py-1.5 font-display text-xs tracking-[0.2em] text-gold-soft sm:px-6 sm:text-base md:text-lg">
            ♥ CARTE DU VOYAGE ♥
          </span>
          <div className="-mt-3 rounded-[3rem] border-2 border-gold/70 bg-night/85 px-4 pb-4 pt-5 text-center sm:px-8 md:px-16">
            <h1 className="glow-text font-script text-[2.5rem] font-bold leading-tight sm:text-6xl md:text-7xl">
              Notre Histoire d'Amour
            </h1>
            <p className="mt-1 text-sm leading-snug text-foreground sm:text-base md:text-lg">
              Chaque lieu abrite un chapitre de vos souvenirs et de votre promesse.
            </p>
          </div>
        </header>

        {/* cards */}
        <section className="scrollbar-hide mt-5 -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-4 sm:-mx-4 sm:gap-4 sm:px-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4 lg:gap-6">
          {LOCATIONS.map((loc) => (
            <LocationCard
              key={loc.id}
              loc={loc}
              unlocked={loc.id <= progress}
              selected={selected === loc.id}
              onSelect={() => select(loc)}
            />
          ))}
        </section>

        {/* bottom */}
        <section className="mt-3 grid items-center gap-5 md:grid-cols-[1.2fr_1fr] md:gap-6">
          <div className="relative flex items-center gap-3 rounded-[2rem] bg-parchment px-3 py-4 text-ink shadow-xl sm:px-4 md:pl-2">
            <img src={cupid} alt="Cupidon" width={816} height={816} className="h-20 w-20 shrink-0 sm:h-24 sm:w-24 md:h-32 md:w-32" />
            <div className="min-w-0">
              <p className="font-script text-xl font-bold sm:text-2xl">Cupidon :</p>
              <p className="font-hand text-lg leading-snug sm:text-xl">{message}</p>
            </div>
            <Heart className="absolute bottom-3 right-4 h-5 w-5 text-ink" />
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              disabled={codeSolved && progress >= LOCATIONS.length}
              className="btn-gold flex items-center justify-center gap-3 rounded-full px-5 py-3 text-center font-display text-base font-semibold transition active:scale-95 disabled:opacity-60 sm:gap-4 sm:px-8 sm:py-4 sm:text-lg sm:hover:scale-105 md:text-2xl"
            >
              <Lock className="h-5 w-5 shrink-0 sm:h-7 sm:w-7" />
              {codeSolved ? "Continuer le voyage" : "Résoudre le Code du Cœur"}
              <ArrowRight className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
            </button>
            <p className="rotate-[-8deg] font-hand text-base text-foreground sm:text-lg">Parce que chaque étape nous rapproche… ♡</p>
          </div>
        </section>
      </div>

      {open && (
        <HeartCodeDialog
          solved={codeSolved}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            if (!codeSolved) {
              save(Math.max(progress, 2), true);
              setMessage("Bravo ! Le cadenas s'est ouvert. Le Jardin Enchanté t'attend désormais…");
            } else {
              const next = Math.min(progress + 1, LOCATIONS.length);
              save(next, true);
              setMessage(`${LOCATIONS[next - 1]?.title} est maintenant accessible !`);
            }
            setOpen(false);
          }}
        />
      )}
    </main>
  );
}

function HeartCodeDialog({ solved, onClose, onSuccess }: { solved: boolean; onClose: () => void; onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 p-4" onClick={onClose}>
      <div
        className="aura relative w-full max-w-md rounded-3xl bg-parchment p-5 text-center text-ink sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Fermer" className="absolute right-3 top-3 sm:right-4 sm:top-4"><X className="h-5 w-5" /></button>
        <Heart className="mx-auto h-10 w-10 fill-rose text-rose" />
        <h2 className="mt-2 font-script text-2xl font-bold sm:text-3xl">Le Code du Cœur</h2>
        {solved ? (
          <>
            <p className="mt-2">Le cadenas est déjà ouvert. Termine ce chapitre pour débloquer le lieu suivant.</p>
            <button onClick={onSuccess} className="btn-gold mt-5 rounded-full px-6 py-2 font-display">Chapitre terminé</button>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (value.trim().toUpperCase() === HEART_CODE) onSuccess();
              else setError(true);
            }}
          >
            <p className="mt-2">Entre le mot secret pour briser le cadenas magique.</p>
            <input
              autoFocus
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              className="mt-4 w-full rounded-xl border-2 border-gold bg-card px-4 py-2 text-center font-display text-xl tracking-widest outline-none"
              placeholder="• • • • •"
            />
            {error && <p className="mt-2 text-sm text-destructive">Ce n'est pas le bon code… réessaie ♡</p>}
            <button type="submit" className="btn-gold mt-5 rounded-full px-6 py-2 font-display">Ouvrir le cadenas</button>
          </form>
        )}
      </div>
    </div>
  );
}
