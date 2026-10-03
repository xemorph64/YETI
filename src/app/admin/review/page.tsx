"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { accessRequestsApi, submissionsApi, useStoreSnapshot } from "@/lib/api/client";
import { Kicker } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/**
 * Scientific review — researcher submissions and access requests are decided
 * here. Only APPROVED content enters discovery; every decision is audited.
 * This is the demo enforcement of the governance rule "never publish without
 * approval": the researcher's submission stays out of the archive until this
 * desk approves it.
 */

const STATUS_STYLE: Record<string, string> = {
  PENDING: "text-sunrise border-sunrise/50 bg-sunrise-dim",
  UNDER_REVIEW: "text-sunrise border-sunrise/50 bg-sunrise-dim",
  APPROVED: "text-accent border-accent/50 bg-accent-dim",
  REJECTED: "text-danger border-danger/50 bg-danger/10",
  REVISION_REQUESTED: "text-violet border-violet/50 bg-violet-dim",
};

export default function ReviewPage() {
  const submissions = useStoreSnapshot((s) => s.submissions);
  const accessRequests = useStoreSnapshot((s) => s.accessRequests);
  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <div className="flex flex-col gap-8">
      <header>
        <Kicker>Review queue</Kicker>
        <h1 className="display mt-3 text-balance text-4xl font-bold leading-[1.02]">
          Nothing publishes without a human scientist.
        </h1>
        <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-text-2">
          Researcher submissions and file-access requests wait here. Approve, request changes or reject — every
          decision lands in the audit log and changes what the archive shows.
        </p>
      </header>

      <section aria-label="Researcher submissions" className="flex flex-col gap-3">
        <h2 className="meta-label">Researcher submissions</h2>
        {submissions.length === 0 && (
          <p className="rounded-lg border border-dashed border-line-strong px-4 py-8 text-center text-sm text-text-3">
            Queue is clear.
          </p>
        )}
        {submissions.map((s) => {
          const decidable = s.status === "PENDING" || s.status === "UNDER_REVIEW";
          return (
            <article key={s.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="meta-label !text-[9px]">
                    {s.id} · {s.kind} · submitted {s.submittedAt} · {s.submitter}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold leading-snug text-text">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-2">{s.description}</p>
                  <p className="numeral mt-1.5 text-[11px] text-text-3">
                    licence {s.licence} · rights: {s.rights}
                    {s.linkedExpedition ? ` · exp ${s.linkedExpedition}` : ""}
                    {s.linkedStation ? ` · ${s.linkedStation}` : ""}
                  </p>
                </div>
                <span className={cn("shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold", STATUS_STYLE[s.status])}>
                  {s.status.replace(/_/g, " ")}
                </span>
              </div>

              {decidable ? (
                <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
                  <input
                    value={notes[s.id] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [s.id]: e.target.value }))}
                    placeholder="Reviewer note (goes back to the contributor)"
                    aria-label={`Reviewer note for ${s.id}`}
                    className="h-9 rounded-lg border border-line-strong bg-surface-2 px-3 text-xs text-text outline-none placeholder:text-text-3 focus:border-accent/50"
                  />
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["APPROVED", "Approve & index", "bg-accent-fill text-accent-ink"],
                        ["REVISION_REQUESTED", "Request changes", ""],
                        ["REJECTED", "Reject", ""],
                      ] as const
                    ).map(([status, label, cls]) => (
                      <button
                        key={status}
                        onClick={() =>
                          submissionsApi.decide(s.id, status, "NCPOR scientific reviewer (demo)", notes[s.id] || label)
                        }
                        className={cn(
                          "btn-tactile rounded-md border border-line-strong px-3 py-2 text-xs font-semibold text-text-2 hover:text-text",
                          cls && "border-transparent",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                s.reviewerNote && (
                  <p className="mt-3 rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs text-text-2">
                    <span className="font-semibold text-text">Decision note:</span> {s.reviewerNote}
                  </p>
                )
              )}
            </article>
          );
        })}
      </section>

      <section aria-label="Access requests" className="flex flex-col gap-3">
        <h2 className="meta-label">Access requests</h2>
        {accessRequests.length === 0 && (
          <p className="rounded-lg border border-dashed border-line-strong px-4 py-8 text-center text-sm text-text-3">
            No access requests yet. Restricted and embargoed records in the Vault collect them here.
          </p>
        )}
        {accessRequests.map((r) => (
          <article key={r.id} className="rounded-xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="meta-label !text-[9px]">
                  {r.id} · record {r.recordId} · {r.requester}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-2">{r.justification}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                  STATUS_STYLE[r.status] ?? "",
                )}
              >
                {r.status}
              </span>
            </div>
            {r.status === "PENDING" && (
              <div className="mt-3 flex gap-2 border-t border-line pt-3">
                <button
                  onClick={() => accessRequestsApi.decide(r.id, "APPROVED", "NCPOR knowledge management (demo)")}
                  className="btn-tactile inline-flex items-center gap-1.5 rounded-md bg-accent-fill px-3 py-2 text-xs font-semibold text-accent-ink"
                >
                  <ShieldCheck className="size-3.5" strokeWidth={1.5} aria-hidden /> Grant access
                </button>
                <button
                  onClick={() => accessRequestsApi.decide(r.id, "DENIED", "NCPOR knowledge management (demo)")}
                  className="btn-tactile rounded-md border border-line-strong px-3 py-2 text-xs font-semibold text-text-2 hover:text-text"
                >
                  Deny
                </button>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
