// 简洁的三语翻译系统
// 不使用 next-intl 的复杂机制，直接返回 messages 对象

import zh from "@/messages/zh/common";
import ja from "@/messages/ja/common";
import en from "@/messages/en/common";

const messages = { zh, ja, en } as const;
export type Locale = keyof typeof messages;
export const locales = Object.keys(messages) as Locale[];
export const defaultLocale: Locale = "zh";

export function getMessages(locale: Locale) {
  return messages[locale];
}

export function t(locale: Locale, key: string): string {
  const keys = key.split(".");
  let value: unknown = messages[locale];
  for (const k of keys) {
    if (typeof value === "object" && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === "string" ? value : key;
}
