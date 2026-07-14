"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/components/layout/I18nProvider";
import { bands } from "@/data/bands";
import TourSection from "@/components/bands/TourSection";
import FeedSection from "@/components/bands/FeedSection";
import FanBuzzSection from "@/components/bands/FanBuzzSection";
import { ExternalLink, Music, Calendar, Play, Quote, TrendingUp, Star, Hash } from "lucide-react";

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

// Section IDs for scroll spy
interface SectionItem {
  id: string;
  labelKey?: string;
  label?: { zh: string; ja: string; en: string };
  icon: string;
}

const SECTIONS: SectionItem[] = [
  { id: "members", labelKey: "bands.members", icon: "👥" },
  { id: "tours", labelKey: "bands.tourInfo", icon: "🎫" },
  { id: "social-feeds", labelKey: "bands.latestNews", icon: "📢" },
  { id: "fan-buzz", labelKey: "bands.fanBuzz", icon: "💬" },
  { id: "latest-songs", labelKey: "bands.latestAlbums", icon: "🎵" },
  { id: "representative-works", label: { zh: "经典作品", ja: "代表作品", en: "Classic Works" }, icon: "⭐" },
];

export default function BandDetailPage() {
  const params = useParams();
  const { t, locale } = useI18n();
  const [activeSection, setActiveSection] = useState("members");

  const slug = params.slug as string;
  const band = bands.find((b) => b.slug === slug);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const offsets = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return { id: s.id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id: s.id, top: rect.top };
      });

      // Find the section closest to the top of the viewport (within 200px)
      let current = SECTIONS[0].id;
      for (let i = offsets.length - 1; i >= 0; i--) {
        if (offsets[i].top <= 200) {
          current = offsets[i].id;
          break;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!band) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Not Found</h1>
        <p className="text-neutral-500">The band you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const localeKey = locale as "zh" | "ja" | "en";

  // Background: album collage
  const hasBg = band.background && band.background.albumCovers.length > 0;

  const getSectionLabel = (section: SectionItem) => {
    if (section.labelKey) {
      return t(section.labelKey);
    }
    return section.label?.[localeKey] || section.id;
  };

  return (
    <div className="relative">
      {/* Album Background */}
      {hasBg && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {band.background!.albumCovers.map((cover, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${(i % 3) * 33.33}%`,
                top: `${Math.floor(i / 3) * 33.33}%`,
                width: "33.33%",
                height: "33.33%",
                opacity: 0.5,
              }}
            >
              <img
                src={cover}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ))}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.75) 40%, rgba(255,255,255,0.80) 70%, rgba(255,255,255,0.88) 100%)",
            }}
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-10">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-[#E5D89E]/30 to-[#6F8436]/20 flex-shrink-0 shadow-lg">
            {band.imageUrl ? (
              <img
                src={band.imageUrl}
                alt={band.name[localeKey]}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.src = avatarPlaceholder(band.name[localeKey], 200);
                  el.onerror = null;
                }}
              />
            ) : (
              <img
                src={avatarPlaceholder(band.name[localeKey], 200)}
                alt={band.name[localeKey]}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
              {band.name[localeKey]}
            </h1>
            <span className="inline-block text-[12px] px-2.5 py-0.5 rounded-full bg-[#E5D89E]/30 text-[#38460C] font-medium mb-3">
              {band.genre}
            </span>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4 max-w-2xl">
              {band.description[localeKey]}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={band.officialSite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] text-[#6F8436] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t("bands.officialSite")}
              </a>
              <a
                href={`https://x.com/${band.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-black transition-colors"
                title="X (Twitter)"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {band.instagramHandle && (
                <a
                  href={`https://instagram.com/${band.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-pink-500 transition-colors"
                  title="Instagram"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
              {band.tiktokHandle && (
                <a
                  href={`https://tiktok.com/@${band.tiktokHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-black transition-colors"
                  title="TikTok"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              )}
              {band.threadsHandle && (
                <a
                  href={`https://threads.net/@${band.threadsHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-neutral-800 transition-colors"
                  title="Threads"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.065V11.95c.028-3.521.878-6.375 2.527-8.486C5.843 1.18 8.624-.005 12.228 0h.008c3.581.024 6.334 1.205 8.184 3.509C22.076 5.569 22.926 8.424 22.954 11.945v.114c-.028 3.521-.878 6.375-2.527 8.486-1.843 2.274-4.624 3.46-8.228 3.455h-.013zm.036-1.867h.007c2.968-.02 5.265-.962 6.829-2.804 1.405-1.653 2.163-4.139 2.187-7.188v-.12c-.024-3.048-.782-5.534-2.187-7.187-1.564-1.842-3.861-2.784-6.829-2.804h-.008c-2.968.02-5.265.962-6.829 2.804-1.405 1.653-2.163 4.139-2.187 7.188v.12c.024 3.048.782 5.534 2.187 7.187 1.564 1.842 3.861 2.784 6.829 2.804zm2.69-14.628c.476.003.949.027 1.419.07.365.034.669.065.92.095l.004 1.684a13.225 13.225 0 0 0-.765-.08c-1.551-.126-2.73.386-3.51 1.521-.78 1.135-.957 2.747-.934 4.34.02.543.07 1.081.16 1.605.248 1.468.864 2.56 1.77 3.127.838.523 1.826.661 2.797.39 1.011-.283 1.81-1.013 2.254-2.058.34-.803.452-1.706.422-2.573h-3.924V10.05h5.762c.07.498.105.996.105 1.494 0 1.946-.474 3.62-1.43 5.007-.956 1.387-2.38 2.222-4.204 2.392-.416.04-.833.06-1.25.06-2.02 0-3.743-.662-5.077-1.988-1.334-1.326-2.035-3.104-2.035-5.074 0-2.102.745-3.919 2.215-5.211 1.468-1.288 3.384-1.962 5.42-1.912z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Members */}
        <section id="members" className="mb-10 scroll-mt-24">
          <h3 className="text-[13px] font-medium text-neutral-400 uppercase tracking-wide mb-4">
            {t("bands.members")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {band.members.map((member) => (
              <Link
                key={member.id}
                href={`/${locale}/bands/${slug}/${member.id}`}
                className="group p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-neutral-200/60 hover:border-[#6F8436]/40 hover:shadow-md transition-all duration-200"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#E5D89E]/30 to-[#6F8436]/20 mx-auto mb-3 ring-2 ring-transparent group-hover:ring-[#E5D89E]/50 transition-all">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name[localeKey]}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.src = avatarPlaceholder(member.name[localeKey], 100);
                        el.onerror = null;
                      }}
                    />
                  ) : (
                    <img
                      src={avatarPlaceholder(member.name[localeKey], 100)}
                      alt={member.name[localeKey]}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="text-[14px] font-medium text-neutral-900 text-center group-hover:text-[#38460C] transition-colors">
                  {member.name[localeKey]}
                </p>
                <p className="text-[12px] text-neutral-400 text-center mt-0.5">
                  {member.role[localeKey]}
                </p>
                <p className="text-[11px] text-[#6F8436] text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t("bands.memberDetail")} →
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Tours */}
        <section id="tours" className="mb-10 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[#6F8436]" />
            <h3 className="text-[13px] font-medium text-neutral-400 uppercase tracking-wide">
              {t("bands.tourInfo")}
            </h3>
          </div>
          <TourSection tours={band.tours} artistName={band.name[localeKey]} artistSlug={band.slug} />
        </section>

        {/* Social Feeds */}
        <section id="social-feeds" className="mb-10 scroll-mt-24">
          <h3 className="text-[13px] font-medium text-neutral-400 uppercase tracking-wide mb-4">
            {t("bands.latestNews")}
          </h3>
          <FeedSection
            twitterHandle={band.twitterHandle}
            bandId={band.id}
            socialPosts={band.socialPosts}
          />
        </section>

        {/* Fan Buzz */}
        <section id="fan-buzz" className="mb-10 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#6F8436]" />
            <h3 className="text-[13px] font-medium text-neutral-400 uppercase tracking-wide">
              {t("bands.fanBuzz")}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-500 font-medium">
              {t("bands.hotDiscussion")}
            </span>
          </div>
          <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-neutral-200/60">
            <FanBuzzSection fanBuzzes={band.fanBuzzes} />
          </div>
        </section>

        {/* Latest Songs */}
        {band.albums.length > 0 && (
          <section id="latest-songs" className="mb-10 scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-4 h-4 text-[#6F8436]" />
              <h3 className="text-[13px] font-medium text-neutral-400 uppercase tracking-wide">
                {t("bands.latestAlbums")}
              </h3>
            </div>
            <div className="space-y-4">
              {band.albums.map((song, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/80 backdrop-blur-sm border border-neutral-200/60 overflow-hidden"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[16px] font-semibold text-neutral-900">
                            {song.title}
                          </h4>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E5D89E]/30 text-[#38460C] font-medium">
                            {song.type === "album"
                              ? localeKey === "zh"
                                ? "专辑"
                                : localeKey === "ja"
                                ? "アルバム"
                                : "Album"
                              : song.type === "single"
                              ? localeKey === "zh"
                                ? "单曲"
                                : localeKey === "ja"
                                ? "シングル"
                                : "Single"
                              : "EP"}
                          </span>
                        </div>
                        <p className="text-[12px] text-neutral-400">{song.releaseDate}</p>
                      </div>
                      {song.previewUrl && (
                        <div className="flex items-center gap-1 text-[12px] text-[#6F8436] font-medium">
                          <Play className="w-3.5 h-3.5" />
                          {t("bands.listen")}
                        </div>
                      )}
                    </div>

                    {song.description && (
                      <p className="text-[13px] text-neutral-500 leading-relaxed mt-3 p-3 bg-[#F5F0E0]/30 rounded-lg">
                        <span className="text-[11px] text-neutral-400 uppercase tracking-wide mr-2">
                          {t("bands.songInfo")}:
                        </span>
                        {song.description[localeKey]}
                      </p>
                    )}

                    {song.previewUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden bg-black aspect-video relative">
                        <iframe
                          width="100%"
                          height="100%"
                          src={song.previewUrl}
                          title={song.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <p className="text-white/30 text-[11px] pointer-events-auto">
                            {localeKey === "zh" ? "如无法播放，请尝试使用VPN" : localeKey === "ja" ? "再生できない場合はVPNをお試しください" : "If unavailable, try using a VPN"}
                          </p>
                        </div>
                      </div>
                    )}

                    {song.highlights && song.highlights.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <Quote className="w-3 h-3" />
                          {t("bands.highlightLyrics")}
                        </h5>
                        <div className="space-y-1.5">
                          {song.highlights.map((hl, j) => (
                            <div
                              key={j}
                              className="flex flex-col sm:flex-row sm:gap-3"
                            >
                              <p className="text-[13px] text-neutral-800 font-medium sm:w-1/2 leading-relaxed">
                                {hl.ja}
                              </p>
                              <p className="text-[12px] text-neutral-400 sm:w-1/2 leading-relaxed">
                                {hl.zh}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Representative Works */}
        {band.representativeWorks.length > 0 && (
          <section id="representative-works" className="mb-10 scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-[#EDBC13]" />
              <h3 className="text-[13px] font-medium text-neutral-400 uppercase tracking-wide">
                {localeKey === "zh" ? "经典作品" : localeKey === "ja" ? "代表作品" : "Classic Works"}
              </h3>
            </div>
            <div className="space-y-4">
              {band.representativeWorks.map((work, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/80 backdrop-blur-sm border border-neutral-200/60 overflow-hidden"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-4 h-4 text-[#EDBC13]" />
                      <h4 className="text-[16px] font-semibold text-neutral-900">
                        {work.title}
                      </h4>
                    </div>
                    <p className="text-[13px] text-neutral-500 leading-relaxed mb-3 p-3 bg-[#F5F0E0]/30 rounded-lg">
                      {work.description[localeKey]}
                    </p>
                    <div className="rounded-lg overflow-hidden bg-black aspect-video relative">
                      <iframe
                        width="100%"
                        height="100%"
                        src={work.youtubeUrl}
                        title={work.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 right-2 pointer-events-none">
                        <p className="text-white/20 text-[10px] pointer-events-auto bg-black/40 px-1.5 py-0.5 rounded">
                          {localeKey === "zh" ? "如无法播放，请使用VPN" : localeKey === "ja" ? "VPNをお試しください" : "Use VPN if unavailable"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Side Scroll Spy Index */}
      <nav className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
        <div className="bg-white/90 backdrop-blur-md border border-neutral-200/60 rounded-xl p-3 shadow-sm">
          <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-3 px-1">
            {localeKey === "zh" ? "索引" : localeKey === "ja" ? "目次" : "Index"}
          </p>
          <ul className="space-y-1">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] transition-all ${
                    activeSection === section.id
                      ? "bg-[#E5D89E]/30 text-[#38460C] font-medium"
                      : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <span className="text-[14px]">{section.icon}</span>
                  <span>{getSectionLabel(section)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
