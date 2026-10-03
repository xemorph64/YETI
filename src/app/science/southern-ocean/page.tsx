import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { Kicker } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "The Southern Ocean",
  description: "The ocean engine that connects Antarctic ice to the Indian monsoon — the Goa–Prydz Bay corridor, explained.",
};

const EXPLORE = [
  { href: "/vault/datasets/southern-ocean-xbt", label: "Southern Ocean XBT transect", kind: "Dataset · Oceanography" },
  { href: "/vault/datasets/sea-ice-visual-obs", label: "Sea-ice visual observations", kind: "Dataset · Oceanography" },
  { href: "/labs/monsoon-link", label: "Climate ↔ monsoon link lab", kind: "Science Labs · simulated" },
  { href: "/expeditions", label: "Southern Ocean cruise seasons", kind: "Expedition stories" },
];

export default function SouthernOceanPage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Science", href: "/science" }, { label: "Southern Ocean" }]} />
          <Kicker>Science guide · 3 of 5</Kicker>
          <h1 className="display mt-3 max-w-[26ch] text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            The ocean engine that connects the poles to the monsoon
          </h1>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-text-2">
            Around Antarctica blows the strongest current on Earth, connecting the Atlantic, Indian and Pacific
            basins. The Southern Ocean carries heat, absorbs carbon, and sets water masses in motion that reach
            every ocean — including the ones that make the Indian rain.
          </p>
        </div>
      </header>

      <div className="dh-container grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="display text-xl font-semibold text-text">Cold, salty, sinking</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              When sea ice forms, it leaves its salt behind. The cold, salty water beneath grows denser and sinks,
              spreading through the deep ocean — the downwelling limb of the global conveyor belt. What happens in
              polar seas therefore eventually reaches every basin, and what rises elsewhere to replace it closes
              the loop.
            </p>
          </section>

          <section>
            <h2 className="display text-xl font-semibold text-text">Reading the water column</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              The sea is not one temperature. Cold fresh layers sit over warm salty ones, and the boundary between
              them decides everything above — sea-ice growth, melt rates at glacier fronts, where nutrients rise.
              Oceanographers read the structure with <strong className="text-text">CTD casts</strong> and{" "}
              <strong className="text-text">XBT sections</strong>: instruments lowered or dropped from ships,
              wiring back temperature and salinity with depth.
            </p>
          </section>

          <section>
            <h2 className="display text-xl font-semibold text-text">Why India sails this transect</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              Indian Southern Ocean cruises run the Goa–Prydz Bay corridor — the same ocean engine sampled from
              the Arctic side by the IndARC mooring in Kongsfjorden. The point is connectivity: changes in polar
              sea ice, freshening and heat transport are part of the machinery behind monsoon variability, Indian
              fisheries and coastal sea level. You can explore the pathway — with every link honestly tagged by
              how well it is established — in the monsoon-link lab.
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
