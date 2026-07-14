"use client";

import { useI18n } from "@/components/layout/I18nProvider";
import { useWantToGoTours, useFollowedArtists, useTodoItems } from "@/hooks/useLocalStorage";
import { bands } from "@/data/bands";
import type { Band } from "@/data/bands";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  BookmarkCheck, Trash2, Search, Plus, Calendar, MapPin, Ticket,
  ExternalLink, Check, Circle, X, ChevronDown, ChevronUp, Music, UserPlus, UserMinus,
  Clock, Flame, TrendingUp, ArrowUpDown, Filter, Edit3, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ---- Todo Labels ----
const TODO_TAGS = [
  { key: "concert", zh: "🎫 追 Con", ja: "🎫 ライブ参戦", en: "🎫 Concert" },
  { key: "ticket", zh: "🎫 抽票", ja: "🎫 チケット抽選", en: "🎫 Ticket Lottery" },
  { key: "cd", zh: "💿 买专辑/单曲", ja: "💿 CD購入", en: "💿 Buy CD" },
  { key: "merch", zh: "👕 周边上新", ja: "👕 グッズ新着", en: "👕 New Merch" },
  { key: "photo", zh: "📸 生写/拍立得", ja: "📸 生写真/チェキ", en: "📸 Photo Cards" },
  { key: "birthday", zh: "🎂 生日应援", ja: "🎂 誕生日応援", en: "🎂 Birthday Project" },
  { key: "pilgrimage", zh: "🏕️ 圣地巡礼", ja: "🏕️ 聖地巡礼", en: "🏕️ Pilgrimage" },
  { key: "tv", zh: "📺 音番/番组", ja: "📺 音楽番組", en: "📺 TV Show" },
  { key: "radio", zh: "📻 广播/直播", ja: "📻 ラジオ/配信", en: "📻 Radio/Live" },
  { key: "streaming", zh: "🎧 刷榜/冲流媒", ja: "🎧 ストリーミング", en: "🎧 Streaming" },
  { key: "fc", zh: "✍️ FC 入会/续费", ja: "✍️ FC入会/更新", en: "✍️ Fan Club" },
  { key: "festival", zh: "🎸 音乐节参战", ja: "🎸 フェス参戦", en: "🎸 Festival" },
  { key: "support", zh: "🎁 应援物制作", ja: "🎁 応援グッズ作成", en: "🎁 Fan Support" },
  { key: "expedition", zh: "✈️ 远征计划", ja: "✈️ 遠征計画", en: "✈️ Expedition" },
  { key: "karaoke", zh: "🎤 Karaoke 练习", ja: "🎤 カラオケ練習", en: "🎤 Karaoke" },
  { key: "magazine", zh: "📰 杂志/新闻", ja: "📰 雑誌/ニュース", en: "📰 Magazine" },
];

