"use client";

import { useI18n } from "@/components/layout/I18nProvider";
import { ExternalLink, Camera, MessageCircle, Music } from "lucide-react";
import type { SocialPost } from "@/data/bands";

const platformConfig: Record<string, { bg: string; icon: React.ReactNode; label: string; domain: string }> = {
  x: {
    bg: "bg-black",
    icon: <MessageCircle className="w-3 h-3" />,
    label: "X",
    domain: "X.com",
  },
  instagram: {
    bg: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: <Camera className="w-3 h-3" />,
    label: "IG",
    domain: "Instagram.com",
  },
  tiktok: {
    bg: "bg-gradient-to-r from-[#00f2ea] to-[#ff0050]",
    icon: <Music className="w-3 h-3" />,
    label: "TikTok",
    domain: "TikTok.com",
  },
  threads: {
    bg: "bg-neutral-800",
    icon: <MessageCircle className="w-3 h-3" />,
    label: "Threads",
    domain: "Threads.net",
  },
};

export default function FeedSection({
  socialPosts,
}: {
  twitterHandle: string;
  bandId: string;
  socialPosts: SocialPost[];
}) {
  const { locale } = useI18n();
  const localeKey = locale as "zh" | "ja" | "en";

  if (socialPosts.length === 0) {
    return (
      <p className="text-center py-12 text-neutral-400 text-[14px]">
        {localeKey === "zh" ? "暂无最新动态" : localeKey === "ja" ? "最新情報はありません" : "No recent updates"}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {socialPosts.map((post) => {
        const config = platformConfig[post.platform] || platformConfig.x;

        return (
          <a
            key={post.id}
            href={post.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl border border-neutral-200/60 bg-white hover:border-neutral-300 hover:shadow-sm transition-all group"
          >
            {/* Platform badge + Author + Date */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium text-white ${config.bg}`}
              >
                {config.icon}
                {config.label}
              </span>
              <span className="text-[12px] font-medium text-neutral-700">
                {post.author}
              </span>
              <span className="text-[11px] text-neutral-400 ml-auto">{post.date}</span>
            </div>

            {/* Content - multi-lang summary */}
            <p className="text-[13px] text-neutral-700 leading-relaxed mb-3 line-clamp-4">
              {post.content[localeKey]}
            </p>

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div
                className="grid gap-2 rounded-lg overflow-hidden mb-2"
                style={{
                  gridTemplateColumns:
                    post.images.length > 1 ? "repeat(2, 1fr)" : "1fr",
                }}
              >
                {post.images.map((img, i) => (
                  <div
                    key={i}
                    className="w-full h-36 bg-gradient-to-br from-[#E5D89E]/20 to-[#6F8436]/10 rounded-lg overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`${post.author} post`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = "none";
                        if (el.parentElement) {
                          el.parentElement.classList.add("flex", "items-center", "justify-center");
                          el.parentElement.innerHTML =
                            '<span class="text-2xl">📷</span>';
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* External Link */}
            <div className="flex items-center gap-1 mt-2">
              <ExternalLink className="w-3 h-3 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
              <span className="text-[11px] text-neutral-300 group-hover:text-neutral-400 transition-colors">
                {config.domain}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
