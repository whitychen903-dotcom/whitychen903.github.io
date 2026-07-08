"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/components/layout/I18nProvider";
import { bands } from "@/data/bands";
import BandCard from "@/components/bands/BandCard";
import { Search, ArrowUpDown } from "lucide-react";

type SortMode = "billboard" | "alphabetical";

export default function BandsPage() {
  const { t, locale } = useI18n();
  const loc = locale as "zh" | "ja" | "en";
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("billboard");

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

    // Sort
    if (sortMode === "billboard") {
      // Sort by billboardRank (lower = better), unranked go to end
      result.sort((a, b) => {
        const ra = a.billboardRank ?? 999;
        const rb = b.billboardRank ?? 999;
        return ra - rb;
      });
    } else {
      // Alphabetical sort by current locale name
      result.sort((a, b) => {
        const na = (a.name[loc] || a.name.ja).toLowerCase();
        const nb = (b.name[loc] || b.name.ja).toLowerCase();
        return na.localeCompare(nb);
      });
    }

    return result;
  }, [search, sortMode, loc]);

  const sortLabels = {
    billboard: loc === "zh" ? "Billboard 人气排行" : loc === "ja" ? "Billboard 人気順" : "Billboard Ranking",
    alphabetical: loc === "zh" ? "A-Z 字母排序" : loc === "ja" ? "A-Z アルファベット順" : "A-Z Alphabetical",
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
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              sortMode === "billboard"
                ? "bg-[#6F8436] text-white"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortLabels.billboard}
          </button>
          <button
            onClick={() => setSortMode("alphabetical")}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              sortMode === "alphabetical"
                ? "bg-[#6F8436] text-white"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {sortLabels.alphabetical}
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-[12px] text-neutral-400 mb-4">
        {filteredAndSorted.length}{" "}
        {loc === "zh" ? "个结果" : loc === "ja" ? "件" : "results"}
        {search && (
          <span>
            {" "}
            — {loc === "zh" ? "搜索" : loc === "ja" ? "検索" : "search"}: &quot;{search}&quot;
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
              ? "没有找到匹配的艺术家"
              : loc === "ja"
              ? "該当するアーティストが見つかりませんでした"
              : "No artists found matching your search"}
          </p>
        </div>
      )}
    </div>
  );
}
