"use client";

/**
 * Expedition Story Mode — the documented chapter structure
 * Objective → Journey → Field Activity → Observation → Scientific
 * Significance → Outputs, with honest visual vignettes:
 *   • BurialVignette (2.5-D ice-shelf cross-section, Dakshin Gangotri era)
 *   • OceanProfileVignette (2-D CTD-style cast, Southern Ocean)
 *   • IceCoreVignette (depth slider → layer reveal, cryosphere seasons)
 * All are explicitly labelled conceptual illustrations — they visualise
 * documented processes, never invented measurements. Each chapter closes
 * with a short "YETI's field note" from the archive mascot, and the Outputs
 * chapter links this expedition's actual records from the Vault.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bird,
  Drill,
  FlaskConical,
  Mountain,
  MountainSnow,
  Satellite,
  Snowflake,
  Sparkles,
  Waves,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Expedition } from "@/lib/types";
import { MiniRouteMap } from "@/components/expeditions/MiniRouteMap";
import { MascotBadge } from "@/components/yeti/Mascot";
import { getStation, stationForProgramme } from "@/lib/data/stations";
import { DATASETS, REPORTS } from "@/lib/data/vault";

/* ------------------------------ Burial vignette --------------------------- */

const YEARS = [1983, 1985, 1987, 1990];

function BurialVignette() {
  const [yearIdx, setYearIdx] = useState(0);
  const year = YEARS[yearIdx];
  // snow layers accumulating above the station
  const layerCount = yearIdx + 1;

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-surface" aria-label="Snow accumulation over Dakshin Gangotri, conceptual illustration">
      <div
        className="relative h-[300px] overflow-hidden"
        style={{ perspective: "900px" }}
      >
        <div
          className="absolute inset-0 origin-top transition-transform duration-700"
          style={{ transform: "rotateX(14deg)" }}
          aria-hidden
        >
          {/* sky */}
          <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-[#0b1d33] to-[#123049]" />
          {/* ice shelf base */}
          <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-b from-[#bfe0ef] to-[#7fb3cd]" />
          {/* annual snow layers — one per year, later ones on top */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute inset-x-0 bg-[#e8f4fb]/90 shadow-[0_-2px_8px_rgba(10,22,40,0.25)] transition-all duration-700"
              style={{
                bottom: `calc(38% + ${i * 22}px)`,
                height: "22px",
                opacity: i < layerCount ? 1 : 0,
                transform: i < layerCount ? "translateY(0)" : "translateY(14px)",
              }}
            />
          ))}
          {/* the station, progressively swallowed */}
          <svg
            viewBox="0 0 120 70"
            className="absolute bottom-[24%] left-1/2 w-36 -translate-x-1/2 transition-all duration-700"
            style={{ transform: `translateX(-50%) translateY(${layerCount * 13}px)` }}
            aria-hidden
          >
            {/* huts on stilts */}
            <rect x="18" y="18" width="34" height="22" rx="2" fill="#f2f6f9" stroke="#5b768c" strokeWidth="2" />
            <path d="M14 18 L35 4 L56 18 Z" fill="#ff8a5c" stroke="#5b768c" strokeWidth="2" />
            <rect x="68" y="24" width="26" height="16" rx="2" fill="#e8eef3" stroke="#5b768c" strokeWidth="2" />
            <line x1="22" y1="40" x2="22" y2="52" stroke="#5b768c" strokeWidth="3" />
            <line x1="48" y1="40" x2="48" y2="52" stroke="#5b768c" strokeWidth="3" />
            <line x1="72" y1="40" x2="72" y2="52" stroke="#5b768c" strokeWidth="3" />
            <line x1="90" y1="40" x2="90" y2="52" stroke="#5b768c" strokeWidth="3" />
            {/* antenna */}
            <line x1="35" y1="4" x2="35" y2="-6" stroke="#5b768c" strokeWidth="2" />
            <circle cx="35" cy="-7" r="2" fill="#3be8b0" />
          </svg>
          {/* year marker */}
          <div className="absolute right-4 top-4 rounded-md border border-white/25 bg-[#071020]/80 px-3 py-1.5">
            <span className="numeral text-xl font-bold text-[#3be8b0]">{year}</span>
          </div>
        </div>
      </div>
      <figcaption className="border-t border-line px-5 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">The shelf keeps what it lends</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-text-3">
              Conceptual illustration of a documented process — annual accumulation gradually burying the
              Dakshin Gangotri station (1983–1990). Layer count is illustrative, not measured.
            </p>
          </div>
          <label className="flex shrink-0 items-center gap-3 text-xs text-text-2">
            Year
            <input
              type="range"
              min={0}
              max={YEARS.length - 1}
              value={yearIdx}
              onChange={(e) => setYearIdx(Number(e.target.value))}
              className="dh-range w-36"
              aria-label="Scrub burial year"
            />
            <span className="numeral w-10 text-right text-text">{year}</span>
          </label>
        </div>
      </figcaption>
    </figure>
  );
}

