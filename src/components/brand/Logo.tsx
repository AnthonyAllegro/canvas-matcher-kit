type Tone = "color" | "mono-blue" | "mono-black" | "reverse";

const palettes: Record<Tone, { tile: string; back: string; front: string; line: string; accent: string; text: string; sub: string }> = {
  color: { tile: "var(--brand)", back: "oklch(0.8 0.06 266)", front: "#fff", line: "var(--brand)", accent: "var(--gold)", text: "var(--ink)", sub: "var(--brand)" },
  "mono-blue": { tile: "var(--brand)", back: "oklch(0.75 0.06 266)", front: "#fff", line: "var(--brand)", accent: "#fff", text: "var(--brand)", sub: "var(--brand)" },
  "mono-black": { tile: "#111", back: "#888", front: "#fff", line: "#111", accent: "#fff", text: "#111", sub: "#111" },
  reverse: { tile: "#fff", back: "oklch(0.8 0.06 266)", front: "var(--brand)", line: "#fff", accent: "var(--gold)", text: "#fff", sub: "var(--gold)" },
};

export function LogoIcon({ size = 40, tone = "color" }: { size?: number; tone?: Tone }) {
  const p = palettes[tone];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Mesclar PDFs por Subpasta">
      <rect width="64" height="64" rx="14" fill={p.tile} />
      {/* back sheet (relatório) */}
      <rect x="22" y="12" width="26" height="32" rx="3" fill={p.back} />
      {/* front sheet (NF) */}
      <path d="M14 20h18l8 8v24a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V23a3 3 0 0 1 3-3z" fill={p.front} />
      <path d="M32 20l8 8h-5a3 3 0 0 1-3-3z" fill={p.accent} />
      <rect x="19" y="33" width="16" height="3" rx="1.5" fill={p.line} />
      <rect x="19" y="40" width="11" height="3" rx="1.5" fill={p.line} opacity=".55" />
      {/* precision check */}
      <circle cx="46" cy="46" r="9" fill={p.accent} stroke={p.tile} strokeWidth="3" />
      <path d="M42 46l3 3 5-6" fill="none" stroke={tone === "color" || tone === "reverse" ? "var(--ink)" : p.tile} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LogoHorizontal({ tone = "color", size = 44 }: { tone?: Tone; size?: number }) {
  const p = palettes[tone];
  return (
    <div className="flex items-center gap-3">
      <LogoIcon size={size} tone={tone} />
      <div className="leading-tight">
        <div className="font-display font-bold tracking-tight" style={{ color: p.text, fontSize: size * 0.4 }}>
          Mesclar PDFs <span className="font-medium">por Subpasta</span>
        </div>
        <div className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.18em]" style={{ color: p.sub }}>
          Ferramenta interna · Consórcio Tradição
        </div>
      </div>
    </div>
  );
}
