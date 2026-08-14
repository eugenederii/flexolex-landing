/* ==========================================================================
   ASSET REGISTRY
   --------------------------------------------------------------------------
   Every future image path lives here, with the alt text it will need and a
   note describing the shot we are waiting for. Nothing has been downloaded —
   each `src` is null, so the placeholder renders instead.

   TO GO LIVE WITH REAL IMAGERY:
     1. Drop the file into the matching folder under /public/assets/.
     2. Set `src` below.
   The components switch to <Image> automatically. No component edits needed.
   ========================================================================== */

export interface AssetSlot {
  /** null = not supplied yet → placeholder renders. */
  src: string | null;
  /** Written now so real images ship accessible from day one. */
  alt: string;
  /** Brief for whoever sources the photo. */
  brief: string;
  width: number;
  height: number;
}

export const assets = {
  /* ---------- Product package (appears 5×: hero, product, offer, order, final) */
  productPack: {
    src: "/assets/product/flexolex-pack.png",
    alt: "Flexolex daily joint support container",
    brief: "Official Flexolex package, front view, transparent background.",
    width: 1080,
    height: 1080,
  },

  /* ---------- Lifestyle editorial ---------------------------------------- */
  lifestyleCouple: {
    src: "/assets/lifestyle/couple-walk.png",
    alt: "Couple in their fifties walking together outdoors",
    brief: "Filipino couple, 50–60, walking side by side. Relaxed pace, everyday clothing.",
    width: 1080,
    height: 1350,
  },
  lifestyleFamily: {
    src: "/assets/lifestyle/morning-stretch.png",
    alt: "Woman stretching her arm on a sunny balcony at home",
    brief: "Filipina, 55–65, light arm stretch at home. Bright, plant-filled balcony backdrop.",
    width: 1080,
    height: 1080,
  },
  lifestyleStairs: {
    src: "/assets/lifestyle/stairs-home.png",
    alt: "Woman walking down the stairs at home",
    brief: "Filipina, 55–65, on home stairs, hand on the rail. Soft interior light.",
    width: 1080,
    height: 1350,
  },
} as const satisfies Record<string, AssetSlot>;

export type AssetKey = keyof typeof assets;
