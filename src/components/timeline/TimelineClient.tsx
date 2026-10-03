"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EXPEDITIONS } from "@/lib/data/expeditions";

const PROGRAMMES = ["Antarctic", "Arctic", "Southern Ocean"] as const;

const PROGRAMME_DOT: Record<string, string> = {
  Antarctic: "bg-accent",
  Arctic: "bg-violet",
  "Southern Ocean": "bg-sunrise",
};

export function TimelineClient() {
  const [programme, setProgramme] = useState<(typeof PROGRAMMES)[number] | null>(null);
  const [decade, setDecade] = useState<number | null>(null);

  const decades = useMemo(
    () => [...new Set(EXPEDITIONS.map((e) => Math.floor(e.startYear / 10) * 10))].sort((a, b) => b - a),
    [],
  );

  const events = useMemo(
    () =>
      EXPEDITIONS.filter((e) => {
        if (programme && e.programme !== programme) return false;
        if (decade !== null && Math.floor(e.startYear / 10) * 10 !== decade) return false;
        return true;
      }).sort((a, b) => b.startYear - a.startYear || a.id.localeCompare(b.id)),
    [programme, decade],
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2" aria-label="Timeline filters">
        <button
          onClick={() => setProgramme(null)}
          className={cn(
            "btn-tactile rounded-full border px-3.5 py-1.5 text-xs",
            programme === null ? "border-accent/50 bg-accent-dim font-semibold text-accent" : "border-line bg-surface text-text-3 hover:text-text",
          )}
        >
          All programmes
        </button>
        {PROGRAMMES.map((p) => (
          <button
            key={p}
            onClick={() => setProgramme(programme === p ? null : p)}
            className={cn(
              "btn-tactile rounded-full border px-3.5 py-1.5 text-xs",
              programme === p ? "border-accent/50 bg-accent-dim font-semibold text-accent" : "border-line bg-surface text-text-3 hover:text-text",
            )}
          >
            {p}
          </button>
        ))}
        <span className="mx-2 hidden h-4 w-px bg-line sm:block" aria-hidden />
        <button
          onClick={() => setDecade(null)}
          className={cn(
            "btn-tactile rounded-full border px-3.5 py-1.5 text-xs",
            decade === null ? "border-accent/50 bg-accent-dim font-semibold text-accent" : "border-line bg-surface text-text-3 hover:text-text",
          )}
        >
          All decades
        </button>
        {decades.map((d) => (
          <button
            key={d}
            onClick={() => setDecade(decade === d ? null : d)}
            className={cn(
              "btn-tactile rounded-full border px-3.5 py-1.5 text-xs",
              decade === d ? "border-accent/50 bg-accent-dim font-semibold text-accent" : "border-line bg-surface text-text-3 hover:text-text",
            )}
          >
            <span className="numeral">{d}s</span>
          </button>
        ))}
        <span className="numeral ml-auto text-[11px] text-text-3">{events.length} seasons</span>
      </div>

      {/* The line */}
      <ol className="relative flex flex-col border-l border-line-strong pl-6 md:pl-8" aria-label="Polar research timeline">
        {events.map((e) => (
          <li key={e.id} className="relative pb-7 last:pb-0">
            <span
              className={cn("absolute -left-[27px] top-2 size-3 rounded-full border-2 border-bg md:-left-[35px]", PROGRAMME_DOT[e.programme])}
              aria-hidden
            />
            <p className="numeral text-xs font-semibold text-text-3">
              {e.season} · {e.programme}
            </p>
            <Link href={`/expeditions/${e.id}`} className="group mt-1 block">
              <p className="display text-base font-semibold text-text group-hover:text-accent md:text-lg">
                {e.milestone ?? `${e.ordinal} Indian ${e.programme} expedition`}
              </p>
              <p className="mt-0.5 line-clamp-2 max-w-[74ch] text-[13px] leading-relaxed text-text-3">{e.summary}</p>
              {e.milestone && (
                <span className="mt-2 inline-flex rounded-full border border-accent/40 bg-accent-dim px-3 py-0.5 text-[11px] font-semibold text-accent">
                  Verified milestone
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>

      {events.length === 0 && (
        <p className="rounded-xl border border-line bg-surface px-5 py-6 text-sm text-text-3">
          No seasons match that combination — the archive holds what it holds, honestly.
        </p>
      )}
    </div>
  );
}
