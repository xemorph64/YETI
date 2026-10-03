/* ---------------------------------------------------------------------------
   RESEARCHER DIRECTORY — demonstration profiles.

   The documented directory (§55) is consent-gated in production: rosters and
   personnel data are personal data, and this demo archive intentionally does
   not seed real people. Every profile below is a FICTIONAL demonstration
   persona built to show how the directory, the knowledge graph and the Vault
   connect. Names, roles and histories must not be read as real individuals.
--------------------------------------------------------------------------- */

export interface ResearcherProfile {
  id: string;
  name: string;
  title: string;
  domain: string;
  programme: "Antarctic" | "Arctic" | "Southern Ocean";
  stationIds: string[];
  themes: string[];
  expeditionNote: string;
  bio: string;
  datasetIds: string[];
  publicationIds: string[];
}

export const RESEARCHERS: ResearcherProfile[] = [
  {
    id: "res-glacio-01",
    name: "Dr. Meera Kulkarni (demo)",
    title: "Glaciologist · surface mass balance",
    domain: "Glaciology",
    programme: "Antarctic",
    stationIds: ["maitri"],
    themes: ["Glaciology", "Ice-core reconnaissance"],
    expeditionNote: "Recent Antarctic seasons, inland Schirmacher Oasis traverses (demo)",
    bio: "Studies how much snow the East Antarctic ice sheet gains and loses each year, from stake farms and snow pits around the Schirmacher Oasis. The demo persona behind the Vault's SMB transects.",
    datasetIds: ["ds-01", "ds-07"],
    publicationIds: ["pub-01"],
  },
  {
    id: "res-ocean-01",
    name: "Dr. Arjun Menon (demo)",
    title: "Physical oceanographer · Prydz Bay",
    domain: "Oceanography",
    programme: "Antarctic",
    stationIds: ["bharati"],
    themes: ["Oceanography", "Sea-ice observations"],
    expeditionNote: "Bharati-era coastal campaigns, Prydz Bay water masses (demo)",
    bio: "Reads the temperature–salinity structure of Prydz Bay — where winter water sits over warm deep water, and what that means for basal melt near the Larsemann Hills.",
    datasetIds: ["ds-02", "ds-09"],
    publicationIds: ["pub-02"],
  },
  {
    id: "res-atmos-01",
    name: "Dr. Kavya Iyer (demo)",
    title: "Atmospheric scientist · long-term stations",
    domain: "Atmospheric sciences",
    programme: "Antarctic",
    stationIds: ["maitri"],
    themes: ["Atmospheric sciences", "Upper atmosphere studies"],
    expeditionNote: "Maitri year-round observation suites (demo)",
    bio: "Keeps the station's atmospheric record honest: quality-controlling the hourly AWS series and the middle-atmosphere radar winds that anchor East Antarctic reanalysis.",
    datasetIds: ["ds-03", "ds-11"],
    publicationIds: ["pub-03"],
  },
  {
    id: "res-arctic-01",
    name: "Dr. Rohan Bhatt (demo)",
    title: "Arctic oceanographer · Kongsfjorden",
    domain: "Oceanography",
    programme: "Arctic",
    stationIds: ["himadri"],
    themes: ["Oceanography", "Glaciology"],
    expeditionNote: "Ny-Ålesund seasons since the Himadri era (demo)",
    bio: "Watches Atlantic water push into Kongsfjorden through the IndARC mooring — the Arctic end of the same heat engine Indian Southern Ocean work samples from the other side.",
    datasetIds: ["ds-04"],
    publicationIds: ["pub-04"],
  },
  {
    id: "res-bio-01",
    name: "Dr. Sneha Reddy (demo)",
    title: "Polar ecologist · ice-free oases",
    domain: "Polar biology",
    programme: "Antarctic",
    stationIds: ["bharati"],
    themes: ["Polar biology", "Environmental monitoring"],
    expeditionNote: "Larsemann Hills lake systems, summer windows (demo)",
    bio: "Surveys the sentinel ecosystems of the ice-free Larsemann Hills — lake chemistry and moss communities that respond to warming within a single season.",
    datasetIds: ["ds-10"],
    publicationIds: ["pub-05"],
  },
  {
    id: "res-so-01",
    name: "Dr. Vikram Sethi (demo)",
    title: "Southern Ocean cruise scientist",
    domain: "Oceanography",
    programme: "Southern Ocean",
    stationIds: [],
    themes: ["Oceanography", "Biogeochemistry", "Sea-ice observations"],
    expeditionNote: "Goa–Prydz Bay transect cruises (demo)",
    bio: "Runs the transect: XBT sections from Goa to Prydz Bay, bridge sea-ice watches, and the upper-ocean heat numbers that connect Antarctic change to the monsoon.",
    datasetIds: ["ds-05", "ds-06"],
    publicationIds: ["pub-07"],
  },
  {
    id: "res-hist-01",
    name: "Dr. Leela Nair (demo)",
    title: "Polar science historian · archive",
    domain: "Programme history",
    programme: "Antarctic",
    stationIds: ["maitri"],
    themes: ["Environmental monitoring"],
    expeditionNote: "Forty seasons of programme records (demo)",
    bio: "Works the archive itself — expedition reports, station logs and the institutional memory that turns forty years of records into one continuous story.",
    datasetIds: [],
    publicationIds: ["pub-06", "pub-08"],
  },
  {
    id: "res-gov-01",
    name: "Dr. Imran Qureshi (demo)",
    title: "Data governance lead",
    domain: "Atmospheric sciences",
    programme: "Arctic",
    stationIds: ["himadri"],
    themes: ["Environmental monitoring"],
    expeditionNote: "Ny-Ålesund aerosol campaigns & data stewardship (demo)",
    bio: "Stewards access classes and licences across the demo corpus — the governance side that decides what is open, what is registered and what stays gated.",
    datasetIds: ["ds-08", "ds-12"],
    publicationIds: ["pub-03"],
  },
];

export function getResearcher(id: string) {
  return RESEARCHERS.find((r) => r.id === id);
}

export const RESEARCHER_DOMAINS = [...new Set(RESEARCHERS.map((r) => r.domain))];
