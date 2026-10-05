"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Menu, Moon, Search, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { T, langDir, langFont, useLang, type Lang } from "@/lib/i18n";
import { AuthChip } from "@/components/chrome/AuthChip";
import { useRole } from "@/lib/roles";

/**
 * Simplified navigation: five primary destinations, everything else in one
 * "More" dropdown, one auth chip. The public archive needs no account.
 */
const NAV = [
  { href: "/atlas", key: "nav.atlas" as const },
  { href: "/labs", key: "nav.labs" as const },
  { href: "/expeditions", key: "nav.expeditions" as const },
  { href: "/vault", key: "nav.vault" as const },
  { href: "/stories", key: "nav.stories" as const },
  { href: "/learn", key: "nav.learn" as const },
];

const MORE = [
  { href: "/science", key: "nav.science" as const },
  { href: "/timeline", key: "nav.timeline" as const },
  { href: "/researchers", key: "nav.researchers" as const },
  { href: "/participate", key: "nav.participate" as const },
  { href: "/gallery", key: "nav.gallery" as const },
  { href: "/stations", key: "nav.stations" as const },
  { href: "/newsroom", key: "nav.newsroom" as const },
  { href: "/museum", label: "Museum bridge" },
  { href: "/about", label: "About" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden className="shrink-0">
        <circle cx="16" cy="16" r="14.5" fill="none" stroke="var(--line-strong)" strokeWidth="1" />
        <path d="M16 4 L18.6 13.4 L28 16 L18.6 18.6 L16 28 L13.4 18.6 L4 16 L13.4 13.4 Z" fill="var(--accent)" />
        <circle cx="24.5" cy="7.5" r="1.4" fill="var(--violet)" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="display text-[17px] font-bold tracking-[0.08em] text-text">YETI</span>
        {!compact && (
          <span className="meta-label mt-1 !text-[9px] tracking-[0.22em]">Knows. Now you can too!</span>
        )}
      </span>
    </span>
  );
}

