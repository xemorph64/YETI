"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ExternalLink, X, Move3d } from "lucide-react";
import { MEDIA, MEDIA_SUBJECTS } from "@/lib/data/media";
import type { MediaAsset } from "@/lib/types";
import { getStation } from "@/lib/data/stations";
import { Chip, ProvenanceChip } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function GalleryClient() {
  const params = useSearchParams();
  const [subject, setSubject] = useState<string | null>(null);
  const [active, setActive] = useState<MediaAsset | null>(
    MEDIA.find((m) => m.id === params.get("asset")) ?? null,
  );
  const [loaded, setLoaded] = useState<Set<string>>(new Set());

  const items = MEDIA.filter((m) => !subject || m.subject === subject);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const markLoaded = (id: string) =>
    setLoaded((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  return (
    <div className="dh-container pb-16">
      {/* Filters */}
      <div className="sticky top-16 z-20 -mx-2 flex flex-wrap gap-2 bg-bg/85 px-2 py-3 backdrop-blur-lg md:top-[72px]">
        <Chip active={!subject} onClick={() => setSubject(null)}>
          All · {MEDIA.length}
        </Chip>
        {MEDIA_SUBJECTS.map((s) => (
          <Chip key={s} active={subject === s} onClick={() => setSubject(s)}>
            {s}
          </Chip>
        ))}
        <span className="ml-auto self-center">
          <ProvenanceChip p="third-party" label="All assets credited via Wikimedia Commons" />
        </span>
      </div>

      {/* Masonry */}
      {items.length === 0 ? (
        <p className="py-20 text-center text-sm text-text-3">No assets for this subject yet.</p>
      ) : (
        <div className="mt-6 gap-4 [column-count:1] sm:[column-count:2] lg:[column-count:3] xl:[column-count:4]">
          {items.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(m)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg border border-line text-left"
              style={{ transitionDelay: `${Math.min(i * 30, 300)}ms` }}
              aria-label={`Open ${m.title}`}
            >
              <span className="relative block">
                {!loaded.has(m.id) && <span className="skeleton absolute inset-0" style={{ paddingBottom: `${(m.h / m.w) * 100}%` }} />}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.src}
                  alt={m.alt}
                  loading="lazy"
                  onLoad={() => markLoaded(m.id)}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ aspectRatio: `${m.w}/${m.h}` }}
                />
                {m.type === "panorama" && (
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-bg/85 px-2 py-1 text-[10px] text-text-2 backdrop-blur">
                    <Move3d className="size-3" strokeWidth={1.5} aria-hidden /> demo pan
                  </span>
                )}
              </span>
              <span className="flex items-center justify-between gap-2 bg-surface px-3 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-text">{m.title}</span>
                  <span className="numeral block text-[10px] text-text-3">{m.subject}</span>
                </span>
                <Camera className="size-3.5 shrink-0 text-text-3 group-hover:text-accent" strokeWidth={1.5} aria-hidden />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex flex-col bg-bg-deep/95 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setActive(null);
            }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <p className="display truncate text-sm font-semibold text-text">{active.title}</p>
              <button onClick={() => setActive(null)} className="btn-tactile rounded-md border border-line-strong p-2 text-text-2 hover:text-text" aria-label="Close">
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="panel-scroll flex flex-1 flex-col items-center gap-6 overflow-y-auto p-4 lg:flex-row lg:items-start lg:justify-center lg:p-8">
              <div className="max-h-[70vh] min-h-0 w-full max-w-4xl lg:w-auto lg:flex-1">
                {active.type === "panorama" ? (
                  <PanoramaDemo asset={active} />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={active.src}
                    alt={active.alt}
                    className="mx-auto max-h-[70vh] w-auto max-w-full rounded-lg border border-line object-contain"
                  />
                )}
              </div>
              {/* Metadata drawer */}
              <aside className="w-full max-w-sm shrink-0 rounded-xl border border-line bg-surface p-5">
                <p className="meta-label mb-3">Asset metadata</p>
                <dl className="flex flex-col divide-y divide-line text-sm">
                  {[
                    ["Subject", active.subject],
                    ["Type", active.type === "panorama" ? "Panorama (demo viewer)" : "Photograph"],
                    ["Station", active.stationId ? getStation(active.stationId)?.name ?? "—" : "—"],
                    ["Credit", active.credit],
                    ["Licence", active.license],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[80px_1fr] gap-3 py-2.5">
                      <dt className="text-text-3">{k}</dt>
                      <dd className="font-medium text-text-2">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-text-3">{active.alt}</p>
                <a
                  href={active.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tactile mt-4 inline-flex items-center gap-2 rounded-md border border-line-strong px-3 py-2 text-xs font-medium text-text-2 hover:text-text"
                >
                  <ExternalLink className="size-3.5" strokeWidth={1.5} aria-hidden />
                  Source record & licence
                </a>
                <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-text-3">
                  CryoLens demo: AI tag suggestions and alt-text generation ship in the production pipeline with
                  human review. Nothing here is attributed to NCPOR photographers.
                </p>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Honest demo panorama: drag-to-pan over a wide credited photo. */
function PanoramaDemo({ asset }: { asset: MediaAsset }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number } | null>(null);

  return (
    <figure className="overflow-hidden rounded-lg border border-line">
      <div
        ref={ref}
        className="cursor-grab select-none overflow-x-auto active:cursor-grabbing"
        onMouseDown={(e) => {
          drag.current = { x: e.clientX, scroll: ref.current?.scrollLeft ?? 0 };
        }}
        onMouseMove={(e) => {
          if (drag.current && ref.current) {
            ref.current.scrollLeft = drag.current.scroll - (e.clientX - drag.current.x);
          }
        }}
        onMouseUp={() => (drag.current = null)}
        onMouseLeave={() => (drag.current = null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.src}
          alt={asset.alt}
          className="h-[46vh] w-[240%] max-w-none object-cover"
          draggable={false}
        />
      </div>
      <figcaption className="flex items-center gap-2 bg-surface px-4 py-2.5 text-xs text-text-3">
        <Move3d className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
        Demo panorama viewer — drag to pan. Production uses 360° equirectangular captures; this shows the interaction honestly over a wide credited photograph.
      </figcaption>
    </figure>
  );
}

export function GalleryWithSuspense() {
  return (
    <Suspense fallback={<div className="dh-container py-20"><div className="skeleton h-96 w-full" /></div>}>
      <GalleryClient />
    </Suspense>
  );
}

export const cnHelper = cn;
