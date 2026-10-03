import Link from "next/link";
import { Compass } from "lucide-react";
import { MascotBadge } from "@/components/yeti/Mascot";

export default function NotFound() {
  return (
    <div className="dh-container flex min-h-[70vh] flex-col items-center justify-center gap-6 py-32 text-center">
      <MascotBadge state="searching" className="h-16 w-24" />
      <p className="numeral text-7xl font-bold text-text-3">−70.7°</p>
      <h1 className="display text-3xl font-bold">This coordinate is off the map.</h1>
      <p className="max-w-[48ch] text-sm leading-relaxed text-text-2">
        YETI swept the archive and came up empty — the record doesn&apos;t exist here, or hasn&apos;t been digitised yet. Try the
        Atlas or search the Vault.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-tactile rounded-md bg-accent-fill px-5 py-3 text-sm font-semibold text-accent-ink">
          <Compass className="mr-2 inline size-4" strokeWidth={1.5} aria-hidden />
          Back to the globe
        </Link>
        <Link href="/search" className="btn-tactile rounded-md border border-line-strong px-5 py-3 text-sm font-semibold text-text hover:border-text-3">
          Search the archive
        </Link>
      </div>
    </div>
  );
}
