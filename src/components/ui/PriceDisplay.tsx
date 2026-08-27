"use client";

import { priceText } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/cn";

interface PriceDisplayProps {
  size?: "sm" | "md" | "lg";
  tone?: "light-bg" | "dark-bg";
  /** Stack the old price above the new one instead of inline. */
  layout?: "inline" | "stacked";
  className?: string;
}

const currentSizes = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl lg:text-[3.5rem]",
} as const;

const oldSizes = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-xl lg:text-2xl",
} as const;

export function PriceDisplay({
  size = "md",
  tone = "light-bg",
  layout = "inline",
  className,
}: PriceDisplayProps) {
  const dark = tone === "dark-bg";
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-3 gap-y-2",
        layout === "stacked" && "flex-col items-start gap-y-0",
        className,
      )}
    >
      <p
        className={cn(
          "font-display font-bold leading-none tracking-[-0.03em]",
          currentSizes[size],
          dark ? "text-cream" : "text-navy-deep",
        )}
      >
        <span className="sr-only">{t.priceDisplay.promoSr} </span>
        {priceText.current}
      </p>

      <s
        className={cn(
          "font-display font-medium tracking-[-0.02em] decoration-2",
          oldSizes[size],
          dark ? "text-sky/70 decoration-sky/70" : "text-ink-muted decoration-ink-muted/70",
        )}
      >
        <span className="sr-only">{t.priceDisplay.originalSr} </span>
        {priceText.original}
      </s>
    </div>
  );
}
