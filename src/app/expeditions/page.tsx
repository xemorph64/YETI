import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EXPEDITIONS } from "@/lib/data/expeditions";
import { Reveal } from "@/components/ui/Reveal";
import { Kicker, ProvenanceChip } from "@/components/ui/primitives";
import { toRoman } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Expeditions",
  description: "The index of Indian polar expeditions: Antarctic seasons since 1981, Arctic campaigns since 2007, Southern Ocean cruises.",
};

const PROGRAMMES = ["Antarctic", "Arctic", "Southern Ocean"] as const;

export default function ExpeditionsPage() {
  const byProgramme = PROGRAMMES.map((p) => ({
    programme: p,
    items: EXPEDITIONS.filter((e) => e.programme === p).sort((a, b) => b.startYear - a.startYear),
  }));

  return (
    <div className="pb-10">
      {/* Archive header */}
      <header className="atmos border-b border-line pb-16 pt-32 md:pt-40">
        <div className="dh-container grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Kicker>The index</Kicker>
            <h1 className="display mt-4 text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
              Forty-five years of going south.
              <span className="block text-text-3">And north, since 2007.</span>
            </h1>
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5">
            <ProvenanceChip p="demo" label="Seeded demonstration archive" />
            <p className="text-xs leading-relaxed text-text-2">
              Milestone entries (first expedition, station years) reflect verified public facts. Season-level details
              are demonstration records — official rosters and vessel logs live with NCPOR. Each record carries its
              own provenance chip.
            </p>
          </div>
        </div>
      </header>

      {byProgramme.map(({ programme, items }) => (
        <section key={programme} className="py-16" aria-label={`${programme} expeditions`}>
          <div className="dh-container">
            <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-4">
              <h2 className="display text-2xl font-semibold md:text-3xl">{programme}</h2>
              <span className="numeral text-sm text-text-3">{items.length} records</span>
            </div>
            <div className="flex flex-col">
              {items.map((e, i) => (
                <Reveal key={e.id} delay={Math.min(i * 30, 240)}>
                  <Link
                    href={`/expeditions/${e.id}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-line py-4 transition-colors hover:bg-surface-2/60 md:grid-cols-[90px_130px_1fr_260px_auto] md:gap-8 md:px-4"
                  >
                    <span className="numeral text-2xl font-bold text-text-3 transition-colors group-hover:text-accent md:text-3xl">
                      {programme === "Antarctic" ? toRoman(e.number) : String(e.number).padStart(2, "0")}
                    </span>
                    <span className="numeral hidden text-sm text-text-2 md:block">{e.season}</span>
                    <span className="min-w-0">
                      <span className="display block truncate text-base font-semibold text-text md:text-lg">
                        {e.milestone ?? `${e.ordinal} ${programme} expedition`}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-text-3">
                        {e.season} · {e.region} · {e.objectives.join(" · ")}
                      </span>
                    </span>
                    <span className="hidden overflow-hidden rounded-md border border-line md:block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={e.cover} alt="" className="h-14 w-full object-cover" loading="lazy" />
                    </span>
                    <ArrowUpRight
                      className="size-4 text-text-3 transition-all group-hover:-translate-y-0.5 group-hover:text-accent"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
