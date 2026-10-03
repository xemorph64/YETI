import type { Expedition, MediaAsset } from "@/lib/types";
import provenance from "@/lib/data/provenance.json";

/* ---------------------------------------------------------------------------
   CRYOLENS — media assets.
   Every asset is a real photograph retrieved from Wikimedia Commons with its
   licence and author recorded in provenance.json. Captions describe what the
   photograph actually shows; nothing is attributed to NCPOR photographers.
--------------------------------------------------------------------------- */

type P = (typeof provenance)[keyof typeof provenance];

function src(slug: string): { src: string; p: P } {
  const p = (provenance as Record<string, P>)[slug];
  return { src: `/img/${slug}.jpg`, p };
}

function asset(
  id: string,
  slug: string,
  title: string,
  alt: string,
  subject: MediaAsset["subject"],
  w: number,
  h: number,
  extra: Partial<MediaAsset> = {},
): MediaAsset {
  const { src: url, p } = src(slug);
  return {
    id,
    slug,
    src: url,
    w,
    h,
    type: "photo",
    subject,
    title,
    alt,
    credit: p.artist || "Unknown author",
    license: p.license,
    source: p.source,
    provenance: "third-party",
    ...extra,
  };
}

export const MEDIA: MediaAsset[] = [
  asset("ph-01", "antarctica-aerial", "Approaching the Larsen Ice Shelf", "Aerial view of the Larsen Ice Shelf from a research aircraft", "Landscape", 1920, 1268, { stationId: undefined, year: "—" }),
  asset("ph-02", "maitri-station", "Maitri station, Schirmacher Oasis", "Maitri, the Indian Antarctic station in the Schirmacher Oasis", "Stations", 1920, 1440, { stationId: "maitri" }),
  asset("ph-03", "bharati-station", "Bharati station on the Larsemann Hills shore", "Bharati, the Indian Antarctic research station, raised above the rock", "Stations", 900, 596, { stationId: "bharati" }),
  asset("ph-04", "aurora-australis", "Aurora australis over a polar station", "The southern lights arching over a darkened Antarctic station", "Aurora", 1920, 1280),
  asset("ph-05", "emperor-penguins", "Emperor penguin beside the Terra Nova expedition hut", "An emperor penguin standing near a wooden expedition hut in Antarctica", "Wildlife", 1920, 1440),
  asset("ph-06", "iceberg", "Iceberg off the Antarctic Peninsula", "A flat-topped iceberg in dark Antarctic water", "Sea ice", 1920, 1080),
  asset("ph-07", "glacier", "The Larsen Ice Shelf and glacier systems from orbit", "Satellite view of the Larsen Ice Shelf and glacier drainage", "Landscape", 1920, 2458),
  asset("ph-08", "crevasse", "Reading a glacier across the bay", "A researcher on rock looking across water towards a glacier front", "Science operations", 1920, 1280),
  asset("ph-09", "blue-marble-antarctica", "Icebergs along the Antarctic coast, January 2001", "Satellite image of icebergs and sea ice along the coast", "Sea ice", 1200, 895),
  asset("ph-10", "midnight-sun", "Midnight sun over the ice", "The sun low over the horizon at midnight in Antarctica", "Landscape", 1920, 1280),
  asset("ph-11", "field-camp", "A field camp on the ice", "Tents of a scientific field camp on Antarctic terrain", "Science operations", 1920, 1207),
  asset("ph-12", "snow-vehicle", "Snow-vehicle traverse", "A snow vehicle on an Antarctic traverse", "Science operations", 1920, 1440),
  asset("ph-13", "svalbard-landscape", "Svalbard from orbit", "Satellite view of the Svalbard archipelago", "Landscape", 1920, 1920, { stationId: "himadri" }),
  asset("ph-14", "sea-ice", "Mountains, pack ice and floes", "Antarctic mountains behind a sea of pack ice and floes", "Sea ice", 1920, 1280),
  asset("ph-15", "icebreaker", "Icebreaker at work", "An icebreaker breaking channel through sea ice", "Vessels & aircraft", 1920, 1285),
  asset("ph-16", "research-vessel", "Research vessel in Antarctic waters", "A research vessel operating among ice in the Southern Ocean", "Vessels & aircraft", 1920, 1250),
  asset("ph-17", "weather-station", "Automatic weather station", "An automated weather station on the Antarctic coast", "Science operations", 1200, 900),
  asset("ph-18", "ny-alesund", "Ny-Ålesund, Svalbard", "The research village of Ny-Ålesund beneath Svalbard mountains", "Stations", 1920, 1096, { stationId: "himadri" }),
  // Demo panorama: same wide source, drag-to-pan viewer, honestly labelled.
  {
    id: "pan-01",
    slug: "panorama-demo",
    src: "/img/antarctica-aerial.jpg",
    w: 1920,
    h: 1268,
    type: "panorama",
    subject: "Landscape",
    title: "Ice-shelf panorama (demo viewer)",
    alt: "Wide aerial view of an Antarctic ice shelf shown in a demonstration 360-degree-style pan viewer",
    credit: (provenance as Record<string, P>)["antarctica-aerial"].artist,
    license: "Public domain",
    source: (provenance as Record<string, P>)["antarctica-aerial"].source,
    provenance: "third-party",
  },
];

