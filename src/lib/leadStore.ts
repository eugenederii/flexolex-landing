import "server-only";
import { createHash } from "crypto";
import type { PoolClient } from "pg";
import { query, withTransaction } from "./db";
import { shouldApplyStatus, type EzaffPostbackInput, type LeadStatus } from "./leadStatus";
import type { TrackedParams } from "@/types";

/* ==========================================================================
   LEAD STORE — server-only Postgres data-access layer
   --------------------------------------------------------------------------
   Everything that touches the `leads` / `ezaff_status_events` tables lives
   here (see db/schema.sql). Route handlers and lib/ezaffPostback.ts call
   into this module; nothing outside it writes raw SQL.
   ========================================================================== */

const SUBMITTING_OFFER_ID = () => process.env.EZAFF_OFFER_ID ?? "";

function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** SHA-256 of the E.164-normalized digits only — never the raw phone number. */
export function hashPhone(phoneDigits: string): string {
  return sha256Hex(phoneDigits);
}

interface LeadRow {
  id: string;
  publisher_order_id: string;
  ezaff_order_id: string | null;
  status: LeadStatus;
  payout: string | null;
}

/* ---------- Lead creation / EZAFF-send lifecycle -------------------------- */

export interface CreatePendingLeadInput {
  publisherOrderId: string;
  /** Generated alongside publisherOrderId — see app/api/lead/route.ts. */
  metaLeadEventId: string;
  /** Normalized digits only (no leading +) — see lib/leadForm.ts normalisePhone(). */
  phoneDigits: string;
  clientIp: string;
  userAgent: string;
  refUrl: string;
  /** The actual browser-observed landing URL, sanitized server-side — see app/api/lead/route.ts. */
  eventSourceUrl?: string;
  /** Meta `_fbp`/`_fbc` cookie values, sanitized server-side. */
  fbp?: string;
  fbc?: string;
  /** fbclid/campaign_id/adset_id/ad_id ride along here (see types TRACKED_PARAM_KEYS). */
  params: TrackedParams;
  /** Already strictly validated (`=== true`) server-side — see app/api/lead/route.ts. */
  callConsent: boolean;
}

export type CreatePendingLeadResult = { ok: true } | { ok: false; reason: string };

/**
 * Inserts the local "pending" row BEFORE EZAFF is ever called. If this
 * fails, app/api/lead/route.ts aborts the whole submission rather than
 * calling EZAFF — an EZAFF order with zero local trace would be
 * unrecoverable (no row for a later postback to attach to), which is worse
 * than a visitor seeing a generic failure and retrying.
 */
