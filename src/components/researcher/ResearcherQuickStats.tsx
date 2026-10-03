"use client";

import { useEffect, useState } from "react";
import { metricsApi } from "@/lib/api/client";
import { useStoreSnapshot } from "@/lib/api/client";
import { getStore } from "@/lib/api/store";

/** Live workspace counters — bound to the demo store so admin decisions move them. */
export function ResearcherQuickStats() {
  const submissions = useStoreSnapshot((s) => s.submissions);
  const accessRequests = useStoreSnapshot((s) => s.accessRequests);
  const collections = useStoreSnapshot((s) => Object.keys(s.collections).length);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    metricsApi.dashboard().then((m) => setTotal(m.totalRecords));
  }, []);

  const mine = submissions.filter((s) => s.role === "researcher");
  const pending = mine.filter((s) => s.status === "PENDING" || s.status === "UNDER_REVIEW").length;
  const openReqs = accessRequests.filter((r) => r.status === "PENDING").length;
  const saved = Object.values(getStore().collections).reduce((n, c) => n + c.recordIds.length, 0);

  const STATS = [
    { label: "Repository records", value: total === null ? "—" : String(total), note: "all review states" },
    { label: "Saved in collections", value: String(saved), note: "this browser profile" },
    { label: "My submissions", value: `${mine.length}`, note: `${pending} awaiting review` },
    { label: "Access requests", value: String(accessRequests.length), note: `${openReqs} pending` },
  ];

  return (
    <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="bg-surface px-5 py-4">
          <dt className="meta-label">{s.label}</dt>
          <dd className="numeral mt-1.5 text-3xl font-bold text-text">{s.value}</dd>
          <p className="mt-0.5 text-[11px] text-text-3">{s.note}</p>
        </div>
      ))}
    </dl>
  );
}
