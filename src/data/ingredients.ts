import type { Ingredient } from "@/types";

/* ==========================================================================
   INGREDIENTS — shown in the "Ano ang Nasa Loob" section (see
   src/components/sections/IngredientsSection.tsx), directly after the
   product section. Names are scientific/product terms and are deliberately
   NOT translated (same across locales); only the description is localized.
   ========================================================================== */

export const ingredients: Ingredient[] = [
  {
    id: "collagen-type-ii",
    name: "Collagen Type II",
    image: "/assets/ingredients/collagen-type-ii.png",
    description: {
      en: "A type of collagen associated with cartilage.",
      fil: "Isang uri ng collagen na nauugnay sa cartilage.",
    },
  },
  {
    id: "peptides",
    name: "Peptides",
    image: "/assets/ingredients/peptides.png",
    description: {
      en: "Short chains of amino acids.",
      fil: "Maiikling chain ng amino acids.",
    },
  },
  {
    id: "glucosamine-sulfate",
    name: "Glucosamine Sulfate",
    image: "/assets/ingredients/glucosamine-sulfate.png",
    description: {
      en: "A common ingredient in joint-support supplements.",
      fil: "Karaniwang sangkap sa joint-support supplements.",
    },
  },
  {
    id: "chondroitin-sulfate",
    name: "Chondroitin Sulfate",
    image: "/assets/ingredients/chondroitin-sulfate.png",
    description: {
      en: "A natural component found in cartilage.",
      fil: "Isang natural na bahagi na matatagpuan sa cartilage.",
    },
  },
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    image: "/assets/ingredients/hyaluronic-acid.png",
    description: {
      en: "A natural substance known for its ability to hold moisture.",
      fil: "Natural na substance na kilala sa kakayahang humawak ng moisture.",
    },
  },
];
