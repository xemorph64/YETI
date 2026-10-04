"use client";

import { useState } from "react";

/* Interactive science figures. Every one is a schematic with stated assumptions —
   enough to show the mechanism, never presented as a measurement. */

const WATER = "rgba(56, 140, 220, 0.32)";
const ICE = "var(--ice)";

/** Piecewise-linear interpolation over [x, y] pairs sorted by x. */
function interp(points: [number, number][], x: number) {
  if (x <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x0, y0] = points[i - 1];
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return points[points.length - 1][1];
}

function Figure({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <figure className="rounded-xl border border-line bg-surface p-5">
      <p className="meta-label">Interactive figure</p>
      <h3 className="display mt-1.5 text-base font-semibold text-text">{title}</h3>
      <div className="mt-4">{children}</div>
      <figcaption className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-text-3">{note}</figcaption>
    </figure>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs text-text-2">
        {label}
        <span className="numeral font-semibold text-accent">{display}</span>
      </span>
      <input
        type="range"
        className="dh-range w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function Readout({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-live="polite">
      {items.map(([k, v]) => (
        <div key={k} className="rounded-lg border border-line bg-bg/40 px-3 py-2">
          <dt className="meta-label">{k}</dt>
          <dd className="numeral mt-0.5 text-sm font-semibold text-text">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Cryosphere: floating ice vs land ice ─────────────────────────────────── */

export function MeltFigure() {
  const [sea, setSea] = useState(0);
  const [land, setLand] = useState(0);
  const seaY = 160 - 30 * (land / 100);
  const s = 1 - sea / 100;
  const bw = 120 * Math.sqrt(s);
  const above = 12 * s;
  const below = 70 * s;
  const sheetH = 80 * (1 - land / 100);

  return (
    <Figure
      title="Which melt raises the sea?"
      note="Schematic, not to scale. Floating ice already displaces its own weight of water, so melting it leaves sea level unchanged; ice on land adds new water to the ocean."
    >
      <svg viewBox="0 0 600 240" className="w-full" role="img" aria-label="Ocean with a floating iceberg beside land carrying an ice sheet">
        <rect x="0" y={seaY} width="400" height={240 - seaY} fill={WATER} />
        <line x1="0" x2="400" y1="160" y2="160" stroke="var(--text-3)" strokeDasharray="4 4" />
        <text x="6" y="154" fontSize="11" fill="var(--text-3)" fontFamily="var(--font-mono)">START LEVEL</text>
        {s > 0.02 && (
          <>
            <polygon
              points={`${140 - bw / 2},${seaY} ${140 + bw / 2},${seaY} ${140 + bw / 2.6},${seaY + below} ${140 - bw / 2.6},${seaY + below}`}
              fill={ICE}
              opacity="0.45"
            />
            <polygon
              points={`${140 - bw / 2},${seaY} ${140 - bw / 3},${seaY - above} ${140 + bw / 4},${seaY - above} ${140 + bw / 2},${seaY}`}
              fill={ICE}
            />
          </>
        )}
        <path d="M400,240 L400,140 L600,120 L600,240 Z" fill="var(--surface-3)" />
        {sheetH > 1 && (
          <path d={`M405,140 C420,${120 - sheetH} 470,${120 - sheetH} 600,${120 - sheetH} L600,120 Z`} fill={ICE} />
        )}
        <text x="140" y="24" textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="var(--font-mono)">SEA ICE / BERG</text>
        <text x="500" y="24" textAnchor="middle" fontSize="11" fill="var(--text-2)" fontFamily="var(--font-mono)">ICE SHEET ON LAND</text>
      </svg>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Slider label="Melt floating ice" value={sea} min={0} max={100} display={`${sea}%`} onChange={setSea} />
        <Slider label="Melt land ice" value={land} min={0} max={100} display={`${land}%`} onChange={setLand} />
      </div>
      <div className="mt-4">
        <Readout items={[["Sea-level change", land === 0 ? "none" : `rising (${land}% of sheet)`], ["From floating ice", "none"]]} />
      </div>
    </Figure>
  );
}

/* ── Ice core: snow → firn → ice ──────────────────────────────────────────── */

const FIRN_SCALE = 35; // m, e-folding depth of porosity — typical of cold, dry sites
const porosity = (z: number) => 0.6 * Math.exp(-z / FIRN_SCALE);
const CLOSE_OFF = FIRN_SCALE * Math.log(0.6 / 0.1); // pores seal near 10% porosity

export function FirnFigure() {
  const [depth, setDepth] = useState(5);
  const p = porosity(depth);
  const zone = p > 0.45 ? "Snow" : depth < CLOSE_OFF ? "Firn — pores open" : "Ice — bubbles sealed";
  // Mass above, in metres water-equivalent, at 10 cm w.e. per year of snowfall.
  const mwe = 0.917 * (depth - 0.6 * FIRN_SCALE * (1 - Math.exp(-depth / FIRN_SCALE)));
  const age = Math.round(mwe / 0.1);
  const colY = (z: number) => 10 + (z / 120) * 220;
  const open = depth < CLOSE_OFF;

  const cells: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < 6; i++)
    for (let j = 0; j < 6; j++) {
      const jitter = ((i * 7 + j * 13) % 5) / 5;
      cells.push({ x: 362 + i * 22 + (j % 2) * 6, y: 62 + j * 22, r: Math.max(1.2, (2 + 11 * p) * (0.7 + jitter * 0.5)) });
    }

  return (
    <Figure
      title="Where the archive closes"
      note={`Schematic. Porosity falls exponentially with depth (scale ${FIRN_SCALE} m); pores seal near 10% porosity, here at ~${Math.round(CLOSE_OFF)} m. Age assumes 10 cm water-equivalent of snow per year — real sites vary widely.`}
    >
      <svg viewBox="0 0 520 240" className="w-full" role="img" aria-label="Ice column with a magnified view of pores at the chosen depth">
        <defs>
          <linearGradient id="firn-col" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={ICE} />
            <stop offset="1" stopColor="rgba(120, 180, 230, 0.9)" />
          </linearGradient>
          <clipPath id="firn-lens">
            <circle cx="415" cy="117" r="78" />
          </clipPath>
        </defs>
        <rect x="120" y="10" width="70" height="220" fill="url(#firn-col)" rx="4" />
        {/* annual layers thin with depth as the snow compacts */}
        {Array.from({ length: 40 }, (_, k) => {
          const z = 120 * (1 - Math.pow(1 - k / 40, 0.6));
          return <line key={k} x1="120" x2="190" y1={colY(z)} y2={colY(z)} stroke="var(--bg)" strokeOpacity="0.25" />;
        })}
        <line x1="100" x2="210" y1={colY(CLOSE_OFF)} y2={colY(CLOSE_OFF)} stroke="var(--sunrise)" strokeDasharray="4 3" />
        <text x="96" y={colY(CLOSE_OFF) + 4} textAnchor="end" fontSize="10" fill="var(--sunrise)" fontFamily="var(--font-mono)">CLOSE-OFF</text>
        {[0, 30, 90, 120].map((z) => (
          <text key={z} x="96" y={colY(z) + 4} textAnchor="end" fontSize="10" fill="var(--text-3)" fontFamily="var(--font-mono)">
            {z} m
          </text>
        ))}
        <line x1="190" x2="337" y1={colY(depth)} y2="117" stroke="var(--accent)" strokeOpacity="0.6" />
        <rect x="114" y={colY(depth) - 2} width="82" height="4" fill="var(--accent)" rx="2" />

        <circle cx="415" cy="117" r="78" fill={ICE} fillOpacity={0.35 + (1 - p) * 0.5} stroke="var(--accent)" />
        <g clipPath="url(#firn-lens)">
          {open &&
            cells.map((c, k) =>
              k % 6 < 5 ? (
                <line key={`l${k}`} x1={c.x} y1={c.y} x2={cells[k + 1].x} y2={cells[k + 1].y} stroke="var(--bg)" strokeWidth={Math.max(1, p * 10)} strokeOpacity="0.55" />
              ) : null,
            )}
          {cells.map((c, k) => (
            <circle key={k} cx={c.x} cy={c.y} r={c.r} fill="var(--bg)" fillOpacity={open ? 0.55 : 0.8} />
          ))}
        </g>
      </svg>
      <div className="mt-4">
        <Slider label="Depth below the surface" value={depth} min={0} max={120} display={`${depth} m`} onChange={setDepth} />
      </div>
      <div className="mt-4">
        <Readout
          items={[
            ["Zone", zone],
            ["Density", `${Math.round(917 * (1 - p))} kg/m³`],
            ["Age of layer", `~${age} yr`],
          ]}
        />
      </div>
    </Figure>
  );
}

/* ── Southern Ocean: a CTD cast ───────────────────────────────────────────── */

// Typical Antarctic-margin winter profile: cold surface water over warmer
// Circumpolar Deep Water. Values are representative, not a real cast.
const TEMP: [number, number][] = [[0, -1.0], [80, -1.8], [150, -1.6], [300, 1.2], [500, 1.6], [1000, 0.6]];
const SAL: [number, number][] = [[0, 33.9], [80, 34.2], [300, 34.6], [500, 34.7], [1000, 34.72]];

export function CtdFigure() {
  const [depth, setDepth] = useState(400);
  const t = interp(TEMP, depth);
  const s = interp(SAL, depth);
  const y = (z: number) => 40 + (z / 1000) * 190;
  const px = (temp: number) => 300 + ((temp + 2) / 4) * 200;
  const path = Array.from({ length: Math.floor(depth / 10) + 1 }, (_, i) => {
    const z = i * 10;
    return `${i === 0 ? "M" : "L"}${px(interp(TEMP, z)).toFixed(1)},${y(z).toFixed(1)}`;
  }).join(" ");

  return (
    <Figure
      title="Lower a CTD and read the water column"
      note="Representative winter profile for the Antarctic margin — cold, fresher surface water over warm, salty Circumpolar Deep Water. Not a real cast."
    >
      <svg viewBox="0 0 520 240" className="w-full" role="img" aria-label="Ship lowering a CTD probe, with the temperature profile drawn as it descends">
        <rect x="20" y="40" width="230" height="190" fill={WATER} />
        <rect x="20" y={y(150)} width="230" height={y(500) - y(150)} fill="var(--sunrise)" fillOpacity="0.12" />
        <text x="244" y={y(330)} textAnchor="end" fontSize="10" fill="var(--sunrise)" fontFamily="var(--font-mono)">WARM DEEP WATER</text>
        <path d="M95,40 L165,40 L158,30 L102,30 Z" fill="var(--text-2)" />
        <rect x="124" y="18" width="14" height="12" fill="var(--text-2)" />
        <line x1="131" x2="131" y1="40" y2={y(depth)} stroke="var(--text-2)" />
        <rect x="125" y={y(depth)} width="12" height="16" rx="2" fill="var(--accent)" />

        <line x1="300" x2="500" y1="40" y2="40" stroke="var(--line-strong)" />
        <line x1={px(0)} x2={px(0)} y1="40" y2="230" stroke="var(--line-strong)" strokeDasharray="3 3" />
        {[-2, 0, 2].map((v) => (
          <text key={v} x={px(v)} y="32" textAnchor="middle" fontSize="10" fill="var(--text-3)" fontFamily="var(--font-mono)">{v}°C</text>
        ))}
        {[0, 500, 1000].map((z) => (
          <text key={z} x="292" y={y(z) + 4} textAnchor="end" fontSize="10" fill="var(--text-3)" fontFamily="var(--font-mono)">{z} m</text>
        ))}
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" />
        <circle cx={px(t)} cy={y(depth)} r="4" fill="var(--accent)" />
      </svg>
      <div className="mt-4">
        <Slider label="Probe depth" value={depth} min={0} max={1000} step={10} display={`${depth} m`} onChange={setDepth} />
      </div>
      <div className="mt-4">
        <Readout
          items={[
            ["Temperature", `${t.toFixed(1)} °C`],
            ["Salinity", `${s.toFixed(2)} psu`],
            ["Layer", depth < 150 ? "Cold surface water" : depth <= 500 ? "Circumpolar Deep Water" : "Deep water"],
          ]}
        />
      </div>
    </Figure>
  );
}

/* ── Aurora: the auroral oval and Kp ──────────────────────────────────────── */

const RAD = Math.PI / 180;
const GEOMAG_POLE = { lat: -80.6, lng: 107.3 }; // southern dipole pole, approx.
const AURORA_STATIONS = [
  { name: "Maitri", lat: -70.762, lng: 11.73 },
  { name: "Bharati", lat: -69.411, lng: 76.195 },
];

function angularDistance(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const c = Math.sin(a.lat * RAD) * Math.sin(b.lat * RAD) + Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.cos((a.lng - b.lng) * RAD);
  return Math.acos(Math.min(1, Math.max(-1, c))) / RAD;
}

function destination(from: { lat: number; lng: number }, distDeg: number, bearingDeg: number) {
  const φ1 = from.lat * RAD, λ1 = from.lng * RAD, δ = distDeg * RAD, θ = bearingDeg * RAD;
  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
  const λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1), Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));
  return { lat: φ2 / RAD, lng: λ2 / RAD };
}

export function AuroraOvalFigure() {
  const [kp, setKp] = useState(3);
  const C = 150;
  const K = 135 / 40; // px per degree of colatitude; the map reaches 50°S
  const proj = (p: { lat: number; lng: number }) => {
    const r = (90 + p.lat) * K;
    return { x: C + r * Math.sin(p.lng * RAD), y: C - r * Math.cos(p.lng * RAD) };
  };
  const inner = 15 + 1.0 * kp; // poleward edge, degrees from the geomagnetic pole
  const outer = 22 + 2.0 * kp; // equatorward edge spreads faster in storms
  const ring = (d: number) =>
    Array.from({ length: 73 }, (_, i) => {
      const p = proj(destination(GEOMAG_POLE, d, i * 5));
      return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ") + " Z";
  const status = (st: { lat: number; lng: number }) => {
    const d = angularDistance(st, GEOMAG_POLE);
    return d < inner ? "Polar cap — poleward of the oval" : d <= outer ? "Under the oval" : "Equatorward of the oval";
  };
  const gp = proj(GEOMAG_POLE);

  return (
    <div className="flex flex-col gap-5">
      <Figure
        title="Push the auroral oval with a geomagnetic storm"
        note="Schematic dipole oval centred on the southern geomagnetic pole, viewed from above the South Pole (0° longitude at top). Real ovals are lopsided between day and night sides and are modelled from satellite data."
      >
        <svg viewBox="0 0 300 300" className="mx-auto w-full max-w-[340px]" role="img" aria-label="South polar map with the auroral oval and Indian stations">
          {[60, 70, 80].map((lat) => (
            <circle key={lat} cx={C} cy={C} r={(90 - lat) * K} fill="none" stroke="var(--line-strong)" strokeDasharray="2 3" />
          ))}
          {[0, 90, 180, 270].map((lng) => {
            const p = proj({ lat: -50, lng });
            return <line key={lng} x1={C} y1={C} x2={p.x} y2={p.y} stroke="var(--line)" />;
          })}
          {[60, 70, 80].map((lat) => (
            <text key={lat} x={C + 3} y={C - (90 - lat) * K - 3} fontSize="8" fill="var(--text-3)" fontFamily="var(--font-mono)">{lat}°S</text>
          ))}
          <path d={ring(outer) + ring(inner)} fillRule="evenodd" fill="#3be8b0" fillOpacity={0.18 + kp * 0.03} stroke="#3be8b0" strokeOpacity="0.5" />
          <circle cx={C} cy={C} r="2.5" fill="var(--text-2)" />
          <text x={C - 5} y={C - 5} textAnchor="end" fontSize="8" fill="var(--text-2)" fontFamily="var(--font-mono)">S. POLE</text>
          <path d={`M${gp.x - 4},${gp.y} h8 M${gp.x},${gp.y - 4} v8`} stroke="var(--violet)" strokeWidth="1.5" />
          <text x={gp.x + 6} y={gp.y + 3} fontSize="8" fill="var(--violet)" fontFamily="var(--font-mono)">GEOMAG.</text>
          {AURORA_STATIONS.map((st) => {
            const p = proj(st);
            return (
              <g key={st.name}>
                <circle cx={p.x} cy={p.y} r="4" fill="var(--sunrise)" stroke="var(--bg)" strokeWidth="1.5" />
                <text x={p.x + 7} y={p.y + 3} fontSize="9" fill="var(--text)" fontFamily="var(--font-mono)">{st.name.toUpperCase()}</text>
              </g>
            );
          })}
        </svg>
        <div className="mt-4">
          <Slider label="Geomagnetic activity (Kp index)" value={kp} min={0} max={9} display={`Kp ${kp}${kp >= 5 ? " · storm" : ""}`} onChange={setKp} />
        </div>
        <div className="mt-4">
          <Readout items={AURORA_STATIONS.map((st) => [st.name, status(st)] as [string, string])} />
        </div>
      </Figure>

      <Figure
        title="Why the colours stack by height"
        note="Typical emission altitudes; boundaries blur from night to night."
      >
        <svg viewBox="0 0 520 170" className="w-full" role="img" aria-label="Aurora colours by altitude: red oxygen above 250 km, green oxygen 100 to 250 km, blue and violet nitrogen below 100 km">
          {[
            { y: 10, h: 50, c: "#ff5a5a", t: "Red · oxygen 630 nm", a: "above ~250 km" },
            { y: 60, h: 70, c: "#3be8b0", t: "Green · oxygen 557.7 nm", a: "~100–250 km" },
            { y: 130, h: 30, c: "#8a6cff", t: "Blue–violet · nitrogen 427.8 nm", a: "below ~100 km" },
          ].map((b) => (
            <g key={b.t}>
              <rect x="20" y={b.y} width="120" height={b.h} fill={b.c} fillOpacity="0.4" />
              <text x="160" y={b.y + b.h / 2} fontSize="13" fill="var(--text)" dominantBaseline="middle">{b.t}</text>
              <text x="500" y={b.y + b.h / 2} fontSize="11" fill="var(--text-3)" textAnchor="end" dominantBaseline="middle" fontFamily="var(--font-mono)">{b.a}</text>
            </g>
          ))}
        </svg>
      </Figure>
    </div>
  );
}

/* ── Himalaya: equilibrium-line altitude ──────────────────────────────────── */

const ELA_BASE = 5200; // m, illustrative present-day ELA for a central-Himalayan glacier
const LAPSE = 150; // m of ELA rise per °C, from a ~6.5 °C/km lapse rate
const TOP = 6300;
const SNOUT = 4300;

export function GlacierFigure() {
  const [warm, setWarm] = useState(0);
  const ela = ELA_BASE + LAPSE * warm;
  const aar = Math.max(0, Math.min(1, (TOP - ela) / (TOP - SNOUT)));
  // A glacier in balance typically keeps ~60% of its area above the ELA.
  const balance = aar > 0.62 ? "Gaining mass" : aar >= 0.5 ? "Roughly in balance" : "Losing mass";
  const X = (alt: number) => 40 + ((6600 - alt) / 2600) * 520;
  const Y = (alt: number) => 20 + ((6600 - alt) / 2600) * 190;
  // Lens-shaped body: thin at the head and snout, thickest mid-glacier.
  const glacier = (from: number, to: number) => {
    const top: string[] = [];
    const base: string[] = [];
    for (let k = 0; k <= 20; k++) {
      const alt = from + ((to - from) * k) / 20;
      const th = 2 + 16 * Math.sin((Math.PI * (TOP - alt)) / (TOP - SNOUT));
      top.push(`${X(alt).toFixed(1)},${(Y(alt) - th).toFixed(1)}`);
      base.unshift(`${X(alt).toFixed(1)},${Y(alt).toFixed(1)}`);
    }
    return `M${top.join(" L")} L${base.join(" L")} Z`;
  };

  return (
    <Figure
      title="Warm the air, raise the snow line"
      note={`Schematic. Equilibrium-line altitude starts at ${ELA_BASE} m and rises ~${LAPSE} m per °C. A glacier with ~50–62% of its area above the line is near balance; real thresholds differ glacier to glacier.`}
    >
      <svg viewBox="0 0 600 230" className="w-full" role="img" aria-label="Glacier profile on a mountain slope with the equilibrium line">
        <path d={`M${X(6600)},${Y(6600)} L${X(4000)},${Y(4000)} L600,230 L0,230 L0,${Y(6600)} Z`} fill="var(--surface-3)" />
        <path d={glacier(TOP, Math.max(SNOUT, Math.min(TOP, ela)))} fill={ICE} />
        <path d={glacier(Math.max(SNOUT, Math.min(TOP, ela)), SNOUT)} fill="rgba(120, 180, 230, 0.75)" />
        <line x1="0" x2="600" y1={Y(ela) - 6} y2={Y(ela) - 6} stroke="var(--sunrise)" strokeDasharray="5 4" />
        <text x="596" y={Y(ela) - 11} textAnchor="end" fontSize="10" fill="var(--sunrise)" fontFamily="var(--font-mono)">ELA {Math.round(ela)} m</text>
        <text x={X(5900)} y={Y(5900) - 18} fontSize="10" fill="var(--text-2)" fontFamily="var(--font-mono)">ACCUMULATION</text>
        <text x={X(4700)} y={Y(4700) + 20} fontSize="10" fill="var(--text-2)" fontFamily="var(--font-mono)">ABLATION</text>
      </svg>
      <div className="mt-4">
        <Slider label="Warming above today" value={warm} min={0} max={4} step={0.5} display={`+${warm.toFixed(1)} °C`} onChange={setWarm} />
      </div>
      <div className="mt-4">
        <Readout
          items={[
            ["Snow line (ELA)", `${Math.round(ela)} m`],
            ["Area above it", `${Math.round(aar * 100)}%`],
            ["Glacier", balance],
          ]}
        />
      </div>
    </Figure>
  );
}
