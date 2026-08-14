import "server-only";
import { timingSafeEqual } from "crypto";
import { isEzaffLeadStatus, type EzaffLeadStatus, type EzaffPostbackInput } from "./leadStatus";
import { applyEzaffPostback, type ApplyPostbackResult } from "./leadStore";

/* ==========================================================================
   EZAFF POSTBACK — status-update receiver (server-only)
   --------------------------------------------------------------------------
   EZAFF calls back to GET /api/ezaff/postback (see
   app/api/ezaff/postback/route.ts) whenever a lead's status changes in their
   dashboard — Url New / Url Hold / Url Approve / Url Cancel / Url Trash all
   point at the same endpoint with a different static `status=` value. This
   module owns validation + auth so the route handler stays a thin HTTP
   shim; the actual database work lives in lib/leadStore.ts and is invoked
   from processEzaffPostback() below.
   ========================================================================== */

export type { EzaffLeadStatus, EzaffPostbackInput };

export type PostbackRejectionReason =
  | "invalid_status"
  | "missing_order_id"
  | "missing_publisher_order_id";

export type PostbackValidationResult =
  | { ok: true; data: EzaffPostbackInput }
  | { ok: false; reason: PostbackRejectionReason };

/** Constant-time comparison — avoids leaking the real secret via response timing. */
function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** The EZAFF docs show no signature scheme, so authenticity rests entirely on this. */
export function isPostbackSecretValid(providedSecret: string | null, expectedSecret: string): boolean {
  if (!providedSecret) return false;
  return secretsMatch(providedSecret, expectedSecret);
}

/**
 * Parses `payout` leniently: absent or unparsable becomes `null`, never an
 * error by itself — EZAFF legitimately omits or zeroes it for `new`/`hold`.
 */
function parsePayout(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

/**
 * Validates raw query params into a typed, trustworthy EzaffPostbackInput.
 * Does NOT check the secret — the route handler checks that separately so a
 * rejection is never ambiguous between "bad secret" and "bad data".
 */
export function parsePostbackParams(searchParams: URLSearchParams): PostbackValidationResult {
  const rawStatus = searchParams.get("status")?.trim() ?? "";
  if (!rawStatus || !isEzaffLeadStatus(rawStatus)) {
    return { ok: false, reason: "invalid_status" };
  }

  const ezaffOrderId = searchParams.get("order_id")?.trim() ?? "";
  if (!ezaffOrderId) {
    return { ok: false, reason: "missing_order_id" };
  }

  const publisherOrderId = searchParams.get("publisher_order_id")?.trim() ?? "";
  if (!publisherOrderId) {
    return { ok: false, reason: "missing_publisher_order_id" };
  }

  return {
    ok: true,
    data: {
      status: rawStatus,
      ezaffOrderId,
      publisherOrderId,
      payout: parsePayout(searchParams.get("payout")),
      clickId: searchParams.get("click_id")?.trim() || undefined,
      extraId1: searchParams.get("extra_id_1")?.trim() || undefined,
      extraId2: searchParams.get("extra_id_2")?.trim() || undefined,
    },
  };
}

/**
 * Processes one validated, authenticated postback: records it durably (see
 * lib/leadStore.ts — a transactional insert into ezaff_status_events plus a
 * conditional update of the lead's current status/payout) and logs a safe
 * summary. Never throws for an expected outcome (unknown order, mismatched
 * IDs) — those are reported via `result.outcome` so route.ts can pick the
 * right HTTP status; only a genuine DB failure throws, so route.ts can
 * return 503 and let EZAFF retry.
 *
 * TODO (future, not this task): once "approve" is durably recorded and the
 * original lead's tracking params can be looked up by publisherOrderId,
 * fire the Meta CAPI conversion here.
 */
export async function processEzaffPostback(input: EzaffPostbackInput): Promise<ApplyPostbackResult> {
  const result = await applyEzaffPostback(input);

  console.log("[ezaff postback]", {
    outcome: result.outcome,
    status: input.status,
    ezaffOrderId: input.ezaffOrderId,
    publisherOrderId: input.publisherOrderId,
    payout: input.payout,
    hasClickId: Boolean(input.clickId),
  });

  return result;
}
