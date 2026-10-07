"use client";

import Link from "next/link";
import { List, LogIn, MessageCircleQuestion, Search } from "lucide-react";
import { useChrome } from "@/components/chrome/SiteChrome";
import { useRole } from "@/lib/roles";

/* Touch-first bottom dock: menu / search / ask, all thumb-reachable.
   Menu reuses the header's hamburger so navigation lives in one place.
   Anonymous visitors get a thumb-reachable Sign in action. */
export function MobileDock() {
  const { openSearch, openAsk } = useChrome();
  const { session } = useRole();

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-[74] flex items-stretch justify-around border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <DockButton
        label="Menu"
        icon={<List className="size-5" strokeWidth={1.5} aria-hidden />}
        onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Open menu"]')?.click()}
      />
      <DockButton
        label="Search"
        icon={<Search className="size-5" strokeWidth={1.5} aria-hidden />}
        onClick={openSearch}
      />
      <DockButton
        label="Ask"
        icon={<MessageCircleQuestion className="size-5" strokeWidth={1.5} aria-hidden />}
        onClick={openAsk}
      />
      {!session && (
        <DockLink
          label="Sign in"
          href="/login"
          icon={<LogIn className="size-5" strokeWidth={1.5} aria-hidden />}
        />
      )}
    </nav>
  );
}

function DockButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="btn-tactile flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.72rem] font-medium tracking-wide text-text-2 hover:text-text"
    >
      {icon}
      {label}
    </button>
  );
}

function DockLink({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="btn-tactile flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.72rem] font-semibold tracking-wide text-accent"
    >
      {icon}
      {label}
    </Link>
  );
}
