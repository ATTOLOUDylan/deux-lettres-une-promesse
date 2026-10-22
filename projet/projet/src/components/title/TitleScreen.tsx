import { useEffect, useState } from "react";
import bg from "@/assets/title-bg.jpg";
import { INTRO_MD, NAMES, TITLE, TAGLINE } from "@/content/intro";
import { MiniMarkdown } from "@/lib/mini-markdown";
import {
  type Progress,
  TOTAL_LETTERS,
  bonusUnlocked,
  emptyProgress,
  hasProgress,
  lettersCount,
  loadProgress,
  primaryState,
  resetProgress,
  saveProgress,
} from "@/lib/progress";

// Screens of the game. `available: false` until the real screen exists — never link to a fake one.
const SCREENS = {
  chapter0: { available: false },
  chapter1: { available: false },
  chapter5: { available: false },
  epilogue: { available: false },
  letters: { available: false },
  finale: { available: false },
} as const;

const PRIMARY = {
  start: { icon: "❤️", label: "Commencer notre histoire" },
  university: { icon: "🏛️", label: "Entrer dans l’Université (Chapitre 1)" },
  continue: { icon: "❤️", label: "Continuer notre histoire" },
};

function Sparkles() {
  return (
    <div className="sparkles" aria-hidden>
      {Array.from({ length: 24 }).map((_, i) => (
        <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 0.7) % 9}s`, animationDuration: `${8 + (i % 5)}s` }} />
      ))}
    </div>
  );
}

export function TitleScreen() {
  const [p, setP] = useState<Progress>(emptyProgress());
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setP(loadProgress());
    sync();
    window.addEventListener("progress-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("progress-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const state = primaryState(p);
  const showDrawer = hasProgress(p);

  const onPrimary = () => {
    setLoading(true);
    setTimeout(() => {
      if (!p.started) saveProgress({ ...p, started: true });
      setLoading(false);
      const target = state === "university" ? SCREENS.chapter1 : SCREENS.chapter0;
      if (!target.available) setNotice("Ce chapitre arrive bientôt — ta progression est bien enregistrée. 💛");
    }, 600);
  };

  const items: { icon: string; label: string; sub?: string; key: keyof typeof SCREENS; extra?: React.ReactNode }[] = [
    {
      icon: "📖", label: "Relire nos lettres & promesse", key: "letters",
      extra: (
        <span className="journal-meter">
          <span style={{ width: `${(lettersCount(p) / TOTAL_LETTERS) * 100}%` }} />
          <em>{lettersCount(p)}/{TOTAL_LETTERS}</em>
        </span>
      ),
    },
    { icon: "📜", label: "Revoir l’invitation", sub: "Chapitre 0", key: "chapter0" },
    { icon: "🏛️", label: "Revoir l’Université", sub: "Chapitre 1", key: "chapter1" },
  ];
  const bonus: typeof items = bonusUnlocked(p)
    ? [
        { icon: "🌸", label: "Revoir les Retrouvailles", sub: "Chapitre 5", key: "chapter5" },
        { icon: "💌", label: "Revoir la Promesse", sub: "Épilogue", key: "epilogue" },
        { icon: "🏆", label: "Journal d’Amour & Écran Final", key: "finale" },
      ]
    : [];

  const renderItem = (it: (typeof items)[number]) => {
    const ok = SCREENS[it.key].available;
    return (
      <li key={it.key}>
        <button className="journal-item" disabled={!ok} title={ok ? undefined : "Écran à venir"}>
          <span className="journal-icon">{it.icon}</span>
          <span className="flex-1 text-left">
            <span className="block">{it.label}</span>
            {it.sub && <span className="block text-xs italic opacity-70">({it.sub})</span>}
            {it.extra}
            {!ok && <span className="block text-[0.7rem] opacity-50">Écran à venir</span>}
          </span>
        </button>
      </li>
    );
  };

  return (
    <main className="title-scene">
      <img src={bg} alt="" width={1920} height={1088} className="title-bg" />
      <div className="title-vignette" aria-hidden />
      <Sparkles />

      <p className="title-tagline">{TAGLINE} <span>♥</span></p>

      <div className="title-layout">
        <article className="parchment">
          <div className="wax-seal" aria-hidden><span>♥</span></div>
          <span className="corner tl" aria-hidden>❦</span>
          <span className="corner tr" aria-hidden>❦</span>
          <span className="corner bl" aria-hidden>❦</span>
          <span className="corner br" aria-hidden>❦</span>

          <h1 className="parchment-title">{TITLE}</h1>
          <p className="parchment-names">{NAMES}</p>
          <div className="divider" aria-hidden>♥</div>

          <MiniMarkdown source={INTRO_MD} />

          <div className="divider" aria-hidden>♥</div>

          <div className="flex flex-col items-center gap-4 pt-2">
            <button className="btn-royal" onClick={onPrimary} disabled={loading} aria-busy={loading}>
              <span>{loading ? "✨" : PRIMARY[state].icon}</span>
              <span>{loading ? "Un instant…" : PRIMARY[state].label}</span>
            </button>
            {notice && <p className="text-sm italic text-parchment-ink/80" role="status">{notice}</p>}
            {showDrawer && (
              <button className="btn-drawer" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
                ⚙️ Chapitres débloqués & Journal <span className={open ? "rotate-180 inline-block transition" : "inline-block transition"}>▼</span>
              </button>
            )}
          </div>
        </article>

        {showDrawer && (
          <aside className={`journal ${open ? "is-open" : ""}`} aria-hidden={!open}>
            <div className="flex items-center justify-between border-b border-gold/30 pb-3">
              <h2 className="font-display text-2xl text-gold">📖 Mon Journal</h2>
              <button aria-label="Fermer" className="text-gold text-xl" onClick={() => setOpen(false)}>✕</button>
            </div>
            <ul className="mt-2">{items.map(renderItem)}</ul>
            {bonus.length > 0 && (
              <>
                <p className="mt-3 text-sm text-rose">🎁 Bonus (Chapitre 5 terminé)</p>
                <ul>{bonus.map(renderItem)}</ul>
              </>
            )}
            <button className="journal-item mt-3 border-t border-gold/30 pt-4" onClick={() => setConfirm(true)}>
              <span className="journal-icon">↺</span>
              <span className="text-left">
                <span className="block">Recommencer à zéro</span>
                <span className="block text-xs opacity-70">Cette action effacera toute la progression.</span>
              </span>
            </button>
          </aside>
        )}
      </div>

      {confirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <div className="modal-card">
            <h2 id="reset-title" className="font-display text-3xl">Recommencer à zéro ?</h2>
            <p className="mt-3">Toute la progression, les énigmes résolues et les lettres débloquées seront effacées. Cette action est définitive.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button className="btn-drawer" onClick={() => setConfirm(false)}>Annuler</button>
              <button className="btn-danger" onClick={() => { resetProgress(); setConfirm(false); setOpen(false); setNotice(null); }}>
                Oui, tout effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
