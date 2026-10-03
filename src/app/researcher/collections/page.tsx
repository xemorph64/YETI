"use client";

import { useMemo, useState } from "react";
import { BookMarked, Download, Plus, Trash2 } from "lucide-react";
import { allRecords, collectionsApi, useStoreSnapshot } from "@/lib/api/client";
import { bibTeX, downloadText, ris } from "@/lib/citations";
import { useToast } from "@/components/workspace/Toasts";
import { MascotBadge } from "@/components/yeti/Mascot";
import { cn } from "@/lib/utils";

export default function CollectionsPage() {
  const collections = useStoreSnapshot((s) => s.collections);
  const annotations = useStoreSnapshot((s) => s.annotations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { push } = useToast();

  const list = Object.values(collections);
  const active = activeId ? collections[activeId] : null;

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allRecords()
      .filter((r) => (r.title + " " + r.summary).toLowerCase().includes(q))
      .slice(0, 8);
  }, [query]);

  const activeRecords = useMemo(() => {
    if (!active) return [];
    return active.recordIds
      .map((id) => allRecords().find((r) => r.id === id))
      .filter(Boolean) as NonNullable<ReturnType<typeof allRecords>[number]>[];
  }, [active]);

  const createCollection = () => {
    const id = `col-${Date.now().toString(36)}`;
    collectionsApi.toggleRecord(id, `Collection ${list.length + 1}`, "", "demo-researcher");
    setActiveId(id);
    push({ kind: "success", title: "Collection created", body: "Search the archive above to add records to it." });
  };

  const exportAll = (fmt: "bib" | "ris") => {
    if (!active) return;
    const body = activeRecords.map((r) => (fmt === "bib" ? bibTeX(r) : ris(r))).join("\n\n");
    downloadText(`${active.id}.${fmt}`, body, fmt === "bib" ? "application/x-bibtex" : "application/x-research-info-systems");
    push({
      kind: "success",
      title: `Exported ${activeRecords.length} ${activeRecords.length === 1 ? "citation" : "citations"} as ${fmt === "bib" ? "BibTeX" : "RIS"}`,
      body: `Downloaded ${active.id}.${fmt} — ready for your reference manager.`,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text md:text-[28px]">Your reading shelf.</h1>
          <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-text-2">
            Save records, keep private annotations, and export citations in BibTeX or RIS. Persisted per browser
            in this demo; the backend stores them per account.
          </p>
        </div>
        <button
          onClick={createCollection}
          className="btn-tactile inline-flex items-center gap-2 rounded-md bg-accent-fill px-4 py-2.5 text-sm font-semibold text-accent-ink"
        >
          <Plus className="size-4" strokeWidth={1.5} aria-hidden /> New collection
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="flex h-fit flex-col gap-2">
          {list.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-line-strong px-4 py-6 text-center">
              <MascotBadge state="idle" className="h-10 w-14" />
              <p className="text-sm text-text-3">
                No collections yet. Create one, then search the archive to fill it.
              </p>
            </div>
          )}
          {list.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={cn(
                "btn-tactile flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm",
                activeId === c.id ? "border-accent/50 bg-accent-dim text-accent" : "border-line-strong text-text-2 hover:text-text",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <BookMarked className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                <span className="truncate">{c.name}</span>
              </span>
              <span className="numeral text-xs text-text-3">{c.recordIds.length}</span>
            </button>
          ))}
        </aside>

        {active ? (
          <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the archive to add records…"
                aria-label="Search records to add"
                className="h-10 flex-1 rounded-lg border border-line-strong bg-surface px-3.5 text-sm text-text outline-none placeholder:text-text-3 focus:border-accent/60"
              />
              <button
                onClick={() => exportAll("bib")}
                disabled={activeRecords.length === 0}
                className="btn-tactile inline-flex items-center gap-1.5 rounded-md border border-line-strong px-3 py-2 text-xs font-semibold text-text-2 hover:text-text disabled:opacity-40"
              >
                <Download className="size-3.5" strokeWidth={1.5} aria-hidden /> BibTeX
              </button>
              <button
                onClick={() => exportAll("ris")}
                disabled={activeRecords.length === 0}
                className="btn-tactile inline-flex items-center gap-1.5 rounded-md border border-line-strong px-3 py-2 text-xs font-semibold text-text-2 hover:text-text disabled:opacity-40"
              >
                <Download className="size-3.5" strokeWidth={1.5} aria-hidden /> RIS
              </button>
            </div>

            {candidates.length > 0 && (
              <ul className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface p-2">
                {candidates.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => {
                        collectionsApi.toggleRecord(active.id, active.name, r.id, "demo-researcher");
                        push({ kind: "success", title: "Added to collection", body: r.title });
                        setQuery("");
                      }}
                      className="btn-tactile flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-surface-2"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-text">{r.title}</span>
                        <span className="meta-label !text-[9px]">{r.kind} · {r.accessLevel}</span>
                      </span>
                      <Plus className="size-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <ul className="flex flex-col gap-3">
              {activeRecords.length === 0 && (
                <li className="rounded-lg border border-dashed border-line-strong px-4 py-8 text-center text-sm text-text-3">
                  Empty collection — search above to add records.
                </li>
              )}
              {activeRecords.map((r) => (
                <li key={r.id} className="rounded-xl border border-line bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <a href={r.href} className="link-line text-sm font-semibold text-text">{r.title}</a>
                      <p className="meta-label mt-1 !text-[9px]">{r.kind} · {r.accessLevel} · {r.licence}</p>
                    </div>
                    <button
                      onClick={() => collectionsApi.toggleRecord(active.id, active.name, r.id, "demo-researcher")}
                      aria-label={`Remove ${r.title} from collection`}
                      className="btn-tactile rounded-md border border-line-strong p-1.5 text-text-3 hover:text-text"
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.5} aria-hidden />
                    </button>
                  </div>
                  <textarea
                    value={annotations[r.id]?.[0]?.body ?? ""}
                    onChange={(e) => {
                      const body = e.target.value;
                      import("@/lib/api/store").then(({ setStore }) => {
                        setStore((d) => {
                          d.annotations[r.id] ??= [];
                          if (d.annotations[r.id][0]) d.annotations[r.id][0].body = body;
                          else
                            d.annotations[r.id].unshift({
                              id: `ann-${r.id}`,
                              recordId: r.id,
                              quote: "",
                              body,
                              at: new Date().toISOString(),
                            });
                        });
                      });
                    }}
                    placeholder="Private annotation…"
                    aria-label={`Annotation for ${r.title}`}
                    className="mt-3 h-16 w-full resize-none rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs text-text-2 outline-none placeholder:text-text-3 focus:border-accent/50"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-dashed border-line-strong text-sm text-text-3">
            Select or create a collection to begin.
          </div>
        )}
      </div>
    </div>
  );
}
