import type { Metadata } from "next";
import Link from "next/link";
import { STORIES } from "@/lib/data/stories";
import { Reveal } from "@/components/ui/Reveal";
import { Kicker } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Stories",
  description: "Documentary stories from the Indian polar programme — built from the archive, not from press releases.",
};

export default function StoriesPage() {
  return (
    <div className="pb-16">
      <header className="atmos border-b border-line pb-14 pt-32 md:pt-40">
        <div className="dh-container">
          <Kicker>Stories</Kicker>
          <h1 className="display mt-4 max-w-3xl text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            The archive, told as documentary.
          </h1>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-text-2">
            Long-form, scrollytelling pieces assembled from station records, expedition reports and imagery — with
            every claim linked back to a record in the Vault.
          </p>
        </div>
      </header>

      <div className="dh-container flex flex-col divide-y divide-line">
        {STORIES.map((s) => (
          <Reveal key={s.slug}>
            <Link href={`/stories/${s.slug}`} className="group grid items-center gap-10 py-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="meta-label">Documentary · {s.readingTime} · {s.chapterCount} chapters</p>
                <h2 className="display mt-3 text-4xl font-bold group-hover:text-accent md:text-5xl">{s.title}</h2>
                <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-text-2">{s.standfirst}</p>
                <span className="link-line mt-6 inline-block text-sm font-medium text-accent">Read the story →</span>
              </div>
              <figure className="overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.cover}
                  alt={s.coverAlt}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <figcaption className="bg-surface px-4 py-2.5 text-[11px] text-text-3">{s.coverCredit}</figcaption>
              </figure>
            </Link>
          </Reveal>
        ))}
        <Reveal>
          <p className="py-10 text-sm leading-relaxed text-text-3">
            The story engine ships with reusable chapter templates (parallax image, map scrub, data moment, quote,
            records block) so the communications desk can publish the next documentary without a developer —
            that is the production roadmap this demo argues for.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
