import type { Metadata } from "next";
import { Kicker, ProvenanceChip } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { NEWS } from "@/lib/data/newsroom";
import { formatDate } from "@/lib/utils";
import { PenLine, ShieldCheck, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Newsroom",
  description: "News, press releases and archive notes — each item carrying its editorial provenance.",
};

export default function NewsroomPage() {
  return (
    <div className="pb-16">
      <header className="border-b border-line bg-surface pb-14 pt-32 md:pt-40">
        <div className="dh-container grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Kicker>Newsroom</Kicker>
            <h1 className="display mt-4 text-balance text-5xl font-bold leading-[0.98] md:text-6xl">
              Institutional voice, with receipts.
            </h1>
            <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-text-2">
              Every item shows how it was made: drafted (by desk or by the dissemination engine), reviewed, approved.
              Media kits bundle releases with rights-cleared imagery and the fact sheet.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-line bg-bg p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-text">
              <PenLine className="size-4 text-accent" strokeWidth={1.5} aria-hidden /> Drafted
              <span className="text-text-3">→</span>
              <ShieldCheck className="size-4 text-violet" strokeWidth={1.5} aria-hidden /> Reviewed
              <span className="text-text-3">→</span>
              <UserCheck className="size-4 text-sunrise" strokeWidth={1.5} aria-hidden /> Approved
            </div>
            <p className="text-xs leading-relaxed text-text-3">
              The dissemination engine drafts; humans approve. Nothing publishes itself — the workflow is the product.
            </p>
          </div>
        </div>
      </header>

      <div className="dh-container-tight flex flex-col divide-y divide-line py-10">
        {NEWS.map((n, i) => (
          <Reveal key={n.id} delay={Math.min(i * 40, 200)}>
            <article className="py-10" aria-label={n.title}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="numeral text-xs text-text-3">{formatDate(n.date)}</span>
                <span className="rounded-full border border-line-strong px-2.5 py-0.5 text-[11px] text-text-2">
                  {n.category}
                </span>
                <ProvenanceChip p={n.provenance} />
              </div>
              <h2 className="display mt-4 max-w-3xl text-balance text-2xl font-bold leading-tight md:text-3xl">
                {n.title}
              </h2>
              <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-text-2">{n.excerpt}</p>
              <details className="group mt-4">
                <summary className="link-line inline-block cursor-pointer text-sm font-medium text-accent">
                  Read the full item
                </summary>
                <div className="mt-4 flex flex-col gap-3 border-l-2 border-line pl-5">
                  {n.body.map((p, j) => (
                    <p key={j} className="text-sm leading-relaxed text-text-2">
                      {p}
                    </p>
                  ))}
                  <dl className="mt-2 grid grid-cols-1 gap-1 text-xs text-text-3 sm:grid-cols-3">
                    <div>
                      <dt className="meta-label !text-[9px]">Drafted by</dt>
                      <dd className="mt-0.5">{n.workflow.draftedBy}</dd>
                    </div>
                    <div>
                      <dt className="meta-label !text-[9px]">Reviewed by</dt>
                      <dd className="mt-0.5">{n.workflow.reviewedBy}</dd>
                    </div>
                    <div>
                      <dt className="meta-label !text-[9px]">Approved by</dt>
                      <dd className="mt-0.5">{n.workflow.approvedBy}</dd>
                    </div>
                  </dl>
                </div>
              </details>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="dh-container-tight">
        <div className="rounded-xl border border-line bg-surface p-6">
          <p className="meta-label mb-2">Newsletter</p>
          <p className="max-w-[60ch] text-sm leading-relaxed text-text-2">
            “The Ice Report” — a monthly digest of expedition news, new records in the Vault and one dataset worth
            your attention. Subscription runs on a self-hosted list manager in the production build; the demo shows
            the format instead of collecting emails.
          </p>
        </div>
      </div>
    </div>
  );
}
