"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/components/layout/I18nProvider";

export default function Navbar() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setLangOpen(false);
  };

  const localeLabel: Record<string, string> = {
    zh: "中文",
    ja: "日本語",
    en: "EN",
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="text-lg font-bold tracking-tight"
            style={{ color: "#38460C" }}
          >
            J-Pop Hub
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={`/${locale}`}
              className="text-[13px] text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              href={`/${locale}/bands`}
              className="text-[13px] text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {t("nav.bands")}
            </Link>
            <Link
              href={`/${locale}/my-events`}
              className="text-[13px] text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {t("nav.myEvents")}
            </Link>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {localeLabel[locale] || locale}
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 min-w-[100px]">
                  {(["zh", "ja", "en"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLocale(l)}
                      className={cn(
                        "block w-full text-left px-4 py-2 text-[13px] hover:bg-neutral-100 transition-colors",
                        locale === l ? "text-[#38460C] font-medium" : "text-neutral-600"
                      )}
                    >
                      {localeLabel[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 px-4 py-4 space-y-3">
          <Link href={`/${locale}`} className="block text-[14px] text-neutral-800" onClick={() => setMobileOpen(false)}>{t("nav.home")}</Link>
          <Link href={`/${locale}/bands`} className="block text-[14px] text-neutral-800" onClick={() => setMobileOpen(false)}>{t("nav.bands")}</Link>
          <Link href={`/${locale}/my-events`} className="block text-[14px] text-neutral-800" onClick={() => setMobileOpen(false)}>{t("nav.myEvents")}</Link>
          <div className="flex gap-4 pt-2 border-t border-neutral-200">
            {(["zh", "ja", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={cn("text-[13px]", locale === l ? "text-[#38460C] font-medium" : "text-neutral-500")}
              >
                {localeLabel[l]}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
