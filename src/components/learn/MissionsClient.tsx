"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Compass, Database, FlaskConical, Map, Sparkles } from "lucide-react";
import { MISSIONS } from "@/lib/data/missions";
import { cn } from "@/lib/utils";

const STEP_ICON = {
  dataset: Database,
  graph: Compass,
  learn: Sparkles,
  lab: FlaskConical,
  story: Map,
} as const;

const KEY = "yeti-missions";

function load(): Record<string, number[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, number[]>;
  } catch {
    return {};
  }
}

export function MissionsClient() {
  const [done, setDone] = useState<Record<string, number[]>>({});

  useEffect(() => setDone(load()), []);

  const toggle = (missionId: string, step: number) => {
    setDone((prev) => {
      const cur = prev[missionId] ?? [];
      const next = cur.includes(step) ? cur.filter((s) => s !== step) : [...cur, step];
      const updated = { ...prev, [missionId]: next };
      try {
        localStorage.setItem(KEY, JSON.stringify(updated));
      } catch {
        /* storage unavailable — demo keeps working in-memory */
      }
      return updated;
    });
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {MISSIONS.map((m) => {
        const cur = done[m.id] ?? [];
        const complete = cur.length === m.steps.length;
        return (
          <article
            key={m.id}
            className={cn(
              "flex flex-col rounded-xl border bg-surface p-6 transition-colors",
              complete ? "border-accent/50" : "border-line",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="numeral rounded-md border border-accent/40 bg-accent-dim px-2 py-0.5 text-[11px] font-bold text-accent">
                {m.code}
              </span>
              <span className="numeral text-[10px] text-text-3">{m.minutes} min</span>
            </div>
            <h2 className="display mt-3 text-lg font-semibold text-text">{m.title}</h2>
            <p className="mt-1 text-sm font-medium italic text-text-2">“{m.question}”</p>
            <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-text-2">{m.summary}</p>

            <ol className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4">
              {m.steps.map((s, i) => {
                const isDone = cur.includes(i);
                const Icon = STEP_ICON[s.kind];
                return (
                  <li key={s.label}>
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => toggle(m.id, i)}
                        aria-pressed={isDone}
                        aria-label={`${isDone ? "Unmark" : "Mark"} step: ${s.label}`}
                        className={cn(
                          "btn-tactile flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
                          isDone ? "border-accent bg-accent-fill" : "border-line-strong bg-surface-2",
                        )}
                      >
                        {isDone && <Check className="size-3 text-accent-ink" strokeWidth={2.5} aria-hidden />}
                      </button>
                      <Link
                        href={s.href}
                        className="group flex min-w-0 flex-1 items-center gap-2 text-[13px] text-text-2 hover:text-accent"
                      >
                        <Icon className="size-3.5 shrink-0 text-text-3" strokeWidth={1.5} aria-hidden />
                        <span className={cn("truncate", isDone && "text-text-3 line-through")}>{s.label}</span>
                        <ArrowRight className="size-3 shrink-0 text-text-3 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.5} aria-hidden />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ol>

            <p className="numeral mt-3 text-[10px] text-text-3">
              {cur.length}/{m.steps.length} steps · {complete ? "mission complete" : "in progress"}
            </p>
          </article>
        );
      })}
    </div>
  );
}
