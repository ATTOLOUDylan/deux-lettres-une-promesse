import { useCallback, useEffect, useRef, useState } from "react";
import bg from "./chapitre0-bg.jpg";
import "./chapitre0.css";

type Phase = "idle" | "seal" | "flap" | "letter" | "done";

export interface EnveloppeMysterieuseProps {
  /** Appelé par le bouton « Continuer » de la lettre : branche ici l'étape suivante. */
  onOpened?: () => void;
  /** Appelé par le bouton « Retour au menu » : branche ici ta navigation existante. */
  onBack?: () => void;
  /** Titre de la lettre. */
  letterTitle?: string;
  /** Contenu de la lettre (paragraphes). */
  letterBody?: string[];
  /** Signature de la lettre. */
  letterSignature?: string;
}

const TIMINGS = { seal: 350, flap: 550, letter: 700 };
const REDUCED = { seal: 80, flap: 120, letter: 200 };

const DEFAULT_BODY = [
  "Si tu lis ces mots, c’est que le sceau a cédé sous tes doigts.",
  "Une aventure t’attend, faite d’énigmes, de souvenirs et de petites surprises semées rien que pour toi.",
  "Suis les indices, garde ton cœur ouvert… et laisse-toi guider jusqu’au dernier chapitre.",
];

export function EnveloppeMysterieuse({
  onOpened,
  onBack,
  letterTitle = "Mon amour,",
  letterBody = DEFAULT_BODY,
  letterSignature = "— Avec tout mon cœur",
}: EnveloppeMysterieuseProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const lock = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = useCallback(() => {
    if (lock.current) return;
    lock.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = reduced ? REDUCED : TIMINGS;
    setPhase("seal");
    timers.current.push(
      window.setTimeout(() => setPhase("flap"), t.seal),
      window.setTimeout(() => setPhase("letter"), t.seal + t.flap),
      window.setTimeout(() => setPhase("done"), t.seal + t.flap + t.letter + 250),
    );
  }, []);

  const sparkles = Array.from({ length: 14 });
  const burst = Array.from({ length: 16 });

  return (
    <section className="c0-scene" style={{ backgroundImage: `url(${bg})` }}>
      <div className="c0-vignette" aria-hidden />
      <div className="c0-particles" aria-hidden>
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 0.7) % 9}s`, animationDuration: `${8 + (i % 6)}s` }} />
        ))}
      </div>

      <header className="c0-medallion">
        <span className="c0-medallion-heart" aria-hidden>❤</span>
        <h1>
          <span>Chapitre 0 —</span>
          <span className="c0-medallion-title">L’Invitation Mystérieuse</span>
        </h1>
        <span className="c0-medallion-orn c0-left" aria-hidden>❦</span>
        <span className="c0-medallion-orn c0-right" aria-hidden>❦</span>
      </header>

      <div className="c0-stage">
        <button
          type="button"
          className={`c0-envelope c0-phase-${phase}`}
          onClick={open}
          disabled={phase !== "idle"}
          aria-label="Ouvrir l’enveloppe en brisant le sceau"
        >
          <span className="c0-halo" aria-hidden />
          <span className="c0-back" aria-hidden />
          <span className="c0-letter" aria-hidden>
            <span className="c0-letter-line" />
            <span className="c0-letter-line" />
            <span className="c0-letter-line short" />
          </span>
          <span className="c0-front" aria-hidden>
            <span className="c0-corner tl">❧</span>
            <span className="c0-corner tr">❧</span>
            <span className="c0-corner bl">❧</span>
            <span className="c0-corner br">❧</span>
          </span>
          <span className="c0-flap" aria-hidden />
          <span className="c0-seal" aria-hidden>
            <span className="c0-seal-heart">❤</span>
          </span>
          <span className="c0-burst" aria-hidden>
            {burst.map((_, i) => (
              <span key={i} style={{ ["--a" as string]: `${(360 / burst.length) * i}deg` }} />
            ))}
          </span>
          <span className="c0-sparkles" aria-hidden>
            {sparkles.map((_, i) => (
              <span key={i} style={{ left: `${(i * 53) % 100}%`, top: `${(i * 29) % 100}%`, animationDelay: `${(i * 0.4) % 3}s` }} />
            ))}
          </span>
        </button>

        <p className={`c0-hint ${phase !== "idle" ? "c0-hide" : ""}`}>
          Touche l’enveloppe pour briser le sceau ✨
        </p>
      </div>

      {phase === "done" && (
        <article className="c0-reading" role="dialog" aria-label={letterTitle}>
          <h2 className="c0-reading-title">{letterTitle}</h2>
          {letterBody.map((p, i) => (
            <p key={i} style={{ animationDelay: `${0.3 + i * 0.25}s` }}>{p}</p>
          ))}
          <p className="c0-reading-sign">{letterSignature}</p>
          <button type="button" className="c0-continue" onClick={onOpened}>
            Continuer <span aria-hidden>→</span>
          </button>
        </article>
      )}

      <button type="button" className="c0-back-btn" onClick={onBack}>
        <span aria-hidden>←</span> Retour au menu
      </button>
    </section>
  );
}

export default EnveloppeMysterieuse;