/* --------------------------- Ocean profile vignette ------------------------ */

const CTD = [
  { depth: 0, temp: 0.4 },
  { depth: 40, temp: 0.2 },
  { depth: 90, temp: -0.6 },
  { depth: 160, temp: -1.2 },
  { depth: 260, temp: -1.6 },
  { depth: 380, temp: 0.6 },
  { depth: 520, temp: 1.4 },
];

function OceanProfileVignette() {
  const w = 560, h = 260, px = 46, py = 18;
  const maxD = 560, tMin = -2, tMax = 2;
  const x = (t: number) => px + ((t - tMin) / (tMax - tMin)) * (w - px - 20);
  const y = (d: number) => py + (d / maxD) * (h - py * 2);
  const pts = CTD.map((c) => `${x(c.temp).toFixed(1)},${y(c.depth).toFixed(1)}`).join(" ");

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-surface" aria-label="CTD cast profile, synthetic demonstration">
      <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full" role="img" aria-label="Temperature against depth">
        {/* sea surface */}
        <line x1={px} y1={y(0)} x2={w - 20} y2={y(0)} className="stroke-accent" strokeWidth="1.4" opacity="0.7" />
        <text x={px + 6} y={y(0) - 6} fontSize="10" className="fill-accent" style={{ fontFamily: "var(--font-mono)" }}>sea level</text>
        {/* depth gridlines */}
        {[100, 200, 300, 400, 500].map((d) => (
          <g key={d}>
            <line x1={px} y1={y(d)} x2={w - 20} y2={y(d)} className="stroke-line" strokeWidth="1" strokeDasharray="2 6" />
            <text x={px - 8} y={y(d) + 3} fontSize="9" textAnchor="end" className="fill-text-3" style={{ fontFamily: "var(--font-mono)" }}>
              {d}m
            </text>
          </g>
        ))}
        {/* temperature axis */}
        {[-2, -1, 0, 1, 2].map((t) => (
          <text key={t} x={x(t)} y={h - 4} fontSize="9" textAnchor="middle" className="fill-text-3" style={{ fontFamily: "var(--font-mono)" }}>
            {t}°C
          </text>
        ))}
        {/* the cast */}
        <polyline points={pts} fill="none" className="stroke-violet" strokeWidth="2.4" strokeLinejoin="round" />
        {CTD.map((c) => (
          <circle key={c.depth} cx={x(c.temp)} cy={y(c.depth)} r="3.4" className="fill-violet" stroke="var(--bg)" strokeWidth="1.4" />
        ))}
        {/* winter-water annotation */}
        <text x={x(-1.6) + 10} y={y(260)} fontSize="10" className="fill-text-2" style={{ fontFamily: "var(--font-mono)" }}>
          winter water
        </text>
        <text x={x(1.4) - 10} y={y(520) - 10} fontSize="10" textAnchor="end" className="fill-text-2" style={{ fontFamily: "var(--font-mono)" }}>
          warm deep water
        </text>
      </svg>
      <figcaption className="border-t border-line px-5 py-3.5">
        <p className="text-sm font-semibold text-text">Reading the water column</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-text-3">
          CTD casts profile temperature and salinity with depth — the structure of Prydz Bay water masses.
          <strong className="text-text-2"> Synthetic demonstration profile</strong> for schema illustration; official
          data lives in the Vault datasets.
        </p>
      </figcaption>
    </figure>
  );
}

/* ----------------------------- Ice core vignette --------------------------- */

const CORE_MAX = 130;

