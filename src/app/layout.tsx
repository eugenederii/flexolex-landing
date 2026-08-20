import type { Metadata, Viewport } from "next";
import { bodyFont, displayFont } from "@/lib/fonts";
import { brand } from "@/data/site";
import { LanguageProvider } from "@/components/LanguageProvider";
import { MetaPixel } from "@/components/tracking/MetaPixel";
import { SkipToContent } from "@/components/SkipToContent";
import "./globals.css";

/* ==========================================================================
   SEO metadata — Filipino-first, matching DEFAULT_LOCALE (see
   src/data/locales/index.ts). Next.js metadata is static/server-rendered
   and can't read the visitor's localStorage language choice, so — same as
   the <html lang> below — it represents what a first-time visitor and
   search crawlers actually see: Filipino. Written directly here (not
   pulled through the reactive `t()` dictionary system) since it's one-time
   static text, not part of the interactive language switch; kept in the
   same natural, simple tone as src/data/locales/fil.ts. `brand.name`
   ("FLEXOLEX") is never translated.
   ========================================================================== */
const seoCategoryFil = "Araw-araw na Suporta sa Kasu-kasuan";
const seoTaglineFil = "Para sa mas komportableng paggalaw.";
const seoDescriptionFil =
  "Ang Flexolex ay ginawa para sa araw-araw na suporta ng kasu-kasuan — sa paglalakad, paghahardin, at iba pang gawain sa bahay. Mag-order online: ilagay ang iyong pangalan at numero ng telepono at tatawagan ka namin para kumpirmahin.";

export const metadata: Metadata = {
  title: `${brand.name} — ${seoCategoryFil} | ${seoTaglineFil}`,
  description: seoDescriptionFil,
  applicationName: brand.name,
  robots: { index: true, follow: true },
  openGraph: {
    title: `${brand.name} — ${seoCategoryFil}`,
    description: seoTaglineFil,
    type: "website",
    locale: "tl_PH",
    siteName: brand.name,
  },
  // TODO: add /assets/og/og-image.jpg once the real product photography lands.
};

export const viewport: Viewport = {
  themeColor: "#f8f6f1",
  width: "device-width",
  initialScale: 1,
  // Never block zoom — the audience will use it.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tl"
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning on <html>: LanguageProvider updates the
          `lang` attribute client-side once it knows the visitor's saved
          preference (see src/components/LanguageProvider.tsx) — every new
          visitor still gets a Filipino ("tl") first paint, so there's
          nothing to mismatch, just an attribute React shouldn't warn about
          re-syncing. */}
      {/* suppressHydrationWarning on <body>: some browser extensions (e.g.
          ColorZilla's cz-shortcut-listen) inject attributes onto <body>
          before React hydrates. That's a real DOM mismatch, but not a bug in
          this app — this tells React to ignore attribute diffs on this one
          node instead of logging a false-positive hydration error for every
          visitor who has such an extension installed. */}
      <body className="antialiased" suppressHydrationWarning>
        <MetaPixel />
        <LanguageProvider>
          <SkipToContent />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
