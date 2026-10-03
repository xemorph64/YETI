# PRD — DHRUVA
## Integrated Polar Science Outreach, Knowledge Repository & Media Dissemination Portal

| Field | Value |
|---|---|
| **Document** | Product Requirements Document v1.0 |
| **Date** | 1 October 2026 |
| **Problem Statement** | Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal |
| **Organization** | Ministry of Earth Sciences (MoES) |
| **Department** | National Centre for Polar and Ocean Research (NCPOR), Goa |
| **Category / Theme** | Software / Smart Education |
| **Product Name** | **DHRUVA** — *Dhruva (ध्रुव) = The Pole Star* |
| **Backronym** | **D**igital **H**ub for polar **R**esearch, **U**nified **V**isualisation, **A**rchives & Awareness |
| **Tagline** | **"India's Window to the Poles."** |
| **Status** | Draft for team alignment |
| **Author** | Team DHRUVA *(fill team name / PS ID from the SIH portal)* |

---

## 0. How to read this PRD

This is not a "website with a gallery and a blog." Every year, 500 teams build that. This document specifies a **product with a soul**: a national polar archive that behaves like a living museum, a research-grade data commons, and an AI media factory in one.

Sections 1–9 define **what we build and why it wins**. Sections 10–12 are the **page-by-page build spec** (hand this to any frontend dev and they can start). Sections 13–24 cover **features, design system, architecture, compliance, metrics, and the 36-hour execution + judges' demo plan**.

---

## 1. Executive Summary

NCPOR has spent 45 years taking India to the poles — 40+ Antarctic expeditions since 1981, three stations on the ice (Dakshin Gangotri, Maitri, Bharati), the Arctic station Himadri at Ny-Ålesund, and repeated Southern Ocean cruises. Yet almost none of that story — the reports, datasets, publications, photographs, films, and human experiences — reaches the Indian public in a form that inspires, educates, or is even findable.

**DHRUVA** is a single integrated portal that:

1. **Archives** — a permanent, searchable repository of expedition reports, FAIR scientific datasets, publications, geo-tagged photos/videos, and institutional milestones.
2. **Storytells** — an immersive 3D Expedition Atlas, scrollytelling stories, and a Station Explorer that turn raw records into experiences.
3. **Educates** — a "Polar Gyaan" learning hub mapped to the NCERT curriculum with quizzes, badges, and a "Junior Polar Scientist" certificate (the Smart Education theme, made real).
4. **Disseminates** — the **Sanchar Media Engine**: an AI content factory that converts any uploaded report into press releases, tweet threads, Instagram/LinkedIn posts, newsletter blocks, and Hindi-first translations — through a human-in-the-loop approval workflow — directly answering the "generating content for websites and social media" clause of the problem statement.

**One search box finds everything. One upload produces a full media kit. One globe holds 45 years of Indian polar history.**

---

## 2. Background & Context

### 2.1 The institution
- NCPOR (est. 1998 as NCAOR, renamed 2016), Ministry of Earth Sciences, based in Vasco da Gama, Goa — India's nodal agency for polar and Southern Ocean research.
- Manages the Indian Antarctic Programme (running annually since **1981–82**), stations **Dakshin Gangotri** (1983; now a preserved heritage site), **Maitri** (1989, Schirmacher Oasis), **Bharati** (2012, Larsemann Hills), the Arctic station **Himadri** (2008, Ny-Ålesund, Svalbard), and Southern Ocean expeditions.
- Governed domestically by the **Indian Antarctic Act, 2022**; internationally engaged with SCAR, COMNAP, and Antarctic Treaty processes.

### 2.2 The gap
Today, NCPOR's public face is scattered: an institutional website, occasional press releases, PDFs buried on pages, no unified archive, no education layer, no social media production pipeline. A Class 9 student in Nagpur, a journalist in Delhi, and a glaciologist in IIT Bombay all hit the same wall: *the content exists, but it is not reachable, not usable, and not told as a story.*

### 2.3 Why now (the moment)
- The Indian Antarctic Act (2022) puts polar governance in the public eye.
- Climate literacy is a national education priority; the poles are its most dramatic classroom.
- India's polar footprint is expanding (new station planning, Thala Valley / deep-drilling initiatives, Southern Ocean research) — public narrative must scale with it.

---

## 3. Problem Statement — Verbatim & Decomposition

> *"Develop a comprehensive outreach portal that archives expedition reports, scientific datasets, publications, photographs, videos and institutional activities while generating content for websites and social media."*

Decomposed into **four verifiable jobs** (this table should appear on our slide deck — it shows we read the problem):

| # | Verbatim clause | Product job | Where it lives in DHRUVA |
|---|---|---|---|
| J1 | "archives expedition reports … datasets, publications, photographs, videos, institutional activities" | A structured, searchable **Vault** (6 content classes) with a Digital Asset Manager | §11.5 Vault, §12.2 CryoLens DAM |
| J2 | "generating content **for websites**" | Headless content API + embeddable widgets + auto web-ready pages | §12.1 Sanchar Engine, §13.6 |
| J3 | "…and **social media**" | AI generation of platform-native posts (X, Instagram, LinkedIn, YouTube) with approvals | §12.1 |
| J4 | "comprehensive **outreach** portal" | Public-facing Atlas, Stories, Learn hub, multilingual, accessible | §11, §13 |

