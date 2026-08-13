import type { Locale } from "@/types";
import type { Dictionary } from "./dictionary";
import { en } from "./en";
import { fil } from "./fil";

export type { Dictionary } from "./dictionary";

export const dictionaries: Record<Locale, Dictionary> = { en, fil };

/** New visitors always get English — never inferred from browser/location. */
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "flexolex-language";

/** Dropdown option labels — each language name written in itself, not
 *  translated per active locale (matches how language pickers read everywhere).
 *  Flag marks the language, not the country the visitor is in: US flag for
 *  English, PH flag for Filipino. */
export const LANGUAGE_OPTIONS: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fil", label: "Filipino", flag: "🇵🇭" },
];
