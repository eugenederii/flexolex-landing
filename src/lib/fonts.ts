import { Unbounded, Manrope, Sora } from "next/font/google";
// import localFont from "next/font/local";

/**
 * DISPLAY / HEADINGS — Unbounded
 * Used only for: hero headline, section headings, price, selected stats.
 * Never for long paragraphs.
 * Only the weights we actually render are loaded (500 / 600 / 700).
 */
export const displayFont = Unbounded({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-unbounded",
  display: "swap",
  preload: true,
});

/**
 * BODY / UI — Gilroy (pending licensed font files)
 *
 * TODO: Gilroy font files are not in the project yet.
 * When the licensed files arrive:
 *   1. Drop them into `src/app/fonts/` (see the README in that folder for the
 *      exact filenames and weights we need).
 *   2. Delete the `Manrope` import + `bodyFont` below.
 *   3. Uncomment the `localFont` block below.
 *   4. Nothing else changes — everything consumes `--font-body`.
 *
 * Manrope is used as a TEMPORARY stand-in: geometric-humanist sans with a
 * similar tone, wide language coverage and excellent screen legibility.
 */
export const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

/**
 * SUCCESS-STATE HEADLINE ONLY — Sora.
 * Not applied globally (never added to <html> in app/layout.tsx). Used only
 * by the post-submit success headline in OrderSection.tsx, for a slightly
 * more editorial typographic mood at that one moment. `preload: false`
 * because that component may never render on a given page load (only after
 * a successful form submit) — no reason to block on it upfront.
 */
export const successDisplayFont = Sora({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-sora",
  display: "swap",
  preload: false,
});

// export const bodyFont = localFont({
//   src: [
//     { path: "../app/fonts/Gilroy-Regular.woff2", weight: "400", style: "normal" },
//     { path: "../app/fonts/Gilroy-Medium.woff2", weight: "500", style: "normal" },
//     { path: "../app/fonts/Gilroy-SemiBold.woff2", weight: "600", style: "normal" },
//     { path: "../app/fonts/Gilroy-Bold.woff2", weight: "700", style: "normal" },
//   ],
//   variable: "--font-body",
//   display: "swap",
//   preload: true,
//   fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
// });
