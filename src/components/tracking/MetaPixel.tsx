"use client";

import Script from "next/script";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/* ==========================================================================
   META PIXEL — base script + one PageView
   --------------------------------------------------------------------------
   Mounted once in the root layout (see app/layout.tsx). Renders nothing —
   and loads nothing — when NEXT_PUBLIC_META_PIXEL_ID isn't configured (see
   .env.example). This is intentionally the only NEXT_PUBLIC_ Meta variable:
   the Pixel ID is meant to be browser-visible; it is not a secret and is
   unrelated to EZAFF_API_KEY / EZAFF_POSTBACK_SECRET / DATABASE_URL, none
   of which are ever read from client code.

   `fbq('init', ...)` and `fbq('track', 'PageView')` fire together, inside
   this one script body, rather than PageView being a separate call from
   elsewhere — that avoids any ordering race between "the base script has
   run" and "something else calls fbq". next/script dedupes by `id`, so
   even under React Strict Mode's double-invoked effects this script body
   still only executes once per real page load: exactly one PageView.

   next/script's `afterInteractive` strategy loads this after the page is
   interactive, non-blocking — it cannot delay first paint or hydration.
   ========================================================================== */

export function MetaPixel() {
  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