export const MEDIA_SUBJECTS = [...new Set(MEDIA.map((m) => m.subject))];

export function getMedia(id: string) {
  return MEDIA.find((m) => m.id === id);
}

export function mediaByStation(stationId: string) {
  return MEDIA.filter((m) => m.stationId === stationId);
}

export function mediaByExpedition(expeditionId: string) {
  return MEDIA.filter((m) => m.expeditionId === expeditionId);
}

/** Deterministic rotation of media for expedition covers. */
export function coverFor(index: number) {
  return MEDIA[index % MEDIA.length].src;
}

/* Thematic subject picks per programme, used when no assets are explicitly
   linked to an expedition id in the demo build. */
const PROGRAMME_SUBJECTS: Record<Expedition["programme"], MediaAsset["subject"][]> = {
  Antarctic: ["Science operations", "Sea ice", "Landscape", "Stations", "Wildlife"],
  Arctic: ["Landscape", "Stations", "Science operations"],
  "Southern Ocean": ["Vessels & aircraft", "Sea ice", "Wildlife", "Landscape"],
};

/**
 * Field imagery for an expedition page: assets explicitly linked to the
 * expedition first, then the season's station imagery, then
 * programme-relevant subjects — all deterministic, never more than four,
 * and never repeating the hero cover.
 */
export function galleryForExpedition(
  exp: Pick<Expedition, "id" | "number" | "programme" | "stationIds" | "cover">,
): MediaAsset[] {
  const picks: MediaAsset[] = [];
  const seen = new Set<string>();
  const push = (m: MediaAsset) => {
    if (seen.has(m.id) || picks.length >= 4) return;
    if (m.type === "panorama") return; // demo pan-viewer asset, not gallery filler
    if (m.src === exp.cover) return; // the hero already carries this image
    seen.add(m.id);
    picks.push(m);
  };
  mediaByExpedition(exp.id).forEach(push);
  const stationId = exp.stationIds?.[0];
  if (stationId) MEDIA.filter((m) => m.stationId === stationId).forEach(push);
  const subjects = PROGRAMME_SUBJECTS[exp.programme];
  for (let i = 0; i < subjects.length && picks.length < 4; i++) {
    const subject = subjects[(exp.number + i) % subjects.length];
    MEDIA.filter((m) => m.subject === subject).forEach(push);
  }
  for (let i = 0; i < MEDIA.length && picks.length < 4; i++) {
    push(MEDIA[(exp.number * 3 + i) % MEDIA.length]);
  }
  return picks;
}
