"use client";

import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/cn";

interface TrustBadgeProps {
  className?: string;
}

/**
 * Quiet "original product" trust signal — shown twice only: near the hero
 * product image and again in the "Kilalanin ang FLEXOLEX" section. Not a
 * CTA, not a promotional sticker: small, low-contrast, easy to ignore if
 * the visitor isn't looking for it.
 */
export function TrustBadge({ className }: TrustBadgeProps) {
  const { t } = useLanguage();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-sky-mist px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-navy shadow-soft",
        className,
      )}
    >
      <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.4} />
      {t.common.originalProductBadge}
    </span>
  );
}
