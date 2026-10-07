"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { YetiGlobe, GOA, STATION_POINTS, webglSupported, type ArcSpec, type GlobeHandle } from "@/components/globe/YetiGlobe";
import { FallbackMap } from "@/components/globe/GlobeFallback";
import { T } from "@/lib/i18n";

const ARC_COLORS: Record<string, [string, string]> = {
  maitri: ["#3BE8B0", "rgba(59,232,176,0.05)"],
  bharati: ["#3BE8B0", "rgba(59,232,176,0.05)"],
  himadri: ["#8A6CFF", "rgba(138,108,255,0.05)"],
  "dakshin-gangotri": ["#FF8A5C", "rgba(255,138,92,0.05)"],
};

const PROGRAMME_STATION: Record<string, string> = {
  Antarctic: "maitri",
  Arctic: "himadri",
  "Southern Ocean": "bharati",
};

export function arcsForExpeditions(exps: { id: string; programme: string; startYear: number }[]): ArcSpec[] {
  const target = (programme: string) =>
    STATION_POINTS.find((s) => s.name.toLowerCase() === PROGRAMME_STATION[programme]) ?? STATION_POINTS[0];
  return exps.map((e) => {
    const st = target(e.programme);
    const hue = e.programme === "Arctic" ? ARC_COLORS.himadri : e.programme === "Southern Ocean" ? ARC_COLORS.bharati : ARC_COLORS.maitri;
    return {
      startLat: GOA.lat,
      startLng: GOA.lng,
      endLat: st.lat,
      endLng: st.lng,
      color: hue,
      altitude: 0.14 + ((e.startYear - 1981) % 12) * 0.012,
      stroke: 0.45,
      ref: e.id,
    };
  });
}

/**
 * Cinematic hero. Poster first; WebGL lazy-crossfades in.
 * Scroll: camera descends to Antarctica, routes illuminate by decade,
 * copy yields — then hands off to the Atlas.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const globeHandle = useRef<GlobeHandle | null>(null);
  const [globeOn, setGlobeOn] = useState(false);
  const [noWebGL, setNoWebGL] = useState(false);

  const fullArcs = useMemo<ArcSpec[]>(
    () =>
      arcsForExpeditions(
        // one representative arc per station + recent seasons for depth
        [1, 3, 9, 15, 22, 28, 31, 36, 40, 44].map((n) => ({
          id: `hero-${n}`,
          programme: n === 9 || n === 28 ? "Antarctic" : "Antarctic",
          startYear: 1980 + n,
        })).concat([
          { id: "hero-arc1", programme: "Arctic", startYear: 2007 },
          { id: "hero-arc2", programme: "Arctic", startYear: 2015 },
          { id: "hero-arc3", programme: "Southern Ocean", startYear: 2018 },
        ]),
      ),
    [],
  );

  useEffect(() => {
    if (!webglSupported()) {
      setNoWebGL(true);
      return;
    }
    // Lazy-mount the globe after the poster paints.
    const t = setTimeout(() => setGlobeOn(true), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    if (!section || !copy) return;
    if (
      document.documentElement.getAttribute("data-reduced-motion") === "true" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return; // static hero
    }

    const raf = 0;
    let destroyed = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (destroyed) return;
      gsap.registerPlugin(ScrollTrigger);

      const st = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            // Once the copy has faded to a ghost, it must stop catching clicks
            // meant for the globe behind it.
            copy.style.pointerEvents = p > 0.2 ? "none" : "";
            // Camera: Goa → Antarctica (imperative; no React state churn)
            globeHandle.current?.pointOfView(
              {
                lat: 22 - 95 * p,
                lng: 60 + 8 * p,
                altitude: 2.4 - 0.85 * p,
              },
              0,
            );
          },
        },
      });
      st.to(copy, { opacity: 0.06, y: -70, ease: "power1.in" }, 0.12);
      st.to({}, { duration: 1 }); // tail pad for scrub length
    })();

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
    };
  }, [globeOn]);

  const onReady = (h: GlobeHandle) => {
    globeHandle.current = h;
  };

  return (
    <section ref={sectionRef} className="relative h-[240vh]" aria-label="YETI introduction">
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden atmos">
        {/* Poster-first background */}
        <div className="absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/antarctica-aerial.jpg"
            alt=""
            className="h-full w-full object-cover opacity-30"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_30%,var(--bg)_92%)]" />
        </div>

        {/* Globe layer */}
        <div className="absolute inset-0">
          {!noWebGL && globeOn && (
            <YetiGlobe
              arcs={fullArcs}
              pov={{ lat: 22, lng: 60, altitude: 2.4 }}
              handleRef={globeHandle}
              onReady={onReady}
              zoomEnabled={false}
            />
          )}
          {noWebGL && (
            <div className="absolute inset-0 p-6 pt-24 opacity-80">
              <FallbackMap arcs={fullArcs} />
            </div>
          )}
        </div>

        {/* Copy */}
        <div className="dh-container relative z-10 flex flex-1 flex-col justify-end pb-[14vh] pt-28">
          <div ref={copyRef} className="max-w-3xl">
            <p className="meta-label mb-5 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent pulse-dot" aria-hidden />
              <T k="hero.kicker" as="span" />
            </p>
            <h1 className="display text-balance text-[2.6rem] font-bold leading-[1.02] md:text-6xl lg:text-[4.4rem]">
              <T k="hero.line1" as="span" className="block text-text" />
              <T k="hero.line2" as="span" className="block text-text-2" />
              <T k="hero.line3" as="span" className="block text-accent" />
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-text-2 md:text-lg">
              <T k="hero.sub" as="span" />
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {/* Primary: the signature experience. Workspace entry lives in the header and the doors. */}
              <Link
                href="/atlas"
                className="btn-tactile inline-flex items-center gap-2 rounded-md bg-accent-fill px-6 py-3.5 text-sm font-semibold text-accent-ink hover:opacity-90"
              >
                <Compass className="size-4" strokeWidth={1.5} aria-hidden />
                <T k="hero.cta.atlas" as="span" />
                <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
              </Link>
              {/* Secondary: anchor-scroll to the USP/feature band. */}
              <a
                href="#science"
                className="btn-tactile inline-flex items-center gap-2 rounded-md border border-line-strong bg-surface/50 px-6 py-3.5 text-sm font-semibold text-text backdrop-blur hover:border-text-3"
              >
                <T k="hero.cta.explore" as="span" />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 max-md:bottom-20" aria-hidden>
          <div className="flex flex-col items-center gap-2 text-text-3">
            <span className="meta-label max-md:hidden">
              <T k="hero.scrollcue" as="span" />
            </span>
            <span className="h-8 w-px animate-pulse bg-gradient-to-b from-accent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
