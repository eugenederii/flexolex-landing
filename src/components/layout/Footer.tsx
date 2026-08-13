"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { Wordmark } from "@/components/ui/Wordmark";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      id="site-footer"
      className="on-dark border-t border-white/8 bg-navy-deep pt-12 pb-24 text-sky-soft lg:pb-14"
    >
      <div className="container-page flex flex-col items-center text-center">
        <Wordmark tone="light-text" showCategory />

        <p className="mt-5 max-w-md text-base text-sky-soft/75">{t.footer.tagline}</p>

        <div className="mt-10 w-full max-w-2xl border-t border-white/10 pt-7">
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-sky-soft/55">
            {t.footer.disclaimer}
          </p>
          <p className="mt-5 text-xs text-sky-soft/45">{t.footer.copyright(new Date().getFullYear())}</p>
        </div>
      </div>
    </footer>
  );
}
