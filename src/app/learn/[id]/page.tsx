import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEARN_PATHS, getLearnPath } from "@/lib/data/learn";
import { LearnPathClient } from "@/components/learn/LearnPathClient";

export function generateStaticParams() {
  return LEARN_PATHS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = getLearnPath(id);
  if (!p) return { title: "Learning path not found" };
  return { title: `${p.title} — Polar Gyaan`, description: p.summary };
}

export default async function LearnPathPage({ params }: PageProps<"/learn/[id]">) {
  const { id } = await params;
  const path = getLearnPath(id);
  if (!path) notFound();
  return <LearnPathClient path={path} />;
}
