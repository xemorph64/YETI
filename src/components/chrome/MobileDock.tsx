"use client";

import { List, MessageCircleQuestion, Search } from "lucide-react";
import { useChrome } from "@/components/chrome/SiteChrome";

/* Touch-first bottom dock: menu / search / ask, all thumb-reachable.
   Menu reuses the header's hamburger so navigation lives in one place. */
export function MobileDock() {
  const { openSearch, openAsk } = useChrome();

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
      className="btn-tactile flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wide text-text-2 hover:text-text"
    >
      {icon}
      {label}
    </button>
  );
}
