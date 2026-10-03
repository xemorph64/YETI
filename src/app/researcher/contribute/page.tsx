"use client";

import { useState } from "react";
import { FileUp, Send } from "lucide-react";
import { submissionsApi, useStoreSnapshot } from "@/lib/api/client";
import { useToast } from "@/components/workspace/Toasts";
import type { RecordKind } from "@/lib/api/types";

const KINDS: RecordKind[] = ["dataset", "publication", "report", "photograph", "video", "activity"];

const STATUS_STYLE: Record<string, string> = {
  PENDING: "text-sunrise border-sunrise/50 bg-sunrise-dim",
  UNDER_REVIEW: "text-sunrise border-sunrise/50 bg-sunrise-dim",
  APPROVED: "text-accent border-accent/50 bg-accent-dim",
  REJECTED: "text-danger border-danger/50 bg-danger/10",
  REVISION_REQUESTED: "text-violet border-violet/50 bg-violet-dim",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  REVISION_REQUESTED: "Changes requested",
};

export default function ContributePage() {
  const submissions = useStoreSnapshot((s) => s.submissions);
  const [kind, setKind] = useState<RecordKind>("dataset");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [licence, setLicence] = useState("CC BY 4.0");
  const [link, setLink] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const { push } = useToast();

  const submit = async () => {
    if (!title.trim() || !description.trim()) return;
    const sub = await submissionsApi.create({
      submitter: "Demo researcher (you)",
      role: "researcher",
      kind,
      title: title.trim(),
      description: description.trim(),
      rights: "Creator retains copyright",
      licence,
      link: link.trim() || undefined,
    });
    setSent(sub.id);
    push({
      kind: "success",
      title: `Submitted as ${sub.id}`,
      body: "It is now in the NCPOR review queue — track the decision in the panel beside.",
    });
    setTitle("");
    setDescription("");
    setLink("");
    setTimeout(() => setSent(null), 6000);
  };

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-text md:text-[28px]">Put your work in the review queue.</h1>
        <p className="mt-1.5 max-w-[68ch] text-sm leading-relaxed text-text-2">
          YETI never publishes scientific content without human review. Your submission lands in the NCPOR
          knowledge-management queue with full metadata and rights — a scientific reviewer approves it, requests
          changes, or rejects it, and the decision is audited.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-xl border border-line bg-surface p-6" aria-label="Submission form">
          <h2 className="meta-label mb-4">New submission</h2>
          <div className="flex flex-col gap-3.5">
            <label className="flex flex-col gap-1.5 text-sm text-text-2">
              Resource type
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as RecordKind)}
                className="h-10 rounded-lg border border-line-strong bg-surface-2 px-3 text-sm text-text outline-none focus:border-accent/60"
              >
                {KINDS.map((k) => (
                  <option key={k} value={k} className="capitalize">{k}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-text-2">
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Snow-pit stratigraphy supplement, 2023 season"
                className="h-10 rounded-lg border border-line-strong bg-surface-2 px-3 text-sm text-text outline-none placeholder:text-text-3 focus:border-accent/60"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-text-2">
              Description & method
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is it, how was it produced, which expedition/station does it belong to?"
                className="h-24 resize-none rounded-lg border border-line-strong bg-surface-2 px-3 py-2.5 text-sm text-text outline-none placeholder:text-text-3 focus:border-accent/60"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-sm text-text-2">
                Proposed licence
                <select
                  value={licence}
                  onChange={(e) => setLicence(e.target.value)}
                  className="h-10 rounded-lg border border-line-strong bg-surface-2 px-3 text-sm text-text outline-none focus:border-accent/60"
                >
                  <option>CC BY 4.0</option>
                  <option>CC BY-SA 4.0</option>
                  <option>Government open access</option>
                  <option>Copyright — permission requested</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-text-2">
                Link (optional)
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="DOI / repository URL"
                  className="h-10 rounded-lg border border-line-strong bg-surface-2 px-3 text-sm text-text outline-none placeholder:text-text-3 focus:border-accent/60"
                />
              </label>
            </div>
            <button
              onClick={submit}
              disabled={!title.trim() || !description.trim()}
              className="btn-tactile mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-accent-fill px-4 py-3 text-sm font-semibold text-accent-ink disabled:opacity-40"
            >
              <Send className="size-4" strokeWidth={1.5} aria-hidden /> Submit for scientific review
            </button>
            {sent && (
              <p className="rounded-lg border border-accent/40 bg-accent-dim px-3.5 py-2.5 text-sm text-accent" role="status">
                Submitted as <span className="numeral font-semibold">{sent}</span> — it is now visible in the NCPOR admin review queue.
              </p>
            )}
            <p className="flex items-start gap-2 text-[11px] leading-relaxed text-text-3">
              <FileUp className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
              File upload is wired for the production ingestion API (checksum → malware scan → OCR → extraction);
              this demo submits metadata only.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3" aria-label="Submission status">
          <h2 className="meta-label">Your submissions & decisions</h2>
          {submissions.length === 0 && (
            <p className="rounded-lg border border-dashed border-line-strong px-4 py-8 text-center text-sm text-text-3">
              Nothing submitted yet.
            </p>
          )}
          {submissions.map((s) => (
            <article key={s.id} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="meta-label !text-[9px]">{s.id} · {s.kind} · {s.submittedAt}</p>
                  <h3 className="mt-1 text-sm font-semibold leading-snug text-text">{s.title}</h3>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${STATUS_STYLE[s.status]}`}>
                  {STATUS_LABEL[s.status]}
                </span>
              </div>
              {s.reviewerNote && (
                <p className="mt-2 rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs leading-relaxed text-text-2">
                  <span className="font-semibold text-text">Reviewer:</span> {s.reviewerNote}
                </p>
              )}
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
