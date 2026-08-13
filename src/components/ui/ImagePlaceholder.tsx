import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { AssetSlot } from "@/data/assets";
import { cn } from "@/lib/cn";

interface ImagePlaceholderProps {
  asset: AssetSlot;
  /** Short human caption shown on the placeholder, e.g. "Morning walk". */
  label: string;
  className?: string;
  /** Tailwind aspect utility, e.g. "aspect-[4/5]". */
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  variant?: 0 | 1 | 2 | 3;
  rounded?: string;
}

/**
 * Stand-in for a photograph we have not sourced yet.
 *
 * No stock photo has been downloaded. This draws an original soft abstract
 * field so the composition reads at full fidelity, and carries the alt text and
 * shot brief from src/data/assets.ts. Set that asset's `src` and this renders
 * the real optimised <Image> instead — no layout shift, same box.
 */
export function ImagePlaceholder({
  asset,
  label,
  className,
  aspect = "aspect-[4/5]",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  variant = 0,
  rounded = "rounded-2xl",
}: ImagePlaceholderProps) {
  if (asset.src) {
    return (
      <div className={cn("relative overflow-hidden", aspect, rounded, className)}>
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  const fields = [
    "radial-gradient(60% 55% at 22% 20%, #cfe0f0 0%, transparent 62%), radial-gradient(55% 50% at 82% 30%, #f0e3c6 0%, transparent 60%), radial-gradient(70% 60% at 55% 92%, #a9c4e0 0%, transparent 65%)",
    "radial-gradient(55% 50% at 78% 18%, #dfe9f5 0%, transparent 60%), radial-gradient(60% 55% at 18% 68%, #e9dcc0 0%, transparent 62%), radial-gradient(80% 70% at 60% 100%, #9db8dc 0%, transparent 68%)",
    "radial-gradient(50% 45% at 30% 78%, #e5ddc6 0%, transparent 58%), radial-gradient(65% 55% at 70% 22%, #c6d8ee 0%, transparent 62%), radial-gradient(70% 60% at 20% 15%, #f3ece0 0%, transparent 60%)",
    "radial-gradient(60% 50% at 50% 12%, #eee6d3 0%, transparent 58%), radial-gradient(70% 62% at 15% 85%, #b9cce8 0%, transparent 64%), radial-gradient(60% 55% at 88% 72%, #dcc9a0 0%, transparent 60%)",
  ];

  return (
    <div
      className={cn(
        "grain relative overflow-hidden bg-sky-mist",
        aspect,
        rounded,
        className,
      )}
      role="img"
      aria-label={asset.alt}
    >
      <div className="absolute inset-0" style={{ backgroundImage: fields[variant] }} />

      {/* Soft horizon band — gives the field a sense of depth rather than a flat blob */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/18 to-transparent" />

      <div className="absolute inset-0 ring-1 ring-inset ring-navy/10" />

      {/* asset.brief (the shot brief for whoever sources this photo) lives in
          src/data/assets.ts — intentionally not rendered here for visitors. */}
      <figcaption className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold text-navy-deep backdrop-blur-sm">
          <ImageIcon aria-hidden="true" className="size-3.5" strokeWidth={2.2} />
          {label}
        </span>
      </figcaption>
    </div>
  );
}
