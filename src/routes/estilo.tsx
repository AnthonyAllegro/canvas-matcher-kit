import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoHorizontal, LogoIcon } from "@/components/brand/Logo";
import { Btn } from "@/components/app/MainScreen";

export const Route = createFileRoute("/estilo")({
  head: () => ({
    meta: [
      { title: "Guia de estilo · Mesclar PDFs por Subpasta" },
      { name: "description", content: "Logo, cores, tipografia, botões e alertas do Mesclar PDFs por Subpasta." },
      { property: "og:title", content: "Guia de estilo · Mesclar PDFs por Subpasta" },
      { property: "og:description", content: "Sistema visual alinhado à Consórcio Tradição." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Estilo,
});

const colors = [
  ["Azul Tradição", "#284895", "bg-brand", "Links, estados ativos, marca"],
  ["Azul ação (CTA)", "#0036C6", "bg-cta", "Executar, Mesclar todos"],
  ["Azul profundo", "#2039C2", "bg-brand-deep", "Hover CTA, faixas"],
  ["Ouro Tradição", "#FFD902", "bg-gold", "Badges, versão, destaques"],
  ["Amarelo apoio", "#E4AC07", "bg-gold-strong", "Divergência"],
  ["Texto", "#2E2C36", "bg-ink", "Texto principal"],
  ["Sucesso", "#17682F", "bg-success", "Status OK"],
  ["Erro", "#B42318", "bg-error", "Falhas"],
  ["Borda", "#DBDEE1", "bg-border", "Divisores"],
  ["Superfície", "#F0F1F2", "bg-surface", "Fundo de cards"],
];

function Estilo() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-12 px-8 py-10">
      <div className="flex items-center justify-between">
        <LogoHorizontal />
        <Link to="/" className="text-sm font-medium text-brand hover:underline">← Voltar ao app</Link>
      </div>
      <h1 className="text-3xl font-bold">Guia rápido de estilo</h1>

      <Section title="Logo">
        <div className="grid grid-cols-2 gap-4">
          <Tile label="Horizontal · fundo claro"><LogoHorizontal /></Tile>
          <Tile label="Horizontal · fundo escuro" dark><LogoHorizontal tone="reverse" /></Tile>
          <Tile label="Monocromática · azul #284895"><LogoHorizontal tone="mono-blue" /></Tile>
          <Tile label="Monocromática · preta"><LogoHorizontal tone="mono-black" /></Tile>
        </div>
        <div className="mt-4 flex items-end gap-6 rounded-lg border bg-card p-6">
          {[64, 40, 24, 16].map((s) => <div key={s} className="text-center"><LogoIcon size={s} /><div className="mt-1 text-xs text-muted-foreground">{s}px</div></div>)}
          <div className="ml-auto flex gap-2">
            <a href="/brand/logo-horizontal.svg" download className="rounded-md border px-3 py-2 text-sm font-medium text-brand hover:bg-accent">Baixar logo (SVG)</a>
            <a href="/favicon.svg" download="mesclar-pdfs-icone.svg" className="rounded-md border px-3 py-2 text-sm font-medium text-brand hover:bg-accent">Baixar ícone (SVG)</a>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Conceito: NF (folha frontal com dobra ouro) unida ao relatório (folha de trás) + selo de conferência — união de documentos com precisão.</p>
      </Section>

      <Section title="Cores">
        <div className="grid grid-cols-5 gap-3">
          {colors.map(([n, h, c, u]) => (
            <div key={h} className="overflow-hidden rounded-lg border bg-card">
              <div className={`h-16 ${c}`} />
              <div className="p-3"><div className="text-sm font-semibold">{n}</div><div className="font-mono text-xs">{h}</div><div className="mt-1 text-xs text-muted-foreground">{u}</div></div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tipografia">
        <div className="space-y-3 rounded-lg border bg-card p-6">
          <div className="font-display text-3xl font-bold">Montserrat — Títulos e marca</div>
          <div className="text-base">Inter — Interface e corpo de texto, legível em uso diário.</div>
          <div className="font-mono text-sm">JetBrains Mono — [OK] NF 10293 R$ 4.812,50 = relatório</div>
        </div>
      </Section>

      <Section title="Botões">
        <div className="flex gap-3 rounded-lg border bg-card p-6">
          <Btn variant="cta">Executar</Btn><Btn variant="secondary">Pré-visualizar</Btn><Btn variant="ghost">Salvar preferências</Btn><Btn variant="gold">Destaque</Btn><Btn variant="cta" disabled>Desabilitado</Btn>
        </div>
      </Section>

      <Section title="Alertas e estados">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border-l-4 border-success bg-success-soft px-4 py-3 text-sm"><strong className="text-success">OK</strong> — valor da NF confere com o relatório.</div>
          <div className="rounded-md border-l-4 border-warning bg-warning-soft px-4 py-3 text-sm"><strong>Divergência</strong> — diferença de R$ 120,00 entre NF e relatório.</div>
          <div className="rounded-md border-l-4 border-error bg-error-soft px-4 py-3 text-sm"><strong className="text-error">Erro</strong> — nenhuma NF identificada na subpasta.</div>
          <div className="rounded-md border-l-4 border-brand bg-accent px-4 py-3 text-sm"><strong className="text-brand">Processando</strong> — 3/6 subpastas analisadas.</div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="mb-4 border-b pb-2 text-lg font-bold">{title}</h2>{children}</section>;
}
function Tile({ label, dark, children }: { label: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg border p-6 ${dark ? "bg-brand" : "bg-card"}`}>
      {children}
      <div className={`mt-4 text-xs ${dark ? "text-gold" : "text-muted-foreground"}`}>{label}</div>
    </div>
  );
}
