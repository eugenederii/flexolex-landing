/* ==========================================================================
   Shared domain types
   ========================================================================== */

/* ---------- Localization ---------------------------------------------------
   "en" (English, default) and "fil" (Filipino — the language, not "PH" the
   country code). See src/data/locales for the dictionaries and
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
] as const;

export type TrackedParamKey = (typeof TRACKED_PARAM_KEYS)[number];

export type TrackedParams = Partial<Record<TrackedParamKey, string>>;

export type TrackingEventName = "PageView" | "ViewContent" | "Lead";

export interface TrackingEventPayload {
  contentName?: string;
  contentCategory?: string;
  value?: number;
  currency?: string;
  /** Only ever set by the order flow, after a confirmed backend response. */
  leadId?: string;
}
