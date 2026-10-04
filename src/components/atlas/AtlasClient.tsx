"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Info, Pause, Play, X } from "lucide-react";
import { YetiGlobe, GOA, STATION_POINTS, type ArcSpec, type GlobeHandle, type GlobeStation } from "@/components/globe/YetiGlobe";
import { GlobeFallback } from "@/components/globe/GlobeFallback";
import { EXPEDITIONS, getExpedition } from "@/lib/data/expeditions";
import { getStation } from "@/lib/data/stations";
import { Chip, ProvenanceChip } from "@/components/ui/primitives";
import { toRoman } from "@/lib/utils";

const PROGRAMMES = ["Antarctic", "Arctic", "Southern Ocean"] as const;
const DECADES = [1980, 1990, 2000, 2010, 2020] as const;

const PROGRAMME_COLOR: Record<string, [string, string]> = {
  Antarctic: ["#3BE8B0", "rgba(59,232,176,0.06)"],
  Arctic: ["#8A6CFF", "rgba(138,108,255,0.06)"],
  "Southern Ocean": ["#FF8A5C", "rgba(255,138,92,0.06)"],
};

// First Indian Arctic expedition: 2007. The north pin stays off the globe before then.
const ARCTIC_FROM = 2007;

const NEAREST_STATION: Record<string, GlobeStation> = {
  Antarctic: STATION_POINTS[0],
  Arctic: STATION_POINTS[2],
  "Southern Ocean": STATION_POINTS[1],
};

