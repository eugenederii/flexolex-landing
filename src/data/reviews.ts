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
   ========================================================================== */

export const reviewsArePlaceholder = true;

export const reviews: Review[] = [
  {
    id: "r01",
    name: "Maria Santos",
    age: 54,
    city: "Quezon City",
    quote:
      "I usually take mine after breakfast, bago ako mag-start sa mga gawain sa bahay. After a few days, naging automatic na lang siya for me.",
    avatar: "/assets/testimonials/maria-santos.png",
    rating: 5,
  },
  {
    id: "r02",
    name: "Ernesto Villanueva",
    age: 61,
    city: "Manila",
    quote:
      "Honestly, I like that there is nothing complicated about it. I keep it beside my coffee so I don’t forget in the morning.",
    avatar: "/assets/testimonials/ernesto-villanueva.png",
    rating: 5,
  },
  {
    id: "r03",
    name: "Lourdes Aquino",
    age: 58,
    city: "Cebu City",
    quote:
      "My husband started taking his first, then I joined him. Ngayon sabay na kami after breakfast. Small thing, but it works well with our morning.",
    avatar: "/assets/testimonials/lourdes-aquino.png",
    rating: 5,
  },
  {
    id: "r04",
    name: "Rodolfo Cruz",
    age: 63,
    city: "Davao City",
    quote:
      "I’m usually out early for my morning walk. I just take this before I leave the house and that’s it. Walang hassle.",
    avatar: "/assets/testimonials/rodolfo-cruz.png",
    rating: 4,
  },
  {
    id: "r05",
    name: "Teresita Ramos",
    age: 49,
    city: "Pasig",
    quote:
      "I was a little unsure when I ordered online, but the call afterwards was clear and polite. They explained everything without rushing me.",
    avatar: "/assets/testimonials/teresita-ramos.png",
    rating: 5,
  },
  {
    id: "r06",
    name: "Alfredo Bautista",
    age: 66,
    city: "Makati",
    quote:
      "At 66, ayoko na talaga ng maraming steps at instructions. This one is straightforward, so I actually remember to take it.",
    avatar: "/assets/testimonials/alfredo-bautista.png",
    rating: 5,
  },
  {
    id: "r07",
    name: "Corazon Dela Cruz",
    age: 52,
    city: "Taguig",
    quote:
      "I leave it near the kettle because I know I’ll see it every morning. Simple trick, pero effective para hindi ko makalimutan.",
    avatar: "/assets/testimonials/corazon-dela-cruz.png",
    rating: 5,
  },
  {
    id: "r08",
    name: "Benjamin Reyes",
    age: 57,
    city: "Quezon City",
    quote:
      "The label is actually readable, which I appreciate. Hindi sobrang liit ng sulat and the packaging looks clean.",
    avatar: "/assets/testimonials/benjamin-reyes.png",
    rating: 4,
  },
  {
    id: "r09",
    name: "Remedios Garcia",
    age: 60,
    city: "Manila",
    quote:
      "I spend a lot of mornings outside with my plants. I take this before I head to the garden, then I just go on with my day.",
    avatar: "/assets/testimonials/remedios-garcia.png",
    rating: 5,
  },
  {
    id: "r10",
    name: "Ricardo Mendoza",
    age: 55,
    city: "Cebu City",
    quote:
      "Ordering was quicker than I expected. Name, phone number, then someone called me to confirm. Yun lang.",
    avatar: "/assets/testimonials/ricardo-mendoza.png",
    rating: 5,
  },
  {
    id: "r11",
    name: "Josefina Torres",
    age: 64,
    city: "Pasig",
    quote:
      "My daughter was the one who showed this to me and helped me order. Now I don’t even need her to remind me anymore.",
    avatar: "/assets/testimonials/josefina-torres.png",
    rating: 5,
  },
  {
    id: "r12",
    name: "Danilo Navarro",
    age: 59,
    city: "Davao City",
    quote:
      "I brought it with me when we stayed in the province for a few days. Small enough to pack, so no problem bringing it along.",
    avatar: "/assets/testimonials/danilo-navarro.png",
    rating: 4,
  },
  {
    id: "r13",
    name: "Angelita Fernandez",
    age: 51,
    city: "Makati",
    quote:
      "I wanted something that wouldn’t make my mornings more complicated. This fits in quietly with everything else I already do.",
    avatar: "/assets/testimonials/angelita-fernandez.png",
    rating: 5,
  },
  {
    id: "r14",
    name: "Wilfredo Domingo",
    age: 68,
    city: "Taguig",
    quote:
      "The person who called was patient, which I liked. Hindi minadali yung conversation and I had time to ask my questions.",
    avatar: "/assets/testimonials/wilfredo-domingo.png",
    rating: 5,
  },
  {
    id: "r15",
    name: "Elena Pascual",
    age: 47,
    city: "Quezon City",
    quote:
      "I’m on my feet most of the day doing things around the house. I keep this with my morning things so I see it before the day gets busy.",
    avatar: "/assets/testimonials/elena-pascual.png",
    rating: 5,
  },
];
