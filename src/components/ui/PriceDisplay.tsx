import { priceText, pricing } from "@/data/site";
import { cn } from "@/lib/cn";

interface PriceDisplayProps {
  size?: "sm" | "md" | "lg";
  tone?: "light-bg" | "dark-bg";
  /** Stack the old price above the new one instead of inline. */
  layout?: "inline" | "stacked";
  showBadge?: boolean;
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
  showBadge = true,
  className,
}: PriceDisplayProps) {
  const dark = tone === "dark-bg";

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
        <span className="sr-only">Promotional price </span>
        {priceText.current}
      </p>

      <div className="flex items-center gap-2.5">
        <s
          className={cn(
            "font-display font-medium tracking-[-0.02em] decoration-2",
            oldSizes[size],
            dark ? "text-sky/70 decoration-sky/70" : "text-ink-muted decoration-ink-muted/70",
          )}
        >
          <span className="sr-only">Original price </span>
          {priceText.original}
        </s>

        {showBadge && (
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-bold tracking-[0.06em] uppercase",
              dark ? "bg-gold-soft text-navy-deep" : "bg-gold/15 text-gold",
            )}
          >
            {pricing.discountLabel}
          </span>
        )}
      </div>
    </div>
  );
}
