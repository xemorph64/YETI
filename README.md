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
npm run build      # 100/100 routes prerender as static HTML
npm run start      # serve the production build
```

Node 20+. No environment variables, databases or API keys — the entire archive ships with the app.

## What's inside

| Route | Purpose |
| --- | --- |
| `/` | Poster-first WebGL hero (Goa → poles), 45-years editorial timeline, section hub |
| `/atlas` | **Signature feature** — Expedition Atlas: 59 schematic arcs from Goa, year scrubber (1981→2026), programme/decade filters, arc & station drawers, orbit camera |
| `/expeditions`, `/expeditions/[id]` | Editorial archive of every Indian polar expedition since 1981 |
| `/stations`, `/stations/[slug]` | Maitri, Bharati, Himadri, Dakshin Gangotri + "A Day Here" light-cycle (illustrated, not computed) |
| `/vault`, `/vault/datasets/[slug]` | Research interface: facets, licences, citation hooks, demo CSV download (labelled synthetic) |
| `/gallery` | CryoLens credited imagery, masonry + lightbox + per-asset provenance |
| `/stories`, `/stories/[slug]` | Documentary scrollytelling — "The Station That Sank" |
| `/learn`, `/learn/[id]` | Polar Gyaan: learning paths, quizzes, badges, **working** Junior Polar Scientist certificate |
| `/newsroom` | Provenance-first newsroom |
| `/search` | Full-page search (also `⌘K` anywhere; typo-tolerant; zero-result → Ask YETI handoff) |
| `/about` | Data honesty, imagery provenance, accessibility statements |
| `/researcher` | **Researcher workspace** — overview, Polar Knowledge Graph, collections with BibTeX/RIS export, contribution desk with status tracking |
| `/researcher/graph` | **Polar Knowledge Graph** — walk real relationships between expeditions, stations, datasets, publications and themes |
| `/admin/sanchar` | **Sanchar Media Engine** — upload → extract → draft (7 channels) → review → approve → publish → export with `PROVENANCE.txt` audit trail |
| `/admin/ingestion` | **Upload centre** — simulated documented pipeline: validation → SHA-256 → OCR → metadata extraction → entity linking → duplicate check, with curator correction |
| `/admin/review` | **Scientific review** — researcher submissions & access requests decided here; only approval makes content discoverable |
| `/admin/audit` | **Audit trail** — every upload, metadata change, review, approval, AI generation and access decision |
| `/museum` | **Museum bridge (proposed concept)** — QR → story → expedition flow + kiosk profile (`?kiosk=1`) |

**Ask YETI** (floating, bottom-right) answers **only** from the archive and always shows its sources —
*no citation, no answer*. It refuses to answer outside its corpus rather than improvising.

## Sign-in & the three experiences

The public archive needs no account. The two staffed experiences sit behind a **demo sign-in** (`/login`,
browser-local session only — no network calls, no real accounts):

| Experience | Demo credentials | Unlocks |
| --- | --- | --- |
| Public visitor | none needed | Everything in the archive |
| Researcher | `meera@yeti.demo` / `yeti-demo` (any well-formed email works) | Knowledge graph, collections & citations, contributions, restricted-data access requests |
| NCPOR Admin | `steward@ncpor.demo` / `yeti-demo` | Ingestion centre, review queues, Sanchar approvals, audit trail |

`src/lib/roles.tsx` holds the session (`signIn`/`signOut` are the seam where a production identity
provider lands); `RoleGate` wraps both workspaces, so `/researcher/**` and `/admin/**` render an honest
sign-in panel instead of leaking workspace UI.

Navigation is deliberately shallow: **Atlas · Expeditions · Vault · Stories · Learn** in the header,
everything else (Gallery, Stations, Newsroom, Museum bridge, About) under one **More** dropdown.

## Navigation & typography

Navigation follows the patterns of established archives and repositories (Zenodo's task-based entry,
LoC/Europeana breadcrumbs and facet browsing, Notion-style onboarding): a shallow five-item header +
More menu, **breadcrumbs on every detail page**, a **"Three doors into the same archive"** task hub on
the home page (visitor / researcher / NCPOR), and a dismissible **Start-here** checklist for first
visits. Body text is **IBM Plex Sans** (Space Grotesk display, JetBrains Mono reserved for data), with
comfort-tuned sizes (15 px small text, 13 px captions, 1.6 line-height) and WCAG-comfortable tertiary
contrast.

## Architecture notes

- **Next.js 16 App Router + React 19 + TypeScript**, Tailwind CSS v4 design tokens (`src/app/globals.css`),
  100 % static output (SSG) — deployable to any static host.
- **react-globe.gl / three.js**: layer data (arcs, station pins) flows through **props**; the imperative
  ref is used only for camera work (`pointOfView`, `controls`). WebGL is feature-detected
  (`src/components/globe/webgl.ts`) with a 2-D equirectangular fallback map.
- **Motion**: GSAP ScrollTrigger (hero camera descent, story parallax, timeline scrub) + Framer Motion
  (drawers, palette, micro-interactions). Every animated path checks `prefers-reduced-motion` /
  `data-reduced-motion` and collapses to static rendering.
- **Dual theme**: dark immersive routes (home/atlas/stations/stories/gallery/expeditions) vs light utility
  routes (vault/learn/admin/newsroom/search/about), chosen per route and overridable via the header toggle
  (persisted in `localStorage`).
- **Search**: prebuilt index (`src/lib/search.ts`) with group scoring and Levenshtein typo tolerance.
- **i18n**: EN/HI dictionary (`src/lib/i18n.tsx`), Devanagari font subset.
- **Data**: all records are typed modules under `src/lib/data/`, consumed only through `src/lib/api/client.ts`.
  Synthetic series use a seeded PRNG so charts are deterministic between reloads. Image credits/licences live
  in `public/img/PROVENANCE.json`.
- **Story Mode**: expedition pages follow the documented chapter structure (Objective → Journey → Field
  activity → Observation → Scientific significance → Outputs) with labelled visual vignettes — a 2.5-D
  burial cross-section (conceptual illustration) and a synthetic CTD profile. 3D/VR beyond this stays
  future scope until backed by real data.

## Data honesty rules baked into the UI

1. Verified milestones use the public historical record only.
2. Crew and scientist names are deliberately absent (consent).
3. No live station conditions — the stations pages say so explicitly.
4. Synthetic datasets are seeded, watermarked "Synthetic demo data", and excluded from citation blocks.
5. Every image records author · licence · source, in the UI and in `PROVENANCE.json`.

## Accessibility

Skip-link, `:focus-visible` aurora ring, keyboard-operable palette (`⌘K`, `↑↓`, `↵`, `Esc`) and Ask-YETI
panel, semantic landmarks, `WCAG 2.1 AA`-targeted contrast on both themes, and a full reduced-motion
fallback chain (OS setting → `data-reduced-motion` → per-component guards).

---

Concept for the Smart India Hackathon format. Best experienced with sound off, curiosity on.
