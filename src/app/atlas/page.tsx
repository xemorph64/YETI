import type { Metadata } from "next";
import { AtlasClient } from "@/components/atlas/AtlasClient";

export const metadata: Metadata = {
  title: "Expedition Atlas",
  description:
    "Every Indian polar expedition since 1981 plotted on an interactive 3D globe — routes, stations and the archive behind them.",
};

export default function AtlasPage() {
  return <AtlasClient />;
}
