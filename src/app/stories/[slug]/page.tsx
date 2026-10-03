import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STORIES, getStory } from "@/lib/data/stories";
import { StoryReader } from "@/components/stories/StoryReader";

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return { title: "Story not found" };
  return { title: story.title, description: story.standfirst.slice(0, 150) };
}

export default async function StoryPage({ params }: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  return <StoryReader story={story} />;
}
