import type { SancharDraft } from "@/lib/types";

/* Sanchar Media Engine — demo seed.
   The "source document" is a synthetic expedition summary; the drafts below
   show exactly what the pipeline produces per channel before human review. */

export const SANCHAR_SOURCE = {
  name: "42nd Indian Antarctic Expedition — season summary",
  fileName: "exp-42-season-summary.pdf",
  pages: 6,
  demoNote:
    "This is a synthetic source document prepared for the demonstration. In production it would be an approved expedition report ingested from NCPOR systems.",
  extracted: {
    entities: ["Maitri", "Bharati", "Schirmacher Oasis", "Prydz Bay", "glaciology", "atmospheric sciences"],
    dates: ["November 2022 – February 2023"],
    numbers: ["148 pages", "12 field campaigns", "6 instruments redeployed"],
    images: 4,
  },
};

export const SANCHAR_DRAFTS: SancharDraft[] = [
  {
    id: "press-release",
    label: "Press release",
    platform: "Web / Media kit",
    confidence: "high",
    body: `India completes 42nd Antarctic expedition season; station operations continue at Maitri and Bharati

The 42nd Indian Antarctic Expedition has concluded its season plan, with field campaigns executed inland of Maitri and coastal operations off the Larsemann Hills near Bharati. The team has completed station handover to the wintering complement.

The season's work spanned glaciological surveys in the Schirmacher Oasis sector and atmospheric observations run from the station's long-term instrument suite. Twelve field campaigns and redeployment of six instruments were logged across the summer window (figures from the demonstration source document).

India has maintained a continuous Antarctic presence since the first expedition of 1981–82, and today operates two year-round Antarctic stations — Maitri (1989) and Bharati (2012) — alongside the Arctic station Himadri at Ny-Ålesund.

Note: this draft was generated from a synthetic demonstration document and is shown for pipeline illustration only.`,
  },
  {
    id: "x-thread",
    label: "X thread",
    platform: "X / Twitter · 6 posts",
    confidence: "high",
    body: `1/ India has been doing science at −40 °C since 1981. The 42nd Antarctic expedition just closed its season. What a season on the ice looks like: 🧵

2/ Twelve field campaigns inland of Maitri: stake farms re-measured, snow pits dug and logged, instruments pulled from the ice and flown home.

3/ Six instruments redeployed — the station's weather mast keeps writing the longest continuously-updated record Indian science has from Queen Maud Land.

4/ Off Bharati, coastal work in Prydz Bay: casts into the bay's water masses, the ocean engine that connects Antarctic ice to the Indian monsoon.

5/ Stations handed to the wintering teams. They will hold Maitri and Bharati through polar night — months of darkness, −40 °C, and aurora overhead.

6/ 42 flags on the ice since 1981. The archive of all of them now lives in one place: YETI Knows. Now You Can Too!. (Demo thread generated from a synthetic report.)`,
  },
  {
    id: "instagram",
    label: "Instagram caption",
    platform: "Instagram · carousel",
    confidence: "medium",
    notes: "Carousel order suggested from 4 ingested images; final image selection requires rights check.",
    body: `Home is where the ice is. ❄

The 42nd Indian Antarctic expedition season is done: 12 field campaigns inland of Maitri, coastal science off Bharati, instruments redeployed, stations handed to the wintering crew.

Swipe for the season in frames →
#Antarctica #PolarScience #Maitri #Bharati #IndianAntarcticProgramme #NCPOR #MoES

(Demo caption generated from a synthetic document; hashtags subject to editorial approval.)`,
  },
  {
    id: "linkedin",
    label: "LinkedIn post",
    platform: "LinkedIn",
    confidence: "high",
    body: `The 42nd Indian Antarctic Expedition has concluded its season: twelve field campaigns inland of Maitri, coastal oceanography off Bharati in Prydz Bay, and redeployment of six long-term instruments across the stations' observation suites.

A continuous Indian presence on the continent since 1981–82 now rests on two year-round Antarctic stations and one in the Arctic. Each season adds to the longest unbroken observational record Indian science holds from East Antarctica.

The full archive — expedition records, datasets, imagery — is coming together on YETI, the national polar outreach portal (demonstration build).

#PolarScience #Antarctica #ClimateScience #MoES #NCPOR`,
  },
  {
    id: "newsletter",
    label: "Newsletter block",
    platform: "Email · 120 words",
    confidence: "high",
    body: `THE ICE REPORT · Season close

Forty-two Indian flags on the ice since 1981 — and the 42nd season has just closed. Twelve field campaigns ran inland of Maitri this summer; six long-term instruments were serviced and redeployed; the stations' wintering teams have taken over for the polar night.

One number to keep: 45. That is how many years India has been reading Antarctica continuously — a record written by thousands of people and kept by a handful of instruments that never sleep.

In the next issue: what the wintering crew actually does for eight months of darkness. (Demo block generated from a synthetic report.)`,
  },
  {
    id: "hindi-press",
    label: "Press release — हिन्दी",
    platform: "Web / Media kit (Hindi)",
    hindi: true,
    confidence: "review",
    notes: "Machine-translated via pipeline; human review required before publication (glossary enforced: polar = ध्रुवीय).",
    body: `भारत का 42वाँ अंटार्कटिक अभियान सीज़न पूरा करता है; मैत्री और भारती स्टेशनों पर कार्यवाही जारी

42वें भारतीय अंटार्कटिक अभियान ने अपनी मौसम योजना पूरी कर ली है। मैत्री के अंतर्देशीय क्षेत्र में हिमनद (ग्लेशियर) सर्वेक्षण और भारती स्टेशन के पास तटीय समुद्र-विज्ञान के काम संपन्न हुए। स्टेशनों का संचालन अब शीतकालीन टीमों के पास है।

इस मौसम में बारह फील्ड अभियान और छह उपकरणों की फिर से तैनाती दर्ज हुई (ये आँकड़े प्रदर्शन-हेतु दस्तावेज़ से लिए गए हैं)।

भारत 1981–82 के पहले अभियान से लगातार अंटार्कटिका में उपस्थित है, और आज दो वर्षपर्यंत अंटार्कटिक स्टेशन — मैत्री (1989) और भारती (2012) — तथा आर्कटिक में हिमाद्रि स्टेशन संचालित करता है।

(नोट: यह मसौदा मशीन-अनुवादित है; प्रकाशन से पहले मानव समीक्षा आवश्यक है।)`,
  },
  {
    id: "alt-text",
    label: "Image alt-texts",
    platform: "Accessibility · 4 assets",
    confidence: "review",
    notes: "Generated for ingested images; each needs confirmation by the photographer or data manager.",
    body: `1. "Snow-vehicle traverse team moving across the ice shelf inland of Maitri during the 42nd expedition season." (needs confirmation — subject is a demo image)

2. "Automatic weather station mast at the Schirmacher Oasis with instruments redeployed for the coming winter."

3. "Field camp tents on the plateau, illuminated by the midnight sun during a twelve-hour science window."

4. "Coastal view from the Larsemann Hills across Prydz Bay sea ice, photographed during coastal campaign work."

(Each alt-text must be confirmed against the actual image before publication — the pipeline flags, never asserts.)`,
  },
];

export const SANCHAR_STAGES = [
  { id: "upload", label: "Upload received", detail: "File accepted · hash recorded" },
  { id: "parse", label: "Parsing document", detail: "Layout model extracts text, figures, tables" },
  { id: "entities", label: "Entity extraction", detail: "Stations, places, instruments, numbers" },
  { id: "draft", label: "Drafting channels", detail: "7 channel templates, locked prompts" },
  { id: "translate", label: "हिन्दी translation", detail: "Glossary-constrained · Bhashini-class pipeline" },
  { id: "ready", label: "Ready for review", detail: "Provenance + confidence attached" },
] as const;

export const SANCHAR_TEAM = {
  reviewer: "Editorial desk",
  approver: "Communications officer",
  promptVersion: "sanchar-v0.9.3",
  model: "demo-pipeline (no external calls in this build)",
};
