import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, FlaskConical, Waves, Wind } from "lucide-react";
import { Kicker, ProvenanceChip } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { ContinuesInEnglish, T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Science Labs",
  description:
    "Evidence-aware, simulated educational environments: a sea-level scenario explorer and the Arctic–Indian monsoon connection pathway.",
};

/**
 * Climate Scenario Lab hub (master doc §38) — interactive educational/model
 * environments, presented as evidence-aware scenarios, never as live
 * prediction. Asset-dependent capabilities (§92) are listed honestly as
 * roadmap items, not faked.
 */
export default function LabsPage() {
  return (
    <div className="dh-container flex flex-col gap-12 pb-24 pt-28 md:pt-32">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Science Labs" }]} />

      <header className="max-w-[70ch]">
        <Kicker>
          <T k="nav.labs" as="span" />
        </Kicker>
        <h1 className="display mt-3 text-balance text-4xl font-bold leading-[1.02] md:text-5xl">
          Climate Scenario Lab.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-2">
          Two interactive, simulated environments where you can move a slider and watch a scientific pathway respond.
          Everything here is an <strong className="text-text">educational model with its assumptions labelled</strong> —
          a way to build intuition about how polar change connects to India, not a forecast of any specific event.
        </p>
        <div className="mt-4">
          <ContinuesInEnglish />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Link
          href="/labs/sea-level"
          className="btn-tactile group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-accent/50"
        >
          <div className="relative flex h-44 items-end overflow-hidden bg-gradient-to-b from-accent-dim via-surface-2 to-surface" aria-hidden>
            <svg viewBox="0 0 400 120" className="absolute inset-0 h-full w-full opacity-80">
              <path d="M0 70 Q100 55 200 68 T400 62 V120 H0 Z" fill="var(--accent)" opacity="0.35" />
              <path d="M0 85 Q90 74 210 84 T400 80 V120 H0 Z" fill="var(--accent)" opacity="0.5" />
              <path d="M0 100 Q120 92 240 100 T400 96 V120 H0 Z" fill="var(--accent)" opacity="0.65" />
            </svg>
            <span className="numeral relative m-4 rounded-md border border-accent/40 bg-bg/70 px-2 py-1 text-[11px] text-accent backdrop-blur">
              +0.44 m … +1.32 m · illustrative
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold text-text">
                <Waves className="size-4 text-accent" strokeWidth={1.5} aria-hidden /> Sea-Level Rise explorer
              </span>
              <ArrowRight className="size-4 text-text-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" strokeWidth={1.5} aria-hidden />
            </div>
            <p className="text-sm leading-relaxed text-text-2">
              Move the ice-loss scenario and the year; see the simulated global curve and indicative coastal exposure
              for Sundarbans, Kolkata, Chennai and Kochi.
            </p>
            <p className="meta-label mt-auto !text-[9px]">Simulated educational model</p>
          </div>
        </Link>

        <Link
          href="/labs/monsoon-link"
          className="btn-tactile group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-violet/50"
        >
          <div className="relative flex h-44 items-end overflow-hidden bg-gradient-to-b from-violet-dim via-surface-2 to-surface" aria-hidden>
            <svg viewBox="0 0 400 120" className="absolute inset-0 h-full w-full opacity-80">
              <path d="M20 30 C120 20 180 60 380 54" fill="none" stroke="var(--violet)" strokeWidth="2" strokeDasharray="6 6" opacity="0.7" />
              <path d="M20 60 C140 52 220 88 380 84" fill="none" stroke="var(--violet)" strokeWidth="1.4" strokeDasharray="4 7" opacity="0.45" />
              <circle cx="20" cy="30" r="4" fill="var(--accent)" />
              <circle cx="380" cy="54" r="4" fill="var(--sunrise)" />
            </svg>
            <span className="numeral relative m-4 rounded-md border border-violet/40 bg-bg/70 px-2 py-1 text-[11px] text-violet backdrop-blur">
              6-stage pathway · uncertainty labelled
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold text-text">
                <Wind className="size-4 text-violet" strokeWidth={1.5} aria-hidden /> Arctic ↔ Monsoon link
              </span>
              <ArrowRight className="size-4 text-text-3 transition-transform group-hover:translate-x-0.5 group-hover:text-violet" strokeWidth={1.5} aria-hidden />
            </div>
            <p className="text-sm leading-relaxed text-text-2">
              Slide Arctic sea-ice extent and watch the conceptual pathway respond — every stage tagged observed,
              modelled or hypothesis, exactly as the science distinguishes them.
            </p>
            <p className="meta-label mt-auto !text-[9px]">Conceptual pathway · not a causal claim</p>
          </div>
        </Link>
      </div>

      {/* Honest roadmap (§92): capabilities that need real assets/data */}
      <section aria-label="Roadmap" className="rounded-2xl border border-dashed border-line-strong bg-surface p-6">
        <div className="flex flex-wrap items-center gap-3">
          <FlaskConical className="size-4 text-text-3" strokeWidth={1.5} aria-hidden />
          <h2 className="text-sm font-semibold text-text">Planned labs — waiting on real assets</h2>
          <ProvenanceChip p="demo" label="Roadmap · not in this build" />
        </div>
        <p className="mt-2 max-w-[70ch] text-xs leading-relaxed text-text-3">
          These capabilities are in the project blueprint but need assets or live feeds this demonstration does not
          have — so they are not simulated here: Sounds of the Poles (polar acoustic recordings), 360° station tours,
          Earth-observation satellite layers, and WebXR/VR field experiences.
        </p>
      </section>
    </div>
  );
}
