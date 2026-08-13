import { legal } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="on-dark border-t border-white/8 bg-navy-deep pt-12 pb-24 text-sky-soft lg:pb-14"
    >
      <div className="container-page flex flex-col items-center text-center">
        <Wordmark tone="light-text" showCategory />

        <p className="mt-5 max-w-md text-base text-sky-soft/75">
          Daily joint support, made to fit into an ordinary day.
        </p>

        <div className="mt-10 w-full max-w-2xl border-t border-white/10 pt-7">
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-sky-soft/55">
            {legal.disclaimer}
          </p>
          <p className="mt-5 text-xs text-sky-soft/45">{legal.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
