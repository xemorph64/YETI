"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AtSign,
  CalendarDays,
  Check,
  CheckCircle2,
  CloudUpload,
  Download,
  Eye,
  FileCode2,
  FileSpreadsheet,
  FileUp,
  Globe2,
  Hash,
  History,
  Loader2,
  MessageSquareWarning,
  Package,
  PenLine,
  Send,
  Sparkles,
} from "lucide-react";
import { DISSEM_DRAFTS, DISSEM_SOURCE, DISSEM_STAGES, DISSEM_TEAM } from "@/lib/data/dissemination";
import type { ChannelDraft } from "@/lib/types";
import { logAudit, setStore } from "@/lib/api/store";
import { useStoreSnapshot } from "@/lib/api/client";
import { Button, ProvenanceChip } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type Phase = "idle" | "processing" | "review" | "published";
type DraftState = ChannelDraft & {
  status: "draft" | "approved" | "changes-requested" | "published";
  edited: boolean;
  reviewNote?: string;
  scheduledFor?: string;
};

const STAGE_MS = [700, 1100, 900, 1000, 900, 600];

const isoDay = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export function DisseminationClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stageIdx, setStageIdx] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [drafts, setDrafts] = useState<DraftState[]>([]);
  const [activeId, setActiveId] = useState<ChannelDraft["id"]>("press-release");
  const [note, setNote] = useState("");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const published = useStoreSnapshot((s) => s.publishedChannelDrafts);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runPipeline = useCallback(() => {
    setPhase("processing");
    setStageIdx(0);
    let acc = 0;
    DISSEM_STAGES.forEach((_, i) => {
      acc += STAGE_MS[i];
      timers.current.push(setTimeout(() => setStageIdx(i + 1), acc));
    });
    timers.current.push(
      setTimeout(() => {
        setDrafts(
          DISSEM_DRAFTS.map((d) => ({
            ...d,
            status: "draft" as const,
            edited: false,
            scheduledFor: isoDay(d.scheduleHintDays ?? 1),
          })),
        );
        setActiveId("press-release");
        setMode("edit");
        setPhase("review");
      }, acc + 500),
    );
  }, []);

  const updateDraft = (id: ChannelDraft["id"], body: string) =>
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, body, edited: true } : d)));

  const setStatus = (id: ChannelDraft["id"], status: DraftState["status"], reviewNote?: string) =>
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, status, reviewNote } : d)));

  const schedule = (id: ChannelDraft["id"], day: string) =>
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, scheduledFor: day } : d)));

  const active = drafts.find((d) => d.id === activeId);
  const approvedCount = drafts.filter((d) => d.status === "approved").length;
  const publishedCount = useMemo(() => drafts.filter((d) => d.status === "published").length, [drafts]);
  const overLimit = active?.charLimit !== undefined && active.body.length > active.charLimit;

  /** Real publish: approved drafts enter the observable store's dissemination
      ledger (admin dashboard metric goes live) and the audit trail. */
  const publishApproved = () => {
    const approved = drafts.filter((d) => d.status === "approved");
    if (approved.length === 0) return;
    setStore((st) => {
      st.publishedChannelDrafts.push(...approved.map((d) => d.id));
    });
    approved.forEach((d) => {
      logAudit({
        actor: "Communications officer (demo)",
        action: "publication",
        resource: `Dissemination · ${d.label}`,
        note: `Scheduled ${d.scheduledFor ?? "unscheduled"} · prompt ${DISSEM_TEAM.promptVersion} · source ${DISSEM_SOURCE.fileName}`,
      });
    });
    setDrafts((prev) => prev.map((d) => (d.status === "approved" ? { ...d, status: "published" } : d)));
    setPhase("published");
  };

  const downloadFile = (name: string, body: string, mime: string) => {
    const blob = new Blob([body], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportZip = async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const d of drafts) {
      zip.file(`${d.id}.txt`, `${d.label}\nPlatform: ${d.platform}\nStatus: ${d.status}\nConfidence: ${d.confidence}\nScheduled: ${d.scheduledFor ?? "—"}\n${d.notes ? `Notes: ${d.notes}\n` : ""}\n---\n\n${d.body}`);
    }
    zip.file(
      "PROVENANCE.txt",
      [
        `YETI Social Media Dissemination export (demonstration)`,
        `Source document: ${DISSEM_SOURCE.fileName} — ${DISSEM_SOURCE.demoNote}`,
        `Prompt/version: ${DISSEM_TEAM.promptVersion}`,
        `Model: ${DISSEM_TEAM.model}`,
        `Reviewer: ${DISSEM_TEAM.reviewer} · Approver: ${DISSEM_TEAM.approver}`,
        `Exported: ${new Date().toISOString()}`,
      ].join("\n"),
    );
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dissemination-media-pack.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    downloadFile(
      "dissemination-drafts.json",
      JSON.stringify(
        {
          source: DISSEM_SOURCE.fileName,
          promptVersion: DISSEM_TEAM.promptVersion,
          exportedAt: new Date().toISOString(),
          publishedChannelIds: published,
          drafts: drafts.map(({ id, label, platform, status, confidence, scheduledFor, body }) => ({
            id, label, platform, status, confidence, scheduledFor, body,
          })),
        },
        null,
        2,
      ),
      "application/json",
    );
  };

  const exportCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      "id,label,platform,status,confidence,scheduled_for,characters,limit",
      ...drafts.map((d) =>
        [d.id, d.label, d.platform, d.status, d.confidence, d.scheduledFor ?? "", String(d.body.length), d.charLimit ? String(d.charLimit) : ""]
          .map(esc)
          .join(","),
      ),
    ];
    downloadFile("dissemination-drafts.csv", rows.join("\n"), "text/csv");
  };

  /* Content calendar: scheduled drafts grouped by day. */
  const calendar = useMemo(() => {
    const groups = new Map<string, DraftState[]>();
    for (const d of drafts) {
      if (!d.scheduledFor) continue;
      const list = groups.get(d.scheduledFor) ?? [];
      list.push(d);
      groups.set(d.scheduledFor, list);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [drafts]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl font-bold">Social Media Dissemination</h1>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-text-2">
            An editorial production workspace, not a chatbot. One approved document in — a full, reviewable media
            pack out. Every draft carries source, provenance and confidence; nothing publishes itself.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ProvenanceChip p="demo" label="Simulated pipeline — no external AI calls" />
          {published.length > 0 && (
            <p className="numeral text-[11px] text-text-3">{published.length} drafts in the published ledger</p>
          )}
        </div>
      </header>

      {/* Pipeline stages rail */}
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-label="Pipeline stages">
        {DISSEM_STAGES.map((s, i) => {
          const done = phase === "review" || phase === "published" || stageIdx > i;
          const current = phase === "processing" && stageIdx === i;
          return (
            <li
              key={s.id}
              className={cn(
                "rounded-lg border p-3",
                done ? "border-accent/40 bg-accent-dim" : current ? "border-line-strong bg-surface-2" : "border-line bg-surface opacity-70",
              )}
            >
              <p className="flex items-center gap-1.5 text-xs font-semibold text-text">
                {done ? (
                  <CheckCircle2 className="size-3.5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                ) : current ? (
                  <Loader2 className="size-3.5 shrink-0 animate-spin text-accent" strokeWidth={1.5} aria-hidden />
                ) : (
                  <span className="numeral text-text-3">{i + 1}</span>
                )}
                <span className="truncate">{s.label}</span>
              </p>
              <p className="mt-1 hidden text-[10px] leading-tight text-text-3 md:block">{s.detail}</p>
            </li>
          );
        })}
      </ol>

      {/* IDLE: upload */}
      {phase === "idle" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            runPipeline();
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-14 text-center transition-colors",
            dragOver ? "border-accent bg-accent-dim" : "border-line-strong bg-surface",
          )}
        >
          <CloudUpload className="size-8 text-text-3" strokeWidth={1.5} aria-hidden />
          <div>
            <p className="text-sm font-semibold text-text">Drop the approved report here</p>
            <p className="mt-1 text-xs text-text-3">
              PDF / DOCX / MD — parsed locally in this demo; any file triggers the simulation.
            </p>
          </div>
          <Button onClick={runPipeline} variant="secondary">
            <FileUp className="size-4" strokeWidth={1.5} aria-hidden />
            Use the demo report ({DISSEM_SOURCE.fileName})
          </Button>
          <p className="max-w-[52ch] text-[11px] leading-relaxed text-text-3">{DISSEM_SOURCE.demoNote}</p>
        </div>
      )}

      {/* PROCESSING */}
      {phase === "processing" && (
        <div className="rounded-2xl border border-line bg-surface p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="size-5 animate-spin text-accent" strokeWidth={1.5} aria-hidden />
            <p className="text-sm font-semibold">Processing {DISSEM_SOURCE.fileName}…</p>
          </div>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${(stageIdx / DISSEM_STAGES.length) * 100}%` }}
            />
          </div>
          <ol className="numeral mt-5 flex flex-col gap-1.5 text-[11px] text-text-3">
            {DISSEM_STAGES.slice(0, stageIdx).map((s) => (
              <li key={s.id} className="flex items-center gap-2">
                <Check className="size-3 text-accent" strokeWidth={1.5} aria-hidden />
                {s.label} — {s.detail}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* REVIEW */}
      {(phase === "review" || phase === "published") && (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Channel list */}
          <nav aria-label="Generated channels" className="flex h-fit flex-col gap-1.5 rounded-xl border border-line bg-surface p-2">
            {drafts.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={cn(
                  "btn-tactile flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm",
                  activeId === d.id ? "bg-accent-dim font-semibold text-accent" : "text-text-2 hover:bg-surface-2 hover:text-text",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate">{d.label}</span>
                  <span className="block truncate text-[10px] text-text-3">{d.platform}</span>
                </span>
                <StatusDot status={d.status} />
              </button>
            ))}
            <div className="mt-2 border-t border-line px-3 pb-1 pt-3">
              <p className="numeral text-[11px] text-text-3">
                {approvedCount}/{drafts.length} approved
              </p>
            </div>
          </nav>

          {/* Draft editor */}
          {active && (
            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="display text-lg font-bold">{active.label}</h2>
                  <p className="text-xs text-text-3">{active.platform}</p>
                </div>
                <div className="flex items-center gap-2">
                  {active.hindi && <ProvenanceChip p="demo" label="हिन्दी · machine-drafted" />}
                  <ConfidenceChip level={active.confidence} />
                  <div className="flex overflow-hidden rounded-lg border border-line-strong" role="tablist" aria-label="Editor mode">
                    {(["edit", "preview"] as const).map((m) => (
                      <button
                        key={m}
                        role="tab"
                        aria-selected={mode === m}
                        onClick={() => setMode(m)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold",
                          mode === m ? "bg-accent-dim text-accent" : "text-text-3 hover:text-text",
                        )}
                      >
                        {m === "edit" ? <PenLine className="size-3" strokeWidth={1.5} aria-hidden /> : <Eye className="size-3" strokeWidth={1.5} aria-hidden />}
                        {m === "edit" ? "Edit" : "Preview"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {mode === "edit" ? (
                <>
                  <label className="sr-only" htmlFor="draft-body">
                    Draft body
                  </label>
                  <textarea
                    id="draft-body"
                    value={active.body}
                    onChange={(e) => updateDraft(active.id, e.target.value)}
                    rows={14}
                    className={cn(
                      "w-full rounded-xl border bg-surface p-5 font-sans text-[13.5px] leading-relaxed text-text outline-none focus:border-accent/60",
                      active.status === "published" ? "border-accent/40" : "border-line-strong",
                    )}
                    dir={active.hindi ? "auto" : "ltr"}
                  />
                  {/* Character counter + schedule */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className={cn("numeral", overLimit ? "font-semibold text-danger" : "text-text-3")}>
                      {active.body.length}
                      {active.charLimit ? ` / ${active.charLimit} characters` : " characters"}
                      {overLimit && " — over the platform limit"}
                    </span>
                    {active.scheduledFor && (
                      <span className="flex items-center gap-1 text-text-3">
                        <CalendarDays className="size-3" strokeWidth={1.5} aria-hidden />
                        <label htmlFor={`sched-${active.id}`} className="sr-only">Schedule date</label>
                        <input
                          id={`sched-${active.id}`}
                          type="date"
                          value={active.scheduledFor}
                          onChange={(e) => schedule(active.id, e.target.value)}
                          className="rounded border border-line bg-surface px-1.5 py-0.5 text-text"
                        />
                      </span>
                    )}
                  </div>
                  {/* Hashtag suggestions */}
                  {active.hashtags && active.hashtags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Hash className="size-3 text-text-3" strokeWidth={1.5} aria-hidden />
                      <span className="meta-label !text-[9px]">Suggested</span>
                      {active.hashtags.map((h) => (
                        <button
                          key={h}
                          onClick={() => updateDraft(active.id, `${active.body.trimEnd()} ${h}`)}
                          className="btn-tactile rounded-full border border-line-strong px-2 py-0.5 text-[10px] text-text-2 hover:border-accent/50 hover:text-accent"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <PreviewCard draft={active} />
              )}

              {/* Reviewer note (rendered — previously stored but never shown) */}
              {active.reviewNote && (
                <p className="rounded-lg border border-sunrise/40 bg-sunrise-dim px-3.5 py-2.5 text-xs text-sunrise" role="status">
                  <span className="font-semibold">Reviewer:</span> {active.reviewNote}
                </p>
              )}

              {/* Provenance strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-line bg-surface px-5 py-3.5 text-[11px] text-text-3">
                <span className="flex items-center gap-1.5">
                  <History className="size-3.5" strokeWidth={1.5} aria-hidden />
                  Source: {DISSEM_SOURCE.fileName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5" strokeWidth={1.5} aria-hidden />
                  {DISSEM_TEAM.promptVersion}
                </span>
                <span>{DISSEM_TEAM.model}</span>
                {active.edited && <span className="font-semibold text-sunrise">edited by reviewer</span>}
                {active.notes && <span className="basis-full text-text-2">Note: {active.notes}</span>}
              </div>

              {/* Approval bar */}
              {active.status !== "published" ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line-strong bg-surface-2 p-4">
                  <span className="meta-label">Approval · {DISSEM_TEAM.approver}</span>
                  <div className="ml-auto flex flex-wrap items-center gap-2">
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Review note (optional)"
                      className="h-10 w-56 rounded-lg border border-line-strong bg-bg px-3 text-xs text-text outline-none placeholder:text-text-3 focus:border-accent/60"
                      aria-label="Review note"
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setStatus(active.id, "changes-requested", note || "Revise for tone.");
                        setNote("");
                      }}
                    >
                      <MessageSquareWarning className="size-4" strokeWidth={1.5} aria-hidden />
                      Request changes
                    </Button>
                    <Button onClick={() => setStatus(active.id, "approved")}>
                      <Check className="size-4" strokeWidth={1.5} aria-hidden />
                      Approve
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent-dim p-4 text-sm font-semibold text-accent">
                  <CheckCircle2 className="size-4" strokeWidth={1.5} aria-hidden />
                  Published to the dissemination ledger with full provenance — the audit trail records who, when and what changed.
                </div>
              )}
            </div>
          )}

          {/* Content calendar */}
          {calendar.length > 0 && (
            <section aria-label="Content calendar" className="rounded-xl border border-line bg-surface p-5">
              <h3 className="meta-label mb-3 flex items-center gap-1.5">
                <CalendarDays className="size-3.5" strokeWidth={1.5} aria-hidden />
                Content calendar
              </h3>
              <ol className="flex flex-col gap-2">
                {calendar.map(([day, list]) => (
                  <li key={day} className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="numeral w-28 shrink-0 text-xs text-text-2">{day}</span>
                    <span className="flex flex-wrap gap-1.5">
                      {list.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setActiveId(d.id)}
                          className={cn(
                            "btn-tactile rounded-full border px-2.5 py-0.5 text-[11px]",
                            d.status === "published"
                              ? "border-violet/50 text-violet"
                              : d.status === "approved"
                                ? "border-accent/50 text-accent"
                                : "border-line-strong text-text-3",
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      )}

      {/* Publish / export bar */}
      {phase === "review" && drafts.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-5">
          <p className="max-w-[52ch] text-xs text-text-3">
            Publishing requires at least one approved draft. Approved drafts enter the dissemination ledger — the
            admin dashboard metric updates live — and every action is written to the audit trail.
          </p>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportZip}>
              <Package className="size-4" strokeWidth={1.5} aria-hidden />
              .zip pack
            </Button>
            <Button variant="secondary" onClick={exportJson}>
              <FileCode2 className="size-4" strokeWidth={1.5} aria-hidden />
              JSON
            </Button>
            <Button variant="secondary" onClick={exportCsv}>
              <FileSpreadsheet className="size-4" strokeWidth={1.5} aria-hidden />
              CSV
            </Button>
            <Button disabled={approvedCount === 0} onClick={publishApproved}>
              <Send className="size-4" strokeWidth={1.5} aria-hidden />
              Publish approved ({approvedCount})
            </Button>
          </div>
        </div>
      )}

      {phase === "published" && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-accent/40 bg-accent-dim p-5">
          <Globe2 className="size-5 text-accent" strokeWidth={1.5} aria-hidden />
          <p className="text-sm font-semibold text-text">{publishedCount} channel drafts published to the ledger.</p>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportZip}>
              <Download className="size-4" strokeWidth={1.5} aria-hidden />
              Download pack
            </Button>
            <Button onClick={runPipeline}>
              <FileUp className="size-4" strokeWidth={1.5} aria-hidden />
              Process another report
            </Button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {phase === "published" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs leading-relaxed text-text-3"
          >
            In production, publishing pushes to the Newsroom queue, posts via platform adapters, and archives the
            draft — with reviewer identity and prompt version in the audit trail. See{" "}
            <Link href="/newsroom" className="link-line text-accent">
              the Newsroom
            </Link>{" "}
            for the public face of this workflow.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Styled mock embeds per platform — previews, not real network calls. */
function PreviewCard({ draft }: { draft: DraftState }) {
  const trimmed = draft.body.length > 400 ? `${draft.body.slice(0, 400)}…` : draft.body;
  const shell = "rounded-xl border border-line-strong bg-surface p-5 text-[13.5px] leading-relaxed text-text-2";
  switch (draft.id) {
    case "x-thread":
      return (
        <div className={cn(shell, "max-w-lg")} dir={draft.hindi ? "auto" : undefined}>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-violet-dim text-xs font-bold text-violet">N</span>
            <div>
              <p className="text-sm font-bold text-text">NCPOR India <span className="text-text-3">· demo</span></p>
              <p className="text-[11px] text-text-3">@ncpor_india · now</p>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap">{trimmed}</p>
          <p className="mt-3 flex items-center gap-3 text-[11px] text-text-3">
            <AtSign className="size-3.5" strokeWidth={1.5} aria-hidden /> Reply · Repost · Like
          </p>
        </div>
      );
    case "instagram":
      return (
        <div className="max-w-sm overflow-hidden rounded-xl border border-line-strong bg-surface">
          <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-accent-dim via-surface-2 to-violet-dim text-6xl" aria-hidden>
            ❄
          </div>
          <p className="whitespace-pre-wrap px-4 py-3 text-[13px] leading-relaxed text-text-2">{trimmed}</p>
        </div>
      );
    case "linkedin":
      return (
        <div className={shell}>
          <p className="text-sm font-bold text-text">National Centre for Polar and Ocean Research <span className="text-[11px] font-normal text-text-3">· demo</span></p>
          <p className="mt-3 whitespace-pre-wrap">{trimmed}</p>
        </div>
      );
    case "newsletter":
      return (
        <div className="max-w-lg overflow-hidden rounded-xl border border-line-strong">
          <p className="bg-violet px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white">The Ice Report · demo</p>
          <p className="whitespace-pre-wrap bg-surface p-5 text-[13.5px] leading-relaxed text-text-2">{trimmed}</p>
        </div>
      );
    case "hindi-press":
      return (
        <div className={cn(shell, "font-hindi")} dir="auto">
          <p className="meta-label !text-[9px]">प्रेस विज्ञप्ति · डेमो</p>
          <p className="mt-2 whitespace-pre-wrap">{trimmed}</p>
        </div>
      );
    case "alt-text":
      return (
        <div className={shell}>
          <p className="meta-label mb-2 !text-[9px]">Alt-text previews · accessibility</p>
          <p className="whitespace-pre-wrap">{trimmed}</p>
        </div>
      );
    default:
      return (
        <div className={shell}>
          <p className="meta-label mb-2 !text-[9px]">Press release · media kit</p>
          <p className="whitespace-pre-wrap">{trimmed}</p>
        </div>
      );
  }
}

function StatusDot({ status }: { status: DraftState["status"] }) {
  const map: Record<DraftState["status"], { cls: string; title: string }> = {
    draft: { cls: "bg-text-3", title: "Draft" },
    approved: { cls: "bg-accent", title: "Approved" },
    "changes-requested": { cls: "bg-sunrise", title: "Changes requested" },
    published: { cls: "bg-violet", title: "Published" },
  };
  const { cls, title } = map[status];
  return <span className={cn("size-2 shrink-0 rounded-full", cls)} title={title} aria-label={title} />;
}

function ConfidenceChip({ level }: { level: ChannelDraft["confidence"] }) {
  const map = {
    high: "border-accent/40 bg-accent-dim text-accent",
    medium: "border-line-strong text-text-2",
    review: "border-sunrise/40 bg-sunrise-dim text-sunrise",
  } as const;
  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-medium", map[level])}>
      {level === "review" ? "needs human review" : `${level} confidence`}
    </span>
  );
}
