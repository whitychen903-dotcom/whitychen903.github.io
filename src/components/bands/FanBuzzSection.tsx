"use client";

import { useI18n } from "@/components/layout/I18nProvider";
import { ExternalLink, TrendingUp, MessageCircle, Music, Camera } from "lucide-react";
import type { FanBuzz } from "@/data/bands";

const platformConfig: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
  x: {
    bg: "bg-black hover:bg-neutral-800",
    icon: <MessageCircle className="w-3 h-3" />,
    label: "X",
  },
  tiktok: {
    bg: "bg-[#000000] hover:bg-neutral-800",
    icon: <Music className="w-3 h-3" />,
    label: "TikTok",
  },
  instagram: {
    bg: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    icon: <Camera className="w-3 h-3" />,
    label: "IG",
  },
  threads: {
    bg: "bg-neutral-800 hover:bg-neutral-900",
    icon: <MessageCircle className="w-3 h-3" />,
    label: "Threads",
  },
};

export default function FanBuzzSection({ fanBuzzes }: { fanBuzzes: FanBuzz[] }) {
  const { locale, t } = useI18n();
  const localeKey = locale as "zh" | "ja" | "en";

  if (fanBuzzes.length === 0) {
    return (
      <p className="text-center py-12 text-neutral-400 text-[14px]">
        {localeKey === "zh"
          ? "暂无粉丝动态"
          : localeKey === "ja"
          ? "ファン動向はありません"
          : "No fan buzz yet"}
      </p>
    );
  }

  // Sort by hot score descending
  const sorted = [...fanBuzzes].sort((a, b) => b.hot - a.hot);
  const maxHot = Math.max(...sorted.map((b) => b.hot));

  return (
    <div className="flex flex-wrap gap-5 justify-center items-start">
      {sorted.map((buzz, i) => {
        const config = platformConfig[buzz.platform] || platformConfig.x;
        // Each bubble gets slightly different size for visual variety (no scale, use fixed sizes)
        const sizes = ["w-44", "w-48", "w-52", "w-56"];
        const sizeClass = sizes[i % sizes.length];

        return (
          <a
            key={buzz.id}
            href={buzz.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative ${sizeClass} flex-shrink-0`}
          >
            <div
              className="relative px-4 py-3 rounded-2xl text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:opacity-100 hover:shadow-xl hover:z-10"
              style={{
                background:
                  buzz.platform === "instagram"
                    ? "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)"
                    : buzz.platform === "tiktok"
                    ? "linear-gradient(135deg, #00f2ea, #ff0050)"
                    : buzz.platform === "threads"
                    ? "linear-gradient(135deg, #333, #666)"
                    : "linear-gradient(135deg, #1d9bf0, #0f6db0)",
              }}
            >
              {/* Platform badge */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-medium">
                  {config.icon}
                  {config.label}
                </span>
                <span className="text-[10px] text-white/70 ml-auto flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  {buzz.engagement}
                </span>
              </div>

              {/* Hashtag */}
              <p className="text-[13px] font-bold mb-1 leading-tight">
                {buzz.hashtag}
              </p>

              {/* Content preview */}
              <p className="text-[11px] text-white/90 leading-snug line-clamp-2 mb-1.5">
                {buzz.content[localeKey]}
              </p>

              {/* Author */}
              <div className="flex items-center gap-1 text-[10px] text-white/60">
                <span>{buzz.author}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