**Explicit non-goal:** we are not a real-time instrument telemetry system, not a general e-governance portal, and not a replacement for NCPOR's internal MIS.

---

## 4. Target Users & Personas

| Persona | Profile | Goal | Pain today | DHRUVA answer |
|---|---|---|---|---|
| **Aarav**, 15 | Class 10, science fair | Wow-factor + citable facts for a project on Antarctica | Zero engaging Indian content; Wikipedia is generic | Expedition Atlas + Polar Gyaan quizzes + "Junior Polar Scientist" certificate |
| **Meera**, 34 | Govt school teacher, Nagpur | Lesson-ready material, Hindi, low bandwidth | English PDFs, no pedagogy | NCERT-mapped modules, downloadable worksheet kits, Hindi-first UI, offline PWA |
| **Dr. Ramesh**, 41 | Glaciologist, IIT | Find datasets & publications fast; cite properly | No catalogue, no metadata, dead links | FAIR data catalogue with previews, DOI-ready citations, API access |
| **Kavita**, 29 | Science journalist | Press kit: verified facts, rights-cleared images with credits | Emails NCPOR, waits days | One-click **Press Kit builder** (release + images + captions + credits + fact sheet) |
| **Priya**, 38 | NCPOR Communications Officer *(admin persona — the real daily user)* | Turn an expedition report into web + social content in minutes, with approvals and brand safety | Copies text into 6 tools, translation by hand, no archive | **Sanchar Engine**: upload once → full media pack → review → publish |
| **MoES / leadership** | Policymaker | See outreach reach and archive growth | No visibility | Admin dashboard: reach, downloads, posts generated, language coverage |

**Design implication:** the portal has *two products in one* — a beautiful public experience (Aarav/Kavita/Meera) and a serious back-office (Priya). Most teams build only the first. Judges fund teams that build both.

---

## 5. Landscape & Gap Analysis

| Existing | What it does | Gap DHRUVA fills |
|---|---|---|
| NCPOR current website | Institutional info, notices | Not story-driven, no unified archive, no media engine |
| British Antarctic Survey / "Discovering Antarctica" | UK education site | Not Indian, no data commons, no content-generation engine |
| NASA Eyes / NASA ICE, NOAA Arctic | Gorgeous visualisations | US-centric; no Indian expeditions; not an archive |
| Arctic Data Center, PANGAEA, CKAN portals | Research-grade data catalogues | User-hostile for students/public; no storytelling, no education |
| Generic school portals | Quizzes | No polar science, no primary sources |

**Our positioning:** *the only portal in the world that unifies a national polar archive, an immersive 3D atlas, a curriculum-mapped learning hub, and an AI media production engine for a national polar programme.* No existing system — Indian or international — does all four. That sentence is our defence.

---

## 6. Product Vision & Principles

> **Vision:** Every Indian — from a village school to a research lab — can stand virtually on Indian polar ice, access what our scientists discovered there, and carry the story forward.

**Design principles (non-negotiable):**
1. **Archive first.** Every pretty thing is backed by a real, citable record.
2. **Zero dead ends.** Every page ends in a next step (story → dataset → quiz → share).
3. **Hindi is first-class, English is default.** Built multilingual from migration #1.
4. **Fast on a ₹8,000 phone on 3G.** Govt school reality, not hackathon reality.
5. **AI drafts, humans approve.** Nothing auto-publishes. Trust is the product.
6. **The ice is the brand.** No stock corporate look; a glacial design language (§14).

---

## 7. USPs — The Eight Things 500 Teams Won't Have

> **U1. The Expedition Atlas** — A WebGL 3D globe (globe.gl/three.js) plotting **every Indian polar expedition since 1981** as animated arcs from Goa to the ice, with station pins, per-voyage pages (route, dates, science objectives, crew, gallery). Free NASA GIBS satellite layers (real sea-ice imagery) draped on the globe. This is the screenshot that wins the room.

> **U2. The Sanchar Media Engine** — Upload an expedition report PDF → pipeline auto-produces: press release, 6-post X thread, Instagram caption + hashtag set, LinkedIn post, YouTube description, newsletter block, **Hindi translation (via Bhashini/IndicTrans2)**, image alt-texts, and a rights-checked image shortlist — all into a review queue with diff and approve/reject/edit. **Directly satisfies the problem statement's most-underdelivered clause.**

> **U3. Ask Dhruva (RAG over the archive)** — A chat assistant grounded **only** on Vault content (pgvector + citations). "What did the 35th expedition find in Prydz Bay?" → answer with linked sources. Hallucination-guarded: no citation, no answer.

> **U4. FAIR Data Commons** — Datasets as first-class citizens: metadata (ISO-19115-inspired), in-browser preview charts (CSV/NetCDF-lite), version history, licence badges, one-click citation (BibTeX/APA), and REST/CSV download. Researchers become evangelists.

