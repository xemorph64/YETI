import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The record's data journey — the ingestion→review→discovery loop made
 * visible on every record page. Steps derive from the record's metadata;
 * the future backend returns the same shape.
 */

interface JourneyStep {
  label: string;
  detail: string;
  done: boolean;
}

export function DataJourney({
  origin,
  reviewStatus,
  version,
  accessLevel,
}: {
  origin?: { channel: string; label: string; ingestedAt: string; method: string };
  reviewStatus: string;
  version: string;
  accessLevel: string;
}) {
  const steps: JourneyStep[] = [
    {
      label: "Source identified",
      detail: origin ? `${origin.label} · ${origin.channel.replace(/-/g, " ")}` : "Programme records",
      done: true,
    },
    {
      label: "Ingested",
      detail: origin
        ? `${origin.ingestedAt} · ${origin.method === "ocr" ? "OCR pipeline" : origin.method === "digital-pdf" ? "digital PDF extraction" : origin.method}`
        : "Demonstration ingest",
      done: true,
    },
    { label: "Metadata extracted & corrected", detail: "Schema-complete · curator-corrected (demo)", done: true },
    { label: "Duplicate check", detail: "SHA-256 + near-duplicate scan · no conflict", done: true },
    {
      label: "Scientific review",
      detail:
        reviewStatus === "APPROVED"
          ? "Approved by NCPOR knowledge management (demo)"
          : reviewStatus.replace(/_/g, " ").toLowerCase(),
      done: reviewStatus === "APPROVED",
    },
    { label: "Discoverable", detail: `Public ${accessLevel.toLowerCase()} access · ${version}`, done: reviewStatus === "APPROVED" },
  ];

  return (
    <section aria-label="Data journey for this record" className="rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="meta-label">Data journey — from scattered source to one window</h2>
        <span className="meta-label !text-[9px]">demo trail</span>
      </div>
      <ol className="px-5 py-4">
        {steps.map((s, i) => (
          <li key={s.label} className="relative flex gap-4 pb-5 last:pb-0">
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn("absolute left-[9px] top-5 h-full w-px", s.done ? "bg-accent/50" : "bg-line-strong")}
              />
            )}
            <span
              className={cn(
                "relative z-10 mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border",
                s.done ? "border-accent bg-accent-dim text-accent" : "border-line-strong bg-surface-2 text-text-3",
              )}
              aria-hidden
            >
              {s.done ? <Check className="size-3" strokeWidth={2.5} /> : <span className="size-1.5 rounded-full bg-current" />}
            </span>
            <div className="min-w-0">
              <p className={cn("text-sm font-semibold leading-snug", s.done ? "text-text" : "text-text-3")}>{s.label}</p>
              <p className="numeral mt-0.5 text-[11px] capitalize text-text-3">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
