"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Review } from "@/types";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/cn";

interface ReviewCardProps {
  review: Review;
  featured?: boolean;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Rating({ value, ariaLabel }: { value: number; ariaLabel: string }) {
  return (
    <p className="flex items-center gap-0.5" aria-label={ariaLabel}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn(
            "size-4",
            index < value ? "fill-gold text-gold" : "text-line-strong",
          )}
          strokeWidth={1.5}
        />
      ))}
    </p>
  );
}

export function ReviewCard({ review, featured = false, className }: ReviewCardProps) {
  const { locale, t } = useLanguage();

  return (
    <figure
      className={cn(
        "relative flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-soft",
        "transition-shadow duration-300 hover:shadow-card",
        featured && "border-navy/12 bg-gradient-to-br from-white to-sky-mist/70 p-7 sm:p-9",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "font-display leading-none text-navy/12 select-none",
          featured ? "text-6xl" : "text-5xl",
        )}
      >
        &ldquo;
      </span>

      <blockquote
        className={cn(
          "-mt-3 grow text-ink-soft",
          featured ? "text-lg sm:text-xl sm:leading-[1.6]" : "text-base",
        )}
      >
        {review.quote[locale]}
      </blockquote>

      <figcaption className="mt-6 flex items-start gap-3.5 border-t border-line pt-5">
        {review.avatar ? (
          <Image
            src={review.avatar}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-sky-soft font-sans text-sm font-bold text-navy-deep"
          >
            {initials(review.name)}
          </span>
        )}

        {/* Name gets its own row so it never competes with the rating for
            space — long names wrap instead of truncating to an ellipsis. */}
        <div className="min-w-0 flex-1">
          <p className="font-sans text-base leading-snug font-bold text-ink">{review.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <p className="text-sm text-ink-muted">
              {review.age} · {review.city}
            </p>
            {review.rating !== undefined && (
              <Rating value={review.rating} ariaLabel={t.reviews.ratedAriaLabel(review.rating)} />
            )}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}
