/**
 * YETI record contracts.
 *
 * These DTOs mirror the documented backend schema (FastAPI + PostgreSQL plan in
 * the YETI core documentation). The frontend service layer (./client.ts) is the
 * ONLY place that touches data today; when the backend lands, each service
 * function swaps its static-data implementation for a fetch to the matching
 * API group without any UI change.
 */

export type AccessClass =
  | "OPEN"
  | "REGISTERED"
  | "RESTRICTED"
  | "EMBARGOED"
  | "INTERNAL"
  | "REMOVED";

export type ReviewStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "REVISION_REQUESTED"
  | "APPROVED"
  | "REJECTED";

export type RecordKind =
  | "report"
  | "dataset"
  | "publication"
  | "photograph"
  | "video"
  | "activity"
  | "learning"
  | "story"
  | "news";

export type Role = "public" | "researcher" | "admin";

export type EntityKind =
  | "expedition"
  | "station"
  | "researcher"
  | "organization"
  | "theme"
  | "report"
  | "dataset"
  | "publication"
  | "photograph"
  | "video"
  | "activity"
  | "learning"
  | "glossary"
  | "story"
  | "news";

/** The common metadata envelope every repository record carries. */
export interface RecordMetadata {
  id: string;
  kind: RecordKind;
  title: string;
  description: string;
  creator: string;
  contributor?: string;
  publisher: string;
  date: string; // ISO
  language: string[]; // ["en", "hi"]
  region?: string;
  station?: string;
  expedition?: string;
  theme?: string[];
  keywords: string[];
  rights: string;
  licence: string;
  accessLevel: AccessClass;
  source: string;
  citation?: string;
  doi?: string;
  version: string;
  reviewStatus: ReviewStatus;
  checksum: string; // demo SHA-256 prefix
  embargoUntil?: string;
  /** Where the record physically came from before ingestion. */
  origin?: {
    channel: "annual-report" | "moes-dataset" | "journal" | "photo-archive" | "film-archive" | "institutional-website" | "field-notes";
    label: string;
    ingestedAt: string;
    method: "digital-pdf" | "ocr" | "manual" | "api" | "media-export";
  };
}

export interface Submission {
  id: string;
  submitter: string;
  role: Role;
  kind: RecordKind;
  title: string;
  description: string;
  rights: string;
  licence: string;
  link?: string;
  submittedAt: string;
  status: ReviewStatus;
  reviewerNote?: string;
  linkedExpedition?: string;
  linkedStation?: string;
  linkedTheme?: string[];
}

export interface AccessRequest {
  id: string;
  recordId: string;
  requester: string;
  role: Role;
  justification: string;
  requestedAt: string;
  status: "PENDING" | "APPROVED" | "DENIED";
  decidedBy?: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  action:
    | "upload"
    | "metadata-change"
    | "review"
    | "approval"
    | "rejection"
    | "ai-generation"
    | "editor-modification"
    | "publication"
    | "access-request"
    | "permission-change"
    | "submission"
    | "collection-change";
  resource: string;
  note: string;
  stateChange?: string;
}

export interface GraphNode {
  id: string;
  kind: EntityKind;
  label: string;
  year?: number;
  meta?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

export interface YetiAnswer {
  answer: string;
  confidence: "grounded" | "partial" | "no-evidence";
  sources: { label: string; href: string; section?: string; why?: string }[];
  related?: { label: string; href: string }[];
}

export interface SearchWhy {
  matchedOn: string;
  score: number;
}
