/* ==========================================================================
   GLOBAL SITE CONTENT
   Brand, pricing, navigation and shared microcopy. Edit here — every section
   reads from this file, nothing is hard-coded twice.
   ========================================================================== */

export const brand = {
  name: "FLEXOLEX",
  /** Category line — the visitor must know what this is within one second. */
  category: "Daily Joint Support",
  tagline: "Daily support for comfortable movement.",
} as const;

export const pricing = {
  currency: "₱",
  original: 3940,
  current: 1970,
  discountLabel: "50% OFF",
} as const;

export const formatPeso = (amount: number): string =>
  `${pricing.currency}${amount.toLocaleString("en-PH")}`;

export const priceText = {
  original: formatPeso(pricing.original),
  current: formatPeso(pricing.current),
} as const;

export const navLinks = [{ label: "Reviews", href: "#reviews" }] as const;

/** Trust strip — general wellness statements only. No authority claims. */
export const trustItems = [
  {
    id: "daily-support",
    icon: "leaf",
    title: "Daily Joint Support",
    description: "A wellness product made to be taken as part of your day.",
  },
  {
    id: "easy-routine",
    icon: "sun",
    title: "Easy Daily Routine",
    description: "Simple to fit into the morning, with no complicated steps.",
  },
  {
    id: "everyday-movement",
    icon: "footprints",
    title: "Made for Everyday Movement",
    description: "For walking, gardening, chores — the ordinary things.",
  },
] as const;

export const legal = {
  disclaimer:
    "Flexolex is a wellness product intended to support your daily routine. It is not intended to diagnose, treat, cure or prevent any disease. If you have a medical condition, are pregnant, or are taking medication, talk to your doctor before use.",
  copyright: `© ${new Date().getFullYear()} Flexolex. All rights reserved.`,
} as const;
