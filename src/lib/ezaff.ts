import "server-only";

/* ==========================================================================
   EZAFF PUBLISHER API — server-only integration
   --------------------------------------------------------------------------
   Reference: the official PHP file supplied by EZAFF for this offer (POST
   to https://api.ezaff.com/send with the fields below as a normal cURL
   array, i.e. multipart/form-data — not JSON). This module reproduces that
   request from the Next.js server. It must only ever be imported from
   server code (API routes) — the `server-only` import above turns any
   accidental client import into a build error.

   Offer configuration (publisher_id, offer_id, api_key, country, price,
   quantity, price_currency) is fixed here from environment variables. It is
   never accepted from the caller, so a malformed or malicious request body
   can't override it — see app/api/lead/route.ts.
   ========================================================================== */

const EZAFF_API_URL = "https://api.ezaff.com/send";
const REQUEST_TIMEOUT_MS = 10_000;

interface EzaffEnv {
  apiKey: string;
  publisherId: string;
  offerId: string;
}

function readEzaffEnv(): EzaffEnv {
  const apiKey = process.env.EZAFF_API_KEY;
  const publisherId = process.env.EZAFF_PUBLISHER_ID;
  const offerId = process.env.EZAFF_OFFER_ID;

  if (!apiKey || !publisherId || !offerId) {
    throw new Error(
      "EZAFF is not configured — set EZAFF_API_KEY, EZAFF_PUBLISHER_ID and EZAFF_OFFER_ID in .env.local (see .env.example).",
    );
  }

  return { apiKey, publisherId, offerId };
}

export interface EzaffLeadInput {
  name: string;
  phone: string;
  clientIp: string;
  userAgent: string;
  refUrl: string;
  /** Generated server-side with crypto.randomUUID() — see app/api/lead/route.ts. */
  publisherOrderId: string;
  /** Attribution — forwarded only if the visitor's URL/session actually had it. */
  clickId?: string;
  publisherSubId?: string;
  extraId1?: string;
  extraId2?: string;
  streamId?: string;
}

export type EzaffResult =
  | { ok: true; orderId: string }
  | { ok: false; reason: string };

/** How much of an unexpected upstream body to keep in server logs. */
const LOGGED_BODY_LIMIT = 2_000;

/** Last 4 digits only — enough to correlate a log line with a real submission. */
function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length > 4 ? `${"*".repeat(digits.length - 4)}${digits.slice(-4)}` : "*".repeat(digits.length);
}

/**
 * POSTs one lead to EZAFF and reports back only whether it was accepted.
 * Never throws for a network/parsing problem — every failure path returns
 * `{ ok: false, reason }` so the caller can respond safely.
 *
 * Every branch logs a `[ezaff]`-prefixed diagnostic line server-side only —
 * HTTP status, raw response body (truncated), and what was actually sent,
 * with the API key never included and the phone masked to its last 4
 * digits. None of this reaches the browser; app/api/lead/route.ts always
 * responds with a single generic message.
 */
export async function sendEzaffLead(input: EzaffLeadInput): Promise<EzaffResult> {
  const env = readEzaffEnv();

  console.log("[ezaff] sending lead", {
    publisherOrderId: input.publisherOrderId,
    apiKeyConfigured: Boolean(env.apiKey),
    publisherIdConfigured: Boolean(env.publisherId),
    offerIdConfigured: Boolean(env.offerId),
    publisherId: env.publisherId,
    offerId: env.offerId,
    phonePresent: input.phone.length > 0,
    phoneLength: input.phone.replace(/\D/g, "").length,
    phoneMasked: maskPhone(input.phone),
    clientIp: input.clientIp || "(empty)",
    refUrl: input.refUrl,
    hasClickId: Boolean(input.clickId),
  });

  const body = new FormData();
  body.set("offer_id", env.offerId);
  body.set("publisher_id", env.publisherId);
  body.set("api_key", env.apiKey);
  body.set("name", input.name);
  body.set("phone", input.phone);
  body.set("email", "");
  body.set("click_id", input.clickId ?? "");
  body.set("publisher_sub_id", input.publisherSubId ?? "");
  body.set("publisher_order_id", input.publisherOrderId);
  body.set("extra_id_1", input.extraId1 ?? "");
  body.set("extra_id_2", input.extraId2 ?? "");
  body.set("stream_id", input.streamId ?? "");
  body.set("extra_note", "");
  body.set("city", "");
  body.set("post_code", "");
  body.set("country", "PH");
  body.set("address", "");
  body.set("state", "");
  body.set("district", "");
  body.set("quantity", "1");
  body.set("price", "1970");
  body.set("price_currency", "PHP");
  body.set("client_ip", input.clientIp);
  body.set("order_note", "");
  body.set("bundle_option", "");
  body.set("payment_method", "");
  body.set("browser_agent", input.userAgent);
  body.set("ref_url", input.refUrl);
  body.set("product_id", "");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(EZAFF_API_URL, {
      method: "POST",
      body,
      signal: controller.signal,
    });
  } catch (error) {
    const reason = error instanceof Error && error.name === "AbortError" ? "timeout" : "network_error";
    console.error("[ezaff] request failed:", reason);
    return { ok: false, reason };
  } finally {
    clearTimeout(timeout);
  }

  // Read the raw body unconditionally — before this, a non-2xx response
  // never had its body read at all, which could hide EZAFF's own error
  // detail (e.g. a validation message) for exactly the status codes most
  // worth seeing.
  const raw = await response.text();
  const truncatedRaw = raw.length > LOGGED_BODY_LIMIT ? `${raw.slice(0, LOGGED_BODY_LIMIT)}…(truncated)` : raw;

  if (!response.ok) {
    console.error("[ezaff] non-2xx response", {
      httpStatus: response.status,
      contentType: response.headers.get("content-type"),
      body: truncatedRaw || "(empty)",
    });
    return { ok: false, reason: `upstream_status_${response.status}` };
  }

  if (!raw) {
    console.error("[ezaff] empty response body", { httpStatus: response.status });
    return { ok: false, reason: "empty_response" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("[ezaff] response was not valid JSON", {
      httpStatus: response.status,
      contentType: response.headers.get("content-type"),
      body: truncatedRaw,
    });
    return { ok: false, reason: "invalid_json" };
  }

  if (typeof parsed !== "object" || parsed === null || !("status" in parsed)) {
    console.error("[ezaff] unexpected response shape", { httpStatus: response.status, body: truncatedRaw });
    return { ok: false, reason: "unexpected_shape" };
  }

  const { status, order_id } = parsed as { status?: unknown; order_id?: unknown };

  if (status !== "success") {
    // Logs the full parsed body, not just `status` — EZAFF may include
    // extra fields (a message, a field name) that `status` alone loses.
    console.warn("[ezaff] upstream reported failure", { httpStatus: response.status, body: parsed });
    return { ok: false, reason: `upstream_rejected:${String(status)}` };
  }

  return { ok: true, orderId: String(order_id ?? "") };
}
