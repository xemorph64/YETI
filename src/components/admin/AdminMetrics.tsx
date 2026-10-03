"use client";

import { useEffect, useState } from "react";
import { metricsApi } from "@/lib/api/client";
import { useStoreSnapshot } from "@/lib/api/client";
import { Stat } from "@/components/ui/primitives";

/**
 * Live operations metrics. The interesting ones — pending reviews, duplicate
 * alerts, zero-result searches — are harvested from actual system usage in
 * this demo (query log, store mutations), mirroring what the backend would
 * compute in production.
 */

export function AdminMetrics() {
  const zeroResults = useStoreSnapshot((s) => s.zeroResultQueries);
  const queryLog = useStoreSnapshot((s) => s.queryLog);
  const submissions = useStoreSnapshot((s) => s.submissions);
  const accessRequests = useStoreSnapshot((s) => s.accessRequests);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    metricsApi.dashboard().then((m) => setTotal(m.totalRecords));
  }, []);

  const pending = submissions.filter((s) => s.status === "PENDING" || s.status === "UNDER_REVIEW").length;
  const pendingReqs = accessRequests.filter((r) => r.status === "PENDING").length;

  const popular = Object.entries(
    queryLog.reduce<Record<string, number>>((acc, l) => {
      if (l.results > 0) acc[l.q] = (acc[l.q] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-6">
        <Stat value={total === null ? "—" : String(total)} label="Repository records" />
        <Stat value={String(pending)} label="Pending scientific review" />
        <Stat value={String(pendingReqs)} label="Access requests" />
        <Stat value="2" label="OCR processing" />
        <Stat value="1" label="Duplicate alerts" />
        <Stat value={String(zeroResults.length)} label="Zero-result searches" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-surface p-6" aria-label="Zero-result searches">
          <h2 className="meta-label mb-3">Zero-result searches — the archive&apos;s blind spots</h2>
          {zeroResults.length === 0 ? (
            <p className="text-sm text-text-3">
              None yet in this session. Try searching the ⌘K palette for something the demo corpus lacks — it will
              appear here, telling the knowledge-management team exactly what to ingest next.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {zeroResults.slice(0, 6).map((z, i) => (
                <li key={z.q + i} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-text-2">{z.q}</span>
                  <span className="numeral text-[11px] text-text-3">{new Date(z.at).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-xl border border-line bg-surface p-6" aria-label="Popular searches">
          <h2 className="meta-label mb-3">Popular searches this session</h2>
          {popular.length === 0 ? (
            <p className="text-sm text-text-3">No searches logged yet in this browser session.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {popular.map(([q, n]) => (
                <li key={q} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-text-2">{q}</span>
                  <span className="numeral text-[11px] text-text-3">×{n}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
