"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { brand } from "@/data/site";
import { ORDER_SECTION_ID, scrollToId } from "@/lib/scrollToOrder";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Hides on scroll down, reveals on scroll up — never hides near the very
  // top, and a small delta threshold keeps mobile rubber-band jitter from
  // flickering it. Re-runs on menuOpen so opening the menu resets the
  // reference point instead of hiding the header out from under it later.
  //
  // The reference point only updates every ~120ms rather than on every
  // 'scroll' event: a JS-triggered smooth scroll (e.g. an ORDER NOW click)
  // fires many events with a couple of pixels of delta each, which never
  // individually crosses the threshold below — comparing against a point
  // 120ms back instead reliably sees the real, larger movement.
  useEffect(() => {
    let lastY = window.scrollY;
    let lastCheck = 0;

    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 12);

      if (menuOpen) {
        lastY = currentY;
        lastCheck = 0;
        return;
      }

      if (currentY < 80) {
        setHidden(false);
        lastY = currentY;
        return;
      }

      const now = performance.now();
      if (now - lastCheck < 120) return;
      lastCheck = now;

      const delta = currentY - lastY;
      if (delta > 8) {
        setHidden(true);
      } else if (delta < -8) {
        setHidden(false);
      }
      lastY = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const headerHidden = hidden && !menuOpen;

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
    // Desktop only: the header hides itself on any downward scroll (see
    // above), so the usual header-height clearance is dead space by the
    // time the scroll lands — just enough of the previous (often
    // differently-coloured) section peeks through at the top to look like
    // a mistake. A small fixed offset instead of the header's height fixes
    // that without touching mobile, where this hasn't been reported.
    const desktopOffset = window.innerWidth >= 1024 ? 16 : undefined;
    scrollToId(href.replace("#", ""), false, desktopOffset);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,transform] duration-300 ease-out",
        headerHidden ? "-translate-y-full" : "translate-y-0",
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
          aria-label={`${brand.name} — ${t.header.backToTop}`}
        >
          <Wordmark />
        </a>

        <nav aria-label={t.header.navLabelMain} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <a
                href="#reviews"
                onClick={(event) => {
                  event.preventDefault();
                  goTo("#reviews");
                }}
                className="inline-flex min-h-11 items-center rounded-full px-4 text-base font-semibold text-ink-soft transition-colors duration-200 hover:bg-sky-mist hover:text-navy"
              >
                {t.header.navReviews}
              </a>
            </li>
          </ul>
        </nav>

        <LanguageSwitcher />

        {/* Wrapping div carries the responsive visibility: Button's own base
            class always includes `inline-flex`, which — at equal specificity —
            beats a conditional `hidden` placed directly on the button itself
            in Tailwind's cascade. Toggling display on a parent avoids the
            conflict entirely. */}
        <div className="hidden sm:block">
          <Button scrollTo={ORDER_SECTION_ID} trackingSource="Header" size="sm">
            {t.common.orderNow}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t.header.closeMenu : t.header.openMenu}
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
        <nav aria-label={t.header.navLabelMobile} className="container-page py-3">
          <ul className="flex flex-col">
            <li className="border-b border-line/70 last:border-0">
              <a
                href="#reviews"
                onClick={(event) => {
                  event.preventDefault();
                  goTo("#reviews");
                }}
                className="flex min-h-13 items-center text-lg font-semibold text-ink"
              >
                {t.header.navReviews}
              </a>
            </li>
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
              {t.common.orderNow}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
