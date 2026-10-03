import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { Kicker } from "@/components/ui/primitives";
import { VaultExplorer } from "@/components/vault/VaultExplorer";

export const metadata: Metadata = {
  title: "The Vault",
  description: "The knowledge repository: datasets, publications and expedition reports with licences, versions and citation hooks.",
};

export default function VaultPage() {
  return (
    <div className="pb-10">
      <header className="border-b border-line bg-surface pb-14 pt-32 md:pt-40">
        <div className="dh-container grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Kicker>The Vault · knowledge repository</Kicker>
            <h1 className="display mt-4 text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
              Research-grade, human-readable.
            </h1>
            <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-text-2">
              Datasets carry structured metadata, explicit licences, version history and one-click citation.
              Publications and expedition reports sit on the same shelf, cross-linked to the voyages that produced
              them. One search box reaches all of it.
            </p>
          </div>
          <div className="rounded-xl border border-violet/30 bg-violet-dim p-5">
            <p className="meta-label mb-2 !text-violet">Read before you cite</p>
            <p className="text-xs leading-relaxed text-text-2">
              Every record below is a <strong>synthetic demonstration</strong>: variables and structure mirror real
              Indian polar science, but values are generated. Official data access runs through NCPOR. This is what
              honest demo data looks like.
            </p>
          </div>
        </div>
      </header>

      <div className="dh-container py-14">
        <Reveal>
          <VaultExplorer />
        </Reveal>
      </div>
    </div>
  );
}
