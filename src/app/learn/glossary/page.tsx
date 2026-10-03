import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { Kicker } from "@/components/ui/primitives";
import { GlossaryClient } from "@/components/learn/GlossaryClient";
import { ContinuesInEnglish } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Polar science glossary",
  description: "The polar science glossary in English, हिन्दी and বাংলা — searchable, with instrument acronyms kept in their working form.",
};

export default function GlossaryPage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Learn", href: "/learn" }, { label: "Glossary" }]}
          />
          <Kicker>Say it like a scientist</Kicker>
          <h1 className="display mt-3 max-w-[24ch] text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            The polar glossary
          </h1>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-text-2">
            The words that unlock the archive, in three languages. Scientific terms follow approved renderings —
            instrument acronyms like CTD and XBT keep their English form in every language, exactly as they do in
            the field. Definitions are in English while the multilingual roll-out continues.
          </p>
          <ContinuesInEnglish className="mt-4" />
        </div>
      </header>

      <div className="dh-container py-12">
        <GlossaryClient />
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-6">
          <p className="max-w-[60ch] text-sm text-text-2">
            Want the terms in context? Every Learn path uses this vocabulary in its lessons — or take the words
            straight to the data in the Vault.
          </p>
          <div className="flex gap-3">
            <Link href="/learn" className="btn-tactile rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-text hover:border-accent/50">
              Learn paths
            </Link>
            <Link href="/vault" className="btn-tactile rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-bold text-accent-ink">
              Open the Vault →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
