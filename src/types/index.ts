/* ==========================================================================
   Shared domain types
   ========================================================================== */

/* ---------- Localization ---------------------------------------------------
   "en" (English) and "fil" (Filipino — the language, not "PH" the country
   code; rendered as `lang="tl"` on <html>, the correct BCP-47 tag). Filipino
   is the DEFAULT for new visitors — see DEFAULT_LOCALE in src/data/locales.
   See src/data/locales for the dictionaries and
   src/components/LanguageProvider.tsx for the runtime switch. */
export type Locale = "en" | "fil";

export interface Review {
  id: string;
  name: string;
  age: number;
  city: string;
  quote: Record<Locale, string>;
  /** Future path under /public/assets/testimonials — null renders an initials avatar. */
  avatar: string | null;
  /** 1–5. Optional: omit rather than invent one. */
  rating?: number;
}

/* ---------- Lead form ----------------------------------------------------- */

export interface LeadFormValues {
  fullName: string;
  phone: string;
  /** Required consent to be called for order confirmation — never pre-checked. */
  callConsent: boolean;
}

/** Displayable, already-localized validation messages — keyed by field. */
export type LeadFormErrors = Partial<Record<keyof LeadFormValues, string>>;

/**
 * Locale-agnostic validation result. `lib/leadForm.ts` only ever knows about
 * codes; the caller (which has the active dictionary) maps each code to a
 * displayable string. Keeps validation logic and copy independent.
 */
export type LeadFormErrorCode = "required" | "invalid";
export type LeadFormErrorCodes = Partial<Record<keyof LeadFormValues, LeadFormErrorCode>>;

export type LeadSubmitStatus = "idle" | "submitting" | "success" | "error";

/* ---------- Tracking ------------------------------------------------------ */

export const TRACKED_PARAM_KEYS = [
  "fb_pixel",
  "click_id",
  "extra_id_1",
  "stream_id",
  "pid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  /** Meta ad-click id — distinct from EZAFF's own `click_id`. See lib/metaAttribution.ts. */
  "fbclid",
  "campaign_id",
  "adset_id",
  "ad_id",
] as const;

export type TrackedParamKey = (typeof TRACKED_PARAM_KEYS)[number];

export type TrackedParams = Partial<Record<TrackedParamKey, string>>;

export type TrackingEventName = "PageView" | "ViewContent" | "Lead";

export interface TrackingEventPayload {
  contentName?: string;
  contentCategory?: string;
  value?: number;
  currency?: string;
}

/* ---------- Lead API (browser → /api/lead → EZAFF) -------------------------
   The browser only ever talks to our own /api/lead route (see
   lib/leadForm.ts and app/api/lead/route.ts). Offer configuration
   (publisher_id, offer_id, api_key, country, price, quantity,
   price_currency) is never part of this contract — it's fixed server-side
   from environment variables and cannot be influenced by the request body. */

/** Body the client sends to our own /api/lead route. */
export interface LeadApiRequestBody {
  fullName: string;
  phone: string;
  /** Required consent to be called for order confirmation — never pre-checked. */
  callConsent: boolean;
  /** Attribution parameters captured from the URL/session — see lib/urlParams.ts. */
  params: TrackedParams;
  /** Meta `_fbp`/`_fbc` cookies, read fresh immediately before submission — see lib/leadForm.ts. */
  fbp?: string;
  fbc?: string;
  /** Cloudflare Turnstile response token — see lib/turnstile.ts. Absent/ignored when Turnstile isn't configured. */
  turnstileToken?: string;
  /** The actual landing page URL as seen by the browser (window.location.href). */
  eventSourceUrl?: string;
}

export interface LeadApiSuccessBody {
  success: true;
  /** The order id EZAFF returned for this lead. */
  orderId: string;
  /** Generated server-side, sent to EZAFF as publisher_order_id — kept for
   *  matching this lead against a future postback. */
  publisherOrderId: string;
  /** Generated server-side alongside publisherOrderId. The browser fires the
   *  Meta Lead event with this exact value as its eventID, for future
   *  Pixel + CAPI deduplication. */
  metaLeadEventId: string;
}

export interface LeadApiErrorBody {
  success: false;
  message: string;
}

export type LeadApiResponseBody = LeadApiSuccessBody | LeadApiErrorBody;
