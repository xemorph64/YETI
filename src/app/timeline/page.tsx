import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { Kicker } from "@/components/ui/primitives";
import { TimelineClient } from "@/components/timeline/TimelineClient";

export const metadata: Metadata = {
  title: "Polar research timeline",
  description: "Four decades of Indian polar research on one line — from the first Antarctic landing to the Bharati era, filterable by programme and decade.",
};

export default function TimelinePage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Timeline" }]} />
          <Kicker>1981 → today · one line of ice</Kicker>
          <h1 className="display mt-3 max-w-[26ch] text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            The polar research timeline
          </h1>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-text-2">
            Every Indian polar season on a single line — Antarctic expeditions since 1981, the Arctic programme
            since 2007, and the Southern Ocean cruises that connect them. Milestones are marked only where the
            record is verified. Filter by programme or decade, then open any season&apos;s full story.
          </p>
        </div>
      </header>

      <div className="dh-container py-12">
        <TimelineClient />
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-6">
          <p className="max-w-[60ch] text-sm text-text-2">
            Prefer to read forward instead of along the line? The expedition shelf carries every season&apos;s
            story mode — objectives, journey, field activity and outputs.
          </p>
          <Link href="/expeditions" className="btn-tactile rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-bold text-accent-ink">
            Browse expeditions →
          </Link>
        </div>
      </div>
    </div>
  );
}
