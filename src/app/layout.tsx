import type { Metadata, Viewport } from "next";
import { bodyFont, displayFont } from "@/lib/fonts";
import { brand } from "@/data/site";
import { LanguageProvider } from "@/components/LanguageProvider";
import { MetaPixel } from "@/components/tracking/MetaPixel";
import "./globals.css";

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.category} | ${brand.tagline}`,
  description:
    "Flexolex is a daily joint support product made for everyday movement — walking, gardening, household activities. Order online: enter your name and phone number and our representative will contact you to confirm.",
  applicationName: brand.name,
  robots: { index: true, follow: true },
  openGraph: {
    title: `${brand.name} — ${brand.category}`,
    description: brand.tagline,
    type: "website",
    locale: "en_PH",
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
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning on <html>: LanguageProvider updates the
          `lang` attribute client-side once it knows the visitor's saved
          preference (see src/components/LanguageProvider.tsx) — every new
          visitor still gets an English first paint, so there's nothing to
          mismatch, just an attribute React shouldn't warn about re-syncing. */}
      {/* suppressHydrationWarning on <body>: some browser extensions (e.g.
          ColorZilla's cz-shortcut-listen) inject attributes onto <body>
          before React hydrates. That's a real DOM mismatch, but not a bug in
          this app — this tells React to ignore attribute diffs on this one
          node instead of logging a false-positive hydration error for every
          visitor who has such an extension installed. */}
      <body className="antialiased" suppressHydrationWarning>
        <MetaPixel />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-navy focus:px-6 focus:py-3 focus:font-semibold focus:text-cream"
        >
          Skip to content
        </a>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
