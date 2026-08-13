import { ArrowRight, Leaf, PhoneCall } from "lucide-react";
import { ORDER_SECTION_ID } from "@/lib/scrollToOrder";
import { Button } from "@/components/ui/Button";
import { HeroVideo } from "@/components/ui/HeroVideo";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductPlaceholder } from "@/components/ui/ProductPlaceholder";
import { Reveal } from "@/components/ui/Reveal";

const copy = {
  eyebrow: "Daily joint support",
  headlineLead: "Daily support for",
  headlineAccent: "comfortable movement",
  trust: "Fill in the form below and we'll call to confirm your order.",
};

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="grain relative isolate min-h-svh overflow-hidden bg-cream pt-20 pb-8 sm:min-h-0 sm:pt-24 sm:pb-12 lg:pt-32 lg:pb-24"
    >
      {/* Decorative field — no meaning, hidden from assistive tech */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-32 size-[34rem] rounded-full bg-[radial-gradient(circle,#dbe6f5_0%,transparent_68%)] opacity-80" />
        <div className="absolute top-1/3 -left-40 size-[28rem] rounded-full bg-[radial-gradient(circle,#f0dfae_0%,transparent_70%)] opacity-60" />
        <svg
          className="absolute -top-10 right-[6%] hidden h-[38rem] w-[38rem] lg:block"
          viewBox="0 0 400 400"
          fill="none"
        >
          <circle cx="200" cy="200" r="188" stroke="#123f8a" strokeOpacity="0.08" />
          <circle cx="200" cy="200" r="140" stroke="#123f8a" strokeOpacity="0.06" />
        </svg>
      </div>

      <div className="container-page">
        <div className="grid gap-y-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.84fr)] lg:items-center lg:gap-x-16">
          {/* ---- Message ---- */}
          <Reveal className="order-1 text-center lg:col-start-1 lg:row-start-1">
            <p className="eyebrow justify-center">
              <Leaf aria-hidden="true" className="size-4" strokeWidth={2.2} />
              {copy.eyebrow}
            </p>

            <h1
              id="hero-title"
              className="mt-4 text-[2.1rem] leading-[1.14] sm:text-5xl sm:leading-[1.1] lg:text-6xl"
            >
              {copy.headlineLead}{" "}
              <span className="relative inline-block text-navy">
                {copy.headlineAccent}.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-gold/45 sm:-bottom-2"
                >
                  <path
                    d="M2 8C60 3 150 2 298 6"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>
          </Reveal>

          {/* ---- Visual ---- */}
          <Reveal
            delay={120}
            className="order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <HeroVideo
                src="/assets/video/premium-wellness-hero.mp4"
                className="h-[66svh] w-full rounded-[2rem] shadow-lift sm:h-auto sm:aspect-[4/5]"
              />

              {/* Product pack overlapping the frame — from sm upward only.
                  On mobile the product moves below the photo instead (see
                  the price/CTA block), so nothing sits on top of the image. */}
              <div className="absolute -bottom-8 -left-8 hidden w-44 sm:block lg:w-48">
                <ProductPlaceholder
                  id="hero-desktop"
                  float
                  priority
                  sizes="200px"
                  className="drop-shadow-[0_24px_32px_rgba(11,46,99,0.35)]"
                />
              </div>
            </div>
          </Reveal>

          {/* ---- Price + CTA ---- */}
          <Reveal
            delay={80}
            className="order-3 mt-2 lg:col-start-1 lg:row-start-2 lg:mt-10"
          >
            {/* Mobile only: product and price grouped together, below the
                photo rather than overlapping it. */}
            <div className="mb-6 flex items-center gap-4 sm:hidden">
              <ProductPlaceholder
                id="hero-mobile"
                priority
                sizes="18vw"
                className="aspect-[320/430] w-18 shrink-0 drop-shadow-[0_14px_18px_rgba(11,46,99,0.25)]"
              />
              <PriceDisplay size="md" />
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
              <div className="hidden sm:block">
                <PriceDisplay size="lg" />
              </div>

              <Button
                scrollTo={ORDER_SECTION_ID}
                trackingSource="Hero"
                size="lg"
                className="w-full sm:w-auto"
              >
                ORDER NOW
                <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2.4} />
              </Button>
            </div>

            <p className="mt-5 flex items-start gap-2.5 text-base text-ink-muted">
              <PhoneCall
                aria-hidden="true"
                className="mt-1 size-4.5 shrink-0 text-navy"
                strokeWidth={2}
              />
              {copy.trust}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
