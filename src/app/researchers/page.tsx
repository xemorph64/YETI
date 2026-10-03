import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";
import { RESEARCHERS, RESEARCHER_DOMAINS } from "@/lib/data/researchers";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { Kicker } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Researcher directory",
  description:
    "Who does the science: the researcher directory wired into the Polar Knowledge Graph — demonstration profiles in this build.",
};

export default function ResearchersPage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Researchers" }]} />
          <Kicker>Polar community · §55</Kicker>
          <h1 className="display mt-3 max-w-[24ch] text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            The people behind the records
          </h1>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-text-2">
            Science is done by people. The directory connects each researcher to the stations they work from, the
            themes they study, the datasets they use and the papers they author — the same graph that connects every
            other record in the archive.
          </p>
        </div>
      </header>

      {/* Honesty banner — personnel data is consent-gated in production */}
      <div className="dh-container pt-8">
        <div className="flex items-start gap-3 rounded-xl border border-sunrise/40 bg-sunrise-dim px-5 py-4">
          <UsersRound className="mt-0.5 size-4 shrink-0 text-sunrise" strokeWidth={1.5} aria-hidden />
          <p className="text-sm leading-relaxed text-text-2">
            <strong className="font-semibold text-text">Demonstration profiles.</strong> Crew rosters and personnel
            data are personal data — this demo archive intentionally does not seed real people. Every profile below
            is a fictional persona built to show how the directory, the graph and the Vault connect. Production
            would require consent-gated ingest (see{" "}
            <Link href="/about#honesty" className="link-line text-accent">data honesty</Link>).
          </p>
        </div>
      </div>

      {/* Domain chips */}
      <div className="dh-container mt-8 flex flex-wrap gap-2" aria-label="Domains">
        {RESEARCHER_DOMAINS.map((d) => (
          <span key={d} className="rounded-full border border-line-strong bg-surface px-4 py-1.5 text-xs text-text-2">
            {d} · {RESEARCHERS.filter((r) => r.domain === d).length}
          </span>
        ))}
      </div>

      {/* Directory grid */}
      <div className="dh-container mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {RESEARCHERS.map((r) => (
          <Link
            key={r.id}
            href={`/researchers/${r.id}`}
            className="btn-tactile group flex flex-col rounded-xl border border-line bg-surface p-6 hover:border-accent/50"
          >
            <div className="flex items-center justify-center rounded-lg border border-line bg-surface-2 py-5">
              <span className="display text-2xl font-bold text-text-3">
                {r.name.replace("Dr. ", "").split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
            </div>
            <p className="meta-label mt-4">{r.programme} · {r.domain}</p>
            <h2 className="display mt-1.5 text-lg font-semibold text-text group-hover:text-accent">{r.name}</h2>
            <p className="mt-0.5 text-xs text-text-3">{r.title}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-text-2">{r.expeditionNote}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
              {r.themes.length} themes · {r.datasetIds.length} datasets
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      {/* Graph bridge */}
      <div className="dh-container mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-6">
          <div>
            <h2 className="display text-lg font-semibold text-text">See them in the graph</h2>
            <p className="mt-1 max-w-[60ch] text-sm text-text-2">
              Every directory profile is a researcher node in the Polar Knowledge Graph — walk two hops from a
              person to their station, datasets and publications.
            </p>
          </div>
          <Link href="/researcher/graph" className="btn-tactile rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-bold text-accent-ink">
            Open the knowledge graph →
          </Link>
        </div>
      </div>
    </div>
  );
}
