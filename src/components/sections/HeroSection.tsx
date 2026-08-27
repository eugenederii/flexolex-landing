"use client";

import Image from "next/image";
import { Check, PhoneCall } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Reveal } from "@/components/ui/Reveal";
import { TrustBadge } from "@/components/ui/TrustBadge";

export function HeroSection() {
  const { t } = useLanguage();
  const copy = t.hero;

  // First two reused, not invented, from the trust strip just below the
  // hero. The third is the affiliate offer's own product description
  // ("Капсулы от боли в суставах" in the partner network's listing).
  const benefits = [t.trustStrip.items[0].title, t.trustStrip.items[2].title, copy.jointPainBenefit];

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="grain relative isolate overflow-hidden bg-cream pt-20 pb-10 sm:pt-24 sm:pb-14 lg:pt-28 lg:pb-20"
    >
      {/* Decorative field — no meaning, hidden from assistive tech. Same
          soft blue/cream palette as the doctor photo's own background, so
          the mask-faded image area (below) blends into it rather than
          meeting a mismatched color. */}
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
        {/* Headline — full width, on its own, above the photo */}
        <Reveal className="text-center lg:text-left">
          <h1
            id="hero-title"
            className="text-[1.75rem] leading-[1.16] break-words sm:text-5xl sm:leading-[1.1] lg:max-w-2xl lg:text-6xl lg:leading-[1.1]"
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

        {/* Photo — everything else (badge, support copy, benefits,
            price, CTA, phone trust line) is real HTML/CSS laid directly
            over the photo's own clean left-side negative space, not a
            separate block beside it. No card: no border, no rounded
            frame, no drop shadow. A left-fading mask lets the page's own
            background show through under that text instead of a hard
            image edge. */}
        <Reveal delay={100} className="relative mt-6 sm:mt-8 lg:mt-10">
          <div className="relative aspect-[3/4] w-full sm:aspect-[4/5] lg:mx-auto lg:aspect-[4/3] lg:max-w-5xl">
            <Image
              src="/assets/hero/flexolex-doctor-hero.png"
              alt=""
              fill
              priority
              quality={90}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover object-[76%_4%] [mask-image:linear-gradient(to_right,transparent_0%,black_55%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_55%)]"
            />

            <div className="absolute inset-y-0 left-0 flex w-[62%] flex-col items-start justify-center gap-3 px-4 py-6 text-left sm:w-[56%] sm:gap-4 sm:px-6 lg:w-[46%] lg:gap-5 lg:px-2">
              <TrustBadge />

              <p className="w-full min-w-0 text-sm text-ink-soft sm:text-lg lg:max-w-md">{t.product.lead}</p>

              <ul className="flex w-full min-w-0 flex-col items-start gap-1.5 sm:gap-2.5">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-1.5 text-xs font-semibold text-ink sm:gap-2.5 sm:text-base"
                  >
                    <Check aria-hidden="true" className="size-3.5 shrink-0 text-navy sm:size-4.5" strokeWidth={2.6} />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="lg:hidden">
                <PriceDisplay size="sm" />
              </div>
              <div className="hidden lg:block">
                <PriceDisplay size="lg" />
              </div>

              <p className="flex w-full min-w-0 items-start gap-1.5 text-xs text-ink-muted sm:gap-2.5 sm:text-base">
                <PhoneCall
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-navy sm:mt-1 sm:size-4.5"
                  strokeWidth={2}
                />
                {copy.trust}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
