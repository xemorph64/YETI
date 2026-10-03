import type { AskEntry } from "@/lib/types";

/* Ask YETI — a demo retrieval assistant grounded ONLY in this archive.
   No citation, no answer: if nothing matches, it says so (§26).
   Retrieval is token-based (see `retrieve`) so variants like "licensed",
   "produced" or "expedition important" all resolve. Localized answer
   variants (answerHi/answerBn) cover the highest-traffic questions;
   everything else answers in English with an honest in-panel notice. */

export const ASK_ENTRIES: AskEntry[] = [
  /* ---------------- programme & stations ---------------- */
  {
    id: "q-expeditions",
    patterns: [
      "how many expeditions", "expeditions completed", "how many antarctic expeditions", "number of expeditions",
      "expedition count", "how many arctic expeditions", "how many missions", "total expeditions",
    ],
    ctx: ["expeditions", "atlas", "timeline"],
    answer:
      "India has completed 40+ Antarctic expeditions since 1981–82, annual Arctic campaigns since 2007, and regular Southern Ocean research cruises. The archive here seeds 44 Antarctic expedition records (1st–44th) plus Arctic and Southern Ocean series — flagged as verified milestones or demonstration records on each entry.",
    answerHi:
      "भारत ने 1981–82 से 40+ अंटार्कटिक अभियान, 2007 से वार्षिक आर्कटिक अभियान और नियमित दक्षिणी महासागर अभियान पूरे किए हैं। इस डेमो संग्रह में 44 अंटार्कटिक अभियान रिकॉर्ड (पहला–44वाँ) और आर्कटिक तथा दक्षिणी महासागर श्रृंखलाएँ हैं — हर रिकॉर्ड पर 'सत्यापित' या 'डेमो' लेबल लगा है।",
    answerBn:
      "১৯৮১–৮২ সাল থেকে ভারত ৪০টিরও বেশি অ্যান্টার্কটিক অভিযান, ২০০৭ থেকে বার্ষিক আর্কটিক অভিযান এবং নিয়মিত দক্ষিণ মহাসাগর অভিযান সম্পন্ন করেছে। এই ডেমো সংগ্রহে ৪৪টি অ্যান্টার্কটিক অভিযানের রেকর্ড এবং আর্কটিক ও দক্ষিণ মহাসাগর সিরিজ রয়েছে — প্রতিটিতে 'যাচাইকৃত' বা 'ডেমো' লেবেল দেওয়া আছে।",
    sources: [
      { label: "Expeditions index", href: "/expeditions" },
      { label: "45 Years in Motion", href: "/#years" },
    ],
    related: [
      { label: "First expedition (1981–82)", href: "/expeditions/EXP-01" },
      { label: "Atlas", href: "/atlas" },
    ],
  },
  {
    id: "q-maitri",
    patterns: ["maitri", "when was maitri", "maitri commissioned", "maitri station", "schirmacher"],
    ctx: ["stations", "expeditions"],
    answer:
      "Maitri — commissioned in 1989 — is India's permanent inland Antarctic station in the Schirmacher Oasis, Queen Maud Land, at roughly 70°45′S 11°43′E. It succeeded Dakshin Gangotri after the moving ice shelf began burying the first station.",
    answerHi:
      "मैत्री — 1989 में स्थापित — शिरमाकर ओएसिस, क्वीन मॉड लैंड (लगभग 70°45′S 11°43′E) में भारत का स्थायी अंटार्कटिक अंतर्देशीय स्टेशन है। बर्फ़ की चलायमान शेल्फ ने पहले स्टेशन दक्षिण गंगोत्री को दफ़नाना शुरू किया, तब इसकी जगह मैत्री बनी।",
    answerBn:
      "মৈত্রী — ১৯৮৯ সালে প্রতিষ্ঠিত — শিরমাখার ওয়েসিস, কুইন মড ল্যান্ডে (প্রায় 70°45′S 11°43′E) ভারতের স্থায়ী অ্যান্টার্কটিক অন্তর্দেশীয় স্টেশন। বরফের চলমান শেল্ফ প্রথম স্টেশন দক্ষিণ গঙ্গোত্রীকে ঢেকে ফেলতে শুরু করলে মৈত্রী তার স্থলাভিষিক্ত হয়।",
    sources: [
      { label: "Station record: Maitri", href: "/stations/maitri" },
      { label: "Story: The Station That Sank", href: "/stories/the-station-that-sank" },
    ],
    related: [{ label: "Expedition: 9th (1989–90)", href: "/expeditions/EXP-09" }],
    evidence: {
      section: "Station record — Overview ¶1",
      quote:
        "Maitri — commissioned in 1989 — is India's permanent inland Antarctic station in the Schirmacher Oasis, Queen Maud Land.",
    },
  },
  {
    id: "q-dakshin",
    patterns: ["dakshin gangotri", "first station", "buried station", "what happened to dakshin", "dakshin"],
    ctx: ["stations", "stories"],
    answer:
      "Dakshin Gangotri, established in 1983 during the 3rd expedition on the Princess Astrid Coast ice shelf, was India's first Antarctic station. Accumulating snow gradually buried it; it was decommissioned in 1990 and is today a recognised historic site under the Antarctic Treaty system. The lesson — build on rock — shaped the siting of Maitri and Bharati.",
    answerHi:
      "दक्षिण गंगोत्री — 1983 में तीसरे अभियान के दौरान प्रिंसेस ऐस्ट्रिड तट की बर्फ़-शेल्फ़ पर स्थापित — भारत का पहला अंटार्कटिक स्टेशन था। जमा होती बर्फ़ ने उसे धीरे-धीरे दफ़ना दिया; 1990 में इसे बंद कर दिया गया और आज यह अंटार्कटिक संधि तंत्र के अंतर्गत ऐतिहासिक स्थल है। सबक़ — चट्टान पर बनाओ — ने मैत्री और भारती की जगह तय की।",
    answerBn:
      "দক্ষিণ গঙ্গোত্রী — ১৯৮৩ সালে তৃতীয় অভিযানের সময় প্রিন্সেস অ্যাস্ট্রিড কোস্টের বরফ-শেল্ফে স্থাপিত — ভারতের প্রথম অ্যান্টার্কটিক স্টেশন ছিল। জমতে জমতে বরফ তাকে ঢেকে দেয়; ১৯৯০ সালে বন্ধ করা হয় এবং আজ এটি অ্যান্টার্কটিক চুক্তি ব্যবস্থার অধীনে একটি ঐতিহাসিক স্থান। শিক্ষাটি — পাথরের ওপর নির্মাণ করো — মৈত্রী ও ভারতীর অবস্থান নির্ধারণ করেছিল।",
    sources: [
      { label: "Station record: Dakshin Gangotri", href: "/stations/dakshin-gangotri" },
      { label: "Story: The Station That Sank", href: "/stories/the-station-that-sank" },
    ],
    related: [{ label: "Expedition: 3rd (1983–84)", href: "/expeditions/EXP-03" }],
    evidence: {
      section: "Story — The Station That Sank, ch. 2",
      quote: "Accumulating snow gradually buried the station; it was decommissioned in 1990.",
    },
  },
  {
    id: "q-bharati",
    patterns: ["bharati", "where is bharati", "larsemann", "newest station", "latest station"],
    ctx: ["stations"],
    answer:
      "Bharati is India's youngest Antarctic station, commissioned in 2012 at the Larsemann Hills on Prydz Bay (≈69°24′S 76°11′E). Built on rock and looking out over the bay, its science front line is oceanography, geosciences and coastal ecosystems.",
    answerHi:
      "भारती भारत का सबसे नया अंटार्कटिक स्टेशन है — 2012 में प्रिड्ज़ बे के लार्समान हिल्स (लगभग 69°24′S 76°11′E) पर स्थापित। चट्टान पर बना यह स्टेशन समुद्र-विज्ञान, भूविज्ञान और तटीय पारिस्थितिकी की शोध-पंक्ति में है।",
    answerBn:
      "ভারতী ভারতের সবচেয়ে নতুন অ্যান্টার্কটিক স্টেশন — ২০১২ সালে প্রিডজ বে-র লারসেমান হিলসে (প্রায় 69°24′S 76°11′E) প্রতিষ্ঠিত। পাথরের ওপর নির্মিত এই স্টেশনের গবেষণার সামনের সারি মহাসাগরবিদ্যা, ভূবিজ্ঞান ও উপকূলীয় বাস্তুতন্ত্র।",
    sources: [{ label: "Station record: Bharati", href: "/stations/bharati" }],
    related: [
      { label: "Dataset: Prydz Bay CTD profiles", href: "/vault/datasets/prydz-bay-ctd" },
      { label: "Expedition: 31st (2011–12)", href: "/expeditions/EXP-31" },
    ],
  },
  {
    id: "q-himadri",
    patterns: ["himadri", "arctic station", "ny-alesund", "svalbard", "north pole station", "indarc"],
    ctx: ["stations"],
    answer:
      "Himadri, established in 2008 at Ny-Ålesund, Svalbard (≈79°N), is India's Arctic station. India's first Arctic expedition reached Ny-Ålesund in 2007; since then campaigns have spanned glaciology, fjord oceanography (including the IndARC mooring) and atmospheric science.",
    answerHi:
      "हिमाद्रि — 2008 में स्वालबार्ड के न्यू-ओलेसुंड (लगभग 79°N) पर स्थापित — भारत का आर्कटिक स्टेशन है। भारत का पहला आर्कटिक अभियान 2007 में वहाँ पहुँचा; तब से अभियानों में ग्लेशियोलॉजी, फ़्योर्ड समुद्र-विज्ञान (IndARC मूरिंग सहित) और वायुमंडलीय विज्ञान शामिल हैं।",
    answerBn:
      "হিমাদ্রি — ২০০৮ সালে স্ভালবার্ডের ন্যু-অলেসুন্ডে (প্রায় 79°N) প্রতিষ্ঠিত — ভারতের আর্কটিক স্টেশন। ভারতের প্রথম আর্কটিক অভিযান ২০০৭ সালে সেখানে পৌঁছায়; তখন থেকে অভিযানগুলিতে হিমবাহবিদ্যা, ফিয়র্ড মহাসাগরবিদ্যা (IndARC মুরিং সহ) ও বায়ুমণ্ডলীয় বিজ্ঞান রয়েছে।",
    sources: [
      { label: "Station record: Himadri", href: "/stations/himadri" },
      { label: "Dataset: IndARC mooring series", href: "/vault/datasets/indarc-mooring-temperature" },
    ],
    related: [{ label: "First Arctic expedition", href: "/expeditions/ARC-01" }],
  },
  {
    id: "q-first",
    patterns: ["first expedition", "qasim", "1981", "who led", "leader of the first"],
    ctx: ["expeditions", "timeline"],
    answer:
      "The first Indian Antarctic Expedition (1981–82) was led by Dr. S.Z. Qasim. The 21-member team landed on the ice shelf off Queen Maud Land — the founding act of the programme. Names of subsequent team members are intentionally not seeded in this demo archive; official rosters live with NCPOR.",
    answerHi:
      "पहला भारतीय अंटार्कटिक अभियान (1981–82) डॉ. एस.ज़े. क़ासिम के नेतृत्व में गया। 21 सदस्यों की टीम क्वीन मॉड लैंड के पास बर्फ़-शेल्फ़ पर उतरी — कार्यक्रम की नींव। बाद की टीमों के नाम इस डेमो संग्रह में जान-बूझकर नहीं रखे गए; आधिकारिक सूचियाँ NCPOR के पास हैं।",
    answerBn:
      "প্রথম ভারতীয় অ্যান্টার্কটিক অভিযান (১৯৮১–৮২) ড. এস.জে. কাসিমের নেতৃত্বে যায়। ২১ সদস্যের দল কুইন মড ল্যান্ডের কাছে বরফ-শেল্ফে অবতরণ করে — কর্মসূচির ভিত্তি। পরবর্তী দলের সদস্যদের নাম এই ডেমো সংগ্রহে ইচ্ছাকৃতভাবে রাখা হয়নি; সরকারি তালিকা NCPOR-এর কাছে।",
    sources: [
      { label: "Expedition: 1st (1981–82)", href: "/expeditions/EXP-01" },
      { label: "Data honesty note", href: "/about#honesty" },
    ],
  },
  {
    id: "q-ncpor",
    patterns: ["ncpor", "who runs", "institution", "ministry", "moes", "government body"],
    answer:
      "NCPOR — the National Centre for Polar and Ocean Research, under the Ministry of Earth Sciences, based in Goa — operates India's polar and Southern Ocean programmes, including the Antarctic stations, the Arctic station Himadri, and the research vessels that reach them.",
    sources: [{ label: "About", href: "/about" }],
    related: [{ label: "45 Years in Motion", href: "/#years" }],
  },

  /* ---------------- science areas ---------------- */
  {
    id: "q-yeti",
    patterns: ["what is yeti", "what does yeti", "about yeti", "who is yeti", "what is this site", "what can yeti do"],
    ctx: ["home"],
    answer:
      "YETI is a demonstration knowledge portal for India's polar science: it connects 45 years of expeditions, four stations, datasets, publications, imagery and stories into one searchable, source-grounded ecosystem — with an AI assistant (me) that only answers from the archive, a researcher workspace, and an NCPOR admin console. Everything is honestly labelled demo data.",
    sources: [
      { label: "About YETI", href: "/about" },
      { label: "Data honesty", href: "/about#honesty" },
    ],
    related: [{ label: "Begin the journey", href: "/atlas" }],
  },
  {
    id: "q-monsoon",
    patterns: ["monsoon", "arctic and indian monsoon", "teleconnection", "monsoon link", "does the arctic affect", "arctic monsoon"],
    ctx: ["labs", "learn", "science"],
    answer:
      "One of YETI's strongest India-relevant stories: research explores how Arctic conditions → atmospheric processes → possible teleconnections → Asian climate → Indian monsoon research. Important distinction: this chain is a conceptual mechanism and modelled hypothesis, not evidence that one specific weather event was caused by Arctic change. The monsoon-link lab visualises it with that uncertainty labelled.",
    answerHi:
      "भारत के लिए सबसे प्रासंगिक कहानियों में एक: शोध यह जोड़ता है — आर्कटिक परिस्थितियाँ → वायुमंडलीय प्रक्रियाएँ → संभावित टेलीकनेक्शन → एशियाई जलवायु → भारतीय मानसून शोध। ध्यान दें: यह श्रृंखला एक वैचारिक तंत्र और मॉडल-आधारित परिकल्पना है — यह सबूत नहीं कि कोई विशेष मौसम-घटना आर्कटिक परिवर्तन से हुई। मानसून-लिंक लैब इसे उसी अनिश्चितता के साथ दिखाता है।",
    answerBn:
      "ভারতের জন্য সবচেয়ে প্রাসঙ্গিক গল্পগুলির একটি: গবেষণা দেখায় — আর্কটিক পরিস্থিতি → বায়ুমণ্ডলীয় প্রক্রিয়া → সম্ভাব্য টেলিকানেকশন → এশীয় জলবায়ু → ভারতীয় মৌসুমি বায়ু গবেষণা। লক্ষ করুন: এই শৃঙ্খল একটি ধারণাগত প্রক্রিয়া ও মডেল-ভিত্তিক অনুমান — কোনো নির্দিষ্ট আবহাওয়া ঘটনা আর্কটিক পরিবর্তনের ফল এমন প্রমাণ নয়। মৌসুমি-লিংক ল্যাব সেই অনিশ্চয়তা চিহ্নিত করে এটি দেখায়।",
    sources: [
      { label: "Monsoon-Link Lab", href: "/labs/monsoon-link" },
      { label: "Science: Himalayan cryosphere", href: "/science/himalaya" },
    ],
    related: [{ label: "Learn: monsoon module", href: "/learn" }],
  },
  {
    id: "q-sealevel",
    patterns: ["sea level", "sea-level", "sea level rise", "rising seas", "coastal flooding", "sundarbans", "kolkata", "chennai", "kochi"],
    ctx: ["labs", "learn", "science"],
    answer:
      "Ice sheets and glaciers hold enough water to reshape coastlines. The Sea-Level Lab lets you move a scenario slider — low, mid and high ice-loss pathways — and see the simulated curve plus indicative coastal exposure for Sundarbans, Kolkata, Chennai and Kochi. It is a simulated educational model, not a forecast; the datasets behind it are demo-labelled.",
    answerHi:
      "बर्फ़ की चादरें और ग्लेशियर इतना पानी रखते हैं कि तटों की रूपरेखा बदल सकती है। सी-लेवल लैब में स्लाइडर घुमाइए — कम/मध्यम/उच्च बर्फ़-क्षति पथ — और अनुकरण वक्र तथा सुंदरबन, कोलकाता, चेन्नई, कोच्चि के संकेतात्मक तटीय प्रभाव देखिए। यह शैक्षिक अनुकरण मॉडल है, पूर्वानुमान नहीं; पीछे का डेटा डेमो-लेबल है।",
    answerBn:
      "বরফের চাদর ও হিমবাহ এত জল ধরে রাখে যে উপকূলরেখা বদলে যেতে পারে। সি-লেভেল ল্যাবে স্লাইডার সরান — কম/মধ্যম/উচ্চ বরফ-ক্ষয়ের পথ — এবং অনুকরণ কার্ভ ও সুন্দরবন, কলকাতা, চেন্নাই, কোচির নির্দেশক উপকূলীয় প্রভাব দেখুন। এটি শিক্ষামূলক অনুকরণ মডেল, পূর্বাভাস নয়; পেছনের ডেটা ডেমো-লেবেলযুক্ত।",
    sources: [
      { label: "Sea-Level Lab", href: "/labs/sea-level" },
      { label: "Dataset: Schirmacher SMB", href: "/vault/datasets/schirmacher-smb-transects" },
    ],
    related: [{ label: "Learn: ice sheets & sea level", href: "/learn" }],
  },
  {
    id: "q-icesheets",
    patterns: ["ice sheets", "glacier", "glaciers", "ice loss", "cryosphere", "ice sheet dynamics"],
    ctx: ["science", "labs", "vault"],
    answer:
      "Ice sheets and glaciers are a defining research area: ice-sheet dynamics, glacier change, ice loss and sea-level implications. In this archive you can follow the chain — Glacier → Observation → Dataset → Expedition → Publication → Explanation — starting from the Schirmacher SMB transects dataset or the cryosphere science pages.",
    sources: [
      { label: "Science: Cryosphere", href: "/science/cryosphere" },
      { label: "Dataset: Schirmacher SMB transects", href: "/vault/datasets/schirmacher-smb-transects" },
    ],
    related: [{ label: "Sea-Level Lab", href: "/labs/sea-level" }],
  },
  {
    id: "q-southernocean",
    patterns: ["southern ocean", "ocean circulation", "carbon storage", "heat exchange", "antarctic ocean", "krill"],
    ctx: ["science", "expeditions"],
    answer:
      "The Southern Ocean connects the poles: circulation, heat exchange, carbon storage and marine ecosystems. Expeditions have sampled it since the early 1980s — the Prydz Bay CTD profiles dataset and the Southern Ocean explorer page show the kind of observations involved (demo data).",
    sources: [
      { label: "Science: Southern Ocean", href: "/science/southern-ocean" },
      { label: "Dataset: Prydz Bay CTD profiles", href: "/vault/datasets/prydz-bay-ctd" },
    ],
    related: [{ label: "Southern Ocean expeditions", href: "/expeditions" }],
  },
  {
    id: "q-ecosystems",
    patterns: ["ecosystem", "ecosystems", "penguin", "penguins", "wildlife", "biodiversity", "species", "seal", "krill populations"],
    ctx: ["science", "gallery", "stories"],
    answer:
      "Polar ecosystems research covers biodiversity, species, habitats and environmental change — from penguin colonies to krill and microbial life. The gallery carries credited wildlife imagery, and the ecosystems area connects to citizen-science observations, which are kept clearly separate from verified institutional records.",
    sources: [
      { label: "Gallery", href: "/gallery" },
      { label: "Participate — citizen science", href: "/participate" },
    ],
    related: [{ label: "Science: ecosystems", href: "/science/cryosphere" }],
  },
  {
    id: "q-observations",
    patterns: ["long-term observations", "long term", "time series", "climate trends", "observational record"],
    ctx: ["science", "vault", "timeline"],
    answer:
      "Long-term observation is YETI's quiet superpower: turning decades of records into timelines, trends and research stories. The path is Observation → Time → Change → Context → Evidence — walk it on the timeline page or through any dataset's preview chart.",
    sources: [
      { label: "Research timeline", href: "/timeline" },
      { label: "The Vault", href: "/vault" },
    ],
    related: [{ label: "45 Years in Motion", href: "/#years" }],
  },
  {
    id: "q-aurora",
    patterns: ["aurora", "southern lights", "northern lights", "space weather", "magnetosphere", "polar atmosphere"],
    ctx: ["science", "learn"],
    answer:
      "The polar atmosphere is where solar activity meets the magnetosphere: auroras, space weather and upper-atmosphere processes. The aurora science page explains the mechanism with a reduced-motion-safe visualisation — conceptual, clearly labelled, and linked to upper-atmosphere research.",
    sources: [
      { label: "Science: Aurora & polar atmosphere", href: "/science/aurora" },
      { label: "Station: Maitri", href: "/stations/maitri" },
    ],
  },
  {
    id: "q-himalaya",
    patterns: ["himalaya", "himalayan", "mountain glacier", "siachen", "gangotri glacier"],
    ctx: ["science", "labs"],
    answer:
      "The Himalayan cryosphere connects polar science to India's own geography: Himalayas → glaciers → snow → observations → datasets → research → climate context. The Himalayan page links glacier records and the monsoon lab, since mountain ice feeds the same river systems the monsoon renews.",
    sources: [
      { label: "Science: Himalayan cryosphere", href: "/science/himalaya" },
      { label: "Monsoon-Link Lab", href: "/labs/monsoon-link" },
    ],
  },

  /* ---------------- vault & records ---------------- */
  {
    id: "q-datasets",
    patterns: ["datasets", "data available", "what data", "download data", "vault", "data catalog"],
    ctx: ["vault", "search"],
    answer:
      "The Vault currently demonstrates 12 datasets across glaciology, oceanography, atmospheric sciences, polar biology and human physiology — each with metadata, licence, version, preview charts and citation hooks. Important: all values are synthetic demonstration records; official Indian polar data must be accessed through NCPOR.",
    answerHi:
      "वॉल्ट में अभी 12 डेमो डेटासेट हैं — ग्लेशियोलॉजी, समुद्र-विज्ञान, वायुमंडलीय विज्ञान, ध्रुवीय जीव विज्ञान और मानव शरीर-क्रिया विज्ञान में — हर एक के साथ मेटाडेटा, लाइसेंस, संस्करण, पूर्वावलोकन चार्ट और साइटेशन हुक। ध्यान दें: सभी मान संश्लेषित डेमो रिकॉर्ड हैं; आधिकारिक भारतीय ध्रुवीय डेटा NCPOR से ही मिलता है।",
    answerBn:
      "ভল্টে এখন ১২টি ডেমো ডেটাসেট আছে — হিমবাহবিদ্যা, মহাসাগরবিদ্যা, বায়ুমণ্ডলীয় বিজ্ঞান, মেরু জীববিজ্ঞান ও মানব শারীরবিদ্যা জুড়ে — প্রতিটির সাথে মেটাডেটা, লাইসেন্স, সংস্করণ, প্রিভিউ চার্ট ও সাইটেশন হুক। লক্ষ করুন: সব মান সংশ্লেষিত ডেমো রেকর্ড; সরকারি ভারতীয় মেরু ডেটা শুধুই NCPOR থেকে পাওয়া যায়।",
    sources: [
      { label: "The Vault", href: "/vault" },
      { label: "Schirmacher SMB transects", href: "/vault/datasets/schirmacher-smb-transects" },
    ],
    related: [{ label: "Publication shelf", href: "/vault#publications" }],
  },
  {
    id: "q-licensing",
    patterns: ["licensed", "licence", "license", "licensing", "how is this data licensed", "under what licence", "cc by", "copyright", "usage rights"],
    ctx: ["vault", "expeditions"],
    answer:
      "Every record in the Vault carries an explicit licence: most demo datasets are CC BY 4.0, some are government open access, and restricted or embargoed records show metadata but gate the files behind access requests. The licence is stated on each dataset page next to the citation, so you always know what you may reuse.",
    sources: [
      { label: "The Vault", href: "/vault" },
      { label: "Example: Prydz Bay CTD licence", href: "/vault/datasets/prydz-bay-ctd" },
    ],
    related: [{ label: "Access classes explained", href: "/about#honesty" }],
  },
  {
    id: "q-access",
    patterns: ["access request", "restricted", "restricted data", "embargo", "access class", "gated"],
    ctx: ["vault", "researcher", "admin"],
    answer:
      "Scientific data is not universally open. Records are Open, Registered, Restricted, Embargoed, Internal or Removed. Restricted and embargoed records show their metadata but gate the files; researchers can raise an access request, and NCPOR administrators decide and audit every request.",
    sources: [
      { label: "The Vault", href: "/vault" },
      { label: "About: access classes", href: "/about#honesty" },
    ],
    related: [{ label: "Researcher: contribute & request", href: "/researcher" }],
  },
  {
    id: "q-act",
    patterns: ["antarctic act", "indian antarctic act", "law", "treaty", "governance", "regulation"],
    ctx: ["timeline", "newsroom"],
    answer:
      "The Indian Antarctic Act, 2022 is India's domestic law governing Antarctic activities — environmental protection, permits and accountability — giving statutory form to commitments under the Antarctic Treaty system, which India joined as a consultative party in 1983.",
    sources: [
      { label: "Newsroom: Act receives assent", href: "/newsroom" },
      { label: "45 Years in Motion", href: "/#years" },
    ],
  },

  /* ---------------- researcher tools ---------------- */
  {
    id: "q-graph",
    patterns: ["knowledge graph", "graph", "connections", "relationships", "related research", "trace", "how are records connected"],
    ctx: ["researcher", "vault"],
    answer:
      "The knowledge graph connects expeditions, stations, researchers, reports, datasets, publications, observations and media. Open the Polar Knowledge Graph from the researcher workspace: click any node to expand its two-hop neighbourhood, filter by kind, or trace the shortest path between two records. Seeded edges are labelled as such.",
    sources: [
      { label: "Polar Knowledge Graph", href: "/researcher/graph" },
      { label: "Researcher workspace", href: "/researcher" },
    ],
  },
  {
    id: "q-collections",
    patterns: ["collection", "collections", "citation", "citations", "bibtex", "ris", "save records", "annotation", "annotations"],
    ctx: ["researcher", "vault"],
    answer:
      "Collections are the researcher's reading shelf: save records from anywhere in the archive, attach private annotations, and export the whole collection as BibTeX or RIS. In this demo they persist per browser; the production backend stores them per account.",
    sources: [
      { label: "My collections", href: "/researcher/collections" },
      { label: "Researcher workspace", href: "/researcher" },
    ],
  },
  {
    id: "q-contribute",
    patterns: ["contribute", "submission", "submit", "upload record", "publish my", "contribution workflow", "add a record"],
    ctx: ["researcher", "admin"],
    answer:
      "Researchers contribute papers, datasets, notes, photographs, videos or institutional resources through the contribution desk. A submission includes metadata, source, rights, description and relationships — and it never becomes public merely because it was uploaded: Pending → Revisions Requested → Approved, with the decision audited.",
    sources: [
      { label: "Contribution desk", href: "/researcher/contribute" },
      { label: "Review queue (admin)", href: "/admin/review" },
    ],
  },

  /* ---------------- dissemination & publishing ---------------- */
  {
    id: "q-dissemination",
    patterns: ["dissemination", "social media", "media studio", "press release", "outreach content", "drafts", "publish content", "channels"],
    ctx: ["admin", "newsroom"],
    answer:
      "The Social Media Dissemination engine transforms an approved report into channel drafts — press release, X thread, Instagram, LinkedIn, newsletter, Hindi press release and image alt-texts — each with provenance and a match-confidence label. Nothing publishes without editor and scientific approval; unreviewed AI content is not publishable.",
    sources: [
      { label: "Social Media Dissemination (admin)", href: "/admin/dissemination" },
      { label: "Newsroom", href: "/newsroom" },
    ],
  },

  /* ---------------- education & participation ---------------- */
  {
    id: "q-learn",
    patterns: ["learn", "lessons", "gyaan", "quiz", "quizzes", "learning path", "certificate", "education", "class 6", "class 10", "teacher"],
    ctx: ["learn", "home"],
    answer:
      "Polar Gyaan is the learning hub: curriculum-mapped paths for Class 6–10 with short lessons, checkpoint quizzes, collectible badges and a printable Junior Polar Scientist certificate. Teacher resources are attached, and everything is grounded in the same archive records.",
    answerHi:
      "पोलर ज्ञान लर्निंग हब है: कक्षा 6–10 के लिए पाठ्यक्रम-आधारित पथ — छोटे पाठ, चेकपॉइंट क्विज़, बैज और प्रिंट करने योग्य 'जूनियर पोलर साइंटिस्ट' प्रमाणपत्र। शिक्षक संसाधन संलग्न हैं, और सब कुछ उसी संग्रह के रिकॉर्ड से जुड़ा है।",
    answerBn:
      "পোলার জ্ঞান হল লার্নিং হাব: ক্লাস ৬–১০-এর জন্য পাঠ্যক্রম-ভিত্তিক পথ — ছোট পাঠ, চেকপয়েন্ট কুইজ, ব্যাজ ও প্রিন্টযোগ্য 'জুনিয়র পোলার সায়েন্টিস্ট' সার্টিফিকেট। শিক্ষক-সম্পদ সংযুক্ত, এবং সবই একই সংগ্রহের রেকর্ডের সাথে যুক্ত।",
    sources: [
      { label: "Polar Gyaan", href: "/learn" },
      { label: "Science missions", href: "/learn/missions" },
    ],
  },
  {
    id: "q-missions",
    patterns: ["mission", "missions", "science missions", "identify the species", "read the ice", "find the evidence", "decode the climate graph"],
    ctx: ["learn", "home"],
    answer:
      "Science Missions are structured activities: Identify the Species, Read the Ice, Follow an Expedition, Decode the Climate Graph, Find the Evidence, Explore the Southern Ocean and Trace a Scientific Discovery. They power education and engagement without turning the platform into a game.",
    sources: [
      { label: "Science Missions", href: "/learn/missions" },
      { label: "Polar Gyaan", href: "/learn" },
    ],
  },
  {
    id: "q-citizenscience",
    patterns: ["citizen science", "participate", "contribute observations", "image classification", "help science"],
    ctx: ["home", "participate"],
    answer:
      "Yes — moderated public participation exists. On the Participate page you can try image-classification observations; citizen contributions enter a clearly separated review class so they never mix with verified institutional records.",
    sources: [
      { label: "Participate", href: "/participate" },
      { label: "Review queue (admin)", href: "/admin/review" },
    ],
  },
  {
    id: "q-glossary",
    patterns: ["glossary", "what does that word", "terminology", "definitions", "jargon"],
    ctx: ["learn", "vault"],
    answer:
      "The glossary defines the archive's working vocabulary — in English, हिन्दी and বাংলা — with each term linking to records that use it. Find it under Learn.",
    sources: [{ label: "Glossary", href: "/learn/glossary" }],
  },

  /* ---------------- platform ---------------- */
  {
    id: "q-atlas",
    patterns: ["atlas", "globe", "map", "3d globe", "how to use the atlas", "fly"],
    ctx: ["atlas", "home"],
    answer:
      "The Expedition Atlas puts every expedition since 1981 on a 3D globe: scrub 45 years, filter by programme or decade, and open any arc for its route, science and records. Without WebGL it falls back to a 2D map — and everything links back into the archive.",
    sources: [
      { label: "Expedition Atlas", href: "/atlas" },
      { label: "Research timeline", href: "/timeline" },
    ],
  },
  {
    id: "q-search",
    patterns: ["search", "find records", "how do i find", "unified search", "advanced search"],
    ctx: ["search", "home"],
    answer:
      "Search is unified across the archive: press ⌘K (or the search button) for exact terms, filters and zero-result handling that hands off to me. Filters cover region, station, expedition, year, topic, resource type and access class; results explain why they are relevant.",
    sources: [
      { label: "Search", href: "/search" },
      { label: "The Vault", href: "/vault" },
    ],
  },
  {
    id: "q-museum",
    patterns: ["museum", "qr", "kiosk", "exhibit"],
    ctx: ["museum", "home"],
    answer:
      "Museum Connect turns physical exhibits into entry points: a visitor scans a QR code and lands on a curated story that links into the same expedition, station, research and media records — the museum is another door into the same ecosystem. A kiosk mode is built in.",
    sources: [{ label: "Museum bridge", href: "/museum" }],
    related: [{ label: "Story: The Station That Sank", href: "/stories/the-station-that-sank" }],
  },
  {
    id: "q-stories",
    patterns: ["stories", "story", "documentary", "read something", "narrative"],
    ctx: ["stories", "home"],
    answer:
      "Stories turn records into narrative: the flagship is 'The Station That Sank' — how Dakshin Gangotri was swallowed by the ice shelf it stood on, and what that taught the programme. Each chapter links to the underlying records.",
    sources: [
      { label: "All stories", href: "/stories" },
      { label: "The Station That Sank", href: "/stories/the-station-that-sank" },
    ],
  },
  {
    id: "q-timeline",
    patterns: ["timeline", "history", "decade", "when did india", "chronology"],
    ctx: ["timeline", "home", "expeditions"],
    answer:
      "The research timeline lays out the programme decade by decade — 1981 first landing, 1983 Dakshin Gangotri, 1989 Maitri, 2007 Arctic, 2008 Himadri, 2012 Bharati, 2022 the Antarctic Act — every event linked to its actual records.",
    sources: [
      { label: "Research timeline", href: "/timeline" },
      { label: "45 Years in Motion", href: "/#years" },
    ],
  },
  {
    id: "q-admin",
    patterns: ["admin", "administrator", "console", "ingestion", "review queue", "audit", "workflow of ncpor"],
    ctx: ["admin", "researcher"],
    answer:
      "The NCPOR admin console runs the pipeline: ingestion with OCR and metadata extraction, duplicate detection, the scientific review queue, publication approval in Social Media Dissemination, access-request decisions, and a full audit trail. The workflow is Ingest → Validate → Review → Approve → Disseminate → Govern.",
    sources: [
      { label: "Admin console", href: "/admin" },
      { label: "Review queue", href: "/admin/review" },
    ],
  },
  {
    id: "q-exp-important",
    patterns: ["expedition important", "why was this expedition", "importance of", "purpose of the expedition", "why did they go", "expedition significance", "significance"],
    ctx: ["expeditions"],
    answer:
      "Each expedition extended India's reach in a different way — first landings, station construction, glaciology and oceanography campaigns, station support. This archive's story mode walks every expedition as Research Question → Location → Field Activity → Observation → Interpretation → Outputs, so the importance is grounded in what it actually produced.",
    sources: [
      { label: "Expeditions index", href: "/expeditions" },
      { label: "Research timeline", href: "/timeline" },
    ],
  },
  {
    id: "q-exp-produce",
    patterns: ["produce", "produced", "what did it produce", "outputs", "products of the expedition", "findings"],
    ctx: ["expeditions"],
    answer:
      "Expeditions produce reports, datasets, publications and imagery — and in this archive every expedition page links to its actual outputs where they exist, with an honest note where digitisation is still pending. Follow an expedition page's Outputs chapter, or trace one through the knowledge graph.",
    sources: [
      { label: "Expeditions index", href: "/expeditions" },
      { label: "Knowledge graph", href: "/researcher/graph" },
    ],
  },
  {
    id: "q-demo",
    patterns: ["demo data", "is this real", "real data", "fake data", "honest", "synthetic", "trust this"],
    ctx: ["home", "about", "vault"],
    answer:
      "Honest answer: this is a demonstration build for SIH26063. Records flagged 'demo' or 'synthetic' are illustrative, seeded graph edges are labelled, imagery carries provenance, and nothing publishes without review. The structure mirrors a production NCPOR deployment — the data would be real, the governance is already real.",
    sources: [
      { label: "Data honesty note", href: "/about#honesty" },
      { label: "About YETI", href: "/about" },
    ],
  },
];

