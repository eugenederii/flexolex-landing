import type { Metadata, Viewport } from "next";
import { bodyFont, displayFont } from "@/lib/fonts";
import { brand } from "@/data/site";
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
    <html lang="en-PH" className={`${displayFont.variable} ${bodyFont.variable}`}>
      {/* suppressHydrationWarning: some browser extensions (e.g. ColorZilla's
          cz-shortcut-listen) inject attributes onto <body> before React
          hydrates. That's a real DOM mismatch, but not a bug in this app —
          this tells React to ignore attribute diffs on this one node instead
          of logging a false-positive hydration error for every visitor who
          has such an extension installed. */}
      <body className="antialiased" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-navy focus:px-6 focus:py-3 focus:font-semibold focus:text-cream"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
