import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/chrome/Breadcrumbs";
import { MonsoonLinkLab } from "@/components/labs/MonsoonLinkLab";

export const metadata: Metadata = {
  title: "Arctic ↔ Monsoon link",
  description:
    "A conceptual, six-stage pathway from Arctic sea-ice change to Indian monsoon research — every stage tagged observed, modelled or hypothesis, with uncertainty made part of the visual.",
};

export default function MonsoonLinkPage() {
  return (
    <div className="dh-container flex flex-col gap-10 pb-24 pt-28 md:pt-32">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Science Labs", href: "/labs" }, { label: "Arctic ↔ Monsoon link" }]}
      />
      <header className="max-w-[70ch]">
        <h1 className="display text-balance text-4xl font-bold leading-[1.02] md:text-5xl">
          How could the Arctic reach the monsoon?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-2">
          One of the most India-relevant questions in polar science. This lab walks the research chain —
          <strong className="text-text"> Arctic conditions → atmospheric processes → possible teleconnections → Asian climate → Indian monsoon research</strong> —
          and is honest at every step about what is observed, what is modelled, and what is still hypothesis.
          An animated pathway is an explanatory device, never evidence that one specific weather event was caused
          by Arctic change.
        </p>
      </header>
      <MonsoonLinkLab />
    </div>
  );
}
