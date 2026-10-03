"use client";

/**
 * YETI service layer — the ONLY seam between the UI and data.
 *
 * Every function is async and shaped like the documented backend API groups
 * (/records, /search, /graph, /yeti, /submissions, /reviews, /collections,
 * /access-requests, /audit, /ingestion). Today they resolve from static demo
 * data + the localStorage demo store; when the FastAPI backend exists, each
 * body becomes a `fetch(...)` to the matching endpoint and no UI code changes.
 */

import { EXPEDITIONS, getExpedition } from "@/lib/data/expeditions";
import { STORIES } from "@/lib/data/stories";
import { STATIONS } from "@/lib/data/stations";
import { MEDIA } from "@/lib/data/media";
import { NEWS } from "@/lib/data/newsroom";
import { LEARN_PATHS } from "@/lib/data/learn";
import { DATASETS, PUBLICATIONS, REPORTS } from "@/lib/data/vault";
import { logAudit, logQuery, setStore, subscribe, getStore } from "./store";
import type {
  AccessClass,
  AccessRequest,
  AuditEntry,
  GraphEdge,
  GraphNode,
  RecordKind,
  RecordMetadata,
  Role,
  SearchWhy,
  Submission,
  YetiAnswer,
} from "./types";

export type { AccessClass, AccessRequest, AuditEntry, GraphEdge, GraphNode, RecordKind, RecordMetadata, Role, SearchWhy, Submission, YetiAnswer };

/* ------------------------------------------------------------------ */
/* Unified repository view over the static demo corpus                 */
/* ------------------------------------------------------------------ */

export interface RepositoryRecord extends RecordMetadata {
  href: string;
  summary: string;
  thumb?: string;
}

const sha = (s: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0").repeat(2).slice(0, 12);
};

function meta(
  id: string,
  kind: RecordKind,
  over: Partial<RecordMetadata> & { date: string; title: string; creator: string; source: string; licence: string },
): RecordMetadata {
  return {
    id,
    kind,
    description: "",
    publisher: "NCPOR (demonstration record)",
    language: ["en"],
    keywords: [],
    rights: "© MoES / NCPOR — demonstration use",
    accessLevel: "OPEN",
    version: "v1.0",
    reviewStatus: "APPROVED",
    checksum: sha(id),
    ...over,
  };
}

