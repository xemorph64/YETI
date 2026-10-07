"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ProvenanceChip } from "@/components/ui/primitives";

interface Milestone {
  year: number;
  title: string;
  body: string;
  image?: string;
  credit?: string;
  provenance?: "verified" | "demo";
}

const MILESTONES: Milestone[] = [
  {
    year: 1981,
    title: "The first landing",
    body: "A 21-member team led by Dr. S.Z. Qasim reaches the Antarctic ice shelf off Queen Maud Land. India joins the small club of nations working on the ice.",
    image: "/img/antarctica-aerial.jpg",
    credit: "NASA · Public domain",
    provenance: "verified",
  },
  {
    year: 1983,
    title: "Dakshin Gangotri rises",
    body: "The third expedition builds India's first Antarctic station — on the ice shelf itself. It will work brilliantly, for a while.",
    provenance: "verified",
  },
  {
    year: 1989,
    title: "Maitri, on solid ground",
    body: "After the shelf begins swallowing the first station, India moves inland to the Schirmacher Oasis. Maitri anchors the programme to this day.",
    image: "/img/maitri-station.jpg",
    credit: "Prakash Khatarkar · CC BY-SA 4.0",
    provenance: "verified",
  },
  {
    year: 1990,
    title: "The shelf keeps what it lends",
    body: "Dakshin Gangotri is decommissioned — buried under years of accumulated snow. It becomes a listed historic site under the Antarctic Treaty system.",
    provenance: "verified",
  },
  {
    year: 1998,
    title: "A home for polar science",
    body: "The National Centre for Antarctic and Ocean Research (today NCPOR) is established at Goa — an institution devoted to the poles and the ocean between them.",
    provenance: "verified",
  },
  {
    year: 2007,
    title: "North, at last",
    body: "India's first Arctic expedition reaches Ny-Ålesund, Svalbard — the international science village at 79°N.",
    image: "/img/svalbard-landscape.jpg",
    credit: "European Space Agency · Attribution",
    provenance: "verified",
  },
  {
    year: 2008,
    title: "Himadri opens",
    body: "India's Arctic station is established at Ny-Ålesund. The abode of snow gives India a second hemisphere to read.",
    provenance: "verified",
  },
  {
    year: 2012,
    title: "Bharati on Prydz Bay",
    body: "The modern coastal station at the Larsemann Hills is commissioned — purpose-built, on rock, facing the Southern Ocean.",
    image: "/img/bharati-station.jpg",
    credit: "Public domain · via Wikimedia Commons",
    provenance: "verified",
  },
  {
    year: 2022,
    title: "The law of the ice",
    body: "The Indian Antarctic Act receives assent — environmental protection, permits and accountability for Indian activities on the continent.",
    provenance: "verified",
  },
  {
    year: 2026,
    title: "The archive opens",
    body: "Forty-five years of expeditions, datasets, imagery and stories gather in one place. This portal — YETI — is the demonstration of that idea.",
    image: "/img/aurora-australis.jpg",
    credit: "Chris Danals, NSF · Public domain",
    provenance: "demo",
  },
];

/**
 * Editorial scroll timeline. The page scrolls the milestone stream naturally;
 * on md+ the year column stays pinned beside it and shows whichever milestone
 * sits in the middle of the viewport.
 */
export function YearsInMotion() {
  const streamRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stream = streamRef.current;
    if (!stream) return;
    const items = Array.from(stream.querySelectorAll<HTMLElement>("[data-year]"));
    // A thin band across the middle of the viewport: the milestone crossing it is "now".
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const idx = items.indexOf(el);
          if (yearRef.current) yearRef.current.textContent = el.dataset.year ?? "";
          if (barRef.current) barRef.current.style.transform = `scaleY(${(idx + 1) / items.length})`;
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="years" className="relative bg-bg" aria-label="45 years of the Indian polar programme">
      <div className="dh-container">
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-[minmax(220px,0.9fr)_2fr]">
          {/* Pinned year column (md+) */}
          <div className="pointer-events-none relative hidden md:block" aria-hidden>
            <div className="sticky top-0 flex h-[100dvh] flex-col justify-center">
              <span className="numeral select-none text-[clamp(5rem,9vw,11rem)] font-bold leading-none text-text/90 tabular-nums">
                <span ref={yearRef}>1981</span>
              </span>
              <span className="meta-label mt-2">Indian polar programme · 1981 → 2026</span>
              <div className="absolute -right-6 top-1/2 hidden h-[60vh] w-px -translate-y-1/2 bg-line lg:block">
                <div
                  ref={barRef}
                  className="h-full w-full origin-top bg-accent/70 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: "scaleY(0)" }}
                />
              </div>
            </div>
          </div>

          {/* Milestone stream */}
          <div ref={streamRef} className="flex flex-col gap-16 py-24 md:gap-24 md:py-[40vh]">
            {MILESTONES.map((m) => (
              <Reveal key={m.year} delay={40}>
                <article data-year={m.year} className="relative grid gap-5 border-l border-line-strong pl-6 md:pl-10">
                  <span
                    className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-accent shadow-[0_0_0_4px_var(--bg)]"
                    aria-hidden
                  />
                  <div className="flex items-center gap-3">
                    <span className="numeral text-sm font-bold text-accent md:sr-only">{m.year}</span>
                    <ProvenanceChip p={m.provenance ?? "demo"} />
                  </div>
                  <div className="grid gap-5 md:grid-cols-[1.4fr_1fr] md:items-center">
                    <div>
                      <h3 className="display text-2xl font-semibold text-text md:text-3xl">{m.title}</h3>
                      <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-text-2">{m.body}</p>
                    </div>
                    {m.image && (
                      <figure className="overflow-hidden rounded-lg border border-line">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                        {m.credit && <figcaption className="bg-surface px-3 py-1.5 text-xs text-text-3">{m.credit}</figcaption>}
                      </figure>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
            <Reveal>
              <Link
                href="/expeditions"
                className="btn-tactile mt-6 inline-flex items-center gap-2 rounded-md border border-line-strong px-5 py-3 text-sm font-semibold text-text hover:border-accent/60 hover:text-accent"
              >
                Open the full expedition index →
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
