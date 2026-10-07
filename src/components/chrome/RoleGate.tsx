"use client";

/**
 * Route gate for the two signed-in experiences. Renders the workspace only
 * when the browser-local session matches; otherwise an honest explanation
 * with the sign-in path. `ready` prevents a hydration flash before the
 * persisted session is read.
 */

import Link from "next/link";
import { Lock } from "lucide-react";
import { Mascot } from "@/components/yeti/Mascot";
import { useRole } from "@/lib/roles";

export function RoleGate({
  require,
  children,
}: {
  require: "researcher" | "admin";
  children: React.ReactNode;
}) {
  const { session, ready } = useRole();

  if (!ready) return <div className="min-h-[50vh]" aria-hidden />;
  if (session?.role === require) return <>{children}</>;

  const signedInElsewhere = session && session.role !== require;

  return (
    <div className="dh-container flex min-h-[70vh] max-w-2xl flex-col justify-center gap-6 pb-20 pt-32">
      <div className="flex items-center gap-4">
        <Mascot state="warning" className="size-20 shrink-0" />
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-sunrise" strokeWidth={1.5} aria-hidden />
          <p className="meta-label">
            {require === "admin" ? "NCPOR Admin console" : "Researcher workspace"} · sign-in required
          </p>
        </div>
      </div>
      <h1 className="display text-balance text-3xl font-bold md:text-4xl">
        {signedInElsewhere
          ? `You're signed in as ${session.role === "admin" ? "NCPOR Admin" : "a Researcher"}.`
          : "This part of YETI opens with a sign-in."}
      </h1>
      <p className="max-w-[58ch] text-sm leading-relaxed text-text-2">
        {require === "admin"
          ? "The admin console — ingestion, review queues, approvals and the audit trail — is restricted to NCPOR staff accounts."
          : "The researcher workspace — the knowledge graph, collections, citations and contributions — is for registered researchers."}{" "}
        The public archive stays open to everyone, no account needed.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/login?next=${require}`}
          className="btn-tactile rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-semibold text-accent-ink"
        >
          {signedInElsewhere ? "Switch account" : `Sign in as ${require === "admin" ? "NCPOR Admin" : "Researcher"}`}
        </Link>
        <Link
          href="/"
          className="btn-tactile rounded-lg border border-line-strong px-5 py-2.5 text-sm text-text-2 hover:border-text-3 hover:text-text"
        >
          Back to the public archive
        </Link>
      </div>
      <p className="text-xs leading-relaxed text-text-3">
        Demo note: authentication in this build is browser-local only — no real accounts, no network calls.
      </p>
    </div>
  );
}
