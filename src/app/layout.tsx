import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Sans,
  JetBrains_Mono,
  Noto_Naskh_Arabic,
  Noto_Sans_Bengali,
  Noto_Sans_Devanagari,
  Noto_Sans_Gujarati,
  Noto_Sans_Gurmukhi,
  Noto_Sans_Kannada,
  Noto_Sans_Malayalam,
  Noto_Sans_Meetei_Mayek,
  Noto_Sans_Ol_Chiki,
  Noto_Sans_Oriya,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/chrome/SiteChrome";
import { SiteFooter } from "@/components/chrome/SiteFooter";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Body voice: IBM Plex Sans — warmer and more comfortable in long reading than
// Inter, with the institutional-science character an archive like this deserves.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  variable: "--font-noto-bengali",
  display: "swap",
});

// Remaining scheduled-language scripts. Script subset only and no preload: each
// file downloads only when a page actually renders glyphs from its unicode-range.
const notoSansGujarati = Noto_Sans_Gujarati({ display: "swap", preload: false, subsets: ["gujarati"], variable: "--font-gujarati" });
const notoSansGurmukhi = Noto_Sans_Gurmukhi({ display: "swap", preload: false, subsets: ["gurmukhi"], variable: "--font-gurmukhi" });
const notoSansKannada = Noto_Sans_Kannada({ display: "swap", preload: false, subsets: ["kannada"], variable: "--font-kannada" });
const notoSansMalayalam = Noto_Sans_Malayalam({ display: "swap", preload: false, subsets: ["malayalam"], variable: "--font-malayalam" });
const notoSansOriya = Noto_Sans_Oriya({ display: "swap", preload: false, subsets: ["oriya"], variable: "--font-oriya" });
const notoSansTamil = Noto_Sans_Tamil({ display: "swap", preload: false, subsets: ["tamil"], variable: "--font-tamil" });
const notoSansTelugu = Noto_Sans_Telugu({ display: "swap", preload: false, subsets: ["telugu"], variable: "--font-telugu" });
const notoSansOlChiki = Noto_Sans_Ol_Chiki({ display: "swap", preload: false, subsets: ["ol-chiki"], variable: "--font-ol-chiki" });
const notoSansMeeteiMayek = Noto_Sans_Meetei_Mayek({ display: "swap", preload: false, subsets: ["meetei-mayek"], variable: "--font-meetei-mayek" });
const notoNaskhArabic = Noto_Naskh_Arabic({ display: "swap", preload: false, subsets: ["arabic"], variable: "--font-arabic" });

const scriptVars = [
  notoSansGujarati,
  notoSansGurmukhi,
  notoSansKannada,
  notoSansMalayalam,
  notoSansOriya,
  notoSansTamil,
  notoSansTelugu,
  notoSansOlChiki,
  notoSansMeeteiMayek,
  notoNaskhArabic,
]
  .map((f) => f.variable)
  .join(" ");

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yeti-demo.example.org"),
  title: {
    default: "YETI Knows. Now You Can Too!",
    template: "%s · YETI",
  },
  description:
    "Integrated polar science outreach, knowledge repository and media dissemination portal. 45 years of Indian polar expeditions, research archives, imagery and education — in one place.",
  keywords: [
    "NCPOR",
    "polar science",
    "Antarctica",
    "Arctic",
    "Indian Antarctic Programme",
    "Maitri",
    "Bharati",
    "Himadri",
    "Southern Ocean",
    "polar education",
  ],
  openGraph: {
    title: "YETI Knows. Now You Can Too!",
    description:
      "45 years of Indian polar exploration: expeditions, data, imagery, stories and education from the ends of the Earth.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1628",
};

// Avoids theme + language flash: applies stored/OS theme and stored language
// before hydration (language restore is mirrored in the provider's layout effect).
const themeBootstrap = `
(function(){
  try {
    var stored = localStorage.getItem("yeti-theme");
    var osLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    var theme = stored || (osLight ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
    var lang = localStorage.getItem("yeti-lang");
    if (lang === "hi" || lang === "bn") document.documentElement.setAttribute("lang", lang);
    var rm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) document.documentElement.setAttribute("data-reduced-motion", "true");
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${notoDevanagari.variable} ${notoBengali.variable} ${scriptVars} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="grain flex min-h-[100dvh] flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-text"
        >
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
        <SiteFooter />
      </body>
    </html>
  );
}
