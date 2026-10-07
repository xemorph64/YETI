"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { T } from "@/lib/i18n";
import { useRole } from "@/lib/roles";

/**
 * The one-scroll answer to "what is YETI?" — the doc's one-sentence USP
 * (§108) and direct jump chips. Sits immediately under the hero; everything here is a link,
 * not a description (low-friction path: landing → features in one glance).
 */

const CHIPS = [
  { label: "usp.chip.atlas" as const, href: "/atlas" },
  { label: "usp.chip.vault" as const, href: "/vault" },
  { label: "usp.chip.learn" as const, href: "/learn" },
  { label: "usp.chip.researcher" as const, href: "/login?demo=researcher", role: "researcher" },
  { label: "usp.chip.admin" as const, href: "/login?demo=admin", role: "admin" },
];

export function UspBand() {
  const { session } = useRole();
  // Already signed in to that workspace? Go straight there instead of back through sign-in.
  const hrefFor = (c: { href: string; role?: string }) =>
    c.role && session?.role === c.role ? `/${c.role}` : c.href;

  return (
    <section id="science" className="hairline-t relative scroll-mt-20 py-20 md:py-24" aria-label="What YETI does">
      <div className="dh-container">
        <p className="meta-label">
          <T k="usp.kicker" />
        </p>

        <p className="display mt-5 max-w-[34ch] text-balance text-2xl font-bold leading-snug text-text md:max-w-[46ch] md:text-3xl">
          <T k="usp.one" />
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <p className="meta-label">
            <T k="usp.chips.label" />
          </p>
          <ul className="flex flex-wrap gap-2.5">
            {CHIPS.map((c) => (
              <li key={c.href}>
                <Link
                  href={hrefFor(c)}
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
