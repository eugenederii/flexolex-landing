import Image from "next/image";
import { assets } from "@/data/assets";
import { cn } from "@/lib/cn";

interface ProductPlaceholderProps {
  className?: string;
  /** Sizes hint for next/image once the real pack shot is supplied. */
  sizes?: string;
  priority?: boolean;
  /** Very slow vertical drift. Off by default; used once, in the hero. */
  float?: boolean;
  /**
   * Unique per call site — this is a Server Component, so it can't use
   * useId(). The placeholder SVG defines gradients/filters by id, and two
   * instances rendered on the same page (even if one is CSS-hidden) would
   * otherwise collide on those ids and silently fail to paint. Pass a short,
   * unique string wherever this component is used more than once on a page.
   */
  id: string;
}

/**
 * The Flexolex package.
 *
 * Until the official pack shot is supplied, this renders original vector
 * artwork drawn for this project — no photo has been downloaded. The moment
 * `assets.productPack.src` is set in src/data/assets.ts, every one of the five
 * placements on the page switches to the real image. Nothing else changes.
 */
export function ProductPlaceholder({
  className,
  sizes = "(max-width: 768px) 60vw, 380px",
  priority = false,
  float = false,
  id,
}: ProductPlaceholderProps) {
  const pack = assets.productPack;
  const gid = (name: string) => `fx-${name}-${id}`;

  if (pack.src) {
    return (
      <Image
        src={pack.src}
        alt={pack.alt}
        width={pack.width}
        height={pack.height}
        sizes={sizes}
        priority={priority}
        // No default width here on purpose: it would sit on the same element
        // as the caller's own width class (e.g. the hero's fixed w-18 thumb)
        // and, since `cn` is a plain string join with no override logic,
        // Tailwind's generated CSS order — not className order — would pick
        // the winner. Every call site below sets its own width explicitly.
        className={cn("h-auto object-contain", float && "float-soft", className)}
      />
    );
  }

  return (
    <div className={cn("relative", float && "float-soft", className)}>
      <svg
        viewBox="0 0 320 430"
        role="img"
        aria-label={pack.alt}
        className="aspect-[320/430] h-auto w-full"
      >
        <defs>
          <linearGradient id={gid("body")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e5bb8" />
            <stop offset="45%" stopColor="#123f8a" />
            <stop offset="100%" stopColor="#0b2e63" />
          </linearGradient>
          <linearGradient id={gid("cap")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a2242" />
            <stop offset="40%" stopColor="#071a34" />
            <stop offset="100%" stopColor="#040f20" />
          </linearGradient>
          <linearGradient id={gid("gloss")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.26" />
            <stop offset="38%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={gid("label")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1ede4" />
          </linearGradient>
          <filter id={gid("shadow")} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse
          cx="162"
          cy="404"
          rx="104"
          ry="15"
          fill="#122033"
          opacity="0.16"
          filter={`url(#${gid("shadow")})`}
        />

        {/* Cap */}
        <rect x="96" y="10" width="128" height="44" rx="13" fill={`url(#${gid("cap")})`} />
        <g opacity="0.5">
          {[110, 122, 134, 146, 158, 170, 182, 194, 206].map((x) => (
            <rect key={x} x={x} y="16" width="2.5" height="32" rx="1.25" fill="#000" opacity="0.25" />
          ))}
        </g>
        <rect x="112" y="50" width="96" height="16" rx="5" fill="#081226" />

        {/* Body */}
        <rect x="46" y="60" width="228" height="330" rx="36" fill={`url(#${gid("body")})`} />
        <rect x="46" y="60" width="228" height="330" rx="36" fill={`url(#${gid("gloss")})`} />

        {/* Label */}
        <rect x="62" y="146" width="196" height="186" rx="18" fill={`url(#${gid("label")})`} />
        <rect
          x="62"
          y="146"
          width="196"
          height="186"
          rx="18"
          fill="none"
          stroke="#123f8a"
          strokeOpacity="0.12"
        />

        {/* Leaf mark */}
        <g transform="translate(160 182)">
          <path
            d="M0 -16C10 -12 16 -4 16 4C16 11 9 16 0 16C-9 16 -16 11 -16 4C-16 -4 -10 -12 0 -16Z"
            fill="#123f8a"
            opacity="0.1"
          />
          <path
            d="M0 -11C7 -7 11 -1 11 4C11 9 6 12 0 12C-6 12 -11 9 -11 4C-11 -1 -7 -7 0 -11Z"
            fill="none"
            stroke="#123f8a"
            strokeWidth="1.6"
          />
          <path d="M0 12V-9" stroke="#123f8a" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* Wordmark */}
        <text
          x="160"
          y="243"
          textAnchor="middle"
          fill="#123f8a"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "25px",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          FLEXOLEX
        </text>

        <rect x="122" y="258" width="76" height="1.5" rx="0.75" fill="#b8872e" />

        <text
          x="160"
          y="284"
          textAnchor="middle"
          fill="#5f6b7a"
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.22em",
          }}
        >
          DAILY JOINT SUPPORT
        </text>

        <text
          x="160"
          y="310"
          textAnchor="middle"
          fill="#9db8dc"
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.18em",
          }}
        >
          FOR EVERYDAY MOVEMENT
        </text>

        {/* Base sheen */}
        <rect x="46" y="352" width="228" height="38" rx="18" fill="#000" opacity="0.12" />
      </svg>

      {/* TODO: real image lives at /assets/product/ once supplied — see
          src/data/assets.ts. Nothing rendered here for visitors in the
          meantime; check this component's source for the swap-in path. */}
    </div>
  );
}
