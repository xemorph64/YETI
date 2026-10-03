"use client";

import { useEffect, useState } from "react";
import { auditApi } from "@/lib/api/client";
import { useStoreSnapshot } from "@/lib/api/client";
import { Kicker } from "@/components/ui/primitives";

const ACTION_STYLE: Record<string, string> = {
  upload: "text-sunrise",
  "metadata-change": "text-violet",
  approval: "text-accent",
  rejection: "text-danger",
  publication: "text-accent",
  "access-request": "text-text-2",
  "permission-change": "text-sunrise",
  submission: "text-text-2",
  "ai-generation": "text-violet",
  "collection-change": "text-text-3",
};

export default function AuditPage() {
  const audit = useStoreSnapshot((s) => s.audit);
  const [filter, setFilter] = useState<string>("all");

  const actions = ["all", ...new Set(audit.map((a) => a.action))];
  const rows = filter === "all" ? audit : audit.filter((a) => a.action === filter);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <Kicker>Audit trail</Kicker>
        <h1 className="display mt-3 text-balance text-4xl font-bold leading-[1.02]">Every action, on the record.</h1>
        <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-text-2">
          Uploads, metadata changes, reviews, approvals, AI generations, publications, access decisions — who,
          what, when, and the state change. The export pack from Social Media Dissemination includes the same trail.
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {actions.map((a) => (
          <button
            key={a}
            onClick={() => setFilter(a)}
            className={
              filter === a
                ? "btn-tactile rounded-full border border-accent/50 bg-accent-dim px-3 py-1.5 text-xs font-semibold text-accent"
                : "btn-tactile rounded-full border border-line-strong px-3 py-1.5 text-xs text-text-2 hover:text-text"
            }
          >
            {a === "all" ? "All actions" : a.replace(/-/g, " ")}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              {["When", "Actor", "Action", "Resource", "State", "Note"].map((h) => (
                <th key={h} className="meta-label px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((a) => (
              <tr key={a.id} className="align-top">
                <td className="numeral whitespace-nowrap px-4 py-3 text-[11px] text-text-3">
                  {new Date(a.at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-text-2">{a.actor}</td>
                <td className={`px-4 py-3 font-medium ${ACTION_STYLE[a.action] ?? "text-text-2"}`}>
                  {a.action.replace(/-/g, " ")}
                </td>
                <td className="max-w-[220px] truncate px-4 py-3 text-text-2" title={a.resource}>{a.resource}</td>
                <td className="numeral whitespace-nowrap px-4 py-3 text-[11px] text-text-3">{a.stateChange ?? "—"}</td>
                <td className="max-w-[320px] px-4 py-3 text-[13px] leading-snug text-text-3">{a.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
