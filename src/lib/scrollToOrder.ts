import { trackViewContent } from "./tracking";

/**
 * The single source of truth for conversion scroll behaviour.
 * Every ORDER NOW / GET FLEXOLEX / CLAIM 50% OFF button routes through here —
 * no component implements its own scrolling.
 */

export const ORDER_SECTION_ID = "order-form";
export const ORDER_HREF = `#${ORDER_SECTION_ID}` as const;

/** Sticky header height, so the target does not land underneath it. */
const HEADER_OFFSET = 84;

/**
 * The order form scrolls in past its own top rather than stopping right at
 * it. The header hides itself on any downward scroll (see Header.tsx), so
 * there's no longer a bar to clear here — and landing exactly at the top
 * left the previous section's card hanging in view with a lot of dead
 * space below it. A negative offset scrolls further, tucking that card
 * mostly out of view and settling with the form comfortably framed
 * (a little of the footer visible below is expected, not a bug).
 */
const ORDER_SCROLL_OFFSET = -56;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function scrollToId(id: string, focusTarget = false, offset = HEADER_OFFSET): void {
  if (typeof document === "undefined") return;

  const target = document.getElementById(id);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });

  // Keyboard users need the focus to follow the viewport, not stay behind.
  if (focusTarget) {
    const focusable = target.querySelector<HTMLElement>("[data-scroll-focus]");
    const node = focusable ?? target;
    window.setTimeout(
      () => node.focus({ preventScroll: true }),
      prefersReducedMotion() ? 0 : 600,
    );
  }
}

/**
 * Scrolls to the order form.
 * @param source where the click came from — used for the (not yet live)
 *               ViewContent event, which is engagement, never a conversion.
 */
export function scrollToOrder(source: string): void {
  trackViewContent(`CTA: ${source}`);
  scrollToId(ORDER_SECTION_ID, true, ORDER_SCROLL_OFFSET);
}
