import { createFileRoute } from "@tanstack/react-router";
import { TitleScreen } from "@/components/title/TitleScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deux lettres, une promesse" },
      { name: "description", content: "Un jeu romantique de Dylan pour Hougni : une aventure de lettres, d’énigmes et de promesses." },
      { property: "og:title", content: "Deux lettres, une promesse" },
      { property: "og:description", content: "Une aventure romantique faite de lettres, d’énigmes et de promesses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TitleScreen,
});
