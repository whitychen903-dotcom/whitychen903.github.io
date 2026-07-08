"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n";

interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "zh",
  t: (key: string) => key,
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = messages;
    for (const k of keys) {
      if (typeof value === "object" && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale: locale as Locale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
