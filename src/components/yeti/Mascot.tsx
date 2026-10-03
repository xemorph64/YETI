"use client";

/**
 * The YETI mascot — one consistent scientific expedition guide.
 * Geometric, instrumented, never a childish cartoon: an ice-colored figure
 * with an expedition goggles band and a field notebook. The `state` prop
 * drives the documented assistant states; all motion respects reduced-motion
 * via the global kill-switch.
 */

import { cn } from "@/lib/utils";

export type MascotState =
  | "idle"
  | "thinking"
  | "searching"
  | "explaining"
  | "success"
  | "warning"
  | "source-found";

interface MascotProps {
  state?: MascotState;
  className?: string;
}

function StateOverlay({ state }: { state: MascotState }) {
  switch (state) {
    case "thinking":
      return (
        <g className="yeti-mascot-bubble">
          <circle cx="86" cy="14" r="8" className="fill-surface stroke-line-strong" strokeWidth="1.2" />
          <text x="86" y="18" textAnchor="middle" className="fill-accent" fontSize="10" fontWeight="700">?</text>
        </g>
      );
    case "searching":
      return (
        <g className="yeti-mascot-sweep">
          <circle cx="88" cy="34" r="7" fill="none" className="stroke-accent" strokeWidth="2" />
          <line x1="93" y1="39" x2="100" y2="46" className="stroke-accent" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
    case "explaining":
      return (
        <g className="yeti-mascot-dots">
          <circle cx="84" cy="26" r="2" className="fill-accent" />
          <circle cx="91" cy="26" r="2" className="fill-accent" opacity="0.66" />
          <circle cx="98" cy="26" r="2" className="fill-accent" opacity="0.33" />
        </g>
      );
    case "success":
      return (
        <g>
          <circle cx="88" cy="24" r="9" className="fill-accent" />
          <path d="M84 24 l3 3 5-6" fill="none" stroke="#071020" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "warning":
      return (
        <g>
          <circle cx="88" cy="24" r="9" className="fill-sunrise" />
          <line x1="88" y1="19" x2="88" y2="25" stroke="#071020" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="88" cy="29" r="1.4" fill="#071020" />
        </g>
      );
    case "source-found":
      return (
        <g className="yeti-mascot-bubble">
          <rect x="78" y="12" width="20" height="16" rx="3" className="fill-surface stroke-accent" strokeWidth="1.4" />
          <line x1="82" y1="17" x2="94" y2="17" className="stroke-accent" strokeWidth="1.4" />
          <line x1="82" y1="21" x2="94" y2="21" className="stroke-accent" strokeWidth="1.4" opacity="0.6" />
          <line x1="82" y1="25" x2="90" y2="25" className="stroke-accent" strokeWidth="1.4" opacity="0.35" />
        </g>
      );
    default:
      return null;
  }
}

export function Mascot({ state = "idle", className }: MascotProps) {
  return (
    <svg
      viewBox="0 0 108 76"
      role="img"
      aria-label={`YETI, your expedition guide — ${state}`}
      className={cn("yeti-mascot", state === "idle" && "yeti-mascot-idle", className)}
    >
      {/* body / parka */}
      <path
        d="M30 74 C28 58 38 48 54 48 C70 48 80 58 78 74 Z"
        className="fill-surface-2 stroke-line-strong"
        strokeWidth="1.4"
      />
      {/* zipper */}
      <line x1="54" y1="50" x2="54" y2="74" className="stroke-line-strong" strokeWidth="1.2" opacity="0.7" />
      {/* arms */}
      <path d="M32 56 C24 60 22 68 24 74" fill="none" className="stroke-line-strong" strokeWidth="1.4" />
      <path d="M76 56 C84 60 86 68 84 74" fill="none" className="stroke-line-strong" strokeWidth="1.4" />
      {/* head — furry silhouette */}
      <path
        d="M54 8
           C68 8 76 17 76 28
           C76 30 75.5 32 75 34
           C74 38 70 40 66 40.5
           L66 44 L42 44 L42 40.5
           C38 40 34 38 33 34
           C32.5 32 32 30 32 28
           C32 17 40 8 54 8 Z"
        className="fill-ice stroke-line-strong"
        strokeWidth="1.4"
      />
      {/* fur bumps on crown */}
      <circle cx="44" cy="10.5" r="4" className="fill-ice" />
      <circle cx="54" cy="8.5" r="4.4" className="fill-ice" />
      <circle cx="64" cy="10.5" r="4" className="fill-ice" />
      {/* face patch */}
      <path
        d="M54 20 C62 20 68 25 68 32 C68 37 62 41 54 41 C46 41 40 37 40 32 C40 25 46 20 54 20 Z"
        className="fill-bg-deep"
      />
      {/* goggles band on forehead */}
      <path d="M36 17 C44 12 64 12 72 17" fill="none" className="stroke-accent" strokeWidth="2.6" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="47.5" cy="30" r="2.4" className="fill-ice yeti-mascot-eye" />
      <circle cx="60.5" cy="30" r="2.4" className="fill-ice yeti-mascot-eye" />
      {/* snout + smile */}
      <ellipse cx="54" cy="35.4" rx="3.4" ry="2.4" className="fill-ice" />
      <path d="M50.5 37.5 Q54 39.6 57.5 37.5" fill="none" className="stroke-ice" strokeWidth="1.3" strokeLinecap="round" />
      {/* notebook in hand */}
      <g transform="rotate(-8 26 66)">
        <rect x="18" y="58" width="14" height="18" rx="2" className="fill-surface stroke-line-strong" strokeWidth="1.2" />
        <line x1="21" y1="63" x2="29" y2="63" className="stroke-accent" strokeWidth="1.2" />
        <line x1="21" y1="67" x2="29" y2="67" className="stroke-line-strong" strokeWidth="1.1" opacity="0.7" />
        <line x1="21" y1="71" x2="27" y2="71" className="stroke-line-strong" strokeWidth="1.1" opacity="0.5" />
      </g>
      <StateOverlay state={state} />
    </svg>
  );
}

/** Compact circular badge version for the floating trigger and header. */
export function MascotBadge({ state = "idle", className }: MascotProps) {
  return (
    <span className={cn("relative inline-flex items-center justify-center", className)}>
      <Mascot state={state} className="h-full w-full" />
    </span>
  );
}
