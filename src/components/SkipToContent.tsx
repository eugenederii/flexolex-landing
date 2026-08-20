"use client";

import { useLanguage } from "@/components/LanguageProvider";

/**
 * The keyboard-only "skip to content" link. Its own tiny client component
 * (rather than inline in the server-rendered root layout) purely so it can
 * read the active locale — it must render inside <LanguageProvider>.
 */
export function SkipToContent() {
  const { t } = useLanguage();

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-navy focus:px-6 focus:py-3 focus:font-semibold focus:text-cream"
    >
      {t.header.skipToContent}
    </a>
  );
}
