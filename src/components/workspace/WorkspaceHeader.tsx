"use client";

/**
 * Console header for the signed-in workspaces — denser and quieter than the
 * public site's editorial headers: sans headings, fixed sizes, a live
 * attention chip, and the signed-in identity. Greeting resolves on the
 * client (time-of-day) with a neutral prerender fallback.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ROLE_LABELS, useRole } from "@/lib/roles";
import { useCountUp } from "@/components/workspace/useCountUp";
import { cn } from "@/lib/utils";

function greetingFor(hour: number): string {
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function WorkspaceHeader({
  lede,
  attention,
}: {
  lede: string;
  attention?: { count: number; label: string; href: string };
}) {
  const { session } = useRole();
  const [now, setNow] = useState<{ greeting: string; date: string } | null>(null);

  useEffect(() => {
    const d = new Date();
    setNow({
      greeting: greetingFor(d.getHours()),
      date: d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    });
  }, []);

  const name = session?.name ?? "";

  return (
    <header className="flex flex-col gap-5 border-b border-line pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-text md:text-[28px]">
            {now ? `${now.greeting}${name ? `, ${name}` : ""}.` : "Welcome back."}
          </h1>
          <p className="mt-1.5 max-w-[64ch] text-sm leading-relaxed text-text-2">{lede}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {attention && attention.count > 0 && (
            <Link
              href={attention.href}
              className="btn-tactile group flex items-center gap-2 rounded-full border border-sunrise/50 bg-sunrise-dim px-3.5 py-1.5 text-xs font-semibold text-sunrise"
            >
              <span className="relative flex size-2">
                <span className="pulse-dot absolute inline-flex size-2 rounded-full bg-sunrise" />
                <span className="relative inline-flex size-2 rounded-full bg-sunrise" />
              </span>
              {attention.count} {attention.label}
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
            </Link>
          )}
          <span
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold",
              session?.role === "admin" ? "border-violet/50 text-violet" : "border-accent/50 text-accent",
            )}
          >
            {session ? ROLE_LABELS[session.role] : "…"}
          </span>
          {now && <span className="hidden text-xs text-text-3 md:inline">{now.date}</span>}
        </div>
      </div>
    </header>
  );
}

/** Dense stat tile row — live numbers, context notes, one-shot count-up. */
export function WorkspaceStats({
  stats,
}: {
  stats: Array<{ label: string; value: number | null; note: string; tone?: "accent" | "violet" | "sunrise" }>;
}) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
      {stats.map((s, i) => (
        <StatTile key={s.label} {...s} delay={i * 60} />
      ))}
    </dl>
  );
}

function StatTile({
  label,
  value,
  note,
  tone = "accent",
  delay,
}: {
  label: string;
  value: number | null;
  note: string;
  tone?: "accent" | "violet" | "sunrise";
  delay: number;
}) {
  const shown = useCountUp(value ?? 0, value !== null);
  const toneClass =
    tone === "violet" ? "text-violet" : tone === "sunrise" ? "text-sunrise" : "text-text";
  return (
    <div className="ws-rise bg-surface px-5 py-4" style={{ animationDelay: `${delay}ms` }}>
      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-3">{label}</dt>
      <dd className={`numeral mt-1.5 text-3xl font-bold tabular-nums ${toneClass}`}>{value === null ? "—" : shown}</dd>
      <p className="mt-0.5 text-[11px] text-text-3">{note}</p>
    </div>
  );
}

/** Shared panel vocabulary — same head, same radius, everywhere. */
export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
  ariaLabel,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  ariaLabel?: string;
}) {
  return (
    <section aria-label={ariaLabel ?? title} className={cn("flex flex-col rounded-xl border border-line bg-surface", className)}>
      <div className="flex min-h-[50px] items-center justify-between gap-3 border-b border-line px-5 py-3">
        <h2 className="text-[13px] font-semibold tracking-wide text-text-2">{title}</h2>
        {action}
      </div>
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
