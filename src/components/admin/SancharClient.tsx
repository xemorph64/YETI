"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  CloudUpload,
  Download,
  FileUp,
  Globe2,
  History,
  Loader2,
  MessageSquareWarning,
  Package,
  Send,
  Sparkles,
} from "lucide-react";
import { SANCHAR_DRAFTS, SANCHAR_SOURCE, SANCHAR_STAGES, SANCHAR_TEAM } from "@/lib/data/sanchar";
import type { SancharDraft } from "@/lib/types";
import { Button, ProvenanceChip } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type Phase = "idle" | "processing" | "review" | "published";
type DraftState = SancharDraft & {
  status: "draft" | "approved" | "changes-requested" | "published";
  edited: boolean;
  reviewNote?: string;
};

const STAGE_MS = [700, 1100, 900, 1000, 900, 600];

export function SancharClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stageIdx, setStageIdx] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [drafts, setDrafts] = useState<DraftState[]>([]);
  const [activeId, setActiveId] = useState<SancharDraft["id"]>("press-release");
  const [note, setNote] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runPipeline = useCallback(() => {
    setPhase("processing");
    setStageIdx(0);
    let acc = 0;
    SANCHAR_STAGES.forEach((_, i) => {
      acc += STAGE_MS[i];
      timers.current.push(setTimeout(() => setStageIdx(i + 1), acc));
    });
    timers.current.push(
      setTimeout(() => {
        setDrafts(
          SANCHAR_DRAFTS.map((d) => ({ ...d, status: "draft", edited: false })),
        );
        setActiveId("press-release");
        setPhase("review");
      }, acc + 500),
    );
  }, []);

  const updateDraft = (id: SancharDraft["id"], body: string) =>
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, body, edited: true } : d)));

  const setStatus = (id: SancharDraft["id"], status: DraftState["status"], reviewNote?: string) =>
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, status, reviewNote } : d)));

  const active = drafts.find((d) => d.id === activeId);
  const approvedCount = drafts.filter((d) => d.status === "approved" || d.status === "published").length;

  const exportZip = async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const d of drafts) {
      zip.file(`${d.id}.txt`, `${d.label}\nPlatform: ${d.platform}\nStatus: ${d.status}\nConfidence: ${d.confidence}\n${d.notes ? `Notes: ${d.notes}\n` : ""}\n---\n\n${d.body}`);
    }
    zip.file(
      "PROVENANCE.txt",
      [
        `YETI Sanchar export bundle (demonstration)`,
        `Source document: ${SANCHAR_SOURCE.fileName} — ${SANCHAR_SOURCE.demoNote}`,
        `Prompt/version: ${SANCHAR_TEAM.promptVersion}`,
        `Model: ${SANCHAR_TEAM.model}`,
        `Reviewer: ${SANCHAR_TEAM.reviewer} · Approver: ${SANCHAR_TEAM.approver}`,
        `Exported: ${new Date().toISOString()}`,
      ].join("\n"),
    );
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sanchar-media-pack.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl font-bold">Sanchar Media Engine</h1>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-text-2">
            An editorial production workspace, not a chatbot. One approved document in — a full, reviewable media
            pack out. Every draft carries source, provenance and confidence; nothing publishes itself.
          </p>
        </div>
        <ProvenanceChip p="demo" label="Simulated pipeline — no external AI calls" />
      </header>

      {/* Pipeline stages rail */}
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-label="Pipeline stages">
        {SANCHAR_STAGES.map((s, i) => {
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
            Use the demo report ({SANCHAR_SOURCE.fileName})
          </Button>
          <p className="max-w-[52ch] text-[11px] leading-relaxed text-text-3">{SANCHAR_SOURCE.demoNote}</p>
        </div>
      )}

      {/* PROCESSING */}
      {phase === "processing" && (
        <div className="rounded-2xl border border-line bg-surface p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="size-5 animate-spin text-accent" strokeWidth={1.5} aria-hidden />
            <p className="text-sm font-semibold">Processing {SANCHAR_SOURCE.fileName}…</p>
          </div>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${(stageIdx / SANCHAR_STAGES.length) * 100}%` }}
            />
          </div>
          <ol className="numeral mt-5 flex flex-col gap-1.5 text-[11px] text-text-3">
            {SANCHAR_STAGES.slice(0, stageIdx).map((s) => (
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
                </div>
              </div>

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

              {/* Provenance strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-line bg-surface px-5 py-3.5 text-[11px] text-text-3">
                <span className="flex items-center gap-1.5">
                  <History className="size-3.5" strokeWidth={1.5} aria-hidden />
                  Source: {SANCHAR_SOURCE.fileName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5" strokeWidth={1.5} aria-hidden />
                  {SANCHAR_TEAM.promptVersion}
                </span>
                <span>{SANCHAR_TEAM.model}</span>
                {active.edited && <span className="font-semibold text-sunrise">edited by reviewer</span>}
                {active.notes && <span className="basis-full text-text-2">Note: {active.notes}</span>}
              </div>

              {/* Approval bar */}
              {active.status !== "published" ? (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line-strong bg-surface-2 p-4">
                  <span className="meta-label">Approval · {SANCHAR_TEAM.approver}</span>
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
                  Published to the Newsroom with full provenance. Export carries the audit trail.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Publish / export bar */}
      {phase === "review" && drafts.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-5">
          <p className="text-xs text-text-3">
            Publishing requires at least one approved draft. Publication writes to the Newsroom with the full
            draft → review → approve chain visible to the public — trust as a feature.
          </p>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" onClick={exportZip}>
              <Package className="size-4" strokeWidth={1.5} aria-hidden />
              Export social pack (.zip)
            </Button>
            <Button
              disabled={approvedCount === 0}
              onClick={() => {
                setDrafts((prev) => prev.map((d) => (d.status === "approved" ? { ...d, status: "published" } : d)));
                setPhase("published");
              }}
            >
              <Send className="size-4" strokeWidth={1.5} aria-hidden />
              Publish approved ({approvedCount})
            </Button>
          </div>
        </div>
      )}

      {phase === "published" && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-accent/40 bg-accent-dim p-5">
          <Globe2 className="size-5 text-accent" strokeWidth={1.5} aria-hidden />
          <p className="text-sm font-semibold text-text">
            {drafts.filter((d) => d.status === "published").length} channel drafts published.
          </p>
          <div className="ml-auto flex gap-2">
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

function ConfidenceChip({ level }: { level: SancharDraft["confidence"] }) {
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
