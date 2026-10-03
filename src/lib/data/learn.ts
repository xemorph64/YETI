import type { LearnPath } from "@/lib/types";

export const LEARN_PATHS: LearnPath[] = [
  {
    id: "polar-foundations",
    title: "Polar Foundations",
    audience: "Students · Curious beginners",
    classRange: "Class 6–8",
    theme: "Earth & life at the poles",
    minutes: 45,
    summary:
      "What exactly are the poles? What survives there, and how did India end up building homes on the ice? Start here.",
    cover: "/img/emperor-penguins.jpg",
    coverCredit: "NASA Goddard · Public domain · via Wikimedia Commons",
    provenance: "verified",
    modules: [
      {
        id: "m1",
        title: "Two ends of the Earth",
        badge: { id: "b-compass", name: "Icebreaker", description: "Completed your first polar module", icon: "compass" },
        lessons: [
          {
            id: "m1l1",
            title: "A continent and an ocean",
            minutes: 6,
            blocks: [
              {
                text: "The two poles are opposites in disguise. The Arctic is an ocean — a frozen sea surrounded by continents. Antarctica is a continent — a landmass the size of India and China combined, buried under ice and surrounded by ocean.",
              },
              {
                heading: "Why the poles are cold",
                text: "At the poles, sunlight arrives at a slant and travels through more atmosphere. In winter, the sun does not rise at all for weeks — the polar night. In summer, it never sets — the midnight sun.",
              },
              {
                heading: "Ice: the poles' signature",
                text: "About two-thirds of Earth's fresh water is locked in ice, most of it in Antarctica. If even a fraction melted, every coastline on the planet would redraw itself. That is why polar science matters to every Indian — even in cities a thousand kilometres from any glacier.",
              },
            ],
          },
          {
            id: "m1l2",
            title: "Life at the edge",
            minutes: 6,
            blocks: [
              {
                text: "Polar life is a masterclass in adaptation. Emperor penguins incubate their eggs through the Antarctic winter — males balancing eggs on their feet for months in darkness and storm. Krill, shrimp-like creatures, swarm in Southern Ocean waters and feed almost everything larger.",
              },
              {
                heading: "On land and in the sea",
                text: "Antarctica's land is nearly lifeless — mosses and lichens hold on in ice-free oases. The real biosphere is in the ocean, from krill up to seals, whales and penguins. In the Arctic, life reaches onto tundra: foxes, reindeer, and polar bears — an animal that never made it to the Antarctic.",
              },
            ],
          },
          {
            id: "m1l3",
            title: "Why scientists go south (and north)",
            minutes: 5,
            blocks: [
              {
                text: "The poles are Earth's memory and its warning system. Ice cores store ancient air — a year-by-year record of the atmosphere going back hundreds of thousands of years. Sea ice, glaciers and permafrost are among the planet's most sensitive thermometers.",
              },
              {
                heading: "India's stake",
                text: "The poles steer the monsoon through ocean and atmospheric circulation. What melts in polar seas shows up in Indian rains, coasts and fisheries. Indian scientists study both poles to read those connections.",
              },
            ],
          },
        ],
        quiz: [
          {
            q: "What is the key difference between the Arctic and Antarctica?",
            options: [
              "The Arctic is an ocean surrounded by land; Antarctica is land surrounded by ocean",
              "Antarctica is always warmer than the Arctic",
              "The Arctic has no ice at all",
              "They are the same place at different times of year",
            ],
            answer: 0,
            explanation:
              "The Arctic is a frozen ocean; Antarctica is a continent covered by an ice sheet. This is why their ecosystems and climates differ so much.",
          },
          {
            q: "Roughly how much of Earth's fresh water is locked in ice?",
            options: ["About 10%", "About one-quarter", "About two-thirds", "All of it"],
            answer: 2,
            explanation:
              "Around two-thirds of Earth's fresh water sits in ice, mostly in the Antarctic ice sheet — which is why polar melt matters for global sea level.",
          },
          {
            q: "Which animal incubates its egg through the Antarctic winter?",
            options: ["Polar bear", "Emperor penguin", "Arctic fox", "Albatross"],
            answer: 1,
            explanation:
              "Male emperor penguins balance the single egg on their feet through the polar night, fasting for months until the chick hatches.",
          },
        ],
      },
      {
        id: "m2",
        title: "India at the poles",
        badge: { id: "b-flag", name: "Flag on the Ice", description: "Know India's polar story", icon: "flag" },
        lessons: [
          {
            id: "m2l1",
            title: "1981: the first landing",
            minutes: 5,
            blocks: [
              {
                text: "In 1981–82, a 21-member team led by Dr. S.Z. Qasim made India's first Antarctic expedition, landing on the ice shelf off Queen Maud Land. Within a single decade, India would go from visitor to year-round resident.",
              },
              {
                heading: "A station follows",
                text: "In 1983, the third expedition built Dakshin Gangotri on the ice shelf — India's first Antarctic station. It was later buried by accumulating snow, a story told in YETI's first story, 'The Station That Sank'.",
              },
            ],
          },
          {
            id: "m2l2",
            title: "Maitri, Bharati, Himadri",
            minutes: 6,
            blocks: [
              {
                text: "Maitri (1989) is India's inland Antarctic station in the Schirmacher Oasis. Bharati (2012) is the modern coastal station in the Larsemann Hills, looking out over Prydz Bay. Himadri (2008) is India's Arctic station at Ny-Ålesund, Svalbard.",
              },
              {
                heading: "One institution, two hemispheres",
                text: "These stations are operated by NCPOR — the National Centre for Polar and Ocean Research, Ministry of Earth Sciences, based in Goa. It coordinates expeditions, science programmes and India's obligations under the Antarctic Treaty.",
              },
            ],
          },
          {
            id: "m2l3",
            title: "Rules for the ice",
            minutes: 4,
            blocks: [
              {
                text: "Antarctica belongs to no country. The Antarctic Treaty (1959) reserves it for peace and science. India enacts its commitments domestically through the Indian Antarctic Act, 2022 — governing how Indians may work, protect the environment, and behave on the continent.",
              },
            ],
          },
        ],
        quiz: [
          {
            q: "When did India's first Antarctic expedition reach the ice?",
            options: ["1962–63", "1971–72", "1981–82", "1991–92"],
            answer: 2,
            explanation:
              "The first Indian Antarctic Expedition sailed in 1981–82, led by Dr. S.Z. Qasim.",
          },
          {
            q: "Which Indian station is in the Arctic?",
            options: ["Maitri", "Bharati", "Dakshin Gangotri", "Himadri"],
            answer: 3,
            explanation:
              "Himadri, established in 2008 at Ny-Ålesund, Svalbard, is India's Arctic station. The others are Antarctic.",
          },
          {
            q: "Why was Maitri built inland on rock, instead of on the ice shelf?",
            options: [
              "To be closer to the South Pole",
              "Because the ice shelf buries structures under accumulating snow",
              "Because rock is easier to drill",
              "For better mobile network coverage",
            ],
            answer: 1,
            explanation:
              "Dakshin Gangotri on the ice shelf was slowly buried by snow. Rock outcrops like the Schirmacher Oasis don't flow or accumulate the same way.",
          },
        ],
      },
      {
        id: "m3",
        title: "Reading the cryosphere",
        badge: { id: "b-aurora", name: "Aurora Hunter", description: "Completed the Polar Foundations path", icon: "sparkles" },
        lessons: [
          {
            id: "m3l1",
            title: "Glaciers: rivers you cannot drink from yet",
            minutes: 5,
            blocks: [
              {
                text: "A glacier is a river of ice, moving under its own weight. Snow falls, compresses into ice, and flows downhill. Glaciers gain mass at the top and lose it at the snout — the balance between the two is the clearest signal of a warming or cooling world.",
              },
            ],
          },
          {
            id: "m3l2",
            title: "Sea ice: the ocean's seasonal skin",
            minutes: 5,
            blocks: [
              {
                text: "Sea ice is frozen seawater, growing and shrinking with the seasons. It is not the same as ice shelves or icebergs (which come from land ice). Sea ice reflects sunlight, shelters krill, and acts as a giant seasonal switchboard for ocean circulation.",
              },
            ],
          },
          {
            id: "m3l3",
            title: "How scientists measure ice",
            minutes: 5,
            blocks: [
              {
                text: "Field teams stake out mass-balance plots, dig snow pits, and drill cores. Satellites measure ice height, speed and gravity. Ships log sea-ice from the bridge. YETI's Vault shows the kinds of records these campaigns produce — explore a synthetic dataset to see how it works.",
              },
            ],
          },
        ],
        quiz: [
          {
            q: "What is the difference between sea ice and an iceberg?",
            options: [
              "Sea ice is frozen seawater; icebergs are pieces of land ice that reached the sea",
              "Sea ice is fresh; icebergs are salty",
              "There is no difference",
              "Icebergs only exist in the Arctic",
            ],
            answer: 0,
            explanation:
              "Sea ice forms directly from freezing seawater. Icebergs calve from glaciers and ice shelves — they are compacted snow (land ice).",
          },
          {
            q: "A glacier's 'mass balance' compares…",
            options: [
              "its length to its width",
              "mass gained at the top vs mass lost at the bottom",
              "ice temperature at two depths",
              "the weight of scientists' equipment",
            ],
            answer: 1,
            explanation:
              "Accumulation minus ablation. Positive balance = growth; negative = retreat. It's the glacier's scoreboard against climate.",
          },
        ],
      },
    ],
  },
  {
    id: "ice-oceans-climate",
    title: "Ice, Oceans & Climate",
    audience: "Senior students · Teachers · General learners",
    classRange: "Class 9–10 and up",
    theme: "The polar climate engine",
    minutes: 55,
    summary:
      "How the poles drive the planet: ocean conveyor belts, ice–albedo feedback, and what Indian polar data says about a warming world.",
    cover: "/img/iceberg.jpg",
    coverCredit: "PaoMic · CC BY-SA 3.0 · via Wikimedia Commons",
    provenance: "verified",
    modules: [
      {
        id: "c1",
        title: "The ocean conveyor",
        badge: { id: "b-wave", name: "Data Diver", description: "Completed the ocean module", icon: "waves" },
        lessons: [
          {
            id: "c1l1",
            title: "The Southern Ocean engine",
            minutes: 6,
            blocks: [
              {
                text: "Around Antarctica blows the strongest current on Earth: the Antarctic Circumpolar Current, connecting the Atlantic, Indian and Pacific basins. The Southern Ocean doesn't just carry heat — it absorbs it, along with a large share of humanity's carbon dioxide.",
              },
              {
                heading: "Cold, salty, sinking",
                text: "When sea ice forms, it leaves salt behind. The cold, salty water below sinks and spreads through the deep ocean — the downwelling limb of the global conveyor belt. What happens in polar seas eventually reaches every ocean, including the waters around India.",
              },
            ],
          },
          {
            id: "c1l2",
            title: "Why the monsoon cares about the poles",
            minutes: 6,
            blocks: [
              {
                text: "Indian rainfall is part of one planetary heat engine: excess tropical heat is exported towards the poles by atmosphere and ocean. Polar changes — shrinking sea ice, freshening surface waters — can nudge that engine in ways that show up in monsoon variability, fisheries and sea level along Indian coasts.",
              },
            ],
          },
        ],
        quiz: [
          {
            q: "Why does forming sea ice make the water below sink?",
            options: [
              "The ice absorbs the salt",
              "Salt is left behind in the water, making it colder-salty and dense",
              "The wind pushes it down",
              "Ice is heavier than water",
            ],
            answer: 1,
            explanation:
              "Freezing expels brine: the remaining water becomes saltier and denser, sinking and driving deep-ocean circulation.",
          },
          {
            q: "The Antarctic Circumpolar Current is notable for…",
            options: [
              "being the only warm current",
              "connecting the Atlantic, Indian and Pacific oceans",
              "flowing backwards every winter",
              "only existing under the ice",
            ],
            answer: 1,
            explanation:
              "It is the only current that circles the globe unobstructed, linking all three major basins.",
          },
        ],
      },
      {
        id: "c2",
        title: "Feedbacks and tipping points",
        badge: { id: "b-thermo", name: "Signal Seeker", description: "Understood polar feedback loops", icon: "thermometer" },
        lessons: [
          {
            id: "c2l1",
            title: "Ice–albedo: the mirror effect",
            minutes: 6,
            blocks: [
              {
                text: "White ice reflects sunlight; dark ocean absorbs it. Melt a little ice and the ocean warms, melting more ice — a feedback loop. It is one reason the Arctic is warming several times faster than the global average, a phenomenon called Arctic amplification.",
              },
            ],
          },
          {
            id: "c2l2",
            title: "Ice sheets and sea level",
            minutes: 6,
            blocks: [
              {
                text: "Greenland and Antarctica hold enough ice to raise global sea level by many metres — but over centuries, not years, and only if warming pushes them past thresholds scientists are still mapping. Even today's partial losses are already visible in tide-gauge records, including along the Indian coastline.",
              },
              {
                heading: "Why 'committed' melt matters",
                text: "Some changes, once triggered, unfold slowly and are hard to reverse. Polar research is largely about finding those thresholds early — before they are crossed.",
              },
            ],
          },
        ],
        quiz: [
          {
            q: "Arctic amplification means…",
            options: [
              "the Arctic is louder on radio",
              "the Arctic warms faster than the global average, partly due to melting ice reflecting less sunlight",
              "Arctic currents are stronger",
              "it snows more in the Arctic",
            ],
            answer: 1,
            explanation:
              "Loss of reflective sea ice exposes dark water that absorbs more heat — warming the region several times faster than the global mean.",
          },
          {
            q: "Why can't melting sea ice alone raise sea level much?",
            options: [
              "It can — hugely",
              "Floating ice already displaces its weight in water",
              "Sea ice never melts",
              "Sea level is measured only on land",
            ],
            answer: 1,
            explanation:
              "Like ice in a full glass, floating sea ice mostly doesn't change sea level when it melts. Land-based ice (glaciers, ice sheets) is what raises the sea.",
          },
        ],
      },
      {
        id: "c3",
        title: "Signals from Indian polar stations",
        badge: { id: "b-signal", name: "Polar Analyst", description: "Completed Ice, Oceans & Climate", icon: "activity" },
        lessons: [
          {
            id: "c3l1",
            title: "What stations actually record",
            minutes: 6,
            blocks: [
              {
                text: "At Maitri and Bharati, automatic weather stations log temperature, wind and pressure hour by hour. Ocean campaigns profile temperature and salinity in Prydz Bay. In the Arctic, the IndARC mooring watches Kongsfjorden's waters year-round.",
              },
              {
                heading: "From record to record",
                text: "Each instrument writes a time series. Time series are how the planet tells us it is changing: trends, cycles, anomalies. Learn to read them and every dataset in the Vault becomes a story.",
              },
            ],
          },
          {
            id: "c3l2",
            title: "Be a data detective",
            minutes: 6,
            blocks: [
              {
                text: "Open the Vault and pick a dataset. Ask: what variable is measured, where, how often, since when? Look at the preview chart: what repeats, what trends? Every scientific claim about polar change traces back to records like these.",
              },
            ],
          },
        ],
        quiz: [
          {
            q: "Why do scientists love long time series?",
            options: [
              "They look impressive",
              "Trends and cycles only become visible over many years",
              "They are cheaper to store",
              "Charts look better with more dots",
            ],
            answer: 1,
            explanation:
              "Climate is a signal buried in noisy weather. Length of record is what separates real trends from random variation.",
          },
          {
            q: "The IndARC mooring watches…",
            options: [
              "Antarctic krill",
              "Kongsfjorden's waters in the Arctic",
              "the monsoon over Kerala",
              "the South Pole telescope",
            ],
            answer: 1,
            explanation:
              "IndARC is India's moored ocean observatory in Kongsfjorden, Svalbard — deployed from the Himadri-era Arctic programme.",
          },
        ],
      },
    ],
  },
];

export const BADGES = LEARN_PATHS.flatMap((p) => p.modules.map((m) => m.badge));

export function getLearnPath(id: string) {
  return LEARN_PATHS.find((p) => p.id === id);
}
