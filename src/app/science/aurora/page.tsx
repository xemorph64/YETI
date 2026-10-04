import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { Kicker } from "@/components/ui/primitives";
import { AuroraOvalFigure } from "@/components/science/Figures";

export const metadata: Metadata = {
  title: "The aurora",
  description: "Solar wind, magnetic field lines and glowing skies — the physics of the southern lights over India's Antarctic stations.",
};

const EXPLORE = [
  { href: "/gallery", label: "Aurora imagery in CryoLens", kind: "Gallery" },
  { href: "/stations/maitri", label: "Maitri — aurora ground truth", kind: "Station page" },
  { href: "/vault/datasets/polar-vhf-winds", label: "Middle-atmosphere radar winds", kind: "Dataset · Atmospheric sciences" },
];

export default function AuroraPage() {
  return (
    <div className="pb-16">
      {/* CSS aurora oval — layered gradient ovals breathing on a calm cycle,
         flattened to stillness by the global reduced-motion switch. */}
      <div className="relative -mb-10 h-52 overflow-hidden sm:h-60" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-[#040d18] via-[#062033] to-bg" />
        <div
          className="aurora-oval left-1/2 top-4 h-36 w-[130%] -translate-x-1/2 opacity-80"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(61, 232, 176, 0.30), transparent 62%)" }}
        />
        <div
          className="aurora-oval aurora-oval--late left-1/2 top-12 h-44 w-[150%] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse at 40% 0%, rgba(139, 92, 246, 0.22), transparent 58%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-bg to-transparent" />
        {/* starfield */}
        {[
          [8, 18], [22, 42], [37, 12], [49, 55], [63, 22], [76, 40], [88, 15], [94, 60], [15, 68], [70, 70],
        ].map(([l, t], i) => (
          <span
            key={i}
            className="absolute size-0.5 rounded-full bg-white/70"
            style={{ left: `${l}%`, top: `${t}%`, opacity: i % 3 === 0 ? 0.9 : 0.4 }}
          />
        ))}
      </div>

      <div className="dh-container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Science", href: "/science" }, { label: "Aurora" }]} />
        <Kicker>Science guide · 4 of 5</Kicker>
        <h1 className="display mt-3 max-w-[24ch] text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
          The southern lights, explained
        </h1>
        <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-text-2">
          On winter nights at Maitri and Bharati, the sky can begin to glow — green curtains, sometimes violet.
          The light is real physics, not folklore: the Sun constantly sheds charged particles, and Earth&apos;s
          magnetic field funnels them down over the poles.
        </p>
      </div>

      <div className="dh-container grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="display text-xl font-semibold text-text">Where the glow comes from</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              The <strong className="text-text">solar wind</strong> — a stream of charged particles — carries
              particles that would strip atmospheres bare if they arrived unchecked. Earth&apos;s magnetic field
              deflects most, but field lines converge over the poles and channel some particles down into the
              upper atmosphere. There they collide with oxygen and nitrogen atoms, which re-emit the energy as
              light: green and red from oxygen, blue and violet from nitrogen.
            </p>
          </section>

          <section>
            <h2 className="display text-xl font-semibold text-text">The auroral oval</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              Seen from space, the glow forms a ring around each magnetic pole — the{" "}
              <strong className="text-text">auroral oval</strong>. Stations inside the ring see overhead aurora on
              dark nights; activity follows the Sun: geomagnetic storms push the oval wider and brighter, which is
              why aurora reports and magnetometer readings travel together.
            </p>
          </section>

          <AuroraOvalFigure />

          <section>
            <h2 className="display text-xl font-semibold text-text">Why it is science, not just spectacle</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              Aurora is a visible readout of space weather — the same events that disturb radio communications,
              navigation and power grids at lower latitudes. Optical instruments and radars at polar stations
              turn the glow into data: ionospheric processes, middle-atmosphere winds, particle precipitation.
              That is what &ldquo;upper atmosphere studies&rdquo; means in the expedition science plans.
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
          <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-text-3">
            The illustration above is a CSS aurora-oval — an honest decoration, not a simulation of any night&apos;s
            sky.
          </p>
        </aside>
      </div>
    </div>
  );
}
