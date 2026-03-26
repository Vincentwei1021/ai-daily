import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "隐私政策 | AI 日报" };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="page animate-fade-in legal-page">
        <h1>隐私政策</h1>
        <span className="legal-date">更新日期：2026年3月16日</span>
        <h2>数据收集</h2>
        <p>AI 日报是静态网站，不收集任何个人信息。本站不使用追踪 cookie，不要求注册账号。</p>
        <h2>广告</h2>
        <p>本站通过 Google AdSense 展示广告。AdSense 可能使用 cookie 提供个性化广告。您可在 <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google 广告设置</a> 中选择退出。</p>
        <h2>联系</h2>
        <p>如有疑问：<a href="mailto:privacy@toolboxlite.com">privacy@toolboxlite.com</a></p>
        <Footer />
      </main>
    </>
  );
}
