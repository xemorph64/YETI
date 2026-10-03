"use client";

import dynamic from "next/dynamic";
import { webglSupported, GOA, STATION_POINTS } from "@/components/globe/webgl";
import type { ArcSpec, GlobeHandle, GlobeStation } from "@/components/globe/webgl";

export { GOA, STATION_POINTS, webglSupported };
export type { ArcSpec, GlobeHandle, GlobeStation };

const Inner = dynamic(() => import("@/components/globe/YetiGlobeInner"), {
  ssr: false,
  loading: () => null,
});

interface YetiGlobeProps {
  arcs: ArcSpec[];
  showStations?: boolean;
  onStationClick?: (s: GlobeStation) => void;
  onArcClick?: (a: ArcSpec) => void;
  autoRotate?: boolean;
  zoomEnabled?: boolean;
  pov?: { lat: number; lng: number; altitude: number };
  className?: string;
  onReady?: (handle: GlobeHandle) => void;
  handleRef?: { current: GlobeHandle | null };
}

/**
 * Wrapper: lazy-mounts the WebGL scene off the server bundle.
 * The inner component imports react-globe.gl statically so the imperative
 * handle (pointOfView / controls / arcsData) survives; this wrapper only
 * defers it.
 */
export function YetiGlobe(props: YetiGlobeProps) {
  return <Inner {...props} />;
}
