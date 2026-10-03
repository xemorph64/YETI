"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { GLOSSARY, GLOSSARY_CATEGORIES } from "@/lib/data/glossary";
import { T, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function GlossaryClient() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const { lang } = useLang();

  const terms = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GLOSSARY.filter((t) => {
      if (cat && t.category !== cat) return false;
      if (!needle) return true;
      return [t.term, t.hi ?? "", t.bn ?? "", t.definition].join(" ").toLowerCase().includes(needle);
    });
  }, [q, cat]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 md:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-3" strokeWidth={1.5} aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms — English, हिन्दी, বাংলা…"
            className="w-full rounded-lg border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-3 focus:border-accent focus:outline-none"
            aria-label="Search the glossary"
          />
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          <button
            onClick={() => setCat(null)}
            className={cn(
              "btn-tactile rounded-full border px-3.5 py-1.5 text-xs",
              cat === null ? "border-accent/50 bg-accent-dim font-semibold text-accent" : "border-line bg-surface text-text-3 hover:text-text",
            )}
          >
            All
          </button>
          {GLOSSARY_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(cat === c ? null : c)}
              className={cn(
                "btn-tactile rounded-full border px-3.5 py-1.5 text-xs",
                cat === c ? "border-accent/50 bg-accent-dim font-semibold text-accent" : "border-line bg-surface text-text-3 hover:text-text",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="numeral text-[11px] text-text-3">
        {terms.length} of {GLOSSARY.length} terms
      </p>

      <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-2">
        {terms.map((t) => (
          <div key={t.id} className="flex flex-col bg-surface px-5 py-4">
            <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-sm font-semibold text-text">{t.term}</span>
              {t.hi && <span className="font-hindi text-xs text-text-3" lang="hi">{t.hi}</span>}
              {t.bn && <span className="font-bengali text-xs text-text-3" lang="bn">{t.bn}</span>}
              <span className="meta-label !text-[8px] ml-auto">{t.category}</span>
            </dt>
            <dd className="mt-1.5 text-[13px] leading-relaxed text-text-2">{t.definition}</dd>
          </div>
        ))}
      </dl>

      {terms.length === 0 && (
        <p className="rounded-xl border border-line bg-surface px-5 py-6 text-sm text-text-3">
          No term matches “{q}”. <T k="lang.continues" />
        </p>
      )}
    </div>
  );
}
