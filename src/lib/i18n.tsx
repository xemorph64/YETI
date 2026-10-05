"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";

/* YETI multilingual layer — English + all 22 scheduled languages (master doc §56).
   English, हिन्दी and বাংলা are hand-written (locales/base.json); the other 20 are
   machine-translated by scripts/translate-ui.py into locales/mt/<id>.json and
   fetched only when chosen. Covers chrome, hero, USP band, section headers, empty
   states and Ask YETI. Deep body content stays English with an honest notice;
   scientific terminology, proper names and units are never translated. */

import BASE from "@/lib/locales/base.json";
import LANG_LIST from "@/lib/locales/langs.json";

export type Lang = string;
type Key = keyof typeof BASE;

const DICT = BASE as Record<Key, Record<string, string>>;
const LANGS = LANG_LIST as { id: Lang; label: string; native: string; mt?: boolean; rtl?: boolean }[];

const info = (l: Lang) => LANGS.find((x) => x.id === l);
/** Text direction for a language — Urdu, Kashmiri and Sindhi read right-to-left. */
export const langDir = (l: Lang) => (info(l)?.rtl ? "rtl" : "ltr");
/** Script font for the hand-written tier; other scripts fall back through the global font stack. */
export const langFont = (l: Lang) => (l === "hi" ? "font-hindi" : l === "bn" ? "font-bengali" : "");

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: Key) => string;
  langs: typeof LANGS;
  machine: boolean;
}

const Ctx = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  t: (k) => DICT[k]?.en ?? k,
  langs: LANGS,
  machine: false,
});

const LANG_KEY = "yeti-lang";
const isLang = (v: string | null): v is Lang => !!v && !!info(v);

const loadMt = (l: Lang): Promise<Record<string, string>> =>
  import(`@/lib/locales/mt/${l}.json`).then((m) => m.default, () => ({}));

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [mt, setMt] = useState<{ lang: Lang; dict: Record<string, string> } | null>(null);

  // Restore before paint — a Hindi/Bengali reader never sees an English flash.
  // (useLayoutEffect runs after hydration but before the browser paints.)
  useLayoutEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(LANG_KEY);
    } catch {
      stored = null;
    }
    if (isLang(stored) && stored !== "en") {
      setLangState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  // Machine-translated dictionaries load on demand; English shows until they land.
  useEffect(() => {
    if (!info(lang)?.mt) return;
    let live = true;
    loadMt(lang).then((dict) => live && setMt({ lang, dict }));
    return () => {
      live = false;
    };
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* private mode — session-only language */
    }
  }, []);

  const t = useCallback(
    (key: Key) => (mt?.lang === lang ? mt.dict[key] : undefined) ?? DICT[key]?.[lang] ?? DICT[key]?.en ?? key,
    [lang, mt],
  );

  const machine = !!info(lang)?.mt;
  const value = useMemo(() => ({ lang, setLang, t, langs: LANGS, machine }), [lang, setLang, t, machine]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

/** Swaps text when the language changes; applies the right script font. */
export function T({
  k,
  className,
  as: As = "span",
}: {
  k: Key;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}) {
  const { lang, t } = useLang();
  return (
    <As className={`${className ?? ""} ${langFont(lang)}`} dir={langDir(lang)}>
      {t(k)}
    </As>
  );
}

/** Honest notice for sections whose deep body content is English-only (§56). */
export function ContinuesInEnglish({ className }: { className?: string }) {
  const { lang, t, machine } = useLang();
  if (lang === "en") return null;
  return (
    <p
      className={`inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface-2 px-3 py-1 text-[11px] text-text-3 ${langFont(lang)} ${className ?? ""}`}
      lang={lang}
      dir={langDir(lang)}
    >
      <span aria-hidden>ⓘ</span>
      {t("lang.continues")}
      {machine && ` ${t("lang.machine")}`}
    </p>
  );
}
