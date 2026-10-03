"use client";

/**
 * Demo sign-in for the two gated experiences (researcher · NCPOR admin).
 * Browser-local only — no network calls, no real accounts. The signIn call
 * here is the seam where a production identity provider (SSO/LDAP) lands.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Kicker } from "@/components/ui/primitives";
import { Mascot } from "@/components/yeti/Mascot";
import { DEMO_ACCOUNTS, ROLE_GOALS, useRole } from "@/lib/roles";
import { useToast } from "@/components/workspace/Toasts";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/api/types";

const CARDS: Array<{
  role: Exclude<Role, "public">;
  title: string;
  icon: React.ReactNode;
  blurb: string;
  features: string[];
}> = [
  {
    role: "researcher",
    title: "Researcher",
    icon: <GraduationCap className="size-4" strokeWidth={1.5} aria-hidden />,
    blurb: "Sharper tools over the same archive.",
    features: ["Knowledge graph", "Collections & citations", "Contribute records", "Restricted-data access requests"],
  },
  {
    role: "admin",
    title: "NCPOR Admin",
    icon: <ShieldCheck className="size-4" strokeWidth={1.5} aria-hidden />,
    blurb: "The desk that runs the pipeline.",
    features: ["Ingestion & review queues", "Dissemination approvals", "Audit trail", "Access governance"],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { signIn, session, signOut } = useRole();
  const { push } = useToast();
  const [picked, setPicked] = useState<Exclude<Role, "public">>("researcher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const demoRan = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("next");
    if (n === "admin") setPicked("admin");
    if (n === "researcher") setPicked("researcher");

    // ?demo=researcher|admin — one-click entry straight from the home page
    // doors; runs once, only for anonymous visitors.
    const demo = params.get("demo");
    if (!demoRan.current && !session && (demo === "researcher" || demo === "admin")) {
      demoRan.current = true;
      setPicked(demo);
      const account = DEMO_ACCOUNTS[demo];
      const t = setTimeout(() => enter(demo, account.email, "yeti-demo"), 400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = (role: Exclude<Role, "public">, em: string, pw: string) => {
    const account = DEMO_ACCOUNTS[role];
    signIn({ ...account, email: em });
    push({
      kind: "success",
      title: `Signed in as ${account.name}`,
      body:
        role === "admin"
          ? "NCPOR Admin console — ingestion, review and approvals are yours."
          : "Researcher workspace — graph, collections and contributions unlocked.",
    });
    router.push(role === "admin" ? "/admin" : "/researcher");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter an email address — any address works in this demo.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters. Hint: the one-click button fills them for you.");
      return;
    }
    enter(picked, email, password);
  };

  /** One click: auto-enters the demo credentials for the picked role and signs in. */
  const autoEnter = () => {
    const account = DEMO_ACCOUNTS[picked];
    setEmail(account.email);
    setPassword("yeti-demo");
    setError(null);
    enter(picked, account.email, "yeti-demo");
  };

  return (
    <div className="dh-container grid min-h-[80vh] items-center gap-12 pb-20 pt-28 md:pt-32 lg:grid-cols-[1.1fr_1fr]">
      {/* Editorial side */}
      <div className="flex flex-col gap-6">
        <Kicker>Sign in</Kicker>
        <h1 className="display text-balance text-4xl font-bold leading-[1.02] md:text-5xl">
          One portal. Three experiences.
        </h1>
        <p className="max-w-[56ch] text-base leading-relaxed text-text-2">
          Everyone browses the public archive without an account. Researchers and NCPOR staff sign in to
          unlock their workspace — same YETI, sharper tools.
        </p>
        <div className="flex items-center gap-5 rounded-xl border border-line bg-surface p-5">
          <Mascot state="explaining" className="size-24 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-text">Demonstration authentication</p>
            <p className="mt-1 text-xs leading-relaxed text-text-3">
              No real accounts, no network calls — the session lives in your browser only. Production binds
              these roles to NCPOR identity accounts; the sign-in seam here is where that integration lands.
            </p>
          </div>
        </div>
        <ul className="grid gap-2 text-sm text-text-2 sm:grid-cols-3">
          {(["public", "researcher", "admin"] as const).map((r) => (
            <li key={r} className="rounded-lg border border-line bg-surface px-3.5 py-2.5">
              <span className="meta-label !text-[9px]">{r === "public" ? "no account needed" : "sign in"}</span>
              <p className="mt-1 text-sm font-semibold capitalize text-text">{r === "admin" ? "NCPOR Admin" : r}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-text-3">{ROLE_GOALS[r]}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Form side */}
      <div className="rounded-2xl border border-line bg-surface p-6 md:p-8">
        {session ? (
          <div className="flex flex-col items-start gap-4">
            <p className="meta-label">Already signed in</p>
            <p className="text-lg font-semibold text-text">
              {session.name} <span className="text-text-3">· {session.role === "admin" ? "NCPOR Admin" : "Researcher"}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={session.role === "admin" ? "/admin" : "/researcher"}
                className="rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-semibold text-accent-ink"
              >
                Open workspace
              </Link>
              <button
                onClick={signOut}
                className="rounded-lg border border-line-strong px-5 py-2.5 text-sm text-text-2 hover:border-text-3 hover:text-text"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
            <p className="meta-label">Choose your experience</p>
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Account type">
              {CARDS.map((c) => (
                <button
                  key={c.role}
                  type="button"
                  role="radio"
                  aria-checked={picked === c.role}
                  onClick={() => setPicked(c.role)}
                  className={cn(
                    "btn-tactile rounded-xl border p-4 text-left transition-colors",
                    picked === c.role
                      ? "border-accent/60 bg-accent-dim"
                      : "border-line bg-bg hover:border-line-strong",
                  )}
                >
                  <span className={cn("flex items-center gap-2 text-sm font-semibold", picked === c.role ? "text-accent" : "text-text")}>
                    {c.icon}
                    {c.title}
                  </span>
                  <span className="mt-1 block text-[11px] text-text-3">{c.blurb}</span>
                </button>
              ))}
            </div>

            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-text-3">
              {CARDS.find((c) => c.role === picked)!.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <Sparkles className="size-3 text-violet" strokeWidth={1.5} aria-hidden />
                  {f}
                </li>
              ))}
            </ul>

            <label className="flex flex-col gap-1.5">
              <span className="meta-label">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder={DEMO_ACCOUNTS[picked].email}
                autoComplete="username"
                className="rounded-lg border border-line-strong bg-bg px-3.5 py-2.5 text-sm text-text outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="meta-label">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                className="rounded-lg border border-line-strong bg-bg px-3.5 py-2.5 text-sm text-text outline-none focus:border-accent"
              />
            </label>

            {error && (
              <p role="alert" className="rounded-lg border border-sunrise/40 bg-sunrise-dim px-3.5 py-2.5 text-xs text-sunrise">
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="btn-tactile flex items-center gap-2 rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-semibold text-accent-ink"
              >
                <LogIn className="size-4" strokeWidth={1.5} aria-hidden />
                Sign in as {picked === "admin" ? "NCPOR Admin" : "Researcher"}
              </button>
              <button
                type="button"
                onClick={autoEnter}
                className="btn-tactile flex items-center gap-2 rounded-lg border border-accent/50 bg-accent-dim px-4 py-2.5 text-xs font-semibold text-accent hover:text-accent"
              >
                <Zap className="size-3.5" strokeWidth={1.5} aria-hidden />
                One-click demo sign-in
              </button>
            </div>
            <p className="text-[11px] leading-relaxed text-text-3">
              Demo accounts: <code className="numeral">{DEMO_ACCOUNTS.researcher.email}</code> (researcher) ·{" "}
              <code className="numeral">{DEMO_ACCOUNTS.admin.email}</code> (admin) · password{" "}
              <code className="numeral">yeti-demo</code>. The one-click button auto-enters them for the role picked
              above; any well-formed email works in the manual form too.
            </p>
            <p className="border-t border-line pt-4 text-xs text-text-3">
              Just visiting?{" "}
              <Link href="/" className="link-line text-accent">
                Continue as a public visitor — no account needed.
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
