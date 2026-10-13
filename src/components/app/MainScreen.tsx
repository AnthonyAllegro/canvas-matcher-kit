import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogoHorizontal } from "@/components/brand/Logo";

type Status = "pronto" | "processando" | "sucesso" | "divergencia" | "erro";
type LogLine = { t: string; kind: "INFO" | "OK" | "DIVERGÊNCIA" | "ERRO"; msg: string };

const statusMeta: Record<Status, { label: string; cls: string }> = {
  pronto: { label: "Pronto", cls: "bg-surface text-ink border-border" },
  processando: { label: "Processando", cls: "bg-accent text-brand border-brand/30" },
  sucesso: { label: "Concluído", cls: "bg-success-soft text-success border-success/30" },
  divergencia: { label: "Concluído com divergências", cls: "bg-warning-soft text-ink border-warning" },
  erro: { label: "Erro", cls: "bg-error-soft text-error border-error/30" },
};

const kindCls: Record<LogLine["kind"], string> = {
  INFO: "text-console-foreground/60",
  OK: "text-success-soft",
  "DIVERGÊNCIA": "text-gold",
  ERRO: "text-error-soft",
};

const script: (LogLine & { modal?: boolean })[] = [
  { t: "", kind: "INFO", msg: "Varredura iniciada em \\\\fin01\\contas-pagar\\2026-10 — 6 subpastas" },
  { t: "", kind: "OK", msg: "Corretora Alfa — NF 10293 R$ 4.812,50 = relatório R$ 4.812,50 · mesclado" },
  { t: "", kind: "OK", msg: "FIXO_Escritório Sul — 1 PDF, sem validação de valor · copiado" },
  { t: "", kind: "DIVERGÊNCIA", msg: "Parceiro Beta — NF R$ 2.300,00 ≠ relatório R$ 2.180,00 (Δ R$ 120,00)" },
  { t: "", kind: "INFO", msg: "Rede Gama — 3 relatórios encontrados · aguardando decisão", modal: true },
  { t: "", kind: "ERRO", msg: "Agência Delta — nenhuma NF identificada pelas palavras-chave" },
  { t: "", kind: "OK", msg: "Promotora Ômega — NF 8841 R$ 1.050,00 = relatório R$ 1.050,00 · mesclado" },
];

const now = () => new Date().toLocaleTimeString("pt-BR");

