import { Lock, Sparkles, Heart } from "lucide-react";
import type { ReactNode } from "react";

export type Location = {
  id: number;
  title: string;
  chapter: string;
  description: ReactNode;
  image: string;
  icon: ReactNode;
};

export function LocationCard({
  loc,
  unlocked,
  selected,
  onSelect,
}: {
  loc: Location;
  unlocked: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${loc.title} – ${unlocked ? "accessible" : "verrouillé"}`}
      className={`group relative flex w-[78vw] max-w-[320px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl bg-parchment text-left text-ink transition duration-300 hover:-translate-y-1 md:w-auto md:max-w-none ${
        unlocked ? "aura" : "gold-frame"
      } ${selected ? "scale-[1.03]" : ""}`}
    >
      <div className="relative aspect-[6/5] overflow-hidden">
        <img
          src={loc.image}
          alt={loc.title}
          loading="lazy"
          width={896}
          height={752}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gold bg-night font-display text-xl text-gold-soft">
          {loc.id}
        </span>
        {!unlocked && (
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-night/80 text-gold-soft">
            <Lock className="h-5 w-5" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col items-center px-4 pb-3 pt-3 text-center">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold lg:text-xl">
          <span className="text-ink">{loc.icon}</span>
          {loc.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{loc.chapter}</p>
        <div className="my-2 flex w-full items-center gap-2">
          <span className="h-px flex-1 bg-ink/30" />
          {unlocked ? (
            <span className="flex items-center gap-1 rounded-full bg-leaf px-3 py-0.5 text-xs font-semibold text-accent-foreground">
              <Sparkles className="h-3 w-3" /> Accessible
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-ink/80 px-3 py-0.5 text-xs text-parchment">
              <Lock className="h-3 w-3" /> Verrouillé
            </span>
          )}
          <span className="h-px flex-1 bg-ink/30" />
        </div>
        <p className="text-[13px] leading-snug">{loc.description}</p>
        <div className="mt-auto flex w-full items-center gap-2 pt-3">
          <span className="h-px flex-1 bg-ink/30" />
          <Heart className="h-3.5 w-3.5 fill-ink text-ink" />
          <span className="h-px flex-1 bg-ink/30" />
        </div>
      </div>
    </button>
  );
}