function buildRecords(): RepositoryRecord[] {
  const out: RepositoryRecord[] = [];

  for (const d of DATASETS) {
    out.push({
      ...meta(d.id, "dataset", {
        title: d.title,
        creator: "NCPOR glaciology/oceanography teams (demo)",
        date: `${d.temporal.to}-03-01`,
        licence: d.licence,
        version: d.version,
        source: "NCPOR data centre (demo ingest)",
        expedition: d.stationId ? undefined : undefined,
        station: d.stationId,
        theme: [d.domain],
        region: d.region,
        origin: { channel: "moes-dataset", label: "MoES data catalogue (demo)", ingestedAt: "2026-01-12", method: "api" },
      }),
      href: `/vault/datasets/${d.slug}`,
      summary: d.abstract[0] ?? "",
    });
  }

  for (const p of PUBLICATIONS) {
    out.push({
      ...meta(p.id, "publication", {
        title: p.title,
        creator: p.authors,
        date: `${p.year}-06-01`,
        licence: "Metadata open — text via publisher (demo)",
        source: p.venue ? `Journal feed — ${p.venue} (demo)` : "Publisher feed (demo)",
        doi: p.doi ?? undefined,
        theme: [p.type],
        origin: { channel: "journal", label: "Publisher feed (demo)", ingestedAt: "2026-01-14", method: "api" },
      }),
      href: "/vault#publications",
      summary: p.abstract.slice(0, 140),
    });
  }

  for (const r of REPORTS) {
    out.push({
      ...meta(r.id, "report", {
        title: r.title,
        creator: "Expedition science teams (demo)",
        date: `${r.year}-04-01`,
        licence: "Government open access (demo)",
        source: "NCPOR annual expedition report series (demo)",
        expedition: r.expeditionId,
        origin: {
          channel: "annual-report",
          label: "Scanned expedition report (demo)",
          ingestedAt: "2026-01-08",
          method: r.parsed ? "ocr" : "digital-pdf",
        },
      }),
      href: "/vault#reports",
      summary: r.pages ? `${r.pages} pp · ${r.parsed ? "OCR-parsed" : "digital PDF"}` : "Expedition report",
    });
  }

  for (const m of MEDIA) {
    out.push({
      ...meta(m.id, m.type === "panorama" ? "photograph" : "photograph", {
        title: m.title,
        creator: m.credit,
        date: `${m.year ?? 2022}-01-15`,
        licence: m.license,
        source: m.source,
        station: m.stationId,
        theme: [m.subject],
        origin: { channel: "photo-archive", label: "Media archive export (demo)", ingestedAt: "2026-01-16", method: "media-export" },
      }),
      href: `/gallery?asset=${m.id}`,
      summary: m.alt,
      thumb: m.src,
    });
  }

  for (const s of STORIES) {
    out.push({
      ...meta(`story-${s.slug}`, "story", {
        title: s.title,
        creator: "YETI editorial (demo)",
        date: "2025-11-20",
        licence: "CC BY 4.0 (demo)",
        source: "Composed from approved records (demo)",
        theme: ["Outreach"],
        origin: { channel: "institutional-website", label: "Outreach desk (demo)", ingestedAt: "2025-11-20", method: "manual" },
      }),
      href: `/stories/${s.slug}`,
      summary: s.standfirst,
    });
  }

  for (const n of NEWS) {
    out.push({
      ...meta(`news-${n.id}`, "news", {
        title: n.title,
        creator: "NCPOR communications (demo)",
        date: n.date,
        licence: "Government open access (demo)",
        source: "Programme desk (demonstration item)",
        origin: { channel: "institutional-website", label: "Programme desk (demo)", ingestedAt: n.date, method: "manual" },
      }),
      href: "/newsroom",
      summary: n.excerpt,
    });
  }

  for (const l of LEARN_PATHS) {
    out.push({
      ...meta(`learn-${l.id}`, "learning", {
        title: l.title,
        creator: "YETI education team (demo)",
        date: "2025-12-02",
        licence: "CC BY-SA 4.0 (demo)",
        source: "Curriculum-mapped original material (demo)",
        theme: ["Education", l.theme],
        origin: { channel: "institutional-website", label: "Education desk (demo)", ingestedAt: "2025-12-02", method: "manual" },
      }),
      href: `/learn/${l.id}`,
      summary: l.summary,
    });
  }

  for (const e of EXPEDITIONS) {
    out.push({
      ...meta(`exp-${e.id}`, "activity", {
        title: `Expedition ${e.id} — ${e.programme}`,
        creator: "NCPOR programme office (demo)",
        date: `${e.startYear}-01-01`,
        licence: "Government open access (demo)",
        source: "Expedition programme records (demo)",
        expedition: e.id,
        theme: [e.programme],
        origin: { channel: "annual-report", label: "Programme records (demo)", ingestedAt: "2026-01-05", method: "digital-pdf" },
      }),
      href: `/expeditions/${e.id}`,
      summary: e.summary,
    });
  }

  return out;
}

let recordCache: RepositoryRecord[] | null = null;

/** Demo access restrictions so the governance model is visible end-to-end. */
const ACCESS_OVERRIDES: Record<string, { accessLevel: AccessClass; embargoUntil?: string }> = {
  "ds-03": { accessLevel: "RESTRICTED" },
  "rep-35": { accessLevel: "EMBARGOED", embargoUntil: "2027-04-01" },
};

export function allRecords(): RepositoryRecord[] {
  if (!recordCache) recordCache = buildRecords().map((r) => ({ ...r, ...ACCESS_OVERRIDES[r.id] }));
  return recordCache;
}

/* ------------------------------------------------------------------ */
/* Permission-aware access (demo of the backend RBAC rule)             */
/* ------------------------------------------------------------------ */

export function canAccess(accessLevel: AccessClass, role: Role): boolean {
  switch (accessLevel) {
    case "OPEN":
      return true;
    case "REGISTERED":
    case "RESTRICTED":
    case "EMBARGOED":
      return role === "researcher" || role === "admin";
    case "INTERNAL":
      return role === "admin";
    case "REMOVED":
      return false;
  }
}