> **U5. Polar Gyaan (Smart Education made real)** — NCERT class-mapped learning paths (Climate, Geography, Biology), interactive quizzes, collectible **badges** ("Icebreaker", "Aurora Hunter"), and a downloadable **"Junior Polar Scientist" certificate** with the learner's name — the demo moment judges will remember.

> **U6. Scrollytelling Story Engine** — CMS-authored longform stories ("40 Years on the Ice", "Life at −60 °C", "The Station That Sank into the Glacier" — the true Dakshin Gangotri story) built from reusable templates: parallax image, map-scrub, data-chart, quote blocks.

> **U7. Station Explorer** — Living pages for Maitri, Bharati, Himadri, and heritage Dakshin Gangotri: fact sheets, current conditions widget (simulated feed at MVP), station maps, wintering-over crew stories, 360° panorama embeds.

> **U8. Headless & embeddable** — Every card is an embeddable widget (`<iframe>`/web-component): "Latest expedition", "Station weather", "Dataset of the week", "Photo of the week" — so DHRUVA *feeds* NCPOR's main site and MoES pages instead of competing with them. Plus RSS, sitemap, OG-cards for every object.

*(Supporting differentiators baked in: WCAG 2.1 AA + GIGW compliance, offline-capable PWA for education content, privacy-friendly analytics, image alt-text auto-generation — accessibility as a feature, not a checkbox.)*

---

## 8. Expected Solution — System Overview

```
                        ┌─────────────────────────────────────────────┐
                        │                PUBLIC PORTAL                 │
   Aarav / Meera /      │  Home · Atlas · Expeditions · Stations       │
   Kavita / Ramesh ───▶ │  Vault · Gallery · Stories · Polar Gyaan     │
                        │  Newsroom · About · Search · Ask Dhruva      │
                        └───────────────┬─────────────────────────────┘
                                        │ REST/GraphQL
        ┌───────────────────────────────┼───────────────────────────────┐
        │                     CONTENT & DATA CORE                        │
        │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────────┐  │
        │  │ Vault DB │ │ CryoLens │ │ Chronicle │ │  Gyaan Engine    │  │
        │  │ Postgres │ │   DAM    │ │ Expeditions│ │ modules/quiz/    │  │
        │  │ +PostGIS │ │ (MinIO)  │ │ +timeline │ │ certificates     │  │
        │  │ +pgvector│ └──────────┘ └───────────┘ └──────────────────┘  │
        │  └──────────┘                                                    │
        │  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
        │  │ Unified Search       │  │ Sanchar Media Engine (async)     │ │
        │  │ (Meilisearch)        │  │ extract → draft → translate →    │ │
        │  └──────────────────────┘  │ review → publish (Redis queue)   │ │
        │                            └──────────────────────────────────┘ │
        └───────────────────────────────┬───────────────────────────────┘
                                        │
        ┌───────────────────────────────┴───────────────────────────────┐
        │ ADMIN CONSOLE (Priya)   CMS · DAM · Approvals · Analytics ·    │
        │ User & roles (RBAC: admin/editor/scientist/teacher)            │
        └────────────────────────────────────────────────────────────────┘
```

**MVP rule:** everything above ships in demo-able form; depth is prioritized in §21.

---

## 9. Complete Sitemap & Navigation Model

```
DHRUVA
├── Home                                  (§11.1)
├── Expedition Atlas                      (§11.2)  ★ signature feature
├── Expeditions
│   ├── All Expeditions (filter: region/decade/vessel/theme)
│   └── Expedition Detail (route, objectives, science, crew, gallery, related data)
├── Stations
│   ├── Maitri · Bharati · Himadri · Dakshin Gangotri (heritage)
│   └── Station detail: facts, conditions widget, map, stories, gallery
├── The Vault (Knowledge Repository)
│   ├── Datasets (catalogue + preview + citation)
│   ├── Publications (papers, reports, theses)
│   ├── Expedition Reports (scanned + parsed)
│   └── Ask Dhruva (AI Q&A over the archive)
├── Gallery (CryoLens)
│   ├── Photos · Videos · 360° Panoramas
│   └── Asset detail (geo, EXIF, credit, licence, "reuse this")
├── Stories (scrollytelling)
│   └── Story detail
├── Polar Gyaan (Learn)
│   ├── Learning paths (by class/theme)
│   ├── Module detail (lessons → quiz → badge)
│   ├── Teacher Zone (worksheets, answer keys, lesson plans)
│   └── Junior Polar Scientist certificate
├── Newsroom
│   ├── News & Press Releases · Media Kit · Newsletter archive
├── About
│   ├── NCPOR · MoES · Indian Antarctic Act timeline · Contact
├── Global: Unified Search · Language switcher · Ask Dhruva (floating) · PWA install
└── /admin (Priya)
    ├── Dashboard · Content CMS (all types) · CryoLens uploads & AI tagging
    ├── Sanchar: Upload → Generated drafts → Review queue → Publish/Schedule
    ├── Vault curation (metadata, licences, DOI requests) · Users & roles
    └── Analytics (reach, downloads, posts generated, language coverage)
```

**Nav model:** top bar with 7 primary items (Home, Atlas, Expeditions, Vault, Gallery, Gyaan, Newsroom) + persistent utility row (search, language, PWA install, Ask Dhruva trigger). Mobile: bottom tab bar (5) + hamburger.