const CORE_LAYERS = [
  {
    from: 0,
    to: 6,
    name: "Recent snow & firn",
    age: "0–10 years",
    color: "#f3fafd",
    note: "Loose snow compacting under its own weight — this season's weather is still readable in the top metres.",
  },
  {
    from: 6,
    to: 18,
    name: "Consolidating firn",
    age: "10–80 years",
    color: "#dceef7",
    note: "Pores between grains are closing; the air here is on its way to becoming a sealed sample of past atmosphere.",
  },
  {
    from: 18,
    to: 38,
    name: "Young ice",
    age: "≈80–250 years",
    color: "#bfe0ef",
    note: "Bubbles sealed — an archive of the industrial-era atmosphere, captured on the way down.",
  },
  {
    from: 38,
    to: 70,
    name: "Layered ice",
    age: "≈250–600 years",
    color: "#9cc9e0",
    note: "Annual bands with volcanic and sea-salt horizons — the layers used to count years the way tree rings are counted.",
  },
  {
    from: 70,
    to: 110,
    name: "Older ice",
    age: "beyond ≈600 years",
    color: "#78a9c4",
    note: "Bands grow thinner with depth — the reason deep cores are drilled and counted with care.",
  },
  {
    from: 110,
    to: CORE_MAX,
    name: "Deep ice (schematic)",
    age: ">1,000 years (illustrative)",
    color: "#5889a8",
    note: "At real drill sites, ice this deep carries climate cycles spanning many millennia.",
  },
];

function IceCoreVignette() {
  const [depth, setDepth] = useState(24);
  const layer =
    CORE_LAYERS.find((l) => depth >= l.from && depth < l.to) ?? CORE_LAYERS[CORE_LAYERS.length - 1];

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-surface" aria-label="Ice core layer reveal, conceptual demonstration">
      <div className="grid gap-6 p-5 md:grid-cols-[190px_1fr] md:p-6">
        {/* core column */}
        <div className="relative h-[300px] overflow-hidden rounded-lg border border-line-strong" aria-hidden>
          {CORE_LAYERS.map((l) => (
            <div
              key={l.name}
              className="absolute inset-x-0 transition-opacity duration-500"
              style={{
                top: `${(l.from / CORE_MAX) * 100}%`,
                height: `${((l.to - l.from) / CORE_MAX) * 100}%`,
                background: `linear-gradient(180deg, ${l.color}, ${l.color}cc)`,
                opacity: depth >= l.to ? 1 : depth > l.from ? 0.55 : 0.18,
              }}
            />
          ))}
          {/* depth ruler */}
          {[0, 50, 100].map((m) => (
            <div key={m} className="absolute left-1" style={{ top: `calc(${(m / CORE_MAX) * 100}% - 6px)` }}>
              <span className="numeral rounded bg-[#071020]/70 px-1 text-[9px] text-white/85">{m} m</span>
            </div>
          ))}
          {/* drill marker */}
          <div className="absolute inset-x-0 transition-[top] duration-200" style={{ top: `${(depth / CORE_MAX) * 100}%` }}>
            <div className="h-[2px] w-full bg-sunrise" />
          </div>
        </div>
        {/* layer card */}
        <div className="flex flex-col justify-center">
          <p className="meta-label">
            Drill depth · <span className="numeral">{depth} m</span>
          </p>
          <p className="display mt-2 text-xl font-bold text-text md:text-2xl">{layer.name}</p>
          <p className="mt-2 inline-flex w-fit rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-text-2">
            Approximate age band&nbsp;<span className="numeral text-text">{layer.age}</span>
          </p>
          <p className="mt-3 max-w-[55ch] text-sm leading-relaxed text-text-2">{layer.note}</p>
        </div>
      </div>
      <figcaption className="border-t border-line px-5 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">A tape recorder made of ice</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-text-3">
              Conceptual demonstration core — depth-to-age bands illustrate how firn closes into ice and layers
              accumulate. Real age scales are measured per drill site, not assumed.
            </p>
          </div>
          <label className="flex shrink-0 items-center gap-3 text-xs text-text-2">
            Depth
            <input
              type="range"
              min={0}
              max={CORE_MAX}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="dh-range w-36"
              aria-label="Scrub ice core depth"
            />
            <span className="numeral w-12 text-right text-text">{depth} m</span>
          </label>
        </div>
      </figcaption>
    </figure>
  );
}

/* ------------------------------ Story section ----------------------------- */

const CHAPTERS = [
  "Objective",
  "Journey",
  "Field activity",
  "Observation",
  "Scientific significance",
  "Outputs",
] as const;

/* Illustrative field activities for each science-plan theme. The mapping is a
   demonstration reconstruction of standard polar practice — not a season log. */
