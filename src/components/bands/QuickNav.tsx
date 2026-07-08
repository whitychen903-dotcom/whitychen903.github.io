"use client";

import { useTranslations } from "next-intl";
import type { Band } from "@/data/bands";

interface QuickNavProps {
  items: {
    id: string;
    label: string;
    icon: string;
    show: boolean;
  }[];
}

export default function QuickNav({ items }: QuickNavProps) {
  const t = useTranslations("bands");
  const visibleItems = items.filter((item) => item.show);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (visibleItems.length === 0) return null;

  return (
    <div className="sticky top-20 z-30">
      <div className="rounded-2xl bg-jpop-glass/90 backdrop-blur-2xl border border-white/60 p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-jpop-muted uppercase tracking-wide">{t("quickNav")}</h3>
        <nav className="space-y-1">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-jpop-text hover:bg-white/50 transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