---

## 10. Hero Section — Full Specification (the first 5 seconds)

**Purpose:** in one screen, establish *scale* (45 years, 2 poles), *emotion* (wonder), and *action* (explore / learn / search).

**Layout (desktop):**
```
┌──────────────────────────────────────────────────────────────────────┐
│  [DHRUVA ❄ logo]      Atlas Expeditions Vault Gallery Gyaan  🔍 ⌄    │
├──────────────────────────────────────────────────────────────────────┤
│   bg: WebGL globe, night-lit, aurora shader ribbon, animated         │
│   expedition arcs Goa→Maitri/Bharati/Himadri slowly pulsing          │
│                                                                      │
│   INDIA HAS BEEN GOING TO THE ICE SINCE 1981.                        │
│   Almost no one has seen it. Until now.                              │
│                                                                      │
│   Explore 40+ expeditions, 3 polar stations and a living archive     │
│   of data, stories and images from the ends of the Earth.            │
│                                                                      │
│   [ ▶ Begin the Journey ]   [ 📚 Polar Gyaan for Schools ]           │
│                                                                      │
│   40+ expeditions · 3 stations · 2 polar regions · 1000s of records  │
│   ── trust strip: MoES | NCPOR | Govt. of India ──                   │
│                                          [scroll cue ▼]              │
└──────────────────────────────────────────────────────────────────────┘
```

**Copy — three tested variants (A/B/C for judges discussion):**
- **A (recommended, mystery):** "India has been going to the ice since 1981. Almost no one has seen it. Until now."
- **B (scale):** "Two poles. Three stations. Forty expeditions. One window — yours."
- **C (education-forward):** "The greatest classroom on Earth is at −60 °C. Step inside."

**Motion spec:** globe auto-rotates 0.05°/frame; arcs draw on load (staggered 400 ms); aurora = animated gradient mesh at 12% opacity behind globe; on scroll, globe eases to frame Maitri and the hero pins to a stats strip. `prefers-reduced-motion` → static hero poster + CSS fade only.

**Performance budget:** hero LCP < 2.5 s on "Fast 3G". Globe lazy-mounts; a static poster (compressed expedition photograph, art-directed) renders first, globe cross-fades in when ready. Mobile: globe becomes a tap-to-expand panorama; headline first.

**Below-hero scroll (home page skeleton):** ① "Journey in 60 seconds" intro strip ② Expedition Atlas teaser (live globe crop) ③ Latest Story (full-bleed) ④ Vault highlights (3 cards: dataset/pub/photo) ⑤ Polar Gyaan strip (badge wall + class filters) ⑥ "From the Ice Right Now" (station conditions widgets) ⑦ Newsroom row ⑧ Newsletter + footer.

---

## 11. Page-by-Page Specifications

> Format per page: **Purpose → Key sections → Hero/header → Interactions → Data needs → States (empty/loading/error) → KPI.**

### 11.1 Home — `https://dhruva.moes.gov.in/`
- **Purpose:** orient, impress, route in ≤2 clicks.
- **Sections:** as §10 skeleton. Each section ends with a CTA ("See all expeditions →").
- **Data:** featured story, latest expedition, 3 vault highlights, station snapshots, counts (from cache).
- **KPI:** bounce < 40%, ≥2.5 pages/session.

### 11.2 Expedition Atlas — `/atlas` ★
- **Purpose:** the signature wow. 3D globe = index of the entire archive.
- **Sections:** full-viewport globe; left filter rail (Region: Antarctic/Arctic/Southern Ocean · Decade · Vessel · Theme); right info drawer on selection; bottom timeline scrubber (1981 → today) that filters arcs by year.
- **Interactions:** click arc → expedition card (name, year, leader, 3 stats, CTA "Open expedition"); click station pin → mini station card; timeline play button = arcs animate year by year ("watch 45 years in 45 seconds" — press-shareable).
- **Data:** expeditions (GeoJSON routes), stations, GIBS tile layers.
- **States:** no WebGL → 2D map fallback (Leaflet); loading → globe skeleton with progress %.
- **KPI:** ≥60% of visitors interact with globe; avg session +1 min.

### 11.3 Expeditions — `/expeditions`, `/expeditions/[id]`
- **List:** filterable grid (year cards with number badge "42nd", region tag, cover photo, leader).
- **Detail:** hero (expedition patch/cover), meta strip (dates, vessel, leader, participants, station), tabbed body: **Overview → Route (embedded mini-map) → Science Highlights → Gallery strip → Reports & Data (links into Vault) → Crew**. Footer: prev/next expedition.
- **Data need:** expedition entity (§13), crew persons, linked media/datasets.

### 11.4 Stations — `/stations/[slug]`
- **Purpose:** place + presence. One page per station + heritage page for Dakshin Gangotri.
- **Sections:** hero (station photo, coordinates, "−12.4 °C now · polar night / midnight sun" widget), fact sheet (established, location, altitude, science domains, station leader), interactive station map (buildings clickable → function), photo mosaic, "Stories from this station", data from this station.
- **Special:** "A day here" light-cycle visual (sun path at 70°S) — cheap to build, unforgettable.

