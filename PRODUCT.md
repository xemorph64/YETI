# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The build exists first for **Smart India Hackathon judges** (MoES · NCPOR problem statement, Software / Smart Education) evaluating a concept in a scripted, roughly seven-minute demo. When audience needs conflict, the demo story wins.

Inside the product, the public side leads with **the curious general public**: someone with no polar background who arrives, gets pulled in by the Atlas, stories and imagery, and then finds the education and data behind them. Students and teachers (Polar Gyaan), researchers (Vault, knowledge graph, citations) and journalists are served through the same archive but do not set priorities on public surfaces.

The staffed side has two roles behind a demo sign-in: **Researcher** (collections, citations, contributions, access requests) and **NCPOR Admin / communications steward** (ingestion, scientific review, dissemination approvals, audit trail). The admin persona is the real daily user of the back office.

## Product Purpose

YETI is an integrated polar science outreach portal, knowledge repository and media dissemination system for India's polar programme: 45 years of expeditions (Antarctic since 1981–82), the stations Dakshin Gangotri, Maitri, Bharati and Himadri, and Southern Ocean work. It answers the problem statement's four jobs: archive the reports, datasets, publications, imagery and institutional activity; generate content for websites; generate content for social media; and run public outreach.

Success right now means judges see a product with two halves that both work: a public experience that inspires and a back office that turns one uploaded report into approved, published outreach.

## Positioning

One archive behind every surface. The Atlas, stories, learning paths, Ask YETI answers and dissemination drafts all resolve to the same typed, provenance-labelled records, so every impressive moment can be traced to a citable source. Ask YETI answers only from the archive and refuses without a citation. Nothing generated publishes without human approval, and the published ledger and audit trail are real state.

## Operating Context

- Demonstrated live to judges; the build must hold up under a rehearsed walkthrough (hero → Atlas → story → Vault → Ask YETI → admin dissemination publish).
- Fully static Next.js build with no backend, network calls or API keys. A localStorage store (`yeti-store-v1`, `src/lib/api/store.ts`) stands in for a future FastAPI/PostgreSQL backend; `src/lib/roles.tsx` is the identity-provider seam.
- Demo credentials: researcher `meera@yeti.demo`, admin `steward@ncpor.demo` (password `yeti-demo`), plus one-click demo sign-in.
- Public archive needs no account.

## Capabilities and Constraints

- Routes and features are documented in `README.md`; the long-form intent lives in `PRD-DHRUVA-NCPOR-Polar-Portal.md` (written under the earlier name DHRUVA).
- Navigation stays shallow: six header items (Atlas · Labs · Expeditions · Vault · Stories · Learn) plus one More menu; breadcrumbs on detail pages.
- Languages: English default plus the 22 scheduled Indian languages in the switcher. Chrome and key surfaces are translated; body content may honestly say it continues in English.
- Dual theme: immersive dark routes and light utility routes, overridable by the user.
- Every animated path honours reduced motion.
- Production NFRs from the PRD (₹8,000 phone on 3G, ≤300 KB first paint, offline PWA, GIGW 3.0) are aspirations, not gates for this build.
- Out of scope: real-time telemetry, live station conditions, general e-governance, NCPOR's internal MIS.

## Brand Commitments

- **Name:** YETI is the product name. Tagline/title: "YETI Knows. Now You Can Too!" DHRUVA is a legacy name surviving in the repo, README and PRD only.
- **Mascot and assistant:** the YETI mascot (`public/img/yeti-mascot-*.jpg`) and the Ask YETI assistant are part of the identity.
- **Honesty is the voice:** the build is labelled a demonstration, not an official Government of India website. Every record carries a provenance chip: Verified, Demo record, Synthetic data, or Third-party · credited.

## Evidence on Hand

- Typed archive data under `src/lib/data/` (expeditions, stations, vault, stories, learn, glossary, researchers, newsroom, media, Ask YETI knowledge base).
- Credited third-party imagery in `public/img/` with author, licence and source in `public/img/PROVENANCE.json`; data provenance in `src/lib/data/provenance.json`.
- Verified historical milestones from the public record; PRD Appendix A fact sheet (to be verified against NCPOR publications).
- **Absent and must not be fabricated:** real scientist or crew identities (researcher directory uses labelled fictional personas), live station weather, research findings, image credits, testimonials, usage metrics, official endorsement by NCPOR or MoES.

## Product Principles

1. **Archive first.** Every striking moment is backed by a real, citable record with visible provenance.
2. **Honest by construction.** Demo, synthetic and simulated content is labelled where it appears; refuse rather than invent.
3. **Wonder opens the door, the archive holds the room.** Curiosity-led entry for the general public, with a next step into data, learning or sources from every page.
4. **AI drafts, humans approve.** Nothing generated reaches the public without review, and every decision is audited.
5. **Built for the demo, true to production.** Optimise for the judged walkthrough without faking capabilities the seams don't support.

## Accessibility & Inclusion

Targets WCAG 2.1 AA contrast on both themes, keyboard operation (skip link, focus-visible ring, ⌘K palette, Ask YETI panel), semantic landmarks, and a full reduced-motion fallback chain. Multilingual by design with English default and Indian-language UI chrome.
