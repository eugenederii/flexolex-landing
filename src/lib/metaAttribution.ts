/* ==========================================================================
   META ATTRIBUTION — browser-only fbp/fbc/event-source-url capture
   --------------------------------------------------------------------------
   Separate from lib/urlParams.ts's generic TrackedParams/sessionStorage
   system because these three values have different capture semantics:
     - fbp/fbc live in real Meta cookies (set by the Pixel itself, or by
       Meta's ad click redirect for fbc) — we read them fresh, we don't
       shadow them in our own sessionStorage.
     - the landing URL is read directly from window.location, not the URL
       query-param allowlist.
   No network calls, no fabricated values — every export here returns
   `null`/`undefined` rather than inventing data when it isn't present.
   ========================================================================== */

const FBCLID_CAPTURED_AT_KEY = "flexolex.fbclid_captured_at.v1";
const MAX_EVENT_SOURCE_URL_LENGTH = 2048;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Call once when a fresh `fbclid` first appears on the URL (see
 * lib/urlParams.ts captureParams()). Records when this visit's ad click
 * landed — needed for the `_fbc` fallback construction below. First value
 * wins for the session; a later page view without fbclid must not clear it.
 */
export function recordFbclidCaptureTime(): void {
  if (!isBrowser()) return;
  try {
    if (!window.sessionStorage.getItem(FBCLID_CAPTURED_AT_KEY)) {
      window.sessionStorage.setItem(FBCLID_CAPTURED_AT_KEY, String(Date.now()));
    }
  } catch {
    /* private mode / storage full — best-effort only, never fatal */
  }
}

/**
 * Reads the freshest available Meta browser identifiers. Call this
 * immediately before building the /api/lead payload (not cached from mount)
 * — the Pixel may set/update these cookies after the page's initial render.
 *
 * fbc: uses the real `_fbc` cookie when Meta's own Pixel has already set it.
 * If not (Pixel blocked/slow to load) but a genuine `fbclid` was captured
 * this visit, falls back to Meta's officially documented deterministic
 * construction: fbc = fb.<subdomainIndex>.<creationTime_ms>.<fbclid>
 * (subdomainIndex is 1 for a standard, non multi-level-subdomain domain).
 * https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc/
 * Never fabricated when no fbclid was ever captured.
 */
export function readMetaBrowserIds(fbclid: string | undefined): { fbp: string | null; fbc: string | null } {
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");

  if (!fbc && fbclid) {
    const capturedAt = isBrowser() ? window.sessionStorage.getItem(FBCLID_CAPTURED_AT_KEY) : null;
    const timestamp = capturedAt ? Number(capturedAt) : Date.now();
    fbc = `fb.1.${timestamp}.${fbclid}`;
  }

  return { fbp, fbc };
}

/** The actual landing page URL as seen by the browser — capped length, http(s) only. */
export function captureEventSourceUrl(): string | undefined {
  if (!isBrowser()) return undefined;
  const href = window.location.href;
  if (!href.startsWith("http://") && !href.startsWith("https://")) return undefined;
  return href.slice(0, MAX_EVENT_SOURCE_URL_LENGTH);
}
