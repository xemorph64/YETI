# DHRUVA — ध्रुव

**India's window to the poles.** An integrated polar science outreach, knowledge repository and media
dissemination portal — a concept build for MoES · National Centre for Polar and Ocean Research (NCPOR),
Smart India Hackathon, Software / Smart Education.

> **Demonstration build** — not an official Government of India website. Every piece of content carries a
> provenance chip: **Verified** (public historical record), **Demo record** (illustrative placeholder),
> **Synthetic data** (seeded, clearly labelled), or **Third-party · credited** (Wikimedia/NASA/ESA with
> licence recorded). The demo never invents expedition history, scientist identities, live weather,
> research findings or image credits.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 130 routes prerender as static HTML
npm run start      # serve the production build
```

Node 20+. No environment variables, databases or API keys — the entire archive ships with the app.

## Zero-friction entry

Landing → features → workspace in one scroll and one click: the hero carries a session-aware
"Enter your workspace" CTA, the **USP band** (one scroll down, `#science`) links Atlas, Labs, Vault,
Learn, Researcher desk and Admin console directly, the three doors offer **one-click demo sign-in**
(`/login?demo=researcher|admin` auto-enters), and a Sign-in button sits in the header on every page.

## What's inside

| Route | Purpose |
| --- | --- |
| `/` | Poster-first WebGL hero (Goa → poles), USP band, 45-years editorial timeline, section hub |
| `/atlas` | **Signature feature** — Expedition Atlas: 59 schematic arcs from Goa, year scrubber (1981→2026), programme/decade filters, arc & station drawers, orbit camera |
| `/labs`, `/labs/sea-level`, `/labs/monsoon-link` | **Science Labs** — interactive simulations: sea-level rise scenarios with coastal exposure, and the six-stage climate ↔ monsoon pathway with signal-attenuation. Both labelled *simulated educational models* with observed/modelled/hypothesis stage tags |
| `/expeditions`, `/expeditions/[id]` | Editorial archive of every Indian polar season since 1981. **Story mode** (Objective → Journey → Field activity → Observation → Significance → Outputs): per-expedition significance, schematic itinerary waypoints, objective-mapped field activities, three interactive vignettes (ice-shelf burial · CTD cast · ice-core layer reveal), YETI field-note margins, and an Outputs chapter that links the season's **actual** reports and datasets |
| `/stations`, `/stations/[slug]` | Maitri, Bharati, Himadri, Dakshin Gangotri + "A Day Here" light-cycle (illustrated, not computed) |
| `/vault`, `/vault/datasets/[slug]` | Research interface: facets, licences, citation hooks, demo CSV download (labelled synthetic) |
| `/gallery` | CryoLens credited imagery, masonry + lightbox + per-asset provenance |
| `/stories`, `/stories/[slug]` | Documentary scrollytelling — "The Station That Sank" |
| `/learn`, `/learn/[id]` | Polar Gyaan: learning paths, quizzes, badges with **mascot celebrations**, Junior Polar Scientist certificate |
| `/learn/glossary` | **Polar science glossary** — searchable, English · हिन्दी · বাংলা |
| `/learn/missions` | **Seven Science Missions** — the programme's themes as self-guided activities; every step opens a real record |
| `/participate` | **Citizen science** — image-classification demo; labels enter a clearly separated citizen-science review class, written to the audit trail |
| `/timeline` | **Polar research timeline** — every season on one line, filterable by programme and decade |
| `/science` (+ `cryosphere`, `ice-core`, `southern-ocean`, `aurora`, `himalaya`) | **Science guides** — five short explainers with CSS aurora oval and cross-links into the Vault, Labs and Learn |
| `/researchers`, `/researchers/[id]` | **Researcher directory (§55)** — demonstration personas wired into the knowledge graph; consent-gated honesty note |
| `/newsroom` | Provenance-first newsroom |
| `/search` | Full-page search (also `⌘K` anywhere; typo-tolerant; zero-result → Ask YETI handoff) |
| `/about` | Data honesty, imagery provenance, accessibility statements, honest roadmap chips |
| `/researcher` | **Researcher workspace** — overview, Polar Knowledge Graph, collections with BibTeX/RIS export, contribution desk with status tracking |
| `/researcher/graph` | **Polar Knowledge Graph** — expeditions, stations, datasets, publications, themes **and researchers** connected by real relationships |
| `/admin/dissemination` | **Social Media Dissemination** — upload → extract → draft (7 channels) → review → approve → **publish** (writes the live ledger + audit trail) with content calendar, platform preview cards, character counters, hashtags, schedule hints, ZIP/JSON/CSV export |
| `/admin/ingestion` | **Upload centre** — simulated documented pipeline: validation → SHA-256 → OCR → metadata extraction → entity linking → duplicate check, with curator correction |
| `/admin/review` | **Scientific review** — researcher submissions & access requests decided here; only approval makes content discoverable |
| `/admin/audit` | **Audit trail** — every upload, metadata change, review, approval, AI generation, publication and access decision |
| `/museum` | **Museum bridge (proposed concept)** — QR → story → expedition flow + kiosk profile (`?kiosk=1`) |