/* ---- retrieval ---------------------------------------------------------- */

const STOP = new Set([
  "the", "a", "an", "of", "is", "are", "was", "were", "what", "which", "who", "whom", "when", "where", "how",
  "why", "to", "in", "on", "at", "for", "do", "does", "did", "can", "could", "would", "should", "tell", "me",
  "about", "this", "that", "it", "its", "and", "or", "has", "have", "had", "there", "their", "from", "with",
  "please", "i", "you", "your", "my", "we", "us", "any", "some",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Token-overlap retrieval: a question like "How is this data licensed?" and a
 * pattern like "how is this data licensed" match on shared tokens even when
 * wording varies. Exact phrase containment scores highest; per-entry page
 * context gives a small boost. Deterministic on ties (first entry wins).
 */
export function retrieve(query: string, context?: string): AskEntry | null {
  const qTokens = tokenize(query).filter((w) => !STOP.has(w));
  if (qTokens.length === 0) return null;
  const qLower = ` ${query.toLowerCase().replace(/\s+/g, " ").trim()} `;

  let best: { entry: AskEntry; score: number } | null = null;
  for (const entry of ASK_ENTRIES) {
    let entryScore = 0;
    for (const p of entry.patterns) {
      const pTokens = tokenize(p);
      if (pTokens.length === 0) continue;
      let matched = 0;
      for (const w of pTokens) if (qTokens.includes(w)) matched++;
      let score = matched * 2;
      if (matched === pTokens.length) score += 4; // whole pattern present
      if (qLower.includes(` ${p.toLowerCase()} `)) score += 6; // exact phrase
      entryScore = Math.max(entryScore, score);
    }
    if (context && entry.ctx?.includes(context)) entryScore += 1.5;
    if (entryScore >= 2 && (!best || entryScore > best.score)) best = { entry, score: entryScore };
  }
  return best?.entry ?? null;
}

export const ASK_SUGGESTIONS = [
  "What happened to Dakshin Gangotri?",
  "When was Maitri commissioned?",
  "How are the Arctic and the Indian monsoon connected?",
  "What datasets are available?",
  "Who led the first expedition?",
  "How is this data licensed?",
];
