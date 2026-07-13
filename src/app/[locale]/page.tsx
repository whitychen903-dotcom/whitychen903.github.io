"use client";

import { useI18n } from "@/components/layout/I18nProvider";
import Link from "next/link";
import { bands } from "@/data/bands";
import type { Band } from "@/data/bands";
import { useMemo } from "react";
import { Calendar, Ticket, ExternalLink, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// ---- Word Cloud Data (2026年7月最新) ----
// Each topic maps to social media search/topic pages (X, YouTube) for real-time buzz.
// Updated: 2026-07-08 — 来源: Billboard Japan, THE MUSIC DAY 2026, FNS歌謡祭 夏
const TRENDING_TOPICS = [
  {
    zh: "THE MUSIC DAY 2026",
    ja: "THE MUSIC DAY 2026",
    en: "THE MUSIC DAY 2026",
    weight: 100,
    xQuery: "THEMUSICDAY2026",
    ytQuery: "THE+MUSIC+DAY+2026",
    // 7月4日放送、総勢65組出演の夏の音楽特番
  },
  {
    zh: "BE:FIRST Missing",
    ja: "BE:FIRST Missing",
    en: "BE:FIRST Missing",
    weight: 95,
    xQuery: "BE:FIRST Missing",
    ytQuery: "BE:FIRST+Missing",
    artistSlug: undefined,
    // 7月1日リリース、Billboard Hot 100 首位獲得
  },
  {
    zh: "米津玄师 Iris Out",
    ja: "米津玄師 IRIS OUT",
    en: "Kenshi Yonezu Iris Out",
    weight: 90,
    xQuery: "米津玄師 IRIS OUT",
    ytQuery: "米津玄師+IRIS+OUT",
    artistSlug: "kenshi-yonezu",
    // 2026上半期 Billboard 総合首位
  },
  {
    zh: "FNS歌謡祭 夏",
    ja: "FNS歌謡祭 夏 2026",
    en: "FNS Summer Music Festival",
    weight: 85,
    xQuery: "FNS歌謡祭 夏 2026",
    ytQuery: "FNS歌謡祭+夏+2026",
    // 7月1日放送、BE:FIRST新曲初披露
  },
  {
    zh: "フジロック 2026",
    ja: "フジロック 2026",
    en: "Fuji Rock 2026",
    weight: 82,
    xQuery: "フジロック2026",
    ytQuery: "フジロック+2026+ラインナップ",
    // 7月24日〜26日、苗場
  },
  {
    zh: "サマーソニック 25周年",
    ja: "サマソニ 2026",
    en: "Summer Sonic 2026",
    weight: 80,
    xQuery: "サマソニ2026",
    ytQuery: "Summer+Sonic+2026",
    // 8月14日〜16日、25周年！Ado 初出演
  },
  {
    zh: "Mrs. GREEN APPLE 上半期首位",
    ja: "Mrs. GREEN APPLE 上半期",
    en: "Mrs. GREEN APPLE Half-Year",
    weight: 75,
    xQuery: "MrsGREENAPPLE 上半期",
    ytQuery: "Mrs+GREEN+APPLE+2026",
    artistSlug: "mrs-green-apple",
    // Billboard 2026上半期アーティストチャート1位
  },
  {
    zh: "MAZZEL So Strawberry",
    ja: "MAZZEL So Strawberry",
    en: "MAZZEL So Strawberry",
    weight: 72,
    xQuery: "MAZZEL SoStrawberry",
    ytQuery: "MAZZEL+So+Strawberry",
    // Billboard Hot Shot Songs 首位、THE MUSIC DAY初出演
  },
  {
    zh: "CORTIS 世界巡演",
    ja: "CORTIS ワールドツアー",
    en: "CORTIS World Tour",
    weight: 68,
    xQuery: "CORTIS ワールドツアー",
    ytQuery: "CORTIS+world+tour+2026",
    // 7月18日より日本公演開始、BIGHIT新人
  },
  {
    zh: "なにわ男子 夏ライブ",
    ja: "なにわ男子 夏ライブ",
    en: "Naniwa Danshi Summer Live",
    weight: 65,
    xQuery: "なにわ男子 ライブ 2026",
    ytQuery: "なにわ男子+ライブ+2026",
    // KAMIGATA EXPO PARK FES 出演決定
  },
  {
    zh: "Creepy Nuts 海外進出",
    ja: "Creepy Nuts 海外進出",
    en: "Creepy Nuts Global",
    weight: 60,
    xQuery: "CreepyNuts 海外",
    ytQuery: "Creepy+Nuts+overseas",
    artistSlug: "creepy-nuts",
  },
  {
    zh: "Ado サマソニ初出演",
    ja: "Ado サマソニ初出演",
    en: "Ado Summer Sonic Debut",
    weight: 55,
    xQuery: "Ado サマソニ",
    ytQuery: "Ado+Summer+Sonic+2026",
    artistSlug: "ado",
    // サマソニ2026第4弾発表で初出演決定
  },
];

// ---- Simple Word Cloud Component ----
// Each word is clickable → opens X search / YouTube search in new tab
function WordCloud({ topics, locale }: { topics: typeof TRENDING_TOPICS; locale: string }) {
  const loc = locale as "zh" | "ja" | "en";

  const colors = [
    "text-[#38460C]", "text-[#6F8436]", "text-[#8B9A46]",
    "text-[#EDBC13]", "text-[#D4C87A]", "text-[#5A6E2C]",
  ];

  const platformColors: Record<string, string> = {
    x: "bg-black/5 text-neutral-700 hover:bg-black/10",
    youtube: "bg-red-50 text-red-600 hover:bg-red-100",
    tiktok: "bg-neutral-900/5 text-neutral-800 hover:bg-neutral-900/10",
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 py-4">
      {topics.map((topic, i) => {
        const fontSize = 12 + (topic.weight / 100) * 24;
        const color = colors[i % colors.length];
        const displayText = topic[loc] || topic.zh;

        // Build landing URLs
        const xUrl = `https://x.com/search?q=${encodeURIComponent(topic.xQuery)}&src=typed_query&f=live`;
        const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic.ytQuery || topic.xQuery)}`;

        return (
          <div key={i} className="group relative inline-flex flex-col items-center gap-1">
            {/* The word itself */}
            <span
              className={cn(
                "font-bold inline-block px-1 cursor-default",
                color
              )}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.4 }}
            >
              {displayText}
            </span>

            {/* Platform link badges — show on hover */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {/* X (Twitter) */}
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`X で「${topic.ja}」を検索`}
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-colors whitespace-nowrap",
                  "bg-black/5 text-neutral-600 hover:bg-black/15"
                )}
              >
                𝕏
              </a>
              {/* YouTube */}
              <a
                href={ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`YouTube で「${topic.ja}」を検索`}
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-colors whitespace-nowrap",
                  "bg-red-50 text-red-600 hover:bg-red-100"
                )}
              >
                ▶
              </a>
              {/* TikTok */}
              <a
                href={`https://www.tiktok.com/search?q=${encodeURIComponent(topic.xQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`TikTok で「${topic.ja}」を検索`}
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-colors whitespace-nowrap",
                  "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                )}
              >
                ♪
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { locale, t } = useI18n();
  const loc = locale as "zh" | "ja" | "en";

  // Get top 3 tours with closest ticket deadlines
  const urgentTours = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const allTours: {
      artistName: string;
      artistSlug: string;
      artistImage: string;
      tourName?: string;
      date: string;
      venue: string;
      ticketUrl?: string;
      ticketDeadline?: string;
    }[] = [];

    bands.forEach((band: Band) => {
      band.tours
        .filter((t) => t.date >= today && t.ticketUrl)
        .forEach((t) => {
          allTours.push({
            artistName: band.name[loc],
            artistSlug: band.slug,
            artistImage: band.imageUrl,
            tourName: t.tourName,
            date: t.date,
            venue: t.venue[loc],
            ticketUrl: t.ticketUrl,
            ticketDeadline: t.ticketSale?.period.split("~")[1]?.trim() || t.ticketSale?.period,
          });
        });
    });

    // Sort by closest date
    allTours.sort((a, b) => a.date.localeCompare(b.date));
    return allTours.slice(0, 3);
  }, [loc]);

  // Calculate days left
  const daysLeft = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

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
            {/* Two CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/${locale}/bands`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-[15px] font-medium text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "#6F8436" }}
              >
                {t("home.viewBands")}
                <span className="ml-2">→</span>
              </Link>
              <Link
                href={`/${locale}/my-events`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-[15px] font-medium border-2 transition-all duration-200 hover:bg-neutral-100"
                style={{ borderColor: "#6F8436", color: "#38460C" }}
              >
                {loc === "zh" ? "我的想看" : loc === "ja" ? "見たいリスト" : "My List"}
                <span className="ml-2">→</span>
              </Link>
            </div>
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

      {/* Trending Word Cloud */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-4">
          <h2 className="inline-flex items-center gap-2 text-[13px] font-medium text-neutral-400 uppercase tracking-wide">
            <TrendingUp className="w-4 h-4" />
            {loc === "zh" ? "大事件 · 热搜趋势" : loc === "ja" ? "大事件 · トレンド" : "Trending · Hot Topics"}
          </h2>
        </div>
        <div className="p-6 rounded-2xl bg-white/60 border border-neutral-200/40">
          <WordCloud topics={TRENDING_TOPICS} locale={locale} />
        </div>
      </section>

      {/* Urgent Ticket Deadlines */}
      {urgentTours.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20">
          <div className="mb-6">
            <h2 className="text-[13px] font-medium text-neutral-400 uppercase tracking-wide">
              {loc === "zh" ? "即将截止购票" : loc === "ja" ? "チケット販売まもなく終了" : "Ticket Sales Ending Soon"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {urgentTours.map((tour, i) => {
              const left = daysLeft(tour.date);
              const urgencyColor =
                left <= 3 ? "text-red-500 bg-red-50" :
                left <= 7 ? "text-orange-500 bg-orange-50" :
                "text-[#6F8436] bg-[#6F8436]/5";

              // P4: Landing page = direct ticket purchase URL
              const ticketUrl = tour.ticketUrl || `/${locale}/bands/${tour.artistSlug}`;
              const isExternalTicket = ticketUrl.startsWith("http");

              return (
                <a
                  key={i}
                  href={ticketUrl}
                  target={isExternalTicket ? "_blank" : undefined}
                  rel={isExternalTicket ? "noopener noreferrer" : undefined}
                  className="group p-4 rounded-xl border border-neutral-200/60 bg-white hover:border-[#6F8436]/30 hover:shadow-sm transition-all block"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={tour.artistImage}
                      alt={tour.artistName}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-neutral-900 truncate">
                        {tour.artistName}
                      </p>
                      <p className="text-[12px] text-neutral-400 truncate">
                        {tour.tourName || tour.venue}
                      </p>
                    </div>
                    {/* External link indicator for direct ticket URLs */}
                    {isExternalTicket && (
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-300 group-hover:text-[#6F8436] transition-colors shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[12px] text-neutral-500 min-w-0">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tour.date}</span>
                      <span className="text-neutral-300 shrink-0">·</span>
                      <span className="truncate">{tour.venue}</span>
                    </div>
                    <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2", urgencyColor)}>
                      {left <= 0
                        ? (loc === "zh" ? "今日截止" : loc === "ja" ? "本日締切" : "Ends Today")
                        : left === 1
                        ? (loc === "zh" ? "明天截止" : loc === "ja" ? "明日締切" : "Ends Tomorrow")
                        : `${left}${loc === "zh" ? "天后截止" : loc === "ja" ? "日後締切" : "d left"}`}
                    </span>
                  </div>
                  {/* Direct ticket link hint */}
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-[#6F8436] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <Ticket className="w-3 h-3" />
                    <span>
                      {isExternalTicket
                        ? (loc === "zh" ? "前往购票 →" : loc === "ja" ? "チケットを購入 →" : "Buy Tickets →")
                        : (loc === "zh" ? "查看详情 →" : loc === "ja" ? "詳細を見る →" : "View Details →")}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
