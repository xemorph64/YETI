import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { Kicker } from "@/components/ui/primitives";
import { ParticipateClient } from "@/components/participate/ParticipateClient";

export const metadata: Metadata = {
  title: "Participate — citizen science",
  description: "Help read the poles: an image-classification demo where every label enters a clearly separated citizen-science review class.",
};

export default function ParticipatePage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Participate" }]} />
          <Kicker>Citizen science · public contributions</Kicker>
          <h1 className="display mt-3 max-w-[26ch] text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            Lend your eyes to the ice
          </h1>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-text-2">
            Real polar science often starts with labelling: classifying imagery so datasets become searchable.
            Below is a demonstration of the task — pick what each image shows, and watch where your contribution
            goes. Honest by design: labels enter a review queue of their own, and in this build nothing leaves
            your browser.
          </p>
        </div>
      </header>

      <div className="dh-container py-12">
        <ParticipateClient />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="meta-label">Step 1 · Classify</p>
            <p className="mt-2 text-sm leading-relaxed text-text-2">
              Choose the dominant subject of each image — the same first step production citizen projects ask of
              volunteers.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="meta-label">Step 2 · Review class</p>
            <p className="mt-2 text-sm leading-relaxed text-text-2">
              Labels queue in a citizen-science class, visibly separate from researcher submissions and verified
              metadata.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="meta-label">Step 3 · Curation</p>
            <p className="mt-2 text-sm leading-relaxed text-text-2">
              In production, agreement across volunteers would surface a label for curator approval — never
              auto-publish. See <Link href="/about#honesty" className="link-line text-accent">data honesty</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
