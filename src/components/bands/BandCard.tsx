"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { useI18n } from "@/components/layout/I18nProvider";
import type { Band } from "@/data/bands";

function bandPlaceholder(name: string) {
  const colors = [
    ["#6F8436", "#E5D89E"],
    ["#38460C", "#D4C87A"],
  ];
  const [bg, text] = colors[name.length % colors.length];
  const initial = name.charAt(0);
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${bg}"/><stop offset="100%" style="stop-color:${text}"/></linearGradient></defs><rect fill="url(#g)" width="400" height="250"/><text x="200" y="140" text-anchor="middle" fill="white" font-size="80" font-family="sans-serif" font-weight="bold">${initial}</text></svg>`
  )}`;
}

export default function BandCard({ band }: { band: Band }) {
  const { locale } = useI18n();
  const loc = locale as "zh" | "ja" | "en";

  return (
    <Card href={`/${locale}/bands/${band.slug}`}>
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#E5D89E]/20 to-[#6F8436]/10">
        {band.imageUrl ? (
          <img
            src={band.imageUrl}
            alt={band.name[loc]}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.src = bandPlaceholder(band.name[loc]);
              el.onerror = null;
            }}
          />
        ) : (
          <img
            src={bandPlaceholder(band.name[loc])}
            alt={band.name[loc]}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
      </div>
      <CardContent>
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
            {band.name[loc]}
          </h3>
          {band.billboardRank && (
            <span className="flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-[#EDBC13]/20 text-[#6F8436] font-bold">
              #{band.billboardRank}
            </span>
          )}
        </div>
        <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
          {band.description[loc]}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5D89E]/30 text-[#38460C] font-medium truncate">
            {band.genre}
          </span>
          {band.tours.filter((t) => t.status === "upcoming" || t.status === "ongoing").length > 0 && (
            <span className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-[#EDBC13]/20 text-[#6F8436] font-medium">
              ● Tour
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
