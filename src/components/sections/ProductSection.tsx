"use client";

import { Handshake, Leaf, type LucideIcon } from "lucide-react";
import { brand } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductPlaceholder } from "@/components/ui/ProductPlaceholder";
import { Reveal } from "@/components/ui/Reveal";

interface Point {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Kept to exactly the two ideas the trust strip above doesn't already cover
 * (daily/routine/everyday movement is said there — no need to say it twice).
 * Icons are fixed; title/description come from the active dictionary.
 */
const POINT_ICONS: [LucideIcon, LucideIcon] = [Leaf, Handshake];

function PointBlock({ point, align }: { point: Point; align: "left" | "right" }) {
  const Icon = point.icon;

  return (
    <div className={align === "right" ? "lg:text-right" : undefined}>
      <span
        aria-hidden="true"
        className={`inline-grid size-11 place-items-center rounded-xl bg-sky-mist text-navy ring-1 ring-navy/8 ${
          align === "right" ? "lg:ml-auto" : ""
        }`}
      >
        <Icon className="size-5" strokeWidth={1.9} />
      </span>
      <h3 className="mt-4 font-sans text-lg font-bold tracking-normal text-ink">
        {point.title}
      </h3>
      <p className="mt-2 text-base text-ink-soft">{point.description}</p>
    </div>
  );
}

export function ProductSection() {
  const { t } = useLanguage();
  const points: Point[] = t.product.points.map((point, index) => ({
    ...point,
    icon: POINT_ICONS[index],
  }));

  return (
    <Section id="product" tone="cream">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.product.eyebrow}
          title={
            <>
              {t.product.titleLead} <span className="text-navy">{brand.name}</span>
            </>
          }
          lead={t.product.lead}
          align="center"
        />

        <div className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
          {/* Left point */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <PointBlock point={points[0]} align="right" />
            </Reveal>
          </div>

          {/* Product */}
          <Reveal className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-[19rem]">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-8 bottom-10 rounded-full bg-[radial-gradient(circle_at_50%_45%,#dfe9f5_0%,#f1ede4_55%,transparent_72%)]"
              />
              <ProductPlaceholder
                id="product"
                sizes="(max-width: 1024px) 60vw, 300px"
                className="relative w-full drop-shadow-[0_30px_40px_rgba(11,46,99,0.22)]"
              />
              <p className="mt-2 text-center font-sans text-xs font-bold tracking-[0.2em] text-ink-muted uppercase">
                {brand.name} · {t.common.categoryLabel}
              </p>
            </div>
          </Reveal>

          {/* Right point */}
          <div className="order-3">
            <Reveal delay={90}>
              <PointBlock point={points[1]} align="left" />
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
