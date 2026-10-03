import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DATASETS, getDataset } from "@/lib/data/vault";
import { getStation } from "@/lib/data/stations";
import { ScientificChart } from "@/components/ui/ScientificChart";
import { CopyButton } from "@/components/ui/CopyButton";
import { DemoDownload } from "@/components/vault/DemoDownload";
import { DataJourney } from "@/components/records/DataJourney";
import { AccessGate } from "@/components/records/AccessGate";
import { ProvenanceChip } from "@/components/ui/primitives";
import { generateSeries } from "@/lib/series";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";

export function generateStaticParams() {
  return DATASETS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vault/datasets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDataset(slug);
  if (!d) return { title: "Dataset not found" };
  return { title: d.title, description: d.abstract[0].slice(0, 150) };
}

export default async function DatasetPage({ params }: PageProps<"/vault/datasets/[slug]">) {
  const { slug } = await params;
  const d = getDataset(slug);
  if (!d) notFound();
  const station = d.stationId ? getStation(d.stationId) : null;
  const series = generateSeries(d.seed, 40, 0, 3, 0.06);

  const citation = `Indian Polar Programme (demo record), "${d.title}", YETI Vault, version ${d.version}, ${d.temporal.from}–${d.temporal.to}. Synthetic demonstration dataset — not for research use. Licence: ${d.licence}.`;
  const bibtex = `@dataset{yeti_${d.id.replace("-", "_")},
  title  = {${d.title}},
  author= {{Indian Polar Programme (demo record)}},
  year   = {${d.temporal.to}},
  version= {${d.version}},
  note   = {Synthetic demonstration dataset},
  url    = {https://yeti-demo.example.org/vault/datasets/${d.slug}}
}`;

  return (
    <article className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-36">
        <div className="dh-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "The Vault", href: "/vault" }, { label: "Datasets", href: "/vault" }, { label: d.title }]} />
          <p className="meta-label mt-6">
            {d.domain} · {d.region}
            {station ? ` · ${station.name}` : ""}
          </p>
          <h1 className="display mt-3 max-w-4xl text-balance text-4xl font-bold leading-[1.02] md:text-5xl">{d.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <ProvenanceChip p={d.provenance} />
            <span className="rounded-full border border-line-strong px-2.5 py-0.5 text-[11px] text-text-2">
              {d.licence}
            </span>
            <span className="numeral rounded-full border border-line-strong px-2.5 py-0.5 text-[11px] text-text-2">
              {d.version}
            </span>
          </div>
        </div>
      </header>

      <div className="dh-container grid gap-12 py-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-10">
          <section aria-label="Abstract">
            <h2 className="meta-label mb-3">Abstract</h2>
            <div className="flex flex-col gap-3 text-base leading-relaxed text-text-2">
              {d.abstract.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section aria-label="Preview chart" className="grid gap-4">
            <h2 className="meta-label">Preview — first variable</h2>
            <div className="rounded-xl border border-line bg-surface p-6">
              <ScientificChart
                series={series}
                label={`${d.variables[0].label} (${d.variables[0].unit}) — synthetic preview`}
                unit={`${d.variables[0].code} · ${d.variables[0].unit}`}
                xLabels={[String(d.temporal.from), String(Math.round((d.temporal.from + d.temporal.to) / 2)), String(d.temporal.to)]}
                highlight="Generated from a fixed seed — the same numbers render every visit."
              />
            </div>
          </section>

          <section aria-label="Variables">
            <h2 className="meta-label mb-3">Variables</h2>
            <div className="overflow-hidden rounded-xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface-2 text-left">
                    <th className="px-4 py-2.5 font-medium text-text-3">Code</th>
                    <th className="px-4 py-2.5 font-medium text-text-3">Label</th>
                    <th className="px-4 py-2.5 font-medium text-text-3">Unit</th>
                  </tr>
                </thead>
                <tbody className="bg-surface">
                  {d.variables.map((v) => (
                    <tr key={v.code} className="border-b border-line last:border-0">
                      <td className="numeral px-4 py-2.5 font-semibold text-accent">{v.code}</td>
                      <td className="px-4 py-2.5 text-text-2">{v.label}</td>
                      <td className="numeral px-4 py-2.5 text-text-3">{v.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-label="Citation" className="grid gap-4">
            <h2 className="meta-label">Cite this record</h2>
            <div className="rounded-xl border border-line bg-surface p-5">
              <p className="text-sm leading-relaxed text-text-2">{citation}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <CopyButton value={citation} label="Copy APA-style" />
                <CopyButton value={bibtex} label="Copy BibTeX" />
              </div>
              <p className="mt-3 text-xs text-text-3">DOI status: {d.doiStatus}.</p>
            </div>
          </section>
        </div>

        <aside className="flex h-fit flex-col gap-6 lg:sticky lg:top-24">
          <div className="rounded-xl border border-line bg-surface p-6">
            <h2 className="meta-label mb-4">Record</h2>
            <dl className="flex flex-col divide-y divide-line text-sm">
              {[
                ["Temporal coverage", `${d.temporal.from}–${d.temporal.to}`],
                ["Spatial coverage", `BBox ${d.bbox.map((b) => b.toFixed(1)).join(", ")}`],
                ["Formats", d.formats.join(", ")],
                ["Size", `${d.sizeMb} MB`],
                ["Version", d.version],
                ["Licence", d.licence],
                ["Station", station?.name ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[120px_1fr] gap-3 py-2.5">
                  <dt className="text-text-3">{k}</dt>
                  <dd className="font-medium text-text-2">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5">
              {d.id === "ds-03" ? (
                <AccessGate recordId={d.id} accessLevel="RESTRICTED">
                  <DemoDownload dataset={d} />
                </AccessGate>
              ) : (
                <DemoDownload dataset={d} />
              )}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-text-3">
              The demo download is generated in your browser from the seeded series — there is no backend in this
              build. Production serves files from object storage with signed URLs.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6">
            <h2 className="meta-label mb-3">API (production shape)</h2>
            <pre className="numeral overflow-x-auto rounded-lg border border-line bg-bg-deep p-3 text-[11px] leading-relaxed text-text-2">
{`GET /api/v1/datasets/${d.slug}
GET /api/v1/datasets/${d.slug}/download
GET /api/v1/datasets/${d.slug}/citation?style=apa`}
            </pre>
          </div>

          <DataJourney
            origin={{
              channel: "moes-dataset",
              label: "MoES data catalogue (demo)",
              ingestedAt: "2026-01-12",
              method: "api",
            }}
            reviewStatus="APPROVED"
            version={d.version}
            accessLevel="OPEN"
          />
        </aside>
      </div>
    </article>
  );
}
