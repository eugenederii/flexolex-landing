import "server-only";
import { createHmac } from "crypto";
import { query } from "./db";

/* ==========================================================================
   RATE LIMIT — durable, Postgres-backed abuse protection for POST /api/lead
   --------------------------------------------------------------------------
   Replaces the previous in-memory-only guard (lib/leadDedupe.ts), which
   reset on every serverless cold start and wasn't shared across concurrent
   Vercel instances — neither property holds on Postgres.

   Two independent, intentionally separate checks:
     - IP burst limit: stops an obvious scripted burst without punishing a
       household/office sharing one carrier/NAT IP.
     - Phone duplicate: stops the SAME phone creating a second EZAFF order
       minutes apart, while still letting a real customer retry immediately
       after a genuine upstream failure (see checkPhoneDuplicate below).
   ========================================================================== */

const IP_BURST_LIMIT = 10;
const IP_BURST_WINDOW_MINUTES = 15;
const PHONE_DUPLICATE_WINDOW_HOURS = 24;
/** Runs on ~2% of requests — avoids needing a cron job at this traffic scale. */
const CLEANUP_PROBABILITY = 0.02;

function getSecret(): string {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) {
    throw new Error("RATE_LIMIT_SECRET is not set — see .env.example.");
  }
  return secret;
}

/** One-way hash — the raw IP is never stored in lead_submission_attempts. */
export function hashIp(ip: string): string {
  return createHmac("sha256", getSecret()).update(ip).digest("hex");
}

export type RateLimitResult = { ok: true } | { ok: false; reason: "ip_burst" | "phone_duplicate" };

/**
 * Caps how many /api/lead attempts (successful or not) one IP can make in a
 * short window. Deliberately generous: 10 per 15 minutes is well above what
 * any real visitor needs, but cuts off a scripted burst fast. Records the
 * attempt regardless of outcome — a rejected/failed attempt still counts,
 * since it still cost us a request.
 */
export async function checkIpBurstLimit(ip: string): Promise<RateLimitResult> {
  const ipHash = hashIp(ip);

  // make_interval(mins => $2) — fully parameterized, no value is ever
  // interpolated into the SQL text itself (IP_BURST_WINDOW_MINUTES is a
  // hardcoded constant, not attacker-influenced, but this keeps every query
  // in this file parameterized as a matter of policy, not just this case).
  const rows = await query<{ n: string }>(
    `SELECT count(*) AS n FROM lead_submission_attempts
      WHERE ip_hash = $1 AND created_at > now() - make_interval(mins => $2)`,
    [ipHash, IP_BURST_WINDOW_MINUTES],
  );

  if (Number(rows[0]?.n ?? 0) >= IP_BURST_LIMIT) {
    return { ok: false, reason: "ip_burst" };
  }

  await query("INSERT INTO lead_submission_attempts (ip_hash) VALUES ($1)", [ipHash]);

  if (Math.random() < CLEANUP_PROBABILITY) {
    await query("DELETE FROM lead_submission_attempts WHERE created_at < now() - interval '1 day'");
  }

  return { ok: true };
}

/**
 * Reuses the existing `leads` table rather than a separate store — the
 * phone hash + status it already records is exactly what's needed here.
 *
 * If the same phone already has a lead within the window that is NOT
 * 'submission_failed' (i.e. still pending, or EZAFF already accepted it),
 * reject as a duplicate. If the most recent attempt explicitly failed, a
 * retry is allowed immediately — an upstream EZAFF hiccup must never
 * permanently lock out a real customer.
 */
export async function checkPhoneDuplicate(phoneHash: string): Promise<RateLimitResult> {
  const rows = await query<{ status: string }>(
    `SELECT status FROM leads
      WHERE phone_hash = $1 AND created_at > now() - make_interval(hours => $2)
      ORDER BY created_at DESC
      LIMIT 1`,
    [phoneHash, PHONE_DUPLICATE_WINDOW_HOURS],
  );

  if (rows[0] && rows[0].status !== "submission_failed") {
    return { ok: false, reason: "phone_duplicate" };
  }

  return { ok: true };
}