### 11.5 The Vault — `/vault` (datasets, publications, reports)
- **Purpose:** J1. Serious, but not intimidating: public landing is human-readable ("What will you find here?" + 3 entry cards), research mode is one click deeper.
- **Datasets list:** faceted filters (domain: glaciology/oceanography/atmosphere/biology · region · year · station · file type · licence), result cards with mini sparkline preview, licence badge (CC-BY etc.), download + citation buttons.
- **Dataset detail:** abstract, spatial/temporal coverage (mini-map + time slider), variables table, preview chart (rendered from CSV), version history, "Cite as" (APA/BibTeX copy), API snippet, related publications/expeditions.
- **Publications:** search, filter (author/year/type), abstract modal, external DOI link, "cited in expedition X" cross-links.
- **Expedition reports:** digital shelf (cover thumbnails), OCR-searchable PDFs, per-report parsed summary card.
- **KPI:** downloads; zero-result searches < 5%.

### 11.6 Gallery (CryoLens) — `/gallery`
- **Sections:** masonry grid (photos/videos/360°), filters (station, expedition, year, subject: aurora/wildlife/landscape/science ops/life on ice), lightbox with full metadata panel (location pin, date, photographer, licence, "Download web-size / Request original").
- **Special:** **Before/After slider** for repeat-glacier photos (climate storytelling); AI-suggested tags shown on hover ("tagged by CryoLens, reviewed by editor").

### 11.7 Stories — `/stories`, `/stories/[slug]`
- **Purpose:** scrollytelling engine output. Zero chrome, full immersion, reading progress bar, ambient chapter markers.
- **Launch set (3):** "The Station That Sank" (Dakshin Gangotri), "Life at −60 °C" (a winter at Maitri), "Where the Ocean Ends" (Southern Ocean cruise diary).

### 11.8 Polar Gyaan — `/learn`
- **Purpose:** the Smart Education theme, delivered as a product.
- **Sections:** class/theme filter chips; learning-path cards ("Antarctica for Class 6–8 · 4 lessons · 45 min"); badge wall; certificate CTA; Teacher Zone (separate tab: downloadable lesson plans + worksheet PDFs, aligned chapters listed).
- **Module detail:** lesson steps (text + image + optional video) → **checkpoint quiz (3–5 Qs)** → badge earned animation → next lesson. Path completion → **Junior Polar Scientist certificate** (canvas-generated PDF with learner name, date, DHRUVA seal — shareable image).
- **KPI:** certificates issued; teacher downloads; quiz completion rate.

### 11.9 Newsroom — `/newsroom`
- News & press releases (filterable), **Media Kit builder** (select assets → auto zips release + credits + fact sheet), newsletter archive (Sign up via Listmonk).
- **Proof point:** every published news item shows its provenance chip: *"Drafted by Sanchar Engine · Approved by Priya, 12 Jun 2026"*.

### 11.10 About — `/about`
- NCPOR profile, MoES family, **interactive timeline of the Indian polar programme (1981 → Act of 2022 → today)** (reuses Chronicle timeline component), careers/Citizen Charter links, contact.

### 11.11 Unified Search & Ask Dhruva
- `/search?q=` — one box across all six content classes; grouped result tabs (All / Data / Expeditions / Media / Learn / News); filters; keyboard-first (`⌘K` palette).
- **Ask Dhruva** — floating assistant; RAG over Vault; every answer carries source chips ("Sources: 35th Expedition Report, p.14 · Prydz Bay Dataset v2"); refuses without sources; language toggle (EN/HI at MVP).

### 11.12 Admin Console — `/admin` (the other product)
- **Dashboard:** pipeline health, pending approvals count, 30-day reach chart.
- **Sanchar workflow (the money screen):** `Upload report → auto-extract (text, images, dates, people) → draft pack (press release, X thread, IG, LinkedIn, newsletter, Hindi version) → side-by-side review with edit/diff → approve → publish to Newsroom + export social pack (.zip) or post via API.`
- **CryoLens:** bulk upload → AI tagging + alt-text → human confirm → publish.
- **Vault curation:** metadata forms, licence assignment, versioning.
- **RBAC:** `admin / editor / scientist / teacher` (scientists can submit datasets+reports; cannot publish).
- **Analytics:** Plausible-based, no PII.

---

## 12. Core Feature Deep-Dives

### 12.1 Sanchar Media Engine (the differentiator — full spec)
**Pipeline:** `Ingest (PDF/DOCX/MD/images) → Parse (text + captions + people + places via layout model) → Draft (LLM with locked prompt templates per channel) → Enrich (Bhashini/IndicTrans2 Hindi; alt-text for images; hashtag suggestion; fact-guard: numbers cross-checked against entity DB) → Review (editor sees draft, source highlights, edits tracked) → Publish (web) / Export (zip) / Post (API adapters) → Archive (everything versioned).`