export function AtlasClient() {
  const globeHandle = useRef<GlobeHandle | null>(null);
  const [programmes, setProgrammes] = useState<string[]>([...PROGRAMMES]);
  const [decades, setDecades] = useState<number[]>([...DECADES]);
  const [year, setYear] = useState(2026);
  const [playing, setPlaying] = useState(false);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<GlobeStation | null>(null);

  const arcs = useMemo<ArcSpec[]>(
    () =>
      EXPEDITIONS.filter(
        (e) =>
          programmes.includes(e.programme) &&
          decades.some((d) => e.startYear >= d && e.startYear < d + 10) &&
          e.startYear <= year,
      ).map((e) => {
        const st = NEAREST_STATION[e.programme];
        return {
          startLat: GOA.lat,
          startLng: GOA.lng,
          endLat: st.lat,
          endLng: st.lng,
          color: PROGRAMME_COLOR[e.programme],
          altitude: 0.1 + ((e.startYear - 1981) % 14) * 0.011,
          stroke: 0.4,
          ref: e.id,
        };
      }),
    [programmes, decades, year],
  );

  const stations = useMemo(
    () => (year < ARCTIC_FROM ? STATION_POINTS.filter((s) => s.lat < 0) : STATION_POINTS),
    [year],
  );

  const focusStation = useCallback((s: GlobeStation) => {
    globeHandle.current?.pointOfView({ lat: s.lat * 0.82, lng: s.lng, altitude: 1.5 }, 900);
  }, []);

  const toggleProgramme = (p: string) => {
    setProgrammes((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };
  const toggleDecade = (d: number) => {
    setDecades((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  // Timeline play: sweeps 1981 → 2026 in ~9s (skipped under reduced motion)
  const play = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (
      typeof document !== "undefined" &&
      (document.documentElement.getAttribute("data-reduced-motion") === "true" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      setYear(2026);
      return;
    }
    setPlaying(true);
    const start = performance.now();
    const from = year >= 2026 ? 1981 : year;
    const dur = ((2026 - from) / 45) * 9000;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setYear(Math.round(1981 + (2026 - 1981) * ((from - 1981) / 45 + p * ((2026 - from) / 45))));
      if (p < 1) requestAnimationFrame(tick);
      else setPlaying(false);
    };
    requestAnimationFrame(tick);
  };

  const exp = selectedExp ? getExpedition(selectedExp) : null;
  const station = selectedStation ? getStation(selectedStation.slug ?? "") : null;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <GlobeFallback arcs={arcs} stations={stations}>
          <YetiGlobe
            arcs={arcs}
            stations={stations}
            pov={{ lat: 18, lng: 55, altitude: 2.2 }}
            zoomEnabled
            autoRotate={false}
            handleRef={globeHandle}
            onArcClick={(a) => {
              if (a.ref?.startsWith("ARC") || a.ref?.startsWith("SOE") || a.ref?.startsWith("EXP")) {
                setSelectedStation(null);
                setSelectedExp(a.ref);
                const e = getExpedition(a.ref);
                if (e) focusStation(NEAREST_STATION[e.programme]);
              }
            }}
            onStationClick={(s) => {
              setSelectedExp(null);
              setSelectedStation(s);
              focusStation(s);
            }}
          />
        </GlobeFallback>
      </div>

      {/* Top gradient for legibility */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-bg via-bg/80 to-transparent md:h-28 md:from-bg/85 md:via-transparent" aria-hidden />

      {/* Header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 pt-20 md:pt-24">
        <div className="dh-container pointer-events-auto flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="meta-label">The Expedition Atlas</p>
            <h1 className="display mt-2 text-3xl font-bold md:text-4xl">The archive, plotted on the Earth.</h1>
          </div>
          <p className="max-w-[46ch] text-xs leading-relaxed text-text-2 [text-shadow:0_1px_10px_rgba(7,16,32,0.9),0_0_3px_rgba(7,16,32,0.95)]">
            {arcs.length} route{arcs.length === 1 ? "" : "s"} drawn · click an arc or a station pin. Routes are
            schematic (origin → programme sector), not navigational tracks.
          </p>
        </div>
      </div>

      {/* Filter rail */}
      <div className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-6 rounded-xl border border-line bg-bg/80 p-5 backdrop-blur-xl lg:flex">
        <div>
          <p className="meta-label mb-2.5">Programme</p>
          <div className="flex flex-col items-start gap-2">
            {PROGRAMMES.map((p) => (
              <Chip key={p} active={programmes.includes(p)} onClick={() => toggleProgramme(p)}>
                <span className="size-2 rounded-full" style={{ background: PROGRAMME_COLOR[p][0] }} aria-hidden />
                {p}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="meta-label mb-2.5">Decade</p>
          <div className="flex flex-wrap gap-2">
            {DECADES.map((d) => (
              <Chip key={d} active={decades.includes(d)} onClick={() => toggleDecade(d)}>
                {String(d).slice(2)}s
              </Chip>
            ))}
          </div>
        </div>
        <div className="border-t border-line pt-4">
          <p className="meta-label mb-2">Legend</p>
          <ul className="space-y-1.5 text-xs text-text-2">
            <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-accent" aria-hidden /> Station pin</li>
            <li className="flex items-center gap-2"><span className="h-px w-4 bg-accent" aria-hidden /> Antarctic route</li>
            <li className="flex items-center gap-2"><span className="h-px w-4 bg-violet" aria-hidden /> Arctic route</li>
            <li className="flex items-center gap-2"><span className="h-px w-4 bg-sunrise" aria-hidden /> Southern Ocean</li>
          </ul>
        </div>
      </div>

      {/* Timeline scrubber */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-line bg-bg/85 backdrop-blur-xl">
        <div className="dh-container flex items-center gap-5 py-4">
          <button
            onClick={play}
            className="btn-tactile flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-fill text-accent-ink"
            aria-label={playing ? "Pause timeline" : "Play 45 years of expeditions"}
          >
            {playing ? <Pause className="size-4.5" strokeWidth={1.5} /> : <Play className="size-4.5" strokeWidth={1.5} />}
          </button>
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="meta-label">Timeline scrubber</span>
              <span className="numeral text-lg font-bold text-accent">{year}</span>
            </div>
            <input
              type="range"
              className="dh-range w-full"
              min={1981}
              max={2026}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              aria-label="Filter routes by year"
            />
            <div className="numeral mt-1 flex justify-between text-[10px] text-text-3">
              <span>1981</span><span>2026</span>
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <Info className="size-3.5 text-text-3" strokeWidth={1.5} aria-hidden />
            <span className="text-xs text-text-3">Arcs up to selected year</span>
          </div>
        </div>
      </div>

      {/* Expedition drawer */}
      <AnimatePresence>
        {exp && (
          <motion.aside
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 22 }}
            className="panel-scroll absolute bottom-[92px] right-4 top-24 z-20 w-[min(400px,calc(100vw-2rem))] rounded-xl border border-line-strong bg-bg/95 p-6 shadow-[var(--shadow-raised)] backdrop-blur-xl"
            role="dialog"
            aria-label="Expedition details"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="meta-label">{exp.programme} · {exp.season}</p>
                <h2 className="display mt-2 text-2xl font-bold">
                  {toRoman(exp.number)} · {exp.ordinal}
                </h2>
              </div>
              <button onClick={() => setSelectedExp(null)} className="btn-tactile rounded-md border border-line-strong p-2" aria-label="Close">
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ProvenanceChip p={exp.provenance} />
              {exp.milestone && <ProvenanceChip p="verified" label="Milestone" />}
            </div>
            <div className="my-5 h-32 overflow-hidden rounded-lg border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={exp.cover} alt="" className="h-full w-full object-cover" />
            </div>
            <dl className="grid grid-cols-2 gap-4 border-y border-line py-4 text-sm">
              <div>
                <dt className="meta-label">Region</dt>
                <dd className="mt-1 text-text-2">{exp.region}</dd>
              </div>
              <div>
                <dt className="meta-label">Vessel</dt>
                <dd className="mt-1 text-text-2">{exp.vessel ?? "Official record"}</dd>
              </div>
              <div>
                <dt className="meta-label">Leader</dt>
                <dd className="mt-1 text-text-2">{exp.leader ?? "Official record"}</dd>
              </div>
              <div>
                <dt className="meta-label">Objectives</dt>
                <dd className="mt-1 text-text-2">{exp.objectives.join(" · ")}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-text-2">{exp.summary}</p>
            <Link
              href={`/expeditions/${exp.id}`}
              className="btn-tactile mt-6 inline-flex items-center gap-2 rounded-md bg-accent-fill px-4 py-2.5 text-sm font-semibold text-accent-ink"
            >
              Open expedition record
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
            </Link>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Station drawer */}
      <AnimatePresence>
        {station && selectedStation && stations.includes(selectedStation) && (
          <motion.aside
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 22 }}
            className="panel-scroll absolute bottom-[92px] right-4 top-24 z-20 w-[min(400px,calc(100vw-2rem))] rounded-xl border border-line-strong bg-bg/95 p-6 shadow-[var(--shadow-raised)] backdrop-blur-xl"
            role="dialog"
            aria-label="Station details"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="meta-label">{station.location}</p>
                <h2 className="display mt-2 text-2xl font-bold">{station.name}</h2>
              </div>
              <button onClick={() => setSelectedStation(null)} className="btn-tactile rounded-md border border-line-strong p-2" aria-label="Close">
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="my-5 h-32 overflow-hidden rounded-lg border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={station.cover} alt={station.name} className="h-full w-full object-cover" />
            </div>
            <p className="text-sm leading-relaxed text-text-2">{station.summary[0]}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
              <div>
                <p className="meta-label">Established</p>
                <p className="numeral mt-1 text-text-2">{station.established}</p>
              </div>
              <div>
                <p className="meta-label">Status</p>
                <p className="mt-1 capitalize text-text-2">{station.status}</p>
              </div>
            </div>
            <Link
              href={`/stations/${station.slug}`}
              className="btn-tactile mt-6 inline-flex items-center gap-2 rounded-md bg-accent-fill px-4 py-2.5 text-sm font-semibold text-accent-ink"
            >
              Open station record
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
            </Link>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
