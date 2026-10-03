"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  FileText,
  Inbox,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";
import { metricsApi, useStoreSnapshot } from "@/lib/api/client";
import { WorkspaceHeader, WorkspaceStats, Panel } from "@/components/workspace/WorkspaceHeader";
import { REVIEW_STYLE } from "@/lib/reviewStyles";
import { cn } from "@/lib/utils";

/** The operations desk: what needs a decision, where work sits, what moved. */

const PIPELINE = [
  { name: "Ingest & parse", count: 24, demo: false },
  { name: "Checksum", count: 24, demo: false },
  { name: "Extract", count: 18, demo: true },
  { name: "OCR", count: 2, demo: true },
  { name: "Metadata", count: 12, demo: true },
  { name: "Entity link", count: 9, demo: true },
  { name: "Dedup check", count: 1, demo: true },
  { name: "Scientific review", count: -1, demo: false }, // live
  { name: "Discoverable", count: -1, demo: false }, // live
] as const;

const ACTION_DOT: Record<string, string> = {
  "ai-generation": "bg-violet",
  "review-decision": "bg-accent",
  "access-granted": "bg-accent",
  "access-denied": "bg-sunrise",
  submission: "bg-sunrise",
};

export default function AdminPage() {
  const submissions = useStoreSnapshot((s) => s.submissions);
  const accessRequests = useStoreSnapshot((s) => s.accessRequests);
  const audit = useStoreSnapshot((s) => s.audit);
  const zeroResults = useStoreSnapshot((s) => s.zeroResultQueries);
  const queryLog = useStoreSnapshot((s) => s.queryLog);
  const drafts = useStoreSnapshot((s) => s.publishedChannelDrafts);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    metricsApi.dashboard().then((m) => setTotal(m.totalRecords));
  }, []);

  const pendingSubs = submissions.filter((s) => s.status === "PENDING" || s.status === "UNDER_REVIEW");
  const pendingReqs = accessRequests.filter((r) => r.status === "PENDING");
  const attention = pendingSubs.length + pendingReqs.length;

  const popular = Object.entries(
    queryLog.reduce<Record<string, number>>((acc, l) => {
      if (l.results > 0) acc[l.q] = (acc[l.q] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <WorkspaceHeader
        lede="Ingestion, review, approval and dissemination for the whole archive — every decision here is what makes a record discoverable."
        attention={attention > 0 ? { count: attention, label: "awaiting your decision", href: "/admin/review" } : undefined}
      />

      <WorkspaceStats
        stats={[
          { label: "Repository records", value: total, note: "published & discoverable" },
          { label: "In review queue", value: pendingSubs.length, note: "researcher submissions", tone: "sunrise" },
          { label: "Access requests", value: pendingReqs.length, note: "restricted-data gating", tone: "sunrise" },
          { label: "Dissemination drafts", value: drafts.length, note: "awaiting publish approval", tone: "violet" },
        ]}
      />

      {/* Where work sits — the documented pipeline, live at both ends */}
      <Panel
        title="Where work sits in the pipeline"
        action={
          <Link href="/admin/ingestion" className="link-line text-xs text-text-3 hover:text-text">
            Upload centre →
          </Link>
        }
        bodyClassName="overflow-x-auto ws-scroll"
      >
        <ol className="flex min-w-[760px] items-stretch pb-1">
          {PIPELINE.map((p, i) => {
            const count = p.count === -1 ? (p.name === "Scientific review" ? pendingSubs.length : (total ?? 0)) : p.count;
            const busy = count > 0;
            return (
              <li key={p.name} className="flex min-w-0 flex-1 items-center">
                <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 px-1 text-center">
                  <span
                    className={cn(
                      "numeral relative flex size-9 items-center justify-center rounded-full border text-xs font-bold",
                      busy ? "border-accent/50 bg-accent-dim text-accent" : "border-line bg-surface-2 text-text-3",
                    )}
                  >
                    {count}
                    {busy && (
                      <span className="pulse-dot absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent" aria-hidden />
                    )}
                  </span>
                  <span className="text-[11px] font-medium leading-tight text-text-2">{p.name}</span>
                  <span className="text-[9px] uppercase tracking-[0.12em] text-text-3">
                    {p.demo ? "demo counter" : p.count === -1 ? "live" : "this month"}
                  </span>
                </div>
                {i < PIPELINE.length - 1 && <span aria-hidden className="mb-6 h-px w-4 shrink-0 bg-line-strong" />}
              </li>
            );
          })}
        </ol>
        <p className="mt-2 text-[11px] leading-relaxed text-text-3">
          Mid-pipeline counts are seeded demonstration figures; review and discoverable read live state — approve a
          submission and both ends move.
        </p>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        {/* Needs your decision — live */}
        <Panel
          title="Needs your decision"
          action={
            <Link href="/admin/review" className="link-line text-xs text-text-3 hover:text-text">
              Review queue →
            </Link>
          }
          bodyClassName="flex flex-col gap-2.5"
        >
          {attention === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong p-5">
              <CheckCircle2 className="size-5 text-accent" strokeWidth={1.5} aria-hidden />
              <div>
                <p className="text-sm font-semibold text-text">Queue clear.</p>
                <p className="mt-1 text-xs leading-relaxed text-text-3">
                  Nothing is blocked on you. Submit a record from the researcher desk (demo account{" "}
                  <code className="numeral">meera@yeti.demo</code> in a second browser profile) and it will land here
                  for decision.
                </p>
              </div>
            </div>
          ) : (
            <>
              {pendingSubs.map((s) => {
                const style = REVIEW_STYLE[s.status];
                return (
                  <Link
                    key={s.id}
                    href="/admin/review"
                    className="group flex items-center gap-3.5 rounded-lg border border-line p-3.5 transition-colors hover:border-accent/40 hover:bg-surface-2"
                  >
                    <Inbox className="size-4 shrink-0 text-sunrise" strokeWidth={1.5} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text group-hover:text-accent">{s.title}</p>
                      <p className="numeral text-[11px] text-text-3">{s.submitter} · {s.kind}</p>
                    </div>
                    <span className={cn("hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:flex", style.chip)}>
                      {style.label}
                    </span>
                    <ArrowRight className="size-3.5 shrink-0 text-text-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
                  </Link>
                );
              })}
              {pendingReqs.map((r) => (
                <Link
                  key={r.id}
                  href="/admin/review"
                  className="group flex items-center gap-3.5 rounded-lg border border-line p-3.5 transition-colors hover:border-accent/40 hover:bg-surface-2"
                >
                  <ShieldCheck className="size-4 shrink-0 text-violet" strokeWidth={1.5} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text group-hover:text-accent">
                      Access request — {r.recordId}
                    </p>
                    <p className="numeral text-[11px] text-text-3">{r.requester}</p>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-text-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
                </Link>
              ))}
            </>
          )}
        </Panel>

        {/* Live audit feed */}
        <Panel
          title="Latest movements"
          action={
            <Link href="/admin/audit" className="link-line text-xs text-text-3 hover:text-text">
              Full audit trail →
            </Link>
          }
        >
          {audit.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong p-5">
              <FileText className="size-5 text-text-3" strokeWidth={1.5} aria-hidden />
              <p className="text-xs leading-relaxed text-text-3">
                The audit trail is empty in this browser profile. Every upload, decision and generation is recorded
                here — governance is part of the product.
              </p>
            </div>
          ) : (
            <ol className="ws-scroll flex max-h-[320px] flex-col overflow-y-auto pr-1">
              {audit
                .slice()
                .reverse()
                .slice(0, 12)
                .map((a) => (
                  <li key={a.id} className="flex gap-3 border-b border-line py-3 first:pt-0 last:border-0 last:pb-0">
                    <span
                      aria-hidden
                      className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", ACTION_DOT[a.action] ?? "bg-text-3")}
                    />
                    <div className="min-w-0">
                      <p className="text-xs leading-snug text-text-2">
                        <span className="font-semibold text-text">{a.actor}</span> · {a.resource}
                      </p>
                      <p className="numeral mt-0.5 text-[10px] text-text-3">
                        {a.action} · {new Date(a.at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </li>
                ))}
            </ol>
          )}
        </Panel>
      </div>

      {/* Blind spots + demand signals */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Zero-result searches — the archive's blind spots">
          {zeroResults.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong p-5">
              <Search className="size-5 text-text-3" strokeWidth={1.5} aria-hidden />
              <p className="max-w-[52ch] text-xs leading-relaxed text-text-3">
                None yet. Search the ⌘K palette for something the demo corpus lacks — it appears here and tells the
                knowledge-management team exactly what to ingest next.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {zeroResults.slice(0, 6).map((z, i) => (
                <li key={z.q + i} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="flex min-w-0 items-center gap-2.5 text-sm text-text-2">
                    <AlertTriangle className="size-3.5 shrink-0 text-sunrise" strokeWidth={1.5} aria-hidden />
                    <span className="truncate">{z.q}</span>
                  </span>
                  <span className="numeral shrink-0 text-[11px] text-text-3">
                    {new Date(z.at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Most-requested this session">
          {popular.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong p-5">
              <FileSearch className="size-5 text-text-3" strokeWidth={1.5} aria-hidden />
              <p className="text-xs leading-relaxed text-text-3">
                No successful searches logged yet this session — run a few queries and demand signals collect here.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {popular.map(([q, n], i) => (
                <li key={q} className="flex items-center gap-3 border-b border-line py-2.5 first:pt-0 last:border-0">
                  <span className="numeral w-4 text-[11px] text-text-3">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-text-2">{q}</span>
                  <span className="numeral rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-3">{n}×</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Quick actions */}
      <nav aria-label="Quick actions" className="flex flex-wrap gap-2.5">
        {[
          { href: "/admin/dissemination", icon: <Send className="size-4 text-violet" strokeWidth={1.5} aria-hidden />, label: "Media dissemination", note: "upload → generate → review → publish", primary: true },
          { href: "/admin/ingestion", icon: <FileSearch className="size-4 text-text-2" strokeWidth={1.5} aria-hidden />, label: "Upload centre", note: "the documented pipeline" },
          { href: "/admin/review", icon: <Inbox className="size-4 text-text-2" strokeWidth={1.5} aria-hidden />, label: "Review queue", note: "decisions & approvals" },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={cn(
              "btn-tactile group flex min-w-[220px] flex-1 items-center justify-between gap-4 rounded-xl border p-4",
              c.primary ? "border-violet/40 bg-violet-dim" : "border-line bg-surface hover:border-text-3",
            )}
          >
            <span className="flex items-center gap-3">
              {c.icon}
              <span>
                <span className="block text-sm font-semibold text-text">{c.label}</span>
                <span className="block text-[11px] text-text-3">{c.note}</span>
              </span>
            </span>
            <ArrowRight className="size-4 text-text-3 transition-transform group-hover:translate-x-1" strokeWidth={1.5} aria-hidden />
          </Link>
        ))}
      </nav>
    </div>
  );
}
