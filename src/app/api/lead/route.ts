import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { normalisePhone } from "@/lib/leadForm";
import { checkIpBurstLimit, checkPhoneDuplicate } from "@/lib/rateLimit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendEzaffLead } from "@/lib/ezaff";
import { createPendingLead, hashPhone, markLeadAccepted, markLeadSubmissionFailed } from "@/lib/leadStore";
import { TRACKED_PARAM_KEYS, type LeadApiRequestBody, type LeadApiResponseBody, type TrackedParams } from "@/types";

/* ==========================================================================
   POST /api/lead
   --------------------------------------------------------------------------
   The only thing the browser calls (see lib/leadForm.ts). Validates the
   submission, then forwards it to EZAFF server-side (lib/ezaff.ts) — the
   EZAFF API key never leaves this file's server-only dependency graph.

   Offer configuration (publisher_id, offer_id, api_key, country, price,
   quantity, price_currency) is fixed inside sendEzaffLead() from
   environment variables. Nothing from the request body can override it —
   only genuine lead/attribution data (name, phone, tracking params) is
   read from `body` below.
   ========================================================================== */

export const runtime = "nodejs";

const GENERIC_FAILURE_MESSAGE = "Something went wrong. Please check your details and try again.";

function getClientIp(request: NextRequest): string {
  // Checked roughly in order of trustworthiness for the common proxies/CDNs
  // this landing is likely to sit behind (Vercel, Cloudflare).
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // "client, proxy1, proxy2" — the first entry is the originating client.
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return "";
}

function resolveRefUrl(request: NextRequest): string {
  // Prefers where the visitor actually was — falls back to this deployment's
  // own origin rather than ever hardcoding a domain.
  return request.headers.get("referer") ?? request.headers.get("origin") ?? request.nextUrl.origin;
}

function sanitizeName(raw: string): string {
  // Deliberately light-touch: trims and collapses whitespace only. Filipino
  // names commonly carry accented/unicode characters (e.g. "Peña") that must
  // survive intact — do not port the reference PHP's ASCII-only stripping.
  return raw.replace(/\s+/g, " ").trim();
}

const MAX_TRACKING_FIELD_LENGTH = 256;
const MAX_COOKIE_FIELD_LENGTH = 512;
const MAX_URL_LENGTH = 2048;
const MAX_TURNSTILE_TOKEN_LENGTH = 4096;
const MAX_NAME_LENGTH = 200;
/** Generous for every real field this form sends (incl. a 4096-char Turnstile token) — well below Vercel's own platform ceiling. */
const MAX_BODY_BYTES = 16 * 1024;

/**
 * All browser-supplied attribution is untrusted: wrong type, too long, or
 * garbage is dropped/sanitized rather than rejecting the whole submission —
 * a malformed tracking cookie must never cost a customer their order.
 */
function sanitizeTrackingField(value: unknown, maxLength = MAX_TRACKING_FIELD_LENGTH): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function sanitizeUrl(value: unknown): string | undefined {
  const trimmed = sanitizeTrackingField(value, MAX_URL_LENGTH);
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" ? trimmed : undefined;
  } catch {
    return undefined;
  }
}

/** Validates each known key independently — one malformed field never drops the rest. */
function sanitizeTrackedParams(value: unknown): TrackedParams {
  if (typeof value !== "object" || value === null) return {};

  const result: TrackedParams = {};
  for (const key of TRACKED_PARAM_KEYS) {
    const sanitized = sanitizeTrackingField((value as Record<string, unknown>)[key]);
    if (sanitized) result[key] = sanitized;
  }
  return result;
}

