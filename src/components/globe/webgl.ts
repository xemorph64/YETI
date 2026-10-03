/* Shared globe constants & types — plain module, safe for server + client. */

export const GOA = { lat: 15.4, lng: 73.8, name: "Goa" };

export interface GlobeStation {
  lat: number;
  lng: number;
  name: string;
  slug?: string;
  detail?: string;
}

export const STATION_POINTS: GlobeStation[] = [
  { lat: -70.762, lng: 11.73, name: "Maitri", slug: "maitri", detail: "Schirmacher Oasis · est. 1989" },
  { lat: -69.411, lng: 76.195, name: "Bharati", slug: "bharati", detail: "Larsemann Hills · est. 2012" },
  { lat: 78.92, lng: 11.93, name: "Himadri", slug: "himadri", detail: "Ny-Ålesund, Svalbard · est. 2008" },
  { lat: -70.45, lng: 12.43, name: "Dakshin Gangotri", slug: "dakshin-gangotri", detail: "Ice shelf · 1983–1990" },
];

export interface ArcSpec {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  stroke?: number;
  altitude?: number;
  animate?: boolean;
  ref?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GlobeHandle {
  pointOfView: (pov: { lat?: number; lng?: number; altitude?: number }, ms?: number) => void;
  controls: () => any;
}

export function webglSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}
