import type { Metadata } from "next";
import { Kicker } from "@/components/ui/primitives";
import { GalleryWithSuspense } from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "CryoLens Gallery",
  description: "The polar visual archive — credited photographs with licences, subjects and station context.",
};

export default function GalleryPage() {
  return (
    <div className="pb-6">
      <header className="atmos pb-12 pt-32 md:pt-40">
        <div className="dh-container">
          <Kicker>CryoLens · visual archive</Kicker>
          <h1 className="display mt-4 max-w-3xl text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
            Light from the ice, with its papers in order.
          </h1>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-text-2">
            Every asset carries its credit, licence and source record. Filter by subject; open any frame for full
            metadata. Video albums and 360° captures are demonstrated honestly in this build.
          </p>
        </div>
      </header>
      <GalleryWithSuspense />
    </div>
  );
}
