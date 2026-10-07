"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search, Sparkles } from "lucide-react";
import { SEARCH_GROUPS, searchAll, type SearchEntry } from "@/lib/search";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SearchPalette({
  open,
  onClose,
  onOpenAsk,
}: {
  open: boolean;
  onClose: () => void;
  onOpenAsk: () => void;
}) {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  const results = useMemo(() => searchAll(q), [q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && results[active]) {
        router.push(results[active].href);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, onClose, router]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const grouped = SEARCH_GROUPS.map((g) => ({ group: g, items: results.filter((r) => r.kind === g) })).filter(
    (g) => g.items.length > 0,
  );
  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-bg-deep/70 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search the archive"
    >
      <div className="flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-line-strong bg-surface shadow-[var(--shadow-raised)]">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 shrink-0 text-text-3" strokeWidth={1.5} aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="h-14 w-full bg-transparent text-[15px] text-text outline-none placeholder:text-text-3"
            aria-label={t("search.placeholder")}
          />
          <kbd className="numeral rounded border border-line px-1.5 py-0.5 text-[0.72rem] text-text-3">ESC</kbd>
        </div>

        <div ref={listRef} className="panel-scroll flex-1 overflow-y-auto p-2">
          {q && results.length === 0 && (
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <p className="text-sm text-text-2">
                Nothing in the archive matches &ldquo;{q}&rdquo; yet.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAsk();
                }}
                className="btn-tactile inline-flex items-center gap-2 rounded-md border border-accent/40 bg-accent-dim px-4 py-2 text-sm font-medium text-accent"
              >
                <Sparkles className="size-4" strokeWidth={1.5} aria-hidden />
                Ask Yeti instead
              </button>
            </div>
          )}
          {!q && (
            <div className="px-4 py-8 text-center">
              <p className="meta-label mb-3">One search box for everything polar</p>
              <p className="text-sm leading-relaxed text-text-2">
                Expeditions · Stations · Datasets · Imagery · Stories · Lessons · News
              </p>
            </div>
          )}
          {grouped.map(({ group, items }) => (
            <div key={group} className="mb-1">
              <p className="meta-label px-3 pb-1 pt-3">{group}</p>
              {items.map((item) => {
                flatIndex++;
                const isActive = flatIndex === active;
                return (
                  <button
                    key={item.href + item.title}
                    data-active={isActive}
                    onClick={() => {
                      router.push(item.href);
                      onClose();
                    }}
                    onMouseEnter={() => setActive(flatIndex)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left",
                      isActive ? "bg-accent-dim" : "hover:bg-surface-2",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-text">{item.title}</span>
                      <span className="block truncate text-xs text-text-3">{item.subtitle}</span>
                    </span>
                    <CornerDownLeft
                      className={cn("size-3.5 shrink-0", isActive ? "text-accent" : "text-transparent")}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
          <span className="meta-label">↑↓ navigate · ↵ open</span>
          <button
            onClick={() => {
              onClose();
              onOpenAsk();
            }}
            className="link-line text-xs text-text-2 hover:text-accent"
          >
            Ask Yeti →
          </button>
        </div>
      </div>
    </div>
  );
}

export type { SearchEntry };
