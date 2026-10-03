"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { ProvenanceChip } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/**
 * Arctic ↔ Indian Monsoon link — a conceptual pathway visualisation (§32/§94).
 * Every stage is explicitly tagged observed / modelled / hypothesis. The
 * sea-ice slider modulates the illustrative "signal strength" through the
 * pathway. This is an explanatory device — never evidence that one specific
 * weather event was caused by Arctic change.
 */

type Tag = "observed" | "modelled" | "hypothesis";

const STAGES: { id: string; title: string; body: string; tag: Tag }[] = [
  {
    id: "ice",
    title: "Arctic sea-ice & temperature change",
    body: "Satellite records show September sea-ice extent declining and the Arctic warming faster than the global average — the best-observed link in this chain.",
    tag: "observed",
  },
  {
    id: "energy",
    title: "Energy exchange",
    body: "More open water changes how heat and moisture move between ocean and atmosphere, altering the region's energy budget.",
    tag: "observed",
  },
  {
    id: "circulation",
    title: "Atmospheric circulation",
    body: "Models explore how a changed Arctic energy budget can shift the jet stream and planetary-wave patterns.",
    tag: "modelled",
  },
  {
    id: "teleconnection",
    title: "Potential teleconnections",
    body: "Whether those circulation changes propagate to South Asia is an active research hypothesis — plausible in models, not settled.",
    tag: "hypothesis",
  },
  {
    id: "asia",
    title: "Asian climate response",
    body: "Model studies examine how such teleconnections could reshape Asian climate patterns, including monsoon circulation.",
    tag: "modelled",
  },
  {
    id: "monsoon",
    title: "Indian monsoon research",
    body: "NCPOR and partner studies test these ideas against observations of monsoon rainfall variability. The strongest finding so far is the complexity — the monsoon answers to many drivers at once.",
    tag: "observed",
  },
];

const TAG_STYLE: Record<Tag, { label: string; cls: string }> = {
  observed: { label: "Observed", cls: "border-accent/50 bg-accent-dim text-accent" },
  modelled: { label: "Modelled", cls: "border-violet/50 bg-violet-dim text-violet" },
  hypothesis: { label: "Hypothesis", cls: "border-sunrise/50 bg-sunrise-dim text-sunrise" },
};

/** How strongly the pathway responds, from the slider position (0..1). */
const signal = (extent: number) => Math.min(1, Math.max(0, (7.5 - extent) / 3.5));

export function MonsoonLinkLab() {
  const [extent, setExtent] = useState(5.5);
  const s = signal(extent);

  const summary = useMemo(() => {
    if (s < 0.25)
      return "Near today's extent: the pathway is the baseline scientists study — no anomalous signal implied.";
    if (s < 0.6)
      return "Moderately reduced ice: models suggest a perceptible circulation response — within the range of current research debates.";
    return "Strongly reduced ice (end-of-century style scenario): the conceptual pathway implies the largest circulation and monsoon-variability response — a hypothesis to test, not an expectation.";
  }, [s]);

  return (
    <div className="flex flex-col gap-8">
      <section aria-label="Sea-ice control" className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-text">Set September Arctic sea-ice extent</h2>
            <p className="mt-1 max-w-[54ch] text-xs leading-relaxed text-text-3">
              An illustrative dial for how much ice survives the summer melt. The observed record already shows
              decline; lower values here represent a stronger Arctic change.
            </p>
          </div>
          <ProvenanceChip p="demo" label="Conceptual pathway — not a causal claim" />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <input
            type="range"
            min={4}
            max={7.5}
            step={0.1}
            value={extent}
            onChange={(e) => setExtent(Number(e.target.value))}
            className="dh-range flex-1"
            aria-label="September Arctic sea-ice extent, million square kilometres"
          />
          <span className="numeral w-28 rounded-md border border-line-strong bg-bg px-2 py-1 text-center text-sm font-semibold text-text">
            {extent.toFixed(1)} M km²
          </span>
        </div>
        <p className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-bg px-3.5 py-2.5 text-xs leading-relaxed text-text-2">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-sunrise" strokeWidth={1.5} aria-hidden />
          {summary}
        </p>
      </section>

      {/* Pathway */}
      <section aria-label="Arctic to monsoon pathway" className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-sm font-bold text-text">The six-stage pathway</h2>
        <ol className="mt-5 flex flex-col">
          {STAGES.map((st, i) => {
            // Signal attenuates down the chain: early (observed) stages are
            // strong, the teleconnection hop attenuates most.
            const attenuation = [1, 0.9, 0.72, 0.5, 0.38, 0.26][i];
            const strength = s * attenuation;
            const tag = TAG_STYLE[st.tag];
            return (
              <li key={st.id} className="relative flex gap-4 pb-7 last:pb-0">
                {/* connector */}
                {i < STAGES.length - 1 && (
                  <span className="absolute left-[13px] top-7 h-[calc(100%-28px)] w-px overflow-hidden" aria-hidden>
                    <span
                      className="block h-full w-full origin-top"
                      style={{
                        background: `linear-gradient(to bottom, color-mix(in srgb, var(--violet) ${Math.round(strength * 100)}%, var(--line)) 60%, var(--line))`,
                      }}
                    />
                  </span>
                )}
                <span
                  className={cn(
                    "relative z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                    strength > 0.15 ? "border-violet/60 bg-violet-dim text-violet" : "border-line-strong bg-surface text-text-3",
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1 rounded-xl border border-line bg-bg p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-text">{st.title}</h3>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", tag.cls)}>{tag.label}</span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-text-2">{st.body}</p>
                  {/* strength bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="meta-label !text-[9px]">Signal in this scenario</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2" aria-hidden>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.round(strength * 100)}%`,
                          background: st.tag === "hypothesis" ? "var(--sunrise)" : st.tag === "modelled" ? "var(--violet)" : "var(--accent)",
                        }}
                      />
                    </div>
                    <span className="numeral w-9 text-right text-[10px] text-text-3">{Math.round(strength * 100)}%</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-[11px] leading-relaxed text-text-3">
          The signal bars communicate <em>how much response this conceptual pathway implies</em> at your slider
          setting — they are not measurements. Attenuation grows where the science is least settled, which is
          exactly the point: the uncertainty is part of the mechanism.
        </p>
      </section>

      {/* Grounding links (§70) */}
      <section aria-label="Go deeper" className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="meta-label mb-3">Grounded in the archive</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Science: Himalayan cryosphere", href: "/science/himalaya" },
            { label: "Learn: monsoon module", href: "/learn" },
            { label: "Publication shelf", href: "/vault#publications" },
            { label: "Dataset: IndARC mooring", href: "/vault/datasets/indarc-mooring-temperature" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="btn-tactile rounded-full border border-line-strong px-3.5 py-1.5 text-xs font-medium text-text-2 hover:border-violet/50 hover:text-violet"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