const FIELD_ACTIVITIES: Record<string, { icon: LucideIcon; detail: string }> = {
  Glaciology: {
    icon: MountainSnow,
    detail: "Stake farms re-measured and snow pits logged on foot across the traverse sector.",
  },
  "Atmospheric sciences": {
    icon: Wind,
    detail: "Weather masts serviced, radiosonde launches run, and the daily meteorological log kept unbroken.",
  },
  Oceanography: {
    icon: Waves,
    detail: "CTD casts and expendable-bathythermograph sections reading temperature and salinity down the column.",
  },
  "Sea-ice observations": {
    icon: Snowflake,
    detail: "Bridge watches logging concentration, floe size and ice type along the track.",
  },
  Geosciences: {
    icon: Mountain,
    detail: "Rock sampling and structural mapping on the ice-free ground the sector offers.",
  },
  "Remote sensing ground truth": {
    icon: Satellite,
    detail: "Ground-truth sites measured so satellite retrievals can be checked against reality.",
  },
  "Polar biology": {
    icon: Bird,
    detail: "Lichen, moss and seabird surveys recording biodiversity around the station.",
  },
  "Environmental monitoring": {
    icon: Activity,
    detail: "Waste, fuel and footprint protocols monitored through the season.",
  },
  "Upper atmosphere studies": {
    icon: Sparkles,
    detail: "Optical instruments and riometers watching auroral and ionospheric processes.",
  },
  "Ice-core reconnaissance": {
    icon: Drill,
    detail: "Drilling rehearsals and pit-to-core stratigraphy work for the deeper ice programme.",
  },
  Biogeochemistry: {
    icon: FlaskConical,
    detail: "Water sampled for nutrients and carbon — the ocean's chemistry collected in bottles.",
  },
};

const THEME_SIGNIFICANCE: Record<string, string> = {
  Glaciology: "glacier and ice-shelf mass balance — the numbers that decide how much water the ice holds",
  "Atmospheric sciences": "a continuous atmospheric record from a region that anchors Southern Hemisphere climate",
  Oceanography: "water-column structure where cold fresh layers sit over warm deep water",
  "Sea-ice observations": "sea-ice extent and type records — the planet's seasonal thermostat, measured watch by watch",
  Geosciences: "the geological story of Gondwana's southern fragments",
  "Remote sensing ground truth": "ground measurements that calibrate what satellites claim from orbit",
  "Polar biology": "biodiversity baselines in one of Earth's least sampled ecosystems",
  "Environmental monitoring": "a measurable account of the human footprint on polar ground",
  "Upper atmosphere studies": "auroral and ionospheric processes over the polar cap",
  "Ice-core reconnaissance": "the climate archive written in layered ice",
  Biogeochemistry: "carbon and nutrient cycling between ocean and atmosphere",
};

function significanceText(exp: Expedition): string {
  const themes = exp.objectives.map((o) => THEME_SIGNIFICANCE[o]).filter(Boolean);
  const themesText =
    themes.length > 0 ? `This season's work adds to ${themes.slice(0, 2).join(" and ")}. ` : "";
  const head =
    exp.programme === "Arctic"
      ? "India's Arctic record only began in 2007, so every season carries extra weight in a young series."
      : exp.programme === "Southern Ocean"
        ? "The Goa–Prydz Bay corridor is the ocean engine that connects Antarctic ice to the Indian monsoon — the link NCPOR's Southern Ocean work exists to measure."
        : "A single season never stands alone: its value is the way it stacks onto the decades before it.";
  return `${themesText}${head} Datasets from this expedition link onward to publications — the graph edge that turns field work into citable science.`;
}

function journeyWaypoints(exp: Expedition): { label: string; detail: string }[] {
  if (exp.programme === "Arctic") {
    return [
      { label: "Departure — Indian gateway port", detail: "Load-out, science cargo and cold-room checks" },
      { label: "Longyearbyen, Svalbard", detail: "International Arctic gateway (schematic stop)" },
      { label: "Ny-Ålesund — Himadri", detail: "Station base for the season's science plan" },
    ];
  }
  if (exp.programme === "Southern Ocean") {
    return [
      { label: "Goa — departure", detail: "Vessel load-out for the Goa–Prydz Bay transect" },
      { label: "Indian Ocean crossing", detail: "En-route sections as the vessel works south" },
      { label: "Prydz Bay — work sector", detail: "Casts, sea-ice watches and station support" },
      { label: "Return transect", detail: "Repeat sections and demobilisation" },
    ];
  }
  const station = exp.stationIds?.[0] ? getStation(exp.stationIds[0]) : undefined;
  return [
    { label: "Departure — Indian gateway port", detail: "Load-out and science cargo manifest" },
    { label: "Indian Ocean crossing", detail: "En-route observations and ice-navigation preparation" },
    { label: "Ice edge", detail: "First sea ice — operations move onto ice coordination" },
    {
      label: station ? station.name : exp.region,
      detail: "Station base and field deployments across the sector",
    },
  ];
}