export function SiteHeader({ onOpenSearch }: { onOpenSearch: () => void }) {
  const pathname = usePathname() || "/";
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { session } = useRole();

  // Immersive pages: header floats transparent until scrolled.
  const immersive = ["/", "/atlas", "/stations", "/stories", "/gallery", "/expeditions"].some(
    (p) => p === "/" ? pathname === "/" : pathname.startsWith(p),
  );

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      el.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    return () => document.removeEventListener("mousedown", onDoc);
  }, [moreOpen]);

  const moreActive = MORE.some((m) => pathname.startsWith(m.href));

  return (
    <>
      <header
        ref={headerRef}
        data-scrolled="false"
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          "data-[scrolled=true]:border-b data-[scrolled=true]:border-line data-[scrolled=true]:bg-bg/85 data-[scrolled=true]:backdrop-blur-xl",
          immersive && "data-[scrolled=false]:bg-transparent",
        )}
      >
        <div className="dh-container flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <Link href="/" aria-label="YETI home" className="btn-tactile rounded-md">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "link-line text-[13px] font-medium tracking-wide",
                    active ? "text-accent" : "text-text-2 hover:text-text",
                  )}
                >
                  <T k={item.key} />
                </Link>
              );
            })}

            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                className={cn(
                  "link-line flex items-center gap-1 text-[13px] font-medium tracking-wide",
                  moreActive || moreOpen ? "text-accent" : "text-text-2 hover:text-text",
                )}
              >
                <T k="nav.more" />
                <ChevronDown className={cn("size-3 transition-transform", moreOpen && "rotate-180")} strokeWidth={1.5} aria-hidden />
              </button>
              {moreOpen && (
                <div
                  role="menu"
                  aria-label="More sections"
                  className="absolute right-0 top-[calc(100%+10px)] z-[95] w-56 overflow-hidden rounded-xl border border-line-strong bg-surface py-1.5 shadow-[var(--shadow-raised)]"
                >
                  {MORE.map((item) => (
                    <Link
                      key={item.href}
                      role="menuitem"
                      href={item.href}
                      aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                      className={cn(
                        "block px-4 py-2 text-sm transition-colors hover:bg-surface-2",
                        pathname.startsWith(item.href) ? "font-semibold text-accent" : "text-text-2 hover:text-text",
                      )}
                    >
                      {"key" in item && item.key ? <T k={item.key} /> : item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenSearch}
              className="btn-tactile hidden items-center gap-2 rounded-md border border-line-strong px-3 py-2 text-xs text-text-2 hover:border-text-3 hover:text-text md:flex"
              aria-label="Search the archive (Command K)"
            >
              <Search className="size-3.5" strokeWidth={1.5} aria-hidden />
              <span className="hidden xl:inline"><T k="search.placeholder" /></span>
              <kbd className="numeral ml-1 hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-text-3 xl:inline">
                ⌘K
              </kbd>
            </button>

            <AuthChip />

            <LangSwitcher />

            <ThemeToggle />

            <button
              onClick={() => setMenuOpen(true)}
              className="btn-tactile rounded-md border border-line-strong p-2 text-text-2 hover:border-text-3 hover:text-text lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu (tablet/mobile) */}
      {menuOpen && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-bg/97 backdrop-blur-2xl lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="dh-container flex h-16 items-center justify-between">
            <Logo compact />
            <button
              onClick={() => setMenuOpen(false)}
              className="btn-tactile rounded-md border border-line-strong p-2 text-text-2 hover:text-text"
              aria-label="Close menu"
            >
              <X className="size-4" strokeWidth={1.5} />
            </button>
          </div>
          <nav aria-label="Mobile" className="dh-container mt-4 flex flex-col overflow-y-auto pb-10">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="display border-b border-line py-4 text-2xl font-semibold text-text"
                style={{ animation: `dash-draw 0.01s`, transitionDelay: `${i * 30}ms` }}
              >
                <T k={item.key} />
              </Link>
            ))}
            <p className="meta-label mt-6 mb-2">More</p>
            <div className="grid grid-cols-2 gap-2">
              {MORE.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-text-2"
                >
                  {"key" in item && item.key ? <T k={item.key} /> : item.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-2.5">
              <MobileLangRow />
              {session ? (
                <>
                  <Link
                    href={session.role === "admin" ? "/admin" : "/researcher"}
                    className="btn-tactile flex items-center justify-center gap-2 rounded-md border border-accent/50 bg-accent-dim px-5 py-3.5 text-sm font-semibold text-accent"
                  >
                    {session.role === "admin" ? "Admin console" : "Researcher workspace"}
                  </Link>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-xs text-text-3"
                  >
                    Signed in as {session.name}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="btn-tactile flex items-center justify-center gap-2 rounded-md border border-accent/50 bg-accent-dim px-5 py-3.5 text-sm font-semibold text-accent"
                >
                  Sign in — researcher & admin
                </Link>
              )}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenSearch();
                }}
                className="btn-tactile flex items-center justify-center gap-2 rounded-md bg-accent-fill px-5 py-3.5 text-sm font-semibold text-accent-ink"
              >
                <Search className="size-4" strokeWidth={1.5} aria-hidden />
                <T k="search.placeholder" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

/** Desktop language dropdown — English + the 22 scheduled languages. */
export function LangSwitcher() {
  const { lang, setLang, langs, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const current = langs.find((l) => l.id === lang) ?? langs[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${t("lang.label")}: ${current.native}`}
        className="btn-tactile flex items-center gap-1.5 rounded-md border border-line-strong px-2.5 py-2 text-xs font-semibold text-text-2 hover:border-text-3 hover:text-text"
      >
        <Globe className="size-3.5" strokeWidth={1.5} aria-hidden />
        <span className={cn("hidden max-w-[9ch] truncate md:inline", langFont(lang))} dir={langDir(lang)}>
          {lang === "en" ? "EN" : current.native}
        </span>
        <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} strokeWidth={1.5} aria-hidden />
      </button>
      {open && (
        <div
          role="menu"
          aria-label={t("lang.label")}
          className="panel-scroll absolute right-0 top-[calc(100%+8px)] z-[95] max-h-[min(70vh,560px)] w-60 overflow-y-auto rounded-xl border border-line-strong bg-surface py-1.5 shadow-[var(--shadow-raised)]"
        >
          {langs.map((l) => (
            <button
              key={l.id}
              role="menuitemradio"
              aria-checked={lang === l.id}
              onClick={() => {
                setLang(l.id as Lang);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3.5 py-2 text-sm transition-colors",
                lang === l.id ? "font-semibold text-accent" : "text-text-2 hover:bg-surface-2 hover:text-text",
              )}
            >
              <span className="flex min-w-0 items-baseline gap-2">
                <span className={langFont(l.id)} lang={l.id} dir={langDir(l.id)}>{l.native}</span>
                {l.id !== "en" && <span className="truncate text-[11px] text-text-3">{l.label}</span>}
              </span>
              {lang === l.id ? (
                <Check className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
              ) : (
                l.mt && <span className="numeral shrink-0 text-[10px] text-text-3" title="Machine-translated">MT</span>
              )}
            </button>
          ))}
          <p className="mt-1 border-t border-line px-3.5 pb-1 pt-2 text-[11px] leading-snug text-text-3">
            MT = machine-translated (AI4Bharat IndicTrans2). English, हिन्दी and বাংলা are hand-written.
          </p>
        </div>
      )}
    </div>
  );
}

/** Language picker for the full-screen mobile menu — a native select scales to 23 languages. */
export function MobileLangRow() {
  const { lang, setLang, langs } = useLang();
  return (
    <label className="flex items-center gap-2">
      <Globe className="size-3.5 shrink-0 text-text-3" strokeWidth={1.5} aria-hidden />
      <span className="sr-only">Language</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-sm font-semibold text-text"
      >
        {langs.map((l) => (
          <option key={l.id} value={l.id}>
            {l.native}
            {l.id !== "en" ? ` · ${l.label}` : ""}
            {l.mt ? " (MT)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("yeti-theme", next);
    localStorage.setItem("yeti-theme-user", next);
  };

  return (
    <button
      onClick={toggle}
      className="btn-tactile rounded-md border border-line-strong p-2 text-text-2 hover:border-text-3 hover:text-text"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? <Sun className="size-4" strokeWidth={1.5} /> : <Moon className="size-4" strokeWidth={1.5} />}
    </button>
  );
}
