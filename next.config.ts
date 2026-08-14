import type { NextConfig } from "next";

/* ==========================================================================
   SECURITY HEADERS
   --------------------------------------------------------------------------
   Only applied in production — `next dev`'s own tooling (Turbopack HMR,
   dev overlay) needs eval/websocket/inline-script allowances a strict CSP
   would otherwise block, and getting that right isn't worth the risk of a
   confusing local dev experience for a header that doesn't matter until
   deploy anyway.

   The actual third-party origins this app talks to from the BROWSER were
   inventoried, not guessed, by grepping src/ for every `https://` literal
   and cross-checking against next/font (which self-hosts Google Fonts at
   build time — no fonts.gstatic.com/fonts.googleapis.com requests happen
   at runtime, so neither needs to be allowlisted):
     - connect.facebook.net — Meta Pixel script (components/tracking/MetaPixel.tsx)
     - www.facebook.com     — Meta Pixel noscript fallback + its own beacon calls
     - challenges.cloudflare.com — Turnstile (components/TurnstileWidget.tsx),
       code-ready but inert until real keys are configured (see .env.example)
   api.ezaff.com is called only from server-only code (lib/ezaff.ts) — the
   browser never talks to it directly, so it does not belong in this CSP.

   CSP uses 'unsafe-inline' for scripts/styles rather than a nonce-based
   strict policy: Next.js's own hydration payload and the Meta Pixel base
   snippet (components/tracking/MetaPixel.tsx) are both legitimate inline
   <script> tags. A nonce-based CSP is the stronger option but requires
   per-request middleware wiring that could not be verified end-to-end here
   without real risk of breaking hydration in production — see the security
   report for that as a documented follow-up, not shipped now. This policy
   still meaningfully restricts which THIRD-PARTY origins can load a script,
   frame, image, or open a connection at all.
   ========================================================================== */

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://connect.facebook.net https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.facebook.com https://connect.facebook.net",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://www.facebook.com https://connect.facebook.net",
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  async headers() {
    if (process.env.NODE_ENV !== "production") return [];
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
