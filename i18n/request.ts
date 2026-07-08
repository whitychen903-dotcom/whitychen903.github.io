import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default getRequestConfig(async () => {
  return {
    locale: routing.defaultLocale,
    messages: (await import(`../src/messages/${routing.defaultLocale}/common`)).default,
  };
});
