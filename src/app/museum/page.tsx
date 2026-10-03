"use client";

/**
 * Museum Bridge & Kiosk — a *proposed* digital bridge to a Polar & Ocean
 * Museum concept (no official integration claimed — core doc §21).
 * Flow: physical exhibit → QR → YETI story → expedition → station → research.
 * `?kiosk=1` switches to large touch targets with minimal navigation.
 */

import { useEffect } from "react";
import Link from "next/link";
import { QrCode, ScanLine } from "lucide-react";
import { STORIES } from "@/lib/data/stories";
import { Kicker } from "@/components/ui/primitives";
import { Mascot } from "@/components/yeti/Mascot";
import { cn } from "@/lib/utils";

/** Deterministic demo QR pattern — illustrative, not a scannable code. */
function DemoQR({ seed, size = 120 }: { seed: string; size?: number }) {
  const n = 11;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const cells: boolean[] = [];
  let x = h >>> 0;
  for (let i = 0; i < n * n; i++) {
    x = (Math.imul(x, 1103515245) + 12345) >>> 0;
    cells.push((x >>> 16) % 100 > 52);
  }
  // finder squares
  const finder = (r: number, c: number) =>
    (r < 3 && c < 3) || (r < 3 && c >= n - 3) || (r >= n - 3 && c < 3);
  return (
    <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} role="img" aria-label="Demonstration QR pattern — illustrative only" className="rounded-md bg-white p-1">
      {cells.map((on, i) => {
        const r = Math.floor(i / n);
        const c = i % n;
        if (finder(r, c)) return null;
        return on ? <rect key={i} x={c} y={r} width="1" height="1" fill="#0e1b2a" /> : null;
      })}
      {[[0, 0], [0, n - 3], [n - 3, 0]].map(([r, c], i) => (
        <g key={`f${i}`}>
          <rect x={c} y={r} width="3" height="3" fill="#0e1b2a" />
          <rect x={c + 1} y={r + 1} width="1" height="1" fill="#fff" />
        </g>
      ))}
    </svg>
  );
}

const EXHIBITS = [
  { exhibit: "Hall A · Case 04", artefact: "Dakshin Gangotri station fragment (replica)" },
];

export default function MuseumPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("kiosk") === "1") {
      document.documentElement.setAttribute("data-kiosk", "true");
      return () => document.documentElement.removeAttribute("data-kiosk");
    }
  }, []);

  const story = STORIES[0];

  return (
    <div className="pb-20 pt-28 md:pt-32" data-kiosk-root>
      <div className="dh-container">
        <Kicker>Museum bridge · proposed concept</Kicker>
        <h1 className="display mt-3 max-w-3xl text-balance text-4xl font-bold leading-[1.02] md:text-5xl">
          From a glass case to the whole expedition.
        </h1>
        <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-text-2">
          A proposed bridge between a future Polar &amp; Ocean Museum and this archive: every physical exhibit
          carries a QR code that opens its YETI story — the expedition behind the artefact, the station it served,
          the datasets it produced. <strong className="text-text">No museum integration exists yet</strong>; this
          page demonstrates the flow for the proposal.
        </p>

        <figure className="mt-8 overflow-hidden rounded-xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/yeti-museum-bridge.jpg"
            alt="Concept illustration of a dark museum gallery with a glowing artefact case and a QR plaque"
            className="aspect-[21/9] w-full object-cover"
          />
          <figcaption className="flex flex-wrap items-baseline justify-between gap-2 bg-surface px-4 py-2.5 text-[11px] text-text-3">
            <span>Concept visual of the proposed bridge — a case in a gallery, opening into the whole expedition.</span>
            <span>AI-generated illustration · not a real gallery</span>
          </figcaption>
        </figure>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* The bridge flow */}
          <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6" aria-label="Bridge flow">
            <h2 className="meta-label">The bridge</h2>
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              {["Physical exhibit", "QR code", "YETI story", "Expedition", "Station", "Research", "Learning"].map((s, i, a) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="rounded-full border border-accent/40 bg-accent-dim px-3 py-1.5 text-xs font-medium text-accent">{s}</span>
                  {i < a.length - 1 && <span aria-hidden className="text-text-3">→</span>}
                </li>
              ))}
            </ol>
            <div className="mt-2 flex items-start gap-4 rounded-lg border border-line bg-surface-2 p-4">
              <DemoQR seed={story.slug} />
              <div className="min-w-0">
                <p className="meta-label !text-[9px]">{EXHIBITS[0].exhibit} · demonstration QR</p>
                <p className="mt-1 text-sm font-semibold text-text">{story.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-3">
                  Pattern is illustrative — production encodes the exhibit&apos;s permanent YETI link.
                </p>
                <Link href={`/stories/${story.slug}`} className="btn-tactile mt-3 inline-flex items-center gap-2 rounded-md bg-accent-fill px-3.5 py-2 text-xs font-semibold text-accent-ink">
                  <ScanLine className="size-3.5" strokeWidth={1.5} aria-hidden /> Open what a visitor sees
                </Link>
              </div>
            </div>
          </section>

          {/* Kiosk mode */}
          <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6" aria-label="Kiosk mode">
            <h2 className="meta-label">Kiosk mode</h2>
            <p className="text-sm leading-relaxed text-text-2">
              Gallery-floor mode: large touch targets, minimal navigation, YETI as the guide.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Explore Antarctica", href: "/atlas" },
                { label: "Explore the Arctic", href: "/stations/himadri" },
                { label: "Indian expeditions", href: "/expeditions" },
                { label: "Meet the stations", href: "/stations" },
                { label: "Our climate story", href: "/stories" },
                { label: "Ask YETI", href: "/learn" },
              ].map((k) => (
                <Link
                  key={k.label}
                  href={k.href}
                  className="btn-tactile flex min-h-[76px] items-center justify-between gap-3 rounded-xl border border-line-strong bg-surface-2 px-5 text-base font-semibold text-text hover:border-accent/60"
                >
                  {k.label}
                  <Mascot state="explaining" className="hidden size-9 sm:block" />
                </Link>
              ))}
            </div>
            <p className="text-[11px] leading-relaxed text-text-3">
              Kiosk styling scales typography and targets via the <code className="numeral">?kiosk=1</code> flag
              (demo): in production, museum hardware loads this profile directly.
            </p>
            <Link
              href="/museum?kiosk=1"
              className="btn-tactile inline-flex w-fit items-center gap-2 rounded-md border border-accent/40 bg-accent-dim px-3.5 py-2 text-xs font-semibold text-accent"
            >
              <QrCode className="size-3.5" strokeWidth={1.5} aria-hidden /> Preview kiosk profile
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
