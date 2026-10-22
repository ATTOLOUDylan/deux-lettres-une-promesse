import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Home, ChevronsRight, Heart } from "lucide-react";
import bg from "@/assets/terrace-bg.jpg";
import cupid from "@/assets/cupid.png";
import heroine from "@/assets/heroine.png";
import { CHAPTER0_TITLE, CUPID_INTRO, NEXT_STEP_ROUTE } from "@/game/chapter0";

const CHAR_MS = 32;

function useTypewriter(text: string) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, CHAR_MS);
    return () => window.clearInterval(id);
  }, [text]);
  const done = count >= text.length;
  return { shown: Array.from(text).slice(0, count).join(""), done, finish: () => setCount(text.length) };
}

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i * 1.7) % 12,
  dur: 10 + ((i * 3) % 8),
  size: 8 + ((i * 5) % 10),
}));
const STARS = Array.from({ length: 30 }, (_, i) => ({
  left: (i * 53) % 100,
  top: (i * 29) % 40,
  delay: (i * 0.37) % 3,
}));

export function CupidScene() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const line = CUPID_INTRO[index] ?? CUPID_INTRO[0]!;
  const isLast = index === CUPID_INTRO.length - 1;
  const { shown, done, finish } = useTypewriter(Array.from(line.text).join(""));
  const lock = useRef(0);

  const goNext = useCallback(() => navigate({ to: NEXT_STEP_ROUTE }), [navigate]);

  const advance = useCallback(() => {
    const now = Date.now();
    if (now - lock.current < 250) return; // anti double-click
    lock.current = now;
    if (!done) return finish();
    if (isLast) return goNext();
    setIndex((i) => i + 1);
  }, [done, finish, isLast, goNext]);

  const cupidAnim = line.mood === "rummage" ? "anim-rummage" : "anim-float";

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-night font-script text-warm-white">
      <img src={bg} alt="" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-night/30" />

      {/* stars & petals */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span key={i} className="anim-twinkle absolute h-1 w-1 rounded-full bg-warm-white"
            style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }} />
        ))}
        {PETALS.map((p, i) => (
          <span key={i} className="anim-petal absolute -top-8 rounded-[60%_0_60%_0] bg-primary/0"
            style={{ left: `${p.left + 20}%`, width: p.size, height: p.size, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, background: "oklch(0.8 0.12 350 / 0.85)" }} />
        ))}
        <span className="anim-flicker absolute left-[4%] top-[42%] h-40 w-40 rounded-full bg-gold/30 blur-3xl" />
        <span className="anim-flicker absolute right-[4%] top-[42%] h-40 w-40 rounded-full bg-gold/30 blur-3xl" style={{ animationDelay: "1s" }} />
      </div>

      {/* top bar */}
      <header className="relative z-20 flex items-start justify-between gap-2 p-3 sm:p-6">
        <Link to="/" aria-label="Retour au menu principal"
          className="gold-frame grid h-12 w-12 shrink-0 place-items-center rounded-full transition hover:scale-105 sm:h-14 sm:w-14">
          <Home className="h-6 w-6" />
        </Link>
        <h1 className="gold-frame relative mx-auto rounded-[2rem] px-6 py-2 text-center font-display text-base leading-snug sm:px-12 sm:py-3 sm:text-2xl">
          <Heart aria-hidden className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 fill-gold text-gold" />
          <span className="block">{CHAPTER0_TITLE[0]}</span>
          <span className="block">{CHAPTER0_TITLE[1]}</span>
          <Heart aria-hidden className="absolute -bottom-3 left-1/2 h-4 w-4 -translate-x-1/2 fill-gold text-gold" />
        </h1>
        <button onClick={goNext}
          className="gold-frame flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-sm transition hover:scale-105 sm:px-5 sm:text-lg">
          Passer <ChevronsRight className="h-4 w-4" />
        </button>
      </header>

      {/* characters */}
      <div key={`${index}-${line.mood}`}
        className={`${cupidAnim} absolute left-[2%] top-[16%] z-10 w-[45vw] max-w-[380px] sm:left-[5%] sm:top-[14%] sm:w-[30vw]`}>
        <img src={cupid} alt="Cupidon, petit ange blond avec son arc doré" width={1024} height={1024}
          className="anim-rise drop-shadow-[0_0_25px_oklch(0.89_0.12_85/0.5)]" />
      </div>
      <img src={heroine} alt="La joueuse, de dos, regarde Cupidon" width={896} height={1280} loading="lazy"
        className="anim-rise absolute -right-[6%] bottom-0 z-10 w-[48vw] max-w-[520px] sm:right-[2%] sm:w-[32vw]"
        style={{ animationDelay: ".3s" }} />

      {/* dialogue */}
      <section className="absolute inset-x-3 bottom-24 z-20 sm:bottom-10 sm:left-[14%] sm:right-auto sm:w-[52vw] sm:max-w-[760px]">
        <div className="gold-frame relative z-10 ml-4 inline-block rounded-xl px-6 py-1 font-display text-lg sm:text-2xl">
          {line.speaker}
        </div>
        <button key={index} onClick={advance} aria-live="polite"
          aria-label={done ? "Réplique suivante" : "Afficher toute la réplique"}
          className="parchment anim-rise -mt-2 block min-h-40 w-full rounded-3xl p-5 pt-6 text-left text-lg leading-relaxed sm:min-h-48 sm:p-8 sm:text-2xl">
          {line.action && <em className="mb-2 block text-base opacity-70 sm:text-lg">{line.action}</em>}
          <span>{shown}</span>
          {done && <Heart aria-hidden className="ml-2 inline h-5 w-5 animate-pulse text-ink" />}
        </button>
      </section>

      <button onClick={advance}
        className="gold-frame absolute bottom-6 right-4 z-30 flex items-center gap-2 rounded-2xl px-8 py-3 text-xl transition hover:scale-105 active:scale-95 sm:bottom-12 sm:right-[8%] sm:text-2xl">
        Continuer <ChevronsRight className="h-5 w-5" />
      </button>
    </main>
  );
}
