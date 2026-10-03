"use client";

import { useMemo, useState } from "react";
import { daylightFraction } from "@/lib/data/stations";

/* "A Day Here" — simplified light-cycle illustration for a station latitude.
   A heuristic for demonstration and education; NOT an astronomical computation
   or forecast. Labelled as such on the page. */
export function LightCycle({ lat, name }: { lat: number; name: string }) {
  const [month, setMonth] = useState(1);
  const frac = useMemo(() => daylightFraction(lat, month), [lat, month]);
  const daylightH = frac * 24;
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const R = 86;
  const CX = 110;
  const CY = 110;
  // Sun travels a 270° day-arc when full daylight; shrinks with darkness.
  const arcSpan = Math.max(frac, 0.02) * 300; // degrees of "up" travel
  const startAngle = 150 - arcSpan / 2;
  const sunAngle = ((month - 1) / 11) * 359; // marker around the ring
  const sunR = 96;
  const sun = {
    x: CX + sunR * Math.cos((sunAngle * Math.PI) / 180),
    y: CY - sunR * Math.sin((sunAngle * Math.PI) / 180),
  };
  const arcStart = {
    x: CX + R * Math.cos((startAngle * Math.PI) / 180),
    y: CY - R * Math.sin((startAngle * Math.PI) / 180),
  };
  const arcEnd = {
    x: CX + R * Math.cos(((startAngle + arcSpan) * Math.PI) / 180),
    y: CY - R * Math.sin(((startAngle + arcSpan) * Math.PI) / 180),
  };
  const large = arcSpan > 180 ? 1 : 0;

  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="meta-label">A day here — light cycle</p>
          <p className="display mt-2 text-xl font-semibold">
            {name}, {MONTHS[month - 1]}
          </p>
        </div>
        <div className="text-right">
          <p className="numeral text-3xl font-bold text-accent">{daylightH.toFixed(1)} h</p>
          <p className="meta-label">daylight (illustrated)</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
        <svg viewBox="0 0 220 220" className="w-56 shrink-0" role="img" aria-label={`Illustrated daylight for ${MONTHS[month - 1]}: about ${daylightH.toFixed(1)} hours`}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line-strong)" strokeWidth="1" />
          <path
            d={`M ${arcStart.x} ${arcStart.y} A ${R} ${R} 0 ${large} 1 ${arcEnd.x} ${arcEnd.y}`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* horizon */}
          <line x1="14" y1={CY} x2="206" y2={CY} stroke="var(--line-strong)" strokeDasharray="3 4" />
          <text x="14" y={CY + 14} fontSize="9" fontFamily="var(--font-mono)" fill="var(--text-3)">
            HORIZON
          </text>
          <circle cx={sun.x} cy={sun.y} r="9" fill="var(--sunrise)" />
          <circle cx={sun.x} cy={sun.y} r="15" fill="none" stroke="var(--sunrise)" strokeOpacity="0.4" />
          <text x={CX} y={CY + 44} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-3)">
            {frac === 0 ? "POLAR NIGHT" : frac === 1 ? "MIDNIGHT SUN" : `${daylightH.toFixed(1)} h of light`}
          </text>
        </svg>
        <div className="w-full flex-1">
          <label className="meta-label mb-2 block" htmlFor="light-month">
            Month
          </label>
          <input
            id="light-month"
            type="range"
            min={1}
            max={12}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="dh-range w-full"
            aria-valuetext={MONTHS[month - 1]}
          />
          <div className="numeral mt-1 flex justify-between text-[10px] text-text-3">
            <span>J</span><span>F</span><span>M</span><span>A</span><span>M</span><span>J</span>
            <span>J</span><span>A</span><span>S</span><span>O</span><span>N</span><span>D</span>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-text-3">
            Simplified illustration of the seasonal light cycle at this latitude — daylight ramps to the midnight
            sun in polar summer and the polar night in winter. Not an astronomical computation or a forecast.
          </p>
        </div>
      </div>
    </div>
  );
}
