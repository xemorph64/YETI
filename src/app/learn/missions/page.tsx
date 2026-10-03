import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { Kicker } from "@/components/ui/primitives";
import { MissionsClient } from "@/components/learn/MissionsClient";

export const metadata: Metadata = {
  title: "Science missions",
  description: "The seven polar science missions as self-guided activities — every step links a real record in the archive.",
};

export default function MissionsPage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn", href: "/learn" }, { label: "Missions" }]} />
          <Kicker>Seven missions · self-guided</Kicker>
          <h1 className="display mt-3 max-w-[26ch] text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            Do the science, not just the reading
          </h1>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-text-2">
            Each mission is one of the programme&apos;s science themes turned into a short investigation. Every step
            goes somewhere real — a dataset, a graph view, a lab, a lesson — so finishing a mission means you have
            actually looked at the records. Progress is kept in your browser only.
          </p>
        </div>
      </header>

      <div className="dh-container py-12">
        <MissionsClient />
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-6">
          <p className="max-w-[60ch] text-sm text-text-2">
            Finished one? Follow the same theme deeper in the knowledge graph, or earn badges on the Learn paths.
          </p>
          <div className="flex gap-3">
            <Link href="/learn" className="btn-tactile rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-text hover:border-accent/50">
              Learn paths
            </Link>
            <Link href="/researcher/graph" className="btn-tactile rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-bold text-accent-ink">
              Knowledge graph →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