export async function createPendingLead(input: CreatePendingLeadInput): Promise<CreatePendingLeadResult> {
  try {
    const digits = input.phoneDigits.replace(/\D/g, "");
    const phoneLast4 = digits.length >= 4 ? digits.slice(-4) : null;

    await query(
      `INSERT INTO leads (
         publisher_order_id, offer_id, status,
         click_id, publisher_sub_id, extra_id_1, extra_id_2, stream_id,
         fb_pixel_param, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
         fbclid, fbp, fbc, campaign_id, adset_id, ad_id,
         ref_url, event_source_url, client_ip, user_agent,
         phone_hash, phone_last4,
         meta_lead_event_id,
         call_consent
       ) VALUES (
         $1, $2, 'pending',
         $3, $4, $5, $6, $7,
         $8, $9, $10, $11, $12, $13,
         $14, $15, $16, $17, $18, $19,
         $20, $21, $22, $23,
         $24, $25,
         $26,
         $27
       )`,
      [
        input.publisherOrderId,
        SUBMITTING_OFFER_ID(),
        input.params.click_id ?? null,
        input.params.pid ?? null,
        input.params.extra_id_1 ?? null,
        null, // extra_id_2 — not currently sourced from TrackedParams; column kept for postback parity.
        input.params.stream_id ?? null,
        input.params.fb_pixel ?? null,
        input.params.utm_source ?? null,
        input.params.utm_medium ?? null,
        input.params.utm_campaign ?? null,
        input.params.utm_content ?? null,
        input.params.utm_term ?? null,
        input.params.fbclid ?? null,
        input.fbp ?? null,
        input.fbc ?? null,
        input.params.campaign_id ?? null,
        input.params.adset_id ?? null,
        input.params.ad_id ?? null,
        input.refUrl || null,
        input.eventSourceUrl ?? null,
        input.clientIp || null,
        input.userAgent || null,
        digits ? hashPhone(digits) : null,
        phoneLast4,
        input.metaLeadEventId,
        input.callConsent,
      ],
    );

    return { ok: true };
  } catch (error) {
    console.error("[leadStore] createPendingLead failed", {
      publisherOrderId: input.publisherOrderId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return { ok: false, reason: "db_error" };
  }
}

/**
 * Called after EZAFF returns success. Advances the existing pending row to
 * ezaff_order_id + status='new' (EZAFF's own dashboard already shows a
 * freshly-accepted order as "new" — confirmed during manual verification of
 * the lead-submission flow).
 *
 * Deliberately never throws to the caller: if this write fails, the browser
 * still gets a success response (EZAFF already accepted the lead — that is
 * the real business outcome), and the row self-heals the next time EZAFF's
 * own "new" postback arrives (see applyEzaffPostback's ezaff_order_id
 * backfill below). The failure is logged so it's visible, not silent.
 */
export async function markLeadAccepted(publisherOrderId: string, ezaffOrderId: string): Promise<void> {
  try {
    await query(
      `UPDATE leads
          SET ezaff_order_id = $2, status = 'new', updated_at = now()
        WHERE publisher_order_id = $1`,
      [publisherOrderId, ezaffOrderId],
    );
  } catch (error) {
    console.error("[leadStore] CRITICAL: EZAFF accepted order but DB update failed", {
      publisherOrderId,
      ezaffOrderId,
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}

/** Called after EZAFF rejects/errors. Never throws — same rationale as markLeadAccepted. */
export async function markLeadSubmissionFailed(publisherOrderId: string): Promise<void> {
  try {
    await query(
      `UPDATE leads
          SET status = 'submission_failed', updated_at = now()
        WHERE publisher_order_id = $1`,
      [publisherOrderId],
    );
  } catch (error) {
    console.error("[leadStore] markLeadSubmissionFailed failed", {
      publisherOrderId,
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}

/* ---------- Postback processing -------------------------------------------- */

export type ApplyPostbackOutcome =
  | "applied"
  | "recorded_not_applied"
  | "unknown_order"
  | "order_mismatch";

export interface ApplyPostbackResult {
  outcome: ApplyPostbackOutcome;
}

/** Canonical fingerprint of one callback's content — the idempotency key for ezaff_status_events. */
function computeDedupeKey(input: EzaffPostbackInput): string {
  const parts = [
    input.ezaffOrderId,
    input.publisherOrderId,
    input.status,
    input.payout === null ? "" : String(input.payout),
    input.clickId ?? "",
    input.extraId1 ?? "",
    input.extraId2 ?? "",
  ];
  return sha256Hex(parts.join("|"));
}

/**
 * Durably records one authenticated, validated postback and — subject to
 * the transition policy in lib/leadStatus.ts — updates the lead's current
 * status/payout. Runs as a single transaction so the event row and the
 * lead update are always consistent with each other.
 *
 * Order lookup: publisher_order_id is the primary key (our own UUID, always
 * present per lib/ezaffPostback.ts validation). ezaff_order_id is
 * cross-checked against what's already on the lead:
 *   - not yet known on the lead (NULL)         -> backfilled from this
 *     callback. This is the self-healing path for "EZAFF accepted the
 *     order but our post-EZAFF DB write failed" (see markLeadAccepted).
 *   - matches what's on the lead                -> normal case, proceed.
 *   - present and DIFFERENT from this callback  -> serious mismatch;
 *     neither the event nor the lead is written; outcome 'order_mismatch'.
 *
 * Unknown order (no lead for this publisher_order_id at all): logged, not
 * fabricated, outcome 'unknown_order' — the route handler returns 404 so
 * EZAFF retries. Chosen deliberately: the most likely cause is a race
 * (postback arriving before our own EZAFF-acceptance write has committed),
 * which a retry resolves; the downside is EZAFF re-trying forever for a
 * genuinely unrecognized order, which is acceptable since we never
 * acknowledge (200) an event we couldn't associate to anything.
 *
 * A thrown error (DB unreachable, etc.) propagates to the caller —
 * route.ts turns that into a 503 so EZAFF retries rather than us silently
 * swallowing a transient outage.
 */
export async function applyEzaffPostback(input: EzaffPostbackInput): Promise<ApplyPostbackResult> {
  return withTransaction(async (client) => {
    const leads = await client.query<LeadRow>(
      `SELECT id, publisher_order_id, ezaff_order_id, status, payout
         FROM leads
        WHERE publisher_order_id = $1
        FOR UPDATE`,
      [input.publisherOrderId],
    );

    const lead = leads.rows[0];
    if (!lead) {
      console.warn("[leadStore] postback for unknown order", {
        ezaffOrderId: input.ezaffOrderId,
        publisherOrderId: input.publisherOrderId,
      });
      return { outcome: "unknown_order" };
    }

    if (lead.ezaff_order_id && lead.ezaff_order_id !== input.ezaffOrderId) {
      console.error("[leadStore] postback order_id mismatch — rejecting", {
        leadPublisherOrderId: lead.publisher_order_id,
        leadEzaffOrderId: lead.ezaff_order_id,
        postbackEzaffOrderId: input.ezaffOrderId,
      });
      return { outcome: "order_mismatch" };
    }

    const applied = shouldApplyStatus(lead.status, input.status);

    await recordStatusEvent(client, lead.id, input, applied);

    if (applied) {
      await client.query(
        `UPDATE leads
            SET ezaff_order_id = COALESCE(ezaff_order_id, $2),
                status = $3,
                payout = COALESCE($4, payout),
                updated_at = now()
          WHERE id = $1`,
        [lead.id, input.ezaffOrderId, input.status, input.payout],
      );
    } else if (!lead.ezaff_order_id) {
      // Still backfill the id/payout even when the status itself is
      // ignored (e.g. a stale 'new' arriving after 'hold') — the
      // correlation and payout are still true and worth keeping.
      await client.query(
        `UPDATE leads
            SET ezaff_order_id = COALESCE(ezaff_order_id, $2),
                payout = COALESCE($3, payout),
                updated_at = now()
          WHERE id = $1`,
        [lead.id, input.ezaffOrderId, input.payout],
      );
    }

    return { outcome: applied ? "applied" : "recorded_not_applied" };
  });
}

async function recordStatusEvent(
  client: PoolClient,
  leadId: string,
  input: EzaffPostbackInput,
  applied: boolean,
): Promise<void> {
  const dedupeKey = computeDedupeKey(input);

  await client.query(
    `INSERT INTO ezaff_status_events (
       lead_id, ezaff_order_id, publisher_order_id, status, payout,
       click_id, extra_id_1, extra_id_2, applied, dedupe_key
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (dedupe_key) DO NOTHING`,
    [
      leadId,
      input.ezaffOrderId,
      input.publisherOrderId,
      input.status,
      input.payout,
      input.clickId ?? null,
      input.extraId1 ?? null,
      input.extraId2 ?? null,
      applied,
      dedupeKey,
    ],
  );
}
