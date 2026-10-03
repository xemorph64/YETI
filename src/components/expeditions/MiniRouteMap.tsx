"use client";

import { GOA } from "@/components/globe/YetiGlobe";

/** Compact equirectangular world map highlighting one Goa → station route. */
export function MiniRouteMap({
  to,
  color = "var(--accent)",
  label,
}: {
  to: { lat: number; lng: number; name: string };
  color?: string;
  label?: string;
}) {
  const W = 800;
  const H = 400;
  const px = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  });
  const s = px(GOA.lat, GOA.lng);
  const e = px(to.lat, to.lng);
  const cx = (s.x + e.x) / 2;
  const cy = Math.min(s.y, e.y) - Math.abs(e.x - s.x) * 0.25 - 20;

  return (
    <figure className="relative overflow-hidden rounded-lg border border-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/textures/earth-blue-marble.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-bg/35" aria-hidden />
      <svg viewBox={`0 0 ${W} ${H}`} className="relative aspect-[2/1] w-full" role="img" aria-label={`Route from Goa to ${to.name}`}>
        <path
          d={`M${s.x},${s.y} Q${cx},${cy} ${e.x},${e.y}`}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray="7 5"
          opacity="0.95"
        />
        <circle cx={s.x} cy={s.y} r="5" fill="var(--violet)" stroke="var(--bg)" strokeWidth="2" />
        <text x={s.x + 9} y={s.y - 8} fontSize="13" fontFamily="var(--font-mono)" fill="var(--text)">
          GOA
        </text>
        <circle cx={e.x} cy={e.y} r="6" fill={color} stroke="var(--bg)" strokeWidth="2" />
        <text x={e.x + 11} y={e.y + 4} fontSize="13" fontFamily="var(--font-mono)" fill="var(--text)">
          {to.name.toUpperCase()}
        </text>
      </svg>
      {label && (
        <figcaption className="absolute bottom-2 left-2 rounded-md border border-line bg-bg/85 px-2.5 py-1.5 text-[10px] text-text-3 backdrop-blur">
          {label}
        </figcaption>
      )}
    </figure>
  );
}
