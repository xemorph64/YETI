import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Database, MapPin } from "lucide-react";
import { RESEARCHERS, getResearcher } from "@/lib/data/researchers";
import { DATASETS, PUBLICATIONS } from "@/lib/data/vault";
import { getStation } from "@/lib/data/stations";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { ProvenanceChip } from "@/components/ui/primitives";

export function generateStaticParams() {
  return RESEARCHERS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/researchers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const r = getResearcher(id);
  if (!r) return { title: "Researcher not found" };
  return { title: `${r.name} — researcher directory (demo)`, description: r.bio.slice(0, 150) };
}

export default async function ResearcherPage({ params }: PageProps<"/researchers/[id]">) {
  const { id } = await params;
  const r = getResearcher(id);
  if (!r) notFound();

  const stations = r.stationIds.map((s) => getStation(s)).filter((s) => s !== undefined);
  const datasets = DATASETS.filter((d) => r.datasetIds.includes(d.id));
  const publications = PUBLICATIONS.filter((p) => r.publicationIds.includes(p.id));
  const initials = r.name.replace("Dr. ", "").split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Researchers", href: "/researchers" }, { label: r.name }]}
          />
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex size-24 items-center justify-center rounded-2xl border border-line bg-surface-2">
              <span className="display text-3xl font-bold text-text-3">{initials}</span>
            </div>
            <div>
              <p className="meta-label">{r.programme} programme · {r.domain}</p>
              <h1 className="display mt-1.5 text-4xl font-bold leading-tight md:text-5xl">{r.name}</h1>
              <p className="mt-1.5 text-sm text-text-2">{r.title}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="dh-container grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr]">
        {/* Main */}
        <div className="flex flex-col gap-10">
          <section aria-label="About">
            <h2 className="meta-label mb-3">About (demonstration profile)</h2>
            <p className="max-w-[68ch] text-base leading-relaxed text-text-2">{r.bio}</p>
            <p className="mt-4 inline-flex">
              <ProvenanceChip p="demo" label="Fictional persona — consent-gated in production" />
            </p>
          </section>

          <section aria-label="Themes">
            <h2 className="meta-label mb-3">Science themes</h2>
            <div className="flex flex-wrap gap-2">
              {r.themes.map((t) => (
                <span key={t} className="rounded-full border border-line-strong bg-surface px-4 py-1.5 text-sm text-text-2">
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section aria-label="Datasets">
            <h2 className="meta-label mb-3">Datasets this persona uses</h2>
            {datasets.length > 0 ? (
              <ul className="flex flex-col divide-y divide-line rounded-xl border border-line bg-surface">
                {datasets.map((d) => (
                  <li key={d.id}>
                    <Link href={`/vault/datasets/${d.slug}`} className="group flex items-center gap-3 px-5 py-3.5">
                      <Database className="size-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                      <span className="flex-1 text-sm font-medium text-text group-hover:text-accent">{d.title}</span>
                      <span className="numeral text-[11px] text-text-3">{d.domain} · {d.version}</span>
                      <ArrowRight className="size-3.5 text-text-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-3">No dataset links for this persona in the demo build.</p>
            )}
          </section>

          <section aria-label="Publications">
            <h2 className="meta-label mb-3">Authored (demo records)</h2>
            {publications.length > 0 ? (
              <ul className="flex flex-col divide-y divide-line rounded-xl border border-line bg-surface">
                {publications.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                    <BookOpen className="size-4 shrink-0 text-sunrise" strokeWidth={1.5} aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug text-text">{p.title}</p>
                      <p className="numeral text-[11px] text-text-3">{p.type} · {p.year}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-3">No publication links for this persona in the demo build.</p>
            )}
          </section>
        </div>

        {/* Aside */}
        <aside className="flex h-fit flex-col gap-6 rounded-xl border border-line bg-surface p-6 lg:sticky lg:top-24">
          <div>
            <h2 className="meta-label mb-3">Works from</h2>
            {stations.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {stations.map((s) => (
                  <li key={s.id}>
                    <Link href={`/stations/${s.id}`} className="group flex items-center gap-2.5 text-sm font-medium text-text hover:text-accent">
                      <MapPin className="size-4 text-accent" strokeWidth={1.5} aria-hidden />
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-3">Sea-going — no fixed station.</p>
            )}
          </div>
          <div>
            <h2 className="meta-label mb-2">Expedition involvement</h2>
            <p className="text-sm leading-relaxed text-text-2">{r.expeditionNote}</p>
          </div>
          <Link
            href="/researcher/graph"
            className="btn-tactile rounded-lg bg-accent-fill px-5 py-2.5 text-center text-sm font-bold text-accent-ink"
          >
            View in the knowledge graph →
          </Link>
        </aside>
      </div>
    </div>
  );
}
