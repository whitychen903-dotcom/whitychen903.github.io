"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/components/layout/I18nProvider";
import { bands } from "@/data/bands";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Droplet,
  Ruler,
  Music,
  Camera,
  MessageCircle,
} from "lucide-react";

// Helper: generate a colored SVG placeholder with initials
function avatarPlaceholder(name: string, size: number = 200) {
  const colors = [
    ["#6F8436", "#E5D89E"],
    ["#38460C", "#D4C87A"],
    ["#8B9A46", "#F5F0E0"],
    ["#5A6E2C", "#EDE4C0"],
    ["#4A5C24", "#E8DCA8"],
  ];
  const [bg, text] = colors[name.length % colors.length];
  const initial = name.charAt(0);
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${bg}"/><stop offset="100%" style="stop-color:${text}"/></linearGradient></defs><rect fill="url(#g)" width="${size}" height="${size}" rx="${
      size / 8
    }"/><text x="${size / 2}" y="${
      size / 2 + size / 8
    }" text-anchor="middle" fill="white" font-size="${
      size / 2.5
    }" font-family="sans-serif" font-weight="bold">${initial}</text></svg>`
  )}`;
}

export default function MemberDetailPage() {
  const params = useParams();
  const { t, locale } = useI18n();
  const localeKey = locale as "zh" | "ja" | "en";

  const slug = params.slug as string;
  const memberId = params.memberId as string;
  const band = bands.find((b) => b.slug === slug);
  const member = band?.members.find((m) => m.id === memberId);

  if (!band || !member) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Not Found</h1>
        <p className="text-neutral-500">Member not found.</p>
      </div>
    );
  }

  const formatBirthday = (dateStr: string) => {
    const d = new Date(dateStr);
    const age = new Date().getFullYear() - d.getFullYear();
    return `${d.toLocaleDateString(
      localeKey === "ja" ? "ja-JP" : localeKey === "zh" ? "zh-CN" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    )} (${age}${localeKey === "zh" ? "岁" : localeKey === "ja" ? "歳" : "yo"})`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back Button */}
      <Link
        href={`/${locale}/bands/${slug}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-[#6F8436] hover:underline mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t("member.backToBand")} - {band.name[localeKey]}
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-8 mb-10">
        {/* Member Image */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[#E5D89E]/30 to-[#6F8436]/20 flex-shrink-0 shadow-lg">
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name[localeKey]}
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.src = avatarPlaceholder(member.name[localeKey], 200);
                el.onerror = null;
              }}
            />
          ) : (
            <img
              src={avatarPlaceholder(member.name[localeKey], 200)}
              alt={member.name[localeKey]}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-1">
            {member.name[localeKey]}
          </h1>
          <p className="text-[15px] text-[#6F8436] font-medium mb-4">
            {member.role[localeKey]} · {band.name[localeKey]}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-neutral-200/60">
              <Calendar className="w-4 h-4 text-[#6F8436] flex-shrink-0" />
              <div>
                <p className="text-[11px] text-neutral-400">
                  {t("member.birthday")}
                </p>
                <p className="text-[13px] font-medium text-neutral-800">
                  {formatBirthday(member.birthday)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-neutral-200/60">
              <MapPin className="w-4 h-4 text-[#6F8436] flex-shrink-0" />
              <div>
                <p className="text-[11px] text-neutral-400">
                  {t("member.birthplace")}
                </p>
                <p className="text-[13px] font-medium text-neutral-800">
                  {member.birthplace[localeKey]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-neutral-200/60">
              <Droplet className="w-4 h-4 text-[#6F8436] flex-shrink-0" />
              <div>
                <p className="text-[11px] text-neutral-400">
                  {t("member.bloodType")}
                </p>
                <p className="text-[13px] font-medium text-neutral-800">
                  {member.bloodType}型
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-neutral-200/60">
              <Ruler className="w-4 h-4 text-[#6F8436] flex-shrink-0" />
              <div>
                <p className="text-[11px] text-neutral-400">
                  {t("member.height")}
                </p>
                <p className="text-[13px] font-medium text-neutral-800">
                  {member.height}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Story */}
      <section className="mb-10">
        <h2 className="text-[13px] font-medium text-neutral-400 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Music className="w-4 h-4 text-[#6F8436]" />
          {t("member.joinStory")}
        </h2>
        <div className="p-6 rounded-xl bg-white border border-neutral-200/60">
          <p className="text-[15px] text-neutral-700 leading-relaxed">
            {member.joinStory[localeKey]}
          </p>
        </div>
      </section>

      {/* Social Media */}
      <section className="mb-10">
        <h2 className="text-[13px] font-medium text-neutral-400 uppercase tracking-wide mb-4">
          {t("member.socialMedia")}
        </h2>
        <div className="flex flex-wrap gap-3">
          {member.twitterHandle && (
            <a
              href={`https://x.com/${member.twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-black text-white text-[13px] font-medium hover:opacity-80 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              X (Twitter)
            </a>
          )}
          {member.instagramHandle && (
            <a
              href={`https://instagram.com/${member.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[13px] font-medium hover:opacity-80 transition-opacity"
            >
              <Camera className="w-4 h-4" />
              Instagram
            </a>
          )}
          {member.tiktokHandle && (
            <a
              href={`https://tiktok.com/@${member.tiktokHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-800 text-white text-[13px] font-medium hover:opacity-80 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
              TikTok
            </a>
          )}
          {member.youtubeChannel && (
            <a
              href={`https://youtube.com/${member.youtubeChannel}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600 text-white text-[13px] font-medium hover:opacity-80 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </a>
          )}
        </div>
      </section>

      {/* Related Social Posts */}
      {band.socialPosts.filter(
        (p) =>
          p.author === member.name.ja ||
          p.author === member.name.en ||
          p.author === member.name.zh
      ).length > 0 && (
        <section>
          <h2 className="text-[13px] font-medium text-neutral-400 uppercase tracking-wide mb-4">
            {t("bands.memberSocial")}
          </h2>
          <div className="space-y-3">
            {band.socialPosts
              .filter(
                (p) =>
                  p.author === member.name.ja ||
                  p.author === member.name.en ||
                  p.author === member.name.zh
              )
              .map((post) => (
                <a
                  key={post.id}
                  href={post.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl border border-neutral-200/60 bg-white hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        post.platform === "x"
                          ? "bg-black text-white"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      }`}
                    >
                      {post.platform === "x" ? "X" : "IG"}
                    </span>
                    <span className="text-[12px] text-neutral-400">
                      {post.date}
                    </span>
                  </div>
                  <p className="text-[14px] text-neutral-800 leading-relaxed mb-3">
                    {post.content[localeKey]}
                  </p>
                  {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {post.images.map((img, i) => (
                        <div
                          key={i}
                          className="w-full h-40 bg-gradient-to-br from-[#E5D89E]/20 to-[#6F8436]/10 rounded-lg overflow-hidden"
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const el = e.target as HTMLImageElement;
                              el.style.display = "none";
                              if (el.parentElement) {
                                el.parentElement.classList.add(
                                  "flex",
                                  "items-center",
                                  "justify-center"
                                );
                                el.parentElement.innerHTML =
                                  '<span class="text-2xl">📷</span>';
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </a>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
