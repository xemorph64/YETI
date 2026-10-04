"use client";

import Link from "next/link";
import { GOA, STATION_POINTS, type ArcSpec, type GlobeStation, webglSupported } from "@/components/globe/YetiGlobe";
import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/* 2D fallback: equirectangular projection over the Blue Marble texture.
   Ships whenever WebGL is unavailable — the archive stays reachable. */
export function GlobeFallback({
  arcs,
  stations,
  children,
}: {
  arcs: ArcSpec[];
  stations?: GlobeStation[];
  children?: React.ReactNode;
}) {
  // Server assumes WebGL; the client reads the real capability during hydration.
  const supported = useSyncExternalStore(noSubscribe, webglSupported, () => true);
  if (supported) return <>{children}</>;
  return <FallbackMap arcs={arcs} stations={stations} />;
}

export function FallbackMap({ arcs, stations = STATION_POINTS }: { arcs: ArcSpec[]; stations?: GlobeStation[] }) {
  const W = 1000;
  const H = 500;
  const px = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  });
  const goa = px(GOA.lat, GOA.lng);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-line bg-bg-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/textures/earth-blue-marble.jpg"
        alt="Static world map showing Indian polar routes"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_120%,rgba(59,232,176,0.10),transparent_60%)]" />
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        {arcs.map((a, i) => {
          const s = px(a.startLat, a.startLng);
          const e = px(a.endLat, a.endLng);
          const cx = (s.x + e.x) / 2;
          const cy = Math.min(s.y, e.y) - Math.abs(e.x - s.x) * 0.22 - 30;
          return (
            <path
              key={i}
              d={`M${s.x},${s.y} Q${cx},${cy} ${e.x},${e.y}`}
              fill="none"
              stroke={a.color[0]}
              strokeWidth="2"
              strokeDasharray="5 4"
              opacity="0.9"
            />
          );
        })}
        {stations.map((s) => {
          const p = px(s.lat, s.lng);
          return (
            <g key={s.name}>
              <circle cx={p.x} cy={p.y} r="5" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2" />
              <text
                x={p.x + 9}
                y={p.y + 4}
                fontSize="13"
                fontFamily="var(--font-mono)"
                fill="var(--text)"
                style={{ letterSpacing: "0.08em" }}
              >
                {s.name.toUpperCase()}
              </text>
            </g>
          );
        })}
        <circle cx={goa.x} cy={goa.y} r="4" fill="var(--violet)" />
        <text x={goa.x + 8} y={goa.y - 6} fontSize="12" fontFamily="var(--font-mono)" fill="var(--text-2)">
          GOA
        </text>
      </svg>
      <div className="absolute bottom-3 left-3 rounded-md border border-line bg-bg/85 px-3 py-2 text-xs text-text-2 backdrop-blur">
        WebGL unavailable — showing the static expedition map.
        <Link href="/expeditions" className="link-line ml-2 font-medium text-accent">
          Browse as list →
        </Link>
      </div>
    </div>
  );
}
