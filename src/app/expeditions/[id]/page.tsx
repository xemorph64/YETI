import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Database, FileText, Ship, UserRound } from "lucide-react";
import { EXPEDITIONS, getExpedition } from "@/lib/data/expeditions";
import { stationForProgramme } from "@/lib/data/stations";
import { MiniRouteMap } from "@/components/expeditions/MiniRouteMap";
import { DATASETS, REPORTS } from "@/lib/data/vault";
import { MEDIA } from "@/lib/data/media";
import { ProvenanceChip } from "@/components/ui/primitives";
import { ExpeditionStory } from "@/components/expeditions/ExpeditionStory";
import { toRoman } from "@/lib/utils";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";

export function generateStaticParams() {
  return EXPEDITIONS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: PageProps<"/expeditions/[id]">): Promise<Metadata> {
  const { id } = await params;
  const exp = getExpedition(id);
  if (!exp) return { title: "Expedition not found" };
  return {
    title: `${exp.ordinal} Indian ${exp.programme} Expedition (${exp.season})`,
    description: exp.summary.slice(0, 150),
  };
}

export default async function ExpeditionDetail({ params }: PageProps<"/expeditions/[id]">) {
  const { id } = await params;
  const exp = getExpedition(id);
  if (!exp) notFound();

  const station = stationForProgramme(exp.programme);
  const relatedDatasets = DATASETS.filter((d) => d.expeditionId === exp.id || d.stationId === exp.stationIds?.[0]).slice(0, 2);
  const relatedReports = REPORTS.filter((r) => r.expeditionId === exp.id);
  const gallery = MEDIA.slice(exp.number % 10, (exp.number % 10) + 4);
  const idx = EXPEDITIONS.findIndex((e) => e.id === exp.id);
  const prev = EXPEDITIONS[idx + 1];
  const next = EXPEDITIONS[idx - 1];

  return (
    <article className="pb-16">
      {/* Hero */}
      <header className="relative flex min-h-[68vh] flex-col justify-end overflow-hidden pb-10 pt-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={exp.cover} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" aria-hidden />
        <div className="dh-container relative">
          <div className="[&_a]:text-white/70 [&_a:hover]:text-white [&_[aria-current]]:text-white/90 [&_svg]:text-white/60 mb-6 rounded-lg bg-bg/45 backdrop-blur-sm inline-block px-3 py-1.5">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Expeditions", href: "/expeditions" }, { label: programmeTitle(exp) }]} />
          </div>
          <p className="meta-label mb-3">
            {exp.programme} programme · {exp.season}
          </p>
          <h1 className="display max-w-4xl text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            {programmeTitle(exp)}
          </h1>
          {exp.milestone && (
            <p className="mt-4 inline-flex">
              <ProvenanceChip p="verified" label={exp.milestone} />
            </p>
          )}
        </div>
      </header>

      {/* Story mode — the documented chapter structure */}
      <ExpeditionStory exp={exp} />

      {/* Meta strip */}
      <div className="hairline-b">
        <div className="dh-container grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
          <MetaBlock icon={<Ship className="size-4" strokeWidth={1.5} aria-hidden />} label="Vessel" value={exp.vessel ?? "Official record"} />
          <MetaBlock icon={<UserRound className="size-4" strokeWidth={1.5} aria-hidden />} label="Leader" value={exp.leader ?? "Official record"} />
          <MetaBlock label="Season" value={exp.season} />
          <MetaBlock label="Sector" value={exp.region} />
        </div>
      </div>

      <div className="dh-container grid gap-12 py-12 lg:grid-cols-[1.5fr_1fr]">
        {/* Main column */}
        <div className="flex flex-col gap-12">
          <section aria-label="Gallery" className="grid gap-4">
            <div className="flex items-baseline justify-between">
              <h2 className="meta-label">Field imagery</h2>
              <Link href="/gallery" className="link-line text-xs text-text-3 hover:text-text">
                CryoLens gallery →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {gallery.map((m) => (
                <figure key={m.id} className="overflow-hidden rounded-lg border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.src} alt={m.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <figcaption className="bg-surface px-3 py-2 text-[10px] text-text-3">
                    {m.title} · {m.credit} · {m.license}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </div>

        {/* Side column */}
        <aside className="flex h-fit flex-col gap-8 rounded-xl border border-line bg-surface p-6 lg:sticky lg:top-24">
          <div>
            <h2 className="meta-label mb-3">Records from this expedition</h2>
            {relatedReports.length > 0 ? (
              <ul className="flex flex-col divide-y divide-line">
                {relatedReports.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 py-3">
                    <FileText className="size-4 shrink-0 text-sunrise" strokeWidth={1.5} aria-hidden />
                    <div>
                      <p className="text-sm font-medium leading-snug text-text">{r.title}</p>
                      <p className="numeral text-[11px] text-text-3">{r.pages} pp · {r.sizeMb} MB</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-3">
                Report digitisation for this season is on the archive roadmap.
              </p>
            )}
          </div>
          <div>
            <h2 className="meta-label mb-3">Related datasets</h2>
            {relatedDatasets.length > 0 ? (
              <ul className="flex flex-col divide-y divide-line">
                {relatedDatasets.map((d) => (
                  <li key={d.id} className="py-3">
                    <Link href={`/vault/datasets/${d.slug}`} className="group flex items-center gap-3">
                      <Database className="size-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                      <div>
                        <p className="text-sm font-medium leading-snug text-text group-hover:text-accent">{d.title}</p>
                        <p className="numeral text-[11px] text-text-3">{d.domain} · {d.version}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-3">No dataset ingested for this record in the demo build.</p>
            )}
          </div>
          <div>
            <h2 className="meta-label mb-3">Crew</h2>
            <p className="text-xs leading-relaxed text-text-3">
              Expedition rosters are personal data. This demo archive intentionally does not seed crew names —
              production would require consent-gated ingest. See <Link href="/about#honesty" className="link-line text-accent">data honesty</Link>.
            </p>
          </div>
        </aside>
      </div>

      {/* Prev / next */}
      <nav className="dh-container mt-8 grid gap-4 border-t border-line pt-8 md:grid-cols-2" aria-label="Adjacent expeditions">
        {prev && <AdjacentCard exp={prev} dir="prev" />}
        {next && <AdjacentCard exp={next} dir="next" />}
      </nav>
    </article>
  );
}

function programmeTitle(exp: NonNullable<ReturnType<typeof getExpedition>>) {
  if (exp.milestone) return exp.milestone;
  if (exp.programme === "Antarctic") return `${toRoman(exp.number)} Indian Antarctic Expedition`;
  return `${exp.ordinal} Indian ${exp.programme} expedition`;
}

function MetaBlock({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="meta-label flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-text-2">{value}</span>
    </div>
  );
}

function AdjacentCard({
  exp,
  dir,
}: {
  exp: (typeof EXPEDITIONS)[number];
  dir: "prev" | "next";
}) {
  return (
    <Link
      href={`/expeditions/${exp.id}`}
      className={`btn-tactile group flex items-center gap-4 rounded-lg border border-line bg-surface p-4 hover:border-accent/50 ${dir === "next" ? "md:order-last" : ""}`}
    >
      {dir === "prev" && <ArrowLeft className="size-4 shrink-0 text-text-3 group-hover:text-accent" strokeWidth={1.5} aria-hidden />}
      <div className="min-w-0">
        <p className="meta-label">{dir === "prev" ? "Earlier" : "Later"} · {exp.season}</p>
        <p className="display truncate text-sm font-semibold text-text">{exp.milestone ?? `${exp.ordinal} ${exp.programme} expedition`}</p>
      </div>
      {dir === "next" && <ArrowRight className="ml-auto size-4 shrink-0 text-text-3 group-hover:text-accent" strokeWidth={1.5} aria-hidden />}
    </Link>
  );
}