// ---- Countdown helper ----
function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ---- Exchange Rate ----
function ExchangeRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/JPY")
      .then((r) => r.json())
      .then((data) => {
        if (data?.rates?.CNY) {
          setRate(data.rates.CNY);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <span className="text-[11px] text-neutral-300">加载汇率...</span>;
  if (!rate) return null;

  return (
    <span className="text-[11px] text-neutral-400">
      💱 1 JPY ≈ {rate.toFixed(4)} CNY
    </span>
  );
}

export default function MyEventsPage() {
  const { locale, t } = useI18n();
  const loc = locale as "zh" | "ja" | "en";

  const { tours, removeTour, addCustomTour } = useWantToGoTours();
  const { artists: followed, addArtist, removeArtist } = useFollowedArtists();
  const { items: todos, addItem, toggleComplete, removeItem } = useTodoItems();

  // ---- Tour Search ----
  const [tourSearch, setTourSearch] = useState("");
  const [showTourSearch, setShowTourSearch] = useState(false);
  const allUpcomingTours = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return bands.flatMap((band: Band) =>
      band.tours
        .filter((t) => t.date >= today)
        .map((t) => ({
          id: `tour-${t.date}-${t.venue.ja}`,
          artistName: band.name[loc],
          artistSlug: band.slug,
          tourName: t.tourName,
          date: t.date,
          venue: t.venue[loc],
          location: t.location[loc],
          ticketUrl: t.ticketUrl,
        }))
    );
  }, [loc]);

  const filteredTours = useMemo(() => {
    if (!tourSearch.trim()) return allUpcomingTours.slice(0, 20);
    const q = tourSearch.toLowerCase();
    return allUpcomingTours.filter(
      (t) =>
        t.artistName.toLowerCase().includes(q) ||
        t.venue.toLowerCase().includes(q) ||
        (t.tourName && t.tourName.toLowerCase().includes(q))
    );
  }, [allUpcomingTours, tourSearch]);

  // ---- Custom Tour Form ----
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customTour, setCustomTour] = useState({
    artistName: "",
    date: "",
    venue: "",
    location: "",
    ticketUrl: "",
    note: "",
  });

  // ---- Follow Artist Search ----
  const [artistSearch, setArtistSearch] = useState("");
  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const filteredArtists = useMemo(() => {
    if (!artistSearch.trim()) return bands.slice(0, 20);
    const q = artistSearch.toLowerCase();
    return bands.filter(
      (b) =>
        b.name[loc].toLowerCase().includes(q) ||
        b.name.ja.toLowerCase().includes(q)
    );
  }, [artistSearch, loc]);

  // ---- Todo Form ----
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: "", tag: "concert", dueDate: "", note: "" });
  const [todoSort, setTodoSort] = useState<"default" | "dueDate">("default");
  const [todoFilter, setTodoFilter] = useState<string | null>(null);

  // ---- Tab State ----
  const [activeTab, setActiveTab] = useState<"tours" | "artists" | "todos">("tours");

  // Sort tours by date, split into upcoming and expired
  const today = new Date().toISOString().split("T")[0];
  const { upcomingTours, expiredTours } = useMemo(() => {
    const upcoming = tours
      .filter((t) => t.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    const expired = tours
      .filter((t) => t.date < today)
      .sort((a, b) => b.date.localeCompare(a.date));
    return { upcomingTours: upcoming, expiredTours: expired };
  }, [tours, today]);

  // Sorted & filtered todos
  const sortedTodos = useMemo(() => {
    let result = [...todos];
    if (todoFilter) {
      result = result.filter((item) => item.tag === todoFilter);
    }
    if (todoSort === "dueDate") {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    }
    // Default: incomplete first, then by creation date
    return result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [todos, todoSort, todoFilter]);

  const todoStats = useMemo(() => {
    const completed = todos.filter((t) => t.completed).length;
    return { total: todos.length, completed, active: todos.length - completed };
  }, [todos]);

  const tabLabels: Record<string, Record<string, string>> = {
    tours: { zh: "想看的巡演", ja: "見たいツアー", en: "Want to Go" },
    artists: { zh: "关注的音乐人", ja: "フォロー中", en: "Following" },
    todos: { zh: "To Do", ja: "To Do", en: "To Do" },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">
        <BookmarkCheck className="w-6 h-6 inline-block mr-2 text-[#EDBC13]" />
        {loc === "zh" ? "我的主页" : loc === "ja" ? "マイページ" : "My Page"}
      </h1>
      <p className="text-[13px] text-neutral-400 mb-8">
        {loc === "zh"
          ? "管理你想看的巡演、关注的音乐人和待办事项"
          : loc === "ja"
          ? "見たいツアー、フォロー中のアーティスト、To Doを管理"
          : "Manage your tours, followed artists, and to-do list"}
      </p>

      {/* Tabs with counts */}
      <div className="flex gap-1 bg-neutral-100 rounded-xl p-1 mb-6">
        {(["tours", "artists", "todos"] as const).map((tab) => {
          const count =
            tab === "tours" ? upcomingTours.length :
            tab === "artists" ? followed.length :
            todoStats.active;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center justify-center gap-1.5",
                activeTab === tab
                  ? "bg-white text-[#38460C] shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              {tabLabels[tab][loc] || tabLabels[tab].zh}
              {count > 0 && (
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full",
                  activeTab === tab ? "bg-[#6F8436]/15 text-[#6F8436]" : "bg-neutral-200 text-neutral-500"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================== TAB 1: WANT-TO-GO TOURS ======================== */}
      {activeTab === "tours" && (
        <div>
          {/* Stats summary */}
          {upcomingTours.length > 0 && (
            <div className="flex items-center gap-4 mb-4 text-[12px] text-neutral-500">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#EDBC13]" />
                {upcomingTours.length} {loc === "zh" ? "场即将到来" : loc === "ja" ? "件の予定" : "upcoming"}
              </span>
              {upcomingTours[0] && daysUntil(upcomingTours[0].date) <= 7 && (
                <span className="flex items-center gap-1 text-red-500 font-medium animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  {loc === "zh" ? `最近: ${daysUntil(upcomingTours[0].date)} 天后` :
                   loc === "ja" ? `直近: ${daysUntil(upcomingTours[0].date)} 日後` :
                   `Next: ${daysUntil(upcomingTours[0].date)}d`}
                </span>
              )}
            </div>
          )}

          {/* Search & Add Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowTourSearch(!showTourSearch)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-[12px] text-neutral-600 hover:border-[#6F8436]/50 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              {loc === "zh" ? "搜索已有巡演" : loc === "ja" ? "ツアーを検索" : "Search Tours"}
            </button>
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-[12px] text-neutral-600 hover:border-[#6F8436]/50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {loc === "zh" ? "自行添加" : loc === "ja" ? "自分で追加" : "Add Custom"}
            </button>
          </div>

          {/* Tour Search Results */}
          {showTourSearch && (
            <div className="mb-4 p-4 rounded-xl bg-white border border-neutral-200">
              <input
                type="text"
                value={tourSearch}
                onChange={(e) => setTourSearch(e.target.value)}
                placeholder={loc === "zh" ? "搜索音乐人或巡演名称..." : loc === "ja" ? "アーティストやツアー名で検索..." : "Search artist or tour name..."}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:outline-none focus:border-[#6F8436]/50 mb-3"
                autoFocus
              />
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredTours.map((tour) => {
                  const alreadySaved = tours.some((t) => t.id === tour.id);
                  return (
                    <div
                      key={tour.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 text-[13px]"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-neutral-800">{tour.artistName}</span>
                        <span className="text-neutral-400 mx-1">·</span>
                        <span className="text-neutral-600">{tour.venue}</span>
                        <span className="text-neutral-400 mx-1">·</span>
                        <span className="text-neutral-400">{tour.date}</span>
                      </div>
                      {alreadySaved ? (
                        <span className="text-[11px] text-[#EDBC13] flex-shrink-0 ml-2">
                          {loc === "zh" ? "已添加" : loc === "ja" ? "追加済" : "Added"}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            addCustomTour({
                              artistName: tour.artistName,
                              artistSlug: tour.artistSlug,
                              tourName: tour.tourName,
                              date: tour.date,
                              venue: tour.venue,
                              location: tour.location,
                              ticketUrl: tour.ticketUrl,
                            });
                          }}
                          className="text-[11px] text-[#6F8436] hover:underline flex-shrink-0 ml-2"
                        >
                          + {loc === "zh" ? "添加" : loc === "ja" ? "追加" : "Add"}
                        </button>
                      )}
                    </div>
                  );
                })}
                {filteredTours.length === 0 && (
                  <p className="text-[12px] text-neutral-400 text-center py-4">
                    {loc === "zh" ? "未找到匹配的巡演" : loc === "ja" ? "該当するツアーが見つかりません" : "No matching tours found"}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Custom Tour Form */}
          {showCustomForm && (
            <div className="mb-4 p-4 rounded-xl bg-white border border-neutral-200">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={customTour.artistName}
                  onChange={(e) => setCustomTour({ ...customTour, artistName: e.target.value })}
                  placeholder={loc === "zh" ? "演出者 *" : loc === "ja" ? "アーティスト *" : "Artist *"}
                  className="px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:outline-none focus:border-[#6F8436]/50"
                />
                <input
                  type="date"
                  value={customTour.date}
                  onChange={(e) => setCustomTour({ ...customTour, date: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:outline-none focus:border-[#6F8436]/50"
                />
                <input
                  type="text"
                  value={customTour.venue}
                  onChange={(e) => setCustomTour({ ...customTour, venue: e.target.value })}
                  placeholder={loc === "zh" ? "地点/场馆" : loc === "ja" ? "会場" : "Venue"}
                  className="px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:outline-none focus:border-[#6F8436]/50"
                />
                <input
                  type="text"
                  value={customTour.location}
                  onChange={(e) => setCustomTour({ ...customTour, location: e.target.value })}
                  placeholder={loc === "zh" ? "城市" : loc === "ja" ? "都市" : "City"}
                  className="px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:outline-none focus:border-[#6F8436]/50"
                />
              </div>
              <input
                type="url"
                value={customTour.ticketUrl}
                onChange={(e) => setCustomTour({ ...customTour, ticketUrl: e.target.value })}
                placeholder={loc === "zh" ? "购票链接（选填）" : loc === "ja" ? "チケットURL（任意）" : "Ticket URL (optional)"}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:outline-none focus:border-[#6F8436]/50 mb-3"
              />
              <button
                onClick={() => {
                  if (!customTour.artistName || !customTour.date) return;
                  addCustomTour({
                    artistName: customTour.artistName,
                    artistSlug: "",
                    date: customTour.date,
                    venue: customTour.venue || "",
                    location: customTour.location || "",
                    ticketUrl: customTour.ticketUrl || undefined,
                  });
                  setCustomTour({ artistName: "", date: "", venue: "", location: "", ticketUrl: "", note: "" });
                  setShowCustomForm(false);
                }}
                className="w-full py-2 rounded-lg bg-[#6F8436] text-white text-[13px] font-medium hover:bg-[#38460C] transition-colors"
              >
                {loc === "zh" ? "添加巡演" : loc === "ja" ? "ツアーを追加" : "Add Tour"}
              </button>
            </div>
          )}

          {/* Tour List — Upcoming */}
          {upcomingTours.length + expiredTours.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-400 text-[15px]">
                {loc === "zh"
                  ? "还没有收藏任何巡演。浏览音乐人页面，在「巡演信息」中点击书签图标来收藏！"
                  : loc === "ja"
                  ? "まだツアーを保存していません。アーティストページの「ツアー情報」でブックマークアイコンをクリック！"
                  : 'No saved tours yet. Browse artist pages and click the bookmark icon in "Tour Info" to save!'}
              </p>
            </div>
          ) : (
            <>
              {/* Upcoming Section */}
              {upcomingTours.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-2">
                    {loc === "zh" ? "即将到来" : loc === "ja" ? "近日開催" : "Upcoming"}
                  </h3>
                  <div className="space-y-2">
                    {upcomingTours.map((tour) => {
                      const left = daysUntil(tour.date);
                      const urgencyIcon = left <= 3
                        ? <Clock className="w-3 h-3 text-red-500" />
                        : left <= 7
                        ? <Clock className="w-3 h-3 text-orange-500" />
                        : <Calendar className="w-3 h-3 text-[#6F8436]" />;
                      const urgencyText = left <= 0
                        ? (loc === "zh" ? "今天!" : loc === "ja" ? "本日!" : "Today!")
                        : left === 1
                        ? (loc === "zh" ? "明天" : loc === "ja" ? "明日" : "Tomorrow")
                        : `${left}${loc === "zh" ? "天后" : loc === "ja" ? "日後" : "d left"}`;

                      return (
                        <div
                          key={tour.id}
                          className="flex items-start justify-between p-3 rounded-xl border bg-white border-neutral-200/60 hover:border-[#6F8436]/20 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[14px] font-medium text-neutral-900 truncate">
                                {tour.artistName}
                              </span>
                            </div>
                            <p className="text-[13px] text-neutral-600 truncate">
                              {tour.venue}
                              {tour.location && ` · ${tour.location}`}
                            </p>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-[12px] text-neutral-400 flex items-center gap-1">
                                {urgencyIcon}
                                {tour.date}
                              </span>
                              <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                                left <= 3 ? "bg-red-50 text-red-500" :
                                left <= 7 ? "bg-orange-50 text-orange-600" :
                                "bg-[#6F8436]/5 text-[#6F8436]"
                              )}>
                                {urgencyText}
                              </span>
                              {tour.ticketUrl && (
                                <a
                                  href={tour.ticketUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-[#6F8436] hover:underline inline-flex items-center gap-1"
                                >
                                  <Ticket className="w-3 h-3" />
                                  {loc === "zh" ? "购票" : loc === "ja" ? "チケット" : "Tickets"}
                                </a>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeTour(tour.id)}
                            className="p-1.5 rounded-full text-neutral-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Expired Section */}
              {expiredTours.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-2">
                    {loc === "zh" ? "已过期" : loc === "ja" ? "終了" : "Expired"}
                  </h3>
                  <div className="space-y-2 opacity-60">
                    {expiredTours.map((tour) => (
                      <div
                        key={tour.id}
                        className="flex items-start justify-between p-3 rounded-xl border bg-neutral-50 border-neutral-100"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[14px] font-medium text-neutral-600 truncate">
                              {tour.artistName}
                            </span>
                          </div>
                          <p className="text-[13px] text-neutral-400 truncate">
                            {tour.venue}
                            {tour.location && ` · ${tour.location}`}
                          </p>
                          <span className="text-[12px] text-neutral-400">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {tour.date}
                          </span>
                        </div>
                        <button
                          onClick={() => removeTour(tour.id)}
                          className="p-1.5 rounded-full text-neutral-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Exchange Rate */}
          <div className="mt-6 text-center">
            <ExchangeRate />
          </div>
        </div>
      )}

      {/* ======================== TAB 2: FOLLOWED ARTISTS ======================== */}
      {activeTab === "artists" && (
        <div>
          {/* Stats */}
          {followed.length > 0 && (
            <div className="flex items-center gap-4 mb-4 text-[12px] text-neutral-500">
              <span className="flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-[#6F8436]" />
                {followed.length} {loc === "zh" ? "位已关注" : loc === "ja" ? "人フォロー中" : "followed"}
              </span>
            </div>
          )}

          {/* Search */}
          <button
            onClick={() => setShowArtistSearch(!showArtistSearch)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-[12px] text-neutral-600 hover:border-[#6F8436]/50 transition-colors mb-4"
          >
            <Plus className="w-3.5 h-3.5" />
            {loc === "zh" ? "添加音乐人" : loc === "ja" ? "アーティストを追加" : "Add Artist"}
          </button>

          {showArtistSearch && (
            <div className="mb-4 p-4 rounded-xl bg-white border border-neutral-200">
              <input
                type="text"
                value={artistSearch}
                onChange={(e) => setArtistSearch(e.target.value)}
                placeholder={loc === "zh" ? "搜索音乐人..." : loc === "ja" ? "アーティストを検索..." : "Search artists..."}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:outline-none focus:border-[#6F8436]/50 mb-3"
                autoFocus
              />
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredArtists.map((band) => {
                  const isFollowed = followed.some((a) => a.slug === band.slug);
                  return (
                    <div
                      key={band.slug}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 text-[13px]"
                    >
                      <Link
                        href={`/${locale}/bands/${band.slug}`}
                        className="font-medium text-neutral-800 hover:text-[#6F8436] truncate flex-1"
                      >
                        {band.name[loc]}
                        {band.billboardRank && (
                          <span className="ml-2 text-[10px] text-neutral-400">
                            #{band.billboardRank}
                          </span>
                        )}
                      </Link>
                      {isFollowed ? (
                        <button
                          onClick={() => removeArtist(band.slug)}
                          className="text-[11px] text-neutral-400 hover:text-red-500 flex-shrink-0 ml-2"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            addArtist({ slug: band.slug, name: band.name[loc], addedAt: "" })
                          }
                          className="text-[11px] text-[#6F8436] hover:underline flex-shrink-0 ml-2"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Followed List — enhanced with avatar, rank badge, expandable */}
          {followed.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-400 text-[15px]">
                {loc === "zh"
                  ? "还没有关注的音乐人。点击上方按钮添加！"
                  : loc === "ja"
                  ? "まだフォロー中のアーティストがいません"
                  : "No followed artists yet. Click the button above to add!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {followed.map((artist) => (
                <FollowedArtistCard
                  key={artist.slug}
                  artist={artist}
                  bandData={bands.find((b) => b.slug === artist.slug)}
                  loc={loc}
                  locale={locale}
                  onRemove={() => removeArtist(artist.slug)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================== TAB 3: TO DO ======================== */}
      {activeTab === "todos" && (
        <div>
          {/* Progress bar */}
          {todos.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1.5">
                <span>
                  {loc === "zh" ? `进度 ${todoStats.completed}/${todoStats.total}` :
                   loc === "ja" ? `進捗 ${todoStats.completed}/${todoStats.total}` :
                   `Progress ${todoStats.completed}/${todoStats.total}`}
                </span>
                <span>
                  {todoStats.total > 0
                    ? `${Math.round((todoStats.completed / todoStats.total) * 100)}%`
                    : "0%"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6F8436] rounded-full transition-all duration-300"
                  style={{ width: `${todoStats.total > 0 ? (todoStats.completed / todoStats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Controls: Add + Sort + Filter */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setShowTodoForm(!showTodoForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-[12px] text-neutral-600 hover:border-[#6F8436]/50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {loc === "zh" ? "添加事项" : loc === "ja" ? "To Doを追加" : "Add Item"}
            </button>
            <button
              onClick={() => setTodoSort(todoSort === "default" ? "dueDate" : "default")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] transition-colors",
                todoSort === "dueDate"
                  ? "bg-[#6F8436]/10 border-[#6F8436]/30 text-[#6F8436]"
                  : "bg-white border-neutral-200 text-neutral-600 hover:border-[#6F8436]/50"
              )}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {loc === "zh" ? "按截止日期" : loc === "ja" ? "期限順" : "By Due Date"}
            </button>
            {todoFilter && (
              <button
                onClick={() => setTodoFilter(null)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#EDBC13]/10 text-[#EDBC13] text-[11px]"
              >
                <X className="w-3 h-3" />
                {TODO_TAGS.find((t) => t.key === todoFilter)?.[loc] || todoFilter}
              </button>
            )}
          </div>

          {/* Todo Form */}
          {showTodoForm && (
            <div className="mb-4 p-4 rounded-xl bg-white border border-neutral-200">
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                placeholder={loc === "zh" ? "事项标题 *" : loc === "ja" ? "タイトル *" : "Title *"}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:outline-none focus:border-[#6F8436]/50 mb-3"
              />
              <div className="grid grid-cols-2 gap-3 mb-3">
                <select
                  value={newTodo.tag}
                  onChange={(e) => setNewTodo({ ...newTodo, tag: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:outline-none focus:border-[#6F8436]/50 bg-white"
                >
                  {TODO_TAGS.map((tag) => (
                    <option key={tag.key} value={tag.key}>
                      {tag[loc] || tag.zh}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:outline-none focus:border-[#6F8436]/50"
                />
              </div>
              <input
                type="text"
                value={newTodo.note}
                onChange={(e) => setNewTodo({ ...newTodo, note: e.target.value })}
                placeholder={loc === "zh" ? "备注（选填）" : loc === "ja" ? "メモ（任意）" : "Note (optional)"}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:outline-none focus:border-[#6F8436]/50 mb-3"
              />
              <button
                onClick={() => {
                  if (!newTodo.title) return;
                  addItem({
                    title: newTodo.title,
                    tag: newTodo.tag,
                    dueDate: newTodo.dueDate || undefined,
                    note: newTodo.note || undefined,
                    completed: false,
                  });
                  setNewTodo({ title: "", tag: "concert", dueDate: "", note: "" });
                  setShowTodoForm(false);
                }}
                className="w-full py-2 rounded-lg bg-[#6F8436] text-white text-[13px] font-medium hover:bg-[#38460C] transition-colors"
              >
                {loc === "zh" ? "添加" : loc === "ja" ? "追加" : "Add"}
              </button>
            </div>
          )}

          {/* Todo List */}
          {todos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-400 text-[15px]">
                {loc === "zh"
                  ? "还没有待办事项。点击上方按钮添加！"
                  : loc === "ja"
                  ? "To Doはまだありません"
                  : "No to-do items yet. Click the button above to add!"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedTodos.map((item) => {
                const tagData = TODO_TAGS.find((t) => t.key === item.tag);
                const dueDays = item.dueDate ? daysUntil(item.dueDate) : null;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border transition-colors group",
                      item.completed
                        ? "bg-neutral-50 border-neutral-100 opacity-60"
                        : "bg-white border-neutral-200/60 hover:border-neutral-300"
                    )}
                  >
                    <button
                      onClick={() => toggleComplete(item.id)}
                      className={cn(
                        "mt-0.5 flex-shrink-0",
                        item.completed ? "text-[#6F8436]" : "text-neutral-300 hover:text-[#6F8436]"
                      )}
                    >
                      {item.completed ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-[14px]",
                          item.completed
                            ? "text-neutral-400 line-through"
                            : "text-neutral-800"
                        )}
                      >
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {tagData && (
                          <button
                            onClick={() => setTodoFilter(todoFilter === item.tag ? null : item.tag)}
                            className={cn(
                              "text-[11px] px-1.5 py-0.5 rounded transition-colors",
                              todoFilter === item.tag
                                ? "bg-[#6F8436]/15 text-[#6F8436]"
                                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                            )}
                          >
                            {tagData[loc] || tagData.zh}
                          </button>
                        )}
                        {item.dueDate && (
                          <span className={cn(
                            "text-[11px] flex items-center gap-0.5",
                            dueDays !== null && dueDays <= 3 && !item.completed
                              ? "text-red-500 font-medium"
                              : "text-neutral-400"
                          )}>
                            <Calendar className="w-3 h-3" />
                            {item.dueDate}
                            {dueDays !== null && !item.completed && (
                              <span className="ml-0.5">
                                ({dueDays <= 0
                                  ? (loc === "zh" ? "已过期" : loc === "ja" ? "期限切れ" : "overdue")
                                  : `${dueDays}${loc === "zh" ? "天后" : loc === "ja" ? "日後" : "d left"}`})
                              </span>
                            )}
                          </span>
                        )}
                        {item.note && (
                          <span className="text-[11px] text-neutral-400 truncate max-w-[200px]">
                            {item.note}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded text-neutral-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// ---- FollowedArtistCard (separate component for useState) ----
function FollowedArtistCard({
  artist,
  bandData,
  loc,
  locale,
  onRemove,
}: {
  artist: { slug: string; name: string; addedAt: string };
  bandData: Band | undefined;
  loc: "zh" | "ja" | "en";
  locale: string;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const latestPost = bandData?.socialPosts?.[0] || null;
  const olderPosts = bandData?.socialPosts?.slice(1, 3) || [];
  const upcomingTour = bandData?.tours?.find(
    (t) => t.date >= new Date().toISOString().split("T")[0]
  );

  return (
    <div className="p-4 rounded-xl bg-white border border-neutral-200/60 hover:border-neutral-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={bandData?.imageUrl || ""}
            alt={artist.name}
            className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
          />
          <div className="min-w-0">
            <Link
              href={`/${locale}/bands/${artist.slug}`}
              className="text-[15px] font-bold text-neutral-900 hover:text-[#6F8436] transition-colors"
            >
              {artist.name}
            </Link>
            {bandData?.billboardRank && (
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-[#EDBC13]/10 text-[#EDBC13] font-medium">
                #{bandData.billboardRank}
              </span>
            )}
            {bandData?.tags && bandData.tags.length > 0 && (
              <div className="flex gap-1 mt-0.5">
                {bandData.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[10px] text-neutral-400">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {olderPosts.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={onRemove}
            className="p-1 rounded-full text-neutral-300 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {upcomingTour && (
        <div className="flex items-center gap-2 text-[12px] mb-2">
          <span className="text-[#EDBC13] font-medium flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {upcomingTour.date}
          </span>
          <span className="text-neutral-500 truncate">
            {upcomingTour.venue[loc]} · {upcomingTour.location[loc]}
          </span>
        </div>
      )}

      {/* Latest Announcement — always visible, clickable landing page */}
      {latestPost && (
        <a
          href={latestPost.link || bandData?.officialSite || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-1 p-3 rounded-lg bg-[#6F8436]/5 border border-[#6F8436]/10 hover:bg-[#6F8436]/10 hover:border-[#6F8436]/20 transition-all cursor-pointer group/latest"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[#EDBC13]/15 text-[#EDBC13]">
              📢 {loc === "zh" ? "最新公告" : loc === "ja" ? "最新お知らせ" : "Latest"}
            </span>
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded font-medium",
              latestPost.platform === "x" ? "bg-black/5 text-neutral-700" :
              latestPost.platform === "instagram" ? "bg-pink-50 text-pink-600" :
              latestPost.platform === "tiktok" ? "bg-neutral-900/5 text-neutral-700" :
              "bg-red-50 text-red-600"
            )}>
              {latestPost.platform.toUpperCase()}
            </span>
            <span className="text-[10px] text-neutral-400">{latestPost.date}</span>
          </div>
          <p className="text-[13px] text-neutral-800 line-clamp-2 leading-relaxed">{latestPost.content[loc]}</p>
          <div className="flex items-center gap-1 mt-1.5 text-[11px] text-[#6F8436] font-medium group-hover/latest:underline">
            <ExternalLink className="w-3 h-3" />
            {loc === "zh" ? "查看详情" : loc === "ja" ? "詳細を見る" : "View Details"}
          </div>
        </a>
      )}

      {/* Older posts — expandable */}
      {expanded && olderPosts.length > 0 && (
        <div className="mt-2 space-y-2">
          {olderPosts.map((post, i) => (
            <div key={i} className="p-2 rounded-lg bg-neutral-50 text-[12px]">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-medium",
                  post.platform === "x" ? "bg-black/5 text-neutral-700" :
                  post.platform === "instagram" ? "bg-pink-50 text-pink-600" :
                  post.platform === "tiktok" ? "bg-neutral-900/5 text-neutral-700" :
                  "bg-red-50 text-red-600"
                )}>
                  {post.platform.toUpperCase()}
                </span>
                <span className="text-neutral-400">{post.date}</span>
              </div>
              <p className="text-neutral-700 line-clamp-2">{post.content[loc]}</p>
              {post.link && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[#6F8436] hover:underline mt-1 inline-flex items-center gap-0.5"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  {loc === "zh" ? "查看原文" : loc === "ja" ? "元記事を見る" : "View source"}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {!latestPost && !upcomingTour && (
        <p className="text-[12px] text-neutral-400">
          {loc === "zh" ? "暂无最新动态" : loc === "ja" ? "最新情報なし" : "No recent updates"}
        </p>
      )}
    </div>
  );
}
