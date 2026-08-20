"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Locale } from "@/types";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, dictionaries, type Dictionary } from "@/data/locales";

interface LanguageContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "fil";
}

/** `<html lang>` wants a real BCP-47 tag — "tl" (Tagalog) for our "fil"
 *  internal code, not the ISO-639-2-only "fil" itself. */
const HTML_LANG: Record<Locale, string> = { en: "en", fil: "tl" };

/* ==========================================================================
   Tiny external store over localStorage — read via useSyncExternalStore so
   the saved preference is picked up without a setState-in-effect (React
   flags that pattern; this is the store-subscription shape it recommends
   instead). getServerSnapshot always returns DEFAULT_LOCALE (Filipino):
   every visitor's first paint — server and client — renders the same thing,
   so there is nothing to mismatch. A returning English-preferring visitor
   may see one brief Filipino flash while the real snapshot is read, which
   is the standard, safe trade-off for a localStorage-based (not
   cookie/SSR-based) switch.
   ========================================================================== */
type Listener = () => void;
let listeners: Listener[] = [];

function subscribe(listener: Listener) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((entry) => entry !== listener);
  };
}

function getSnapshot(): Locale {
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function persistLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  listeners.forEach((listener) => listener());
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
  }, [locale]);

  const setLocale = useCallback((next: Locale) => persistLocale(next), []);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, t: dictionaries[locale], setLocale }),
    [locale, setLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
