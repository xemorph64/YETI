---
name: YETI
description: India's polar archive — immersive where it inspires, instrument-precise where it informs.
colors:
  polar-night: "#0a1628"
  polar-night-deep: "#071020"
  surface: "#0f1c2e"
  surface-2: "#132238"
  surface-3: "#182a3e"
  line: "rgba(167, 188, 207, 0.14)"
  line-strong: "rgba(167, 188, 207, 0.27)"
  text: "#eaf2f8"
  text-2: "#b0c3d6"
  text-3: "#7e91a7"
  signal-mint: "#3be8b0"
  signal-mint-dim: "rgba(59, 232, 176, 0.14)"
  signal-ink: "#04231a"
  arctic-violet: "#8a6cff"
  heritage-ember: "#ff8a5c"
  danger: "#ff6b6b"
  ice: "#eef6fc"
  light-bg: "#f4f9fc"
  light-bg-deep: "#eaf2f8"
  light-surface: "#ffffff"
  light-surface-3: "#dce9f2"
  light-line: "rgba(14, 27, 42, 0.12)"
  light-line-strong: "rgba(14, 27, 42, 0.24)"
  light-text: "#0e1b2a"
  light-text-2: "#41546a"
  light-text-3: "#566d84"
  light-signal-mint: "#0c8f6e"
  light-arctic-violet: "#6d4fe0"
  light-heritage-ember: "#d95a28"
  light-danger: "#c93a3a"
typography:
  statement:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  pill:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.13em"
  numeral-statement:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "clamp(5rem, 9vw, 11rem)"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  numeral:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  1: "4px"
  1.5: "6px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  10: "40px"
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  container: "1400px"
  container-tight: "1080px"
components:
  button-primary:
    backgroundColor: "{colors.signal-mint}"
    textColor: "{colors.signal-ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-2}"
  button-ghost:
    textColor: "{colors.text-2}"
    padding: "10px 16px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-2}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  chip-active:
    backgroundColor: "{colors.signal-mint-dim}"
    textColor: "{colors.signal-mint}"
  provenance-chip:
    rounded: "{rounded.full}"
    padding: "2px 8px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    height: "44px"
    padding: "0 14px"
  menu:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    width: "224px"
---

# Design System: YETI

## Overview

**Creative North Star: "YETI"**

The system is named after the product and its keeper. YETI is the creature that has been out on the ice, knows the archive, and hands it over with its sources attached. The visual world follows that: a deep polar-night field where Indian expeditions glow as signal lines, and a calm, precise instrument layer of hairlines, mono labels and provenance chips that shows how every claim is known.

Two climates share one set of tokens. **Immersive dark** (home, Atlas, stations, stories, gallery, expeditions, labs) is the field: navy depth, grain, faint aurora washes, a WebGL globe, a header that floats clear until you scroll. **Utility light** (Vault, Learn, admin, newsroom, search, about) is the reading room: cool paper, white surfaces, darker inks of the same accents. Each route picks a default, and the reader can override it. Components never fork per theme; they read the same semantic variables.

Density is moderate and editorial. Wonder carries the first viewport. After that, the interface turns quiet and exact, and the brand shows in details: a 24px accent rule before a kicker, tabular numerals, a 1px press on every button.

**Key Characteristics:**
- Polar-night navy field with grain and two faint radial washes (mint top-right, violet bottom-left)
- One primary signal colour (mint) plus two semantic accents (violet, ember) that also encode provenance
- Space Grotesk display, IBM Plex Sans reading text, JetBrains Mono for labels, numerals and data
- Hairline borders and tonal surfaces; shadows only on things that float
- Provenance chips on every record: honesty is a visible component, not a footnote
- Dual theme from one token set; reduced motion collapses everything to still

## Colors

Cold navy neutrals, one luminous signal colour and two warm/cool semantic accents, all re-inked darker for the light theme.

