import {
  TRACKED_PARAM_KEYS,
  type TrackedParamKey,
  type TrackedParams,
} from "@/types";
import { recordFbclidCaptureTime } from "./metaAttribution";

/**
 * URL PARAMETER CAPTURE
 *
 * Traffic arrives with affiliate / attribution parameters on the URL. The user
 * may then scroll, refresh, or navigate before converting, so we snapshot the
 * parameters once on first load and keep them for the rest of the session.
 *
 * Nothing here sends data anywhere. It only reads the URL and writes to
 * sessionStorage on the visitor's own device.
 */

const STORAGE_KEY = "flexolex.params.v1";

const isBrowser = () => typeof window !== "undefined";

function isTrackedKey(key: string): key is TrackedParamKey {
  return (TRACKED_PARAM_KEYS as readonly string[]).includes(key);
}

/** Reads the tracked parameters present on the current URL. */
export function readParamsFromUrl(search?: string): TrackedParams {
  if (!isBrowser() && search === undefined) return {};

  const query = new URLSearchParams(search ?? window.location.search);
  const params: TrackedParams = {};

  query.forEach((value, key) => {
    const normalised = key.trim().toLowerCase();
    if (!isTrackedKey(normalised)) return;

    const clean = value.trim().slice(0, 256); // defensive: cap length
    if (clean) params[normalised] = clean;
  });

  return params;
}

/** Reads the snapshot previously stored for this session. */
export function readStoredParams(): TrackedParams {
  if (!isBrowser()) return {};

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};

    const result: TrackedParams = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (isTrackedKey(key) && typeof value === "string") result[key] = value;
    }
    return result;
  } catch {
    return {};
  }
}

function writeStoredParams(params: TrackedParams): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch {
    /* private mode / storage full — attribution is best-effort, never fatal */
  }
}

/**
 * Call once on mount. Merges anything on the current URL over the stored
 * snapshot (a fresh click should win) and persists the result.
 */
export function captureParams(): TrackedParams {
  if (!isBrowser()) return {};

  const fromUrl = readParamsFromUrl();
  // Records when THIS visit's ad click landed — see metaAttribution.ts's
  // _fbc fallback construction, which needs that timestamp later.
  if (fromUrl.fbclid) recordFbclidCaptureTime();

  const merged: TrackedParams = { ...readStoredParams(), ...fromUrl };
  writeStoredParams(merged);
  return merged;
}

/** The full parameter set to attach to a lead submission. */
export function getParams(): TrackedParams {
  return { ...readStoredParams(), ...readParamsFromUrl() };
}

/**
 * Removes only `click_id` from the visible browser URL via
 * `history.replaceState` — no reload, no navigation, every other query
 * param (fbclid, utm_*, etc.) is left exactly as it was. No-op if
 * `click_id` isn't present.
 *
 * Call this AFTER captureParams() has already saved it to sessionStorage —
 * getParams() falls back to that stored copy once it's gone from the URL,
 * so nothing is lost, and it's still sent to EZAFF on submit.
 */
export function stripClickIdFromUrl(): void {
  if (!isBrowser()) return;

  const url = new URL(window.location.href);
  if (!url.searchParams.has("click_id")) return;

  url.searchParams.delete("click_id");
  const query = url.searchParams.toString();
  const next = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;

  // Passes through the existing history state rather than clobbering it —
  // Next.js's own client-side router keeps data there.
  window.history.replaceState(window.history.state, "", next);
}

/** Appends the stored parameters to a URL — for future outbound links. */
export function withParams(url: string, params: TrackedParams = getParams()): string {
  const entries = Object.entries(params).filter(([, v]) => Boolean(v));
  if (entries.length === 0) return url;

  const [base, hash = ""] = url.split("#");
  const separator = base.includes("?") ? "&" : "?";
  const query = entries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  return `${base}${separator}${query}${hash ? `#${hash}` : ""}`;
}
