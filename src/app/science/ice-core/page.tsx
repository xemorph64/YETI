import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { Kicker } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Ice cores",
  description: "How layered snow becomes a year-by-year archive of past atmosphere — the science of ice cores, explained.",
};

const EXPLORE = [
  { href: "/vault/datasets/snow-pit-stratigraphy", label: "Snow-pit stratigraphy", kind: "Dataset · Glaciology" },
  { href: "/labs", label: "Ice-core layer reveal (in the labs)", kind: "Science Labs · simulated" },
  { href: "/expeditions/EXP-05", label: "A core-reconnaissance season", kind: "Expedition story" },
];

export default function IceCorePage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Science", href: "/science" }, { label: "Ice cores" }]} />
          <Kicker>Science guide · 2 of 5</Kicker>
          <h1 className="display mt-3 max-w-[24ch] text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            A tape recorder made of ice
          </h1>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-text-2">
            Every year&apos;s snowfall buries the last one. Compacted century by century, the layers keep their
            order — and trap the air of each era in sealed bubbles. Drill down carefully and you can read the
            atmosphere&apos;s history the way tree rings read droughts.
          </p>
        </div>
      </header>

      <div className="dh-container grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="display text-xl font-semibold text-text">From snowfall to archive</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              Fresh snow is loose and full of air. Over years it compresses into <strong className="text-text">firn</strong> —
              old snow whose pores are still connected. Deeper still, pores pinch shut and each layer becomes ice
              holding a sealed sample of whatever the atmosphere was when it fell. Above roughly the level where
              that happens, the archive is still being written; below it, the archive is closed.
            </p>
          </section>

          <section>
            <h2 className="display text-xl font-semibold text-text">What the layers carry</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              The trapped bubbles are ancient air — their greenhouse-gas mix is measured directly. The ice itself
              carries <strong className="text-text">isotopes</strong> that record the temperature at which the
              snow formed. And the layers hold dust and sea-salt spikes: volcanic horizons, stormy seasons, clean
              decades. Count the layers between known horizons and depth becomes age.
            </p>
            <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
              Age scales are measured, not assumed — they depend on how fast snow accumulates at the site, which
              is why cores from different places are dated with independent checks (instrumental records, known
              eruptions) before anyone reads a trend.
            </p>
          </section>

          <section>
            <h2 className="display text-xl font-semibold text-text">India&apos;s entry point</h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-text-2">
              Deep drilling is a specialist discipline that starts with reconnaissance: pit-to-core stratigraphy
              practice, drilling rehearsals and site selection — the work some Indian Antarctic seasons carry as
              an explicit objective. YETI&apos;s demo build shows the educational version; the layer reveal in the
              labs is a conceptual model, honestly labelled.
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
