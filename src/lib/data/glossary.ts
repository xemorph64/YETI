/* ---------------------------------------------------------------------------
   GLOSSARY — polar science terms with Hindi and Bengali renderings.
   Definitions are original English material. Hindi/Bengali are the working
   scientific renderings used across YETI's localized surfaces; instrument
   acronyms keep their English form in every language, as they do in practice.
--------------------------------------------------------------------------- */

export interface GlossaryTerm {
  id: string;
  term: string;
  hi?: string;
  bn?: string;
  category: "Cryosphere" | "Ocean" | "Atmosphere" | "Programme";
  definition: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "glacier",
    term: "Glacier",
    hi: "हिमनद",
    bn: "হিমবাহ",
    category: "Cryosphere",
    definition:
      "A river of ice that moves under its own weight, gaining mass by snowfall at the top and losing it by melt and calving at the snout.",
  },
  {
    id: "ice-sheet",
    term: "Ice sheet",
    hi: "महाद्वीपीय हिमचादर",
    bn: "মহাদেশীয় বরফস্তর",
    category: "Cryosphere",
    definition:
      "A continental-scale mass of land ice — Greenland and Antarctica hold the two on Earth. Land ice is what raises sea level when it melts.",
  },
  {
    id: "ice-shelf",
    term: "Ice shelf",
    hi: "हिमपट्ट",
    bn: "ভাসমান মহাদেশীয় বরফপাট",
    category: "Cryosphere",
    definition:
      "The floating extension of a land ice sheet where it reaches the sea. Shelves buttress the ice behind them; their loss speeds glacier flow.",
  },
  {
    id: "sea-ice",
    term: "Sea ice",
    hi: "समुद्री बर्फ़",
    bn: "সমুদ্রবরফ",
    category: "Ocean",
    definition:
      "Frozen seawater, growing and shrinking with the seasons. Not the same as icebergs, which are pieces of land ice that reached the sea.",
  },
  {
    id: "iceberg",
    term: "Iceberg",
    hi: "हिमशैल",
    bn: "ভাসমান বরফ পাহাড়",
    category: "Cryosphere",
    definition:
      "A chunk of land ice that calved from a glacier or ice shelf and floats in the sea — fresh water, not frozen seawater.",
  },
  {
    id: "firn",
    term: "Firn",
    hi: "फ़िर्न (संघनित हिम)",
    bn: "ফির্ন",
    category: "Cryosphere",
    definition:
      "Old snow on its way to becoming ice — grains compact and pores close over years, sealing ancient air into bubbles.",
  },
  {
    id: "mass-balance",
    term: "Mass balance",
    hi: "द्रव्यमान संतुलन",
    bn: "ভরের ভারসাম্য",
    category: "Cryosphere",
    definition:
      "Mass gained (accumulation) minus mass lost (ablation) — a glacier's scoreboard against climate.",
  },
  {
    id: "permafrost",
    term: "Permafrost",
    hi: "पर्माफ़्रॉस्ट (स्थायी हिमस्तर)",
    bn: "পারমাফ্রস্ট",
    category: "Cryosphere",
    definition:
      "Ground that stays frozen for two or more consecutive years, thawing depth by depth as climate warms.",
  },
  {
    id: "cryosphere",
    term: "Cryosphere",
    hi: "शीतमंडल",
    bn: "শীতমণ্ডল",
    category: "Cryosphere",
    definition:
      "Everywhere on Earth where water is solid: snow, glaciers, ice sheets, sea ice, permafrost. The subject of YETI's colder half.",
  },
  {
    id: "southern-ocean",
    term: "Southern Ocean",
    hi: "दक्षिणी महासागर",
    bn: "দক্ষিণ মহাসাগর",
    category: "Ocean",
    definition:
      "The ocean encircling Antarctica — the only current system connecting the Atlantic, Indian and Pacific basins, and a major sink for heat and carbon.",
  },
  {
    id: "ctd",
    term: "CTD cast",
    category: "Ocean",
    definition:
      "Conductivity–Temperature–Depth: an instrument lowered through the water column to profile salinity and temperature — the structure of the ocean in one line.",
  },
  {
    id: "xbt",
    term: "XBT",
    category: "Ocean",
    definition:
      "Expendable bathythermograph — a probe dropped from a moving ship that wires temperature-vs-depth back as it falls.",
  },
  {
    id: "mooring",
    term: "Mooring",
    hi: "मूरिंग (नोंता वेधशाला)",
    bn: "মুরিং পর্যবেক্ষণ",
    category: "Ocean",
    definition:
      "An anchored array of instruments held upright in the water column by buoys, recording year-round — like India's IndARC mooring in Kongsfjorden.",
  },
  {
    id: "krill",
    term: "Krill",
    hi: "क्रिल",
    bn: "ক্রিল",
    category: "Ocean",
    definition:
      "Shrimp-like crustaceans that swarm in Southern Ocean waters and feed almost everything larger — the base of the polar food web.",
  },
  {
    id: "polynya",
    term: "Polynya",
    hi: "पोलिनिया (विश्रांत खात)",
    bn: "পোলিনিয়া",
    category: "Ocean",
    definition:
      "An area of persistent open water surrounded by sea ice, kept clear by currents and upwelling — a window the ocean breathes through.",
  },
  {
    id: "albedo",
    term: "Albedo / ice–albedo feedback",
    hi: "एल्बेडो (परावर्तकता)",
    bn: "আলবেডো",
    category: "Atmosphere",
    definition:
      "How much sunlight a surface reflects. White ice reflects; dark ocean absorbs — melt a little ice and the warming melts more.",
  },
  {
    id: "arctic-amplification",
    term: "Arctic amplification",
    hi: "आर्कटिक प्रवर्धन",
    bn: "আর্কটিক পরিবর্ধন",
    category: "Atmosphere",
    definition:
      "The Arctic warming several times faster than the global average, driven largely by the ice–albedo feedback.",
  },
  {
    id: "aurora",
    term: "Aurora",
    hi: "अरोरा (ध्रुवीय ज्योति)",
    bn: "মেরুজ্যোতি",
    category: "Atmosphere",
    definition:
      "Light emitted by upper-atmosphere particles energised by solar wind funnelling down the magnetic field — the aurora australis in the south, borealis in the north.",
  },
  {
    id: "teleconnection",
    term: "Teleconnection",
    hi: "दूरसंबंध",
    bn: "টেলিকানেকশন",
    category: "Atmosphere",
    definition:
      "Climate linkages across vast distances — the mechanism by which polar change can nudge patterns that reach the Indian monsoon.",
  },
  {
    id: "aws",
    term: "Automatic weather station (AWS)",
    hi: "स्वचालित मौसम स्टेशन",
    bn: "স্বয়ংক্রিয় আবহাওয়া স্টেশন",
    category: "Atmosphere",
    definition:
      "An unattended instrument mast logging temperature, wind and pressure hour by hour — the backbone of the stations' long climate series.",
  },
  {
    id: "antarctic-treaty",
    term: "Antarctic Treaty",
    hi: "अंटार्कटिक संधि",
    bn: "অ্যান্টার্কটিক চুক্তি",
    category: "Programme",
    definition:
      "Signed in 1959, reserving Antarctica for peace and science. India enacts its commitments domestically through the Indian Antarctic Act, 2022.",
  },
  {
    id: "monsoon",
    term: "Monsoon",
    hi: "मानसून",
    bn: "বর্ষা",
    category: "Programme",
    definition:
      "India's seasonal rainfall engine — part of one planetary heat system that polar science helps read from both ends.",
  },
];

export const GLOSSARY_CATEGORIES = [...new Set(GLOSSARY.map((t) => t.category))];
