"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { reviews } from "@/data/reviews";
import { cn } from "@/lib/cn";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const copy = {
  eyebrow: "In their words",
  title: "What daily use actually looks like",
  lead: "Short notes from people who fitted Flexolex into a routine they already had.",
};

/** How many cards the desktop grid shows before “Show more reviews”. */
const INITIAL_VISIBLE = 6;

export function ReviewsSection() {
  const [expanded, setExpanded] = useState(false);
  const trackRef = useRef<HTMLUListElement>(null);

  const [featured, ...rest] = reviews;

  const scrollTrack = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * 0.86,
      behavior: "smooth",
    });
  };

  return (
    <Section id="reviews" tone="deep" className="grain">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />

          <Reveal delay={100}>
            <ReviewCard review={featured} featured />
          </Reveal>
        </div>

        {/*
          One list, two layouts:
          • below sm — a touch carousel holding every review, so nothing turns
            into a wall of text on a phone
          • sm and up — a grid capped at six cards until “Show more reviews”
        */}
        <div className="relative mt-10 lg:mt-14">
          <ul
            ref={trackRef}
            className={cn(
              "no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2",
              "sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3",
            )}
          >
            {rest.map((review, index) => (
              <li
                key={review.id}
                className={cn(
                  "w-[84vw] shrink-0 snap-start sm:w-auto",
                  index >= INITIAL_VISIBLE && !expanded && "sm:hidden",
                )}
              >
                <Reveal delay={(index % INITIAL_VISIBLE) * 90} className="h-full">
                  <ReviewCard review={review} />
                </Reveal>
              </li>
            ))}
          </ul>

          {/* Carousel controls — phones only. Big enough to hit comfortably. */}
          <div className="mt-5 flex items-center justify-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => scrollTrack(-1)}
              aria-label="Previous reviews"
              className="grid size-12 place-items-center rounded-full border border-line bg-surface text-navy shadow-soft active:bg-sky-mist"
            >
              <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={2.2} />
            </button>
            <p className="text-sm font-semibold text-ink-muted">Swipe for more</p>
            <button
              type="button"
              onClick={() => scrollTrack(1)}
              aria-label="More reviews"
              className="grid size-12 place-items-center rounded-full border border-line bg-surface text-navy shadow-soft active:bg-sky-mist"
            >
              <ChevronRight aria-hidden="true" className="size-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {rest.length > INITIAL_VISIBLE && (
          <div className="mt-10 hidden justify-center sm:flex">
            <Button
              variant="outline"
              size="md"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
            >
              {expanded
                ? "Show fewer reviews"
                : `Show more reviews (${rest.length - INITIAL_VISIBLE})`}
            </Button>
          </div>
        )}

        {/* NOTE: these 15 reviews are sample content for building this UI, not
            verified customer reviews. Replace with supplied, verified reviews
            in src/data/reviews.ts before launch — see the warning at the top
            of that file. Intentionally not shown to visitors. */}
      </div>
    </Section>
  );
}
