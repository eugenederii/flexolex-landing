import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTracking } from "@/components/PageTracking";
import { StickyMobileCTA } from "@/components/ui/StickyMobileCTA";

import { HeroSection } from "@/components/sections/HeroSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ProductSection } from "@/components/sections/ProductSection";
import { LifestyleSection } from "@/components/sections/LifestyleSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { OfferSection } from "@/components/sections/OfferSection";
import { OrderSection } from "@/components/sections/OrderSection";

/**
 * Nearly every section is a "use client" component because each one reads
 * its copy from useLanguage() (see src/components/LanguageProvider.tsx) —
 * that's what makes the EN/FIL switch instant with no page reload.
 *
 * Order form is the last major section — footer follows directly.
 */
export default function Home() {
  return (
    <>
      <PageTracking />
      <Header />

      <main id="main">
        <HeroSection />
        <TrustStrip />
        <ProductSection />
        <LifestyleSection />
        <ReviewsSection />
        <OfferSection />
        <OrderSection />
      </main>

      <Footer />
      <StickyMobileCTA />
    </>
  );
}
