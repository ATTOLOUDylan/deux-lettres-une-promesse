import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "../../lovegame/assets";
import "./CupidScene.css";

export type CupidMood = "proud" | "rummage" | "serious" | "wink";

export interface DialogueLine {
  speaker: string;
  mood: CupidMood;
  action?: string;
  text: string;
}

export const CHAPTER0_TITLE = ["Chapitre 0 —", "L’Invitation Mystérieuse"] as const;

export const CUPID_INTRO: DialogueLine[] = [
  {
    speaker: "Cupidon",
    mood: "proud",
    text: "Bonjour, mademoiselle ! Je suis responsable de cette mission sentimentale. J’ai un diplôme en amour, un master en bisous et…",
  },
  {
    speaker: "Cupidon",
    mood: "rummage",
    action: "Il fouille rapidement dans sa sacoche.",
    text: "Attends… il est où, mon dossier ?",
  },
  {
    speaker: "Cupidon",
    mood: "rummage",
    action: "Il retourne sa sacoche et regarde autour de lui.",
    text: "Mince. J’ai oublié le dossier. Bon, on va improviser. 😄",
  },
  {
    speaker: "Cupidon",
    mood: "serious",
    text: "Bon, mademoiselle, j’ai une mission très importante pour toi. Dylan a préparé quelque chose de spécial. Mais je ne peux pas tout te révéler maintenant… sinon, où serait la surprise ?",
  },
  {
    speaker: "Cupidon",
    mood: "wink",
    text: "Si tu veux découvrir ce qu’il t’a préparé, tu vas devoir me suivre. Promis, je vais essayer de ne pas perdre le reste du dossier ! 😂",
  },
];

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
  return {
    shown: Array.from(text).slice(0, count).join(""),
    done,
    finish: () => setCount(text.length),
  };
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

export interface CupidSceneProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function CupidScene({ onComplete, onBack }: CupidSceneProps) {
  const [index, setIndex] = useState(0);
  const line = CUPID_INTRO[index] ?? CUPID_INTRO[0];
  const isLast = index === CUPID_INTRO.length - 1;
  const { shown, done, finish } = useTypewriter(line.text);
  const lock = useRef(0);

  const advance = useCallback(() => {
    const now = Date.now();
    if (now - lock.current < 250) return; // anti double-clic
    lock.current = now;

    if (!done) {
      finish();
      return;
    }

    if (isLast) {
      onComplete();
      return;
    }

    setIndex((i) => i + 1);
  }, [done, finish, isLast, onComplete]);

  const cupidAnimClass = line.mood === "rummage" ? "cupid-anim-rummage" : "cupid-anim-float";

  return (
    <main className="cupid-scene-main" role="region" aria-label="Rencontre avec Cupidon">
      {/* Image de Fond Terrasse au Crépuscule */}
      <img
        src={asset("cupid/terrace-bg.jpg")}
        alt=""
        aria-hidden="true"
        className="cupid-scene-bg"
      />
      <div className="cupid-scene-overlay" aria-hidden="true" />

      {/* Étoiles & Pétales animés */}
      <div aria-hidden="true" className="cupid-scene-fx">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="cupid-twinkle-star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="cupid-petal"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
        <span className="cupid-lantern-glow cupid-lantern-left" />
        <span className="cupid-lantern-glow cupid-lantern-right" />
      </div>

      {/* Barre supérieure : Retour, Titre royal avec cœurs, et Passer */}
      <header className="cupid-scene-topbar">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Retour au menu principal"
            className="cupid-gold-frame cupid-home-btn"
            title="Retourner au menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>
        ) : <div />}

        <div className="cupid-gold-frame cupid-scene-medallion">
          <svg className="cupid-medallion-heart-top" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <span>{CHAPTER0_TITLE[0]}</span>
          <br />
          <span>{CHAPTER0_TITLE[1]}</span>
          <svg className="cupid-medallion-heart-bottom" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="cupid-gold-frame cupid-skip-btn"
          title="Passer directement à la Carte"
        >
          <span>Passer</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m13 17 5-5-5-5"/>
            <path d="m6 17 5-5-5-5"/>
          </svg>
        </button>
      </header>

      {/* Personnages 2D Anime */}
      {/* Cupidon à gauche (animé selon son humeur) */}
      <div
        key={`${index}-${line.mood}`}
        className={`cupid-char-cupid ${cupidAnimClass}`}
      >
        <img
          src={asset("cupid/cupid.png")}
          alt="Cupidon, petit ange blond avec son arc doré"
        />
      </div>

      {/* L'héroïne de dos à droite qui regarde Cupidon */}
      <div className="cupid-char-heroine">
        <img
          src={asset("cupid/heroine.png")}
          alt="L'héroïne, de dos, écoutant Cupidon"
        />
      </div>

      {/* Boîte de Dialogue Parchemin avec effet Machine à Écrire */}
      <section className="cupid-dialogue-section">
        <div className="cupid-gold-frame cupid-speaker-badge">
          {line.speaker}
        </div>
        <button
          key={index}
          type="button"
          onClick={advance}
          aria-live="polite"
          aria-label={done ? "Réplique suivante" : "Afficher toute la réplique"}
          className="cupid-parchment-box"
        >
          {line.action && (
            <span className="cupid-dialogue-action">
              {line.action}
            </span>
          )}
          <span>{shown}</span>
          {done && (
            <span className="cupid-pulse-heart">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </span>
          )}
        </button>
      </section>

      {/* Bouton Continuer */}
      <button
        type="button"
        onClick={advance}
        className="cupid-gold-frame cupid-advance-btn"
      >
        <span>Continuer</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m13 17 5-5-5-5"/>
          <path d="m6 17 5-5-5-5"/>
        </svg>
      </button>
    </main>
  );
}
