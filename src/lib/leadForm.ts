import type { LeadFormErrorCodes, LeadFormValues } from "@/types";
import { getParams } from "./urlParams";

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
  message?: string;
}

/**
 * SUBMIT BOUNDARY
 *
 * Right now this resolves locally — no request leaves the browser.
 *
 * TODO: Affiliate API integration.
 *   Replace the mock block below with the real call, e.g.
 *
 *     const response = await fetch("/api/lead", {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify(payload),
 *       signal,
 *     });
 *     const data = await response.json();
 *     if (!response.ok || !data.id) return { ok: false, message: data.message };
 *     return { ok: true, leadId: data.id };
 *
 *   The `payload` shape below is already what the API will need: the customer
 *   fields plus the captured attribution parameters. The caller only fires the
 *   Lead tracking event when this returns `{ ok: true, leadId }`, so no other
 *   file has to change.
 */
export async function submitLead(
  values: LeadFormValues,
): Promise<LeadSubmitResult> {
  const payload = {
    fullName: values.fullName.trim(),
    phone: normalisePhone(values.phone),
    params: getParams(),
    submittedAt: new Date().toISOString(),
    landing: typeof window !== "undefined" ? window.location.pathname : "/",
  };

  // ---- MOCK SUBMISSION — remove when the API is wired up -------------------
  if (process.env.NODE_ENV === "development") {
    console.debug("[lead:mock-submit]", payload);
  }

  await new Promise((resolve) => setTimeout(resolve, 900));

  return { ok: true, leadId: `mock-${Date.now()}` };
  // -------------------------------------------------------------------------
}
