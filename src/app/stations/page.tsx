import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { STATIONS } from "@/lib/data/stations";
import { Reveal } from "@/components/ui/Reveal";
import { Kicker } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Stations",
  description: "Maitri, Bharati, Himadri and the heritage site of Dakshin Gangotri — India's four polar addresses.",
};

export default function StationsPage() {
  return (
    <div className="pb-10">
      <header className="atmos border-b border-line pb-16 pt-32 md:pt-40">
        <div className="dh-container">
          <Kicker>From the ice</Kicker>
          <h1 className="display mt-4 max-w-3xl text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            Four addresses at the ends of the Earth.
          </h1>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-text-2">
            Two year-round stations in Antarctica, one in the Arctic, and one heritage site sleeping under the ice
            shelf that once hosted it. Each station page carries its facts, history and the records that flow from it.
          </p>
        </div>
      </header>

      <div className="dh-container flex flex-col divide-y divide-line">
        {STATIONS.map((s, i) => (
          <Reveal key={s.slug}>
            <Link
              href={`/stations/${s.slug}`}
              className={`group grid items-center gap-8 py-10 md:grid-cols-[1fr_1.1fr] ${i % 2 === 1 ? "md:[&>figure]:order-first" : ""}`}
            >
              <div>
                <p className="meta-label">
                  {s.region} · {s.status === "heritage" ? `1983–1990 · heritage` : `Est. ${s.established}`}
                </p>
                <h2 className="display mt-3 text-3xl font-bold group-hover:text-accent md:text-4xl">{s.name}</h2>
                {s.namesake && <p className="mt-1 text-xs italic text-text-3">{s.namesake}</p>}
                <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-text-2">{s.summary[0]}</p>
                <span className="link-line mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  Open station record <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
                </span>
              </div>
              <figure className="overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.cover}
                  alt={`${s.name} — ${s.location}`}
                  className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </figure>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
