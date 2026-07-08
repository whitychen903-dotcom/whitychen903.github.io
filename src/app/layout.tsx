import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "J-Pop Hub — 日本音乐信息中心",
  description: "一站式了解日本音乐的当下与未来。聚合乐队动态、巡演信息、音乐新闻。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className="h-full antialiased">
      <body className={`${geistSans.className} min-h-full flex flex-col bg-neutral-50`}>
        {children}
      </body>
    </html>
  );
}
