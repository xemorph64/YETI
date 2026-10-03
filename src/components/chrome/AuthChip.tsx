"use client";

/**
 * Header auth control: "Sign in" for visitors, a user menu for the two
 * gated experiences. Replaces the demo RoleSwitcher — roles now come from
 * the browser-local session, not free switching.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, ChevronDown, LogIn, LogOut, ScrollText, ShieldCheck, GraduationCap } from "lucide-react";
import { ROLE_GOALS, useRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

export function AuthChip() {
  const { session, signOut } = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!session) {
    return (
      <Link
        href="/login"
        className="btn-tactile flex items-center gap-1.5 rounded-md bg-accent-fill px-3.5 py-2 text-xs font-bold text-accent-ink shadow-[0_0_18px_var(--glow-line)] hover:opacity-90"
      >
        <LogIn className="size-3.5" strokeWidth={2} aria-hidden />
        <span>Sign in</span>
      </Link>
    );
  }

  const isAdmin = session.role === "admin";
  const initials = session.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Signed in as ${session.name}. Open account menu`}
        className={cn(
          "btn-tactile flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs font-semibold",
          isAdmin ? "border-violet/50 text-violet" : "border-accent/50 text-accent",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "numeral flex size-6 items-center justify-center rounded-full text-[10px] font-bold",
            isAdmin ? "bg-violet-dim" : "bg-accent-dim",
          )}
        >
          {initials}
        </span>
        <span className="hidden xl:inline">{session.name.split(" ")[0]}</span>
        <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} strokeWidth={1.5} aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-[calc(100%+8px)] z-[95] w-72 overflow-hidden rounded-xl border border-line-strong bg-surface shadow-[var(--shadow-raised)]"
        >
          <div className="border-b border-line px-4 py-3.5">
            <p className="text-sm font-semibold text-text">{session.name}</p>
            <p className="numeral text-[11px] text-text-3">{session.email}</p>
            <p className={cn("meta-label mt-1.5 !text-[9px]", isAdmin ? "!text-violet" : "!text-accent")}>
              {isAdmin ? "NCPOR Admin" : "Researcher"} · {ROLE_GOALS[session.role]}
            </p>
          </div>
          <div role="menuitem" className="flex flex-col py-1.5">
            <MenuLink
              href={isAdmin ? "/admin" : "/researcher"}
              icon={isAdmin ? <ShieldCheck className="size-4" strokeWidth={1.5} aria-hidden /> : <GraduationCap className="size-4" strokeWidth={1.5} aria-hidden />}
              label={isAdmin ? "Admin console" : "Researcher workspace"}
              onNavigate={() => setOpen(false)}
            />
            {!isAdmin && (
              <MenuLink
                href="/researcher/collections"
                icon={<Bookmark className="size-4" strokeWidth={1.5} aria-hidden />}
                label="My collections"
                onNavigate={() => setOpen(false)}
              />
            )}
            {isAdmin && (
              <MenuLink
                href="/admin/review"
                icon={<ScrollText className="size-4" strokeWidth={1.5} aria-hidden />}
                label="Review queue"
                onNavigate={() => setOpen(false)}
              />
            )}
          </div>
          <div className="border-t border-line p-2">
            <button
              role="menuitem"
              onClick={() => {
                signOut();
                setOpen(false);
                router.push("/");
              }}
              className="btn-tactile flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-text-2 hover:bg-surface-2 hover:text-text"
            >
              <LogOut className="size-4" strokeWidth={1.5} aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  label,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className="flex items-center gap-2.5 px-4 py-2 text-sm text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
    >
      {icon}
      {label}
    </Link>
  );
}
