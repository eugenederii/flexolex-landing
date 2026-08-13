import type { Review } from "@/types";

/* ==========================================================================
   ⚠️  SAMPLE / PLACEHOLDER REVIEWS — NOT REAL CUSTOMER FEEDBACK
   --------------------------------------------------------------------------
   These 15 entries exist to build and test the testimonial UI. They are
   invented, they describe routine and daily habits only, and they make no
   claim about results, symptoms, conditions or outcomes.

   TODO: replace every entry below with supplied, verified customer content
   before this page goes live, then set `reviewsArePlaceholder` to false.

   Avatars point to /public/assets/testimonials — generated portraits used as
   placeholders until real customer photos are supplied.

   `quote` is per-locale (see src/types Locale) — the Filipino version is a
   natural, varied Taglish rendering of the same idea, not a literal
   word-for-word translation of the English one.
   ========================================================================== */

export const reviewsArePlaceholder = true;

export const reviews: Review[] = [
  {
    id: "r01",
    name: "Maria Santos",
    age: 54,
    city: "Quezon City",
    quote: {
      en: "I usually take mine after breakfast, bago ako mag-start sa mga gawain sa bahay. After a few days, naging automatic na lang siya for me.",
      fil: "Karaniwan kong iniinom ito after breakfast, bago ako magsimula sa mga gawain sa bahay. Pagkalipas ng ilang araw, naging bahagi na lang siya ng umaga ko.",
    },
    avatar: "/assets/testimonials/maria-santos.png",
    rating: 5,
  },
  {
    id: "r02",
    name: "Ernesto Villanueva",
    age: 61,
    city: "Manila",
    quote: {
      en: "Honestly, I like that there is nothing complicated about it. I keep it beside my coffee so I don’t forget in the morning.",
      fil: "Sa totoo lang, gusto ko kasi walang kumplikado dito. Nilalagay ko sa tabi ng kape ko para hindi ko makalimutan sa umaga.",
    },
    avatar: "/assets/testimonials/ernesto-villanueva.png",
    rating: 5,
  },
  {
    id: "r03",
    name: "Lourdes Aquino",
    age: 58,
    city: "Cebu City",
    quote: {
      en: "My husband started taking his first, then I joined him. Ngayon sabay na kami after breakfast. Small thing, but it works well with our morning.",
      fil: "Ang asawa ko ang unang uminom, tapos sumabay na rin ako. Ngayon magkasama na kami after breakfast. Maliit na bagay lang, pero bagay talaga sa umaga namin.",
    },
    avatar: "/assets/testimonials/lourdes-aquino.png",
    rating: 5,
  },
  {
    id: "r04",
    name: "Rodolfo Cruz",
    age: 63,
    city: "Davao City",
    quote: {
      en: "I’m usually out early for my morning walk. I just take this before I leave the house and that’s it. Walang hassle.",
      fil: "Maaga akong lumalabas para sa morning walk ko. Iniinom ko lang ito bago ako umalis ng bahay, tapos ayun na. Walang gulo.",
    },
    avatar: "/assets/testimonials/rodolfo-cruz.png",
    rating: 4,
  },
  {
    id: "r05",
    name: "Teresita Ramos",
    age: 49,
    city: "Pasig",
    quote: {
      en: "I was a little unsure when I ordered online, but the call afterwards was clear and polite. They explained everything without rushing me.",
      fil: "Medyo nag-aalangan ako nang mag-order ako online, pero malinaw at magalang yung tumawag pagkatapos. Ipinaliwanag nila lahat nang hindi nagmamadali.",
    },
    avatar: "/assets/testimonials/teresita-ramos.png",
    rating: 5,
  },
  {
    id: "r06",
    name: "Alfredo Bautista",
    age: 66,
    city: "Makati",
    quote: {
      en: "At 66, ayoko na talaga ng maraming steps at instructions. This one is straightforward, so I actually remember to take it.",
      fil: "Sa edad na 66, ayoko na talaga ng maraming hakbang at instructions. Simple lang ito, kaya naaalala ko talagang inumin.",
    },
    avatar: "/assets/testimonials/alfredo-bautista.png",
    rating: 5,
  },
  {
    id: "r07",
    name: "Corazon Dela Cruz",
    age: 52,
    city: "Taguig",
    quote: {
      en: "I leave it near the kettle because I know I’ll see it every morning. Simple trick, pero effective para hindi ko makalimutan.",
      fil: "Nilalagay ko sa tabi ng kettle dahil alam kong makikita ko ito tuwing umaga. Simpleng trick lang, pero effective para hindi ko makalimutan.",
    },
    avatar: "/assets/testimonials/corazon-dela-cruz.png",
    rating: 5,
  },
  {
    id: "r08",
    name: "Benjamin Reyes",
    age: 57,
    city: "Quezon City",
    quote: {
      en: "The label is actually readable, which I appreciate. Hindi sobrang liit ng sulat and the packaging looks clean.",
      fil: "Nababasa naman nang maayos yung label, na gusto ko talaga. Hindi sobrang liit ng sulat at malinis tingnan yung packaging.",
    },
    avatar: "/assets/testimonials/benjamin-reyes.png",
    rating: 4,
  },
  {
    id: "r09",
    name: "Remedios Garcia",
    age: 60,
    city: "Manila",
    quote: {
      en: "I spend a lot of mornings outside with my plants. I take this before I head to the garden, then I just go on with my day.",
      fil: "Madalas akong nasa labas kasama ang mga halaman ko sa umaga. Iniinom ko ito bago ako pumunta sa hardin, tapos itutuloy ko na lang ang araw ko.",
    },
    avatar: "/assets/testimonials/remedios-garcia.png",
    rating: 5,
  },
  {
    id: "r10",
    name: "Ricardo Mendoza",
    age: 55,
    city: "Cebu City",
    quote: {
      en: "Ordering was quicker than I expected. Name, phone number, then someone called me to confirm. Yun lang.",
      fil: "Mas mabilis pala mag-order kaysa inasahan ko. Pangalan, numero ng telepono, tapos tinawagan ako para kumpirmahin. Yun lang.",
    },
    avatar: "/assets/testimonials/ricardo-mendoza.png",
    rating: 5,
  },
  {
    id: "r11",
    name: "Josefina Torres",
    age: 64,
    city: "Pasig",
    quote: {
      en: "My daughter was the one who showed this to me and helped me order. Now I don’t even need her to remind me anymore.",
      fil: "Ang anak ko ang nagpakita nito sa akin at tumulong mag-order. Ngayon, hindi ko na kailangang paalalahanan pa niya.",
    },
    avatar: "/assets/testimonials/josefina-torres.png",
    rating: 5,
  },
  {
    id: "r12",
    name: "Danilo Navarro",
    age: 59,
    city: "Davao City",
    quote: {
      en: "I brought it with me when we stayed in the province for a few days. Small enough to pack, so no problem bringing it along.",
      fil: "Dinala ko ito nung nagpunta kami sa probinsya ng ilang araw. Maliit lang naman ang laki, kaya walang problemang isama sa bagahe.",
    },
    avatar: "/assets/testimonials/danilo-navarro.png",
    rating: 4,
  },
  {
    id: "r13",
    name: "Angelita Fernandez",
    age: 51,
    city: "Makati",
    quote: {
      en: "I wanted something that wouldn’t make my mornings more complicated. This fits in quietly with everything else I already do.",
      fil: "Gusto ko ng hindi nagpapahirap sa umaga ko. Tahimik lang itong nakakasama sa mga bagay na ginagawa ko na.",
    },
    avatar: "/assets/testimonials/angelita-fernandez.png",
    rating: 5,
  },
  {
    id: "r14",
    name: "Wilfredo Domingo",
    age: 68,
    city: "Taguig",
    quote: {
      en: "The person who called was patient, which I liked. Hindi minadali yung conversation and I had time to ask my questions.",
      fil: "Matiyaga yung tumawag sa akin, na gusto ko talaga. Hindi minadali yung usapan at nagkaroon ako ng time magtanong.",
    },
    avatar: "/assets/testimonials/wilfredo-domingo.png",
    rating: 5,
  },
  {
    id: "r15",
    name: "Elena Pascual",
    age: 47,
    city: "Quezon City",
    quote: {
      en: "I’m on my feet most of the day doing things around the house. I keep this with my morning things so I see it before the day gets busy.",
      fil: "Halos buong araw akong nakatayo ginagawa ang mga bagay sa bahay. Nilalagay ko ito kasama ng mga gamit ko sa umaga para makita ko bago pa mag-busy ang araw.",
    },
    avatar: "/assets/testimonials/elena-pascual.png",
    rating: 5,
  },
];
