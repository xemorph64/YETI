import type { Metadata } from "next";
import { ResearcherShell } from "@/components/researcher/ResearcherShell";

export const metadata: Metadata = {
  title: "Researcher workspace",
  description: "Advanced discovery, collections, citations and contribution tools for polar researchers.",
};

export default function ResearcherLayout({ children }: { children: React.ReactNode }) {
  return <ResearcherShell>{children}</ResearcherShell>;
}
