"use client";

import { AlertCircle } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Leading glyph inside the field. Decorative only. */
  icon?: ReactNode;
}

export function FormInput({
  id,
  label,
  hint,
  error,
  icon,
  className,
  ...rest
}: FormInputProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-2 block font-sans text-base font-bold text-ink"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-muted"
          >
            {icon}
          </span>
        )}

        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            // 56px tall, 17px text — comfortable on a phone, no iOS zoom on focus
            "h-14 w-full rounded-xl border-2 bg-surface text-base text-ink",
            "placeholder:text-ink-muted/70",
            "transition-[border-color,box-shadow] duration-200 outline-none",
            "focus:border-navy focus:ring-4 focus:ring-navy/12",
            icon ? "pr-4 pl-12" : "px-4",
            error
              ? "border-danger focus:border-danger focus:ring-danger/12"
              : "border-line-strong hover:border-sky",
            className,
          )}
          {...rest}
        />
      </div>

      {hint && !error && (
        <p id={hintId} className="mt-2 text-sm text-ink-muted">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-danger"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
