import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "dark-text" | "light-text";
  /** Headings are h2 by default; pass h3 for a sub-block. */
  as?: "h2" | "h3";
  className?: string;
  size?: "md" | "lg";
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "dark-text",
  as: Tag = "h2",
  size = "lg",
  className,
}: SectionHeadingProps) {
  const light = tone === "light-text";

  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "eyebrow mb-4",
            align === "center" && "justify-center",
            light && "text-sky",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "h-px w-6",
              light ? "bg-sky/60" : "bg-navy/40",
            )}
          />
          {eyebrow}
        </p>
      )}

      <Tag
        className={cn(
          size === "lg"
            ? "text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
            : "text-2xl sm:text-3xl",
          light && "text-cream",
        )}
      >
        {title}
      </Tag>

      {lead && (
        <p
          className={cn(
            "mt-5 text-lg",
            light ? "text-sky-soft/85" : "text-ink-soft",
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