**Channel templates (exact output shapes):**
| Channel | Output spec |
|---|---|
| Press release | 350–450 words, inverted pyramid, boilerplate + contact block, quotes pulled from report (flagged for approval) |
| X/Twitter | 6-post thread ≤280 chars each, hook post, numbering, hashtags ≤2, image attach suggestions |
| Instagram | Caption ≤150 chars + hook line + emoji policy + 10–15 hashtag set + carousel order from gallery assets |
| LinkedIn | 150–200 words, professional tone, science emphasis, link to Vault record |
| Newsletter | 120-word block with one stat callout and one image |
| Hindi edition | Full translation of press release + captions; terminology glossary enforced (पोलार → ध्रुवीय etc.) |

**Guardrails (say this to judges):** human approval mandatory; no personal data of crew without consent flag; fact-guard regex + entity check on numbers/names; every output stores its source document + prompt version (auditability); profanity/sensitivity filter; "confidence" chip per generated block.

### 12.2 CryoLens DAM
- MinIO object store; EXIF/GPS extraction; perceptual-hash dedupe; AI tag suggestions (wildlife/landscape/science classifier at MVP = open CLIP-style model + rule-based); auto alt-text; rights/credit fields mandatory before publish; bulk watermarking for web-size exports.

### 12.3 Chronicle (expedition & timeline core)
- Entities `Expedition → Legs → RoutePoints → Activities`; every archival object FKs to an expedition → cross-linking everywhere ("This photo was taken during…" chips). Powers Atlas, station pages, About timeline.

### 12.4 Gyaan Engine
- `Path → Module → Lesson → Quiz`; scoring, attempts, badges (rules engine), certificate generator (PDF + PNG); teacher accounts can view class aggregate progress (no student PII — name optional, local-only by default; DPDP-safe).

### 12.5 Unified Search
- Meilisearch indices per content class, merged UI; synonyms (Antarctic/अंटार्कटिका/Dakshin Gangotri), typo-tolerant, facet counts; `⌘K` palette; zero-result fallback → "Ask Dhruva instead" handoff.

### 12.6 Multilingual Engine
- i18n keys for UI (EN/HI at MVP; architecture ready for all 22 scheduled languages); content translation via Sanchar+Bhashini with **human review queue**; language-specific SEO (hreflang); Devanagari typography first-class (Noto Sans Devanagari tuned).

---

## 13. Content Model (core entities)

```
Expedition(id, number, name, region, vessel, start, end, leader_id,
           objectives, summary, status)
  ├─ Leg(route GeoJSON, dates, ship)
  ├─ ReportDocument(file, ocr_text, parsed_json, confidence)
  ├─ Person(id, name, role, station_year)          [consent-gated]
  ├─ MediaAsset[](via join)
  └─ Dataset[] / Publication[]

Dataset(id, title, abstract, domain, region(bbox), temporal_coverage,
        variables[], version, licence, access, file_refs, expedition_id,
        doi_pending, preview_stats)
Publication(id, title, authors[], year, venue, doi, abstract, type)
MediaAsset(id, type, file, gps, shot_at, credit, licence, alt_text,
           tags[], expedition_id, station_id, phash)
Station(id, slug, name, lat, lon, established, status, facts_json)
Story(id, slug, template, chapters_json, cover, language)
LearningPath(id, class_range, theme, modules[])
  └─ Module(lessons[], quiz)  └─ Badge(id, rule)
ContentDraft(id, source_doc, channel, body, language, status,
             reviewer_id, prompt_version, created_at)
SocialPost(id, draft_id, platform, scheduled_at, status, permalink)
```

---

## 14. Design System — "Glacial Language"

| Token | Value | Meaning |
|---|---|---|
| `ice.900 → ice.50` | `#0A1628 → #F4F9FC` | Deep polar night → surface white; primary surfaces |
| `aurora.500` | `#3BE8B0` | Aurora teal — primary accent, CTAs |
| `aurora.violet` | `#8A6CFF` | Secondary accent (data viz, badges) |
| `sunrise.500` | `#FF8A5C` | Polar sunrise — alerts, highlights, "live" states |
| `text` | `#0E1B2A` on light / `#EAF2F8` on dark | WCAG AAA body target |

- **Typography:** Display **Space Grotesk** (headlines, technical, expeditionary); Body **Inter**; **Noto Sans Devanagari** (Hindi). Scale 1.25 modular; headline tracking tight, letter case sentence-case (no shouting all-caps except numerals "40+").
- **Imagery rules:** real NCPOR assets only (with credits); duotone (ice-blue) treatment for archive/historical images to mark provenance; full-colour for contemporary.
- **Motion:** 200–400 ms, `cubic-bezier(.2,.7,.2,1)`; "ice-crack" page transition (hairline white flash at 6% opacity) used sparingly; `prefers-reduced-motion` honoured globally.
- **Iconography:** 1.5px stroke line icons + custom polar glyph set (ice core, aurora, ship, flag, penguin — drawn once, reused).
- **Accessibility:** WCAG 2.1 AA minimum (AAA body contrast), keyboard-complete, focus-visible aurora ring, GIGW 3.0 alignment (govt of India guidelines), text resize to 200%, sign-language video placeholder slot reserved for future.
- **Dark/light:** dark is the *experience* theme (Atlas, Stories); light is the *utility* theme (Vault, Admin, Gyaan) — auto + manual toggle.

---

