import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { SeaLevelLab } from "@/components/labs/SeaLevelLab";

export const metadata: Metadata = {
  title: "Sea-Level Rise explorer",
  description:
    "A simulated educational model: move the ice-loss scenario and year, and see illustrative sea-level pathways with indicative coastal exposure for four Indian coastal regions.",
};

export default function SeaLevelPage() {
  return (
    <div className="dh-container flex flex-col gap-10 pb-24 pt-28 md:pt-32">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Science Labs", href: "/labs" }, { label: "Sea-Level Rise" }]}
      />
      <header className="max-w-[70ch]">
        <h1 className="display text-balance text-4xl font-bold leading-[1.02] md:text-5xl">
          What if the ice gives more?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-2">
          Ice sheets and glaciers hold enough frozen water to redraw coastlines. This lab is an intuition pump: a
          <strong className="text-text"> simulated educational model</strong> with every assumption on the table —
          move the scenario, move the year, and watch the pathway and its coastal consequences respond together.
        </p>
      </header>
      <SeaLevelLab />
    </div>
  );
}
