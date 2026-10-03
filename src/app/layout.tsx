import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, JetBrains_Mono, Noto_Sans_Devanagari, Space_Grotesk } from "next/font/google";
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

// Avoids theme flash: applies stored/OS theme before hydration.
const themeBootstrap = `
(function(){
  try {
    var stored = localStorage.getItem("yeti-theme");
    var osLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    var theme = stored || (osLight ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);
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
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${notoDevanagari.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
