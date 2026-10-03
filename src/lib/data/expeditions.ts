import type { Expedition } from "@/lib/types";

const IMG = {
  aerial: "/img/antarctica-aerial.jpg",
  seaIce: "/img/sea-ice.jpg",
  vessel: "/img/research-vessel.jpg",
  icebreaker: "/img/icebreaker.jpg",
  glacier: "/img/glacier.jpg",
  iceberg: "/img/iceberg.jpg",
  maitri: "/img/maitri-station.jpg",
  bharati: "/img/bharati-station.jpg",
  nyAlesund: "/img/ny-alesund.jpg",
  svalbard: "/img/svalbard-landscape.jpg",
  fieldCamp: "/img/field-camp.jpg",
  snowVehicle: "/img/snow-vehicle.jpg",
  weatherStation: "/img/weather-station.jpg",
  midnightSun: "/img/midnight-sun.jpg",
  aurora: "/img/aurora-australis.jpg",
  penguins: "/img/emperor-penguins.jpg",
  crevasse: "/img/crevasse.jpg",
  storyCover: "/img/yeti-story-cover.jpg",
  blueMarble: "/img/blue-marble-antarctica.jpg",
};

const OBJECTIVE_SETS: string[][] = [
  ["Glaciology", "Atmospheric sciences"],
  ["Oceanography", "Sea-ice observations"],
  ["Geosciences", "Remote sensing ground truth"],
  ["Polar biology", "Environmental monitoring"],
  ["Atmospheric sciences", "Upper atmosphere studies"],
  ["Glaciology", "Ice-core reconnaissance"],
];

const REGION_ROTATION = [
  "Queen Maud Land · Schirmacher Oasis",
  "Central Dronning Maud Land traverse sector",
  "Larsemann Hills · Prydz Bay",
  "Coastal East Antarctica",
];

function antarcticSeason(n: number): { start: number; end: number; label: string } {
  const start = 1980 + n;
  const end = start + 1;
  return { start, end, label: `${start}–${String(end).slice(2)}` };
}

function buildAntarctic(): Expedition[] {
  const list: Expedition[] = [];
  for (let n = 1; n <= 44; n++) {
    const { start, end, label } = antarcticSeason(n);
    const milestones: Record<number, string> = {
      1: "First Indian Antarctic Expedition — the programme begins",
      3: "Dakshin Gangotri station established on the ice shelf",
      9: "Maitri commissioned inland on firm ground",
      31: "Bharati era begins in the Larsemann Hills",
    };
    const summaries: Record<number, string> = {
      1: "A 21-member team led by Dr. S.Z. Qasim reached the Antarctic ice shelf off Queen Maud Land and conducted the first Indian scientific landing on the continent — the founding act of four decades of Indian polar work.",
      3: "The third expedition put India's first Antarctic station, Dakshin Gangotri, onto the ice shelf — a foothold that worked, and that the ice eventually reclaimed.",
      9: "With the programme moving inland to the Schirmacher Oasis, this expedition window covers the commissioning of Maitri, the station that has anchored Indian Antarctic science since 1989.",
      31: "The Larsemann Hills on Prydz Bay became India's second active Antarctic station: Bharati, purpose-built for earth sciences and ocean observation.",
    };
    list.push({
      id: `EXP-${String(n).padStart(2, "0")}`,
      number: n,
      ordinal: toOrdinal(n),
      programme: "Antarctic",
      season: label,
      startYear: start,
      endYear: end,
      region: REGION_ROTATION[n % REGION_ROTATION.length],
      vessel: n >= 29 ? "MV Vasiliy Golovnin (chartered)" : undefined,
      leader:
        n === 1
          ? "Dr. S.Z. Qasim"
          : undefined, // names intentionally not seeded — see data-honesty note
      objectives: OBJECTIVE_SETS[n % OBJECTIVE_SETS.length],
      summary:
        summaries[n] ??
        `The ${toOrdinal(n)} Indian Antarctic Expedition operated from the ${REGION_ROTATION[n % REGION_ROTATION.length]} sector, running its science plan across ${OBJECTIVE_SETS[n % OBJECTIVE_SETS.length].join(" and ").toLowerCase()} stations of work during the ${label} austral season.`,
      stationIds: n === 3 ? ["dakshin-gangotri"] : n === 9 ? ["maitri"] : n === 31 ? ["bharati"] : n % 2 === 0 ? ["maitri"] : ["bharati"],
      cover:
        n === 3
          ? IMG.storyCover // AI-generated illustrative cover — see /about#provenance
          : [IMG.aerial, IMG.glacier, IMG.maitri, IMG.bharati, IMG.crevasse, IMG.snowVehicle][
              n % 6
            ],
      status: "completed",
      provenance: summaries[n] ? "verified" : "demo",
      milestone: milestones[n],
    });
  }
  return list;
}

