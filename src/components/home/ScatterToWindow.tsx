"use client";

/**
 * "From scattered to one window" — the problem statement, drawn.
 * Source artefacts drift along bezier paths and resolve into clean, linked
 * records docking on the repository stack.
 *
 * Animation contract: pure CSS offset-path keyframes (compositor-driven,
 * zero main-thread work per frame, loops forever in perfect sync, respects
 * the global reduced-motion kill-switch).
 */

import { useEffect, useState } from "react";

interface Source {
  id: string;
  label: string;
  x: number;
  y: number;
}

const SOURCES: Source[] = [
  { id: "annual", label: "Annual expedition reports", x: 60, y: 40 },
  { id: "datasets", label: "MoES datasets", x: 620, y: 30 },
  { id: "papers", label: "Journal publications", x: 670, y: 190 },
  { id: "photos", label: "Photograph archive", x: 640, y: 370 },
  { id: "films", label: "Field films & video", x: 80, y: 385 },
  { id: "website", label: "Old institutional websites", x: 30, y: 200 },
  { id: "notes", label: "Field notebooks", x: 360, y: 8 },
];

const RECORD_LABELS = ["Exp. report · 1983", "Dataset · SMB 2015–24", "Publication · 2023", "Photograph · Maitri", "Video · sea-ice", "News · programme", "Learning path"];

const CX = 360;
const CY = 210;
/** One full drift cycle (s). Stagger 0.9s × 7 sources = 6.3s — perfect wrap. */
const CYCLE = 6.3;
const STAGGER = 0.9;

function pathD(s: Source) {
  const bx = s.x + (CX - s.x) * 0.4;
  const by = s.y + (CY - s.y) * 0.7;
  const cx2 = CX + (s.x - CX) * 0.25;
  const cy2 = CY + (s.y - CY) * 0.2;
  return `M ${s.x} ${s.y} C ${bx} ${by}, ${cx2} ${cy2}, ${CX} ${CY}`;
}

export function ScatterToWindow() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      document.documentElement.getAttribute("data-reduced-motion") === "true" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const animate = !reduced;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/60">
      <style>{`
        @keyframes yeti-drift {
          0%   { offset-distance: 0%;   opacity: 0; }
          5%   { opacity: 0.95; }
          48%  { offset-distance: 100%; opacity: 0.95; }
          54%  { offset-distance: 100%; opacity: 0; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes yeti-dock {
          0%   { opacity: 0.18; }
          2%   { opacity: 1; }
          96%  { opacity: 1; }
          100% { opacity: 0.18; }
        }
        @keyframes yeti-path-pulse {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 0.6; }
        }
        @keyframes yeti-label-pulse {
          0%, 100% { opacity: 0.85; }
          50%      { opacity: 0.45; }
        }
      `}</style>
      <svg viewBox="0 0 720 420" className="block h-auto w-full" role="img" aria-label="Scattered polar records flowing into one unified repository">
        <defs>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={CX} cy={CY} r="190" fill="url(#core-glow)" />

        {SOURCES.map((s, i) => (
          <path
            key={s.id}
            d={pathD(s)}
            fill="none"
            className="stroke-line-strong"
            strokeWidth="1"
            strokeDasharray="3 5"
            style={animate ? { animation: `yeti-path-pulse ${CYCLE}s ease-in-out ${-i * STAGGER}s infinite` } : { opacity: 0.45 }}
          />
        ))}

        {SOURCES.map((s, i) => (
          <g
            key={s.id}
            style={
              animate
                ? {
                    offsetPath: `path("${pathD(s)}")`,
                    offsetRotate: "0deg",
                    animation: `yeti-drift ${CYCLE}s linear ${-i * STAGGER}s infinite`,
                  }
                : { opacity: 0 }
            }
          >
            <rect x="-14" y="-9" width="28" height="18" rx="3" className="fill-surface-3 stroke-line-strong" strokeWidth="1" />
            <line x1="-8" y1="-3" x2="8" y2="-3" className="stroke-text-3" strokeWidth="1.4" />
            <line x1="-8" y1="1" x2="8" y2="1" className="stroke-text-3" strokeWidth="1.4" opacity="0.6" />
            <line x1="-8" y1="5" x2="4" y2="5" className="stroke-text-3" strokeWidth="1.4" opacity="0.35" />
          </g>
        ))}

        {SOURCES.map((s) => (
          <text
            key={s.id}
            x={s.x}
            y={s.y + (s.y < CY ? -20 : 30)}
            textAnchor={s.x < 340 ? "start" : s.x > 380 ? "end" : "middle"}
            className="fill-text-3"
            fontSize="10.5"
            style={{ fontFamily: "var(--font-mono)", animation: animate ? `yeti-label-pulse ${CYCLE}s ease-in-out infinite` : undefined, opacity: animate ? undefined : 0.45 }}
          >
            {s.label}
          </text>
        ))}

        {/* the repository core */}
        <g>
          <circle cx={CX} cy={CY} r="34" className="fill-surface stroke-accent" strokeWidth="1.6" />
          <circle cx={CX} cy={CY} r="42" fill="none" className="stroke-accent" strokeWidth="1" opacity="0.4" />
          <circle cx={CX} cy={CY} r="52" fill="none" className="stroke-accent" strokeWidth="1" opacity="0.18" />
          <path
            d={`M${CX} ${CY - 14} L${CX + 4.2} ${CY - 4.2} L${CX + 14} ${CY} L${CX + 4.2} ${CY + 4.2} L${CX} ${CY + 14} L${CX - 4.2} ${CY + 4.2} L${CX - 14} ${CY} L${CX - 4.2} ${CY - 4.2} Z`}
            className="fill-accent"
          />
          <text x={CX} y={CY + 32} textAnchor="middle" className="fill-accent" fontSize="11" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em" }}>
            YETI
          </text>
        </g>

        {/* docking record rows */}
        <g>
          <text x="588" y="243" className="fill-text-3" fontSize="10" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em" }}>
            CONNECTED RECORDS
          </text>
          {RECORD_LABELS.map((label, i) => (
            <g
              key={label}
              transform={`translate(0 ${i * 26})`}
              style={animate ? { animation: `yeti-dock ${CYCLE}s linear ${-(i * STAGGER + STAGGER * 0.5)}s infinite` } : { opacity: i < 5 ? 1 : 0.18 }}
            >
              <rect x="588" y="252" width="122" height="19" rx="4" className="fill-surface-2 stroke-line-strong" strokeWidth="1" />
              <circle cx="596" cy="261.5" r="2.2" className="fill-text-3" />
              <text x="604" y="265" className="fill-text-2" fontSize="8.6" style={{ fontFamily: "var(--font-mono)" }}>
                {label}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <p className="border-t border-line px-4 py-2.5 text-xs leading-snug text-text-3">
        Illustration of the ingestion concept — sources are representative, not exhaustive. Every arriving artefact becomes a metadata-complete, review-gated record.
      </p>
    </div>
  );
}
