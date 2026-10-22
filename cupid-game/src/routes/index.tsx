import { createFileRoute } from "@tanstack/react-router";
import { CupidScene } from "@/components/CupidScene";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chapitre 0 — L’Invitation Mystérieuse · Deux lettres, une promesse" },
      { name: "description", content: "Cupidon t’attend sur la terrasse pour une mission sentimentale très spéciale." },
      { property: "og:title", content: "Chapitre 0 — L’Invitation Mystérieuse" },
      { property: "og:description", content: "Cupidon t’attend pour une mission sentimentale très spéciale." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CupidScene,
});
