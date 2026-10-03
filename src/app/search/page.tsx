import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search/SearchPageClient";

export const metadata: Metadata = {
  title: "Search",
  description: "One search box for everything polar: expeditions, stations, datasets, imagery, stories, lessons and news.",
};

export default function SearchPage() {
  return <SearchPageClient />;
}
