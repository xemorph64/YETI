import type { RepositoryRecord } from "@/lib/api/client";

/**
 * Citation export — demo-shaped now, backed by /citation?style= later.
 * Formats: BibTeX, RIS, and a plain APA-ish string.
 */

const yearOf = (r: RepositoryRecord) => r.date.slice(0, 4);
const keyOf = (r: RepositoryRecord) =>
  `${r.creator.split(/[,;(]/)[0].trim().split(" ").pop() ?? "ncpor"}${yearOf(r)}${r.kind}`.toLowerCase().replace(/[^a-z0-9]/g, "");

export function bibTeX(r: RepositoryRecord): string {
  const k = keyOf(r);
  const kindMap: Record<string, string> = {
    dataset: "dataset",
    publication: "article",
    report: "techreport",
    photograph: "misc",
    video: "misc",
    story: "misc",
    news: "misc",
    learning: "misc",
    activity: "techreport",
  };
  return [
    `@${kindMap[r.kind] ?? "misc"}{${k},`,
    `  title       = {${r.title}},`,
    `  author      = {${r.creator}},`,
    `  year        = {${yearOf(r)}},`,
    `  publisher   = {${r.publisher}},`,
    r.doi ? `  doi         = {${r.doi}},` : null,
    `  url         = {https://yeti.ncpor.gov.in${r.href} (demo)},`,
    `  note        = {Access level: ${r.accessLevel}. ${r.licence}}`,
    `}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function ris(r: RepositoryRecord): string {
  const k = keyOf(r);
  return [
    "TY  - DATA",
    `TI  - ${r.title}`,
    `AU  - ${r.creator}`,
    `PY  - ${yearOf(r)}`,
    `PB  - ${r.publisher}`,
    r.doi ? `DO  - ${r.doi}` : null,
    `N1  - Access level: ${r.accessLevel}; ${r.licence}`,
    "ER  -",
  ]
    .filter(Boolean)
    .join("\n");
}

export function apa(r: RepositoryRecord): string {
  return `${r.creator} (${yearOf(r)}). ${r.title}. ${r.publisher}. ${r.licence}. Demonstration citation.`;
}

export function downloadText(filename: string, text: string, mime = "text/plain"): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
