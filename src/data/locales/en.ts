import type { Dictionary } from "./dictionary";

export const en: Dictionary = {
  common: {
    orderNow: "ORDER NOW",
    getFlexolex: "GET FLEXOLEX",
    claimOff: "CLAIM 50% OFF",
    categoryLabel: "Daily Joint Support",
    originalProductBadge: "Original FLEXOLEX",
  },

  header: {
    navReviews: "Reviews",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    backToTop: "back to top",
    chooseLanguage: "Choose language",
    navLabelMain: "Main",
    navLabelMobile: "Mobile",
    skipToContent: "Skip to content",
  },

  hero: {
    eyebrow: "Daily joint support",
    headlineLead: "Daily support for",
    headlineAccent: "comfortable movement",
    trust: "Fill in the form below and we'll call to confirm your order.",
    jointPainBenefit: "Capsules for joint pain",
    playAriaLabel: "Play video",
    replayAriaLabel: "Replay video",
  },

  trustStrip: {
    sectionLabel: "What Flexolex is",
    items: [
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
    ],
  },

  product: {
    eyebrow: "The product",
    titleLead: "Meet",
    lead: "A daily joint-support product made to fit naturally into your routine.",
    points: [
      {
        title: "A daily wellness product",
        description: "Not a medicine, and not a replacement for medical care.",
      },
      {
        title: "Straightforward from the start",
        description: "One price, one short form, one confirmation call. No hidden steps.",
      },
    ],
  },

  ingredients: {
    eyebrow: "What's inside",
    title: "Flexolex's key ingredients",
    lead: "Combined ingredients for everyday joint support.",
  },

  lifestyle: {
    eyebrow: "Everyday movement",
    title: "The things you already do every day",
    paragraph:
      "Walking to the sari-sari store. Going up and down the stairs. An afternoon in the garden, or just keeping up with the grandkids. These are the moments Flexolex is meant to support, so you can keep doing them comfortably.",
    activities: ["Walking", "Gardening", "Household chores", "Market runs", "Stairs at home", "Time with family"],
    notes: ["Made for daily use", "For adults 25 and over", "One simple routine"],
    imageLabels: {
      couple: "Walking together",
      family: "Sunday at home",
      stairs: "Stairs at home",
    },
  },

  reviews: {
    eyebrow: "In their words",
    title: "What daily use actually looks like",
    lead: "Short notes from people who fitted Flexolex into a routine they already had.",
    swipeHint: "Swipe for more",
    prevAriaLabel: "Previous reviews",
    nextAriaLabel: "More reviews",
    showFewer: "Show fewer reviews",
    showMore: (remaining) => `Show more reviews (${remaining})`,
    ratedAriaLabel: (value) => `Rated ${value} out of 5`,
  },

  offer: {
    eyebrow: "Special offer",
    title: "Flexolex at 50% off",
    paragraph: "This promotional price applies to orders placed through this page.",
    points: [
      "Only your name and phone number to get started",
      "Our representative confirms every detail with you by phone",
    ],
  },

  order: {
    eyebrow: "Order",
    title: "Order Flexolex",
    lead: "Enter your details and we'll call to confirm your order.",
    nameLabel: "Full name",
    namePlaceholder: "Juan Dela Cruz",
    phoneLabel: "Phone number",
    phonePlaceholder: "9XX XXX XXXX",
    callConsentLabel: "I agree to receive a phone call to confirm my order.",
    errorCallConsentRequired: "Please confirm you agree to receive a call.",
    submitting: "Sending…",
    reassurance: "We'll call you quickly to confirm your order.",
    privacy: "Your details are used only to contact you about this order.",
    failure: "Something went wrong. Please check your details and try again.",
    successTitle: "Request received",
    successBody: "We've received your Flexolex request.",
    successEyebrow: "One last step",
    successHeadline: "Answer our call to confirm your Flexolex order",
    successStepRequest: "Request",
    successStepConfirm: "Confirm",
    successStepDelivery: "Delivery",
    successCardEyebrow: "Next step",
    successCardHeadline: "Please keep your phone nearby",
    successNote: "A Flexolex representative will call you to confirm your order.",
    successFooter: "Please answer the call so your order can be confirmed.",
    errorNameRequired: "Please enter your full name.",
    errorPhoneRequired: "Please enter your phone number.",
    errorPhoneInvalid: "Please enter a valid phone number, e.g. +63 912 345 6789.",
  },

  footer: {
    tagline: "Daily joint support, made to fit into an ordinary day.",
    disclaimer:
      "Flexolex is a wellness product intended to support your daily routine. It is not intended to diagnose, treat, cure or prevent any disease. If you have a medical condition, are pregnant, or are taking medication, talk to your doctor before use.",
    copyright: (year) => `© ${year} Flexolex. All rights reserved.`,
  },

  priceDisplay: {
    promoSr: "Promotional price",
    originalSr: "Original price",
  },
};
