"use client";

import { assets } from "@/data/assets";
import { ORDER_SECTION_ID } from "@/lib/scrollToOrder";
import { useLanguage } from "@/components/LanguageProvider";
import { Section } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function LifestyleSection() {
  const { t } = useLanguage();
  const copy = t.lifestyle;

  return (
    <Section id="lifestyle" tone="navy" className="grain">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 size-[30rem] rounded-full bg-[radial-gradient(circle,rgba(157,184,220,0.22)_0%,transparent_65%)]"
      />

      <div className="container-page relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow text-sky">
                <span aria-hidden="true" className="h-px w-6 bg-sky/60" />
                {copy.eyebrow}
              </p>

              <h2 className="mt-5 text-3xl text-cream sm:text-4xl lg:text-[2.75rem] lg:leading-[1.14]">
                {copy.title}
              </h2>

              <p className="mt-6 max-w-xl text-lg text-sky-soft/80">{copy.paragraph}</p>

              <ul className="mt-7 flex flex-wrap gap-2.5">
                {copy.activities.map((activity) => (
                  <li
                    key={activity}
                    className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-sky-soft"
                  >
                    {activity}
                  </li>
                ))}
              </ul>

              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
                {copy.notes.map((note) => (
                  <li
                    key={note}
                    className="flex items-center gap-2 text-sm font-semibold text-sky-soft/90"
                  >
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-gold-soft" />
                    {note}
                  </li>
                ))}
              </ul>

              <Button
                scrollTo={ORDER_SECTION_ID}
                trackingSource="Lifestyle"
                variant="light"
                size="lg"
                className="mt-9 w-full sm:w-auto"
              >
                {t.common.getFlexolex}
              </Button>
            </Reveal>
          </div>

          {/* Editorial mosaic — one gallery area, ready for real Filipino imagery */}
          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <ImagePlaceholder
                asset={assets.lifestyleCouple}
                label={copy.imageLabels.couple}
                aspect="aspect-[3/4]"
                variant={0}
                rounded="rounded-[1.5rem]"
                sizes="(max-width: 1024px) 45vw, 24vw"
              />
              <div className="mt-8 flex flex-col gap-4 sm:mt-12 sm:gap-5">
                <ImagePlaceholder
                  asset={assets.lifestyleFamily}
                  label={copy.imageLabels.family}
                  aspect="aspect-[24/25]"
                  variant={3}
                  rounded="rounded-[1.5rem]"
                  sizes="(max-width: 1024px) 45vw, 24vw"
                />
                <ImagePlaceholder
                  asset={assets.lifestyleStairs}
                  label={copy.imageLabels.stairs}
                  aspect="aspect-[4/5]"
                  variant={2}
                  rounded="rounded-[1.5rem]"
                  sizes="(max-width: 1024px) 45vw, 24vw"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
