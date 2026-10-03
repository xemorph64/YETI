import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, ClipboardList, GraduationCap, Printer } from "lucide-react";
import { LEARN_PATHS, BADGES } from "@/lib/data/learn";
import { Reveal } from "@/components/ui/Reveal";
import { Kicker } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Polar Gyaan",
  description: "Curriculum-mapped polar science learning paths for Class 6–10: lessons, quizzes, badges and the Junior Polar Scientist certificate.",
};

const TEACHER_RESOURCES = [
  {
    title: "Lesson plan: Two ends of the Earth (45 min)",
    detail: "Warm-up map exercise → poles comparison table → penguin adaptation video discussion → exit ticket. Prints on one sheet.",
  },
  {
    title: "Lesson plan: India at the poles (45 min)",
    detail: "1981 timeline reading → station fact-file group work → quiz relay → Junior Polar Scientist badge assignment.",
  },
  {
    title: "Assessment bank (12 questions)",
    detail: "Ready-to-use MCQs with explanations, mapped to the module quizzes — for unit tests and science fairs.",
  },
];

export default function LearnPage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-14 pt-32 md:pt-40">
        <div className="dh-container grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Kicker>Polar Gyaan · Smart Education</Kicker>
            <h1 className="display mt-4 text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
              Learn the poles. Earn the ice.
            </h1>
            <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-text-2">
              Two learning paths, seven modules, checkpoint quizzes with real explanations, collectible badges — and
              a certificate generated in your browser. Built to run on low bandwidth, in English and Hindi.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-bg p-5">
            <p className="meta-label mb-3">How it works</p>
            <ol className="flex flex-col gap-2.5 text-sm text-text-2">
              {["Choose a path for your class", "Read short lessons", "Pass checkpoint quizzes", "Collect module badges", "Claim the certificate"].map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="numeral flex size-6 shrink-0 items-center justify-center rounded-full border border-accent/50 text-[11px] font-bold text-accent">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </header>

      {/* Paths */}
      <div className="dh-container grid gap-8 py-14 md:grid-cols-2">
        {LEARN_PATHS.map((p, i) => (
          <Reveal key={p.id} delay={i * 90}>
            <Link href={`/learn/${p.id}`} className="btn-tactile group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.cover}
                alt=""
                className="aspect-[16/8] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="flex flex-1 flex-col p-6">
                <p className="meta-label">{p.classRange} · {p.minutes} min · {p.theme}</p>
                <h2 className="display mt-2.5 text-2xl font-semibold group-hover:text-accent">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-2">{p.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  {p.modules.length} modules · {p.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
                  <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Science missions */}
      <section className="dh-container pt-14" aria-label="Science missions">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-6">
          <div>
            <h2 className="display text-xl font-semibold text-text">Seven Science Missions</h2>
            <p className="mt-1 max-w-[60ch] text-sm text-text-2">
              The programme&apos;s science themes as self-guided investigations — every step opens a real dataset,
              graph view, lab or lesson from this archive.
            </p>
          </div>
          <Link href="/learn/missions" className="btn-tactile rounded-lg bg-accent-fill px-5 py-2.5 text-sm font-bold text-accent-ink">
            Start a mission →
          </Link>
        </div>
      </section>

      {/* Badge wall */}
      <section className="dh-container" aria-label="Badges">
        <div className="rounded-xl border border-line bg-surface p-8">
          <div className="flex items-center gap-3">
            <Award className="size-5 text-accent" strokeWidth={1.5} aria-hidden />
            <h2 className="display text-xl font-semibold">The badge wall</h2>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {BADGES.map((b) => (
              <li key={b.id} className="flex flex-col items-center gap-2 text-center">
                <span className="flex size-14 items-center justify-center rounded-full border border-line text-text-3">
                  <Award className="size-6" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="text-xs font-semibold text-text">{b.name}</span>
                <span className="text-[10px] leading-tight text-text-3">{b.description}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-text-3">
            Badges persist in your browser (localStorage). No account, no personal data — that is deliberate.
          </p>
        </div>
      </section>

      {/* Teacher zone */}
      <section id="teachers" className="dh-container scroll-mt-24 pt-14" aria-label="Teacher Zone">
        <div className="grid gap-8 rounded-xl border border-line bg-surface p-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <GraduationCap className="size-5 text-violet" strokeWidth={1.5} aria-hidden />
              <h2 className="display text-xl font-semibold">Teacher Zone</h2>
            </div>
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-text-2">
              Everything on this page is classroom-ready: no login, no data collection, printable on a school
              printer. Lesson plans map to NCERT science themes; the quiz bank mirrors the checkpoint quizzes.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-xs text-text-2">
                <Printer className="size-3.5" strokeWidth={1.5} aria-hidden /> Print-friendly
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-xs text-text-2">
                <ClipboardList className="size-3.5" strokeWidth={1.5} aria-hidden /> Assessment bank
              </span>
            </div>
          </div>
          <ul className="flex flex-col divide-y divide-line">
            {TEACHER_RESOURCES.map((r) => (
              <li key={r.title} className="py-4">
                <p className="text-sm font-semibold text-text">{r.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-3">{r.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Glossary — approved scientific terminology */}
      <GlossarySection />
    </div>
  );
}

const GLOSSARY_TERMS: { term: string; hi: string; def: string }[] = [
  { term: "Ice shelf", hi: "बर्फ की चट्टानी", def: "A floating slab of ice fed by glaciers, projecting from the coast over the sea. Dakshin Gangotri stood on one — which is why it moved." },
  { term: "Surface mass balance", hi: "सतह द्रव्यमान संतुलन", def: "The difference between snow gained and ice lost at the surface — how glaciers gain or lose weight year to year." },
  { term: "CTD cast", hi: "सीटीडी पार्श्वचित्र", def: "An instrument lowered through the sea measuring Conductivity, Temperature and Depth — a CT scan of the water column." },
  { term: "Prydz Bay", hi: "प्रिड़ज़ खाड़ी", def: "The ocean bay beside Bharati station in East Antarctica — a natural laboratory for ocean-ice studies." },
  { term: "Schirmacher Oasis", hi: "शिरमाकर मरूद्वीप", def: "A coastal ice-free strip in Queen Maud Land, home to Maitri station and its glaciology transects." },
  { term: "Aurora australis", hi: "दक्षिणी ध्रुवप्रभा", def: "The southern lights — solar particles striking the atmosphere near the South Pole, painting the winter sky." },
  { term: "Polar night", hi: "ध्रुवीय रात्रि", def: "Weeks or months when the sun never rises — winter at stations like Maitri and Himadri." },
  { term: "Ny-Ålesund", hi: "न्यू-ओलेसुंड", def: "The international research village in Svalbard, Norway at 79°N — home to India's Arctic station, Himadri." },
  { term: "Sea ice", hi: "समुद्री बर्फ", def: "Frozen ocean water. It grows each winter and shrinks each summer, shaping climate, ecosystems and shipping." },
  { term: "Antarctic Treaty", hi: "अंटार्कटिका संधि", def: "The 1959 agreement reserving Antarctica for peace and science — the reason Dakshin Gangotri is a protected historic site." },
];

function GlossarySection() {
  return (
    <section id="glossary" className="dh-container scroll-mt-24 pt-14" aria-label="Polar glossary">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="display text-xl font-semibold text-text">Say it like a scientist</h2>
          <p className="mt-1 text-sm text-text-2">
            Ten words that unlock the archive. Hindi renderings follow the approved glossary — scientific terms
            are protected, never translated loosely.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="meta-label !text-[9px]">10 of the demo glossary</span>
          <Link href="/learn/glossary" className="link-line text-xs font-semibold text-accent">
            Full glossary — EN · हिन्दी · বাংলা →
          </Link>
        </div>
      </div>
      <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
        {GLOSSARY_TERMS.map((g) => (
          <div key={g.term} className="bg-surface px-5 py-4">
            <dt className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-sm font-semibold text-text">{g.term}</span>
              <span className="text-xs text-text-3" lang="hi">{g.hi}</span>
            </dt>
            <dd className="mt-1 text-[13px] leading-relaxed text-text-2">{g.def}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
