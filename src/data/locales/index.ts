import type { Locale } from "@/types";
import type { Dictionary } from "./dictionary";
import { en } from "./en";
import { fil } from "./fil";
import { ceb } from "./ceb";

export type { Dictionary } from "./dictionary";

export const dictionaries: Record<Locale, Dictionary> = { en, fil, ceb };

/** New visitors always get Filipino — never inferred from browser/location.
 *  English is available only via an explicit manual choice in the language
 *  switcher, which is then remembered in localStorage (see LanguageProvider). */
export const DEFAULT_LOCALE: Locale = "fil";

export const LOCALE_STORAGE_KEY = "flexolex-language";

/** Dropdown option labels — each language name written in itself, not
 *  translated per active locale (matches how language pickers read everywhere).
 *  Flag marks the language, not the country the visitor is in: US flag for
 *  English, PH flag for Filipino. */
export const LANGUAGE_OPTIONS: { code: Locale; label: string; flag: string }[] = [
  { code: "fil", label: "Filipino", flag: "🇵🇭" },
  { code: "ceb", label: "Bisaya", flag: "🇵🇭" },
  { code: "en", label: "English", flag: "🇺🇸" },
];
