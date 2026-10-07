import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Database, FileText, MapPin } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { YearsInMotion } from "@/components/home/YearsInMotion";
import { ScatterToWindow } from "@/components/home/ScatterToWindow";
import { StartHere } from "@/components/home/StartHere";
import { AtlasPreview } from "@/components/home/AtlasPreview";
import { ThreeDoors } from "@/components/home/ThreeDoors";
import { UspBand } from "@/components/home/UspBand";
import { SourceCoverage } from "@/components/home/SourceCoverage";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink, Kicker, ProvenanceChip, SectionHeader, Stat } from "@/components/ui/primitives";
import { EXPEDITIONS } from "@/lib/data/expeditions";
import { STORIES } from "@/lib/data/stories";
import { DATASETS, PUBLICATIONS, REPORTS } from "@/lib/data/vault";
import { LEARN_PATHS } from "@/lib/data/learn";
import { STATIONS } from "@/lib/data/stations";

export default function HomePage() {
  const story = STORIES[0];
  const dataset = DATASETS[0];
  const antarcticCount = EXPEDITIONS.filter((e) => e.programme === "Antarctic").length;
  const arcticCount = EXPEDITIONS.filter((e) => e.programme === "Arctic").length;

  return (
    <>
      <Hero />
      <UspBand />
      <StartHere />

      {/* --- The problem, drawn: scattered → one window --------------------- */}
      <section className="hairline-t py-28" aria-label="From scattered to one window">
        <div className="dh-container">
          <SectionHeader
            kicker="The problem, drawn"
            title="Scattered for decades. One window now."
            body="Expedition reports sit on drives, datasets behind old websites, photographs in cabinets, papers behind paywalls. YETI ingests every artefact, gives it complete metadata and human review, and connects it to the whole — so one search reaches the whole of Indian polar science."
          />
          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
            <Reveal>
              <ScatterToWindow />
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-6">
              <SourceCoverage />
            </Reveal>
          </div>
        </div>
      </section>

      <YearsInMotion />

      {/* --- Atlas teaser: split composition -------------------------------- */}
      <section className="atmos hairline-t py-28" aria-label="Expedition Atlas">
        <div className="dh-container grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <Kicker>The Expedition Atlas</Kicker>
            <h2 className="display mt-4 text-balance text-4xl font-semibold leading-[1.04] md:text-5xl">
              Every expedition since 1981, on one globe.
            </h2>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-text-2">
              Orbit the Earth like a mission controller: expedition arcs rise from Goa and land on the ice.
              Scrub the decades in seconds; drop into any voyage for its route, science and crew.
              Stations are pins; the archive is the territory.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/atlas">
                <Compass className="size-4" strokeWidth={1.5} aria-hidden />
                Open the Atlas
              </ButtonLink>
              <ButtonLink href="/expeditions" variant="secondary">
                Browse as an index
              </ButtonLink>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              <Stat value={antarcticCount} label="Antarctic expeditions" />
              <Stat value="3" label="Stations in service" />
              <Stat value={arcticCount} label="Arctic expeditions" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <figure className="flex flex-col gap-3">
              <AtlasPreview />
              <figcaption className="flex items-center justify-between gap-3 text-xs text-text-3">
                <span>Every expedition arc in the archive, drawn flat. The Atlas flies the same data in 3-D.</span>
                <ProvenanceChip p="verified" label="Archive data" />
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* --- Featured story: full-bleed documentary frame -------------------- */}
      <section className="relative" aria-label="Featured story">
        <div className="relative h-[85vh] min-h-[540px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.cover}
            alt={story.coverAlt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" />
          <div className="dh-container relative flex h-full flex-col justify-end pb-20">
            <Reveal>
              <p className="meta-label mb-4">Featured story · {story.readingTime} read</p>
              <h2 className="display max-w-3xl text-balance text-5xl font-bold leading-[0.98] md:text-7xl">
                {story.title}
              </h2>
              <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-text-2">{story.standfirst}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ButtonLink href={`/stories/${story.slug}`}>
                  <BookOpen className="size-4" strokeWidth={1.5} aria-hidden />
                  Read the story
                </ButtonLink>
                <Link href="/stories" className="link-line text-sm text-text-2 hover:text-text">
                  All stories →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- Vault highlights: ledger-style rows, not cards ------------------ */}
      <section className="py-28" aria-label="The Vault highlights">
        <div className="dh-container">
          <SectionHeader
            kicker="The Vault"
            title="The archive is the product. Everything links back to it."
            body="Datasets with licences and citation hooks, publications, and expedition reports on a digital shelf. Serious for researchers, readable for everyone else."
            action={{ label: "Enter the Vault", href: "/vault" }}
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-3">
            <Reveal className="bg-surface p-8">
              <Database className="size-5 text-accent" strokeWidth={1.5} aria-hidden />
              <h3 className="display mt-4 text-xl font-semibold">{dataset.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-2">
                {dataset.abstract[0]}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-text-3">
                <span className="numeral">{dataset.temporal.from}–{dataset.temporal.to}</span>
                <span>·</span>
                <span>{dataset.domain}</span>
                <span>·</span>
                <span>{dataset.formats.join(", ")}</span>
              </div>
              <ProvenanceChip p={dataset.provenance} label="Synthetic demo data" className="mt-5" />
            </Reveal>
            <Reveal delay={90} className="flex flex-col gap-6 bg-surface p-8">
              <div className="flex items-center justify-between">
                <FileText className="size-5 text-violet" strokeWidth={1.5} aria-hidden />
                <Link href="/vault#publications" className="link-line text-xs text-text-3 hover:text-text">
                  Publication shelf →
                </Link>
              </div>
              <ul className="flex flex-col divide-y divide-line">
                {PUBLICATIONS.slice(0, 3).map((p) => (
                  <li key={p.id} className="py-3">
                    <p className="text-sm font-medium leading-snug text-text">{p.title}</p>
                    <p className="numeral mt-1 text-xs text-text-3">
                      {p.type} · {p.year} · {p.venue}
                    </p>
                  </li>
                ))}
              </ul>
              <ProvenanceChip p="synthetic" label="Demo records" />
            </Reveal>
            <Reveal delay={180} className="flex flex-col gap-6 bg-surface p-8">
              <div className="flex items-center justify-between">
                <BookOpen className="size-5 text-sunrise" strokeWidth={1.5} aria-hidden />
                <Link href="/vault#reports" className="link-line text-xs text-text-3 hover:text-text">
                  Digital shelf →
                </Link>
              </div>
              <ul className="flex flex-col divide-y divide-line">
                {REPORTS.slice(0, 3).map((r) => (
                  <li key={r.id} className="py-3">
                    <p className="text-sm font-medium leading-snug text-text">{r.title}</p>
                    <p className="numeral mt-1 text-xs text-text-3">
                      {r.year} · {r.pages} pp · {r.parsed ? "OCR-parsed" : "scan only"}
                    </p>
                  </li>
                ))}
              </ul>
              <ProvenanceChip p="demo" label="Demonstration records" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- Polar Gyaan: education strip ------------------------------------ */}
      <section className="hairline-t bg-surface py-28" aria-label="Polar Gyaan education hub">
        <div className="dh-container grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal delay={120} className="order-last lg:order-first">
            <figure className="relative overflow-hidden rounded-xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LEARN_PATHS[0].cover}
                alt="An emperor penguin beside a historic expedition hut"
                className="aspect-[5/4] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/95 to-transparent px-4 pb-3 pt-10 text-xs text-text-3">
                {LEARN_PATHS[0].coverCredit}
              </figcaption>
            </figure>
          </Reveal>
          <Reveal>
            <Kicker>Polar Gyaan · Smart Education</Kicker>
            <h2 className="display mt-4 text-balance text-4xl font-semibold leading-[1.05] md:text-5xl">
              The greatest classroom on Earth is at −60 °C.
            </h2>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-text-2">
              Curriculum-mapped learning paths for Class 6–10: short lessons, checkpoint quizzes, collectible
              badges, and a downloadable <strong className="text-text">Junior Polar Scientist</strong> certificate.
              Teacher resources included — and it works on low bandwidth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/learn">
                Start learning
                <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/learn#teachers" variant="secondary">
                Teacher Zone
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- From the Ice: stations ------------------------------------------ */}
      <section className="py-28" aria-label="Indian polar stations">
        <div className="dh-container">
          <SectionHeader
            kicker="From the ice"
            title="Four addresses at the ends of the Earth."
            action={{ label: "All stations", href: "/stations" }}
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
            {STATIONS.map((s, i) => (
              <Reveal key={s.slug} delay={i * 70}>
                <Link
                  href={`/stations/${s.slug}`}
                  className="btn-tactile group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-xl border border-line"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.cover}
                    alt={`${s.name} — ${s.location}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/35 to-transparent" />
                  <div className="relative flex flex-col gap-1.5 p-5">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-accent" strokeWidth={1.5} aria-hidden />
                      <span className="meta-label">{s.status === "heritage" ? "Heritage site" : `Est. ${s.established}`}</span>
                    </div>
                    <span className="display text-2xl font-semibold text-text">{s.name}</span>
                    <span className="text-xs text-text-2">{s.location}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- Three doors: task-based entry ----------------------------------- */}
      <ThreeDoors />

    </>
  );
}
