
/**
 * Source Coverage Registry — where the corpus lives and how far ingestion
 * has reached. Demonstration data: channels are representative of NCPOR's
 * real scattered landscape, statuses are illustrative.
 */

const STATUS = {
  ingested: { label: "Ingested", cls: "text-accent border-accent/50 bg-accent-dim" },
  processing: { label: "OCR pending", cls: "text-sunrise border-sunrise/50 bg-sunrise-dim" },
  awaiting: { label: "Awaiting release", cls: "text-text-3 border-line-strong bg-surface-2" },
} as const;

const CHANNELS: {
  channel: string;
  artefacts: string;
  est: string;
  status: keyof typeof STATUS;
}[] = [
  { channel: "Annual expedition reports", artefacts: "44 Antarctic · 9 Arctic · 6 Southern Ocean", est: "1981–2026", status: "ingested" },
  { channel: "MoES / NCPOR dataset catalogue", artefacts: "glaciology, ocean, atmosphere series", est: "1990–2024", status: "ingested" },
  { channel: "Peer-reviewed publications", artefacts: "journal papers & theses by programme scientists", est: "1985–2025", status: "ingested" },
  { channel: "Photograph & film archive", artefacts: "station life, sea ice, aurora, operations", est: "1983–2025", status: "processing" },
  { channel: "Institutional web pages", artefacts: "news, press releases, station pages", est: "2000–2026", status: "ingested" },
  { channel: "Station logs & field notebooks", artefacts: "hand-logged meteorology & biology observations", est: "1983–2025", status: "awaiting" },
];

export function SourceCoverage({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "overflow-hidden rounded-xl border border-line bg-surface"}>
      <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-4">
        <h3 className="display text-base font-bold text-text">Source Coverage Registry</h3>
        <span className="meta-label !text-[9px]">demo status</span>
      </div>
      <ul className="divide-y divide-line">
        {CHANNELS.map((c) => {
          const s = STATUS[c.status];
          return (
            <li key={c.channel} className="flex items-start justify-between gap-3 px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-text">{c.channel}</p>
                <p className="numeral mt-0.5 text-[11px] text-text-3">
                  {c.artefacts} · {c.est}
                </p>
              </div>
              <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${s.cls}`}>{s.label}</span>
            </li>
          );
        })}
      </ul>
      <p className="border-t border-line px-5 py-3 text-[11px] leading-snug text-text-3">
        Demonstration statuses. Production ingestion runs the documented pipeline — validate, checksum, OCR,
        extract, deduplicate — before anything enters the Vault.
      </p>
    </div>
  );
}

