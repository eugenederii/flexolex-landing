"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { priceText, pricing } from "@/data/site";
import { ORDER_SECTION_ID } from "@/lib/scrollToOrder";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

/**
 * Mobile-only conversion bar.
 *
 * Appears only after the visitor has scrolled past the hero — it is not on
 * screen at first paint — and steps out of the way once the order form or the
 * footer come into view, so it never covers the fields, the submit button, or
 * footer content. Sits above the iOS home indicator via env(safe-area-inset-bottom).
 */
export function StickyMobileCTA() {
  const [pastHero, setPastHero] = useState(false);
  const [atForm, setAtForm] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const form = document.getElementById(ORDER_SECTION_ID);
    const footer = document.getElementById("site-footer");
    if (typeof IntersectionObserver === "undefined") return;

    const observers: IntersectionObserver[] = [];

    if (hero) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => setPastHero(!entry.isIntersecting),
        { rootMargin: "-40% 0px 0px 0px" },
      );
      heroObserver.observe(hero);
      observers.push(heroObserver);
    }

    if (form) {
      const formObserver = new IntersectionObserver(
        ([entry]) => setAtForm(entry.isIntersecting),
        { rootMargin: "0px 0px -25% 0px", threshold: 0 },
      );
      formObserver.observe(form);
      observers.push(formObserver);
    }

    if (footer) {
      const footerObserver = new IntersectionObserver(
        ([entry]) => setAtFooter(entry.isIntersecting),
        { rootMargin: "0px 0px 0px 0px", threshold: 0 },
      );
      footerObserver.observe(footer);
      observers.push(footerObserver);
    }

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const visible = pastHero && !atForm && !atFooter;

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 lg:hidden",
        "border-t border-line bg-cream/95 backdrop-blur-md",
        "transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "translate-y-[130%]",
      )}
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-3 px-4 pt-2 pb-0.5">
        <div className="min-w-0 leading-none">
          <p className="font-display text-lg leading-none font-bold tracking-[-0.02em] text-navy-deep">
            {priceText.current}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[0.6875rem] text-ink-muted">
            <s>{priceText.original}</s>
            <span className="font-bold text-gold">{pricing.discountLabel}</span>
          </p>
        </div>

        <Button
          scrollTo={ORDER_SECTION_ID}
          trackingSource="Sticky mobile bar"
          size="sm"
          className="ml-auto grow-0"
          tabIndex={visible ? undefined : -1}
        >
          ORDER NOW
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.4} />
        </Button>
      </div>
    </div>
  );
}
