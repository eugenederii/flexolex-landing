"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { brand, navLinks } from "@/data/site";
import { ORDER_SECTION_ID, scrollToId } from "@/lib/scrollToOrder";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the mobile menu; the page must not scroll behind it.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const goTo = (href: string) => {
    setMenuOpen(false);
    scrollToId(href.replace("#", ""));
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled || menuOpen
          ? "border-b border-line bg-cream/90 backdrop-blur-lg"
          : "border-b border-transparent bg-cream/40 backdrop-blur-sm",
      )}
    >
      <div className="container-page flex h-15 items-center gap-3 sm:h-19 sm:gap-4">
        <a
          href="#hero"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="mr-auto shrink-0 rounded-md"
          aria-label={`${brand.name} — back to top`}
        >
          <Wordmark />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(link.href);
                  }}
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-base font-semibold text-ink-soft transition-colors duration-200 hover:bg-sky-mist hover:text-navy"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Wrapping div carries the responsive visibility: Button's own base
            class always includes `inline-flex`, which — at equal specificity —
            beats a conditional `hidden` placed directly on the button itself
            in Tailwind's cascade. Toggling display on a parent avoids the
            conflict entirely. */}
        <div className="hidden sm:block lg:ml-4">
          <Button scrollTo={ORDER_SECTION_ID} trackingSource="Header" size="sm">
            ORDER NOW
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-navy transition-colors hover:bg-sky-mist sm:size-11 lg:hidden"
        >
          {menuOpen ? (
            <X className="size-4.5 sm:size-5" strokeWidth={2.2} />
          ) : (
            <Menu className="size-4.5 sm:size-5" strokeWidth={2.2} />
          )}
        </button>
      </div>

      {/* Mobile menu — a panel, not a full-screen takeover: less jarring, and
          the page stays visible underneath. */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={cn(
          "overflow-hidden border-t border-line bg-cream/95 backdrop-blur-lg transition-[max-height,opacity] duration-300 ease-out lg:hidden",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="container-page py-3">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-line/70 last:border-0">
                <a
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(link.href);
                  }}
                  className="flex min-h-13 items-center text-lg font-semibold text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* See the note on the desktop CTA above — visibility toggles on
              the wrapper, never on the Button itself. */}
          <div className="my-4 sm:hidden">
            <Button
              scrollTo={ORDER_SECTION_ID}
              trackingSource="Mobile menu"
              onClick={() => setMenuOpen(false)}
              fullWidth
            >
              ORDER NOW
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
