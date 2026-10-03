"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, FileUp, LayoutDashboard, LogOut, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleGate } from "@/components/chrome/RoleGate";
import { useRole } from "@/lib/roles";
import { useStoreSnapshot } from "@/lib/api/client";

const ITEMS = [
  { href: "/researcher", label: "Overview", icon: <LayoutDashboard className="size-4" strokeWidth={1.5} aria-hidden /> },
  { href: "/researcher/graph", label: "Knowledge graph", icon: <Network className="size-4" strokeWidth={1.5} aria-hidden /> },
  { href: "/researcher/collections", label: "Collections", icon: <Bookmark className="size-4" strokeWidth={1.5} aria-hidden />, live: true },
  { href: "/researcher/contribute", label: "Contribute", icon: <FileUp className="size-4" strokeWidth={1.5} aria-hidden /> },
];

export function ResearcherShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { session, signOut } = useRole();
  const savedCount = useStoreSnapshot((s) => Object.values(s.collections).reduce((n, c) => n + c.recordIds.length, 0));

  const initials = (session?.name ?? "Y")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <RoleGate require="researcher">
      <div className="dh-container grid gap-8 pb-16 pt-28 md:pt-32 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Researcher navigation" className="h-fit lg:sticky lg:top-24">
          {/* Signed-in identity */}
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-line bg-surface p-3.5">
            <span
              aria-hidden
              className="numeral flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-dim text-xs font-bold text-accent"
            >
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{session?.name ?? "…"}</p>
              <p className="text-[11px] text-text-3">Researcher · demo session</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-1.5 lg:flex-col">
            {ITEMS.map((item) => {
              const active = pathname === item.href;
              const badge = item.live && savedCount > 0 ? savedCount : null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "btn-tactile flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm",
                    active
                      ? "border-accent/50 bg-accent-dim font-semibold text-accent"
                      : "border-transparent text-text-2 hover:bg-surface-2 hover:text-text",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.icon}
                  {item.label}
                  {badge !== null && (
                    <span className="numeral ml-auto rounded-full bg-accent-dim px-2 py-0.5 text-[10px] font-semibold text-accent">
                      {badge}
                    </span>
                  )}
                </Link>
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
            Same archive as the public Vault — sharper tools. Everything here is demo state in this build.
          </p>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </RoleGate>
  );
}
