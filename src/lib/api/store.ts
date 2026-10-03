"use client";

/**
 * Demo persistence for YETI.
 *
 * A tiny observable store over localStorage. It stands in for the future
 * FastAPI/PostgreSQL backend: every mutation publishes to subscribers so
 * admin approvals, researcher submissions and collections update the whole
 * UI live. Swap this file's implementation for HTTP calls when the backend
 * exists — nothing above the service layer (./client.ts) changes.
 */

export interface StoreShape {
  submissions: import("./types").Submission[];
  accessRequests: import("./types").AccessRequest[];
  audit: import("./types").AuditEntry[];
  collections: Record<string, { id: string; name: string; note: string; recordIds: string[]; updatedAt: string }>;
  annotations: Record<string, { id: string; recordId: string; quote: string; body: string; at: string }[]>;
  publishedChannelDrafts: string[];
  zeroResultQueries: { q: string; at: string }[];
  queryLog: { q: string; at: string; results: number }[];
}

const KEY = "yeti-store-v1";

const initial: StoreShape = {
  submissions: [
    {
      id: "SUB-102",
      submitter: "Dr. A. Sharma (demo)",
      role: "researcher",
      kind: "dataset",
      title: "Prydz Bay CTD cast supplement — summer 2023 (demo submission)",
      description:
        "Demonstration submission: supplementary CTD cast metadata and quality flags from the 42nd expedition season, offered for inclusion in the Vault.",
      rights: "Creator retains copyright",
      licence: "CC BY 4.0 (proposed)",
      submittedAt: "2026-02-11",
      status: "UNDER_REVIEW",
      linkedExpedition: "42nd",
      linkedStation: "Bharati",
      linkedTheme: ["Oceanography"],
    },
  ],
  accessRequests: [],
  audit: [
    {
      id: "AUD-0007",
      at: "2026-02-11T09:14:00Z",
      actor: "system (demo)",
      action: "ai-generation",
      resource: "Sanchar draft batch #23",
      note: "7 channel drafts generated from approved source “42nd Indian Antarctic Expedition — scientific summary”. Human review required before publication.",
    },
  ],
  collections: {},
  annotations: {},
  publishedChannelDrafts: [],
  zeroResultQueries: [],
  queryLog: [],
};

type Listener = (s: StoreShape) => void;
const listeners = new Set<Listener>();

function load(): StoreShape {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...(JSON.parse(raw) as StoreShape) };
  } catch {
    return initial;
  }
}

let cache: StoreShape | null = null;

export function getStore(): StoreShape {
  if (!cache) cache = load();
  return cache;
}

export function setStore(mutator: (draft: StoreShape) => void): StoreShape {
  const next = structuredClone(getStore());
  mutator(next);
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or unavailable — demo keeps working in-memory */
  }
  listeners.forEach((l) => l(next));
  return next;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function logAudit(
  entry: Omit<import("./types").AuditEntry, "id" | "at"> & { at?: string },
): void {
  const n = getStore().audit.length + 8;
  setStore((d) => {
    d.audit.unshift({
      id: `AUD-${String(n).padStart(4, "0")}`,
      at: entry.at ?? new Date().toISOString(),
      ...entry,
    });
  });
}

export function logQuery(q: string, results: number): void {
  if (!q.trim()) return;
  setStore((d) => {
    d.queryLog.unshift({ q: q.trim(), at: new Date().toISOString(), results });
    if (results === 0) d.zeroResultQueries.unshift({ q: q.trim(), at: new Date().toISOString() });
    d.queryLog = d.queryLog.slice(0, 200);
    d.zeroResultQueries = d.zeroResultQueries.slice(0, 100);
  });
}
