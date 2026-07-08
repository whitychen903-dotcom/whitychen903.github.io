"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/layout/I18nProvider";
import { useState, useEffect } from "react";
import { BookmarkCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedEvent {
  id: string;
  eventId: string;
  eventType: string;
  title: string;
  artist: string;
  date: string | null;
  createdAt: string;
}

export default function MyEventsPage() {
  const { locale } = useI18n();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<SavedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    fetch("/api/saved-events")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, status, router, locale]);

  const removeEvent = async (eventId: string) => {
    await fetch("/api/saved-events", {
      method: "DELETE",
      body: JSON.stringify({ eventId }),
    });
    setEvents((prev) => prev.filter((e) => e.eventId !== eventId));
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-neutral-400 text-[14px]">Loading...</p>
      </div>
    );
  }

  const label = {
    zh: "我的想看",
    ja: "見たいリスト",
    en: "My List",
  } as Record<string, string>;

  const emptyLabel = {
    zh: "你还没有收藏任何巡演。去乐队页面看看有没有想去的演出吧！",
    ja: "まだツアーを保存していません。バンドページで気になる公演を見つけましょう！",
    en: "You haven't saved any events yet. Check out the bands page to find shows you want to attend!",
  } as Record<string, string>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        <BookmarkCheck className="w-6 h-6 inline-block mr-2 text-[#EDBC13]" />
        {label[locale] || label.zh}
      </h1>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-400 text-[15px]">
            {emptyLabel[locale] || emptyLabel.zh}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white border border-neutral-200/60"
            >
              <div>
                <p className="text-[15px] font-medium text-neutral-900">
                  {event.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full font-medium",
                    event.eventType === "tour" ? "bg-[#EDBC13]/20 text-[#6F8436]" : "bg-neutral-100 text-neutral-500"
                  )}>
                    {event.eventType === "tour" ? "Tour" : event.eventType}
                  </span>
                  {event.date && (
                    <span className="text-[12px] text-neutral-400">{event.date}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeEvent(event.eventId)}
                className="p-2 rounded-full text-neutral-300 hover:text-red-400 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
