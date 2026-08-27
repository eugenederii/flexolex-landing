"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LANGUAGE_OPTIONS } from "@/data/locales";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/cn";

const CODE_LABEL: Record<string, string> = { en: "EN", fil: "FIL", ceb: "CEB" };

/**
 * Compact pill in the header: flag + language code + chevron, opening a
 * small listbox below it. Deliberately quieter than the ORDER NOW button —
 * smaller text, no fill background, restrained hover only.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeFlag = LANGUAGE_OPTIONS.find((option) => option.code === locale)?.flag;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.header.chooseLanguage}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 text-sm font-semibold text-ink",
          "shadow-soft transition-colors duration-200 hover:bg-sky-mist sm:h-10 sm:px-3",
        )}
      >
        <span aria-hidden="true" className="text-base leading-none">
          {activeFlag}
        </span>
        <span className="tracking-[0.02em]">{CODE_LABEL[locale]}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3.5 text-ink-muted transition-transform duration-200", open && "rotate-180")}
          strokeWidth={2.4}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.header.chooseLanguage}
          className="absolute top-full right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-line bg-surface py-1.5 shadow-card"
        >
          {LANGUAGE_OPTIONS.map((option) => {
            const selected = option.code === locale;
            return (
              <li key={option.code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setLocale(option.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-base font-semibold transition-colors duration-150",
                    selected ? "bg-sky-mist text-navy" : "text-ink-soft hover:bg-sky-mist/60",
                  )}
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    {option.flag}
                  </span>
                  <span className="flex-1">{option.label}</span>
                  {selected && (
                    <span aria-hidden="true" className="text-navy">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
