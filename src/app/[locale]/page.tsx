"use client";

import { useI18n } from "@/components/layout/I18nProvider";
import Link from "next/link";
import { bands } from "@/data/bands";
import BandCard from "@/components/bands/BandCard";

export default function HomePage() {
  const { locale, t } = useI18n();
  const loc = locale as "zh" | "ja" | "en";

  // Show top 8 bands by Billboard rank on homepage
  const featuredBands = [...bands]
    .sort((a, b) => (a.billboardRank ?? 999) - (b.billboardRank ?? 999))
    .slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="flex flex-col items-center text-center">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
              style={{ color: "#38460C" }}
            >
              {t("home.heroTitle")}
            </h1>
            <p className="text-lg sm:text-xl text-neutral-500 leading-relaxed mb-8 max-w-lg">
              {t("home.heroSubtitle")}
            </p>
            <Link
              href={`/${locale}/bands`}
              className="inline-flex items-center px-6 py-3 rounded-full text-[15px] font-medium text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#6F8436" }}
            >
              {t("home.viewBands")}
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
        {/* Background gradient */}
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, #E5D89E, transparent)",
          }}
        />
      </section>

      {/* Featured Bands */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[13px] font-medium text-neutral-400 uppercase tracking-wide">
            {loc === "zh" ? "热门推荐" : loc === "ja" ? "人気アーティスト" : "Top Artists"}
          </h2>
          <Link
            href={`/${locale}/bands`}
            className="text-[13px] text-[#6F8436] hover:underline font-medium"
          >
            {loc === "zh" ? "查看全部 →" : loc === "ja" ? "すべて見る →" : "View All →"}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredBands.map((band) => (
            <BandCard key={band.id} band={band} />
          ))}
        </div>
      </section>
    </div>
  );
}
