export type Provenance = "verified" | "demo" | "synthetic" | "third-party";

export type Region = "Antarctic" | "Arctic" | "Southern Ocean";

export interface Expedition {
  id: string;
  number: number;
  ordinal: string;
  programme: "Antarctic" | "Arctic" | "Southern Ocean";
  season: string;
  startYear: number;
  endYear: number;
  region: string;
  vessel?: string;
  leader?: string;
  objectives: string[];
  summary: string;
  stationIds?: string[];
  cover: string;
  status: "completed" | "in-legacy";
  provenance: Provenance;
  milestone?: string;
}

export interface Station {
  id: string;
  slug: string;
  name: string;
  namesake?: string;
  lat: number;
  lng: number;
  region: Region;
  location: string;
  established: number;
  decommissioned?: number;
  status: "active" | "heritage";
  altitudeM?: number;
  complement?: { summer: string; winter: string };
  scienceDomains: string[];
  facts: { label: string; value: string }[];
  summary: string[];
  history: { year: string; text: string }[];
  cover: string;
  provenance: Provenance;
}

export interface DatasetVariable {
  code: string;
  label: string;
  unit: string;
}

export interface Dataset {
  id: string;
  slug: string;
  title: string;
  domain:
    | "Glaciology"
    | "Oceanography"
    | "Atmospheric sciences"
    | "Polar biology"
    | "Human physiology";
  region: Region;
  stationId?: string;
  expeditionId?: string;
  temporal: { from: number; to: number };
  bbox: [number, number, number, number]; // [W, S, E, N]
  variables: DatasetVariable[];
  licence: string;
  version: string;
  doiStatus: string;
  formats: string[];
  sizeMb: number;
  abstract: string[];
  seed: number;
  provenance: Provenance;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  type: "Journal article" | "Review" | "Data descriptor" | "Thesis";
  abstract: string;
  doi?: string;
  provenance: Provenance;
}

export interface ReportDoc {
  id: string;
  title: string;
  expeditionId?: string;
  year: number;
  pages: number;
  sizeMb: number;
  parsed: boolean;
  provenance: Provenance;
}

export interface MediaAsset {
  id: string;
  slug: string;
  src: string;
  w: number;
  h: number;
  type: "photo" | "panorama";
  subject:
    | "Landscape"
    | "Wildlife"
    | "Aurora"
    | "Stations"
    | "Science operations"
    | "Vessels & aircraft"
    | "Sea ice";
  title: string;
  alt: string;
  credit: string;
  license: string;
  source: string;
  stationId?: string;
  expeditionId?: string;
  year?: string;
  provenance: Provenance;
}

export interface StoryChapter {
  id: string;
  kicker: string;
  title: string;
  paragraphs: string[];
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
  align?: "left" | "right" | "center";
  chart?: {
    caption: string;
    unit: string;
    label: string;
    series: number[];
    highlight?: string;
  };
  quote?: { text: string; attribution: string; note?: string };
  records?: { label: string; href: string }[];
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  standfirst: string;
  readingTime: string;
  chapterCount: number;
  cover: string;
  coverAlt: string;
  coverCredit: string;
  provenance: Provenance;
  chapters: StoryChapter[];
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  blocks: { heading?: string; text: string }[];
}

export interface LearnModule {
  id: string;
  title: string;
  badge: { id: string; name: string; description: string; icon: string };
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

export interface LearnPath {
  id: string;
  title: string;
  audience: string;
  classRange: string;
  theme: string;
  minutes: number;
  summary: string;
  cover: string;
  coverCredit: string;
  provenance: Provenance;
  modules: LearnModule[];
}

export interface NewsItem {
  id: string;
  date: string;
  category: "News" | "Press release" | "Archive note";
  title: string;
  excerpt: string;
  body: string[];
  workflow: { draftedBy: string; reviewedBy: string; approvedBy: string; status: "approved" };
  provenance: Provenance;
}

export interface AskEntry {
  id: string;
  patterns: string[];
  answer: string;
  /** Localized answer variants — scientific terms stay untranslated (§56). */
  answerHi?: string;
  answerBn?: string;
  sources: { label: string; href: string }[];
  related?: { label: string; href: string }[];
  /** Supporting passage drawn from the cited archive record (demo of RAG evidence). */
  evidence?: { section: string; quote: string };
  /** Page-area tags ("stations", "expeditions", …) for a small context boost. */
  ctx?: string[];
}

export type ChannelId =
  | "press-release"
  | "x-thread"
  | "instagram"
  | "linkedin"
  | "newsletter"
  | "hindi-press"
  | "alt-text";

export interface ChannelDraft {
  id: ChannelId;
  label: string;
  platform: string;
  body: string;
  hindi?: boolean;
  confidence: "high" | "medium" | "review";
  notes?: string;
  /** Platform character cap for the live counter (undefined = no hard cap). */
  charLimit?: number;
  /** Suggested hashtags the editor can append with one click. */
  hashtags?: string[];
  /** Days from approval to the suggested calendar slot. */
  scheduleHintDays?: number;
}
