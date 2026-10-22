import { useState, type ReactNode } from "react";
import { asset } from "../../lovegame/assets";
import { useProgression, progressionStore } from "../../lovegame/state/ProgressionStore";
import "./TitleScreen.css";

export const TITLE = "Deux lettres, une promesse";
export const NAMES = "Dylan ATTOLOU & Hougni Soulyhatou";
export const TAGLINE = "L’amour est une aventure…";

export const INTRO_MD = `### Ma poupée,

Si tu tiens cette lettre entre tes mains, c’est que le voyage a commencé. J’ai transformé **ton cadeau en une aventure** : une histoire pleine **d’émotions, de découvertes** et de surprises.

Je voulais que tu puisses revivre notre chemin, sentir chaque émotion et découvrir ce qui a grandi dans mon cœur depuis ce fameux premier jour à **l’université**.

Tout au long de cette aventure, chaque énigme, chaque lieu et chaque **secret** a été préparé avec tendresse pour toi. Il n’y a aucun chrono à battre, rien à prouver à personne : avance à ton rythme, ma poupée, et laisse-toi guider.

Au bout de ce chemin, je serai là pour t’attendre. Et j’ai tant de choses à te raconter.

*Prête à franchir le seuil de notre histoire ?*`;

// Mini Markdown pour afficher gras, italique et titres sans dépendance externe
function inlineMarkdown(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) out.push(<strong key={`${key}-${i++}`}>{t.slice(2, -2)}</strong>);
    else out.push(<em key={`${key}-${i++}`}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function MiniMarkdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return (
    <div className="parchment-prose">
      {blocks.map((b, i) => {
        const h = /^(#{1,3})\s+(.*)$/.exec(b.trim());
        if (h) return <h3 key={i}>{inlineMarkdown(h[2], `h${i}`)}</h3>;
        const whole = /^\*[^*].*[^*]\*$/.test(b.trim());
        return (
          <p key={i} className={whole ? "poetic" : undefined}>
            {inlineMarkdown(b.replace(/\n/g, " "), `p${i}`)}
          </p>
        );
      })}
    </div>
  );
}

function Sparkles() {
  return (
    <div className="sparkles" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i * 0.7) % 9}s`,
            animationDuration: `${8 + (i % 6)}s`,
          }}
        />
      ))}
    </div>
  );
}

export interface TitleScreenProps {
  onStartChapter0: () => void;
  onEnterUniversity: () => void;
  onContinue: () => void;
  onOpenLetter: (index: number) => void;
  onReviewChapter0: () => void;
  onReviewChapter1: () => void;
  onReviewChapter5?: () => void;
  onReviewEpilogue?: () => void;
  onReviewEnding?: () => void;
}

export default function TitleScreen({
  onStartChapter0,
  onEnterUniversity,
  onContinue,
  onOpenLetter,
  onReviewChapter0,
  onReviewChapter1,
  onReviewChapter5,
  onReviewEpilogue,
  onReviewEnding,
}: TitleScreenProps) {
  const progression = useProgression();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasSave =
    progression.unlockedLetters.length > 0 ||
    progression.solvedPuzzles.length > 0 ||
    progression.collectedFragments.length > 0 ||
    Object.keys(progression.openedChestsByLevel).length > 0 ||
    progression.chapters["chapitre-0"] === "completed";

  const isCh0Done = progression.chapters["chapitre-0"] === "completed";
  const isCh1Done = progression.chapters["chapitre-1"] === "completed";
  const isCh5Done = progression.chapters["chapitre-5"] === "completed";

  const handlePrimaryClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!isCh0Done) {
        onStartChapter0();
      } else if (!isCh1Done) {
        onEnterUniversity();
      } else {
        onContinue();
      }
    }, 400);
  };

  const lettersUnlockedCount = progression.unlockedLetters.length;
  const totalLetters = 3;

  return (
    <main className="title-scene" role="main">
      {/* Fond paysage romantique */}
      <img
        src={asset("title/title-bg.jpg")}
        alt=""
        aria-hidden="true"
        className="title-bg"
      />
      <div className="title-vignette" aria-hidden="true" />
      <Sparkles />

      <p className="title-tagline">
        {TAGLINE} <span>♥</span>
      </p>

      <div className="title-layout">
        {/* Parchemin central */}
        <article className="parchment">
          {/* Sceau de cire rubis avec cœur */}
          <div className="wax-seal" aria-hidden="true">
            <span>♥</span>
          </div>

          {/* Enluminures d'angles */}
          <span className="corner tl" aria-hidden="true">❦</span>
          <span className="corner tr" aria-hidden="true">❦</span>
          <span className="corner bl" aria-hidden="true">❦</span>
          <span className="corner br" aria-hidden="true">❦</span>

          <h1 className="parchment-title">{TITLE}</h1>
          <p className="parchment-names">{NAMES}</p>

          <div className="divider" aria-hidden="true">♥</div>

          <MiniMarkdown source={INTRO_MD} />

          <div className="divider" aria-hidden="true">♥</div>

          {/* Bouton d'action royal */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", paddingTop: ".5rem" }}>
            <button
              type="button"
              className="btn-royal"
              onClick={handlePrimaryClick}
              disabled={loading}
              aria-busy={loading}
            >
              <span>{loading ? "✨" : !isCh0Done ? "❤️" : !isCh1Done ? "🏛️" : "❤️"}</span>
              <span>
                {loading
                  ? "Un instant…"
                  : !isCh0Done
                  ? "Commencer notre histoire"
                  : !isCh1Done
                  ? "Entrer dans l’Université (Chapitre 1)"
                  : "Continuer notre histoire"}
              </span>
            </button>

            {hasSave && (
              <button
                type="button"
                className="btn-drawer"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
              >
                ⚙️ Chapitres débloqués & Journal {open ? "▲" : "▼"}
              </button>
            )}
          </div>
        </article>

        {/* Tiroir latéral des chapitres et du journal */}
        {hasSave && (
          <aside className={`journal ${open ? "is-open" : ""}`} aria-hidden={!open}>
            <div className="journal-header">
              <h2>📖 Mon Journal</h2>
              <button
                type="button"
                aria-label="Fermer"
                className="journal-close-btn"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <ul className="journal-list">
              <li>
                <button
                  type="button"
                  className="journal-item"
                  onClick={() => {
                    setOpen(false);
                    onOpenLetter(progression.unlockedLetters[0] ?? 0);
                  }}
                  disabled={lettersUnlockedCount === 0}
                >
                  <span className="journal-icon">📖</span>
                  <span style={{ flex: 1, textAlign: "left" }}>
                    <span style={{ display: "block" }}>Relire nos lettres & promesse</span>
                    <span className="journal-meter">
                      <span style={{ width: `${(lettersUnlockedCount / totalLetters) * 100}%` }} />
                      <em>{lettersUnlockedCount}/{totalLetters}</em>
                    </span>
                  </span>
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="journal-item"
                  onClick={() => {
                    setOpen(false);
                    onReviewChapter0();
                  }}
                >
                  <span className="journal-icon">📜</span>
                  <span style={{ flex: 1, textAlign: "left" }}>
                    <span style={{ display: "block" }}>Revoir l’invitation</span>
                    <span style={{ display: "block", fontSize: "0.75rem", fontStyle: "italic", opacity: 0.7 }}>
                      (Chapitre 0)
                    </span>
                  </span>
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="journal-item"
                  onClick={() => {
                    setOpen(false);
                    onReviewChapter1();
                  }}
                  disabled={!isCh0Done}
                >
                  <span className="journal-icon">🏛️</span>
                  <span style={{ flex: 1, textAlign: "left" }}>
                    <span style={{ display: "block" }}>Revoir l’Université</span>
                    <span style={{ display: "block", fontSize: "0.75rem", fontStyle: "italic", opacity: 0.7 }}>
                      (Chapitre 1)
                    </span>
                  </span>
                </button>
              </li>

              {isCh5Done && (
                <>
                  <li style={{ marginTop: ".75rem", fontSize: "0.85rem", color: "#e11d48", fontWeight: 700 }}>
                    🎁 Bonus (Chapitre 5 terminé)
                  </li>
                  {onReviewChapter5 && (
                    <li>
                      <button
                        type="button"
                        className="journal-item"
                        onClick={() => {
                          setOpen(false);
                          onReviewChapter5();
                        }}
                      >
                        <span className="journal-icon">🌸</span>
                        <span style={{ flex: 1, textAlign: "left" }}>
                          <span style={{ display: "block" }}>Revoir les Retrouvailles</span>
                          <span style={{ display: "block", fontSize: "0.75rem", fontStyle: "italic", opacity: 0.7 }}>
                            (Chapitre 5)
                          </span>
                        </span>
                      </button>
                    </li>
                  )}
                  {onReviewEpilogue && (
                    <li>
                      <button
                        type="button"
                        className="journal-item"
                        onClick={() => {
                          setOpen(false);
                          onReviewEpilogue();
                        }}
                      >
                        <span className="journal-icon">💌</span>
                        <span style={{ flex: 1, textAlign: "left" }}>
                          <span style={{ display: "block" }}>Revoir la Promesse</span>
                          <span style={{ display: "block", fontSize: "0.75rem", fontStyle: "italic", opacity: 0.7 }}>
                            (Épilogue)
                          </span>
                        </span>
                      </button>
                    </li>
                  )}
                  {onReviewEnding && (
                    <li>
                      <button
                        type="button"
                        className="journal-item"
                        onClick={() => {
                          setOpen(false);
                          onReviewEnding();
                        }}
                      >
                        <span className="journal-icon">🏆</span>
                        <span style={{ flex: 1, textAlign: "left" }}>
                          <span style={{ display: "block" }}>Journal d’Amour & Écran Final</span>
                        </span>
                      </button>
                    </li>
                  )}
                </>
              )}

              <li>
                <button
                  type="button"
                  className="journal-item"
                  style={{ marginTop: ".75rem", borderTop: "1px solid rgba(255, 217, 122, 0.3)", paddingTop: ".75rem" }}
                  onClick={() => setConfirm(true)}
                >
                  <span className="journal-icon">↺</span>
                  <span style={{ textAlign: "left" }}>
                    <span style={{ display: "block" }}>Recommencer à zéro</span>
                    <span style={{ display: "block", fontSize: "0.75rem", opacity: 0.7 }}>
                      Cette action effacera toute la progression.
                    </span>
                  </span>
                </button>
              </li>
            </ul>
          </aside>
        )}
      </div>

      {/* Modale de confirmation de réinitialisation */}
      {confirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <div className="modal-card">
            <h2 id="reset-title">Recommencer à zéro ?</h2>
            <p>
              Toute la progression, les énigmes résolues et les lettres débloquées seront effacées. Cette action est définitive.
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: ".75rem" }}>
              <button type="button" className="btn-drawer" onClick={() => setConfirm(false)}>
                Annuler
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  progressionStore.reset();
                  setConfirm(false);
                  setOpen(false);
                }}
              >
                Oui, tout effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
