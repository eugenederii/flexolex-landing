import type { TrackingEventName, TrackingEventPayload } from "@/types";
import { getParams } from "./urlParams";

/* ==========================================================================
   TRACKING — ARCHITECTURE ONLY. NOTHING IS SENT ANYWHERE YET.
   --------------------------------------------------------------------------
   No pixel is installed and no network request is made. Every call below
   resolves to a local debug log. This module exists so that turning tracking
   on later is a single, reviewable change instead of a scatter of edits.

   TODO (later, in this order):
     1. Load the Meta Pixel script (id comes from the `fb_pixel` URL param —
        see lib/urlParams.ts — or from NEXT_PUBLIC_FB_PIXEL_ID).
     2. Replace `dispatch()` below with the real `fbq('track', ...)` call.
     3. Keep the Lead rule below intact.

   THE LEAD RULE
     `trackLead()` must ONLY be called after the affiliate API has confirmed a
     successful submission. Never on button click, never on validation pass,
     never optimistically. A CTA click is `trackViewContent` at most.
   ========================================================================== */

const DEBUG =
  typeof process !== "undefined" && process.env.NODE_ENV === "development";

/** Flips to true once a real pixel is initialised. Guards every dispatch. */
let trackingEnabled = false;

/** Events fired before init, kept so nothing is lost when tracking goes live. */
const queue: Array<{
  name: TrackingEventName;
  payload: TrackingEventPayload;
  at: number;
}> = [];

function dispatch(name: TrackingEventName, payload: TrackingEventPayload): void {
  if (!trackingEnabled) {
    queue.push({ name, payload, at: Date.now() });
    if (DEBUG) {
      console.debug("[tracking:queued]", name, { ...payload, params: getParams() });
    }
    return;
  }

  // TODO: real pixel dispatch goes here, e.g.
  // window.fbq?.("track", name, toPixelPayload(payload));
  if (DEBUG) {
    console.debug("[tracking:sent]", name, payload);
  }
}

/**
 * TODO: call this once the pixel script has actually loaded.
 * Flushes anything that queued up beforehand.
 */
export function initTracking(): void {
  trackingEnabled = true;
  const pending = queue.splice(0, queue.length);
  for (const event of pending) dispatch(event.name, event.payload);
}

/** Fired once when the landing page mounts. */
export function trackPageView(): void {
  dispatch("PageView", {
    contentName: "Flexolex Landing",
    contentCategory: "Joint Support",
  });
}

/**
 * Meaningful engagement — reaching the offer, opening the order form,
 * clicking a conversion CTA. Safe to call more than once.
 */
export function trackViewContent(source: string): void {
  dispatch("ViewContent", {
    contentName: `Flexolex — ${source}`,
    contentCategory: "Joint Support",
  });
}

/**
 * CONVERSION. Call ONLY from the success branch of a confirmed affiliate API
 * response, with the id that API returned. See THE LEAD RULE above.
 */
export function trackLead(leadId: string, value?: number): void {
  if (!leadId) {
    if (DEBUG) {
      console.warn("[tracking] trackLead called without a confirmed lead id — ignored");
    }
    return;
  }

  dispatch("Lead", {
    contentName: "Flexolex Order Request",
    contentCategory: "Joint Support",
    currency: "PHP",
    value,
    leadId,
  });
}
