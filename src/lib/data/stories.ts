import type { Story } from "@/lib/types";

export const STORIES: Story[] = [
  {
    id: "st-01",
    slug: "the-station-that-sank",
    title: "The Station That Sank",
    standfirst:
      "In 1983 India built its first Antarctic station on the ice shelf. The ice accepted the gift — then, patiently, kept it. This is the story of Dakshin Gangotri, the station now sleeping under the snow.",
    readingTime: "9 min",
    chapterCount: 7,
    cover: "/img/sea-ice.jpg",
    coverAlt: "Antarctic mountains behind pack ice and floes",
    coverCredit: "Jason Auch · CC BY 2.0 · via Wikimedia Commons",
    provenance: "verified",
    chapters: [
      {
        id: "ch-open",
        kicker: "Prologue",
        title: "A station on moving ground",
        align: "left",
        paragraphs: [
          "Every polar programme has one story it retells to every new wintering team. For India, it is the story of a station that did everything right — and sank anyway.",
          "Dakshin Gangotri was not destroyed by storm or fire. It was not abandoned in defeat. It was simply, slowly, mathematically buried by the very thing it stood on.",
        ],
        image: "/img/sea-ice.jpg",
        imageAlt: "Antarctic mountains behind pack ice and floes",
        imageCredit: "Jason Auch · CC BY 2.0 · via Wikimedia Commons",
      },
      {
        id: "ch-1981",
        kicker: "Chapter 1 · 1981–82",
        title: "First, a landing",
        align: "left",
        paragraphs: [
          "India's Antarctic programme began quietly: a 21-member team led by Dr. S.Z. Qasim sailed south for the 1981–82 season, landed on the ice shelf off Queen Maud Land, and proved that an Indian scientific presence on the continent was possible.",
          "The first expedition was a probe, not a settlement. But within a year, the plan had hardened into something bolder — not just to visit the ice, but to live on it.",
        ],
      },
      {
        id: "ch-1983",
        kicker: "Chapter 2 · 1983–84",
        title: "Building Dakshin Gangotri",
        align: "right",
        paragraphs: [
          "During the third expedition, teams raised India's first Antarctic station on the floating ice shelf of Princess Astrid Coast, at 70°27′S, 12°26′E.",
          "It was named Dakshin Gangotri — the southern Ganga — after the glacier that feeds the river of the same name at home. The symbolism was deliberate: India's rivers begin in ice; now India kept watch over the largest reservoir of ice on Earth.",
          "Through the rest of the decade the station functioned as the programme's front door: supply base, weather anchor, and home to the first wintering teams.",
        ],
        image: "/img/field-camp.jpg",
        imageAlt: "A scientific field camp on Antarctic terrain",
        imageCredit: "Wilfried Bauer · CC BY-SA 3.0 · via Wikimedia Commons",
      },
      {
        id: "ch-ice",
        kicker: "Chapter 3 · The physics",
        title: "The shelf is not still",
        align: "left",
        paragraphs: [
          "An ice shelf looks eternal and is anything but. It is a slow river: gaining mass from snowfall on top, losing mass to the sea below and at its edges, creeping outward the whole time.",
          "A station on the shelf does not sit — it rides. And every year, the shelf deposits a new blanket of snow on its roofs. Engineers call it accumulation. Over decades it compounds, and anything left standing still simply becomes part of the stratigraphy.",
        ],
        chart: {
          caption:
            "Illustrative accumulation curve — snow depth over a station's footprint. Synthetic values for storytelling, not observations.",
          unit: "m of accumulated snow",
          label: "Years after construction",
          series: [0.4, 0.9, 1.4, 1.9, 2.5, 3.2, 3.9, 4.7],
          highlight: "By year 6–8, a structure can be metres under.",
        },
      },
      {
        id: "ch-move",
        kicker: "Chapter 4 · 1989",
        title: "The move inland",
        align: "right",
        paragraphs: [
          "The programme's answer was not to fight the shelf but to leave it. Across the 1980s, eyes turned to the Schirmacher Oasis — a strip of ice-free rock where buildings could stand on ground that does not flow.",
          "In 1989, Maitri was commissioned there, a few dozen kilometres inland from where Dakshin Gangotri stood. India's Antarctic presence moved from the ice to the stone, and has wintered continuously ever since.",
        ],
        image: "/img/maitri-station.jpg",
        imageAlt: "Maitri station in the Schirmacher Oasis",
        imageCredit: "Prakash Khatarkar · CC BY-SA 4.0 · via Wikimedia Commons",
      },
      {
        id: "ch-buried",
        kicker: "Chapter 5 · 1990",
        title: "What remains below",
        align: "left",
        paragraphs: [
          "By 1990 Dakshin Gangotri was decommissioned. Nothing was dramatically lost — the station was simply absorbed, layer by layer, into the shelf's archive of snow.",
          "It survives as a listed historic site under the Antarctic Treaty system: a buried landmark, kilometres of white in every direction, precisely at a known position on a map of nothing.",
          "Expeditioners flying over the area still point it out — the station you cannot see, at the coordinates you can always find.",
        ],
        quote: {
          text: "The ice gives no ground. It lends it — and always takes it back.",
          attribution: "Story desk line, YETI editorial (demonstration)",
        },
      },
      {
        id: "ch-why",
        kicker: "Epilogue",
        title: "Why a sunken station matters",
        align: "left",
        paragraphs: [
          "Dakshin Gangotri taught the programme the lesson that shaped everything after it: site on rock, respect the flow, plan for the century. Bharati, built on the Larsemann Hills in 2012, is the direct descendant of that lesson.",
          "It also made the ice itself the protagonist of Indian polar science. The station that sank was the first Indian instrument for reading the ice — and reading ice is, in the end, what the whole programme is for.",
        ],
        records: [
          { label: "Station record: Dakshin Gangotri", href: "/stations/dakshin-gangotri" },
          { label: "Expedition: 3rd (1983–84)", href: "/expeditions/EXP-03" },
          { label: "Station record: Maitri", href: "/stations/maitri" },
        ],
      },
    ],
  },
];

export function getStory(slug: string) {
  return STORIES.find((s) => s.slug === slug);
}