### Primary
- **Signal Mint** (`signal-mint`; light: `light-signal-mint`): the one voice. Primary buttons, active nav and chips, focus rings, links, kicker rules, Antarctic and Southern Ocean arcs on the globe, and the **Verified** provenance chip. Text on a mint fill uses **Signal Ink** (`signal-ink`) in dark mode and white in light.

### Secondary
- **Arctic Violet** (`arctic-violet`; light: `light-arctic-violet`): the Arctic programme (Himadri arcs and pins), the **Synthetic data** chip, the logo's pole-star dot, and the bottom-left atmospheric wash.

### Tertiary
- **Heritage Ember** (`heritage-ember`; light: `light-heritage-ember`): Dakshin Gangotri and heritage routes, the **Demo record** chip, and warm "midnight sun" moments. It is a warning-adjacent honesty colour, not decoration.

### Neutral
- **Polar Night** (`polar-night`) / **Polar Night Deep** (`polar-night-deep`): page field and the deepest wells. Also `theme-color`.
- **Surface 1–3** (`surface`, `surface-2`, `surface-3`): tonal steps for cards, hover fills, user chat bubbles and inset evidence blocks.
- **Line** / **Line Strong**: translucent ice-blue hairlines; `line` divides, `line-strong` outlines interactive things (inputs, secondary buttons, chips, menus).
- **Text 1–3** (`text`, `text-2`, `text-3`): primary copy, secondary copy, metadata and labels. Tertiary is tuned to stay WCAG-legible in both themes.
- **Ice** (`ice`): near-white for type set over imagery.
- **Light theme** (`light-*`): cool paper field, white surfaces, deep-navy inks.
- **Danger** (`danger` / `light-danger`): destructive actions and errors only.

Each accent has a `-dim` companion (about 12–16% alpha) used for chip fills and soft tints, and Tailwind `/10` and `/40` opacity steps for chip backgrounds and borders.

### Named Rules
**The Provenance Colour Rule.** Mint, violet and ember are honesty codes before they are decoration: Verified is mint, Synthetic is violet, Demo record is ember, Third-party is neutral. Never use them in a way that contradicts that mapping next to a record.

**The One Signal Rule.** Mint is the only colour that means "act here" or "you are here". Violet and ember never fill a primary button.

## Typography

**Display Font:** Space Grotesk (fallback: ui-sans-serif, system-ui)
**Body Font:** IBM Plex Sans (fallback: ui-sans-serif, system-ui)
**Label/Mono Font:** JetBrains Mono (fallback: ui-monospace)
**Indic scripts:** each family falls through per glyph to the matching Noto face (Devanagari, Bengali, Gujarati, Gurmukhi, Kannada, Malayalam, Oriya, Tamil, Telugu, Ol Chiki, Meetei Mayek, Arabic), so Latin stays on-brand and every scheduled language renders.

**Character:** a slightly technical grotesk for headlines over a humane, comfortable reading sans, with mono acting as the instrument panel. Display type is set tight and bold; reading text is set generous (17px at 1.6).

### Hierarchy
- **Statement** (700, 2.6rem → 4.4rem at lg, 1.02 leading): the home hero headline only. Once per site.
- **Display** (700, 3rem → 3.75rem at md, 0.98 leading, −0.02em, balanced): page H1s, usually capped at 24–26ch.
- **Headline** (600, 1.875rem → 2.25rem, 1.05): section headers under a Kicker, max-w-2xl.
- **Title** (700, 1.5rem → 28px): workspace and panel titles.
- **Body** (400, 17px, 1.6): reading text; long passages cap at 65ch.
- **Body small** (15px, 1.6) and **Caption** (13px, 1.5): the comfort-tuned Tailwind `text-sm`/`text-xs` overrides used across UI.
- **Pill** (500, 11px): provenance chips, source pills and step badges. The smallest size in the system.
- **Label** (JetBrains Mono 500, 0.72rem, 0.13em, uppercase, text-3): kickers, metadata, stat captions, "Sources", "Try asking".
- **Numeral** (JetBrains Mono, tabular-nums): stats, years, counts, kbd hints.
- **Numeral statement** (JetBrains Mono 700, 5rem → 11rem, 9vw so four digits always fit the year column): the pinned year in the home timeline. Decorative and `aria-hidden`; the same year is also given in text beside each milestone.

