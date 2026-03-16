import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export const metadata: Metadata = { title: "隐私政策 | AI 日报" };
export default function PrivacyPage() {
  return (
    <><Header /><main className="px-4 py-12 sm:px-6 sm:py-16"><div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-ink-900">隐私政策</h1>
      <p className="mt-2 text-sm text-ink-400">更新日期：2026年3月16日</p>
      <div className="mt-8 space-y-6 text-ink-700 leading-relaxed">
        <h2 className="text-xl font-bold text-ink-900">数据收集</h2>
        <p>AI 日报是静态网站，不收集任何个人信息。本站不使用追踪 cookie，不要求注册账号。</p>
        <h2 className="text-xl font-bold text-ink-900">广告</h2>
        <p>本站通过 Google AdSense 展示广告。AdSense 可能使用 cookie 提供个性化广告。您可在 <a href="https://adssettings.google.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google 广告设置</a> 中选择退出。</p>
        <h2 className="text-xl font-bold text-ink-900">联系</h2>
        <p>如有疑问：<a href="mailto:privacy@toolboxlite.com" className="text-blue-600 hover:underline">privacy@toolboxlite.com</a></p>
      </div>
    </div></main><Footer /></>
  );
}
