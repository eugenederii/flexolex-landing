import "server-only";

/* ==========================================================================
   TURNSTILE — server-side verification
   --------------------------------------------------------------------------
   SAFE-DEFAULT ACTIVATION STRATEGY: until TURNSTILE_SECRET_KEY is actually
   set, verifyTurnstileToken() always succeeds without calling Cloudflare —
   this is what stops missing keys from silently blocking every real lead
   (see .env.example). The moment the key IS set, verification becomes
   mandatory: a missing/invalid/wrong-domain token is rejected outright.
   There is no other toggle — configuring the key IS turning it on.
   ========================================================================== */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const VERIFY_TIMEOUT_MS = 5_000;

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export type TurnstileResult = { ok: true } | { ok: false; reason: string };

interface SiteverifyResponse {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
}

/**
 * Verifies a Turnstile token server-side. Never logs the raw token — only
 * safe outcome reasons. `expectedHostname` (when given) is cross-checked
 * against Cloudflare's own reported hostname, so a token issued for a
 * different site can't be replayed here.
 */
export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp: string,
  expectedHostname?: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true };

  if (!token) return { ok: false, reason: "missing_token" };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

  let data: SiteverifyResponse;
  try {
    const response = await fetch(VERIFY_URL, { method: "POST", body, signal: controller.signal });
    data = (await response.json()) as SiteverifyResponse;
  } catch (error) {
    console.error("[turnstile] verification request failed", {
      reason: error instanceof Error && error.name === "AbortError" ? "timeout" : "network_error",
    });
    return { ok: false, reason: "verification_unavailable" };
  } finally {
    clearTimeout(timeout);
  }

  if (!data.success) {
    console.warn("[turnstile] rejected", { errorCodes: data["error-codes"] ?? [] });
    return { ok: false, reason: "verification_failed" };
  }

  if (expectedHostname && data.hostname && data.hostname !== expectedHostname) {
    console.warn("[turnstile] hostname mismatch", { expected: expectedHostname, got: data.hostname });
    return { ok: false, reason: "hostname_mismatch" };
  }

  return { ok: true };
}
