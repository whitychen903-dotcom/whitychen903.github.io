"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/components/layout/I18nProvider";
import { bands } from "@/data/bands";
import BandCard from "@/components/bands/BandCard";
import { Search, ArrowUpDown, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

type SortMode = "billboard" | "alphabetical" | "genre";

// Genre tag definitions with multi-language labels
const GENRE_TAGS: { key: string; zh: string; ja: string; en: string }[] = [
  { key: "j-rock", zh: "J-Rock", ja: "J-ロック", en: "J-Rock" },
  { key: "j-pop", zh: "J-Pop", ja: "J-POP", en: "J-Pop" },
  { key: "r-b", zh: "R&B", ja: "R&B", en: "R&B" },
  { key: "hip-hop", zh: "嘻哈", ja: "ヒップホップ", en: "Hip-Hop" },
  { key: "electronic", zh: "电子", ja: "エレクトロニカ", en: "Electronic" },
  { key: "folk-indie", zh: "民谣/独立", ja: "フォーク/インディー", en: "Folk/Indie" },
  { key: "jazz", zh: "爵士", ja: "ジャズ", en: "Jazz" },
  { key: "idol-group", zh: "偶像团体", ja: "アイドルグループ", en: "Idol Group" },
  { key: "singer-songwriter", zh: "唱作人", ja: "シンガーソングライター", en: "Singer-Songwriter" },
  { key: "band", zh: "乐队", ja: "バンド", en: "Band" },
  { key: "anisong", zh: "动画歌曲", ja: "アニソン", en: "Anisong" },
  { key: "metal", zh: "金属", ja: "メタル", en: "Metal" },
  { key: "rap", zh: "说唱", ja: "ラップ", en: "Rap" },
];

export default function BandsPage() {
  const { t, locale } = useI18n();
  const loc = locale as "zh" | "ja" | "en";
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("billboard");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...bands];

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name[loc].toLowerCase().includes(q) ||
          b.name.ja.toLowerCase().includes(q) ||
          b.name.en.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q) ||
          b.description[loc].toLowerCase().includes(q)
      );
    }

    // Filter by genre tags
    if (selectedTags.size > 0) {
      result = result.filter((b) => {
        if (!b.tags || b.tags.length === 0) return false;
        return Array.from(selectedTags).some((tag) => b.tags!.includes(tag));
      });
    }

    // Sort
    if (sortMode === "billboard") {
      result.sort((a, b) => {
        const ra = a.billboardRank ?? 999;
        const rb = b.billboardRank ?? 999;
        return ra - rb;
      });
    } else if (sortMode === "alphabetical") {
      result.sort((a, b) => {
        const na = (a.name[loc] || a.name.ja).toLowerCase();
        const nb = (b.name[loc] || b.name.ja).toLowerCase();
        return na.localeCompare(nb);
      });
    }
    // genre mode: keep as-is (filtered by tags)

    return result;
  }, [search, sortMode, selectedTags, loc]);

  const sortLabels = {
    billboard: loc === "zh" ? "Billboard 人气排行" : loc === "ja" ? "Billboard 人気順" : "Billboard Ranking",
    alphabetical: loc === "zh" ? "A-Z 字母排序" : loc === "ja" ? "A-Z アルファベット順" : "A-Z Alphabetical",
    genre: loc === "zh" ? "按风格" : loc === "ja" ? "ジャンル別" : "By Genre",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-3">
          {t("bands.title")}
        </h1>
        <p className="text-neutral-500 text-[15px]">{t("bands.subtitle")}</p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              loc === "zh"
                ? "搜索歌手、乐队..."
                : loc === "ja"
                ? "アーティストを検索..."
                : "Search artists..."
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200/60 bg-white/80 backdrop-blur-sm text-[14px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#6F8436]/50 focus:ring-2 focus:ring-[#6F8436]/10 transition-all"
          />
        </div>

        {/* Sort Toggle */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-xl p-1">
          <button
            onClick={() => setSortMode("billboard")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all",
              sortMode === "billboard"
                ? "bg-[#6F8436] text-white"
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortLabels.billboard}
          </button>
          <button
            onClick={() => setSortMode("genre")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all",
              sortMode === "genre"
                ? "bg-[#6F8436] text-white"
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            {sortLabels.genre}
          </button>
          <button
            onClick={() => setSortMode("alphabetical")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all",
              sortMode === "alphabetical"
                ? "bg-[#6F8436] text-white"
                : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            {sortLabels.alphabetical}
          </button>
        </div>
      </div>

      {/* Genre Tag Filter (shown when genre mode is active) */}
      {sortMode === "genre" && (
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-3">
            <Tag className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[12px] text-neutral-500">
              {loc === "zh" ? "选择风格标签（可多选）" : loc === "ja" ? "ジャンルを選択（複数可）" : "Select genre tags (multiple)"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRE_TAGS.map((tag) => {
              const isActive = selectedTags.has(tag.key);
              return (
                <button
                  key={tag.key}
                  onClick={() => toggleTag(tag.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border",
                    isActive
                      ? "bg-[#6F8436] text-white border-[#6F8436]"
                      : "bg-white text-neutral-500 border-neutral-200 hover:border-[#6F8436]/50 hover:text-neutral-700"
                  )}
                >
                  {tag[loc] || tag.zh}
                </button>
              );
            })}
          </div>
          {selectedTags.size > 0 && (
            <button
              onClick={() => setSelectedTags(new Set())}
              className="mt-2 text-[11px] text-neutral-400 hover:text-neutral-600 underline"
            >
              {loc === "zh" ? "清除筛选" : loc === "ja" ? "フィルターをクリア" : "Clear filters"}
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-[12px] text-neutral-400 mb-4">
        {filteredAndSorted.length}{" "}
        {loc === "zh" ? "位音乐人" : loc === "ja" ? "組" : "artists"}
        {search && (
          <span>
            {" "}
            — {loc === "zh" ? "搜索" : loc === "ja" ? "検索" : "search"}: &quot;{search}&quot;
          </span>
        )}
        {selectedTags.size > 0 && (
          <span>
            {" "}
            — {loc === "zh" ? "标签" : loc === "ja" ? "タグ" : "tags"}:{" "}
            {Array.from(selectedTags)
              .map((t) => GENRE_TAGS.find((g) => g.key === t)?.[loc] || t)
              .join(", ")}
          </span>
        )}
      </p>

      {/* Band Grid */}
      {filteredAndSorted.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAndSorted.map((band) => (
            <BandCard key={band.id} band={band} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-neutral-400 text-[15px]">
            {loc === "zh"
              ? "没有找到匹配的音乐人"
              : loc === "ja"
              ? "該当するアーティストが見つかりませんでした"
              : "No artists found matching your search"}
          </p>
        </div>
      )}
    </div>
  );
}
