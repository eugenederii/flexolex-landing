import type { LeadApiRequestBody, LeadApiResponseBody, LeadFormErrorCodes, LeadFormValues } from "@/types";
import { getParams } from "./urlParams";
import { captureEventSourceUrl, readMetaBrowserIds } from "./metaAttribution";

/* ==========================================================================
   LEAD FORM — validation + submission boundary
   ========================================================================== */

/** Everything except digits and a single leading “+”. */
export function normalisePhone(raw: string): string {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/[^\d]/g, "");
}

/** Formats keystrokes as `0912 345 6789` while leaving other formats alone. */
export function formatPhoneInput(raw: string): string {
  const hasPlus = raw.trim().startsWith("+");
  const digits = raw.replace(/[^\d]/g, "").slice(0, hasPlus ? 13 : 11);

  if (hasPlus) return `+${digits}`;

  const parts = [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7, 11)];
  return parts.filter(Boolean).join(" ");
}

/**
 * Basic frontend validation only.
 *
 * Returns locale-agnostic error codes, not display strings — this module
 * doesn't know which language is active. The caller (OrderSection) maps
 * each code to a translated message via the active dictionary.
 *
 * TODO: tighten to full Philippine mobile validation once the affiliate API's
 * accepted formats are confirmed. The shapes we expect are `09XXXXXXXXX`,
 * `+639XXXXXXXXX` and `639XXXXXXXXX` — the check below already accepts those
 * while staying forgiving enough not to reject a real customer.
 */
export function validateLeadForm(values: LeadFormValues): LeadFormErrorCodes {
  const errors: LeadFormErrorCodes = {};

  const name = values.fullName.trim();
  if (name.length < 2) {
    errors.fullName = "required";
  }

  const phone = normalisePhone(values.phone);
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 0) {
    errors.phone = "required";
  } else if (digits.length < 10 || digits.length > 13) {
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
