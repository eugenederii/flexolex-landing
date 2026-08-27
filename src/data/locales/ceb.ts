import type { Dictionary } from "./dictionary";

/* ==========================================================================
   Cebuano (Bisaya) copy — written for adults 40+, not a literal
   word-for-word translation of en.ts or fil.ts. Simple, warm, everyday
   Cebuano the way it's actually spoken in Cebu/Davao/Mindanao, not
   textbook or overly formal Binisaya.
   ========================================================================== */

export const ceb: Dictionary = {
  common: {
    orderNow: "ORDER NA",
    getFlexolex: "KUHAA ANG FLEXOLEX",
    claimOff: "KUHAA ANG 50% OFF",
    categoryLabel: "Adlaw-adlaw nga Suporta sa Lutahan",
    originalProductBadge: "Orihinal nga FLEXOLEX",
  },

  header: {
    navReviews: "Mga Review",
    openMenu: "Ablihi ang menu",
    closeMenu: "Sirad-i ang menu",
    backToTop: "balik sa taas",
    chooseLanguage: "Pilia ang pinulongan",
    navLabelMain: "Panguna nga Menu",
    navLabelMobile: "Mobile Menu",
    skipToContent: "Laktaw ngadto sa sulod",
  },

  hero: {
    eyebrow: "Adlaw-adlaw nga suporta sa lutahan",
    headlineLead: "Adlaw-adlaw nga suporta para sa",
    headlineAccent: "komportable nga paglihok",
    trust: "Sulati ang porma sa ubos ug tawagan ka namo para kumpirmahon ang imong order.",
    jointPainBenefit: "Mga capsule para sa sakit sa lutahan",
    playAriaLabel: "I-play ang video",
    replayAriaLabel: "Balika ang video",
  },

  trustStrip: {
    sectionLabel: "Unsa ang Flexolex",
    items: [
      {
        id: "daily-support",
        icon: "leaf",
        title: "Adlaw-adlaw nga Suporta sa Lutahan",
        description: "Usa ka wellness product nga gihimo aron mahimong bahin sa imong adlaw.",
      },
      {
        id: "easy-routine",
        icon: "sun",
        title: "Sayon nga Adlaw-adlaw nga Routine",
        description: "Sayon isagol sa buntag, walay komplikado nga lakang.",
      },
      {
        id: "everyday-movement",
        icon: "footprints",
        title: "Gihimo para sa Adlaw-adlaw nga Paglihok",
        description: "Para sa paglakaw, pag-atiman ug tanaman, buluhaton sa balay — ang ordinaryo nga mga butang.",
      },
    ],
  },

  product: {
    eyebrow: "Ang produkto",
    titleLead: "Ilaila",
    lead: "Usa ka adlaw-adlaw nga produkto para sa suporta sa lutahan, gihimo aron sayon isagol sa imong routine.",
    points: [
      {
        title: "Usa ka adlaw-adlaw nga wellness product",
        description: "Dili kini tambal, ug dili kini puli sa pag-atiman sa doktor.",
      },
      {
        title: "Sayon sukad sa sinugdanan",
        description: "Usa ka presyo, usa ka mubo nga porma, usa ka tawag para sa kumpirmasyon. Walay tago nga lakang.",
      },
    ],
  },

  ingredients: {
    eyebrow: "Unsay sulod",
    title: "Mga panguna nga sangkap sa FLEXOLEX",
    lead: "Gisagol nga mga sangkap para sa adlaw-adlaw nga suporta sa lutahan.",
  },

  lifestyle: {
    eyebrow: "Adlaw-adlaw nga paglihok",
    title: "Ang mga butang nga imong ginabuhat na kada adlaw",
    paragraph:
      "Paglakaw padulong sa sari-sari store. Pagsaka ug pagkanaog sa hagdan. Usa ka hapon sa tanaman, o paglaag-laag uban sa mga apo. Kini ang mga higayon nga gusto suportahan sa Flexolex, aron mapadayon nimo kini nga komportable.",
    activities: ["Paglakaw", "Pag-atiman ug tanaman", "Buluhaton sa balay", "Pagpamalengke", "Hagdan sa balay", "Oras uban sa pamilya"],
    notes: ["Gihimo para sa adlaw-adlaw nga gamit", "Para sa edad 25 pataas", "Usa ka sayon nga routine"],
    imageLabels: {
      couple: "Naglakaw nga magkuyog",
      family: "Domingo sa balay",
      stairs: "Hagdan sa balay",
    },
  },

  reviews: {
    eyebrow: "Sa ilang kaugalingong pulong",
    title: "Mao ni ang hitsura sa adlaw-adlaw nga paggamit",
    lead: "Mubo nga mga kasugilanon gikan sa mga tawo nga misagol sa Flexolex sa routine nga naa na sila.",
    swipeHint: "I-swipe para sa uban pa",
    prevAriaLabel: "Miaging mga review",
    nextAriaLabel: "Dugang pang mga review",
    showFewer: "Ipakita ang gamay lang",
    showMore: (remaining) => `Ipakita pa ang mga review (${remaining})`,
    ratedAriaLabel: (value) => `${value} sa 5 ka bituon`,
  },

  offer: {
    eyebrow: "Espesyal nga tanyag",
    title: "Flexolex, 50% OFF karon",
    paragraph: "Kini nga promo price alang lang sa mga order nga himuon dinhi niini nga page.",
    points: [
      "Ngalan ug numero sa telepono ra ang kinahanglan para makasugod",
      "Tawagan ka sa among representative para kumpirmahon ang tanang detalye",
    ],
  },

  order: {
    eyebrow: "Order",
    title: "I-order ang Flexolex",
    lead: "Isulat ang imong detalye ug tawagan ka namo para kumpirmahon ang imong order.",
    nameLabel: "Bug-os nga ngalan",
    namePlaceholder: "Juan Dela Cruz",
    phoneLabel: "Numero sa telepono",
    phonePlaceholder: "9XX XXX XXXX",
    callConsentLabel: "Uyon ko nga tawagan aron makumpirma ang akong order.",
    errorCallConsentRequired: "Kinahanglan una nimong i-check kini.",
    submitting: "Gipadala…",
    noPaymentNote: "Walay bayad karon — kumpirmahon una namo ang order pinaagi sa tawag.",
    reserveNote: "Ibilin ang imong numero aron ma-reserve ang FLEXOLEX sa presyo karon.",
    privacy: "Gamiton ra ang imong detalye aron makontak ka bahin niini nga order.",
    failure: "Naay problema nga nahitabo. Palihug susiha ang imong detalye ug sulayi pag-usab.",
    successTitle: "Request received",
    successBody: "Nadawat na namo ang imong Flexolex request.",
    successEyebrow: "One last step",
    successHeadline: "Tubaga ang among tawag para ma-confirm ang imong Flexolex order",
    successStepRequest: "Request",
    successStepConfirm: "Confirm",
    successStepDelivery: "Delivery",
    successCardEyebrow: "Sunod nga lakang",
    successCardHeadline: "Keep your phone nearby",
    successNote: "Motawag kanimo ang among Flexolex representative para ma-confirm ang imong order.",
    successFooter: "Palihug tubaga ang tawag aron makompleto ang confirmation.",
    errorNameRequired: "Palihug isulat ang imong bug-os nga ngalan.",
    errorPhoneRequired: "Palihug isulat ang imong numero sa telepono.",
    errorPhoneInvalid: "Palihug isulat ang husto nga numero sa telepono, pananglitan +63 912 345 6789.",
  },

  footer: {
    tagline: "Adlaw-adlaw nga suporta sa lutahan, gihimo para sa ordinaryo nga adlaw.",
    disclaimer:
      "Ang Flexolex usa ka wellness product nga gihimo aron suportahan ang imong adlaw-adlaw nga routine. Dili kini tambal ug dili gihimo aron mag-diagnose, motambal, moayo, o mopugong sa bisan unsang sakit. Kung naa kay medical condition, buntis, o nag-inom ug tambal, pakisayod una sa imong doktor sa dili pa kini gamiton.",
    copyright: (year) => `© ${year} Flexolex. Tanang katungod gitipigan.`,
  },

  priceDisplay: {
    promoSr: "Promo nga presyo",
    originalSr: "Orihinal nga presyo",
  },
};
