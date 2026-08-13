"use client";

import { ArrowRight, Check } from "lucide-react";
import { pricing } from "@/data/site";
import { ORDER_SECTION_ID } from "@/lib/scrollToOrder";
import { useLanguage } from "@/components/LanguageProvider";
import { Section } from "@/components/ui/Section";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductPlaceholder } from "@/components/ui/ProductPlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function OfferSection() {
  const { t } = useLanguage();
  const copy = t.offer;

  return (
    <Section id="offer" tone="cream">
      <div className="container-page">
        <Reveal>
          <div className="grain on-dark relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy via-navy to-navy-deep px-6 py-12 sm:px-10 sm:py-14 lg:rounded-[2.25rem] lg:px-16 lg:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-28 -right-20 size-[26rem] rounded-full bg-[radial-gradient(circle,rgba(230,195,106,0.18)_0%,transparent_65%)]"
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:gap-16">
              {/* Product */}
              <div className="relative mx-auto w-52 sm:w-64 lg:w-full lg:max-w-[17rem]">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-10 bottom-8 rounded-full bg-[radial-gradient(circle,rgba(157,184,220,0.35)_0%,transparent_70%)]"
                />
                <ProductPlaceholder
                  id="offer"
                  sizes="(max-width: 1024px) 55vw, 270px"
                  className="relative drop-shadow-[0_30px_45px_rgba(0,0,0,0.45)]"
                />
                <span className="absolute -top-2 -right-1 rotate-6 rounded-full bg-gold-soft px-3.5 py-2 font-display text-sm font-bold text-navy-deep shadow-lg sm:-top-3 sm:-right-4">
                  {pricing.discountLabel}
                </span>
              </div>

              {/* Offer copy */}
              <div>
                <p className="eyebrow text-gold-soft">
                  <span aria-hidden="true" className="h-px w-6 bg-gold-soft/60" />
                  {copy.eyebrow}
                </p>

                <h2 className="mt-4 text-3xl text-cream sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                  {copy.title}
                </h2>

                <p className="mt-5 max-w-lg text-lg text-sky-soft/80">{copy.paragraph}</p>

                <div className="mt-8 rounded-2xl bg-white/6 p-6 ring-1 ring-white/10">
                  <PriceDisplay size="lg" tone="dark-bg" />

                  <ul className="mt-6 space-y-3.5 border-t border-white/10 pt-6">
                    {copy.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-base text-sky-soft">
                        <Check
                          aria-hidden="true"
                          className="mt-1 size-4.5 shrink-0 text-gold-soft"
                          strokeWidth={2.6}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  scrollTo={ORDER_SECTION_ID}
                  trackingSource="Offer section"
                  variant="light"
                  size="lg"
                  className="mt-8 w-full sm:w-auto"
                >
                  {t.common.claimOff}
                  <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2.4} />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
