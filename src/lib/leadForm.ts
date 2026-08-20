import type { LeadApiRequestBody, LeadApiResponseBody, LeadFormErrorCodes, LeadFormValues } from "@/types";
import { getParams } from "./urlParams";
import { captureEventSourceUrl, readMetaBrowserIds } from "./metaAttribution";

/* ==========================================================================
   LEAD FORM — validation + submission boundary
   ========================================================================== */

/**
 * Canonicalizes to the PH local "0XXXXXXXXXX" format (11 digits, leading
 * 0) — the exact shape EZAFF is confirmed to accept. The order form's field
 * now shows a fixed "+63" prefix and only collects the 10-digit subscriber
 * number, but this stays defensive about the shape it's actually given
 * (server-side, `body.phone` is untrusted input, not guaranteed to have
 * come through formatPhoneInput below) — it also gracefully handles an
 * already-local "0XXXXXXXXXX" number or a pasted "+63XXXXXXXXXX" one.
 * Returns "" for empty/unparseable input.
 */
export function normalisePhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("63")) digits = digits.slice(2);
  digits = digits.replace(/^0+/, "").slice(0, 10);
  return digits ? `0${digits}` : "";
}

/**
 * Formats live keystrokes as the visitor types their 10-digit PH mobile
 * subscriber number, e.g. `917 123 4567` — the fixed "+63" shown next to
 * the field (see OrderSection.tsx) already covers the country code, so
 * this never includes it or a leading 0. Tolerates a pasted full number
 * (with "+63"/"63" or a leading 0) by trimming it down to just the
 * subscriber number.
 */
export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("63")) digits = digits.slice(2);
  digits = digits.replace(/^0+/, "").slice(0, 10);

  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)];
  return parts.filter(Boolean).join(" ");
}

/**
 * Basic frontend validation only.
 *
 * Returns locale-agnostic error codes, not display strings — this module
 * doesn't know which language is active. The caller (OrderSection) maps
 * each code to a translated message via the active dictionary.
 *
 * normalisePhone() always returns either "" or exactly 11 digits
 * ("0" + the 10-digit subscriber number) — so `!== 11` is the correct,
 * exact check now, not a tolerant range.
 */
export function validateLeadForm(values: LeadFormValues): LeadFormErrorCodes {
  const errors: LeadFormErrorCodes = {};

  const name = values.fullName.trim();
  if (name.length < 2) {
    errors.fullName = "required";
  }

  const digits = normalisePhone(values.phone).replace(/\D/g, "");

  if (!values.phone.trim()) {
    errors.phone = "required";
  } else if (digits.length !== 11) {
    errors.phone = "invalid";
  }

  return errors;
}

export interface LeadSubmitResult {
  ok: boolean;
  /** Present only on a confirmed success. Required before any Lead event. */
  leadId?: string;
  /** Present only on a confirmed success — the eventID the browser's Meta Lead event must use. */
  metaLeadEventId?: string;
  message?: string;
}

/**
 * SUBMIT BOUNDARY
 *
 * Posts to our own /api/lead route, which forwards the lead to EZAFF
 * server-side (see app/api/lead/route.ts and lib/ezaff.ts) — no affiliate
 * credentials or upstream call ever touch the browser. The caller only
 * fires the Lead tracking event when this returns `{ ok: true, leadId,
 * metaLeadEventId }`, where `leadId` is the order id EZAFF confirmed.
 */
export async function submitLead(
  values: LeadFormValues,
  turnstileToken?: string,
): Promise<LeadSubmitResult> {
  const params = getParams();
  // Read fresh, right before building the payload — not cached from mount —
  // because the Pixel may set/update these cookies after initial render.
  const { fbp, fbc } = readMetaBrowserIds(params.fbclid);

  const payload: LeadApiRequestBody = {
    fullName: values.fullName.trim(),
    phone: normalisePhone(values.phone),
    params,
    fbp: fbp ?? undefined,
    fbc: fbc ?? undefined,
    turnstileToken,
    eventSourceUrl: captureEventSourceUrl(),
  };

  let response: Response;
  try {
    response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false };
  }

  let data: LeadApiResponseBody | undefined;
  try {
    data = await response.json();
  } catch {
    return { ok: false };
  }

  if (!response.ok || !data || !data.success) {
    return { ok: false, message: data && !data.success ? data.message : undefined };
  }

  return { ok: true, leadId: data.orderId, metaLeadEventId: data.metaLeadEventId };
}
