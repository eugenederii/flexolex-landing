import { Footprints, Leaf, Sunrise, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const icons: Record<string, LucideIcon> = {
  leaf: Leaf,
  sun: Sunrise,
  footprints: Footprints,
};

interface TrustItemProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

export function TrustItem({ icon, title, description, className }: TrustItemProps) {
  const Icon = icons[icon] ?? Leaf;

  return (
    <div className={cn("flex items-start gap-4", className)}>
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-full bg-sky-mist text-navy ring-1 ring-navy/8"
      >
        <Icon className="size-5" strokeWidth={1.9} />
      </span>
      <div className="min-w-0">
        <h3 className="font-sans text-base font-bold tracking-normal text-ink">
          {title}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      </div>
    </div>
  );
}
