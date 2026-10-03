"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { ASK_SUGGESTIONS, retrieve } from "@/lib/data/askyeti";
import { T, useLang } from "@/lib/i18n";
import { useRole } from "@/lib/roles";
import { Mascot, type MascotState } from "@/components/yeti/Mascot";
import { cn } from "@/lib/utils";

interface Turn {
  q: string;
  a: string | null;
  sources: { label: string; href: string }[];
  related?: { label: string; href: string }[];
  evidence?: { section: string; quote: string };
}

/** Page-aware context — YETI understands where you are (core doc §5). */
function pageContext(pathname: string | null): { label: string; hint: string[] } | null {
  if (!pathname) return null;
  const seg = pathname.split("/").filter(Boolean);
  if (seg[0] === "stations" && seg[1]) {
    const name = seg[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { label: `Station — ${name}`, hint: [`Tell me about ${name}`, `Which expeditions served ${name}?`] };
  }
  if (seg[0] === "expeditions" && seg[1]) {
    return { label: `Expedition — ${seg[1].toUpperCase()}`, hint: ["Why was this expedition important?", "What did it produce?"] };
  }
  if (seg[0] === "vault" && seg[1] === "datasets" && seg[2]) {
    return { label: "Dataset record", hint: ["What datasets are available?", "How is this data licensed?"] };
  }
  if (seg[0] === "stories" && seg[1]) {
    return { label: "Research story", hint: ["What happened to Dakshin Gangotri?", "When was Maitri commissioned?"] };
  }
  if (seg[0] === "atlas") {
    return { label: "Expedition Atlas", hint: ["How many expeditions has India completed?"] };
  }
  if (seg[0] === "learn") {
    return { label: "Polar Gyaan", hint: ["Which station is in the Arctic?"] };
  }
  return null;
}

export function AskYeti({
  open,
  onOpen,
  onClose,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { lang } = useLang();
  const { role } = useRole();
  const ctx = pageContext(pathname);
  const mascotState: MascotState = busy
    ? "searching"
    : turns.length > 0 && turns[turns.length - 1].sources.length > 0
      ? "source-found"
      : turns.length > 0
        ? "warning"
        : open
          ? "explaining"
          : "idle";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

  // Escape closes the panel while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    setTurns((t) => [...t, { q, a: null, sources: [] }]);
    setBusy(true);
    // Simulated retrieval over the archive (no external calls in this build).
    setTimeout(() => {
      const hit = retrieve(q);
      setTurns((t) => {
        const next = [...t];
        next[next.length - 1] = {
          q,
          a: hit
            ? hit.answer
            : "I could not ground an answer in the archive for that yet. The demo archive is deliberately small — try one of the suggested questions, or browse the Vault directly. (No citation, no answer.)",
          sources: hit?.sources ?? [],
          related: hit?.related,
          evidence: hit?.evidence,
        };
        return next;
      });
      setBusy(false);
    }, 700);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={onOpen}
        aria-expanded={open}
        aria-label={open ? undefined : "Ask Yeti — archive assistant"}
        className={cn(
          "btn-tactile fixed bottom-20 right-4 z-[75] flex items-center gap-2 rounded-full border border-accent/40 bg-bg/90 px-4 py-2.5 text-sm font-semibold text-accent shadow-[var(--shadow-raised)] backdrop-blur-lg hover:bg-accent-dim md:bottom-6 md:right-6",
          open && "pointer-events-none opacity-0",
          pathname.startsWith("/admin") && "hidden",
        )}
      >
        <Mascot state={mascotState} className="size-8" />
        <T k="ask.title" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
            className="fixed inset-y-0 right-0 z-[85] flex w-full max-w-md flex-col border-l border-line-strong bg-bg shadow-[var(--shadow-raised)]"
            role="dialog"
            aria-modal="true"
            aria-label="Ask Yeti"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center">
                  <Mascot state={mascotState} className="size-10" />
                </span>
                <div>
                  <p className="display text-sm font-bold tracking-wide text-text">
                    <T k="ask.title" />
                  </p>
                  <p className="text-[11px] text-text-3">
                    <T k="ask.grounded" />
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="btn-tactile rounded-md border border-line-strong p-2 text-text-2 hover:text-text"
                aria-label="Close Ask Yeti"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>

            <div ref={scrollRef} className="panel-scroll flex-1 space-y-5 px-5 py-5">
              {turns.length === 0 && (
                <div className="flex flex-col gap-4">
                  {ctx && (
                    <p className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-dim px-3 py-2 text-[11px] text-accent" role="status">
                      <Mascot state="thinking" className="size-6 shrink-0" />
                      <span>
                        Reading with you: <strong>{ctx.label}</strong> — {lang === "hi" ? "इस पृष्ठ के बारे में पूछ सकते हैं।" : "you can ask about this page."}
                      </span>
                    </p>
                  )}
                  <p className="text-sm leading-relaxed text-text-2">
                    {lang === "hi"
                      ? "येती इस संग्रह की 45 साल की रिकॉर्ड से उत्तर ढूँढता है — हर उत्तर के साथ स्रोत।"
                      : `Yeti retrieves answers only from this archive — 45 years of expedition records, station data and stories — and always shows the source.${role !== "public" ? ` Answering as ${role === "admin" ? "an NCPOR administrator" : "a researcher"}.` : ""}`}
                  </p>
                  <div className="flex flex-col gap-2">
                    <p className="meta-label">Try asking</p>
                    {[...new Set([...(ctx?.hint ?? []), ...ASK_SUGGESTIONS])].slice(0, 6).map((s) => (
                      <button
                        key={s}
                        onClick={() => ask(s)}
                        className="btn-tactile rounded-lg border border-line-strong px-3.5 py-2.5 text-left text-sm text-text-2 hover:border-accent/50 hover:text-text"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {turns.map((turn, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-surface-2 px-4 py-2.5 text-sm text-text">
                    {turn.q}
                  </p>
                  <div className="max-w-[95%] rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3">
                    {turn.a === null ? (
                      <div className="flex items-center gap-2 py-1 text-xs text-text-3">
                        <span className="size-1.5 rounded-full bg-accent pulse-dot" aria-hidden />
                        Searching the archive…
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed text-text-2">{turn.a}</p>
                        {turn.evidence && (
                          <div className="mt-3 rounded-lg border-l-2 border-accent bg-surface-2 px-3 py-2.5" aria-label="Supporting evidence">
                            <p className="meta-label !text-[9px] !text-accent">Evidence — {turn.evidence.section}</p>
                            <blockquote className="mt-1.5 text-xs leading-relaxed text-text-2">
                              “{turn.evidence.quote}”
                            </blockquote>
                          </div>
                        )}
                        {turn.sources.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <span className="meta-label mr-1 self-center">Sources</span>
                            {turn.sources.map((s) => (
                              <Link
                                key={s.href + s.label}
                                href={s.href}
                                onClick={onClose}
                                className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent-dim px-2.5 py-1 text-[11px] font-medium text-accent hover:opacity-80"
                              >
                                {s.label}
                              </Link>
                            ))}
                          </div>
                        )}
                        {turn.related && turn.related.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {turn.related.map((s) => (
                              <Link
                                key={s.href + s.label}
                                href={s.href}
                                onClick={onClose}
                                className="rounded-full border border-line-strong px-2.5 py-1 text-[11px] text-text-2 hover:text-text"
                              >
                                {s.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-line p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === "hi" ? "संग्रह से पूछें…" : "Ask the archive…"}
                className="h-11 flex-1 rounded-lg border border-line-strong bg-surface px-3.5 text-sm text-text outline-none placeholder:text-text-3 focus:border-accent/60"
                aria-label="Ask a question"
                autoFocus={open}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="btn-tactile flex size-11 items-center justify-center rounded-lg bg-accent-fill text-accent-ink disabled:opacity-40"
                aria-label="Send question"
              >
                <Send className="size-4" strokeWidth={1.5} aria-hidden />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
