"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Database, FileText, BookOpen } from "lucide-react";
import { DATASETS, DATASET_DOMAINS, DATASET_REGIONS, PUBLICATIONS, REPORTS } from "@/lib/data/vault";
import { Chip, ProvenanceChip } from "@/components/ui/primitives";
import { generateSeries } from "@/lib/series";

function Sparkline({ seed, w = 120, h = 36 }: { seed: number; w?: number; h?: number }) {
  const series = useMemo(() => generateSeries(seed, 24, 0, 1, 0.01), [seed]);
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const d = series
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i / (series.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} aria-hidden className="shrink-0">
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="1.4" opacity="0.9" />
    </svg>
  );
}

export function VaultExplorer() {
  const [domains, setDomains] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  const filtered = DATASETS.filter(
    (d) => (domains.length === 0 || domains.includes(d.domain)) && (regions.length === 0 || regions.includes(d.region)),
  );

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div className="flex flex-col gap-10">
      {/* Datasets */}
      <section id="datasets" aria-label="Datasets" className="scroll-mt-24">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="display flex items-center gap-3 text-2xl font-semibold">
            <Database className="size-5 text-accent" strokeWidth={1.5} aria-hidden />
            Datasets
          </h2>
          <span className="numeral text-sm text-text-3">{filtered.length} of {DATASETS.length}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {DATASET_DOMAINS.map((d) => (
            <Chip key={d} active={domains.includes(d)} onClick={() => toggle(domains, setDomains, d)}>
              {d}
            </Chip>
          ))}
          <span className="mx-2 w-px self-stretch bg-line" aria-hidden />
          {DATASET_REGIONS.map((r) => (
            <Chip key={r} active={regions.includes(r)} onClick={() => toggle(regions, setRegions, r)}>
              {r}
            </Chip>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-line">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
              <p className="text-sm font-medium text-text">No datasets match those filters.</p>
              <p className="text-xs text-text-3">Clear a facet or two — the archive is deliberately small in this demo.</p>
            </div>
          ) : (
            filtered.map((d) => (
              <Link
                key={d.id}
                href={`/vault/datasets/${d.slug}`}
                className="group flex items-center justify-between gap-6 border-b border-line px-5 py-4 transition-colors last:border-0 hover:bg-surface-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text group-hover:text-accent">{d.title}</p>
                  <p className="numeral mt-1 text-[11px] text-text-3">
                    {d.domain} · {d.region} · {d.temporal.from}–{d.temporal.to} · {d.version} · {d.sizeMb} MB
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <Sparkline seed={d.seed} />
                  <ProvenanceChip p={d.provenance} />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Publications */}
      <section id="publications" aria-label="Publications" className="scroll-mt-24">
        <h2 className="display flex items-center gap-3 text-2xl font-semibold">
          <BookOpen className="size-5 text-violet" strokeWidth={1.5} aria-hidden />
          Publications
        </h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
          {PUBLICATIONS.map((p) => (
            <article key={p.id} className="flex flex-col gap-2 bg-surface p-5">
              <p className="text-sm font-semibold leading-snug text-text">{p.title}</p>
              <p className="text-xs text-text-3">{p.authors}</p>
              <p className="numeral text-[11px] text-text-3">
                {p.type} · {p.year} · {p.venue}
              </p>
              <p className="text-xs leading-relaxed text-text-2">{p.abstract}</p>
              <ProvenanceChip p={p.provenance} label="Demo citation record" className="mt-1 w-fit" />
            </article>
          ))}
        </div>
      </section>

      {/* Reports */}
      <section id="reports" aria-label="Expedition reports" className="scroll-mt-24">
        <h2 className="display flex items-center gap-3 text-2xl font-semibold">
          <FileText className="size-5 text-sunrise" strokeWidth={1.5} aria-hidden />
          Expedition reports — the digital shelf
        </h2>
        <div className="mt-6 overflow-hidden rounded-xl border border-line">
          {REPORTS.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-6 border-b border-line px-5 py-4 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">{r.title}</p>
                <p className="numeral mt-1 text-[11px] text-text-3">
                  {r.year} · {r.pages} pp · {r.sizeMb} MB · {r.parsed ? "OCR-parsed" : "scan only"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {r.parsed && (
                  <span className="rounded-full border border-accent/40 bg-accent-dim px-2.5 py-1 text-[11px] font-medium text-accent">
                    Searchable
                  </span>
                )}
                <ProvenanceChip p={r.provenance} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-3">
          PDF viewers and OCR pipelines are production infrastructure; this demo build shows the shelf and parsing
          state honestly rather than stub downloads.
        </p>
      </section>
    </div>
  );
}
