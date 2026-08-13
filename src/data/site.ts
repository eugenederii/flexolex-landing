/* ==========================================================================
   GLOBAL SITE CONTENT
   Brand and pricing — locale-independent facts, not copy. Translatable UI
   text (nav labels, trust strip, legal disclaimer, etc.) lives in
   src/data/locales/en.ts and fil.ts instead, since it changes per language.
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
