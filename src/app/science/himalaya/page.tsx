import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { Kicker } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "The Himalayan cryosphere",
  description: "India's third cryosphere — the glaciers that feed the subcontinent's rivers, studied with the same tools as the poles.",
};

const EXPLORE = [
  { href: "/science/cryosphere", label: "Cryosphere basics", kind: "Science guide" },
  { href: "/labs/sea-level", label: "Sea-level rise lab", kind: "Science Labs · simulated" },
  { href: "/learn/polar-foundations", label: "Why scientists go south (and north)", kind: "Polar Gyaan" },
];

export default function HimalayaPage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Science", href: "/science" }, { label: "Himalaya" }]} />
          <Kicker>Science guide · 5 of 5</Kicker>
          <h1 className="display mt-3 max-w-[26ch] text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            India&apos;s third cryosphere
          </h1>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-text-2">
            Antarctica is a continent of ice, the Arctic a frozen ocean — and the Himalaya is a mountain
            cryosphere: glaciers and snowpack feeding the rivers that more than a billion people drink from. It is
            the polar science India studies, applied at home.
          </p>
        </div>
      </header>

      <div className="dh-container grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="display text-xl font-semibold text-text">Same physics, steeper stage</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              A Himalayan glacier obeys the same mass-balance arithmetic as an Antarctic one — accumulation at the
              top, ablation at the snout — compressed into steep valleys where a few hundred metres of altitude
              can decide whether a glacier survives. Snow lines move; debris cover changes melt; monsoon snowfall
              feeds some basins while others depend on winter systems.
            </p>
          </section>

          <section>
            <h2 className="display text-xl font-semibold text-text">The same instruments</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              The toolchain transfers directly: stake farms and snow pits for mass balance, automatic weather
              stations for the climate series, remote sensing to scale point measurements across basins. That is
              not a coincidence — polar-trained teams and shared methods are how one institution can credibly
              watch ice at 79°N, 70°S and 30°N at once.
            </p>
          </section>

          <section>
            <h2 className="display text-xl font-semibold text-text">Why it belongs in a polar archive</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              The cryosphere is one system with three Indian frontiers. Comparing records — an East Antarctic
              mass-balance transect beside a Himalayan one — is how the science separates local noise from
              planetary signal. YETI&apos;s demo build keeps the Himalaya present as the third pillar of that
              comparison; dedicated Himalayan datasets are on the ingest roadmap, and this page will link them
              when they arrive.
            </p>
          </section>
        </div>

        <aside className="flex h-fit flex-col rounded-xl border border-line bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="meta-label mb-3">Explore next</h2>
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
