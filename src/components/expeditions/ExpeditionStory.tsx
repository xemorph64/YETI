"use client";

/**
 * Expedition Story Mode — the documented chapter structure
 * Objective → Journey → Field Activity → Observation → Scientific
 * Significance → Outputs, with honest visual vignettes:
 *   • BurialVignette (2.5-D ice-shelf cross-section, Dakshin Gangotri era)
 *   • OceanProfileVignette (2-D CTD-style cast, Southern Ocean)
 * Both are explicitly labelled conceptual illustrations — they visualise a
 * documented process, never invented measurements.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Expedition } from "@/lib/types";
import { MiniRouteMap } from "@/components/expeditions/MiniRouteMap";
import { stationForProgramme } from "@/lib/data/stations";

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

/* ------------------------------ Story section ----------------------------- */

const CHAPTERS = [
  "Objective",
  "Journey",
  "Field activity",
  "Observation",
  "Scientific significance",
  "Outputs",
] as const;

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
          </section>

          <section ref={(el) => { refs.current[1] = el; }} aria-label="Journey" className="scroll-mt-28">
            <ChapterKicker n="02" t="Journey" />
            <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
              {exp.vessel
                ? `The season moved south aboard ${exp.vessel}, staging through the ${exp.region} sector.`
                : `The season operated across the ${exp.region} sector.`}{" "}
              Routes here are schematic — origin to programme sector, not a navigational track.
            </p>
            <div className="mt-6 rounded-xl border border-line bg-surface p-4">
              <MiniRouteLazy stationProgramme={exp.programme} />
            </div>
          </section>

          <section ref={(el) => { refs.current[2] = el; }} aria-label="Field activity" className="scroll-mt-28">
            <ChapterKicker n="03" t="Field activity" />
            <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
              Field work follows the season&apos;s science plan: station operations, traverse and sampling work
              within the {exp.region} sector, and the logistics that keep a polar camp alive. Imagery below is
              credited per asset.
            </p>
            <FieldStrip exp={exp} />
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
            {!showBurial && !showOcean && (
              <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
                Observation highlights for this season are part of the digitisation roadmap — the report series in
                the Vault carries the primary record.
              </p>
            )}
          </section>

          <section ref={(el) => { refs.current[4] = el; }} aria-label="Scientific significance" className="scroll-mt-28">
            <ChapterKicker n="05" t="Scientific significance" />
            <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
              Each season feeds the programme&apos;s long observational record: multi-year series only mean
              something because single seasons add to them. Datasets from this expedition link onward to
              publications — the graph edge that turns field work into citable science.
            </p>
            {exp.milestone && (
              <p className="mt-4 inline-flex rounded-full border border-accent/40 bg-accent-dim px-4 py-1.5 text-sm text-accent">
                Verified milestone — {exp.milestone}
              </p>
            )}
          </section>

          <section ref={(el) => { refs.current[5] = el; }} aria-label="Outputs" className="scroll-mt-28">
            <ChapterKicker n="06" t="Outputs" />
            <p className="mt-4 max-w-[70ch] text-sm leading-relaxed text-text-3">
              Everything this expedition produced, linked from one place — the chapter that closes the loop back
              into the archive.
            </p>
            <OutputsGrid expId={exp.id} stationId={exp.stationIds?.[0]} />
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

function FieldStrip({ exp }: { exp: Expedition }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      {exp.objectives.slice(0, 4).map((o, i) => (
        <div key={o} className="rounded-lg border border-line bg-surface p-3.5">
          <span className="numeral text-[10px] text-accent">{String(i + 1).padStart(2, "0")}</span>
          <p className="mt-1 text-xs leading-relaxed text-text-2">{o}</p>
        </div>
      ))}
    </div>
  );
}

function OutputsGrid({ expId, stationId }: { expId: string; stationId?: string }) {
  void expId;
  return (
    <div className="mt-6 grid gap-3 md:grid-cols-3">
      <a href="/vault#reports" className="btn-tactile rounded-xl border border-line bg-surface p-5 hover:border-accent/50">
        <p className="meta-label !text-[9px]">Reports</p>
        <p className="mt-1.5 text-sm font-semibold text-text">Expedition report shelf →</p>
      </a>
      <a href="/vault" className="btn-tactile rounded-xl border border-line bg-surface p-5 hover:border-accent/50">
        <p className="meta-label !text-[9px]">Datasets</p>
        <p className="mt-1.5 text-sm font-semibold text-text">Data catalogue →</p>
      </a>
      <a href={stationId ? `/stations/${stationId}` : "/stations"} className="btn-tactile rounded-xl border border-line bg-surface p-5 hover:border-accent/50">
        <p className="meta-label !text-[9px]">Stations</p>
        <p className="mt-1.5 text-sm font-semibold text-text">Where it happened →</p>
      </a>
    </div>
  );
}
