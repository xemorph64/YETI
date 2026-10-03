import type { Station } from "@/lib/types";

export const STATIONS: Station[] = [
  {
    id: "maitri",
    slug: "maitri",
    name: "Maitri",
    namesake: "Sanskrit for 'friendship'",
    lat: -70.762,
    lng: 11.73,
    region: "Antarctic",
    location: "Schirmacher Oasis, Queen Maud Land, East Antarctica",
    established: 1989,
    status: "active",
    altitudeM: 130,
    complement: { summer: "≈ 25 people", winter: "≈ 15 people" },
    scienceDomains: ["Glaciology", "Atmospheric sciences", "Polar biology", "Human physiology"],
    facts: [
      { label: "Commissioned", value: "1989" },
      { label: "Position", value: "70°45′44″S 11°43′49″E" },
      { label: "Setting", value: "Ice-free oasis between polar ice cap and the coast" },
      { label: "Replaced", value: "Dakshin Gangotri (ice shelf, reclaimed by ice)" },
      { label: "Era", value: "Anchored Indian Antarctic science since 1989" },
    ],
    summary: [
      "Maitri is India's permanent inland Antarctic station, set in the Schirmacher Oasis — a slender strip of ice-free rock between the polar ice cap and the coastal ice shelves of Queen Maud Land.",
      "Commissioned in 1989 after Dakshin Gangotri was slowly swallowed by the moving ice shelf, Maitri has hosted wintering teams every year since, running long-term observations across glaciology, the atmosphere, and polar biology.",
      "For most expeditioners, 'going to Antarctica' still means a season at Maitri: a small, tight settlement of laboratories, living quarters, and generators holding a thin line of warmth in the polar night.",
    ],
    history: [
      { year: "1989", text: "Maitri commissioned as the successor to Dakshin Gangotri." },
      { year: "1990s", text: "Long-term glaciological and atmospheric observation programmes established." },
      { year: "2000s", text: "Continuous wintering operations; expanded biology and human-physiology studies." },
      { year: "Today", text: "Active station; gateway for inland traverses and oasis ecology work (demo detail)." },
    ],
    cover: "/img/maitri-station.jpg",
    provenance: "verified",
  },
  {
    id: "bharati",
    slug: "bharati",
    name: "Bharati",
    namesake: "Hindi for 'India'",
    lat: -69.411,
    lng: 76.195,
    region: "Antarctic",
    location: "Larsemann Hills, Prydz Bay, East Antarctica",
    established: 2012,
    status: "active",
    altitudeM: 15,
    complement: { summer: "≈ 47 people", winter: "≈ 24 people" },
    scienceDomains: ["Oceanography", "Geosciences", "Atmospheric sciences", "Polar biology"],
    facts: [
      { label: "Commissioned", value: "2012" },
      { label: "Position", value: "69°24′41″S 76°11′41″E" },
      { label: "Setting", value: "Coastal hills on the shore of Prydz Bay" },
      { label: "Design", value: "Purpose-built modern station on stilts over rock" },
      { label: "Focus", value: "Ocean, ice and earth-system observation frontage" },
    ],
    summary: [
      "Bharati is India's youngest Antarctic station — a purpose-built structure raised on the rocky shores of the Larsemann Hills, looking straight out over Prydz Bay.",
      "Where Maitri looks inland at the ice, Bharati looks seaward: oceanography, coastal ecosystems, and the Southern Ocean's role in the climate system are its front line.",
      "Its engineering is part of the story — built to sit on land without anchoring into it, an answer to decades of lessons about building on a continent that moves.",
    ],
    history: [
      { year: "2012", text: "Bharati commissioned in the Larsemann Hills." },
      { year: "2010s", text: "Coastal and oceanographic observation programmes scale up." },
      { year: "2020s", text: "Serves as springboard for Prydz Bay ocean work and upstream traverse support (demo detail)." },
    ],
    cover: "/img/bharati-station.jpg",
    provenance: "verified",
  },
  {
    id: "himadri",
    slug: "himadri",
    name: "Himadri",
    namesake: "Hindi for the abode of snow — the Himalaya",
    lat: 78.92,
    lng: 11.93,
    region: "Arctic",
    location: "Ny-Ålesund, Svalbard, Norway",
    established: 2008,
    status: "active",
    scienceDomains: ["Glaciology", "Atmospheric sciences", "Polar biology"],
    facts: [
      { label: "Established", value: "2008" },
      { label: "Position", value: "78°55′N 11°56″E" },
      { label: "Setting", value: "International Arctic research village at 79°N" },
      { label: "Significance", value: "India's first and only Arctic station" },
      { label: "Seasons", value: "Campaign-based, concentrated in the Arctic summer" },
    ],
    summary: [
      "Himadri is India's foothold in the Arctic — housed in Ny-Ålesund, Svalbard, a former coal-mining settlement turned into one of the densest clusters of polar research stations on Earth.",
      "Arctic science is a different game from Antarctic work: no national territory to build a mega-station on, but an international village where India works shoulder to shoulder with polar programmes from across the world.",
      "Himadri's campaigns track a region that is warming faster than almost anywhere else on the planet — glaciers in retreat, changing snow lines, and a shifting atmosphere.",
    ],
    history: [
      { year: "2007", text: "First Indian Arctic expedition to Ny-Ålesund." },
      { year: "2008", text: "Himadri established as India's permanent Arctic facility." },
      { year: "2010s", text: "Annual campaigns across glaciology, atmosphere and fjord systems." },
      { year: "2014", text: "IndARC mooring deployed in Kongsfjorden — India's first Arctic ocean observatory (demo detail)." },
    ],
    cover: "/img/ny-alesund.jpg",
    provenance: "verified",
  },
  {
    id: "dakshin-gangotri",
    slug: "dakshin-gangotri",
    name: "Dakshin Gangotri",
    namesake: "'Southern Ganga' — after the glacial source of the Ganga",
    lat: -70.45,
    lng: 12.43,
    region: "Antarctic",
    location: "Princess Astrid Coast, Queen Maud Land",
    established: 1983,
    decommissioned: 1990,
    status: "heritage",
    scienceDomains: ["Historic site", "Glaciology"],
    facts: [
      { label: "Established", value: "1983 — during the 3rd expedition" },
      { label: "Position", value: "70°27′S 12°26′E, on the ice shelf" },
      { label: "Fate", value: "Engulfed by accumulating ice and snow" },
      { label: "Decommissioned", value: "1990" },
      { label: "Status", value: "Recognised historic site under the Antarctic Treaty system" },
    ],
    summary: [
      "Dakshin Gangotri was India's first Antarctic station — raised on the floating ice shelf in 1983 by the third expedition team, in one of the most ambitious first-decade moves of any polar programme.",
      "The station worked. But it was built on moving ice, and every year the shelf added more snow on top. Within a few years the station was buried; by 1990 it was decommissioned and the programme moved inland to Maitri.",
      "Today it survives as a listed historic site — a buried time capsule a few metres under the ice, and the reason every Indian station since has been sited on rock.",
    ],
    history: [
      { year: "1983", text: "Station established on the ice shelf during the 3rd expedition." },
      { year: "1983–89", text: "Serves the programme's first decade of Antarctic operations." },
      { year: "1989", text: "Progressively buried by accumulation; operations shift to Maitri." },
      { year: "1990", text: "Decommissioned — reclaimed by the ice that hosts it." },
      { year: "Later", text: "Designated a historic site under Antarctic Treaty instruments." },
    ],
    cover: "/img/sea-ice.jpg",
    provenance: "verified",
  },
];

