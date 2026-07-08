"use client";

import Navbar from "@/components/layout/Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-12">{children}</main>
      <footer className="border-t border-neutral-200/60 bg-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-[12px] text-neutral-400 text-center">
            J-Pop Hub © 2026 — Made for J-Pop fans worldwide
          </p>
        </div>
      </footer>
    </>
  );
}
