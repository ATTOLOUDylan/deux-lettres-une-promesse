import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/carte")({
  head: () => ({
    meta: [
      { title: "La Carte du Voyage · Deux lettres, une promesse" },
      { name: "description", content: "La suite de l’aventure commence ici." },
      { property: "og:title", content: "La Carte du Voyage" },
      { property: "og:description", content: "La suite de l’aventure commence ici." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Carte,
});

// Placeholder: replace with the existing Carte du Voyage.
function Carte() {
  return (
    <main className="grid min-h-[100svh] place-items-center bg-night p-6 text-center font-script text-warm-white">
      <div className="gold-frame rounded-3xl p-10">
        <h1 className="font-display text-3xl">La Carte du Voyage</h1>
        <p className="mt-3 opacity-80">Bientôt ici…</p>
        <Link to="/" className="mt-6 inline-block underline">Revoir Cupidon</Link>
      </div>
    </main>
  );
}