function buildArctic(): Expedition[] {
  const out: Expedition[] = [];
  for (let i = 0; i < 9; i++) {
    const year = 2007 + i;
    out.push({
      id: `ARC-${String(i + 1).padStart(2, "0")}`,
      number: i + 1,
      ordinal: toOrdinal(i + 1),
      programme: "Arctic",
      season: `${year}${i === 0 ? " (first) " : ""}`,
      startYear: year,
      endYear: year,
      region: "Ny-Ålesund, Svalbard",
      objectives: i % 2 === 0 ? ["Glaciology", "Atmospheric sciences"] : ["Polar biology", "Oceanography"],
      summary:
        i === 0
          ? "India's first Arctic science expedition, working out of the international research village of Ny-Ålesund in Svalbard — the seed of the Himadri station established the following year."
          : `Indian Arctic science campaign ${i + 1} based at Ny-Ålesund, Svalbard, continuing long-term observations across ${i % 2 === 0 ? "glaciology and atmospheric science" : "polar biology and fjord oceanography"}.`,
      stationIds: ["himadri"],
      cover: i % 3 === 0 ? IMG.svalbard : i % 3 === 1 ? IMG.nyAlesund : IMG.glacier,
      status: "completed",
      provenance: i === 0 ? "verified" : "demo",
      milestone: i === 0 ? "First Indian Arctic expedition" : undefined,
    });
  }
  return out;
}

function buildSouthernOcean(): Expedition[] {
  const out: Expedition[] = [];
  const covers = [IMG.vessel, IMG.icebreaker, IMG.seaIce, IMG.iceberg, IMG.penguins];
  for (let i = 0; i < 6; i++) {
    const year = 2013 + i * 2;
    out.push({
      id: `SOE-${String(i + 1).padStart(2, "0")}`,
      number: i + 1,
      ordinal: toOrdinal(i + 1),
      programme: "Southern Ocean",
      season: `${year}–${String(year + 1).slice(2)}`,
      startYear: year,
      endYear: year + 1,
      region: "Goa – Prydz Bay transect",
      vessel: "Ocean research vessel (chartered)",
      objectives: ["Oceanography", "Biogeochemistry", "Sea-ice observations"],
      summary: `Southern Ocean research cruise along the Goa–Prydz Bay transect, sampling the ocean engine that connects the Antarctic ice to the Indian monsoon system (demo record — cruise numbering for demonstration).`,
      cover: covers[i % covers.length],
      status: "completed",
      provenance: "demo",
    });
  }
  return out;
}

export function toOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const EXPEDITIONS: Expedition[] = [
  ...buildAntarctic(),
  ...buildArctic(),
  ...buildSouthernOcean(),
].sort((a, b) => b.startYear - a.startYear || a.programme.localeCompare(b.programme));

export const EXPEDITION_MILESTONES = EXPEDITIONS.filter((e) => e.milestone);

export function getExpedition(id: string) {
  return EXPEDITIONS.find((e) => e.id === id);
}

export function expeditionsByDecade() {
  const map = new Map<number, Expedition[]>();
  for (const e of EXPEDITIONS) {
    const decade = Math.floor(e.startYear / 10) * 10;
    map.set(decade, [...(map.get(decade) ?? []), e]);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}
