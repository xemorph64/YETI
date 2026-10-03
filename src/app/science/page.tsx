import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Atom, FlaskConical, MountainSnow, Snowflake, Waves } from "lucide-react";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { Kicker } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "The science",
  description: "The five research areas behind YETI: the cryosphere, ice cores, the Southern Ocean, the aurora and the Himalayan cryosphere.",
};

const TOPICS = [
  {
    href: "/science/cryosphere",
    icon: Snowflake,
    title: "The cryosphere",
    blurb: "Ice sheets, glaciers and sea ice — the frozen part of the water cycle, and the planet's most sensitive thermometer.",
  },
  {
    href: "/science/ice-core",
    icon: FlaskConical,
    title: "Ice cores",
    blurb: "A tape recorder made of ice: how layered snow turns into a year-by-year archive of past atmosphere and climate.",
  },
  {
    href: "/science/southern-ocean",
    icon: Waves,
    title: "The Southern Ocean",
    blurb: "The ocean engine that connects Antarctic ice to the Indian monsoon — India's Goa–Prydz Bay corridor, explained.",
  },
  {
    href: "/science/aurora",
    icon: Atom,
    title: "The aurora",
    blurb: "Solar wind, magnetic field lines and glowing skies: the physics of the southern and northern lights over the stations.",
  },
  {
    href: "/science/himalaya",
    icon: MountainSnow,
    title: "The Himalayan cryosphere",
    blurb: "India's third cryosphere — the glaciers that feed the subcontinent's rivers, studied with the same tools as the poles.",
  },
];

export default function SciencePage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Science" }]} />
          <Kicker>Behind the archive</Kicker>
          <h1 className="display mt-3 max-w-[24ch] text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            The science behind the records
          </h1>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-text-2">
            YETI is an archive, but the records only matter because of the questions they answer. Five short
            guides to the research areas NCPOR works on — each linked to the datasets, labs and lessons in this
            build that let you go deeper.
          </p>
        </div>
      </header>

      <div className="dh-container grid gap-5 py-12 md:grid-cols-2 xl:grid-cols-3">
        {TOPICS.map((t) => (
          <Link key={t.href} href={t.href} className="btn-tactile group flex flex-col rounded-xl border border-line bg-surface p-6 hover:border-accent/50">
            <t.icon className="size-6 text-accent" strokeWidth={1.5} aria-hidden />
            <h2 className="display mt-4 text-lg font-semibold text-text group-hover:text-accent">{t.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-text-2">{t.blurb}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
              Read the guide
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
            </span>
          </Link>
        ))}

        <div className="flex flex-col justify-between rounded-xl border border-dashed border-line-strong bg-transparent p-6">
          <div>
            <p className="meta-label">Try it yourself</p>
            <h2 className="display mt-4 text-lg font-semibold text-text">Science Labs</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-2">
              Interactive simulations of two documented research questions — sea-level rise scenarios and the
              climate–monsoon pathway — honestly labelled as educational models.
            </p>
          </div>
          <Link href="/labs" className="btn-tactile mt-5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-bold text-accent-ink">
            Enter the labs <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
