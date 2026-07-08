"use client";

import { useI18n } from "@/components/layout/I18nProvider";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { TourDate } from "@/data/bands";
import { useState, useEffect, useCallback } from "react";
import { Bookmark, BookmarkCheck, Ticket, ExternalLink, Clock, CheckCircle, AlertCircle, Users } from "lucide-react";

interface TourSectionProps {
  tours: TourDate[];
  artistName: string;
}

export default function TourSection({ tours, artistName }: TourSectionProps) {
  const { t, locale } = useI18n();
  const { data: session } = useSession();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/saved-events")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSavedIds(new Set(data.map((e: { eventId: string }) => e.eventId)));
        }
      })
      .catch(() => {});
  }, [session]);

  const toggleSave = useCallback(
    async (tour: TourDate) => {
      if (!session) return;
      const eventId = `tour-${tour.date}-${tour.venue.ja}`;
      setLoading(eventId);

      try {
        if (savedIds.has(eventId)) {
          await fetch("/api/saved-events", {
            method: "DELETE",
            body: JSON.stringify({ eventId }),
          });
          setSavedIds((prev) => {
            const next = new Set(prev);
            next.delete(eventId);
            return next;
          });
        } else {
          await fetch("/api/saved-events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId,
              eventType: "tour",
              title: `${artistName} - ${tour.venue[locale as "zh" | "ja" | "en"]} - ${tour.date}`,
              artist: artistName,
              date: tour.date,
            }),
          });
          setSavedIds((prev) => new Set(prev).add(eventId));
        }
      } catch {
        // ignore
      } finally {
        setLoading(null);
      }
    },
    [savedIds, session, artistName, locale]
  );

  if (tours.length === 0) {
    return (
      <p className="text-neutral-400 text-[14px] py-8 text-center">{t("bands.noTours")}</p>
    );
  }

  const statusLabel = (status: TourDate["status"]) => {
    const map: Record<string, Record<string, string>> = {
      upcoming: { zh: "即将开始", ja: "近日開催", en: "Upcoming" },
      ongoing: { zh: "进行中", ja: "開催中", en: "Ongoing" },
      completed: { zh: "已结束", ja: "終了", en: "Completed" },
    };
    return map[status]?.[locale] || status;
  };

  const statusColor = (status: TourDate["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-[#EDBC13]/20 text-[#6F8436]";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-neutral-100 text-neutral-400";
    }
  };

  const ticketSaleStatusLabel = (status: string) => {
    const map: Record<string, Record<string, { label: string; color: string; icon: React.ReactNode }>> = {
      not_started: {
        zh: { label: "未开售", color: "bg-neutral-100 text-neutral-500", icon: <Clock className="w-3 h-3" /> },
        ja: { label: "販売前", color: "bg-neutral-100 text-neutral-500", icon: <Clock className="w-3 h-3" /> },
        en: { label: "Not on Sale", color: "bg-neutral-100 text-neutral-500", icon: <Clock className="w-3 h-3" /> },
      },
      lottery_open: {
        zh: { label: "抽签进行中", color: "bg-blue-100 text-blue-700", icon: <Users className="w-3 h-3" /> },
        ja: { label: "抽選受付中", color: "bg-blue-100 text-blue-700", icon: <Users className="w-3 h-3" /> },
        en: { label: "Lottery Open", color: "bg-blue-100 text-blue-700", icon: <Users className="w-3 h-3" /> },
      },
      lottery_closed: {
        zh: { label: "抽签已结束", color: "bg-orange-100 text-orange-700", icon: <AlertCircle className="w-3 h-3" /> },
        ja: { label: "抽選終了", color: "bg-orange-100 text-orange-700", icon: <AlertCircle className="w-3 h-3" /> },
        en: { label: "Lottery Closed", color: "bg-orange-100 text-orange-700", icon: <AlertCircle className="w-3 h-3" /> },
      },
      general_sale: {
        zh: { label: "一般発売中", color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3 h-3" /> },
        ja: { label: "一般発売中", color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3 h-3" /> },
        en: { label: "On Sale", color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3 h-3" /> },
      },
      sold_out: {
        zh: { label: "售罄", color: "bg-red-100 text-red-600", icon: <AlertCircle className="w-3 h-3" /> },
        ja: { label: "完売", color: "bg-red-100 text-red-600", icon: <AlertCircle className="w-3 h-3" /> },
        en: { label: "Sold Out", color: "bg-red-100 text-red-600", icon: <AlertCircle className="w-3 h-3" /> },
      },
      ended: {
        zh: { label: "已结束", color: "bg-neutral-100 text-neutral-400", icon: <Clock className="w-3 h-3" /> },
        ja: { label: "終了", color: "bg-neutral-100 text-neutral-400", icon: <Clock className="w-3 h-3" /> },
        en: { label: "Ended", color: "bg-neutral-100 text-neutral-400", icon: <Clock className="w-3 h-3" /> },
      },
    };
    return map[status]?.[locale] || { label: status, color: "bg-neutral-100 text-neutral-500", icon: <Clock className="w-3 h-3" /> };
  };

  const loc = locale as "zh" | "ja" | "en";

  return (
    <div className="space-y-3">
      {tours.map((tour, i) => {
        const eventId = `tour-${tour.date}-${tour.venue.ja}`;
        const isSaved = savedIds.has(eventId);

        return (
          <div
            key={i}
            className="p-4 rounded-xl border border-neutral-200/60 bg-white hover:border-neutral-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium", statusColor(tour.status))}>
                    {statusLabel(tour.status)}
                  </span>
                  <span className="text-[13px] text-neutral-500">{tour.date}</span>
                </div>
                {tour.tourName && (
                  <p className="text-[12px] text-[#6F8436] font-medium mb-1">{tour.tourName}</p>
                )}
                <p className="text-[15px] font-medium text-neutral-900 truncate">
                  {tour.venue[loc]}
                </p>
                <p className="text-[13px] text-neutral-400">{tour.location[loc]}</p>

                {/* Ticket Sale Status */}
                {tour.ticketSale && (
                  <div className="mt-2 pt-2 border-t border-neutral-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-neutral-400 flex-shrink-0">
                        {t("bands.ticketSaleStatus")}:
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium",
                          ticketSaleStatusLabel(tour.ticketSale.status).color
                        )}
                      >
                        {ticketSaleStatusLabel(tour.ticketSale.status).icon}
                        {ticketSaleStatusLabel(tour.ticketSale.status).label}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {tour.ticketSale.phase[loc]}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-300 mt-0.5">
                      {tour.ticketSale.period}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Buy Tickets Button */}
                {tour.ticketUrl && tour.status !== "completed" && (
                  <a
                    href={tour.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6F8436] text-white text-[12px] font-medium hover:bg-[#38460C] transition-colors"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t("bands.buyTickets")}</span>
                  </a>
                )}

                {/* Save Button */}
                {session && (
                  <button
                    onClick={() => toggleSave(tour)}
                    disabled={loading === eventId}
                    className={cn(
                      "ml-1 p-2 rounded-full transition-colors flex-shrink-0",
                      isSaved
                        ? "text-[#EDBC13] hover:bg-[#EDBC13]/10"
                        : "text-neutral-300 hover:text-[#EDBC13] hover:bg-neutral-100"
                    )}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
