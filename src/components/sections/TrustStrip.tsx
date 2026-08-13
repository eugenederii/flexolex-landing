import { trustItems } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { TrustItem } from "@/components/ui/TrustItem";

/**
 * General wellness statements only — no authority, approval or ranking claims.
 * Sits directly under the hero as an elevated card so the page reads as one
 * continuous composition rather than a stack of bands.
 */
export function TrustStrip() {
  return (
    <section aria-label="What Flexolex is" className="relative z-10 bg-cream pb-4">
      <div className="container-page">
        <Reveal>
          <ul className="grid gap-7 rounded-2xl border border-line bg-surface p-7 shadow-card sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line sm:p-0">
            {trustItems.map((item) => (
              <li key={item.id} className="sm:px-7 sm:py-8">
                <TrustItem
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
