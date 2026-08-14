"use client";

import { useEffect } from "react";
import { captureParams } from "@/lib/urlParams";

/**
 * Runs once per page load: snapshots the attribution parameters from the
 * URL (including fbclid/campaign_id/adset_id/ad_id/UTMs) into sessionStorage
 * so they're still available whenever the visitor eventually submits.
 *
 * PageView itself is NOT fired from here — see
 * components/tracking/MetaPixel.tsx, which fires it atomically alongside
 * Pixel init to avoid a load-order race between "the Pixel script has run"
 * and a separate call to fbq from this component.
 */
export function PageTracking() {
  useEffect(() => {
    captureParams();
  }, []);

  return null;
}
