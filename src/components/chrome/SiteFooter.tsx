import Link from "next/link";
import { Logo } from "@/components/chrome/SiteHeader";

const COLS = [
  {
    title: "Explore",
    links: [
      { label: "Expedition Atlas", href: "/atlas" },
      { label: "Expeditions", href: "/expeditions" },
      { label: "Stations", href: "/stations" },
      { label: "Stories", href: "/stories" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Archive & Learn",
    links: [
      { label: "The Vault", href: "/vault" },
      { label: "Polar Gyaan", href: "/learn" },
      { label: "Newsroom", href: "/newsroom" },
      { label: "Search", href: "/search" },
      { label: "Researcher workspace", href: "/researcher" },
      { label: "Museum bridge (concept)", href: "/museum" },
      { label: "Admin console (demo)", href: "/admin" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About YETI", href: "/about" },
      { label: "Data honesty & provenance", href: "/about#honesty" },
      { label: "Imagery provenance", href: "/about#provenance" },
      { label: "Accessibility", href: "/about#accessibility" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="hairline-t mt-24 pb-24 pt-16 md:pb-10">
      <div className="dh-container">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col gap-5 md:col-span-1">
            <Logo />
            <p className="max-w-[38ch] text-sm leading-relaxed text-text-2">
              An integrated polar science outreach, knowledge repository and media dissemination portal — 45 years of
              Indian polar work, open to every Indian.
            </p>
            <p className="text-xs leading-relaxed text-text-3">
              Concept for MoES · National Centre for Polar and Ocean Research (NCPOR).
              <br />
              <strong className="font-semibold text-text-2">Demonstration build</strong> — not an official Government
              of India website. Imagery credits and licences are recorded per asset.
            </p>
          </div>
          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
              <p className="meta-label">{col.title}</p>
              {col.links.map((l) => (
                <Link key={l.href + l.label} href={l.href} className="link-line w-fit text-sm text-text-2 hover:text-text">
                  {l.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-text-3 md:flex-row md:items-center md:justify-between">
          <span className="numeral">YETI — Knows. Now You Can Too! · v1.0 demo</span>
          <span>Built for the Smart India Hackathon. Not an official Government of India website.</span>
        </div>
      </div>
    </footer>
  );
}
