import { createHash } from "crypto";

/* ==========================================================================
   META CONVERSIONS API — server-side Lead event
   --------------------------------------------------------------------------
   The browser-side counterpart is lib/metaPixel.ts / lib/tracking.ts (see
   THE LEAD RULE in tracking.ts). This file is the ONLY place that calls
   Meta's Graph API directly, and the ONLY place that reads
   META_CAPI_ACCESS_TOKEN — that token is server-only and must never be
   imported from a "use client" file or prefixed NEXT_PUBLIC_.

   Called once from app/api/lead/route.ts, only after sendEzaffLead() has
   confirmed success — the same trigger point as the browser's trackLead()
   call — and with the exact same eventId, so Meta deduplicates the browser
   Pixel event and this server event into a single conversion.

   Best-effort: every failure is caught and logged here, never thrown — a
   Meta API outage must never cost a customer their order or change the
   /api/lead response.
   ========================================================================== */

const GRAPH_API_VERSION = "v21.0";
const REQUEST_TIMEOUT_MS = 5000;

function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Meta's documented user_data hashing rule: lowercase, trimmed, then SHA-256. */
function hashField(raw: string): string {
  return sha256Hex(raw.trim().toLowerCase());
}

/**
 * "0XXXXXXXXXX" (11 digits, leading 0 — see lib/leadForm.ts normalisePhone)
 * -> "63XXXXXXXXXX", the whole-number-with-country-code format Meta's
 * user_data.ph hashing expects.
 */
function toE164Digits(phLocalDigits: string): string {
  return `63${phLocalDigits.slice(1)}`;
}

function splitName(fullName: string): { firstName?: string; lastName?: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  const [firstName, ...rest] = parts;
  return { firstName, lastName: rest.length ? rest.join(" ") : undefined };
}

export interface SendMetaCapiLeadInput {
  /** Must be the exact same id the browser's trackLead() uses, for dedup. */
  eventId: string;
  eventSourceUrl?: string;
  clientIp: string;
  userAgent: string;
  fbp?: string;
  fbc?: string;
  /** normalisePhone() output — "0XXXXXXXXXX". */
  phoneDigits: string;
  fullName: string;
  value?: number;
  currency?: string;
}

/** True only when both the Pixel/Dataset ID and the CAPI token are configured. */
export function isMetaCapiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN);
}

/**
 * Fires one server-side Lead event. Safe to call unconditionally — a no-op
 * when not configured, and every failure is caught rather than thrown (see
 * file header).
 */
export async function sendMetaCapiLead(input: SendMetaCapiLeadInput): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const { firstName, lastName } = splitName(input.fullName);

  const userData = {
    ph: [hashField(toE164Digits(input.phoneDigits))],
    client_ip_address: input.clientIp || undefined,
    client_user_agent: input.userAgent || undefined,
    fbp: input.fbp || undefined,
    fbc: input.fbc || undefined,
    fn: firstName ? [hashField(firstName)] : undefined,
    ln: lastName ? [hashField(lastName)] : undefined,
  };

  const event = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    action_source: "website",
    event_source_url: input.eventSourceUrl,
    user_data: userData,
    custom_data:
      input.value !== undefined
        ? { value: input.value, currency: input.currency ?? "PHP" }
        : undefined,
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [event], access_token: accessToken }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[meta-capi] non-OK response", { status: response.status, detail: detail.slice(0, 500) });
    }
  } catch (error) {
    console.error("[meta-capi] request failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}