export function MainScreen() {
  const [folder, setFolder] = useState("\\\\fin01\\contas-pagar\\2026-10");
  const [opts, setOpts] = useState({ dry: true, csv: true, log: true, fixo: true, overwrite: false, recursive: true });
  const [keywords, setKeywords] = useState("nota fiscal, NF, NFS-e, nfse");
  const [status, setStatus] = useState<Status>("pronto");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [step, setStep] = useState(-1);
  const [modal, setModal] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== "processando" || modal || step < 0) return;
    if (step >= script.length) {
      setStatus(logs.some((l) => l.kind === "ERRO") ? "erro" : logs.some((l) => l.kind === "DIVERGÊNCIA") ? "divergencia" : "sucesso");
      setLogs((l) => [...l, { t: now(), kind: "INFO", msg: `Fim · relatório CSV ${opts.dry ? "(simulação) " : ""}salvo em resumo_2026-10.csv` }]);
      return;
    }
    const id = setTimeout(() => {
      const s = script[step];
      setLogs((l) => [...l, { ...s, t: now() }]);
      if (s.modal) setModal(true);
      setStep((x) => x + 1);
    }, 550);
    return () => clearTimeout(id);
  }, [status, step, modal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { logRef.current?.scrollTo({ top: 1e6 }); }, [logs]);

  const run = () => { setLogs([]); setStep(0); setStatus("processando"); };
  const decide = (merge: boolean) => {
    setModal(false);
    setLogs((l) => [...l, merge
      ? { t: now(), kind: "DIVERGÊNCIA", msg: "Rede Gama — soma R$ 6.940,00 ≠ NF R$ 7.000,00 · mesclado por decisão do usuário" }
      : { t: now(), kind: "INFO", msg: "Rede Gama — pulado pelo usuário" }]);
  };
  const progress = step < 0 ? 0 : Math.min(100, Math.round((step / script.length) * 100));
  const busy = status === "processando";
  const sm = statusMeta[status];

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-8 py-4">
          <LogoHorizontal size={42} />
          <div className="flex items-center gap-4">
            <span className="rounded bg-gold px-2 py-0.5 font-display text-xs font-bold text-ink">v1.5</span>
            <Link to="/estilo" className="text-sm font-medium text-brand hover:underline">Guia de estilo</Link>
            <span className="border-l pl-4 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">Consórcio Tradição</span>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-brand via-brand-deep to-gold" />
      </header>

      <main className="mx-auto grid max-w-[1360px] grid-cols-[420px_1fr] gap-6 px-8 py-8">
        <section className="space-y-5">
          <Card title="Pasta-base" hint="Cada subpasta gera um PDF mesclado (NF sempre na 1ª posição).">
            <div className="flex gap-2">
              <input value={folder} onChange={(e) => setFolder(e.target.value)} className="h-10 flex-1 rounded-md border bg-card px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
              <button className="h-10 rounded-md border bg-surface px-4 text-sm font-medium hover:bg-accent">Procurar…</button>
            </div>
          </Card>

          <Card title="Opções de processamento">
            <div className="grid grid-cols-1 gap-2.5">
              {([
                ["dry", "Modo simulação (dry-run)", "Não grava arquivos; apenas registra o que seria feito"],
                ["fixo", "Tratar pastas “FIXO”", "Copia o PDF único sem validar valores"],
                ["recursive", "Incluir subpastas aninhadas", ""],
                ["overwrite", "Sobrescrever mesclados existentes", ""],
                ["log", "Gravar log em arquivo", ""],
                ["csv", "Gerar relatório CSV", "Resumo por subpasta: valores, status, decisão"],
              ] as const).map(([k, label, desc]) => (
                <label key={k} className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-1.5 hover:bg-surface">
                  <input type="checkbox" checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} className="mt-0.5 h-4 w-4 accent-brand" />
                  <span className="text-sm">
                    <span className="font-medium">{label}</span>
                    {desc && <span className="block text-xs text-muted-foreground">{desc}</span>}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          <Card title="Palavras-chave da NF" hint="Separadas por vírgula. Usadas para identificar a nota no nome do arquivo.">
            <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className="h-10 w-full rounded-md border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {keywords.split(",").map((k) => k.trim()).filter(Boolean).map((k) => (
                <span key={k} className="rounded bg-accent px-2 py-0.5 font-mono text-xs text-brand">{k}</span>
              ))}
            </div>
          </Card>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div className="flex gap-2">
              <Btn variant="secondary" disabled={busy}>Pré-visualizar</Btn>
              <Btn variant="secondary">Abrir pastas</Btn>
              <Btn variant="ghost">Salvar preferências</Btn>
            </div>
            <Btn variant="cta" onClick={run} disabled={busy}>{busy ? "Executando…" : opts.dry ? "Executar simulação" : "Executar"}</Btn>
          </div>

          <div className="rounded-lg border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${sm.cls}`}>● {sm.label}</span>
                {opts.dry && <span className="rounded bg-gold px-2 py-0.5 text-xs font-semibold text-ink">SIMULAÇÃO</span>}
              </div>
              <span className="font-mono text-sm text-muted-foreground">{Math.min(step < 0 ? 0 : step, script.length)}/{script.length} subpastas · {progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div className={`h-full transition-all duration-500 ${status === "erro" ? "bg-error" : status === "divergencia" ? "bg-warning" : status === "sucesso" ? "bg-success" : "bg-cta"}`} style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {([
                ["Mescladas", logs.filter((l) => l.kind === "OK").length, "text-success"],
                ["Divergências", logs.filter((l) => l.kind === "DIVERGÊNCIA").length, "text-gold-strong"],
                ["Erros", logs.filter((l) => l.kind === "ERRO").length, "text-error"],
                ["Total", script.length - 1, "text-brand"],
              ] as const).map(([l, v, c]) => (
                <div key={l} className="rounded-md bg-surface px-4 py-3">
                  <div className="text-xs text-muted-foreground">{l}</div>
                  <div className={`font-display text-2xl font-bold ${c}`}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-[340px] flex-1 flex-col overflow-hidden rounded-lg border bg-console">
            <div className="flex items-center justify-between border-b border-console-foreground/10 px-4 py-2">
              <span className="font-display text-xs font-semibold uppercase tracking-widest text-console-foreground/70">Console de log</span>
              <button onClick={() => setLogs([])} className="text-xs text-console-foreground/60 hover:text-console-foreground">Limpar</button>
            </div>
            <div ref={logRef} className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-6 text-console-foreground">
              {logs.length === 0 && <div className="text-console-foreground/40">Aguardando execução. Selecione a pasta-base e clique em Executar.</div>}
              {logs.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-console-foreground/40">{l.t}</span>
                  <span className={`w-28 shrink-0 font-semibold ${kindCls[l.kind]}`}>[{l.kind}]</span>
                  <span>{l.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {modal && <DecisionModal onDecide={decide} />}
    </div>
  );
}

export function DecisionModal({ onDecide }: { onDecide: (merge: boolean) => void }) {
  const rows = [["relatorio_comissoes_parte1.pdf", "R$ 3.200,00"], ["relatorio_comissoes_parte2.pdf", "R$ 2.540,00"], ["relatorio_bonus_set.pdf", "R$ 1.200,00"]];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border bg-card shadow-2xl">
        <div className="h-1 bg-gold" />
        <div className="p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand">Decisão necessária · Rede Gama</div>
          <h2 className="mt-1 text-xl font-bold">Vários relatórios nesta subpasta</h2>
          <p className="mt-1 text-sm text-muted-foreground">A soma dos relatórios não confere com o valor da NF. Confirme se deseja mesclar todos.</p>
          <div className="mt-4 rounded-md border">
            <div className="flex justify-between border-b bg-accent px-4 py-2 text-sm font-semibold text-brand"><span>NF 55120 (1ª posição)</span><span className="font-mono">R$ 7.000,00</span></div>
            {rows.map(([n, v]) => (
              <div key={n} className="flex justify-between border-b px-4 py-2 text-sm"><span className="font-mono text-xs">{n}</span><span className="font-mono">{v}</span></div>
            ))}
            <div className="flex justify-between px-4 py-2 text-sm font-semibold"><span>Soma dos relatórios</span><span className="font-mono">R$ 6.940,00</span></div>
          </div>
          <div className="mt-3 rounded-md border-l-4 border-warning bg-warning-soft px-4 py-2.5 text-sm text-ink">
            <strong>Divergência de R$ 60,00</strong> — soma inferior à NF.
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Btn variant="secondary" onClick={() => onDecide(false)}>Pular</Btn>
            <Btn variant="cta" onClick={() => onDecide(true)}>Mesclar todos</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <h3 className="text-sm font-bold">{title}</h3>
      {hint && <p className="mb-3 mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className={hint ? "" : "mt-3"}>{children}</div>
    </div>
  );
}

export function Btn({ variant, ...p }: { variant: "cta" | "secondary" | "ghost" | "gold" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const v = {
    cta: "bg-cta text-primary-foreground hover:bg-brand-deep shadow-sm px-6",
    secondary: "border bg-card text-ink hover:bg-surface px-4",
    ghost: "text-brand hover:bg-accent px-4",
    gold: "bg-gold text-ink hover:bg-gold-strong px-4",
  }[variant];
  return <button {...p} className={`h-10 rounded-md text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${v}`} />;
}
