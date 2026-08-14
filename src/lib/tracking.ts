import type { TrackingEventName, TrackingEventPayload } from "@/types";
import { trackMetaEvent } from "./metaPixel";

/* ==========================================================================
   TRACKING — the one canonical path to Meta Pixel
   --------------------------------------------------------------------------
   Every real dispatch to Meta goes through trackMetaEvent() (lib/metaPixel.ts),
   which is a safe no-op whenever the Pixel isn't configured/loaded/blocked.
   Call sites:
     - components/PageTracking.tsx        -> (nothing here anymore — see
       components/tracking/MetaPixel.tsx, which fires PageView itself,
       atomically with Pixel init, avoiding a load-order race with a
       separate call from here)
     - lib/scrollToOrder.ts               -> trackViewContent(), on CTA click
     - components/sections/OrderSection.tsx -> trackLead(), ONLY after a
       confirmed EZAFF success response (see THE LEAD RULE below)

   THE LEAD RULE
     trackLead() must ONLY be called after the affiliate API has confirmed a
     successful submission, with the server-generated metaLeadEventId as its
     eventID (see app/api/lead/route.ts). Never on button click, never on
     validation pass, never optimistically. A CTA click is trackViewContent
     at most.
   ========================================================================== */

const DEBUG =
  typeof process !== "undefined" && process.env.NODE_ENV === "development";

/** Maps this project's internal payload shape to Meta's standard (snake_case) event params. */
function toMetaParams(payload: TrackingEventPayload): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  if (payload.contentName) params.content_name = payload.contentName;
  if (payload.contentCategory) params.content_category = payload.contentCategory;
  if (payload.currency) params.currency = payload.currency;
  if (payload.value !== undefined) params.value = payload.value;
  return params;
}

function dispatch(name: TrackingEventName, payload: TrackingEventPayload, eventId?: string): void {
  if (DEBUG) {
    console.debug("[tracking]", name, payload, eventId ? { eventId } : undefined);
  }
  trackMetaEvent(name, toMetaParams(payload), eventId);
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
 * CONVERSION. Call ONLY from the success branch of a confirmed EZAFF
 * response, with the server-generated metaLeadEventId. See THE LEAD RULE
 * above.
 *
 * `value`/`currency` here are the pre-existing behavior of this function
 * (the order's price, passed by OrderSection.tsx) — preserved as-is, not
 * newly introduced by the Pixel wiring.
 */
export function trackLead(eventId: string, leadId: string, value?: number): void {
  if (!leadId || !eventId) {
    if (DEBUG) {
      console.warn("[tracking] trackLead called without confirmed ids — ignored", { leadId, eventId });
    }
    return;
  }

  dispatch(
    "Lead",
    {
      contentName: "Flexolex Order Request",
      contentCategory: "Joint Support",
      currency: "PHP",
      value,
    },
    eventId,
  );
}
