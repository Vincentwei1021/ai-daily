import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import FeedbackWidget from "@/components/FeedbackWidget";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-heading", weight: ["400","500","600","700","800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-daily.vercel.app";

export const metadata: Metadata = {
  title: { default: "AI 日报 — 每日 AI 行业情报与趋势", template: "%s | AI 日报" },
  description: "每日精选 AI 行业情报，追踪 X/Twitter 上的 AI agent 趋势、新工具发现、高互动信号。中文 AI 情报日报。",
  keywords: ["AI日报", "AI情报", "AI agent趋势", "AI新闻", "每日AI", "人工智能日报", "AI行业动态"],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI 日报 — 每日 AI 行业情报 📰",
    description: "追踪 AI agent 趋势、新工具发现、高互动信号。每日更新。",
    url: siteUrl, siteName: "AI 日报", type: "website", locale: "zh_CN",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AI 日报" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5881105388002876" crossOrigin="anonymous" strategy="afterInteractive" />
      </head>
      <body className={`${jakarta.variable} ${inter.variable} font-sans antialiased`}>
        {children}
        <FeedbackWidget />
      </body>
    </html>
  );
}
