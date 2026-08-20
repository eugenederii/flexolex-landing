"use client";

import { useEffect } from "react";
import { captureParams, stripClickIdFromUrl } from "@/lib/urlParams";

/**
 * Runs once per page load: snapshots the attribution parameters from the
 * URL (including fbclid/campaign_id/adset_id/ad_id/UTMs) into sessionStorage
 * so they're still available whenever the visitor eventually submits, then
 * removes just `click_id` from the visible URL (history.replaceState — no
 * reload, no navigation, every other param untouched). The stored copy is
 * unaffected and still reaches EZAFF on submit.
 *
 * PageView itself is NOT fired from here — see
 * components/tracking/MetaPixel.tsx, which fires it atomically alongside
 * Pixel init to avoid a load-order race between "the Pixel script has run"
 * and a separate call to fbq from this component.
 */
export function PageTracking() {
  useEffect(() => {
    captureParams();
    stripClickIdFromUrl();
  }, []);

  return null;
}
