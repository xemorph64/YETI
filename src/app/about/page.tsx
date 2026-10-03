import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, FlaskConical, Scale, ShieldCheck } from "lucide-react";
import { Kicker, ProvenanceChip } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "What YETI is, what is real vs demo, imagery provenance, and the accessibility commitment.",
};

export default function AboutPage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-14 pt-32 md:pt-40">
        <div className="dh-container">
          <Kicker>About</Kicker>
          <h1 className="display mt-4 max-w-3xl text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            YETI Knows. Now You Can Too!
          </h1>
          <p className="mt-6 max-w-[68ch] text-base leading-relaxed text-text-2">
            Decades of Indian polar science sit scattered — expedition reports on drives, datasets behind old
            websites, photographs in cabinets. YETI, your scientific expedition guide, connects it all into one
            trusted, searchable knowledge ecosystem for the Ministry of Earth Sciences and the National Centre for
            Polar and Ocean Research: archived, connected, discoverable, teachable — and disseminated back to the
            public through human-reviewed, source-linked media.
          </p>
          <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-text-3">
            This is a <strong className="text-text-2">demonstration build</strong> — made in the hackathon format, not
            an official Government of India website, and it deliberately never claims to be.
          </p>
        </div>
      </header>

      <div className="dh-container-tight flex flex-col gap-14 py-14">
        {/* Meet YETI */}
        <Reveal>
          <section aria-label="Meet YETI">
            <div className="flex items-center gap-3">
              <FlaskConical className="size-5 text-accent" strokeWidth={1.5} aria-hidden />
              <h2 className="display text-2xl font-semibold">Meet YETI — your expedition guide</h2>
            </div>
            <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
              <figure className="overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/yeti-mascot-hero.jpg"
                  alt="YETI, the mascot: a friendly yeti scientist in polar gear holding a field notebook"
                  className="w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="bg-surface px-4 py-2.5 text-[11px] text-text-3">
                  The guide, in one frame — scientist first, mascot second. AI-generated brand artwork.
                </figcaption>
              </figure>
              <div className="flex flex-col gap-4 text-sm leading-relaxed text-text-2">
                <p>
                  YETI is the archive&apos;s guide character — a field scientist who has been on every
                  expedition in the record. The brief was strict: a competent researcher who happens to be
                  charming, never a cartoon sidekick. In the product, YETI appears as a small geometric mark
                  in the search assistant and empty states; this sheet sets the visual standard for those
                  moments.
                </p>
                <p>
                  Every YETI appearance follows two rules from the project documentation: YETI explains what
                  the archive contains and never invents what it doesn&apos;t — and YETI always shows its
                  sources. No citation, no answer.
                </p>
                <figure className="mt-2 overflow-hidden rounded-xl border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/yeti-mascot-expressions.jpg"
                    alt="Expression sheet: seven poses of the YETI mascot for idle, thinking, searching, explaining, success, warning and source-found states"
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="bg-surface px-4 py-2.5 text-[11px] text-text-3">
                    Expression sheet — one pose per assistant state (idle · thinking · searching · explaining · success · warning · source found).
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Data honesty */}
        <Reveal>
          <section id="honesty" className="scroll-mt-24" aria-label="Data honesty">
            <div className="flex items-center gap-3">
              <FlaskConical className="size-5 text-violet" strokeWidth={1.5} aria-hidden />
              <h2 className="display text-2xl font-semibold">Data honesty — what is real, what is demo</h2>
            </div>
            <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-text-2">
              <p>
                An outreach portal for a scientific institution has a special obligation: it must never blur fact and
                fiction. YETI tags every record with its provenance, visibly:
              </p>
              <ul className="flex flex-col gap-3">
                <li className="flex flex-wrap items-center gap-3">
                  <ProvenanceChip p="verified" />
                  <span>Verified public facts — expedition years, station commissions, the Indian Antarctic Act 2022, milestone events.</span>
                </li>
                <li className="flex flex-wrap items-center gap-3">
                  <ProvenanceChip p="demo" />
                  <span>Demonstration records — plausible season-level details (objectives, sectors) seeded for structure; official records live with NCPOR.</span>
                </li>
                <li className="flex flex-wrap items-center gap-3">
                  <ProvenanceChip p="synthetic" />
                  <span>Synthetic data — every dataset value in the Vault is generated from a fixed seed. Useful for understanding the schema; useless for research. On purpose.</span>
                </li>
                <li className="flex flex-wrap items-center gap-3">
                  <ProvenanceChip p="third-party" />
                  <span>Third-party credited assets — imagery from Wikimedia Commons with author and licence recorded; nothing is attributed to NCPOR photographers.</span>
                </li>
              </ul>
              <p className="rounded-lg border border-line bg-surface p-4 text-xs text-text-3">
                Crew names, station rosters and live conditions are intentionally absent. Personal data requires
                consent; telemetry requires real systems. Showing nothing honest beats showing something fabricated.
              </p>
            </div>
          </section>
        </Reveal>

        {/* Provenance */}
        <Reveal>
          <section id="provenance" className="scroll-mt-24" aria-label="Imagery provenance">
            <div className="flex items-center gap-3">
              <Scale className="size-5 text-accent" strokeWidth={1.5} aria-hidden />
              <h2 className="display text-2xl font-semibold">Imagery provenance</h2>
            </div>
            <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-text-2">
              Every photograph in CryoLens was retrieved from Wikimedia Commons with its licence and author recorded
              at ingest time — the machine-readable record ships with the repo at
              <code className="numeral mx-1 rounded bg-surface-2 px-1.5 py-0.5 text-[11px]">public/img/PROVENANCE.json</code>
              and is shown per asset in the lightbox. Illustrations generated for this demo (the YETI character sheets, the
              &ldquo;scattered to one window&rdquo; frame, the story cover and the museum concept) are recorded in the same file
              and always captioned as AI-generated — they illustrate ideas; they never document real events. In production,
              NCPOR&apos;s own archive would be ingested the same way: credit is metadata, not decoration.
            </p>
          </section>
        </Reveal>

        {/* Accessibility */}
        <Reveal>
          <section id="accessibility" className="scroll-mt-24" aria-label="Accessibility">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-sunrise" strokeWidth={1.5} aria-hidden />
              <h2 className="display text-2xl font-semibold">Accessibility & performance</h2>
            </div>
            <ul className="mt-4 grid max-w-[68ch] gap-2 text-sm leading-relaxed text-text-2">
              {[
                "WCAG 2.1 AA targets: semantic landmarks, keyboard-complete navigation, visible focus rings, skip-to-content link.",
                "prefers-reduced-motion honoured globally — the globe holds still, scroll choreography switches off, arcs stop animating.",
                "Three-language chrome — English · हिन्दी · বাংলা — restored before first paint, with Devanagari and Bengali typography tuned and expansion to all 22 scheduled languages on the roadmap.",
                "Poster-first hero: imagery renders before WebGL mounts; a 2D expedition map takes over if WebGL is unavailable.",
                "Light utility theme for Vault, Gyaan, Admin and Search — tuned for dense reading, not just aesthetics.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* Roadmap — documented features this build intentionally does not fake */}
        <Reveal>
          <section id="roadmap" className="scroll-mt-24" aria-label="On the roadmap">
            <div className="flex items-center gap-3">
              <FlaskConical className="size-5 text-violet" strokeWidth={1.5} aria-hidden />
              <h2 className="display text-2xl font-semibold">On the roadmap — not faked in this build</h2>
            </div>
            <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-text-2">
              The project documentation asks for more than any demonstration can honestly ship. These features need
              real assets, real data or consent-gated records — so YETI names them as roadmap items instead of
              simulating them.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {[
                "Sounds of the Poles — field audio ingest",
                "360° station tours — asset capture",
                "Earth-observation live layers — satellite feed",
                "WebXR field walks — device build",
                "Crew rosters — consent-gated personal data",
                "Himalayan dataset ingest — third cryosphere records",
              ].map((t) => (
                <li key={t}>
                  <ProvenanceChip p="demo" label={t} />
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* The pitch */}
        <Reveal>
          <section aria-label="The idea in one paragraph">
            <h2 className="display text-2xl font-semibold">The idea in one paragraph</h2>
            <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-text-2">
              India has 45 years of polar history — reports, datasets, photographs, films, people — and almost none
              of it is reachable by the public it belongs to. YETI argues that the archive deserves the same craft
              as the science: a globe that makes history navigable, a vault that makes data citable, a classroom
              that makes it curriculum-relevant, and a media engine that carries the story to every feed and
              every language. Explore the <Link href="/atlas" className="link-line text-accent">Atlas</Link>, the{" "}
              <Link href="/vault" className="link-line text-accent">Vault</Link>,{" "}
              <Link href="/learn" className="link-line text-accent">Polar Gyaan</Link> and the{" "}
              <Link href="/admin/dissemination" className="link-line text-accent">dissemination engine</Link> to see the argument.
            </p>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