function fieldNote(i: number, exp: Expedition): string {
  switch (i) {
    case 0:
      return "A science plan is a promise made before the ship leaves. Each objective on this page should later surface as a record in the Vault.";
    case 1:
      return "Schematic routes are honest routes — they show how a season is structured, not a navigational track.";
    case 2:
      return "Polar field work is mostly logistics: the science happens in the gaps between keeping people warm and instruments alive.";
    case 3:
      if (exp.programme === "Southern Ocean")
        return "One cast is a photograph; a season of casts is a film. Patterns only emerge when profiles stack across years.";
      if (exp.programme === "Antarctic" && exp.startYear <= 1990 && exp.startYear >= 1982)
        return "Dakshin Gangotri's burial is an observation you can watch without a single instrument — the ice did the recording.";
      if (exp.objectives.includes("Ice-core reconnaissance"))
        return "An ice core is a tape recorder: each year pressed into a layer. Scrub the depth and read it back.";
      return "When a season's highlights are not digitised yet, the archive says so — honest gaps are part of the record too.";
    case 4:
      return "No single season proves anything — records matter for how they stack. Every season here is one layer in a decades-deep series.";
    case 5:
      return "If it isn't in the archive, it didn't happen. Every output linked here closes the loop back into the Vault.";
    default:
      return "";
  }
}

