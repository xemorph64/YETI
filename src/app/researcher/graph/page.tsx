import type { Metadata } from "next";
import { KnowledgeGraph } from "@/components/researcher/KnowledgeGraph";

export const metadata: Metadata = {
  title: "Knowledge graph",
  description: "The Polar Knowledge Graph — expeditions, stations, researchers, datasets, publications and themes, connected.",
};

export default function GraphPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-text md:text-[28px]">Follow the connections.</h1>
        <p className="mt-1.5 max-w-[68ch] text-sm leading-relaxed text-text-2">
          Discovery through relationships: an expedition connects to the stations it visited, the themes it
          worked on, the reports that document it and the datasets and publications that grew from it. Click any
          node to walk outward two hops — or pick any two records in the tracer and watch the shortest path
          between them light up.
        </p>
      </header>
      <KnowledgeGraph />
    </div>
  );
}
