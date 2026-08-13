import type { Review } from "@/types";

/* ==========================================================================
   ⚠️  SAMPLE / PLACEHOLDER REVIEWS — NOT REAL CUSTOMER FEEDBACK
   --------------------------------------------------------------------------
   These 15 entries exist to build and test the testimonial UI. They are
   invented, they describe routine and daily habits only, and they make no
   claim about results, symptoms, conditions or outcomes.

   TODO: replace every entry below with supplied, verified customer content
   before this page goes live, then set `reviewsArePlaceholder` to false.

   Avatars are null on purpose — no stock photos have been sourced. The card
   falls back to an initials monogram. When real photos arrive, set
   `avatar: "/assets/testimonials/<file>.jpg"`.
   ========================================================================== */

export const reviewsArePlaceholder = true;

export const reviews: Review[] = [
  {
    id: "r01",
    name: "Maria Santos",
    age: 54,
    city: "Quezon City",
    quote:
      "I take it every morning with my coffee. Naging bahagi na ng routine ko — it is the easiest part of my day.",
    avatar: null,
    rating: 5,
  },
  {
    id: "r02",
    name: "Ernesto Villanueva",
    age: 61,
    city: "Manila",
    quote:
      "Simple lang. One product, one time a day. I do not have to think about it, and that is why I still take it.",
    avatar: null,
    rating: 5,
  },
  {
    id: "r03",
    name: "Lourdes Aquino",
    age: 58,
    city: "Cebu City",
    quote:
      "My husband and I take it together after breakfast. It became our small routine and we like keeping it.",
    avatar: null,
    rating: 5,
  },
  {
    id: "r04",
    name: "Rodolfo Cruz",
    age: 63,
    city: "Davao City",
    quote:
      "I walk every morning around our village. Adding this to the routine was easy — no fuss, no complicated schedule.",
    avatar: null,
    rating: 4,
  },
  {
    id: "r05",
    name: "Teresita Ramos",
    age: 49,
    city: "Pasig",
    quote:
      "The ordering was straightforward. Someone called me to confirm and explained everything clearly.",
    avatar: null,
    rating: 5,
  },
  {
    id: "r06",
    name: "Alfredo Bautista",
    age: 66,
    city: "Makati",
    quote:
      "At my age I want things that are simple to follow. This one I actually remember to take.",
    avatar: null,
    rating: 5,
  },
  {
    id: "r07",
    name: "Corazon Dela Cruz",
    age: 52,
    city: "Taguig",
    quote:
      "I keep it beside the kettle so I see it every morning. Sanay na ako — it is part of the day now.",
    avatar: null,
    rating: 5,
  },
  {
    id: "r08",
    name: "Benjamin Reyes",
    age: 57,
    city: "Quezon City",
    quote:
      "I like that the packaging is clear and easy to read. Hindi maliit ang letters, which I appreciate.",
    avatar: null,
    rating: 4,
  },
  {
    id: "r09",
    name: "Remedios Garcia",
    age: 60,
    city: "Manila",
    quote:
      "Gardening is my hobby and I am outside most mornings. Taking this is one less thing to think about.",
    avatar: null,
    rating: 5,
  },
  {
    id: "r10",
    name: "Ricardo Mendoza",
    age: 55,
    city: "Cebu City",
    quote:
      "Ordering took me less than a minute. I only had to give my name and my number.",
    avatar: null,
    rating: 5,
  },
  {
    id: "r11",
    name: "Josefina Torres",
    age: 64,
    city: "Pasig",
    quote:
      "My daughter ordered it for me. She said it is easy to take daily, and she was right.",
    avatar: null,
    rating: 5,
  },
  {
    id: "r12",
    name: "Danilo Navarro",
    age: 59,
    city: "Davao City",
    quote:
      "I bring the container with me when we travel to the province. Small enough, no hassle.",
    avatar: null,
    rating: 4,
  },
  {
    id: "r13",
    name: "Angelita Fernandez",
    age: 51,
    city: "Makati",
    quote:
      "I wanted something I could keep up with for a long time, not just for one week. This fits.",
    avatar: null,
    rating: 5,
  },
  {
    id: "r14",
    name: "Wilfredo Domingo",
    age: 68,
    city: "Taguig",
    quote:
      "The representative was polite on the phone and did not rush me. Malinaw ang paliwanag.",
    avatar: null,
    rating: 5,
  },
  {
    id: "r15",
    name: "Elena Pascual",
    age: 47,
    city: "Quezon City",
    quote:
      "I am on my feet the whole day at home. Keeping a steady daily routine matters to me, and this is part of it.",
    avatar: null,
    rating: 5,
  },
];
