"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import { generateSeries } from "@/lib/series";
import type { Dataset } from "@/lib/types";

/** Client-side download of the synthetic preview series as CSV — clearly labelled. */
export function DemoDownload({ dataset }: { dataset: Dataset }) {
  const csv = useMemo(() => {
    const s = generateSeries(dataset.seed, 48, 0, 1, 0.02);
    const lines = [
      `# ${dataset.title}`,
      `# SYNTHETIC DEMONSTRATION DATA — generated in-browser from seed ${dataset.seed}. Not observations.`,
      `index,${dataset.variables.map((v) => v.code).join(",")}`,
      ...s.map((v, i) => `${i},${v.toFixed(3)}`),
    ].join("\n");
    return lines;
  }, [dataset]);

  const download = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dataset.slug}-SYNTHETIC-DEMO.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={download}
      className="btn-tactile inline-flex items-center gap-2 rounded-md bg-accent-fill px-4 py-2.5 text-sm font-semibold text-accent-ink"
    >
      <Download className="size-4" strokeWidth={1.5} aria-hidden />
      Download preview series (CSV · synthetic)
    </button>
  );
}
