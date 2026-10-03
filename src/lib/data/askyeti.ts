import type { AskEntry } from "@/lib/types";

/* Ask Yeti — a demo retrieval assistant grounded ONLY in this archive.
   No citation, no answer: if no entry matches, it says so. */

export const ASK_ENTRIES: AskEntry[] = [
  {
    id: "q-expeditions",
    patterns: ["how many expeditions", "expeditions completed", "how many antarctic expeditions", "number of expeditions"],
    answer:
      "India has completed 40+ Antarctic expeditions since 1981–82, annual Arctic campaigns since 2007, and regular Southern Ocean research cruises. The archive here seeds 44 Antarctic expedition records (1st–44th) plus Arctic and Southern Ocean series — flagged as verified milestones or demonstration records on each entry.",
    sources: [
      { label: "Expeditions index", href: "/expeditions" },
      { label: "45 Years in Motion", href: "/#years" },
    ],
    related: [
      { label: "First expedition (1981–82)", href: "/expeditions/EXP-01" },
      { label: "Atlas", href: "/atlas" },
    ],
  },
  {
    id: "q-maitri",
    patterns: ["maitri", "when was maitri", "maitri commissioned", "maitri station"],
    answer:
      "Maitri — commissioned in 1989 — is India's permanent inland Antarctic station in the Schirmacher Oasis, Queen Maud Land, at roughly 70°45′S 11°43′E. It succeeded Dakshin Gangotri after the moving ice shelf began burying the first station.",
    sources: [
      { label: "Station record: Maitri", href: "/stations/maitri" },
      { label: "Story: The Station That Sank", href: "/stories/the-station-that-sank" },
    ],
    related: [{ label: "Expedition: 9th (1989–90)", href: "/expeditions/EXP-09" }],
    evidence: {
      section: "Station record — Overview ¶1",
      quote:
        "Maitri — commissioned in 1989 — is India's permanent inland Antarctic station in the Schirmacher Oasis, Queen Maud Land.",
    },
  },
  {
    id: "q-dakshin",
    patterns: ["dakshin gangotri", "first station", "buried station", "what happened to dakshin"],
    answer:
      "Dakshin Gangotri, established in 1983 during the 3rd expedition on the Princess Astrid Coast ice shelf, was India's first Antarctic station. Accumulating snow gradually buried it; it was decommissioned in 1990 and is today a recognised historic site under the Antarctic Treaty system. The lesson — build on rock — shaped the siting of Maitri and Bharati.",
    sources: [
      { label: "Station record: Dakshin Gangotri", href: "/stations/dakshin-gangotri" },
      { label: "Story: The Station That Sank", href: "/stories/the-station-that-sank" },
    ],
    related: [{ label: "Expedition: 3rd (1983–84)", href: "/expeditions/EXP-03" }],
  },
  {
    id: "q-bharati",
    patterns: ["bharati", "where is bharati", "larsemann"],
    answer:
      "Bharati is India's youngest Antarctic station, commissioned in 2012 at the Larsemann Hills on Prydz Bay (≈69°24′S 76°11′E). Built on rock and looking out over the bay, its science front line is oceanography, geosciences and coastal ecosystems.",
    sources: [{ label: "Station record: Bharati", href: "/stations/bharati" }],
    related: [
      { label: "Dataset: Prydz Bay CTD profiles", href: "/vault/datasets/prydz-bay-ctd" },
      { label: "Expedition: 31st (2011–12)", href: "/expeditions/EXP-31" },
    ],
  },
  {
    id: "q-himadri",
    patterns: ["arctic station", "himadri", "ny-alesund", "svalbard", "north pole station"],
    answer:
      "Himadri, established in 2008 at Ny-Ålesund, Svalbard (≈79°N), is India's Arctic station. India's first Arctic expedition reached Ny-Ålesund in 2007; since then campaigns have spanned glaciology, fjord oceanography (including the IndARC mooring) and atmospheric science.",
    sources: [
      { label: "Station record: Himadri", href: "/stations/himadri" },
      { label: "Dataset: IndARC mooring series", href: "/vault/datasets/indarc-mooring-temperature" },
    ],
    related: [{ label: "First Arctic expedition", href: "/expeditions/ARC-01" }],
  },
  {
    id: "q-datasets",
    patterns: ["datasets", "data available", "what data", "download data", "vault"],
    answer:
      "The Vault currently demonstrates 12 datasets across glaciology, oceanography, atmospheric sciences, polar biology and human physiology — each with metadata, licence, version, preview charts and citation hooks. Important: all values are synthetic demonstration records; official Indian polar data must be accessed through NCPOR.",
    sources: [
      { label: "The Vault", href: "/vault" },
      { label: "Schirmacher SMB transects", href: "/vault/datasets/schirmacher-smb-transects" },
    ],
    related: [{ label: "Publication shelf", href: "/vault#publications" }],
  },
  {
    id: "q-act",
    patterns: ["antarctic act", "indian antarctic act", "law", "treaty", "governance"],
    answer:
      "The Indian Antarctic Act, 2022 is India's domestic law governing Antarctic activities — environmental protection, permits and accountability — giving statutory form to commitments under the Antarctic Treaty system, which India joined as a consultative party in 1983.",
    sources: [
      { label: "Newsroom: Act receives assent", href: "/newsroom" },
      { label: "45 Years in Motion", href: "/#years" },
    ],
  },
  {
    id: "q-first",
    patterns: ["first expedition", "qasim", "1981", "who led"],
    answer:
      "The first Indian Antarctic Expedition (1981–82) was led by Dr. S.Z. Qasim. The 21-member team landed on the ice shelf off Queen Maud Land — the founding act of the programme. Names of subsequent team members are intentionally not seeded in this demo archive; official rosters live with NCPOR.",
    sources: [
      { label: "Expedition: 1st (1981–82)", href: "/expeditions/EXP-01" },
      { label: "Data honesty note", href: "/about#honesty" },
    ],
  },
  {
    id: "q-ncpor",
    patterns: ["ncpor", "who runs", "institution", "ministry", "moes"],
    answer:
      "NCPOR — the National Centre for Polar and Ocean Research, under the Ministry of Earth Sciences, based in Goa — operates India's polar and Southern Ocean programmes, including the Antarctic stations, the Arctic station Himadri, and the research vessels that reach them.",
    sources: [{ label: "About", href: "/about" }],
    related: [{ label: "45 Years in Motion", href: "/#years" }],
  },
];

export function retrieve(query: string): AskEntry | null {
  const q = query.toLowerCase();
  let best: { entry: AskEntry; score: number } | null = null;
  for (const entry of ASK_ENTRIES) {
    for (const p of entry.patterns) {
      if (q.includes(p)) {
        const score = p.length;
        if (!best || score > best.score) best = { entry, score };
      }
    }
  }
  return best?.entry ?? null;
}

export const ASK_SUGGESTIONS = [
  "What happened to Dakshin Gangotri?",
  "When was Maitri commissioned?",
  "Which station is in the Arctic?",
  "What datasets are available?",
  "Who led the first expedition?",
];
