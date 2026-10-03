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

/** Editorial scroll timeline: sticky year column + milestone stream. */
export function YearsInMotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (document.documentElement.getAttribute("data-reduced-motion") === "true") return;

    let destroyed = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (destroyed) return;
      gsap.registerPlugin(ScrollTrigger);

      const years = MILESTONES.map((m) => m.year);
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            const idx = Math.min(years.length - 1, Math.floor(self.progress * years.length));
            if (yearRef.current) yearRef.current.textContent = String(years[idx]);
            if (barRef.current) barRef.current.style.transform = `scaleY(${self.progress})`;
          },
        },
      });
      st.to({}, { duration: 1 });
    })();
    return () => {
      destroyed = true;
    };
  }, []);

  return (
    <section id="years" ref={sectionRef} className="relative bg-bg" aria-label="45 years of the Indian polar programme">
      <div className="sticky top-0 z-10 flex h-[100dvh] items-center overflow-hidden">
        {/* Sticky year column */}
        <div className="dh-container flex h-full items-center">
          <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-[minmax(220px,0.9fr)_2fr]">
            <div className="pointer-events-none relative hidden flex-col justify-center md:flex">
              <span className="numeral select-none text-[9rem] font-bold leading-none text-text/90 tabular-nums lg:text-[11rem]">
                <span ref={yearRef}>1981</span>
              </span>
              <span className="meta-label mt-2">Indian polar programme · 1981 → 2026</span>
              <div className="absolute -right-6 top-1/2 hidden h-[60vh] w-px -translate-y-1/2 bg-line lg:block">
                <div ref={barRef} className="h-full w-full origin-top bg-accent/70" style={{ transform: "scaleY(0)" }} />
              </div>
            </div>

            {/* Milestone stream */}
            <div className="flex flex-col gap-6 py-24 md:py-[40vh]">
              {MILESTONES.map((m) => (
                <Reveal key={m.year} delay={40}>
                  <article className="relative grid gap-5 border-l border-line-strong pl-6 md:pl-10">
                    <span
                      className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-accent shadow-[0_0_0_4px_var(--bg)]"
                      aria-hidden
                    />
                    <div className="flex items-center gap-3">
                      <span className="numeral text-sm font-bold text-accent md:hidden">{m.year}</span>
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
                          {m.credit && <figcaption className="bg-surface px-3 py-1.5 text-[10px] text-text-3">{m.credit}</figcaption>}
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
      </div>
    </section>
  );
}
