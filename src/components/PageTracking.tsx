"use client";

import { useEffect } from "react";
import { captureParams } from "@/lib/urlParams";
import { trackPageView } from "@/lib/tracking";

/**
 * Runs once per page load: snapshots the attribution parameters from the URL
 * into sessionStorage, then records a PageView.
 *
 * Nothing leaves the browser — no pixel is installed and `trackPageView` only
 * queues locally today. See lib/tracking.ts.
 */
export function PageTracking() {
  useEffect(() => {
    captureParams();
    trackPageView();
  }, []);

  return null;
}
