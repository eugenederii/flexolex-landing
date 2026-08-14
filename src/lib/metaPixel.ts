/* ==========================================================================
   META PIXEL — low-level, defensive fbq dispatch
   --------------------------------------------------------------------------
   This is the ONLY place that touches `window.fbq` directly. Everything
   else (lib/tracking.ts) calls trackMetaEvent() below, never fbq itself.

   Every export here is safe to call unconditionally, from anywhere,
   whether or not a Pixel ID is configured, whether or not the Pixel script
   loaded, whether or not an ad blocker stripped it out: it never throws and
   never blocks the caller. EZAFF lead submission must never depend on any
   of this succeeding — see app/api/lead/route.ts and lib/leadForm.ts, which
   never await or branch on tracking.
   ========================================================================== */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** True only when a trusted Pixel ID is configured — see components/tracking/MetaPixel.tsx. */
export function isMetaPixelConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID);
}

/**
 * Fires one Meta Pixel event. `eventId` (when given) is passed as the
 * standard fbq `eventID` option, for future Pixel + Conversions API
 * deduplication of the same logical event.
 *
 * A no-op (not an error) when `window.fbq` doesn't exist — missing Pixel ID,
 * script still loading, or blocked by the visitor's browser/extensions are
 * all the same case from here: nothing to call, nothing breaks.
 */
export function trackMetaEvent(eventName: string, params?: Record<string, unknown>, eventId?: string): void {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.fbq !== "function") return;

    if (eventId) {
      window.fbq("track", eventName, params ?? {}, { eventID: eventId });
    } else {
      window.fbq("track", eventName, params ?? {});
    }
  } catch {
    /* tracking must never break the app */
  }
}
