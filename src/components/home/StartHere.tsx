"use client";

/**
 * First-visit onboarding, Notion/GitHub-style: a short dismissible checklist
 * that teaches the three moves every visitor should try. Persisted per
 * browser; never shown again once completed or dismissed.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Command, Globe2, MessageCircleQuestion, X } from "lucide-react";
import { cn } from "@/lib/utils";

const KEY = "yeti-start-here";

const STEPS = [
  {
    icon: <Command className="size-4" strokeWidth={1.5} aria-hidden />,
    title: "Search everything at once",
    body: "Press ⌘K anywhere — 45 years of expeditions, datasets, images and reports in one palette.",
  },
  {
    icon: <MessageCircleQuestion className="size-4" strokeWidth={1.5} aria-hidden />,
    title: "Ask YETI, get sources",
    body: "The assistant answers only from the archive and always shows its citations.",
  },
  {
    icon: <Globe2 className="size-4" strokeWidth={1.5} aria-hidden />,
    title: "Fly the Expedition Atlas",
    body: "Every Indian polar expedition since 1981 as an interactive globe — scrub through time.",
  },
];

export function StartHere() {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* private mode: just don't persist */
    }
  }, []);

  if (!visible) return null;

  const complete = (i: number) =>
    setDone((d) => {
      const next = d.includes(i) ? d.filter((x) => x !== i) : [...d, i];
      if (next.length === STEPS.length) {
        window.setTimeout(() => {
          try {
            window.localStorage.setItem(KEY, "done");
          } catch {}
          setVisible(false);
        }, 900);
      }
      return next;
    });

  const dismiss = () => {
    try {
      window.localStorage.setItem(KEY, "dismissed");
    } catch {}
    setVisible(false);
  };

  return (
    <section aria-label="Start here" className="hairline-t bg-surface-2/60 py-10">
      <div className="dh-container">
        <div className="ws-rise flex flex-col gap-5 rounded-2xl border border-accent/25 bg-surface p-6 shadow-[var(--shadow-card)] lg:flex-row lg:items-center lg:gap-8">
          <div className="min-w-0 lg:max-w-[240px]">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-accent">First time here?</p>
            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-text">Start here — three moves, one minute.</h2>
          </div>
          <ol className="grid flex-1 gap-2.5 md:grid-cols-3">
            {STEPS.map((s, i) => {
              const checked = done.includes(i);
              return (
                <li key={s.title}>
                  <button
                    onClick={() => complete(i)}
                    aria-pressed={checked}
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
                  </button>
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