/* ------------------------------------------------------------------ */
/* API groups                                                          */
/* ------------------------------------------------------------------ */

const delay = <T,>(v: T, ms = 120): Promise<T> => new Promise((r) => setTimeout(() => r(v), ms));

export const recordsApi = {
  list: async (filter?: { kind?: RecordKind[]; station?: string; expedition?: string }) =>
    delay(allRecords().filter((r) => {
      if (filter?.kind && !filter.kind.includes(r.kind)) return false;
      if (filter?.station && r.station !== filter.station) return false;
      if (filter?.expedition && r.expedition !== filter.expedition) return false;
      return true;
    })),
  get: async (id: string) => delay(allRecords().find((r) => r.id === id) ?? null),
  visibleTo: (role: Role) => allRecords().filter((r) => canAccess(r.accessLevel, role)),
};

export { EXPEDITIONS, STATIONS, STORIES, MEDIA, NEWS, LEARN_PATHS, DATASETS, PUBLICATIONS, REPORTS, getExpedition };

export const searchApi = {
  query: async (q: string, role: Role): Promise<{ results: RepositoryRecord[]; why: Record<string, SearchWhy> }> => {
    const needle = q.trim().toLowerCase();
    const why: Record<string, SearchWhy> = {};
    if (!needle) return delay({ results: [], why });
    const results = allRecords()
      .filter((r) => canAccess(r.accessLevel, role))
      .map((r) => {
        const fields: [string, string][] = [
          ["title", r.title],
          ["summary", r.summary],
          ["theme", (r.theme ?? []).join(" ")],
          ["station", r.station ?? ""],
          ["expedition", r.expedition ?? ""],
        ];
        for (const [field, text] of fields) {
          const i = text.toLowerCase().indexOf(needle);
          if (i >= 0) {
            why[r.id] = { matchedOn: field, score: field === "title" ? 3 : field === "summary" ? 2 : 1 };
            break;
          }
        }
        return r;
      })
      .filter((r) => why[r.id]);
    results.sort((a, b) => (why[b.id]?.score ?? 0) - (why[a.id]?.score ?? 0));
    logQuery(q, results.length);
    return delay({ results, why });
  },
};

/* ---------------------------- Knowledge graph ---------------------- */

