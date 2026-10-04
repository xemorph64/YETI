import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { Kicker } from "@/components/ui/primitives";
import { MeltFigure } from "@/components/science/Figures";

export const metadata: Metadata = {
  title: "The cryosphere",
  description: "Ice sheets, glaciers and sea ice — the frozen part of the water cycle and the planet's most sensitive thermometer.",
};

const EXPLORE = [
  { href: "/vault/datasets/schirmacher-smb-transects", label: "Schirmacher SMB transects", kind: "Dataset · Glaciology" },
  { href: "/labs/sea-level", label: "Sea-level rise lab", kind: "Science Labs · simulated" },
  { href: "/learn/polar-foundations", label: "Reading the cryosphere (lesson)", kind: "Polar Gyaan" },
  { href: "/science/ice-core", label: "How ice cores record climate", kind: "Science guide" },
];

export default function CryospherePage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Science", href: "/science" }, { label: "Cryosphere" }]} />
          <Kicker>Science guide · 1 of 5</Kicker>
          <h1 className="display mt-3 max-w-[24ch] text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            The cryosphere: Earth&apos;s frozen water
          </h1>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-text-2">
            About two-thirds of Earth&apos;s fresh water is locked in ice. Where that ice sits, how fast it moves
            and how it gains and loses mass is the business of glaciology — and the reason an archive of polar
            records matters to a country whose rivers begin in ice.
          </p>
        </div>
      </header>

      <div className="dh-container grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="display text-xl font-semibold text-text">Three kinds of ice, three records</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              <strong className="text-text">Ice sheets</strong> are continental land ice — Greenland and
              Antarctica. They hold enough water to redraw every coastline, over centuries.{" "}
              <strong className="text-text">Glaciers</strong> are rivers of ice moving under their own weight;
              their mass balance (gain at top minus loss at bottom) is the clearest signal of a warming or cooling
              world. <strong className="text-text">Sea ice</strong> is frozen seawater — a seasonal skin on the
              ocean that reflects sunlight, shelters krill and switches ocean circulation on and off.
            </p>
            <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
              The distinction is practical, not pedantic: melting sea ice barely lifts the sea (it already floats),
              while melting land ice is exactly what does. Every &ldquo;how much will the sea rise&rdquo; question
              starts by separating the three.
            </p>
          </section>

          <MeltFigure />

          <section>
            <h2 className="display text-xl font-semibold text-text">How it is measured</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              On foot: stake farms re-measured each season, snow pits logged layer by layer, cores drilled for the
              deeper past. From orbit: satellite altimetry tracks ice height and speed, gravimetry weighs the
              sheets. From ships: bridge watches log sea-ice concentration and type. YETI&apos;s Vault demonstrates
              the record types each method produces — synthetic in this build, clearly labelled.
            </p>
          </section>

          <section>
            <h2 className="display text-xl font-semibold text-text">Why India watches ice</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              The poles steer the monsoon through ocean and atmospheric circulation; polar melt shows up in Indian
              coasts and fisheries; and the Himalaya — India&apos;s third cryosphere — feeds the rivers the
              subcontinent drinks from. Indian stations at Maitri, Bharati and Himadri exist to keep those
              observations continuous.
            </p>
          </section>
        </div>

        <aside className="flex h-fit flex-col rounded-xl border border-line bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="meta-label mb-3">Explore the records</h2>
          <ul className="flex flex-col divide-y divide-line">
            {EXPLORE.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="group flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-text group-hover:text-accent">{e.label}</p>
                    <p className="numeral text-[11px] text-text-3">{e.kind}</p>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-text-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
