"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/* Lightweight EN/HI layer for chrome + hero + section headers.
   Content-level Hindi appears in the Sanchar engine (press release, हिन्दी). */

type Lang = "en" | "hi";

const DICT: Record<string, { en: string; hi: string }> = {
  "nav.atlas": { en: "Atlas", hi: "एटलस" },
  "nav.expeditions": { en: "Expeditions", hi: "अभियान" },
  "nav.vault": { en: "Vault", hi: "भंडार" },
  "nav.gallery": { en: "Gallery", hi: "गैलरी" },
  "nav.gyaan": { en: "Gyaan", hi: "ज्ञान" },
  "nav.newsroom": { en: "Newsroom", hi: "समाचार" },
  "nav.stories": { en: "Stories", hi: "कहानियाँ" },
  "nav.stations": { en: "Stations", hi: "स्टेशन" },
  "nav.more": { en: "More", hi: "और" },
  "nav.learn": { en: "Learn", hi: "सीखें" },
  "cta.journey": { en: "Begin the Journey", hi: "यात्रा शुरू करें" },
  "cta.gyaan": { en: "Polar Gyaan for Schools", hi: "स्कूलों के लिए पोलर ज्ञान" },
  "hero.line1": {
    en: "India has been going to the ice since 1981.",
    hi: "1981 से भारत बर्फ़ की दुनिया में जा रहा है।",
  },
  "hero.line2": { en: "Almost no one has seen it.", hi: "बहुत कम लोगों ने इसे देखा है।" },
  "hero.line3": { en: "Until now.", hi: "अब तक।" },
  "hero.sub": {
    en: "45 years of Indian polar expeditions, data, imagery and stories — one window, open to everyone.",
    hi: "भारतीय ध्रुवीय अभियानों के 45 साल — डेटा, तस्वीरें और कहानियाँ, एक खिड़की में, सबके लिए खुली।",
  },
  "ask.title": { en: "Ask Yeti", hi: "येती से पूछें" },
  "ask.grounded": { en: "Answers are grounded in the archive. No citation, no answer.", hi: "उत्तर केवल संग्रह से — बिना स्रोत, बिना उत्तर।" },
  "search.placeholder": { en: "Search the archive…", hi: "संग्रह में खोजें…" },
  "theme.toggle": { en: "Theme", hi: "थीम" },
  "lang.toggle": { en: "हिन्दी", hi: "English" },
};

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICT) => string;
}

const Ctx = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  t: (k) => DICT[k]?.en ?? k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("yeti-lang");
    if (stored === "hi" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("yeti-lang", l);
  }, []);

  const t = useCallback(
    (key: keyof typeof DICT) => (lang === "hi" ? DICT[key]?.hi ?? DICT[key]?.en : DICT[key]?.en) ?? key,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

/** Swaps text content when language toggles; renders Devanagari font when Hindi. */
export function T({
  k,
  className,
  as: As = "span",
}: {
  k: keyof typeof DICT;
  className?: string;
  as?: "span" | "h1" | "h2" | "p" | "div";
}) {
  const { lang, t } = useLang();
  return (
    <As className={`${className ?? ""} ${lang === "hi" ? "font-hindi" : ""}`}>{t(k)}</As>
  );
}