export const graphApi = {
  build: async (): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const push = (n: GraphNode) => { if (!nodes.some((x) => x.id === n.id)) nodes.push(n); };
    const link = (source: string, target: string, relation: string) => {
      if (source && target && !edges.some((e) => e.source === source && e.target === target && e.relation === relation))
        edges.push({ source, target, relation });
    };
    // Deterministic seed for demo-only edges (same pairing every render).
    const seed = (s: string) => {
      let h = 2166136261;
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    };

    for (const st of STATIONS) {
      push({ id: `station:${st.id}`, kind: "station", label: st.name, meta: st.location });
    }
    for (const e of EXPEDITIONS) {
      push({ id: `exp:${e.id}`, kind: "expedition", label: `Exp. ${e.id}`, year: e.startYear, meta: e.programme });
      for (const sid of e.stationIds ?? []) link(`exp:${e.id}`, `station:${sid}`, "visited");
      // Objectives are real themes the expedition worked on — theme hubs connect
      // expeditions to the datasets and publications that share the science.
      for (const o of e.objectives ?? []) link(`exp:${e.id}`, `theme:${o}`, "explored");
    }
    for (const d of DATASETS) {
      push({ id: d.id, kind: "dataset", label: d.title, meta: d.domain });
      if (d.stationId) link(d.id, `station:${d.stationId}`, "collected-at");
      if (d.expeditionId) link(d.id, `exp:${d.expeditionId}`, "collected-during");
      push({ id: `theme:${d.domain}`, kind: "theme", label: d.domain });
      link(d.id, `theme:${d.domain}`, "belongs-to");
    }
    for (const p of PUBLICATIONS) {
      push({ id: p.id, kind: "publication", label: p.title, year: p.year, meta: p.type });
      push({ id: `theme:${p.type}`, kind: "theme", label: p.type });
      link(p.id, `theme:${p.type}`, "belongs-to");
    }
    for (const r of REPORTS) {
      push({ id: r.id, kind: "report", label: r.title, year: r.year, meta: "Expedition report" });
      if (r.expeditionId) link(r.id, `exp:${r.expeditionId}`, "documents");
    }
    for (const m of MEDIA) {
      push({ id: m.id, kind: "photograph", label: m.title, year: m.year ? Number(m.year) : undefined, meta: m.subject });
      if (m.stationId) link(m.id, `station:${m.stationId}`, "captured-at");
      if ((m as { expeditionId?: string }).expeditionId) link(m.id, `exp:${(m as { expeditionId?: string }).expeditionId}`, "captured-during");
    }
    // Publications ←→ datasets: the demo corpus has no full-text linkage, so a
    // deterministic ~20% of pairs carry a seeded uses-data edge (labelled demo
    // in the UI legend).
    for (const p of PUBLICATIONS) {
      for (const d of DATASETS) {
        if (seed(`${p.id}→${d.id}`) % 5 === 0) link(p.id, d.id, "uses-data");
      }
    }
    return delay({ nodes: nodes.slice(0, 120), edges });
  },

  /** Neighbourhood to `depth` hops (default 2) with per-node distance. */
  expand: async (id: string, depth = 2) => {
    const { nodes, edges } = await graphApi.build();
    const dist = new Map<string, number>([[id, 0]]);
    let frontier = [id];
    for (let d = 1; d <= depth; d++) {
      const next: string[] = [];
      for (const cur of frontier) {
        for (const e of edges) {
          const other = e.source === cur ? e.target : e.target === cur ? e.source : null;
          if (other && !dist.has(other)) {
            dist.set(other, d);
            next.push(other);
          }
        }
      }
      frontier = next;
    }
    return delay({
      nodes: nodes.filter((n) => dist.has(n.id)),
      edges: edges.filter((e) => dist.has(e.source) && dist.has(e.target)),
      distances: Object.fromEntries(dist),
    });
  },

  /** Shortest connection between two entities — BFS over the full graph. */
  path: async (a: string, b: string) => {
    if (a === b) return delay({ ids: [a], edges: [] as GraphEdge[] });
    const { edges } = await graphApi.build();
    const adj = new Map<string, Array<{ to: string; edge: GraphEdge }>>();
    for (const e of edges) {
      if (!adj.has(e.source)) adj.set(e.source, []);
      if (!adj.has(e.target)) adj.set(e.target, []);
      adj.get(e.source)!.push({ to: e.target, edge: e });
      adj.get(e.target)!.push({ to: e.source, edge: e });
    }
    const prev = new Map<string, { node: string; edge: GraphEdge }>();
    const seen = new Set([a]);
    const queue = [a];
    while (queue.length) {
      const cur = queue.shift()!;
      if (cur === b) break;
      for (const { to, edge } of adj.get(cur) ?? []) {
        if (!seen.has(to)) {
          seen.add(to);
          prev.set(to, { node: cur, edge });
          queue.push(to);
        }
      }
    }
    if (!seen.has(b)) return delay(null);
    const ids = [b];
    const pathEdges: GraphEdge[] = [];
    let cur = b;
    while (cur !== a) {
      const step = prev.get(cur)!;
      pathEdges.unshift(step.edge);
      cur = step.node;
      ids.unshift(cur);
    }
    return delay({ ids, edges: pathEdges });
  },

  hrefFor: (node: GraphNode): string | null => {
    if (node.kind === "station") return `/stations/${node.id.split(":")[1]}`;
    if (node.kind === "expedition") return `/expeditions/${node.id.split(":")[1]}`;
    const rec = allRecords().find((r) => r.id === node.id);
    return rec?.href ?? null;
  },
};

/* ---------------------- Submissions / reviews / requests ----------- */

