"use client";

import { useState } from "react";
import { CheckCircle2, FileSearch, Fingerprint, ScanText, Upload } from "lucide-react";
import { Kicker } from "@/components/ui/primitives";
import { logAudit } from "@/lib/api/store";
import { cn } from "@/lib/utils";

/**
 * Upload Centre — the documented ingestion pipeline, simulated.
 * UPLOAD → FILE VALIDATION → CHECKSUM → OCR/EXTRACTION → METADATA
 * EXTRACTION → ENTITY LINKING → DUPLICATE CHECK → ADMIN CORRECTION → REVIEW.
 * Files never leave the browser in this build; the step timing and the
 * correction surface mirror the production workflow.
 */

type StepState = "waiting" | "running" | "done" | "alert";

const STEPS: { id: string; label: string; detail: string; ms: number }[] = [
  { id: "validate", label: "File validation", detail: "PDF/DOCX · 4.2 MB · malware scan clean", ms: 900 },
  { id: "checksum", label: "Checksum", detail: "SHA-256 a3f9c41e77b2…", ms: 700 },
  { id: "extract", label: "Text extraction", detail: "PyMuPDF digital layer · 132 pages", ms: 1100 },
  { id: "ocr", label: "OCR", detail: "8 scanned figure pages → Tesseract", ms: 1300 },
  { id: "metadata", label: "Metadata extraction", detail: "title, year, expedition, station, themes", ms: 1000 },
  { id: "entities", label: "Entity linking", detail: "linked to 41st Expedition · Maitri · 3 themes", ms: 900 },
  { id: "dedup", label: "Duplicate check", detail: "SHA-256 exact: none · near-duplicate: 1 candidate", ms: 1000 },
];

interface Extracted {
  title: string;
  authors: string;
  year: string;
  expedition: string;
  station: string;
  themes: string;
}

const SUGGESTED: Extracted = {
  title: "41st Indian Antarctic Expedition — glaciology field report (demo ingest)",
  authors: "Expedition glaciology team (extracted)",
  year: "2022",
  expedition: "41st",
  station: "Maitri",
  themes: "Glaciology, Atmospheric sciences",
};

