import Link from "next/link";
import { BadgeCheck, FlaskConical, Sparkles, Radio } from "lucide-react";
import type { Provenance } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

/* --- Provenance chip: the honesty primitive ------------------------------ */

const PROV: Record<Provenance, { label: string; cls: string; icon: React.ReactNode }> = {
  verified: {
    label: "Verified",
    cls: "text-accent border-accent/40 bg-accent/10",
    icon: <BadgeCheck className="size-3" strokeWidth={1.5} aria-hidden />,
  },
  demo: {
    label: "Demo record",
    cls: "text-sunrise border-sunrise/40 bg-sunrise/10",
    icon: <FlaskConical className="size-3" strokeWidth={1.5} aria-hidden />,
  },
  synthetic: {
    label: "Synthetic data",
    cls: "text-violet border-violet/40 bg-violet/10",
    icon: <FlaskConical className="size-3" strokeWidth={1.5} aria-hidden />,
  },
  "third-party": {
    label: "Third-party · credited",
    cls: "text-text-3 border-line-strong bg-surface-2",
    icon: <Radio className="size-3" strokeWidth={1.5} aria-hidden />,
  },
};

export function ProvenanceChip({
  p,
  label,
  className,
}: {
  p: Provenance;
  label?: string;
  className?: string;
}) {
  const c = PROV[p];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4",
        c.cls,
        className,
      )}
      title={`Provenance: ${c.label}`}
    >
      {c.icon}
      {label ?? c.label}
    </span>
  );
}

export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs btn-tactile",
        active
          ? "border-accent/60 bg-accent-dim text-accent"
          : "border-line-strong bg-surface text-text-2 hover:text-text hover:border-text-3",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

/* --- Meta label / kickers -------------------------------------------------- */

export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("meta-label flex items-center gap-2", className)}>
      <span className="inline-block h-px w-6 bg-accent/70" aria-hidden />
      {children}
    </p>
  );
}

/* --- Section header (stacked, per taste-skill split-header ban) ------------ */

export function SectionHeader({
  kicker,
  title,
  body,
  action,
  className,
}: {
  kicker: string;
  title: React.ReactNode;
  body?: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <Reveal className={cn("flex flex-col gap-4", className)}>
      <Kicker>{kicker}</Kicker>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="display max-w-2xl text-3xl font-semibold leading-[1.05] text-balance md:text-4xl">
          {title}
        </h2>
        {action && (
          <Link
            href={action.href}
            className="link-line shrink-0 text-sm font-medium text-accent"
          >
            {action.label} →
          </Link>
        )}
      </div>
      {body && <p className="max-w-[65ch] text-sm leading-relaxed text-text-2">{body}</p>}
    </Reveal>
  );
}

/* --- Buttons ---------------------------------------------------------------- */

const BTN_BASE =
  "btn-tactile inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold whitespace-nowrap";

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: React.ComponentProps<typeof Link> & { variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <Link
      href={href}
      className={cn(
        BTN_BASE,
        "px-5 py-3",
        variant === "primary" && "bg-accent-fill text-accent-ink hover:opacity-90",
        variant === "secondary" &&
          "border border-line-strong bg-surface/60 text-text hover:border-text-3 hover:bg-surface-2",
        variant === "ghost" && "text-text-2 hover:text-text",
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button
      className={cn(
        BTN_BASE,
        "px-4 py-2.5",
        variant === "primary" && "bg-accent-fill text-accent-ink hover:opacity-90",
        variant === "secondary" &&
          "border border-line-strong bg-surface text-text hover:border-text-3 hover:bg-surface-2",
        variant === "ghost" && "text-text-2 hover:text-text",
        variant === "danger" && "border border-danger/50 text-danger hover:bg-danger/10",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* --- Stat block -------------------------------------------------------------- */

export function Stat({
  value,
  label,
  className,
}: {
  value: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="numeral text-2xl font-semibold text-text md:text-3xl">{value}</span>
      <span className="meta-label">{label}</span>
    </div>
  );
}

/* --- Skeletons ----------------------------------------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden />;
}

export function SparkleDivider() {
  return (
    <div className="flex items-center gap-2 text-text-3" aria-hidden>
      <span className="h-px flex-1 bg-line" />
      <Sparkles className="size-3.5" strokeWidth={1.5} />
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