export const submissionsApi = {
  list: async () => delay(getStore().submissions),
  create: async (s: Omit<Submission, "id" | "submittedAt" | "status">) => {
    const id = `SUB-${200 + getStore().submissions.length}`;
    const sub: Submission = { ...s, id, submittedAt: new Date().toISOString().slice(0, 10), status: "PENDING" };
    setStore((d) => d.submissions.unshift(sub));
    logAudit({ actor: s.submitter, action: "submission", resource: id, note: `Researcher submitted “${s.title}” for scientific review.`, stateChange: "→ PENDING" });
    return delay(sub);
  },
  decide: async (id: string, status: Extract<import("./types").ReviewStatus, "APPROVED" | "REJECTED" | "REVISION_REQUESTED">, reviewer: string, note: string) => {
    setStore((d) => {
      const sub = d.submissions.find((x) => x.id === id);
      if (sub) {
        sub.status = status;
        sub.reviewerNote = note;
      }
    });
    logAudit({ actor: reviewer, action: status === "APPROVED" ? "approval" : status === "REJECTED" ? "rejection" : "review", resource: id, note, stateChange: `→ ${status}` });
    return delay(getStore().submissions.find((x) => x.id === id)!, 200);
  },
};

export const accessRequestsApi = {
  list: async () => delay(getStore().accessRequests),
  mine: async (requester: string) => delay(getStore().accessRequests.filter((r) => r.requester === requester)),
  create: async (r: Omit<AccessRequest, "id" | "requestedAt" | "status">) => {
    const id = `REQ-${100 + getStore().accessRequests.length}`;
    const req: AccessRequest = { ...r, id, requestedAt: new Date().toISOString().slice(0, 10), status: "PENDING" };
    setStore((d) => d.accessRequests.unshift(req));
    logAudit({ actor: r.requester, action: "access-request", resource: r.recordId, note: r.justification, stateChange: "→ PENDING" });
    return delay(req);
  },
  decide: async (id: string, status: "APPROVED" | "DENIED", decidedBy: string) => {
    setStore((d) => {
      const req = d.accessRequests.find((x) => x.id === id);
      if (req) req.status = status;
      if (req) req.decidedBy = decidedBy;
    });
    logAudit({ actor: decidedBy, action: "permission-change", resource: id, note: `Access request ${status.toLowerCase()}.`, stateChange: `→ ${status}` });
    return delay(getStore().accessRequests.find((x) => x.id === id)!, 200);
  },
};

export const collectionsApi = {
  list: async (owner: string) => delay(Object.values(getStore().collections).filter((c) => c.id.startsWith(owner))),
  toggleRecord: async (collectionId: string, name: string, recordId: string, owner: string) => {
    setStore((d) => {
      const c = (d.collections[collectionId] ??= { id: collectionId, name, note: "", recordIds: [], updatedAt: "" });
      const i = c.recordIds.indexOf(recordId);
      if (i >= 0) c.recordIds.splice(i, 1);
      else c.recordIds.push(recordId);
      c.updatedAt = new Date().toISOString();
    });
    logAudit({ actor: owner, action: "collection-change", resource: collectionId, note: `Toggled record ${recordId}.` });
    return delay(getStore().collections[collectionId]);
  },
};

export const auditApi = {
  list: async () => delay(getStore().audit),
  log: logAudit,
};

export const metricsApi = {
  dashboard: async () => {
    const s = getStore();
    return delay({
      totalRecords: allRecords().length,
      pendingReview: s.submissions.filter((x) => x.status === "PENDING" || x.status === "UNDER_REVIEW").length,
      approved: s.submissions.filter((x) => x.status === "APPROVED").length,
      rejected: s.submissions.filter((x) => x.status === "REJECTED").length,
      accessRequests: s.accessRequests.filter((x) => x.status === "PENDING").length,
      ocrProcessing: 2,
      duplicateAlerts: 1,
      aiDrafts: 7,
      zeroResultQueries: s.zeroResultQueries.slice(0, 6),
      popularQueries: topQueries(s.queryLog),
      auditCount: s.audit.length,
    });
  },
};

function topQueries(log: { q: string; results: number }[]) {
  const counts = new Map<string, number>();
  for (const l of log) counts.set(l.q, (counts.get(l.q) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([q, n]) => ({ q, n }));
}

/* Hook helper for live store binding (used by researcher/admin UI) */
export function useStoreSnapshot<T>(selector: (s: ReturnType<typeof getStore>) => T): T {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSyncExternalStoreClient(selector);
}

import { useSyncExternalStore } from "react";
function useSyncExternalStoreClient<T>(selector: (s: ReturnType<typeof getStore>) => T): T {
  return useSyncExternalStore(
    (cb) => subscribe(cb),
    () => selector(getStore()),
    () => selector(getStore()),
  );
}
