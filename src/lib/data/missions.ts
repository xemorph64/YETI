/* ---------------------------------------------------------------------------
   SCIENCE MISSIONS — the seven documented mission themes (§47) presented as
   self-guided activities. Each mission links real records in this build:
   a Vault dataset, a graph view and a Learn module, so "doing the mission"
   always means going somewhere, never ticking a fake box.
--------------------------------------------------------------------------- */

export interface MissionStep {
  label: string;
  href: string;
  kind: "dataset" | "graph" | "learn" | "lab" | "story";
}

export interface ScienceMission {
  id: string;
  code: string;
  title: string;
  question: string;
  summary: string;
  theme: string;
  minutes: number;
  steps: MissionStep[];
}

export const MISSIONS: ScienceMission[] = [
  {
    id: "ice-and-climate",
    code: "M1",
    title: "Ice & climate",
    question: "How do we know the ice is changing?",
    summary:
      "Read the mass-balance record: stake farms, snow pits and the balance between gain and loss that makes glacier health measurable.",
    theme: "Glaciology",
    minutes: 15,
    steps: [
      { label: "Open the Schirmacher SMB transects", href: "/vault/datasets/schirmacher-smb-transects", kind: "dataset" },
      { label: "Trace Glaciology in the knowledge graph", href: "/researcher/graph", kind: "graph" },
      { label: "Read the Learn module on reading ice", href: "/learn/polar-foundations", kind: "learn" },
      { label: "Run the ice-core layer reveal", href: "/labs", kind: "lab" },
    ],
  },
  {
    id: "southern-ocean-engine",
    code: "M2",
    title: "The Southern Ocean engine",
    question: "Where does the ocean's heat go?",
    summary:
      "Follow the Goa–Prydz Bay corridor: XBT sections, water-mass structure and the downwelling limb of the global conveyor.",
    theme: "Oceanography",
    minutes: 20,
    steps: [
      { label: "Open the Southern Ocean XBT transect", href: "/vault/datasets/southern-ocean-xbt", kind: "dataset" },
      { label: "Compare the Prydz Bay CTD profiles", href: "/vault/datasets/prydz-bay-ctd", kind: "dataset" },
      { label: "Read the ocean conveyor module", href: "/learn/ice-oceans-climate", kind: "learn" },
    ],
  },
  {
    id: "polar-monsoon-link",
    code: "M3",
    title: "Polar–monsoon linkages",
    question: "Can the poles really reach the Indian rain?",
    summary:
      "Test the pathway yourself: from Arctic sea ice through circulation to the monsoon — with every stage tagged by how well it is established.",
    theme: "Climate linkages",
    minutes: 15,
    steps: [
      { label: "Run the Climate ↔ Monsoon Link lab", href: "/labs/monsoon-link", kind: "lab" },
      { label: "Read the 'why the monsoon cares' lesson", href: "/learn/ice-oceans-climate", kind: "learn" },
      { label: "Follow the Oceanography theme in the graph", href: "/researcher/graph", kind: "graph" },
    ],
  },
  {
    id: "polar-life",
    code: "M4",
    title: "Life at the edges",
    question: "What survives here, and how?",
    summary:
      "From krill swarms to moss banks: biodiversity baselines in the least sampled ecosystems on Earth, and the sentinel lakes that respond within a season.",
    theme: "Polar biology",
    minutes: 15,
    steps: [
      { label: "Open the Larsemann Hills lake chemistry", href: "/vault/datasets/larsemann-lake-chemistry", kind: "dataset" },
      { label: "Read the 'life at the edge' lesson", href: "/learn/polar-foundations", kind: "learn" },
      { label: "Browse wildlife imagery in CryoLens", href: "/gallery", kind: "story" },
    ],
  },
  {
    id: "atmosphere-and-aurora",
    code: "M5",
    title: "Atmosphere & aurora",
    question: "What does the sky above the ice record?",
    summary:
      "Hourly weather masts, middle-atmosphere winds and the auroral oval: the atmosphere as a layered instrument, read from the ground up.",
    theme: "Atmospheric sciences",
    minutes: 15,
    steps: [
      { label: "Open the Maitri AWS hourly series", href: "/vault/datasets/maitri-aws-hourly", kind: "dataset" },
      { label: "Read the aurora science page", href: "/science/aurora", kind: "story" },
      { label: "Follow Atmospheric sciences in the graph", href: "/researcher/graph", kind: "graph" },
    ],
  },
  {
    id: "three-cryospheres",
    code: "M6",
    title: "Three cryospheres",
    question: "How are Antarctica, the Arctic and the Himalaya different?",
    summary:
      "One word, three systems: a continent of ice, a frozen ocean, and the mountains that feed India's rivers — compared through the records of each.",
    theme: "Cryosphere",
    minutes: 20,
    steps: [
      { label: "Read the Himalayan cryosphere page", href: "/science/himalaya", kind: "story" },
      { label: "Compare Arctic fjord data (IndARC mooring)", href: "/vault/datasets/indarc-mooring-temperature", kind: "dataset" },
      { label: "Run the sea-level rise lab", href: "/labs/sea-level", kind: "lab" },
    ],
  },
  {
    id: "stations-and-stewardship",
    code: "M7",
    title: "Stations & stewardship",
    question: "How do you live and work on the ice without breaking it?",
    summary:
      "Station logistics, environmental protocols and the treaty rules — the unglamorous discipline that keeps four decades of presence sustainable.",
    theme: "Environmental monitoring",
    minutes: 15,
    steps: [
      { label: "Tour the stations", href: "/stations", kind: "story" },
      { label: "Read the story of Dakshin Gangotri", href: "/stories/the-station-that-sank", kind: "story" },
      { label: "Learn the rules for the ice", href: "/learn/polar-foundations", kind: "learn" },
    ],
  },
];

export function getMission(id: string) {
  return MISSIONS.find((m) => m.id === id);
}
