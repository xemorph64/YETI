"use client";

/**
 * Task-based entry, the Zenodo/Google-Arts pattern applied to YETI's
 * three documented experiences: instead of hoping visitors discover the
 * research and admin surfaces, the home page names the doors and what's
 * behind each one. Adapts to the current session.
 */

import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { useRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

export function ThreeDoors() {
  const { session } = useRole();

  const doors = [
    {
      icon: <Users className="size-5" strokeWidth={1.5} aria-hidden />,
      tone: "accent" as const,
      title: "I'm exploring",
      who: "Everyone, no account",
      lines: ["Fly the Expedition Atlas & timelines", "Read documentary stories & the newsroom", "Learn polar science in Polar Gyaan"],
      cta: { label: "Start from the Atlas", href: "/atlas" },
    },
    {
      icon: <GraduationCap className="size-5" strokeWidth={1.5} aria-hidden />,
      tone: "accent" as const,
      title: "I'm a researcher",
      who: "Demo sign-in: meera@yeti.demo",
      lines: ["Walk the Polar Knowledge Graph", "Build collections, export BibTeX/RIS", "Contribute records into scientific review"],
      cta: { label: session?.role === "researcher" ? "Open your workspace" : "Enter the workspace", href: session?.role === "researcher" ? "/researcher" : "/login?next=researcher" },
      signedIn: session?.role === "researcher",
    },
    {
      icon: <ShieldCheck className="size-5" strokeWidth={1.5} aria-hidden />,
      tone: "violet" as const,
      title: "I'm NCPOR staff",
      who: "Demo sign-in: steward@ncpor.demo",
      lines: ["Run the ingestion & review pipeline", "Approve publications in Sanchar", "Decide access requests, audit everything"],
      cta: { label: session?.role === "admin" ? "Open the console" : "Enter the console", href: session?.role === "admin" ? "/admin" : "/login?next=admin" },
      signedIn: session?.role === "admin",
    },
  ];

  return (
    <section className="hairline-t py-24" aria-label="Choose your way in">
      <div className="dh-container">
        <div className="max-w-[64ch]">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-text md:text-4xl">
            Three doors into the same archive.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-2">
            One portal, three experiences — pick the door that matches what you came to do. Every door reaches the
            same verified records; they just open different tools.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {doors.map((d) => (
            <div
              key={d.title}
              className={cn(
                "flex flex-col rounded-2xl border p-6 transition-colors",
                d.signedIn ? "border-accent/50 bg-accent-dim" : "border-line bg-surface hover:border-line-strong",
              )}
            >
              <div className="flex items-center justify-between">
                <span className={d.tone === "violet" ? "text-violet" : "text-accent"}>{d.icon}</span>
                {d.signedIn && (
                  <span className="rounded-full border border-accent/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                    your desk
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-text">{d.title}</h3>
              <p className="mt-0.5 text-xs text-text-3">{d.who}</p>
              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {d.lines.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-sm leading-relaxed text-text-2">
                    <ArrowRight className="mt-1 size-3.5 shrink-0 text-text-3" strokeWidth={1.5} aria-hidden />
                    {l}
                  </li>
                ))}
              </ul>
              <Link
                href={d.cta.href}
                className="btn-tactile group mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong px-4 py-2.5 text-sm font-semibold text-text hover:border-accent/50 hover:text-accent"
              >
                {d.cta.label}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
