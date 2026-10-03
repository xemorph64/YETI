"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { ProvenanceChip } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/**
 * Sea-Level Rise explorer — a SIMULATED educational model (§38).
 * Scenario curves are illustrative smooth pathways consistent in shape with
 * publicly discussed ice-loss ranges; coastal exposure is a simplified
 * elevation-band illustration, not a hazard map. Nothing here is live data.
 */

const START_YEAR = 2025;
const END_YEAR = 2100;

const SCENARIOS = [
  {
    id: "low" as const,
    label: "Low ice loss",
    endMeters: 0.44,
    blurb: "Sustained mitigation; slower ice-sheet response.",
    tone: "accent" as const,
  },
  {
    id: "mid" as const,
    label: "Mid pathway",
    endMeters: 0.75,
    blurb: "Current-trajectory-style pathway; accelerating contribution from glaciers and ice sheets.",
    tone: "violet" as const,
  },
  {
    id: "high" as const,
    label: "High ice loss",
    endMeters: 1.32,
    blurb: "Fast ice-sheet discharge scenario used to stress-test adaptation planning.",
    tone: "sunrise" as const,
  },
];

/** Smooth illustrative pathway: quadratic ease-out with a gentle acceleration. */
function riseAt(end: number, year: number) {
  const t = Math.min(1, Math.max(0, (year - START_YEAR) / (END_YEAR - START_YEAR)));
  return end * (1 - Math.pow(1 - t, 2.2));
}

/* Indicative city profiles: name + how much of its low-lying zone sits under
   each elevation band. Purely illustrative shape, no real hazard modelling. */
const CITIES = [
  { name: "Sundarbans", note: "Low-lying delta — tidally dominated", lowFrac: 0.62, midFrac: 0.9 },
  { name: "Kolkata", note: "Riverine megacity — embanked delta plain", lowFrac: 0.38, midFrac: 0.72 },
  { name: "Chennai", note: "Coastal plain — creek and estuary exposure", lowFrac: 0.3, midFrac: 0.6 },
  { name: "Kochi", note: "Backwater coast — harbour and low island mix", lowFrac: 0.34, midFrac: 0.66 },
];

const BANDS = [
  { label: "0–1 m", color: "var(--sunrise)" },
  { label: "1–2 m", color: "var(--violet)" },
  { label: "2–4 m", color: "var(--accent)" },
];

