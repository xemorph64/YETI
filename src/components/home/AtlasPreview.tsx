"use client";

import { FallbackMap } from "@/components/globe/GlobeFallback";
import { arcsForExpeditions } from "@/components/home/Hero";
import { EXPEDITIONS } from "@/lib/data/expeditions";
import { STATION_POINTS } from "@/components/globe/webgl";

// Dakshin Gangotri sits beside Maitri; at this zoom its label would sit on top of Maitri's.
const STATIONS = STATION_POINTS.filter((s) => s.slug !== "dakshin-gangotri");

/** The Atlas's own data, drawn flat: every expedition arc from Goa, no WebGL needed. */
export function AtlasPreview() {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-line">
      {/* Zoomed to the Indian Ocean corridor, where every route from Goa runs. */}
      <div className="size-full origin-[71%_66%] scale-[1.9]">
        <FallbackMap arcs={arcsForExpeditions(EXPEDITIONS)} stations={STATIONS} notice={false} />
      </div>
    </div>
  );
}
