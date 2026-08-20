import type { Dictionary } from "./dictionary";

/* ==========================================================================
   Filipino copy — written for adults 40+, not a literal word-for-word
   translation of en.ts. Simple, warm, everyday Filipino with the light,
   natural Taglish Filipinos actually use, not textbook Tagalog.
   ========================================================================== */

export const fil: Dictionary = {
  common: {
    orderNow: "MAG-ORDER NA",
    getFlexolex: "KUNIN ANG FLEXOLEX",
    claimOff: "KUNIN ANG 50% OFF",
    categoryLabel: "Pang-araw-araw na Suporta sa Kasu-kasuan",
  },

  header: {
    navReviews: "Mga Review",
    openMenu: "Buksan ang menu",
    closeMenu: "Isara ang menu",
    backToTop: "bumalik sa itaas",
    chooseLanguage: "Pumili ng wika",
    navLabelMain: "Pangunahing Menu",
    navLabelMobile: "Mobile Menu",
    skipToContent: "Lumaktaw sa nilalaman",
  },

  hero: {
    eyebrow: "Pang-araw-araw na suporta sa kasu-kasuan",
    headlineLead: "Araw-araw na suporta para sa",
    headlineAccent: "komportableng galaw",
    trust: "Punan ang form sa ibaba at tatawagan ka namin para kumpirmahin ang iyong order.",
    playAriaLabel: "I-play ang video",
    replayAriaLabel: "Ulitin ang video",
  },

  trustStrip: {
    sectionLabel: "Ano ang Flexolex",
    items: [
      {
        id: "daily-support",
        icon: "leaf",
        title: "Pang-araw-araw na Suporta sa Kasu-kasuan",
        description: "Isang wellness product na ginawa para maging bahagi ng iyong araw.",
      },
      {
        id: "easy-routine",
        icon: "sun",
        title: "Madaling Gawing Routine",
        description: "Madaling isama sa umaga, walang kumplikadong hakbang.",
      },
      {
        id: "everyday-movement",
        icon: "footprints",
        title: "Para sa Pang-araw-araw na Galaw",
        description: "Para sa paglalakad, paghahardin, gawaing bahay — mga ordinaryong bagay.",
      },
    ],
  },

  product: {
    eyebrow: "Ang produkto",
    titleLead: "Kilalanin ang",
    lead: "Isang pang-araw-araw na produkto para sa suporta ng kasu-kasuan, gawa para madaling maisama sa iyong routine.",
    points: [
      {
        title: "Isang pang-araw-araw na wellness product",
        description: "Hindi ito gamot, at hindi ito kapalit ng pangangalagang medikal.",
      },
      {
        title: "Simple mula sa umpisa",
        description: "Isang presyo, isang maikling form, isang tawag para kumpirmahin. Walang tagong hakbang.",
      },
    ],
  },

  lifestyle: {
    eyebrow: "Pang-araw-araw na galaw",
    title: "Mga bagay na ginagawa mo na araw-araw",
    paragraph:
      "Paglalakad papuntang sari-sari store. Pag-akyat at pababa ng hagdan. Isang hapon sa hardin, o paglalaro kasama ang mga apo. Ito ang mga sandaling gustong suportahan ng Flexolex, para magawa mo pa rin ito nang komportable.",
    activities: ["Paglalakad", "Paghahardin", "Gawaing bahay", "Pamamalengke", "Hagdan sa bahay", "Oras kasama ang pamilya"],
    notes: ["Gawa para sa araw-araw na gamit", "Para sa edad 25 pataas", "Isang simpleng routine"],
    imageLabels: {
      couple: "Magkasamang naglalakad",
      family: "Linggo sa bahay",
      stairs: "Hagdan sa bahay",
    },
  },

  reviews: {
    eyebrow: "Sa kanilang mga salita",
    title: "Ito ang itsura ng araw-araw na paggamit",
    lead: "Maikling kwento mula sa mga taong isinama ang Flexolex sa routine na meron na sila.",
    swipeHint: "I-swipe para sa iba pa",
    prevAriaLabel: "Nakaraang mga review",
    nextAriaLabel: "Higit pang mga review",
    showFewer: "Ipakita ang mas kaunti",
    showMore: (remaining) => `Ipakita pa ang mga review (${remaining})`,
    ratedAriaLabel: (value) => `${value} sa 5 na bituin`,
  },

  offer: {
    eyebrow: "Espesyal na alok",
    title: "Flexolex, 50% OFF ngayon",
    paragraph: "Ang promo price na ito ay para sa mga order na gagawin dito sa page na ito.",
    points: [
      "Pangalan at numero ng telepono lang ang kailangan para makapag-umpisa",
      "Tatawagan ka ng aming representative para kumpirmahin ang lahat ng detalye",
    ],
  },

  order: {
    eyebrow: "Order",
    title: "I-order ang Flexolex",
    lead: "Ilagay ang iyong detalye at tatawagan ka namin para kumpirmahin ang order mo.",
    nameLabel: "Buong pangalan",
    namePlaceholder: "Juan Dela Cruz",
    phoneLabel: "Numero ng telepono",
    phonePlaceholder: "09XX XXX XXXX",
    phoneHint: "Tatawagan namin ang numerong ito para kumpirmahin ang iyong order.",
    submitting: "Ipinapadala…",
    privacy: "Gagamitin lang ang iyong detalye para makontak ka tungkol sa order na ito.",
    failure: "May problemang naganap. Pakisuri ang iyong detalye at subukan ulit.",
    successTitle: "Salamat!",
    successBody: "Natanggap na ang iyong request.",
    successNote: "Makikipag-ugnayan sa iyo ang aming representative para kumpirmahin ang order mo.",
    successFooter: "Panatilihing malapit ang iyong telepono para hindi mo mamiss ang tawag.",
    errorNameRequired: "Pakilagay ang iyong buong pangalan.",
    errorPhoneRequired: "Pakilagay ang iyong numero ng telepono.",
    errorPhoneInvalid: "Pakilagay ang tamang numero ng telepono, hal. 0912 345 6789.",
  },

  footer: {
    tagline: "Pang-araw-araw na suporta sa kasu-kasuan, gawa para sa ordinaryong araw.",
    disclaimer:
      "Ang Flexolex ay isang wellness product na ginawa upang suportahan ang iyong pang-araw-araw na routine. Hindi ito gamot at hindi ito ginawa upang mag-diagnose, gumamot, magpagaling, o pumigil sa anumang sakit. Kung mayroon kang medical condition, buntis, o umiinom ng gamot, kumonsulta muna sa iyong doktor bago gamitin ito.",
    copyright: (year) => `© ${year} Flexolex. Lahat ng karapatan ay nakalaan.`,
  },

  priceDisplay: {
    promoSr: "Promo na presyo",
    originalSr: "Orihinal na presyo",
  },
};
