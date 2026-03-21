import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "使用条款 | AI 日报" };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-foreground">使用条款</h1>
          <p className="mt-2 text-sm text-muted-foreground">更新日期：2026年3月16日</p>
          <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">服务说明</h2>
            <p>AI 日报提供每日 AI 行业情报摘要，内容来源于公开社交媒体平台。所有内容仅供参考，不构成投资建议。</p>
            <h2 className="text-xl font-bold text-foreground">版权</h2>
            <p>引用的社交媒体内容版权归原作者所有。AI 日报的编辑内容版权归本站所有。</p>
            <h2 className="text-xl font-bold text-foreground">免责声明</h2>
            <p>本站内容按「现状」提供，不做任何保证。我们不对因使用本站内容做出的任何决策负责。</p>
            <h2 className="text-xl font-bold text-foreground">联系</h2>
            <p><a href="mailto:legal@toolboxlite.com" className="text-brand hover:text-brand/80 underline underline-offset-4">legal@toolboxlite.com</a></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
