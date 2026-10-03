import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowLeftRight, FlaskConical } from "lucide-react";
import { STATIONS, getStation } from "@/lib/data/stations";
import { mediaByStation } from "@/lib/data/media";
import { DATASETS } from "@/lib/data/vault";
import { LightCycle } from "@/components/stations/LightCycle";
import { MiniRouteMap } from "@/components/expeditions/MiniRouteMap";
import { ProvenanceChip } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";

export function generateStaticParams() {
  return STATIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getStation(slug);
  if (!s) return { title: "Station not found" };
  return { title: `${s.name} — ${s.location}`, description: s.summary[0].slice(0, 150) };
}

export default async function StationPage({ params }: PageProps<"/stations/[slug]">) {
  const { slug } = await params;
  const station = getStation(slug);
  if (!station) notFound();

  const gallery = mediaByStation(station.id);
  const datasets = DATASETS.filter((d) => d.stationId === station.id);

  return (
    <article className="pb-16">
      {/* Cinematic hero */}
      <header className="relative flex min-h-[75vh] flex-col justify-end overflow-hidden pb-12 pt-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={station.cover} alt={`${station.name} — ${station.location}`} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/15" aria-hidden />
        <div className="dh-container relative">
          <div className="inline-block rounded-lg bg-bg/45 px-3 py-1.5 backdrop-blur-sm [&_a]:text-white/70 [&_a:hover]:text-white [&_[aria-current]]:text-white/90 [&_svg]:text-white/60">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Stations", href: "/stations" }, { label: station.name }]} />
          </div>
          <p className="meta-label mb-3">
            {station.region} · {station.status === "heritage" ? `Est. ${station.established} · decommissioned ${station.decommissioned}` : `Est. ${station.established}`}
          </p>
          <h1 className="display text-balance text-6xl font-bold leading-[0.95] md:text-7xl">{station.name}</h1>
          {station.namesake && <p className="mt-2 text-sm italic text-text-2">{station.namesake}</p>}
          <p className="numeral mt-4 text-sm text-text-2">
            {Math.abs(station.lat).toFixed(2)}°{station.lat < 0 ? "S" : "N"} · {Math.abs(station.lng).toFixed(2)}°
            {station.lng < 0 ? "W" : "E"} · {station.location}
          </p>
        </div>
      </header>

      <div className="dh-container grid gap-12 py-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-10">
          <section aria-label="About the station">
            <h2 className="meta-label mb-4">The station</h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed text-text-2">
              {station.summary.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <ProvenanceChip p={station.provenance} />
              {station.status === "heritage" && <ProvenanceChip p="verified" label="Historic site" />}
            </div>
          </section>

          <section aria-label="A day here">
            <LightCycle lat={station.lat} name={station.name} />
          </section>

          <section aria-label="Position" className="grid gap-4">
            <h2 className="meta-label">Position</h2>
            <MiniRouteMap to={{ lat: station.lat, lng: station.lng, name: station.name }} label="Schematic: Goa → station sector." />
          </section>

          <section aria-label="Station history">
            <h2 className="meta-label mb-4">Timeline</h2>
            <ol className="flex flex-col divide-y divide-line border-t border-line">
              {station.history.map((h) => (
                <li key={h.year} className="grid grid-cols-[90px_1fr] items-baseline gap-4 py-4">
                  <span className="numeral text-sm font-bold text-accent">{h.year}</span>
                  <span className="text-sm leading-relaxed text-text-2">{h.text}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-label="Gallery" className="grid gap-4">
            <h2 className="meta-label">Station imagery</h2>
            {gallery.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {gallery.map((m) => (
                  <figure key={m.id} className="overflow-hidden rounded-lg border border-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.src} alt={m.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                    <figcaption className="bg-surface px-3 py-2 text-[10px] text-text-3">
                      {m.credit} · {m.license}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-line bg-surface p-5 text-sm text-text-3">
                No imagery assigned to this station in the demo build — the DAM schema reserves station-tagged
                albums for production ingest.
              </p>
            )}
          </section>
        </div>

        {/* Fact sheet */}
        <aside className="flex h-fit flex-col gap-8 lg:sticky lg:top-24">
          <div className="rounded-xl border border-line bg-surface p-6">
            <h2 className="meta-label mb-4">Fact sheet</h2>
            <dl className="flex flex-col divide-y divide-line">
              {station.facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[110px_1fr] gap-3 py-2.5 text-sm">
                  <dt className="text-text-3">{f.label}</dt>
                  <dd className="font-medium text-text-2">{f.value}</dd>
                </div>
              ))}
              {station.altitudeM && (
                <div className="grid grid-cols-[110px_1fr] gap-3 py-2.5 text-sm">
                  <dt className="text-text-3">Altitude</dt>
                  <dd className="numeral font-medium text-text-2">≈ {station.altitudeM} m</dd>
                </div>
              )}
              {station.complement && (
                <div className="grid grid-cols-[110px_1fr] gap-3 py-2.5 text-sm">
                  <dt className="text-text-3">Complement</dt>
                  <dd className="font-medium text-text-2">
                    Summer {station.complement.summer} · winter {station.complement.winter} (approx.)
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6">
            <h2 className="meta-label mb-3">Science domains</h2>
            <ul className="flex flex-wrap gap-2">
              {station.scienceDomains.map((d) => (
                <li key={d} className="rounded-full border border-line-strong px-3 py-1 text-xs text-text-2">
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6">
            <div className="mb-3 flex items-center gap-2">
              <FlaskConical className="size-4 text-violet" strokeWidth={1.5} aria-hidden />
              <h2 className="meta-label">Data from this station</h2>
            </div>
            {datasets.length > 0 ? (
              <ul className="flex flex-col divide-y divide-line">
                {datasets.map((d) => (
                  <li key={d.id} className="py-2.5">
                    <Link href={`/vault/datasets/${d.slug}`} className="group text-sm font-medium text-text group-hover:text-accent">
                      {d.title}
                    </Link>
                    <p className="numeral text-[11px] text-text-3">{d.temporal.from}–{d.temporal.to} · {d.version}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-3">No datasets mapped in the demo build.</p>
            )}
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-sunrise/30 bg-sunrise-dim p-5">
            <ArrowLeftRight className="mt-0.5 size-4 shrink-0 text-sunrise" strokeWidth={1.5} aria-hidden />
            <p className="text-xs leading-relaxed text-text-2">
              No live station conditions are shown. Real telemetry requires NCPOR&apos;s operational systems — this demo
              deliberately shows nothing rather than something fabricated.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
