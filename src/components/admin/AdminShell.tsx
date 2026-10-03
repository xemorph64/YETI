"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileSearch, LayoutDashboard, LogOut, MessageSquareShare, ScrollText, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleGate } from "@/components/chrome/RoleGate";
import { useRole } from "@/lib/roles";
import { useStoreSnapshot } from "@/lib/api/client";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="size-4" strokeWidth={1.5} aria-hidden />, live: true },
  { href: "/admin/dissemination", label: "Dissemination", icon: <MessageSquareShare className="size-4" strokeWidth={1.5} aria-hidden />, live: true },
  { href: "/admin/ingestion", label: "Upload centre", icon: <FileSearch className="size-4" strokeWidth={1.5} aria-hidden />, live: true },
  { href: "/admin/review", label: "Review queue", icon: <ShieldCheck className="size-4" strokeWidth={1.5} aria-hidden />, live: true, badge: true },
  { href: "/admin/audit", label: "Audit trail", icon: <ScrollText className="size-4" strokeWidth={1.5} aria-hidden />, live: true },
  { href: "/admin/analytics", label: "Analytics", icon: null, live: false },
  { href: "/admin/users", label: "Users & RBAC", icon: null, live: false },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { session, signOut } = useRole();
  const queue = useStoreSnapshot(
    (s) => s.submissions.filter((x) => x.status === "PENDING" || x.status === "UNDER_REVIEW").length + s.accessRequests.filter((r) => r.status === "PENDING").length,
  );

  const initials = (session?.name ?? "D")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <RoleGate require="admin">
      <div className="dh-container grid gap-8 pb-16 pt-28 md:pt-32 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Admin navigation" className="h-fit lg:sticky lg:top-24">
          {/* Signed-in identity */}
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-line bg-surface p-3.5">
            <span
              aria-hidden
              className="numeral flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-dim text-xs font-bold text-violet"
            >
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{session?.name ?? "…"}</p>
              <p className="text-[11px] text-text-3">NCPOR Admin · demo session</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-1.5 lg:flex-col">
            {ITEMS.map((item) => {
              const active = pathname === item.href;
              const badge = item.badge && queue > 0 ? queue : null;
              const inner = (
                <span
                  className={cn(
                    "btn-tactile flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm",
                    active
                      ? "border-violet/50 bg-violet-dim font-semibold text-violet"
                      : "border-transparent text-text-2 hover:bg-surface-2 hover:text-text",
                  )}
                >
                  {item.icon}
                  {item.label}
                  {badge !== null && (
                    <span className="numeral ml-auto rounded-full bg-sunrise-dim px-2 py-0.5 text-[10px] font-semibold text-sunrise">
                      {badge}
                    </span>
                  )}
                  {!item.live && (
                    <span className="ml-auto hidden rounded border border-line px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-text-3 lg:inline">
                      prod
                    </span>
                  )}
                </span>
              );
              return item.live ? (
                <Link key={item.href} href={item.href} className="block" aria-current={active ? "page" : undefined}>
                  {inner}
                </Link>
              ) : (
                <span key={item.href} className="block opacity-70" title="Ships with the production build">
                  {inner}
                </span>
              );
            })}
          </nav>

          <button
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="btn-tactile mt-4 flex w-full items-center gap-2.5 rounded-lg border border-transparent px-3.5 py-2.5 text-sm text-text-2 hover:bg-surface-2 hover:text-text"
          >
            <LogOut className="size-4" strokeWidth={1.5} aria-hidden />
            Sign out
          </button>

          <p className="mt-5 hidden text-[11px] leading-relaxed text-text-3 lg:block">
            Dense, precise, efficient — the desk view of the same archive. Demo state throughout.
          </p>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </RoleGate>
  );
}
