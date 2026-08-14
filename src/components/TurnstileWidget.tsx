"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function isTurnstileConfiguredClient(): boolean {
  return Boolean(SITE_KEY);
}

interface TurnstileWidgetProps {
  /** Called with the token on success, or `null` on error/expiry. */
  onToken: (token: string | null) => void;
}

/**
 * Renders nothing — and loads nothing — if NEXT_PUBLIC_TURNSTILE_SITE_KEY
 * isn't configured (see .env.example), the same safe-default pattern as
 * MetaPixel.tsx. `onToken` should be a stable function (e.g. a useState
 * setter) so this effect only runs once the script has actually loaded.
 */
export function TurnstileWidget({ onToken }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!SITE_KEY || !scriptLoaded || !containerRef.current || !window.turnstile) return;
    // Guards against React Strict Mode's double-invoked effects — the ref
    // persists across both invocations of the same component instance.
    if (widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      callback: (token: string) => onToken(token),
      "error-callback": () => onToken(null),
      "expired-callback": () => onToken(null),
    });
  }, [scriptLoaded, onToken]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} className="mt-5 flex justify-center" />
    </>
  );
}
