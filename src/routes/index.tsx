import { createFileRoute } from "@tanstack/react-router";
import { MainScreen } from "@/components/app/MainScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mesclar PDFs por Subpasta v1.5 · Consórcio Tradição" },
      { name: "description", content: "Ferramenta interna para mesclar NF e relatórios de comissões por subpasta, com validação de valores." },
      { property: "og:title", content: "Mesclar PDFs por Subpasta v1.5" },
      { property: "og:description", content: "Ferramenta interna · Consórcio Tradição" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MainScreen,
});
