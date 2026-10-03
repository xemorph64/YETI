import Link from "next/link";
import { Construction } from "lucide-react";

export function generateStaticParams() {
  return [
    { module: "content" },
    { module: "vault" },
    { module: "cryolens" },
    { module: "review" },
    { module: "analytics" },
    { module: "users" },
  ];
}

const MODULES: Record<string, { title: string; body: string; tasks: string[] }> = {
  content: {
    title: "Content desk",
    body: "Stories, newsroom items and Gyaan modules would be authored here on a block-based CMS.",
    tasks: ["Story chapter templates", "Scheduled publishing", "Language review queues"],
  },
  vault: {
    title: "Vault curation",
    body: "Dataset metadata forms, licence assignment, version history and DOI requests.",
    tasks: ["ISO-19115-inspired forms", "Licence enforcement at publish", "Version diffs"],
  },
  cryolens: {
    title: "CryoLens ingest",
    body: "Bulk upload, AI tag suggestions, alt-text confirmation and rights checks before publish.",
    tasks: ["Perceptual-hash dedupe", "CLIP-style tag suggestions", "Mandatory credit fields"],
  },
  review: {
    title: "Review queue",
    body: "Everything awaiting a human: Sanchar drafts, alt-texts, translations, dataset submissions.",
    tasks: ["Role-scoped queues", "Diff view for edits", "SLA indicators"],
  },
  analytics: {
    title: "Analytics",
    body: "Privacy-friendly reach metrics: downloads, certificate counts, language coverage, embed usage.",
    tasks: ["Plausible-class ingestion", "No PII, cookieless", "Exportable reports"],
  },
  users: {
    title: "Users & roles",
    body: "RBAC: admin, editor, scientist, teacher. Scientists submit; editors publish; admins govern.",
    tasks: ["OIDC SSO in production", "Consent-gated crew data flags", "Audit trail per action"],
  },
};

export default async function AdminModulePage({ params }: PageProps<"/admin/[module]">) {
  const { module } = await params;
  const m = MODULES[module];
  if (!m) {
    return (
      <>
        <p className="text-sm text-text-2">Unknown admin module. Head back to the <Link href="/admin" className="link-line text-accent">dashboard</Link>.</p>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Construction className="size-5 text-sunrise" strokeWidth={1.5} aria-hidden />
          <h1 className="display text-3xl font-bold">{m.title}</h1>
        </div>
        <p className="max-w-[62ch] text-sm leading-relaxed text-text-2">{m.body}</p>
        <div className="rounded-xl border border-line bg-surface p-6">
          <p className="meta-label mb-3">What this module ships with in production</p>
          <ul className="flex flex-col gap-2.5">
            {m.tasks.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-sm text-text-2">
                <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-text-3">
          The two modules that prove the product end-to-end — the dashboard and the{" "}
          <Link href="/admin/sanchar" className="link-line text-accent">Sanchar workspace</Link> — are fully built
          in this demonstration.
        </p>
      </div>
    </>
  );
}
