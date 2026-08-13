"use client";

import Image from "next/image";
import { brand } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/cn";

interface WordmarkProps {
  tone?: "dark-text" | "light-text";
  className?: string;
  /** Hide the category line — used in tight spots like the sticky header. */
  showCategory?: boolean;
}

/**
 * TODO: this logo badge reads "JOINT HEALTH", not "FLEXOLEX" — it was
 * supplied as a placeholder mark, not the final Flexolex brand asset.
 * Swap the file at /public/assets/logo/logo.png (and this alt text) once the
 * real logo is ready. Kept as a component so that swap happens in one place.
 */
export function Wordmark({
  tone = "dark-text",
  className,
  showCategory = false,
}: WordmarkProps) {
  const light = tone === "light-text";
  const { t } = useLanguage();

  return (
    <span className={cn("flex items-center gap-2 sm:gap-2.5", className)}>
      <Image
        src="/assets/logo/logo.png"
        alt=""
        width={96}
        height={96}
        priority
        className="size-8 shrink-0 rounded-full object-cover sm:size-9"
      />

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-bold tracking-[0.02em]",
            light ? "text-cream" : "text-navy-deep",
          )}
        >
          {brand.name}
        </span>
        {showCategory && (
          <span
            className={cn(
              "mt-1.5 font-sans text-[0.6875rem] font-semibold tracking-[0.16em] uppercase",
              light ? "text-sky" : "text-ink-muted",
            )}
          >
            {t.common.categoryLabel}
          </span>
        )}
      </span>
    </span>
  );
}
