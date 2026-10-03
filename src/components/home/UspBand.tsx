import Link from "next/link";
import { ArrowRight, Compass, Lightbulb, PenTool } from "lucide-react";
import { T } from "@/lib/i18n";

/**
 * The one-scroll answer to "what is YETI?" — the doc's one-sentence USP
 * (§108), the Discover/Understand/Create pillars (§99) and direct jump
 * chips. Sits immediately under the hero; everything here is a link,
 * not a description (low-friction path: landing → features in one glance).
 */

const PILLARS = [
  { icon: <Compass className="size-5" strokeWidth={1.5} aria-hidden />, title: "usp.discover" as const, sub: "usp.discover.sub" as const },
  { icon: <Lightbulb className="size-5" strokeWidth={1.5} aria-hidden />, title: "usp.understand" as const, sub: "usp.understand.sub" as const },
  { icon: <PenTool className="size-5" strokeWidth={1.5} aria-hidden />, title: "usp.create" as const, sub: "usp.create.sub" as const },
];

const CHIPS = [
  { label: "usp.chip.atlas" as const, href: "/atlas" },
  { label: "usp.chip.vault" as const, href: "/vault" },
  { label: "usp.chip.learn" as const, href: "/learn" },
  { label: "usp.chip.researcher" as const, href: "/login?demo=researcher" },
  { label: "usp.chip.admin" as const, href: "/login?demo=admin" },
];

export function UspBand() {
  return (
    <section id="science" className="hairline-t relative scroll-mt-20 py-20 md:py-24" aria-label="What YETI does">
      <div className="dh-container">
        <p className="meta-label">
          <T k="usp.kicker" />
        </p>

        <p className="display mt-5 max-w-[34ch] text-balance text-2xl font-bold leading-[1.18] text-text md:max-w-[46ch] md:text-[2rem]">
          <T k="usp.one" />
        </p>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="flex flex-col gap-2 bg-surface p-6">
              <span className="text-accent">{p.icon}</span>
              <h3 className="text-lg font-bold tracking-tight text-text">
                <T k={p.title} />
              </h3>
              <p className="text-sm leading-relaxed text-text-3">
                <T k={p.sub} />
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <p className="meta-label !text-[10px]">
            <T k="usp.chips.label" />
          </p>
          <ul className="flex flex-wrap gap-2.5">
            {CHIPS.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="btn-tactile group inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2.5 text-sm font-semibold text-text-2 transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <T k={c.label} />
                  <ArrowRight className="size-3.5 text-text-3 transition-all group-hover:translate-x-0.5 group-hover:text-accent" strokeWidth={1.5} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