export function SeaLevelLab() {
  const [scenarioId, setScenarioId] = useState<(typeof SCENARIOS)[number]["id"]>("mid");
  const [year, setYear] = useState(2060);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  const series = useMemo(
    () => Array.from({ length: 16 }, (_, i) => riseAt(scenario.endMeters, START_YEAR + i * 5)),
    [scenario],
  );

  const rise = riseAt(scenario.endMeters, year);
  const w = 640;
  const h = 230;
  const padX = 46;
  const padY = 26;
  const maxY = 1.4;
  const pts = series.map((v, i) => {
    const x = padX + (i / (series.length - 1)) * (w - padX - 12);
    const y = padY + (1 - v / maxY) * (h - padY * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const markerIdx = Math.round(((year - START_YEAR) / (END_YEAR - START_YEAR)) * (series.length - 1));
  const marker = pts[Math.min(markerIdx, pts.length - 1)];

  return (
    <div className="flex flex-col gap-8">
      <section aria-label="Scenario and year controls" className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-text">1 · Choose an ice-loss pathway</h2>
            <p className="mt-1 max-w-[52ch] text-xs leading-relaxed text-text-3">
              Three illustrative pathways for how much water land ice could add to the ocean by 2100.
            </p>
          </div>
          <ProvenanceChip p="demo" label="Simulated educational model — not a forecast" />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Ice-loss scenario">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              role="radio"
              aria-checked={scenarioId === s.id}
              onClick={() => setScenarioId(s.id)}
              className={cn(
                "btn-tactile rounded-xl border p-3.5 text-left",
                scenarioId === s.id
                  ? s.tone === "sunrise"
                    ? "border-sunrise/60 bg-sunrise-dim"
                    : s.tone === "violet"
                      ? "border-violet/60 bg-violet-dim"
                      : "border-accent/60 bg-accent-dim"
                  : "border-line bg-bg hover:border-line-strong",
              )}
            >
              <span className={cn("flex items-baseline justify-between text-sm font-semibold", scenarioId === s.id ? "text-text" : "text-text-2")}>
                {s.label}
                <span className={cn("numeral text-xs", s.tone === "sunrise" ? "text-sunrise" : s.tone === "violet" ? "text-violet" : "text-accent")}>
                  +{s.endMeters.toFixed(2)} m
                </span>
              </span>
              <span className="mt-1 block text-[11px] leading-snug text-text-3">{s.blurb}</span>
            </button>
          ))}
        </div>

        <h2 className="mt-6 text-sm font-bold text-text">2 · Pick a year</h2>
        <div className="mt-2 flex items-center gap-4">
          <input
            type="range"
            min={START_YEAR}
            max={END_YEAR}
            step={1}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="dh-range flex-1"
            aria-label="Year"
          />
          <span className="numeral w-20 rounded-md border border-line-strong bg-bg px-2 py-1 text-center text-sm font-semibold text-text">
            {year}
          </span>
        </div>
      </section>

      {/* Curve */}
      <section aria-label="Simulated global sea-level rise curve" className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-bold text-text">Simulated global mean sea-level rise</h2>
          <p className="numeral text-sm text-text-2">
            <span className={cn("font-bold", scenario.tone === "sunrise" ? "text-sunrise" : scenario.tone === "violet" ? "text-violet" : "text-accent")}>
              +{rise.toFixed(2)} m
            </span>{" "}
            by {year} · {(rise * 100).toFixed(0)} cm
          </p>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Illustrative sea-level rise curve reaching ${scenario.endMeters.toFixed(2)} metres by 2100.`} className="mt-3 w-full">
          <defs>
            <linearGradient id="sl-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.35, 0.7, 1].map((f) => {
            const y = padY + f * (h - padY * 2);
            const v = maxY - f * maxY;
            return (
              <g key={f}>
                <line x1={padX} x2={w - 12} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" />
                <text x={padX - 8} y={y + 3} textAnchor="end" fontSize="10" fill="var(--text-3)" fontFamily="var(--font-mono)">
                  {v.toFixed(1)} m
                </text>
              </g>
            );
          })}
          {[2025, 2050, 2075, 2100].map((yr, i) => (
            <text
              key={yr}
              x={padX + (i / 3) * (w - padX - 12)}
              y={h - 6}
              textAnchor={i === 0 ? "start" : i === 3 ? "end" : "middle"}
              fontSize="10"
              fill="var(--text-3)"
              fontFamily="var(--font-mono)"
            >
              {yr}
            </text>
          ))}
          <path d={`${line} L${pts[pts.length - 1][0]},${h - padY} L${pts[0][0]},${h - padY} Z`} fill="url(#sl-area)" />
          <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {/* Year marker */}
          <line x1={marker[0]} x2={marker[0]} y1={padY} y2={h - padY} stroke="var(--line-strong)" strokeDasharray="3 3" />
          <circle cx={marker[0]} cy={marker[1]} r="5" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
        </svg>
        <p className="mt-2 text-[11px] leading-relaxed text-text-3">
          Illustrative smooth pathway — the shape communicates acceleration, the endpoints communicate scenario
          spread. Real projections carry uncertainty bands and regional adjustments; official numbers live with
          the scientific assessment bodies.
        </p>
      </section>

      {/* Coastal exposure */}
      <section aria-label="Indicative coastal exposure" className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-sm font-bold text-text">Indicative coastal exposure — {year}</h2>
        <p className="mt-1 max-w-[70ch] text-xs leading-relaxed text-text-3">
          A simplified elevation-band illustration: the simulated rise covers the low-lying band first, then higher
          bands. This is an intuition pump, not a flood map — real exposure depends on tides, storms, embankments
          and local topography.
        </p>
        <div className="mt-4 flex flex-wrap gap-2" aria-hidden>
          {BANDS.map((b) => (
            <span key={b.label} className="flex items-center gap-1.5 text-[10px] text-text-3">
              <span className="size-2.5 rounded-sm" style={{ background: b.color }} />
              {b.label}
            </span>
          ))}
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {CITIES.map((c) => {
            const frac = rise >= 2 ? c.midFrac : rise >= 1 ? c.midFrac * 0.55 + c.lowFrac * 0.45 : rise * c.lowFrac;
            const pct = Math.round(Math.min(1, frac / c.midFrac) * 100);
            return (
              <li key={c.name} className="rounded-xl border border-line bg-bg p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-text">{c.name}</p>
                  <p className="numeral text-xs text-text-2">{pct}%</p>
                </div>
                <p className="text-[11px] text-text-3">{c.note}</p>
                <div className="mt-2.5 flex h-3 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={`${c.name}: indicative exposure ${pct} percent of illustrated low-lying area at ${rise.toFixed(2)} metres`}>
                  <span className="h-full transition-all duration-500" style={{ width: `${Math.min(100, (rise / 2) * 100)}%`, background: "var(--sunrise)" }} />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-line bg-bg px-3.5 py-2.5 text-[11px] leading-relaxed text-text-3">
          <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
          Why this matters for India: the same ice that holds global sea level feeds the meltwater rivers and climate
          systems the monsoon renews — see the <Link href="/labs/monsoon-link" className="link-line text-accent">Arctic ↔ Monsoon link</Link>.
        </p>
      </section>

      {/* Grounding links (§70: every visual has a real function) */}
      <section aria-label="Go deeper" className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="meta-label mb-3">Grounded in the archive</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Dataset: Schirmacher SMB transects", href: "/vault/datasets/schirmacher-smb-transects" },
            { label: "Learn: Ice sheets & sea level", href: "/learn" },
            { label: "Science: Cryosphere", href: "/science/cryosphere" },
            { label: "Ask YETI about sea level", href: "/search?q=sea+level" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="btn-tactile rounded-full border border-line-strong px-3.5 py-1.5 text-xs font-medium text-text-2 hover:border-accent/50 hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