export async function POST(request: NextRequest): Promise<NextResponse<LeadApiResponseBody>> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ success: false, message: GENERIC_FAILURE_MESSAGE }, { status: 413 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ success: false, message: GENERIC_FAILURE_MESSAGE }, { status: 400 });
  }

  let body: Partial<LeadApiRequestBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: GENERIC_FAILURE_MESSAGE }, { status: 400 });
  }

  const fullName = typeof body.fullName === "string" ? sanitizeName(body.fullName) : "";
  // normalisePhone() always returns either "" or exactly 11 digits
  // ("0" + the 10-digit PH subscriber number) — see lib/leadForm.ts.
  const phone = normalisePhone(typeof body.phone === "string" ? body.phone : "");
  const digits = phone.replace(/\D/g, "");

  if (fullName.length < 2 || fullName.length > MAX_NAME_LENGTH || digits.length !== 11) {
    return NextResponse.json({ success: false, message: GENERIC_FAILURE_MESSAGE }, { status: 400 });
  }

  const clientIp = getClientIp(request);
  const phoneHash = hashPhone(digits);

  // Gates everything below it. A no-op (always ok) until TURNSTILE_SECRET_KEY
  // is actually configured — see lib/turnstile.ts. Never logs the raw token.
  const turnstileToken = sanitizeTrackingField(body.turnstileToken, MAX_TURNSTILE_TOKEN_LENGTH);
  const turnstile = await verifyTurnstileToken(turnstileToken, clientIp, request.nextUrl.hostname);
  if (!turnstile.ok) {
    console.warn("[api/lead] turnstile verification failed", { reason: turnstile.reason });
    return NextResponse.json({ success: false, message: GENERIC_FAILURE_MESSAGE }, { status: 403 });
  }

  // Durable, Postgres-backed anti-abuse checks (see lib/rateLimit.ts) — not
  // the core business function, so an unexpected error here (e.g. a config
  // problem) fails OPEN rather than blocking a legitimate customer's lead.
  // A genuine DB outage is still caught below by createPendingLead(), which
  // correctly fails closed.
  try {
    const [burst, duplicate] = await Promise.all([
      checkIpBurstLimit(clientIp),
      checkPhoneDuplicate(phoneHash),
    ]);

    if (!burst.ok) {
      return NextResponse.json({ success: false, message: GENERIC_FAILURE_MESSAGE }, { status: 429 });
    }
    if (!duplicate.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "We already received this request — our representative will call you shortly.",
        },
        { status: 429 },
      );
    }
  } catch (error) {
    console.error("[api/lead] rate-limit check failed — failing open", {
      error: error instanceof Error ? error.message : "unknown",
    });
  }

  const params = sanitizeTrackedParams(body.params);
  const fbp = sanitizeTrackingField(body.fbp, MAX_COOKIE_FIELD_LENGTH);
  const fbc = sanitizeTrackingField(body.fbc, MAX_COOKIE_FIELD_LENGTH);
  const eventSourceUrl = sanitizeUrl(body.eventSourceUrl);

  const publisherOrderId = randomUUID();
  // Generated alongside publisherOrderId, never a different id for the DB
  // vs. the browser event — the browser fires Lead with this exact value as
  // its eventID, returned only on confirmed EZAFF success (see below).
  const metaLeadEventId = randomUUID();
  const userAgent = request.headers.get("user-agent") ?? "";
  const refUrl = resolveRefUrl(request);

  // Write the local "pending" row BEFORE calling EZAFF. If this fails, abort
  // here rather than still sending to EZAFF — an EZAFF order with zero local
  // record would be unrecoverable (see lib/leadStore.ts createPendingLead).
  const pending = await createPendingLead({
    publisherOrderId,
    metaLeadEventId,
    phoneDigits: digits,
    clientIp,
    userAgent,
    refUrl,
    eventSourceUrl,
    fbp,
    fbc,
    params,
  });

  if (!pending.ok) {
    console.error("[api/lead] could not create local lead record — aborting before EZAFF", {
      publisherOrderId,
      reason: pending.reason,
    });
    return NextResponse.json({ success: false, message: GENERIC_FAILURE_MESSAGE }, { status: 502 });
  }

  const result = await sendEzaffLead({
    name: fullName,
    phone,
    clientIp,
    userAgent,
    refUrl,
    publisherOrderId,
    // Preserved only if the visitor's session actually captured one —
    // never fabricated (e.g. never defaulted from fbclid).
    clickId: params.click_id,
    publisherSubId: params.pid,
    extraId1: params.extra_id_1,
    streamId: params.stream_id,
  });

  if (!result.ok) {
    console.error("[api/lead] EZAFF submission failed", { reason: result.reason, publisherOrderId });
    // Best-effort — never lets a DB hiccup change the response the browser
    // already correctly gets (EZAFF itself is what rejected the lead).
    await markLeadSubmissionFailed(publisherOrderId);
    return NextResponse.json({ success: false, message: GENERIC_FAILURE_MESSAGE }, { status: 502 });
  }

  // Best-effort — EZAFF has already accepted the lead, which is the real
  // business outcome; a failure here is logged and self-heals from the
  // postback's ezaff_order_id backfill (see leadStore.applyEzaffPostback).
  await markLeadAccepted(publisherOrderId, result.orderId);

  return NextResponse.json({ success: true, orderId: result.orderId, publisherOrderId, metaLeadEventId });
}
