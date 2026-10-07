"use client";

/**
 * First-visit onboarding, Notion/GitHub-style: a short dismissible checklist
 * that teaches the three moves every visitor should try. Persisted per
 * browser; never shown again once completed or dismissed.
 */

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Check, Command, Globe2, MessageCircleQuestion, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStoredJson } from "@/lib/useStoredJson";
import { useChrome } from "@/components/chrome/SiteChrome";
import { Kicker } from "@/components/ui/primitives";

const KEY = "yeti-start-here-v2";

type Progress = { done: number[]; closed: boolean };
const FRESH: Progress = { done: [], closed: false };

/** Each step performs the move it teaches; doing it ticks it off. */
const STEPS = [
  {
    icon: <Command className="size-4" strokeWidth={1.5} aria-hidden />,
    title: "Search everything at once",
    body: "Press ⌘K anywhere — 45 years of expeditions, datasets, images and reports in one palette.",
    action: "search" as const,
  },
  {
    icon: <MessageCircleQuestion className="size-4" strokeWidth={1.5} aria-hidden />,
    title: "Ask YETI, get sources",
    body: "The assistant answers only from the archive and always shows its citations.",
    action: "ask" as const,
  },
  {
    icon: <Globe2 className="size-4" strokeWidth={1.5} aria-hidden />,
    title: "Fly the Expedition Atlas",
    body: "Every Indian polar expedition since 1981 as an interactive globe — scrub through time.",
    href: "/atlas",
  },
];

const noop = () => () => {};

export function StartHere() {
  const [progress, setProgress] = useStoredJson<Progress>(KEY, FRESH);
  const { openSearch, openAsk } = useChrome();
  // Render nothing on the server and during hydration, so returning visitors never see a flash.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);

  if (!hydrated || progress.closed) return null;

  const allDone = progress.done.length === STEPS.length;

  const markDone = (i: number) => {
    if (progress.done.includes(i)) return;
    setProgress({ ...progress, done: [...progress.done, i] });
  };

  const run = (i: number) => {
    markDone(i);
    const step = STEPS[i];
    if (step.action === "search") openSearch();
    if (step.action === "ask") openAsk();
  };

  const dismiss = () => setProgress({ ...progress, closed: true });

  return (
    <section aria-label="Start here" className="hairline-t bg-surface-2/60 py-10">
      <div className="dh-container">
        <div className="ws-rise flex flex-col gap-5 rounded-2xl border border-accent/25 bg-surface p-6 lg:flex-row lg:items-center lg:gap-8">
          <div className="min-w-0 lg:max-w-[240px]">
            <Kicker>First time here?</Kicker>
            <h2 className="display mt-3 text-xl font-semibold text-text text-balance" aria-live="polite">
              {allDone ? "That's all three. The archive is yours." : "Start here — three moves, one minute."}
            </h2>
          </div>
          <ol className="grid flex-1 gap-2.5 md:grid-cols-3">
            {STEPS.map((s, i) => {
              const checked = progress.done.includes(i);
              return (
                <li key={s.title}>
                  <StepControl
                    href={s.href}
                    onClick={() => (s.href ? markDone(i) : run(i))}
                    className={cn(
                      "btn-tactile flex h-full w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                      checked ? "border-accent/50 bg-accent-dim" : "border-line bg-bg hover:border-line-strong",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                        checked ? "border-accent bg-accent-fill text-accent-ink" : "border-line-strong text-text-3",
                      )}
                    >
                      {checked ? <Check className="size-3.5" strokeWidth={2} aria-hidden /> : i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={cn("flex items-center gap-2 text-sm font-semibold", checked ? "text-accent" : "text-text")}>
                        <span className={checked ? "text-accent" : "text-text-3"}>{s.icon}</span>
                        {s.title}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-text-3">{s.body}</span>
                    </span>
                    {checked && <span className="sr-only">(done)</span>}
                  </StepControl>
                </li>
              );
            })}
          </ol>
          <button
            onClick={dismiss}
            aria-label="Dismiss the getting-started card"
            className="btn-tactile self-start rounded-md border border-line-strong p-2 text-text-3 hover:text-text lg:self-center"
          >
            <X className="size-4" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-text-3">
          Curious what the sign-in unlocks?{" "}
          <Link href="/login" className="link-line text-accent">
            See the three experiences
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function StepControl({
  href,
  onClick,
  className,
  children,
}: {
  href?: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return href ? (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