export function getStation(slug: string) {
  return STATIONS.find((s) => s.slug === slug);
}

/** Programme → representative station used for schematic route maps. */
export function stationForProgramme(programme: string) {
  if (programme === "Arctic") return STATIONS.find((s) => s.slug === "himadri")!;
  if (programme === "Southern Ocean") return STATIONS.find((s) => s.slug === "bharati")!;
  return STATIONS.find((s) => s.slug === "maitri")!;
}

/** Simplified daylight illustration — NOT a forecast or observation. */
export function daylightFraction(lat: number, month: number): number {
  // Month 1 = January. South = polar day in southern summer (Nov–Feb).
  const southern = lat < 0;
  const m = southern ? month : ((month + 5) % 12) + 1; // flip season for Arctic
  const absLat = Math.abs(lat);
  if (absLat < 60) return 0.5;
  // Heuristic ramp: Nov–Feb full day, May–Aug full night for the Antarctic.
  const summerCurve = [1, 1, 0.85, 0.55, 0.15, 0, 0, 0.02, 0.25, 0.6, 0.9, 1];
  const base = summerCurve[m - 1];
  const extreme = clamp((absLat - 60) / 20, 0, 1);
  return clamp(base * 0.85 * extreme + (1 - extreme) * 0.5, 0, 1);
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
