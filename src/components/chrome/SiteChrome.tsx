"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/lib/i18n";
import { RoleProvider } from "@/lib/roles";
import { ToastProvider } from "@/components/workspace/Toasts";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SearchPalette } from "@/components/chrome/SearchPalette";
import { AskYeti } from "@/components/chrome/AskYeti";
import { MobileDock } from "@/components/chrome/MobileDock";

/* Utility-mode routes get the light theme by default (PRD: light = utility).
   A user's manual theme choice (localStorage "yeti-theme-user") wins. */
const UTILITY_PREFIXES = ["/vault", "/learn", "/admin", "/newsroom", "/search", "/about"];

interface ChromeCtx {
  openSearch: () => void;
  openAsk: () => void;
}

const Ctx = createContext<ChromeCtx>({ openSearch: () => {}, openAsk: () => {} });

export function useChrome() {
  return useContext(Ctx);
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [searchOpen, setSearchOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

  // Route-aware default theme, overridable by explicit user choice.
  useEffect(() => {
    const userChoice = localStorage.getItem("yeti-theme-user");
    if (userChoice) {
      document.documentElement.setAttribute("data-theme", userChoice);
      return;
    }
    const isUtility = UTILITY_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
    document.documentElement.setAttribute("data-theme", isUtility ? "light" : "dark");
  }, [pathname]);

  // Global ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({
      openSearch: () => setSearchOpen(true),
      openAsk: () => setAskOpen(true),
    }),
    [],
  );

  return (
    <RoleProvider>
      <ToastProvider>
        <LanguageProvider>
          <Ctx.Provider value={value}>
            <SiteHeader onOpenSearch={() => setSearchOpen(true)} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <MobileDock />
            <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} onOpenAsk={() => setAskOpen(true)} />
            {pathname !== "/admin" && (
              <AskYeti open={askOpen} onOpen={() => setAskOpen(true)} onClose={() => setAskOpen(false)} />
            )}
          </Ctx.Provider>
        </LanguageProvider>
      </ToastProvider>
    </RoleProvider>
  );
}
