import { levenshtein } from "@/lib/utils";
import { EXPEDITIONS } from "@/lib/data/expeditions";
import { STATIONS } from "@/lib/data/stations";
import { DATASETS, PUBLICATIONS, REPORTS } from "@/lib/data/vault";
import { MEDIA } from "@/lib/data/media";
import { STORIES } from "@/lib/data/stories";
import { LEARN_PATHS } from "@/lib/data/learn";
import { NEWS } from "@/lib/data/newsroom";

export interface SearchEntry {
  kind:
    | "Expeditions"
    | "Stations"
    | "Datasets"
    | "Publications"
    | "Reports"
    | "Gallery"
    | "Stories"
    | "Learn"
    | "Newsroom"
    | "Pages";
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
}

let INDEX: SearchEntry[] | null = null;

export function buildIndex(): SearchEntry[] {
  if (INDEX) return INDEX;
  const e: SearchEntry[] = [];
  for (const x of EXPEDITIONS) {
    e.push({
      kind: "Expeditions",
      title: `${x.ordinal} Indian ${x.programme} Expedition`,
      subtitle: `${x.season} · ${x.region}`,
      href: `/expeditions/${x.id}`,
      keywords: `${x.season} ${x.region} ${x.objectives.join(" ")} ${x.vessel ?? ""} ${x.milestone ?? ""}`.toLowerCase(),
    });
  }
  for (const s of STATIONS) {
    e.push({
      kind: "Stations",
      title: s.name,
      subtitle: `${s.location} · est. ${s.established}`,
      href: `/stations/${s.slug}`,
      keywords: `${s.name} ${s.namesake ?? ""} ${s.scienceDomains.join(" ")} ${s.location}`.toLowerCase(),
    });
  }
  for (const d of DATASETS) {
    e.push({
      kind: "Datasets",
      title: d.title,
      subtitle: `${d.domain} · ${d.temporal.from}–${d.temporal.to} · ${d.formats.join(", ")}`,
      href: `/vault/datasets/${d.slug}`,
      keywords: `${d.title} ${d.domain} ${d.region} ${d.variables.map((v) => `${v.code} ${v.label}`).join(" ")}`.toLowerCase(),
    });
  }
  for (const p of PUBLICATIONS) {
    e.push({
      kind: "Publications",
      title: p.title,
      subtitle: `${p.type} · ${p.year}`,
      href: "/vault#publications",
      keywords: `${p.title} ${p.authors} ${p.year}`.toLowerCase(),
    });
  }
  for (const r of REPORTS) {
    e.push({
      kind: "Reports",
      title: r.title,
      subtitle: `${r.year} · ${r.pages} pages`,
      href: "/vault#reports",
      keywords: `${r.title} ${r.year} report`.toLowerCase(),
    });
  }
  for (const m of MEDIA) {
    e.push({
      kind: "Gallery",
      title: m.title,
      subtitle: `${m.subject} · ${m.license}`,
      href: `/gallery?asset=${m.id}`,
      keywords: `${m.title} ${m.subject} ${m.alt}`.toLowerCase(),
    });
  }
  for (const s of STORIES) {
    e.push({
      kind: "Stories",
      title: s.title,
      subtitle: s.standfirst.slice(0, 80) + "…",
      href: `/stories/${s.slug}`,
      keywords: `${s.title} ${s.standfirst}`.toLowerCase(),
    });
  }
  for (const p of LEARN_PATHS) {
    e.push({
      kind: "Learn",
      title: `Polar Gyaan: ${p.title}`,
      subtitle: `${p.classRange} · ${p.minutes} min`,
      href: `/learn/${p.id}`,
      keywords: `${p.title} ${p.theme} ${p.audience} quiz badge certificate`.toLowerCase(),
    });
  }
  for (const n of NEWS) {
    e.push({
      kind: "Newsroom",
      title: n.title,
      subtitle: `${n.date} · ${n.category}`,
      href: "/newsroom",
      keywords: `${n.title} ${n.excerpt}`.toLowerCase(),
    });
  }
  e.push(
    {
      kind: "Pages",
      title: "Expedition Atlas",
      subtitle: "3D globe · every expedition since 1981",
      href: "/atlas",
      keywords: "atlas globe 3d map arcs antarctica arctic explore".toLowerCase(),
    },
    {
      kind: "Pages",
      title: "About YETI & data honesty",
      subtitle: "What is real, what is demo",
      href: "/about",
      keywords: "about provenance honesty demo ncpor moes".toLowerCase(),
    },
    {
      kind: "Pages",
      title: "Sanchar Media Engine",
      subtitle: "Admin · upload → generate → review → publish",
      href: "/admin/sanchar",
      keywords: "sanchar admin media social press release hindi generate".toLowerCase(),
    },
  );
  INDEX = e;
  return e;
}

export function searchAll(query: string, limit = 24): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of buildIndex()) {
    const hay = `${entry.title} ${entry.subtitle} ${entry.keywords}`.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (entry.title.toLowerCase().startsWith(w)) score += 30;
      if (entry.title.toLowerCase().includes(w)) score += 18;
      if (entry.subtitle.toLowerCase().includes(w)) score += 8;
      if (entry.keywords.includes(w)) score += 6;
      // typo tolerance for real words
      if (w.length >= 4) {
        for (const hw of hay.split(/[^a-z0-9]+/)) {
          if (Math.abs(hw.length - w.length) <= 2 && levenshtein(hw, w) <= 2) {
            score += 8;
            break;
          }
        }
      }
    }
    if (score > 0) scored.push({ entry, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entry);
}

export const SEARCH_GROUPS = [
  "Expeditions",
  "Stations",
  "Datasets",
  "Gallery",
  "Stories",
  "Learn",
  "Publications",
  "Reports",
  "Newsroom",
  "Pages",
] as const;
