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
    /** Quiet trust badge near the product image — hero + "Meet Flexolex" section only. */
    originalProductBadge: string;
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
    /** Third check-marked benefit bullet, from the affiliate offer's own product description. */
    jointPainBenefit: string;
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

  ingredients: {
    eyebrow: string;
    title: string;
    lead: string;
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
    /** Label text next to the required "agree to be called" checkbox. */
    callConsentLabel: string;
    /** Shown under the checkbox only after a failed submit attempt with it unchecked. */
    errorCallConsentRequired: string;
    submitting: string;
    /** Centered reassurance line directly below the phone number field. */
    reassurance: string;
    /** Smaller, subtler trust line below the reassurance line, with a shield-check icon. */
    privacy: string;
    failure: string;
    /** Success state — compact label next to the checkmark icon. */
    successTitle: string;
    /** Success state — small supporting line under successTitle. */
    successBody: string;
    /** Success state — small uppercase kicker above successHeadline. */
    successEyebrow: string;
    /** Success state — the main "one step left" message. */
    successHeadline: string;
    /** Success state — 3-step progress bar label, step 1 (completed). */
    successStepRequest: string;
    /** Success state — 3-step progress bar label, step 2 (active). */
    successStepConfirm: string;
    /** Success state — 3-step progress bar label, step 3 (pending). */
    successStepDelivery: string;
    /** Success state — small uppercase kicker inside the "next step" card. */
    successCardEyebrow: string;
    /** Success state — bold headline inside the "next step" card. */
    successCardHeadline: string;
    /** Success state — body line inside the "next step" card. */
    successNote: string;
    /** Success state — smallest, subtlest line inside the "next step" card. */
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