## 15. Tech Stack (recommended, all open-source)

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js 14 (TS) + Tailwind + shadcn/ui + framer-motion** | RSC perf, one codebase for portal+admin |
| 3D | **react-globe.gl (three.js)** + NASA **GIBS** tiles | No API key, real satellite ice imagery |
| CMS/DAM | **Directus** (or Strapi) | Open-source headless CMS + media library + RBAC |
| DB | **PostgreSQL + PostGIS + pgvector** | Geo queries + RAG embeddings in one DB |
| Objects | **MinIO** (S3-compatible) | Self-hostable, gov-cloud friendly |
| Search | **Meilisearch** | Typo-tolerant, instant, self-hosted |
| Queue | **Redis + BullMQ** | Sanchar async pipeline |
| AI | **Llama-3.x / GPT-4o-class via API for drafting; Bhashini / AI4Bharat IndicTrans2 for Hindi; CLIP-style model for tagging; embeddings = bge-m3** | Indian-language stack = strategic fit with GoI |
| Newsletter | **Listmonk** | Open-source, self-hosted |
| Analytics | **Plausible** | No cookies, DPDP-friendly |
| Hosting (demo) | Vercel + Neon; (production) **MeghRaj / NIC cloud** | Gov-compliant path stated up front |

---

## 16. API Surface (v1, REST, `/api/v1`)

```
GET  /expeditions?region=&decade=&vessel=     GET  /expeditions/:id
GET  /stations/:slug                          GET  /stations/:slug/conditions
GET  /datasets?q=&domain=&region=             GET  /datasets/:id
GET  /datasets/:id/download                   GET  /datasets/:id/citation?style=
GET  /publications?q=                         GET  /reports?q=
GET  /media?type=photo&q=&expedition=         GET  /media/:id
GET  /stories                                 GET  /stories/:slug
GET  /learn/paths                             POST /learn/quiz/:id/attempt
POST /learn/certificate                       GET  /search?q=
POST /ask                                     (RAG; returns answer + sources[])
POST /admin/ingest/report                     GET  /admin/drafts?status=
POST /admin/drafts/:id/approve|reject|edit    POST /admin/media/bulk
GET  /widgets/latest-expedition  (iframe/oEmbed)
```
All public reads cached (CDN, s-maxage); auth via OIDC for admin; rate-limited; OpenAPI published.

---

## 17. Security, Privacy & Compliance

- **DPDP Act 2023:** no PII required for learners; certificates are name-in-only, processed locally; analytics cookieless.
- **GIGW 3.0 + WCAG 2.1 AA** audit before ship; CERT-In logging norms; IT Act compliance for content.
- **AI governance:** outputs never auto-publish; audit trail (source doc → prompt version → reviewer); consent flags for crew personal data; licences enforced at DAM level (no unlicensed publish).
- **Security:** OWASP Top-10 baseline, RBAC, signed URLs for media, virus scan on ingest (ClamAV), backups + restore drills.
- **Data sharing:** aligns with MoES open-data posture; dataset licences explicit; sensitive-location data (e.g., protected sites) geo-fuzzing option.

---

## 18. Non-Functional Requirements

| NFR | Target |
|---|---|
| Lighthouse (mobile) | ≥90 perf / ≥95 a11y / ≥95 SEO |
| LCP / INP / CLS | <2.5 s / <200 ms / <0.1 |
| Low-bandwidth mode | ≤300 KB first paint; "Lite" toggle; images progressive |
| Offline | Gyaan modules cached (PWA) — works in low-connectivity schools |
| Uptime (prod) | 99.5% |
| Search latency | p95 < 100 ms |
| i18n coverage at ship | EN + HI 100% UI; content priority-listed |
| Scale | 100k MAU, 50 GB media MVP without re-architecture |

---

## 19. Success Metrics (first 6 months post-launch)

| Area | KPI |
|---|---|
| Reach | 100k MAU; avg session >3 min; 30% returning |
| Education | 10k certificates issued; 500 teacher downloads/month |
| Archive | 100% of post-2000 expeditions archived; 200+ datasets published |
| Media engine | 40% reduction in comms turn-around (report → published); ≥50 posts/month generated & approved |
| Search quality | zero-result rate <5%; "Ask Dhruva" answer-with-citation rate >90% |
| Distribution | ≥10 embeds on NCPOR/MoES pages; 5k newsletter subscribers |
| Equity | ≥30% sessions in Hindi; Lighthouse a11y ≥95 maintained |

---

## 20. MVP Scope & the 36-Hour Build Plan

**MVP = the demo, not the dream:** Atlas + 12 seeded expeditions, Home, Expedition detail ×12, Stations ×4, Vault (datasets ×15 + publications ×30 + reports ×6), Gallery ×150 assets, 1 full scrollytelling story, Gyaan (2 paths, 6 lessons, quizzes, badges, certificate), Newsroom + Sanchar (upload→draft→review→publish, EN+HI), Ask Dhruva (grounded, cited), Search, admin console end-to-end.