export function ExpeditionStory({ exp }: { exp: Expedition }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = refs.current.indexOf(e.target as HTMLElement);
            if (i >= 0) setActive(i);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollTo = useCallback((i: number) => {
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const showBurial = exp.programme === "Antarctic" && exp.startYear <= 1990 && exp.startYear >= 1982;
  const showOcean = exp.programme === "Southern Ocean";
  const showIceCore =
    exp.objectives.includes("Ice-core reconnaissance") ||
    (exp.programme === "Arctic" && exp.objectives.includes("Glaciology"));
  const waypoints = journeyWaypoints(exp);
  const significance = significanceText(exp);

  return (
    <section aria-label="Expedition story" className="hairline-t bg-surface/40">
      <div className="dh-container grid gap-10 py-16 lg:grid-cols-[200px_1fr]">
        {/* chapter rail */}
        <aside className="h-fit lg:sticky lg:top-28" aria-label="Story chapters">
          <p className="meta-label mb-3">Story mode</p>
          <ol className="flex flex-row flex-wrap gap-1.5 lg:flex-col">
            {CHAPTERS.map((c, i) => (
              <li key={c}>
                <button
                  onClick={() => scrollTo(i)}
                  aria-current={active === i ? "step" : undefined}
                  className={cn(
                    "btn-tactile flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px]",
                    active === i ? "bg-accent-dim font-semibold text-accent" : "text-text-3 hover:text-text",
                  )}
                >
                  <span className={cn("numeral text-[10px]", active === i ? "text-accent" : "text-text-3")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        {/* chapters */}
        <div className="flex flex-col gap-20">
          <section
            ref={(el) => { refs.current[0] = el; }}
            aria-label="Objective"
            className="scroll-mt-28"
          >
            <ChapterKicker n="01" t="Objective" />
            <p className="mt-4 max-w-[70ch] text-lg leading-relaxed text-text-2">{exp.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {exp.objectives.map((o) => (
                <li key={o} className="rounded-full border border-line-strong bg-surface px-4 py-1.5 text-sm text-text-2">
                  {o}
                </li>
              ))}
            </ul>
            <FieldNote>{fieldNote(0, exp)}</FieldNote>
          </section>

          <section ref={(el) => { refs.current[1] = el; }} aria-label="Journey" className="scroll-mt-28">
            <ChapterKicker n="02" t="Journey" />
            <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
              {exp.vessel
                ? `The season moved south aboard ${exp.vessel}, staging through the ${exp.region} sector.`
                : `The season operated across the ${exp.region} sector.`}{" "}
              Routes here are schematic — origin to programme sector, not a navigational track.
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-line bg-surface p-4">
                <MiniRouteLazy stationProgramme={exp.programme} />
              </div>
              <div className="rounded-xl border border-line bg-surface p-5">
                <p className="meta-label mb-4">Schematic itinerary</p>
                <ol className="relative flex flex-col border-l border-line-strong pl-5">
                  {waypoints.map((w) => (
                    <li key={w.label} className="relative py-2 first:pt-0 last:pb-0">
                      <span className="absolute -left-[25px] top-1.5 size-2.5 rounded-full border-2 border-accent bg-surface" aria-hidden />
                      <p className="text-sm font-semibold text-text">{w.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-text-3">{w.detail}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-[10px] text-text-3">
                  Demonstration itinerary — stops are schematic, not a voyage log.
                </p>
              </div>
            </div>
            <FieldNote>{fieldNote(1, exp)}</FieldNote>
          </section>

          <section ref={(el) => { refs.current[2] = el; }} aria-label="Field activity" className="scroll-mt-28">
            <ChapterKicker n="03" t="Field activity" />
            <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
              Field work follows the season&apos;s science plan: station operations, traverse and sampling work
              within the {exp.region} sector, and the logistics that keep a polar camp alive. Each objective below
              maps to the kind of activity it drives in the field.
            </p>
            <FieldStrip exp={exp} />
            <FieldNote>{fieldNote(2, exp)}</FieldNote>
          </section>

          <section ref={(el) => { refs.current[3] = el; }} aria-label="Observation" className="scroll-mt-28">
            <ChapterKicker n="04" t="Observation" />
            {showBurial && (
              <>
                <p className="mb-6 mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
                  Some observations are made over decades, not seasons. Dakshin Gangotri taught the programme a
                  lesson about moving ice — scrub the years and watch a documented process unfold.
                </p>
                <BurialVignette />
              </>
            )}
            {showOcean && (
              <>
                <p className="mb-6 mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
                  Southern Ocean cruises read the water column: where cold fresh layers sit over warm deep water
                  decides everything above them.
                </p>
                <OceanProfileVignette />
              </>
            )}
            {showIceCore && (
              <>
                <p className="mb-6 mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
                  Some seasons read the ice itself. A core is a stack of years — scrub the drill depth and watch
                  the layers give up their story.
                </p>
                <IceCoreVignette />
              </>
            )}
            {!showBurial && !showOcean && !showIceCore && (
              <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
                Observation highlights for this season are part of the digitisation roadmap — the report series in
                the Vault carries the primary record.
              </p>
            )}
            <FieldNote>{fieldNote(3, exp)}</FieldNote>
          </section>

          <section ref={(el) => { refs.current[4] = el; }} aria-label="Scientific significance" className="scroll-mt-28">
            <ChapterKicker n="05" t="Scientific significance" />
            <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">{significance}</p>
            {exp.milestone && (
              <p className="mt-4 inline-flex rounded-full border border-accent/40 bg-accent-dim px-4 py-1.5 text-sm text-accent">
                Verified milestone — {exp.milestone}
              </p>
            )}
            <FieldNote>{fieldNote(4, exp)}</FieldNote>
          </section>

          <section ref={(el) => { refs.current[5] = el; }} aria-label="Outputs" className="scroll-mt-28">
            <ChapterKicker n="06" t="Outputs" />
            <p className="mt-4 max-w-[70ch] text-sm leading-relaxed text-text-3">
              Everything this expedition produced, linked from one place — the chapter that closes the loop back
              into the archive.
            </p>
            <OutputsGrid exp={exp} />
            <FieldNote>{fieldNote(5, exp)}</FieldNote>
          </section>
        </div>
      </div>
    </section>
  );
}

function ChapterKicker({ n, t }: { n: string; t: string }) {
  return (
    <p className="flex items-baseline gap-3">
      <span className="numeral text-sm font-bold text-accent">{n}</span>
      <span className="display text-2xl font-bold text-text md:text-3xl">{t}</span>
    </p>
  );
}

function MiniRouteLazy({ stationProgramme }: { stationProgramme: string }) {
  const st = stationForProgramme(stationProgramme);
  return <MiniRouteMap to={st} label="Schematic origin → sector. Not a navigational track." />;
}

/* YETI's field note — a calm, scientific one-liner from the archive mascot.
   Never childish: it reads like a margin annotation in a field notebook. */
function FieldNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-lg border border-line bg-surface/80 px-4 py-3">
      <MascotBadge state="explaining" className="mt-0.5 h-8 w-11 shrink-0" />
      <div className="min-w-0">
        <p className="meta-label !text-[9px]">YETI&apos;s field note</p>
        <p className="mt-1 text-xs leading-relaxed text-text-2">{children}</p>
      </div>
    </div>
  );
}

function FieldStrip({ exp }: { exp: Expedition }) {
  const cards = exp.objectives.map((o) => ({
    objective: o,
    icon: FIELD_ACTIVITIES[o]?.icon ?? Snowflake,
    detail: FIELD_ACTIVITIES[o]?.detail ?? "Season-plan activities carried out as scheduled.",
  }));
  return (
    <div className="mt-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((c, i) => (
          <div key={c.objective} className="rounded-lg border border-line bg-surface p-4">
            <div className="flex items-center gap-2">
              <c.icon className="size-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
              <span className="meta-label !text-[9px]">
                {String(i + 1).padStart(2, "0")} · {c.objective}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text-2">{c.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-text-3">
        Illustrative activities typical of each science-plan theme — a demonstration reconstruction, not a season log.
      </p>
    </div>
  );
}

function OutputsGrid({ exp }: { exp: Expedition }) {
  const stationId = exp.stationIds?.[0];
  const reports = useMemo(() => REPORTS.filter((r) => r.expeditionId === exp.id), [exp.id]);
  const datasets = useMemo(
    () => DATASETS.filter((d) => d.expeditionId === exp.id || d.stationId === stationId),
    [exp.id, stationId],
  );
  const shownDatasets = datasets.slice(0, 4);

  return (
    <div className="mt-6 grid gap-3 md:grid-cols-3">
      <div className="rounded-xl border border-line bg-surface p-5">
        <p className="meta-label">Reports · {reports.length} in archive</p>
        {reports.length > 0 ? (
          <ul className="mt-3 flex flex-col divide-y divide-line">
            {reports.map((r) => (
              <li key={r.id}>
                <Link href="/vault#reports" className="group flex items-baseline justify-between gap-3 py-2.5">
                  <span className="text-sm font-medium leading-snug text-text group-hover:text-accent">{r.title}</span>
                  <span className="numeral shrink-0 text-[11px] text-text-3">{r.pages} pp</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs leading-relaxed text-text-3">
            No report digitised for this season yet — the digitisation roadmap covers it. The full season series
            lives on <Link href="/vault#reports" className="link-line text-accent">the Vault report shelf</Link>.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-line bg-surface p-5">
        <p className="meta-label">Datasets · {datasets.length} in catalogue</p>
        {shownDatasets.length > 0 ? (
          <>
            <ul className="mt-3 flex flex-col divide-y divide-line">
              {shownDatasets.map((d) => (
                <li key={d.id}>
                  <Link href={`/vault/datasets/${d.slug}`} className="group flex items-baseline justify-between gap-3 py-2.5">
                    <span className="text-sm font-medium leading-snug text-text group-hover:text-accent">{d.title}</span>
                    <span className="numeral shrink-0 text-[11px] text-text-3">{d.version}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {datasets.length > shownDatasets.length && (
              <Link href="/vault" className="link-line mt-2 inline-block text-xs text-accent">
                +{datasets.length - shownDatasets.length} more in the catalogue →
              </Link>
            )}
          </>
        ) : (
          <p className="mt-3 text-xs leading-relaxed text-text-3">
            No dataset ingested for this record in the demo build — related seasons live in the{" "}
            <Link href="/vault" className="link-line text-accent">Vault data catalogue</Link>.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-line bg-surface p-5">
        <p className="meta-label">Stations</p>
        <Link
          href={stationId ? `/stations/${stationId}` : "/stations"}
          className="btn-tactile mt-3 flex items-center justify-between rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm font-semibold text-text hover:border-accent/50"
        >
          Where it happened →
        </Link>
        <p className="mt-3 text-xs leading-relaxed text-text-3">
          Station pages carry the observation context: where instruments sit, what they watch, and how long the
          record runs.
        </p>
      </div>
    </div>
  );
}
