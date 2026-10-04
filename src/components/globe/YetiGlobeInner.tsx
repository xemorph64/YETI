"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { cn } from "@/lib/utils";
import { GOA, STATION_POINTS, webglSupported, type ArcSpec, type GlobeHandle, type GlobeStation } from "@/components/globe/webgl";

export { GOA, STATION_POINTS, webglSupported };
export type { ArcSpec, GlobeHandle, GlobeStation };

interface YetiGlobeInnerProps {
  arcs: ArcSpec[];
  showStations?: boolean;
  stations?: GlobeStation[];
  onStationClick?: (s: GlobeStation) => void;
  onArcClick?: (a: ArcSpec) => void;
  autoRotate?: boolean;
  zoomEnabled?: boolean;
  pov?: { lat: number; lng: number; altitude: number };
  className?: string;
  onReady?: (handle: GlobeHandle) => void;
  handleRef?: { current: GlobeHandle | null };
}

export default function YetiGlobeInner({
  arcs,
  showStations = true,
  stations = STATION_POINTS,
  onStationClick,
  onArcClick,
  autoRotate = true,
  zoomEnabled = false,
  pov = { lat: 22, lng: 60, altitude: 2.4 },
  className,
  onReady,
  handleRef,
}: YetiGlobeInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const reduced =
    typeof document !== "undefined" &&
    (document.documentElement.getAttribute("data-reduced-motion") === "true" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  const arcsMemo = useMemo(
    () =>
      arcs.map((a) => ({
        ...a,
        arcAltitude: a.altitude ?? 0.22,
        arcStroke: a.stroke ?? 0.5,
        arcDashLength: reduced ? 1 : 0.55,
        arcDashGap: reduced ? 0 : 1.6,
        arcDashAnimateTime: a.animate === false || reduced ? 0 : 3400,
      })),
    [arcs, reduced],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const applyPov = useCallback(() => {
    const g = globeRef.current as GlobeHandle | null;
    if (!g) return;
    const c = g.controls();
    c.autoRotate = autoRotate && !reduced;
    c.autoRotateSpeed = 0.35;
    c.enableZoom = zoomEnabled;
    c.enablePan = false;
    c.minDistance = 130;
    c.maxDistance = 560;
    g.pointOfView(pov, 0);
    if (handleRef) handleRef.current = g;
    onReady?.(g);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRotate, zoomEnabled, pov.lat, pov.lng, pov.altitude, reduced, handleRef, onReady]);

  const stationHtml = useCallback(
    (s: GlobeStation) => {
      const el = document.createElement("div");
      el.className = "dh-station-pin";
      el.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;user-select:none;transform:translateY(-6px);">
          <div style="width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px rgba(59,232,176,0.25),0 0 12px rgba(59,232,176,0.5);"></div>
          <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text);background:rgba(7,16,32,0.72);border:1px solid rgba(167,188,207,0.25);padding:3px 7px;border-radius:4px;white-space:nowrap;backdrop-filter:blur(4px);">${s.name}</div>
        </div>`;
      if (onStationClick) {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onStationClick(s);
        });
      }
      return el;
    },
    [onStationClick],
  );

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)} aria-label="Interactive globe of Indian polar expeditions" role="application">
      {dims.w > 0 && (
        <Globe
          ref={globeRef}
          width={dims.w}
          height={dims.h}
          {...({
            globeImageUrl: "/textures/earth-blue-marble.jpg",
            bumpImageUrl: "/textures/earth-topology.png",
            backgroundImageUrl: "/textures/night-sky.png",
            backgroundColor: "rgba(0,0,0,0)",
            showAtmosphere: true,
            atmosphereColor: "#3BE8B0",
            atmosphereAltitude: 0.16,
            arcsData: arcsMemo,
            arcAltitudeAutoScale: 0.42,
            arcCurvature: 0.42,
            onArcClick: onArcClick ? (arc: object) => onArcClick(arc as ArcSpec) : undefined,
            htmlElementsData: showStations ? stations : [],
            htmlAltitude: 0.03,
            htmlElement: (d: object) => stationHtml(d as GlobeStation),
            onGlobeReady: () => {
              setReady(true);
              requestAnimationFrame(applyPov);
            },
            rendererConfig: { antialias: true, alpha: true },
          } as unknown as Record<string, unknown>)}
        />
      )}
      {/* Veil crossfades the scene in once textures are ready */}
      <div
        className={cn("globe-veil pointer-events-none absolute inset-0 bg-bg", ready && "opacity-0")}
        aria-hidden
      />
      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <div className="flex flex-col items-center gap-3">
            <div className="size-16 rounded-full border border-accent/30 border-t-accent animate-spin" style={{ animationDuration: "2.4s" }} />
            <span className="meta-label">Raising the globe…</span>
          </div>
        </div>
      )}
    </div>
  );
}