| Hours | Track A (product) | Track B (data) | Track C (AI) |
|---|---|---|---|
| 0–4 | Design tokens, shell, hero | Schema + seed script (public facts + synthetic datasets) | Prompt templates locked |
| 4–10 | Atlas globe + arcs + GIBS | Seed 12 expeditions, 4 stations, 150 media (CC0 sources) | Ingest+parse for reports |
| 10–16 | Home, Expedition detail, Stations | Vault pages + preview charts | Hindi translation chain |
| 16–22 | Gallery, Vault, Search | Gyaan content authoring | Ask Dhruva RAG + citations |
| 22–28 | Sanchar review UI, admin dashboard | Story template + 1 story | Fact-guard + audit trail |
| 28–32 | A11y pass, perf pass, Lite mode, PWA | OG cards, RSS, widgets, embeds | Guardrail evals (20-case suite) |
| 32–36 | Demo script staging, fallback video, pitch deck | Backup seed snapshot | Prompt regression run |

**Seeding note (judge-proof honesty):** real historical facts (expedition years, station data, public datasets) + clearly-labelled synthetic sample datasets/media for anything un-publishable. Every demo record carries a provenance tag — this *builds* trust rather than hiding it.

---

## 21. Post-Hackathon Roadmap

- **P1 (1–3 mo):** production hardening, NCPOR asset ingestion sprints, Bhashini full integration, 22-language roadmap, DOI minting, social API adapters (X/YouTube/Meta), newsletter live.
- **P2 (3–9 mo):** 360° station tours, teacher dashboards with classroom codes, regional-language expansion, citizen-science module ("Help tag 10,000 archive photos"), SCAR/COMNAP data interop (OAI-PMH).
- **P3 (9–18 mo):** AR expedition cards, live station telemetry (with NCPOR approval), schools leaderboard & inter-school polar quiz championship, vernacular audio stories.

---

## 22. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| No real NCPOR data access during event | High | Curated open-data seed + provenance tags + architecture ready for real ingest |
| AI output quality drifts | Med | Locked templates, few-shot examples in prompts, fact-guard, 20-case eval suite, human approval |
| Scope creep (kitchen-sink demo) | High | §20 MVP contract; every feature must map to J1–J4 |
| Globe perf on low-end devices | Med | Poster-first, lazy WebGL, 2D fallback, device-tier detection |
| Hindi translation errors | Med | Glossary-constrained translation + human review queue visible in demo |
| Team bandwidth | Med | 3 tracks with a single design system; freeze at hour 32 |

---

## 23. Explicitly Out of Scope (MVP)

Real-time instrument feeds · social posting without approval · user-generated comments (moderation liability) · e-commerce/merch · mobile native apps · full 22 languages · historical documents beyond reports (letters/logbooks) — all on the roadmap.

---

## 24. Judges' Demo Script (7 minutes — rehearsed, scripted)

1. **Cold open (0:00–0:45):** load Home; hero globe draws Goa→Maitri arcs; read the headline; hit "Begin the Journey".
2. **Atlas (0:45–2:00):** filter "1980s" → single Dakshin Gangotri arc; press play on timeline — 45 years animate; click 42nd expedition.
3. **Archive depth (2:00–3:00):** from expedition → report PDF → back-linked dataset → citation copied → "Ask Dhruva: what did this expedition measure in Prydz Bay?" → cited answer.
4. **Sanchar live (3:00–4:45):** switch to admin; upload a 3-page expedition report; watch drafts appear; open X thread + Hindi press release; hit approve; show published Newsroom item with provenance chip; export social pack zip.
5. **Smart Education (4:45–6:15):** Polar Gyaan path → quiz → badge → generate **"Junior Polar Scientist" certificate with a judge's own name** (pre-typed input, one keystroke).
6. **Close (6:15–7:00):** split screen: the globe + the analytics dashboard; the line — *"Archive. Atlas. Classroom. Newsroom. One portal. Built for every Indian."*

**Rubric alignment:** problem-solution fit → §3 table; innovation → §7; feasibility → §15/§20; impact → §19; UX → §14; social benefit & scale → multilingual, low-bandwidth, education.

---

## Appendix A — Fact Sheet (seed content; verify against NCPOR publications before shipping)
- Indian Antarctic Programme: annual since 1981–82 (first expedition led by Dr. S.Z. Qasim).
- Stations: Dakshin Gangotri (1983, decommissioned, heritage), Maitri (1989, Schirmacher Oasis), Bharati (2012, Larsemann Hills), Himadri (2008, Ny-Ålesund, Arctic).
- NCPOR: Goa; MoES; est. 1998; renamed from NCAOR in 2016; operates ORV Sagar Kanya among other vessels.
- Legal: Indian Antarctic Act, 2022.
- 40+ expeditions to Antarctica; regular Southern Ocean cruises; multidisciplinary science: glaciology, oceanography, atmospheric sciences, biology, geology.

## Appendix B — Sample Sanchar output (from a synthetic 42nd-expedition summary, shown to judges)
> **X thread, post 1/6:** "42 Indian flags on the ice since 1981. The 42nd expedition just came home. Here's what our scientists carried back from −40 °C 🧵" — *(flagged quote for approval · source: 42nd expedition summary §2 · confidence: high)*

---

*End of PRD — DHRUVA v1.0. "Ek Prithvi, Ek Kahani, Dono Dhruv."*
