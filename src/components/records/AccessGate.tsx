"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { accessRequestsApi, canAccess } from "@/lib/api/client";
import { useRole } from "@/lib/roles";
import { useStoreSnapshot } from "@/lib/api/client";
import type { AccessClass } from "@/lib/api/types";

/**
 * Access-class gate — the governance model made visible.
 * OPEN: free. REGISTERED/RESTRICTED/EMBARGOED: metadata visible, file gated
 * behind a formal access request. INTERNAL/REMOVED: never shown publicly.
 * In production this decision is a backend rule; here it is enforced against
 * the demo store so admin decisions change the UI live.
 */

export function AccessGate({
  recordId,
  accessLevel,
  embargoUntil,
  children,
}: {
  recordId: string;
  accessLevel: AccessClass;
  embargoUntil?: string;
  children: React.ReactNode;
}) {
  const { role } = useRole();
  const requests = useStoreSnapshot((s) => s.accessRequests);
  const [justification, setJustification] = useState("");
  const [openForm, setOpenForm] = useState(false);

  const existing = requests.find((r) => r.recordId === recordId && r.requester === "Demo researcher (you)");

  if (accessLevel === "OPEN" || canAccess(accessLevel, role)) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-lg border border-sunrise/40 bg-sunrise-dim p-4" role="status">
      <p className="flex items-center gap-2 text-sm font-semibold text-text">
        <Lock className="size-4 text-sunrise" strokeWidth={1.5} aria-hidden />
        {accessLevel === "EMBARGOED" ? "Embargoed record" : accessLevel === "RESTRICTED" ? "Restricted record" : "Registered access"}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-text-2">
        {accessLevel === "EMBARGOED"
          ? `The file is gated until ${embargoUntil ?? "the embargo lifts"}. Metadata remains visible; access can be requested for scientific use.`
          : "The file is gated. Metadata is visible; the file requires an approved access request."}
        {role === "public" && (
          <> Public accounts cannot request gated files — switch to the <Link href="/atlas" className="link-line text-accent">Researcher experience</Link> to file a request.</>
        )}
      </p>

      {role !== "public" && accessLevel !== "INTERNAL" && (
        <>
          {!existing && !openForm && (
            <button
              onClick={() => setOpenForm(true)}
              className="btn-tactile mt-3 inline-flex items-center gap-2 rounded-md border border-sunrise/50 px-3 py-2 text-xs font-semibold text-text hover:text-text"
            >
              <ShieldCheck className="size-3.5" strokeWidth={1.5} aria-hidden /> Request access
            </button>
          )}
          {existing?.status === "PENDING" && (
            <p className="numeral mt-3 rounded-md border border-line bg-surface px-3 py-2 text-[11px] text-text-3">
              Access request {existing.id} — pending NCPOR decision.
            </p>
          )}
          {existing?.status === "APPROVED" && (
            <p className="mt-3 rounded-md border border-accent/40 bg-accent-dim px-3 py-2 text-[11px] text-accent">
              Access approved by NCPOR ({existing.decidedBy ?? "knowledge management"}) — unlock your session to download.
            </p>
          )}
          {openForm && !existing && (
            <div className="mt-3 flex flex-col gap-2">
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Scientific justification (which project, which analysis?)"
                aria-label="Access request justification"
                className="h-16 resize-none rounded-lg border border-line-strong bg-surface px-3 py-2 text-xs text-text outline-none placeholder:text-text-3 focus:border-accent/50"
              />
              <button
                onClick={async () => {
                  if (!justification.trim()) return;
                  await accessRequestsApi.create({
                    recordId,
                    requester: "Demo researcher (you)",
                    role: "researcher",
                    justification: justification.trim(),
                  });
                  setOpenForm(false);
                }}
                disabled={!justification.trim()}
                className="btn-tactile self-start rounded-md bg-accent-fill px-3 py-2 text-xs font-semibold text-accent-ink disabled:opacity-40"
              >
                File request
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