### Named Rules
**The Mono Means Data Rule.** JetBrains Mono is reserved for labels, numerals, codes and data. It is never used for sentences.

**The Comfort Floor Rule.** Running text never drops below 15px. Captions, credits and metadata sit at 13px. Functional labels (dock, kbd hints, status chips, mono kickers) sit at the 0.72rem label size. Only pills and badges may go down to 11px, and nothing goes below 11px.

## Layout

A centred container (1400px, or 1080px "tight" for reading and forms) with a fluid gutter of `clamp(1.25rem, 4vw, 3rem)`. The spacing rhythm is Tailwind's 4px base, mostly in 8 / 12 / 16 / 24px for component internals and 40px+ between groups. Section headers stack (kicker → headline → action → body) rather than splitting headline and copy into two columns.

The header is fixed at 64px (72px from md). On immersive routes it is transparent until 24px of scroll, then becomes `polar-night` at 85% with a backdrop blur and a bottom hairline. Primary nav appears from `lg`; below that, a menu and a mobile dock take over. Detail pages carry breadcrumbs. Sidebars become sticky (`top: 6rem`) from `lg`. The home hero is a 240vh scroll stage with a sticky 100dvh viewport, so the globe camera descends from Goa to Antarctica as you scroll.

Kiosk profile (`?kiosk=1`) raises the root size to 19px and narrows the container to 1200px.

## Elevation & Depth

Depth comes from tonal surfaces and atmosphere, not from stacked shadows. Resting cards are flat: a `surface` fill with a `line` hairline. Atmosphere comes from a fixed 5% fractal-noise grain over the whole page and the `atmos` field (two faint radial washes over `polar-night`). Shadows are reserved for elements that physically float above the page.

### Shadow Vocabulary
- **Raised** (`0 24px 48px -24px rgba(4,10,20,0.8)` dark; `0 24px 48px -28px rgba(20,40,60,0.25)` light): menus, the Ask YETI panel, drawers, the search palette.
- **Card** (`0 16px 32px -20px rgba(4,10,20,0.7)` dark; `0 12px 28px -20px rgba(20,40,60,0.28)` light): the rare lifted card, such as a lightbox or certificate.
- **Signal halo** (`0 0 0 1px` of `glow-line`): range thumbs and active map pins only.

### Named Rules
**The Float-Only Shadow Rule.** If it does not overlay other content, it has no shadow. Use a hairline instead.

## Shapes

The form language is soft-rectangular with a clear radius ladder: 6px for buttons and small controls, 8px for inputs, list rows and inset blocks, 12px for cards, menus and panels (the workhorse), 16px for chat bubbles and large media, and full pills for chips, provenance chips, dots and avatars. Chat bubbles pinch one corner to 2px toward the speaker. Borders are always 1px hairlines; the one 2px stroke is the left accent rule on Ask YETI evidence blocks. The logo is a four-point pole star inside a hairline circle.

## Components

The feel is instrument-precise and quiet: hairlines, small mono labels, a tactile 1px press, and the brand in the details.

### Buttons
- **Shape:** gently squared (6px).
- **Primary:** Signal Mint fill with Signal Ink text, semibold 15px, 12×20px padding (10×16px for in-app buttons). Hover drops opacity to 90%.
- **Secondary:** `line-strong` hairline over translucent `surface`. Hover brightens the border to `text-3` and fills to `surface-2`.
- **Ghost:** text only, `text-2` → `text` on hover.
- **Danger:** `danger` at 50% for the border and text; hover adds a 10% tint.
- **Press:** every button and link-button uses the tactile press: `translateY(1px) scale(0.985)` with a 180ms expo-out ease.

