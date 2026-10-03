"use client";

import { useCallback, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";
import { MEDIA } from "@/lib/data/media";
import type { MediaAsset } from "@/lib/types";
import { getStore, logAudit, setStore } from "@/lib/api/store";
import { useStoreSnapshot } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const SUBJECTS: MediaAsset["subject"][] = [
  "Landscape",
  "Stations",
  "Aurora",
  "Wildlife",
  "Sea ice",
  "Science operations",
  "Vessels & aircraft",
];

const PHOTOS = MEDIA.filter((m) => m.type === "photo");

/** Deterministic per-image shuffle so option order is stable across renders. */
function shuffledOptions(seed: string): MediaAsset["subject"][] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const order = SUBJECTS.map((s, i) => ({ s, k: (h ^ (i * 2654435761)) >>> 0 }));
  order.sort((a, b) => a.k - b.k);
  return order.map((o) => o.s);
}

export function ParticipateClient() {
  const [current, setCurrent] = useState<MediaAsset>(() => PHOTOS[0]);
  const [choice, setChoice] = useState<MediaAsset["subject"] | null>(null);
  const contributions = useStoreSnapshot((s) => s.citizenContributions);

  const options = useMemo(() => shuffledOptions(current.id), [current.id]);

  const nextImage = useCallback(() => {
    setChoice(null);
    setCurrent((prev) => PHOTOS[(PHOTOS.indexOf(prev) + 1 + ((getStore().citizenContributions.length ?? 0) % 3)) % PHOTOS.length]);
  }, []);

  const submit = (s: MediaAsset["subject"]) => {
    if (choice) return;
    setChoice(s);
    const n = getStore().citizenContributions.length + 1;
    const id = `CIT-${String(n).padStart(3, "0")}`;
    setStore((d) => {
      d.citizenContributions.unshift({ id, mediaId: current.id, choice: s, at: new Date().toISOString() });
    });
    logAudit({
      actor: "Citizen scientist (you, demo)",
      action: "submission",
      resource: `Citizen classification ${id}`,
      note: `Labelled image ${current.id} as “${s}”. Enters the citizen-science review class — never the verified record directly.`,
      stateChange: "→ AWAITING REVIEW",
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      {/* Classification task */}
      <section aria-label="Classification task" className="overflow-hidden rounded-xl border border-line bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.src} alt={current.alt} className="aspect-[16/9] w-full object-cover" />
        <div className="p-5">
          <p className="meta-label">What does this image mostly show?</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {options.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                disabled={choice !== null}
                className={cn(
                  "btn-tactile rounded-lg border px-4 py-2.5 text-left text-sm",
                  choice === null && "border-line bg-bg text-text hover:border-accent/50",
                  choice !== null && choice === s && "border-accent/60 bg-accent-dim font-semibold text-accent",
                  choice !== null && choice !== s && "border-line bg-bg text-text-3",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {choice !== null && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent/40 bg-accent-dim px-4 py-3">
              <p className="flex items-center gap-2 text-sm text-text-2">
                <CheckCircle2 className="size-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                Label “{choice}” recorded. It joins the <strong className="font-semibold text-text">citizen-science review class</strong> — in
                production, agreement across volunteers promotes a label only after curator review.
              </p>
              <button
                onClick={nextImage}
                className="btn-tactile flex shrink-0 items-center gap-1.5 rounded-lg bg-accent-fill px-4 py-2 text-xs font-bold text-accent-ink"
              >
                <RefreshCw className="size-3.5" strokeWidth={1.5} aria-hidden />
                Next image
              </button>
            </div>
          )}

          <p className="mt-4 text-[10px] leading-relaxed text-text-3">
            Image: {current.title} · {current.credit} · {current.license}. Your labels stay in your browser —
            nothing is uploaded in this demo build.
          </p>
        </div>
      </section>

      {/* Contribution ledger */}
      <aside aria-label="Your contributions" className="flex h-fit flex-col gap-4 rounded-xl border border-line bg-surface p-6 lg:sticky lg:top-24">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="size-4 text-accent" strokeWidth={1.5} aria-hidden />
          <h2 className="display text-base font-semibold text-text">Your contribution ledger</h2>
        </div>
        {contributions.length === 0 ? (
          <p className="text-sm leading-relaxed text-text-3">
            No labels yet. Classify an image and it will appear here — with its review-class status, never mixed
            into the verified record.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {contributions.slice(0, 8).map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="numeral text-[11px] font-semibold text-text">{c.id}</p>
                  <p className="truncate text-xs text-text-3">
                    image {c.mediaId} · “{c.choice}”
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-sunrise/50 bg-sunrise-dim px-2.5 py-1 text-[10px] font-semibold text-sunrise">
                  AWAITING REVIEW
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="border-t border-line pt-3 text-[11px] leading-relaxed text-text-3">
          Citizen-science contributions live in their own review class, separated from researcher submissions and
          verified metadata. Every label is also written to the audit trail.
        </p>
      </aside>
    </div>
  );
}
