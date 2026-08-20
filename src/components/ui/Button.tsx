"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { scrollToId, scrollToOrder, ORDER_SECTION_ID } from "@/lib/scrollToOrder";

type Variant = "primary" | "gold" | "outline" | "light" | "quiet" | "offer";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /**
   * Conversion buttons pass `scrollTo="order"`. Scroll behaviour is never
   * re-implemented in a section — it all routes through lib/scrollToOrder.
   */
  scrollTo?: typeof ORDER_SECTION_ID | (string & {});
  /** Where the click came from — used for engagement tracking only. */
  trackingSource?: string;
  onClick?: () => void;
  fullWidth?: boolean;
}

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold " +
  "transition-[transform,box-shadow,background-color,color] duration-200 ease-out " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-60 " +
  "whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-cream shadow-cta hover:bg-navy-light hover:shadow-[0_16px_32px_-14px_rgba(18,63,138,0.7)]",
  gold: "bg-gold text-white shadow-[0_10px_24px_-12px_rgba(184,135,46,0.75)] hover:bg-[#c9973a]",
  outline:
    "border-2 border-navy/25 bg-surface text-navy hover:border-navy/50 hover:bg-sky-mist",
  light:
    "bg-cream text-navy-deep shadow-[0_14px_30px_-16px_rgba(0,0,0,0.6)] hover:bg-white",
  quiet: "text-navy hover:bg-sky-mist",
  /** Branded solid-blue CTA — currently only the special-offer section's button. */
  offer:
    "bg-[#123F87] text-white shadow-[0_14px_30px_-16px_rgba(0,0,0,0.6)] hover:bg-[#174EA6]",
};

/* Min 44px tall at every size — comfortable tap targets for a 40–65+ audience. */
const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-13 px-7 text-base",
  lg: "min-h-15 px-9 text-lg tracking-[0.01em]",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  scrollTo,
  trackingSource,
  onClick,
  fullWidth,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const handleClick = () => {
    if (scrollTo === ORDER_SECTION_ID) {
      scrollToOrder(trackingSource ?? "unknown");
    } else if (scrollTo) {
      scrollToId(scrollTo);
    }
    onClick?.();
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