**Ask YETI** (floating, bottom-right) answers **only** from the archive and always shows its sources —
*no citation, no answer*. A 35-entry knowledge base with tokenized scoring covers every suggested
question; queries are logged to the researcher/admin analytics (zero-result queries included). It
refuses to answer outside its corpus rather than improvising.

## Sign-in & the three experiences

The public archive needs no account. The two staffed experiences sit behind a **demo sign-in** (`/login`,
browser-local session only — no network calls, no real accounts):

| Experience | Demo credentials | Unlocks |
| --- | --- | --- |
| Public visitor | none needed | Everything in the archive |
| Researcher | `meera@yeti.demo` / `yeti-demo` (any well-formed email works) | Knowledge graph, collections & citations, contributions, restricted-data access requests |
| NCPOR Admin | `steward@ncpor.demo` / `yeti-demo` | Ingestion centre, review queues, dissemination approvals & publishing, audit trail |

`src/lib/roles.tsx` holds the session (`signIn`/`signOut` are the seam where a production identity
provider lands); `RoleGate` wraps both workspaces, so `/researcher/**` and `/admin/**` render an honest
sign-in panel instead of leaking workspace UI.

Navigation is deliberately shallow: **Atlas · Labs · Expeditions · Vault · Stories · Learn** in the
header, everything else (Science, Timeline, Researchers, Participate, Gallery, Stations, Newsroom,
Museum bridge, About) under one **More** dropdown.

## Navigation & typography

Navigation follows the patterns of established archives and repositories (Zenodo's task-based entry,
LoC/Europeana breadcrumbs and facet browsing, Notion-style onboarding): a shallow six-item header +
More menu, **breadcrumbs on every detail page**, a **"Three doors into the same archive"** task hub on
the home page (visitor / researcher / NCPOR), a **USP band** one scroll from the hero, and a
dismissible **Start-here** checklist for first visits. Body text is **IBM Plex Sans** (Space Grotesk
display, JetBrains Mono reserved for data), with comfort-tuned sizes (15 px small text, 13 px
captions, 1.6 line-height) and WCAG-comfortable tertiary contrast.

## Languages

English · हिन्दी · বাংলা (`src/lib/i18n.tsx`): the header switcher persists the choice and restores it
**before first paint** (pre-hydration bootstrap — no flash, no hydration mismatch), `<html lang>`
follows, and Noto Sans Devanagari/Bengali subsets style non-Latin text. Chrome, hero, USP band, Ask
YETI (intro, answers, refusals) and footer are translated; body content carries an honest
"continues in English" notice, and instrument acronyms keep their working form in every language.

## Architecture notes

- **Next.js 16 App Router + React 19 + TypeScript**, Tailwind CSS v4 design tokens (`src/app/globals.css`),
  100 % static output (SSG) — deployable to any static host.
- **react-globe.gl / three.js**: layer data (arcs, station pins) flows through **props**; the imperative
  ref is used only for camera work (`pointOfView`, `controls`). WebGL is feature-detected
  (`src/components/globe/webgl.ts`) with a 2-D equirectangular fallback map.
- **Motion**: GSAP ScrollTrigger (hero camera descent, story parallax, timeline scrub) + Framer Motion
  (drawers, palette, micro-interactions). Simulations deliberately use CSS-only animation — no
  requestAnimationFrame loops. Every animated path checks `prefers-reduced-motion` /
  `data-reduced-motion` and collapses to static rendering.
- **Dual theme**: dark immersive routes (home/atlas/stations/stories/gallery/expeditions/labs) vs light
  utility routes (vault/learn/admin/newsroom/search/about), chosen per route and overridable via the
  header toggle (persisted in `localStorage`).
- **Search**: prebuilt index (`src/lib/search.ts`) with group scoring and Levenshtein typo tolerance.
- **Data**: all records are typed modules under `src/lib/data/`, consumed only through `src/lib/api/client.ts`.
  Synthetic series use a seeded PRNG so charts are deterministic between reloads. Image credits/licences live
  in `public/img/PROVENANCE.json`.
- **Demo store**: `src/lib/api/store.ts` is a tiny observable localStorage store (`yeti-store-v1`) standing
  in for the future FastAPI/PostgreSQL backend — approvals, publications, collections, citizen-science
  labels, query log and audit entries all update the UI live and swap to HTTP without UI changes.

## Data honesty rules baked into the UI

1. Verified milestones use the public historical record only.
2. Crew and scientist identities are deliberately absent — the researcher directory uses clearly labelled
   fictional personas (consent-gated in production).
3. No live station conditions — the stations pages say so explicitly.
4. Synthetic datasets are seeded, watermarked "Synthetic demo data", and excluded from citation blocks.
   Simulations carry "Simulated educational model — not a forecast" labels and stage tags
   (observed / modelled / hypothesis).
5. Every image records author · licence · source, in the UI and in `PROVENANCE.json`.
6. Dissemination drafts publish only after approval — and the published ledger is real state, not a
   number.

## Accessibility

Skip-link, `:focus-visible` aurora ring, keyboard-operable palette (`⌘K`, `↑↓`, `↵`, `Esc`) and Ask-YETI
panel, semantic landmarks, `WCAG 2.1 AA`-targeted contrast on both themes, and a full reduced-motion
fallback chain (OS setting → `data-reduced-motion` → per-component guards).

---

Concept for the Smart India Hackathon format. Best experienced with sound off, curiosity on.