export default function IngestionPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [stepStates, setStepStates] = useState<StepState[]>(STEPS.map(() => "waiting"));
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [meta, setMeta] = useState<Extracted | null>(null);
  const [edited, setEdited] = useState(false);
  const [dedupOpen, setDedupOpen] = useState(false);

  const start = () => {
    const name = fileName ?? "41st-ief-glaciology-report.pdf";
    setFileName(name);
    setRunning(true);
    setDone(false);
    setDedupOpen(false);
    setStepStates(STEPS.map(() => "waiting"));

    let acc = 0;
    STEPS.forEach((step, i) => {
      acc += step.ms;
      setTimeout(() => {
        setStepStates((prev) => {
          const next = [...prev];
          if (i > 0) next[i - 1] = "done";
          next[i] = i === STEPS.length - 1 ? "done" : "running";
          return next;
        });
        if (i === STEPS.length - 1) {
          setMeta({ ...SUGGESTED, title: SUGGESTED.title.replace("(demo ingest)", `(${name})`) });
          setDone(true);
          setRunning(false);
          setDedupOpen(true);
          logAudit({
            actor: "ingestion pipeline (demo)",
            action: "upload",
            resource: name,
            note: "Ingested via Upload Centre; near-duplicate candidate flagged for curator review.",
            stateChange: "→ INDEXED (pending metadata correction)",
          });
        }
      }, acc);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <header>
        <Kicker>Upload centre</Kicker>
        <h1 className="display mt-3 text-balance text-4xl font-bold leading-[1.02]">Ingest the scattered corpus.</h1>
        <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-text-2">
          Drop a report and watch the documented pipeline run — validation, checksum, extraction, OCR, metadata
          and entity linking, duplicate detection. Extraction is <strong className="text-text">never silently
          trusted</strong>: you correct it before anything enters review.
        </p>
      </header>

      <section aria-label="Upload" className="rounded-xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center gap-4">
          <label className="btn-tactile inline-flex cursor-pointer items-center gap-2 rounded-md border border-line-strong px-4 py-2.5 text-sm font-semibold text-text-2 hover:text-text">
            <Upload className="size-4" strokeWidth={1.5} aria-hidden />
            {fileName ? "Choose another file" : "Choose a report"}
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? fileName)}
            />
          </label>
          <span className="text-sm text-text-3">{fileName ?? "Demo file: 41st-ief-glaciology-report.pdf (simulated)"}</span>
          <button
            onClick={start}
            disabled={running}
            className="btn-tactile ml-auto inline-flex items-center gap-2 rounded-md bg-accent-fill px-4 py-2.5 text-sm font-semibold text-accent-ink disabled:opacity-40"
          >
            <FileSearch className="size-4" strokeWidth={1.5} aria-hidden />
            {running ? "Processing…" : "Run pipeline"}
          </button>
        </div>

        <ol className="mt-6 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s.id}
              className={cn(
                "rounded-lg border p-3.5 transition-colors",
                stepStates[i] === "done" && "border-accent/40 bg-accent-dim",
                stepStates[i] === "running" && "border-sunrise/50 bg-sunrise-dim",
                stepStates[i] === "waiting" && "border-line bg-surface-2",
              )}
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-text">
                {stepStates[i] === "done" ? (
                  <CheckCircle2 className="size-4 text-accent" strokeWidth={1.5} aria-hidden />
                ) : stepStates[i] === "running" ? (
                  <ScanText className="size-4 animate-pulse text-sunrise" strokeWidth={1.5} aria-hidden />
                ) : (
                  <Fingerprint className="size-4 text-text-3" strokeWidth={1.5} aria-hidden />
                )}
                {s.label}
              </p>
              <p className="numeral mt-1 text-[11px] text-text-3">
                {stepStates[i] === "waiting" ? "waiting" : s.detail}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {done && meta && (
        <section aria-label="Metadata correction" className="rounded-xl border border-line bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="meta-label">AI-extracted metadata — correct before review</h2>
            <span className="meta-label !text-[9px] !text-sunrise">machine-suggested · not authoritative</span>
          </div>
          <div className="mt-4 grid gap-3.5 md:grid-cols-2">
            {(
              [
                ["Title", "title"],
                ["Authors", "authors"],
                ["Year", "year"],
                ["Expedition", "expedition"],
                ["Station", "station"],
                ["Themes", "themes"],
              ] as [string, keyof Extracted][]
            ).map(([label, key]) => (
              <label key={key} className="flex flex-col gap-1.5 text-sm text-text-2">
                {label}
                <input
                  value={meta[key]}
                  onChange={(e) => {
                    setMeta({ ...meta, [key]: e.target.value });
                    setEdited(true);
                  }}
                  className="h-10 rounded-lg border border-line-strong bg-surface-2 px-3 text-sm text-text outline-none focus:border-accent/60"
                />
              </label>
            ))}
          </div>

          {dedupOpen && (
            <div className="mt-5 rounded-lg border border-sunrise/40 bg-sunrise-dim p-4">
              <p className="text-sm font-semibold text-text">Near-duplicate candidate</p>
              <p className="mt-1 text-xs leading-relaxed text-text-2">
                “40th Indian Antarctic Expedition — log &amp; station report” shares 71% title/text similarity
                (SHA-256 differs — not an exact copy). Scientific records are never auto-deleted; a curator
                decides whether this is a new version or a distinct report.
              </p>
              <div className="mt-3 flex gap-2">
                <button className="btn-tactile rounded-md border border-line-strong px-3 py-2 text-xs font-semibold text-text-2 hover:text-text">
                  Mark as new version
                </button>
                <button className="btn-tactile rounded-md border border-line-strong px-3 py-2 text-xs font-semibold text-text-2 hover:text-text">
                  Distinct record
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() =>
              logAudit({
                actor: "knowledge management (demo)",
                action: "metadata-change",
                resource: fileName ?? "41st-ief-glaciology-report.pdf",
                note: edited ? "Curator corrected AI-extracted metadata." : "Metadata confirmed as extracted.",
                stateChange: "→ UNDER REVIEW",
              })
            }
            className="btn-tactile mt-5 inline-flex items-center gap-2 rounded-md bg-accent-fill px-4 py-2.5 text-sm font-semibold text-accent-ink"
          >
            Send to scientific review
          </button>
        </section>
      )}
    </div>
  );
}
