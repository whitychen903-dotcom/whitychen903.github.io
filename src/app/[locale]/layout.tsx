import { notFound } from "next/navigation";
import { SessionProvider } from "@/components/layout/SessionProviderWrap";
import { locales, getMessages, type Locale } from "@/lib/i18n";
import { I18nProvider } from "@/components/layout/I18nProvider";
import AppShell from "@/components/layout/AppShell";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const msgs = getMessages(locale as Locale);

  return (
    <I18nProvider locale={locale} messages={msgs}>
      <SessionProvider>
        <AppShell>{children}</AppShell>
      </SessionProvider>
    </I18nProvider>
  );
}
