"use client";

import Image from "next/image";
import { ingredients } from "@/data/ingredients";
import { useLanguage } from "@/components/LanguageProvider";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Sits between ProductSection and LifestyleSection. Cards are flex, not
 * grid — `flex-wrap` + `justify-center` is what centers the leftover pair
 * on the second row (5 cards: 3 + 2) without hand-computed column spans,
 * and the same rule naturally centers the lone 5th card on the 2-per-row
 * mobile layout too.
 */
export function IngredientsSection() {
  const { t, locale } = useLanguage();

  return (
    <Section id="ingredients" tone="mist">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.ingredients.eyebrow}
          title={t.ingredients.title}
          lead={t.ingredients.lead}
          align="center"
        />

        <ul className="mt-14 flex flex-wrap justify-center gap-5 lg:mt-20 lg:gap-8">
          {ingredients.map((ingredient, index) => (
            <li
              key={ingredient.id}
              className="w-full max-w-xs sm:w-[calc(50%-0.625rem)] sm:max-w-none lg:w-[calc(33.333%-1.334rem)]"
            >
              <Reveal delay={(index % 3) * 90} className="h-full">
                <div className="flex h-full flex-col items-center rounded-2xl border border-line bg-surface p-5 text-center shadow-soft sm:p-7">
                  <Image
                    src={ingredient.image}
                    alt={ingredient.name}
                    width={1080}
                    height={1080}
                    sizes="(max-width: 640px) 35vw, (max-width: 1024px) 22vw, 160px"
                    className="size-24 object-contain sm:size-32 lg:size-36"
                  />
                  <h3 className="mt-4 font-sans text-base font-bold text-ink sm:mt-5 sm:text-lg">
                    {ingredient.name}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft sm:text-base">
                    {ingredient.description[locale]}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
