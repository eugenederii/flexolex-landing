import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "cream" | "deep" | "surface" | "navy" | "mist";

interface SectionProps {
  id?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
  /** Turns off the standard vertical rhythm when a section needs its own. */
  bare?: boolean;
  "aria-labelledby"?: string;
}

const tones: Record<Tone, string> = {
  cream: "bg-cream text-ink-soft",
  deep: "bg-cream-deep text-ink-soft",
  surface: "bg-surface text-ink-soft",
  mist: "bg-sky-mist text-ink-soft",
  navy: "bg-navy-deep text-sky-soft on-dark",
};

/** Consistent section shell: background tone, vertical rhythm, safe overflow. */
export function Section({
  id,
  tone = "cream",
  children,
  className,
  bare,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate w-full overflow-hidden",
        tones[tone],
        !bare && "py-16 sm:py-20 lg:py-28",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
