"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Story } from "@/lib/types";
import { ScientificChart } from "@/components/ui/ScientificChart";
import { ProvenanceChip } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";

export function StoryReader({ story }: { story: Story }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Reading progress (imperative; no React state)
    const onScroll = () => {
      const rect = root.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (progressRef.current) progressRef.current.textContent = `${Math.round(p * 100)}%`;
      // active chapter
      let activeIdx = 0;
      chapterRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) activeIdx = i;
      });
      root.querySelectorAll<HTMLAnchorElement>("[data-chapter-dot]").forEach((a, i) => {
        a.dataset.active = String(i === activeIdx);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let destroyed = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      if (
        document.documentElement.getAttribute("data-reduced-motion") === "true" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (destroyed) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-parallax-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: img.closest("figure"), scrub: true },
            },
          );
        });
      }, root);
      cleanup = () => ctx.revert();
    })();

    return () => {
      destroyed = true;
      window.removeEventListener("scroll", onScroll);
      cleanup?.();
    };
  }, [story]);

  return (
    <div ref={rootRef} className="relative">
      {/* Reading progress */}
      <div className="fixed inset-x-0 top-0 z-[65] h-[3px] bg-line/40">
        <div ref={barRef} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
      <span className="numeral fixed right-4 top-4 z-[65] hidden text-xs text-text-3 md:block">
        <span ref={progressRef}>0%</span>
      </span>

      {/* Chapter rail (desktop) */}
      <nav aria-label="Chapters" className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
        {story.chapters.map((c, i) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            data-chapter-dot={String(i === 0)}
            data-active="false"
            className="group flex items-center gap-2"
          >
            <span className="h-px w-5 bg-line-strong transition-all group-hover:w-7 group-hover:bg-accent data-[active=true]:w-7 data-[active=true]:bg-accent" />
            <span className="numeral text-[10px] text-text-3 opacity-0 transition-opacity group-hover:opacity-100 data-[active=true]:opacity-100">
              {c.kicker.split("·")[0].trim().slice(0, 12)}
            </span>
          </a>
        ))}
      </nav>

      {/* Cover */}
      <header className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pb-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={story.cover} alt={story.coverAlt} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" aria-hidden />
        <div className="dh-container relative">
          <div className="mb-8 inline-block rounded-lg bg-bg/45 px-3 py-1.5 backdrop-blur-sm [&_a]:text-white/70 [&_a:hover]:text-white [&_[aria-current]]:text-white/90 [&_svg]:text-white/60">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Stories", href: "/stories" }, { label: story.title }]} />
          </div>
          <p className="meta-label mb-4">A YETI documentary story · {story.readingTime}</p>
          <h1 className="display max-w-4xl text-balance text-6xl font-bold leading-[0.95] md:text-8xl">
            {story.title}
          </h1>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-text-2">{story.standfirst}</p>
          <p className="mt-6 text-[11px] text-text-3">Cover: {story.coverCredit}</p>
        </div>
      </header>

      {/* Chapters */}
      {story.chapters.map((chapter, i) => {
        const align = chapter.align ?? "left";
        return (
          <section
            key={chapter.id}
            id={chapter.id}
            ref={(el) => {
              chapterRefs.current[i] = el;
            }}
            className="scroll-mt-24 py-20 md:py-28"
            aria-label={chapter.title}
          >
            <div className="dh-container-tight">
              <div className="mb-8 flex items-center gap-4">
                <span className="numeral rounded-md border border-accent/40 bg-accent-dim px-2.5 py-1 text-[11px] font-bold text-accent">
                  {String(i).padStart(2, "0")}
                </span>
                <span className="meta-label">{chapter.kicker}</span>
              </div>
              <h2 className="display text-balance text-3xl font-bold leading-[1.05] md:text-5xl">{chapter.title}</h2>

              <div className={`mt-8 grid gap-10 ${chapter.image ? "lg:grid-cols-[1.2fr_1fr] lg:items-center" : ""}`}>
                <div className={`flex flex-col gap-5 ${align === "right" && chapter.image ? "lg:order-first" : ""}`}>
                  {chapter.paragraphs.map((p, j) => (
                    <p key={j} className="text-lg leading-[1.75] text-text-2">
                      {p}
                    </p>
                  ))}
                  {chapter.quote && (
                    <blockquote className="my-6 border-l-2 border-accent pl-6">
                      <p className="display text-2xl font-semibold italic leading-snug text-text md:text-3xl">
                        “{chapter.quote.text}”
                      </p>
                      <cite className="meta-label mt-3 block not-italic">{chapter.quote.attribution}</cite>
                    </blockquote>
                  )}
                  {chapter.chart && (
                    <div className="rounded-xl border border-line bg-surface p-6">
                      <ScientificChart
                        series={chapter.chart.series}
                        label={chapter.chart.label}
                        unit={chapter.chart.unit}
                        highlight={chapter.chart.highlight}
                        xLabels={["Year 0", "Year 4", "Year 8"]}
                      />
                      <p className="mt-3 text-xs leading-relaxed text-text-3">{chapter.chart.caption}</p>
                    </div>
                  )}
                </div>
                {chapter.image && (
                  <figure className="overflow-hidden rounded-xl border border-line">
                    <div className="overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={chapter.image}
                        alt={chapter.imageAlt ?? ""}
                        data-parallax-img=""
                        className="aspect-[4/3] w-full scale-[1.18] object-cover"
                        loading="lazy"
                      />
                    </div>
                    {chapter.imageCredit && (
                      <figcaption className="bg-surface px-4 py-2.5 text-[11px] text-text-3">
                        {chapter.imageCredit}
                      </figcaption>
                    )}
                  </figure>
                )}
              </div>

              {chapter.records && (
                <div className="mt-10 rounded-xl border border-line bg-surface p-6">
                  <p className="meta-label mb-3">Related records in the archive</p>
                  <ul className="flex flex-wrap gap-2">
                    {chapter.records.map((r) => (
                      <li key={r.href}>
                        <Link
                          href={r.href}
                          className="btn-tactile inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-text-2 hover:border-accent/60 hover:text-accent"
                        >
                          {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        );
      })}

      <footer className="dh-container-tight border-t border-line py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ProvenanceChip p={story.provenance} label="Verified public facts · editorial framing by YETI" />
          <Link href="/expeditions" className="link-line text-sm text-accent">
            Continue to the expedition index →
          </Link>
        </div>
      </footer>
    </div>
  );
}
