import { NextResponse, type NextRequest } from "next/server";
import {
  isPostbackSecretValid,
  parsePostbackParams,
  processEzaffPostback,
} from "@/lib/ezaffPostback";

/* ==========================================================================
   GET /api/ezaff/postback
   --------------------------------------------------------------------------
   Publicly reachable — EZAFF calls this directly from its own servers as a
   plain URL callback (no signature scheme in their docs), so authenticity is
   enforced entirely by the `secret` query param matching EZAFF_POSTBACK_SECRET.
   Paste the URLs generated for this endpoint into EZAFF's Url New / Url Hold /
   Url Approve / Url Cancel / Url Trash fields, each with its own `status=`.

   Kept deliberately thin: all parsing/validation/processing lives in
   lib/ezaffPostback.ts.
   ========================================================================== */

export const runtime = "nodejs";

function readPostbackSecret(): string {
  const secret = process.env.EZAFF_POSTBACK_SECRET;
  if (!secret) {
    throw new Error(
      "EZAFF postback is not configured — set EZAFF_POSTBACK_SECRET in .env.local (see .env.example).",
    );
  }
  return secret;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  let expectedSecret: string;
  try {
    expectedSecret = readPostbackSecret();
  } catch {
    console.error("[ezaff postback] rejected", { reason: "not_configured" });
    return NextResponse.json({ success: false }, { status: 500 });
  }

  if (!isPostbackSecretValid(searchParams.get("secret"), expectedSecret)) {
    console.warn("[ezaff postback] rejected", { reason: "invalid_secret" });
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const parsed = parsePostbackParams(searchParams);
  if (!parsed.ok) {
    console.warn("[ezaff postback] rejected", { reason: parsed.reason });
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // A thrown error here means the DB itself is unreachable — a transient
  // outage must not silently swallow an approve/cancel/trash callback, so
  // this returns 503 (not 200) so EZAFF retries. See lib/leadStore.ts.
  let result: Awaited<ReturnType<typeof processEzaffPostback>>;
  try {
    result = await processEzaffPostback(parsed.data);
  } catch (error) {
    console.error("[ezaff postback] processing failed", {
      reason: "db_error",
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ success: false }, { status: 503 });
  }

  if (result.outcome === "unknown_order") {
    // Non-200 so EZAFF retries — most likely cause is a race between this
    // callback and our own EZAFF-acceptance DB write still committing.
    return NextResponse.json({ success: false }, { status: 404 });
  }

  if (result.outcome === "order_mismatch") {
    return NextResponse.json({ success: false }, { status: 409 });
  }

  return NextResponse.json({ success: true });
}
