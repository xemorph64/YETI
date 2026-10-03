"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookMarked,
  CircleDashed,
  FileUp,
  Network,
  NotebookPen,
  Search,
  ShieldQuestion,
} from "lucide-react";
import { allRecords, metricsApi, useStoreSnapshot } from "@/lib/api/client";
import { WorkspaceHeader, WorkspaceStats, Panel } from "@/components/workspace/WorkspaceHeader";
import { REVIEW_STYLE } from "@/lib/reviewStyles";
import { cn } from "@/lib/utils";

/** Console voice: dense, live, every empty state teaches its tool. */

export default function ResearcherHome() {
  const collections = useStoreSnapshot((s) => s.collections);
  const annotations = useStoreSnapshot((s) => s.annotations);
  const submissions = useStoreSnapshot((s) => s.submissions);
  const accessRequests = useStoreSnapshot((s) => s.accessRequests);
  const queryLog = useStoreSnapshot((s) => s.queryLog);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    metricsApi.dashboard().then((m) => setTotal(m.totalRecords));
  }, []);

  const mine = submissions.filter((s) => s.role === "researcher");
  const inReview = mine.filter((s) => s.status === "PENDING" || s.status === "UNDER_REVIEW");
  const saved = Object.values(collections).reduce((n, c) => n + c.recordIds.length, 0);
  const openReqs = accessRequests.filter((r) => r.status === "PENDING").length;

  const recentCollections = Object.values(collections)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);
  const recentAnnotations = Object.values(annotations)
    .flat()
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 2);

  const topQueries = Object.entries(
    queryLog.reduce<Record<string, number>>((acc, l) => {
      if (l.results > 0) acc[l.q] = (acc[l.q] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const titleFor = (id: string) => allRecords().find((r) => r.id === id)?.title ?? id;

  return (
    <div className="flex flex-col gap-8">
      <WorkspaceHeader
        lede="The whole archive, wired together — advanced tools over the same repository the public sees, plus the desk that feeds it."
        attention={inReview.length > 0 ? { count: inReview.length, label: "awaiting review decision", href: "/researcher/contribute" } : undefined}
      />

      <WorkspaceStats
        stats={[
          { label: "Repository records", value: total, note: "all review states" },
          { label: "Saved records", value: saved, note: "across your collections", tone: "violet" },
          { label: "In scientific review", value: inReview.length, note: `${mine.length} submitted total`, tone: "sunrise" },
          { label: "Access requests", value: accessRequests.length, note: `${openReqs} pending decision` },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Continue where you left off — live from the demo store */}
        <Panel
          title="Pick up where you left off"
          action={
            <Link href="/researcher/collections" className="link-line text-xs text-text-3 hover:text-text">
              All collections →
            </Link>
          }
          bodyClassName="flex flex-col gap-4"
        >
          {recentCollections.length === 0 && recentAnnotations.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong p-5">
              <BookMarked className="size-5 text-text-3" strokeWidth={1.5} aria-hidden />
              <div>
                <p className="text-sm font-semibold text-text">Nothing on your shelf yet.</p>
                <p className="mt-1 max-w-[52ch] text-xs leading-relaxed text-text-3">
                  Save any record from the Vault and it lands here with your annotations — the desk rebuilds itself
                  around what you are working on.
                </p>
              </div>
              <Link
                href="/vault"
                className="btn-tactile inline-flex items-center gap-2 rounded-md bg-accent-fill px-4 py-2 text-xs font-semibold text-accent-ink"
              >
                Browse the Vault <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
          ) : (
            <>
              {recentCollections.map((c) => (
                <Link
                  key={c.id}
                  href="/researcher/collections"
                  className="group flex items-center gap-4 rounded-lg border border-line p-4 transition-colors hover:border-accent/40 hover:bg-surface-2"
                >
                  <BookMarked className="size-4 shrink-0 text-violet" strokeWidth={1.5} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text group-hover:text-accent">{c.name}</p>
                    <p className="numeral text-[11px] text-text-3">
                      {c.recordIds.length} saved {c.recordIds.length === 1 ? "record" : "records"}
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 text-text-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} aria-hidden />
                </Link>
              ))}
              {recentAnnotations.map((a) => (
                <div key={a.id} className="flex items-start gap-4 rounded-lg border border-line p-4">
                  <NotebookPen className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                  <div className="min-w-0">
                    <p className="truncate text-xs text-text-3">{titleFor(a.recordId)}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-snug text-text-2">{a.body || a.quote}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </Panel>

        {/* What the archive is being asked — live query log */}
        <Panel title="What visitors are asking for">
          {topQueries.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong p-5">
              <Search className="size-5 text-text-3" strokeWidth={1.5} aria-hidden />
              <p className="text-xs leading-relaxed text-text-3">
                No searches logged in this session yet. Run a few from ⌘K and the most-repeated queries surface
                here — a live read of what the archive should hold next.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {topQueries.map(([q, n], i) => (
                <li key={q} className="flex items-center gap-3 border-b border-line py-2.5 last:border-0">
                  <span className="numeral w-4 text-[11px] text-text-3">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-text-2">{q}</span>
                  <span className="numeral rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-3">
                    {n}×
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Submissions through review — the connected-system story, from your side */}
      <Panel
        title="Your submissions in scientific review"
        action={
          <Link href="/researcher/contribute" className="link-line text-xs text-text-3 hover:text-text">
            Contribute a record →
          </Link>
        }
        bodyClassName="flex flex-col gap-3"
      >
        {mine.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong p-5">
            <FileUp className="size-5 text-text-3" strokeWidth={1.5} aria-hidden />
            <p className="max-w-[56ch] text-xs leading-relaxed text-text-3">
              Datasets, field notes, photographs or papers you submit enter NCPOR&apos;s review queue — and their
              decision trail appears here, step by step. Only approval makes a record discoverable.
            </p>
          </div>
        ) : (
          mine.map((s) => {
            const style = REVIEW_STYLE[s.status];
            const stage = s.status === "PENDING" ? 0 : s.status === "UNDER_REVIEW" ? 1 : 2;
            return (
              <article key={s.id} className="rounded-lg border border-line p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text">{s.title}</p>
                    <p className="numeral mt-0.5 text-[11px] text-text-3">
                      {s.id} · {s.kind} · submitted {s.submittedAt}
                    </p>
                  </div>
                  <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", style.chip)}>
                    {style.icon}
                    {style.label}
                  </span>
                </div>
                {/* Stage dots */}
                <ol className="mt-3.5 flex items-center gap-2" aria-label="Review stage">
                  {["Submitted", "In review", "Decision"].map((label, i) => (
                    <li key={label} className="flex flex-1 items-center gap-2">
                      <span
                        className={cn(
                          "numeral flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                          i < stage
                            ? "border-accent bg-accent-fill text-accent-ink"
                            : i === stage
                              ? "border-accent/60 bg-accent-dim text-accent"
                              : "border-line text-text-3",
                        )}
                      >
                        {i < stage ? "✓" : i + 1}
                      </span>
                      <span className={cn("hidden text-[11px] sm:inline", i <= stage ? "text-text-2" : "text-text-3")}>
                        {label}
                      </span>
                      {i < 2 && <span aria-hidden className={cn("h-px flex-1", i < stage ? "bg-accent/50" : "bg-line")} />}
                    </li>
                  ))}
                </ol>
                {s.reviewerNote && (
                  <p className="mt-3 rounded-md border border-line bg-surface-2 px-3.5 py-2.5 text-xs leading-relaxed text-text-2">
                    <span className="font-semibold text-text">Reviewer note:</span> {s.reviewerNote}
                  </p>
                )}
              </article>
            );
          })
        )}
      </Panel>

      {/* Restricted access + tools */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Restricted & embargoed holdings">
          {accessRequests.length === 0 ? (
            <div className="flex flex-col items-start gap-3">
              <ShieldQuestion className="size-5 text-text-3" strokeWidth={1.5} aria-hidden />
              <p className="max-w-[56ch] text-xs leading-relaxed text-text-3">
                RESTRICTED and EMBARGOED records show full metadata with a formal request-to-access flow. Try
                dataset <code className="numeral">ds-03</code> in the Vault — request access and watch the request
                travel to the NCPOR console.
              </p>
              <Link
                href="/vault/datasets/prydz-bay-ctd"
                className="btn-tactile inline-flex items-center gap-2 rounded-md border border-line-strong px-4 py-2 text-xs font-semibold text-text-2 hover:border-text-3 hover:text-text"
              >
                Open a restricted record <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {accessRequests.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="numeral text-[11px] text-text-3">{r.id} · {r.recordId}</p>
                    <p className="truncate text-sm text-text-2">{r.justification}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      r.status === "APPROVED"
                        ? "bg-accent-dim text-accent"
                        : r.status === "DENIED"
                          ? "bg-sunrise-dim text-sunrise"
                          : "bg-surface-2 text-text-3",
                    )}
                  >
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Straight to the tools">
          <div className="grid gap-2">
            {[
              { href: "/researcher/graph", icon: <Network className="size-4" strokeWidth={1.5} aria-hidden />, label: "Polar Knowledge Graph", note: "walk expeditions → stations → data" },
              { href: "/researcher/collections", icon: <BookMarked className="size-4" strokeWidth={1.5} aria-hidden />, label: "Collections & citations", note: "BibTeX · RIS export" },
              { href: "/researcher/contribute", icon: <FileUp className="size-4" strokeWidth={1.5} aria-hidden />, label: "Contribution desk", note: "submit · track decisions" },
              { href: "/vault", icon: <CircleDashed className="size-4" strokeWidth={1.5} aria-hidden />, label: "The Vault", note: "the full public repository" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-center gap-3 rounded-lg border border-line px-4 py-3 transition-colors hover:border-accent/40 hover:bg-surface-2"
              >
                <span className="text-text-2 group-hover:text-accent">{t.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-text">{t.label}</span>
                  <span className="block text-[11px] text-text-3">{t.note}</span>
                </span>
                <ArrowRight className="size-3.5 text-text-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
