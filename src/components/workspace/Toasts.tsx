"use client";

/**
 * Minimal toast layer for the signed-in consoles — action feedback, not
 * decoration. Transform/opacity only, auto-dismiss, reduced-motion safe
 * (the global reduced-motion rule neutralises the keyframes).
 */

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastItem {
  id: number;
  kind: "success" | "info";
  title: string;
  body?: string;
}

const Ctx = createContext<{ push: (t: Omit<ToastItem, "id">) => void }>({ push: () => {} });

export function useToast() {
  return useContext(Ctx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = ++seq.current;
    setItems((s) => [...s.slice(-2), { ...t, id }]);
    window.setTimeout(() => {
      setItems((s) => s.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-[84px] z-[120] flex w-[min(21rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="toast pointer-events-auto flex items-start gap-3 rounded-xl border border-line-strong bg-surface p-4 shadow-[var(--shadow-raised)]"
          >
            {t.kind === "success" ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
            ) : (
              <Info className="mt-0.5 size-4 shrink-0 text-violet" strokeWidth={1.5} aria-hidden />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text">{t.title}</p>
              {t.body && <p className="mt-0.5 text-xs leading-relaxed text-text-3">{t.body}</p>}
            </div>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
