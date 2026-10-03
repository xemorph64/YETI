"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CornerDownLeft, Search, Sparkles } from "lucide-react";
import { SEARCH_GROUPS, searchAll } from "@/lib/search";
import { cn } from "@/lib/utils";

export function SearchPageClient() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => inputRef.current?.focus(), []);

  const results = useMemo(() => searchAll(q, 60), [q]);
  const filtered = group ? results.filter((r) => r.kind === group) : results;
  const groups = SEARCH_GROUPS.map((g) => ({ g, n: results.filter((r) => r.kind === g).length })).filter((x) => x.n > 0);

  return (
    <div className="dh-container-tight pb-16 pt-32 md:pt-36">
      <h1 className="display text-3xl font-bold md:text-4xl">Search the archive</h1>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-line-strong bg-surface px-4">
        <Search className="size-4 shrink-0 text-text-3" strokeWidth={1.5} aria-hidden />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “Maitri”, “Prydz Bay”, “aurora”, “1983”…"
          className="h-14 w-full bg-transparent text-[15px] text-text outline-none placeholder:text-text-3"
          aria-label="Search query"
        />
        {q && (
          <button onClick={() => setQ("")} className="text-xs text-text-3 hover:text-text" aria-label="Clear search">
            Clear
          </button>
        )}
      </div>

      {groups.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setGroup(null)}
            className={cn(
              "btn-tactile rounded-full border px-3 py-1 text-xs",
              !group ? "border-accent/60 bg-accent-dim text-accent" : "border-line-strong text-text-2 hover:text-text",
            )}
          >
            All · {results.length}
          </button>
          {groups.map(({ g, n }) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={cn(
                "btn-tactile rounded-full border px-3 py-1 text-xs",
                group === g ? "border-accent/60 bg-accent-dim text-accent" : "border-line-strong text-text-2 hover:text-text",
              )}
            >
              {g} · {n}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col divide-y divide-line border-t border-line">
        {filtered.map((r) => (
          <Link key={r.href + r.title} href={r.href} className="group flex items-center justify-between gap-6 py-4">
            <div className="min-w-0">
              <p className="numeral text-[11px] text-text-3">{r.kind}</p>
              <p className="display mt-0.5 truncate text-base font-semibold text-text group-hover:text-accent">{r.title}</p>
              <p className="truncate text-xs text-text-3">{r.subtitle}</p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-text-3 group-hover:text-accent" strokeWidth={1.5} aria-hidden />
          </Link>
        ))}
      </div>

      {q && filtered.length === 0 && (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-line bg-surface p-8">
          <p className="text-sm leading-relaxed text-text-2">
            No records match &ldquo;{q}&rdquo;. The demo archive is deliberately small — but Ask Yeti can reason
            across everything that is in it.
          </p>
          <button
            onClick={() => router.push("/")}
            className="btn-tactile inline-flex items-center gap-2 rounded-md border border-accent/40 bg-accent-dim px-4 py-2 text-sm font-medium text-accent"
          >
            <Sparkles className="size-4" strokeWidth={1.5} aria-hidden />
            Ask Yeti instead
          </button>
        </div>
      )}

      {!q && (
        <p className="meta-label mt-10 flex items-center gap-2">
          <CornerDownLeft className="size-3.5" strokeWidth={1.5} aria-hidden />
          Tip: ⌘K opens this search from anywhere on the portal.
        </p>
      )}
    </div>
  );
}
