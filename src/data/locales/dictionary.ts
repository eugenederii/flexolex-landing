/* ==========================================================================
   DICTIONARY SHAPE
   --------------------------------------------------------------------------
   Every translatable string on the page, grouped by the section that owns
   it. src/data/locales/en.ts and fil.ts each implement this shape — add a
   field here, then fill it in both files (TypeScript enforces both stay in
   sync). Values that need a number (a count, a year) are functions instead
   of plain strings so interpolation stays type-checked.
   ========================================================================== */

export interface Dictionary {
  common: {
    orderNow: string;
    getFlexolex: string;
    claimOff: string;
    /** "Daily Joint Support" — the brand's category line, reused in the
     *  footer wordmark and the product section tagline. */
    categoryLabel: string;
  };

  header: {
    navReviews: string;
    openMenu: string;
    closeMenu: string;
    /** Appended after the brand name in the logo's aria-label. */
    backToTop: string;
    chooseLanguage: string;
    /** aria-label on the desktop <nav> landmark. */
    navLabelMain: string;
    /** aria-label on the mobile menu <nav> landmark. */
    navLabelMobile: string;
    /** The keyboard-only "Skip to content" link at the very top of the page. */
    skipToContent: string;
  };

  hero: {
    eyebrow: string;
    headlineLead: string;
    headlineAccent: string;
    trust: string;
    playAriaLabel: string;
    replayAriaLabel: string;
  };

  trustStrip: {
    /** aria-label on the section landmark. */
    sectionLabel: string;
    items: {
      id: string;
      icon: "leaf" | "sun" | "footprints";
      title: string;
      description: string;
    }[];
  };

  product: {
    eyebrow: string;
    /** "Meet" — composed as "{titleLead} Flexolex" around the brand name. */
    titleLead: string;
    lead: string;
    points: { title: string; description: string }[];
  };

  lifestyle: {
    eyebrow: string;
    title: string;
    paragraph: string;
    activities: string[];
    notes: string[];
    imageLabels: {
      couple: string;
      family: string;
      stairs: string;
    };
  };

  reviews: {
    eyebrow: string;
    title: string;
    lead: string;
    swipeHint: string;
    prevAriaLabel: string;
    nextAriaLabel: string;
    showFewer: string;
    showMore: (remaining: number) => string;
    ratedAriaLabel: (value: number) => string;
  };

  offer: {
    eyebrow: string;
    title: string;
    paragraph: string;
    points: string[];
  };

  order: {
    eyebrow: string;
    title: string;
    lead: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneHint: string;
    submitting: string;
    privacy: string;
    failure: string;
    successTitle: string;
    successBody: string;
    successNote: string;
    successFooter: string;
    errorNameRequired: string;
    errorPhoneRequired: string;
    errorPhoneInvalid: string;
  };

  footer: {
    tagline: string;
    disclaimer: string;
    copyright: (year: number) => string;
  };

  priceDisplay: {
    promoSr: string;
    originalSr: string;
  };
}