### Chips
- **Filter chip:** full pill, `line-strong` hairline, `surface` fill, `text-2`. Active state is a 60% mint border, `signal-mint-dim` fill and mint text, exposed with `aria-pressed`.
- **Provenance chip:** an 11px medium pill with a 12px 1.5-stroke icon, tinted per the Provenance Colour Rule (10% fill, 40% border). It appears on every record.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** `surface` on the page field.
- **Shadow Strategy:** none at rest (Float-Only Shadow Rule).
- **Border:** 1px `line`.
- **Internal Padding:** 24px standard, 20px compact, 16px dense.

### Inputs / Fields
- **Style:** 44px tall, 8px radius, `line-strong` hairline, `surface` (or `polar-night`) fill, 14px side padding, placeholder in `text-3`.
- **Focus:** the border shifts to 60% mint. The global `:focus-visible` ring is a 2px mint outline at a 2px offset.
- **Disabled:** 50% opacity.
- **Range (timeline scrubber):** a 2px `line-strong` track with a 16px mint thumb, ringed in the page colour plus a 1px glow halo.

### Navigation
- **Header links:** 13px medium, slightly tracked, `text-2`. Hover goes to `text` with an underline that draws in from the left over 250ms. The active link is mint with `aria-current="page"`.
- **More menu:** a 224px `surface` panel with a 12px radius, `line-strong` border and Raised shadow. Rows are 15px with a `surface-2` hover; the active row is semibold mint.
- **Search trigger:** an outlined 6px pill showing a `⌘K` kbd hint in mono.
- **Mobile:** below `lg`, a full-screen menu plus a bottom dock.

### Kicker + Section Header (signature)
A 24px mint hairline followed by an uppercase mono label, then a Space Grotesk headline and a mint "action →" link that underlines on hover. This is the system's recurring signature for opening a section.

### Ask YETI (signature)
A floating mascot button at bottom right opens a 448px right-hand panel (`polar-night`, `line-strong` left border, Raised shadow). The user's turns are `surface-2` bubbles pinched at the bottom right; YETI's answers are `surface` bubbles with a hairline, pinched at the bottom left. Each answer carries an **evidence block** (`surface-2`, 2px mint left rule, a 9px mint "Evidence" label) and a row of mint source pills. If YETI has no citation, it gives no answer.

### Provenance on imagery
Every image surfaces author, licence and source in a caption or lightbox, using the same chip vocabulary.

## Do's and Don'ts

### Do:
- **Do** read colours only through the semantic variables (`--bg`, `--surface`, `--text-2`, `--accent` and the rest) so that both themes work from one component.
- **Do** open sections with the Kicker (24px mint rule + mono uppercase label) and a stacked headline.
- **Do** attach a provenance chip to every record, dataset, image and generated draft, coloured per the Provenance Colour Rule.
- **Do** use JetBrains Mono with tabular numerals for every year, count and statistic.
- **Do** keep resting surfaces flat with a 1px `line` hairline; give the Raised shadow only to menus, panels, drawers and palettes.
- **Do** give every animated path a still fallback for `prefers-reduced-motion` and `data-reduced-motion="true"`.
- **Do** use the tactile press (`btn-tactile`) on every clickable control.

### Don't:
- **Don't** fill a primary action with violet or ember, and don't use mint for anything that isn't actionable, active, or Verified.
- **Don't** set sentences in mono, or running text below 15px.
- **Don't** add drop shadows to resting cards, or a second border colour beyond `line` and `line-strong`.
- **Don't** hard-code hex values in components. The only sanctioned exception is the globe's arc colours, which mirror the tokens because WebGL cannot read CSS variables.
- **Don't** add requestAnimationFrame loops to simulations. Animate them with CSS only.
