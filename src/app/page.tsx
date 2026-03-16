import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { reports } from "@/data/reports";

const siteUrl = "https://ai-daily-eight-mu.vercel.app";

const schema = {
  "@context": "https://schema.org", "@type": "WebSite",
  name: "AI 日报", url: siteUrl,
  description: "每日精选 X/Twitter AI 行业动态，追踪 AI agent 趋势、模型更新、开源进展。",
  inLanguage: "zh-CN",
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="px-4 pt-10 pb-6 sm:px-6 sm:pt-16 sm:pb-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">📰 AI 日报</h1>
            <p className="mt-2 text-lg text-ink-500">每日精选 X/Twitter AI 行业动态 · 按话题聚合 · 中文解读</p>
            <p className="mt-1 text-sm text-ink-400">数据来源：Vincent 关注的 X 账号过去 24 小时 AI 相关推文摘要</p>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-4xl space-y-8">
            {reports.map((report) => (
              <article key={report.date} className="rounded-2xl border border-ink-200 bg-white shadow-sm overflow-hidden">
                {/* Date header */}
                <div className="flex items-center gap-3 px-6 py-4 bg-ink-50 border-b border-ink-200">
                  <time className="rounded-lg bg-ink-900 px-3 py-1 text-sm font-bold text-white">{report.date}</time>
                  <span className="text-sm text-ink-400">{report.weekday}</span>
                  <span className="ml-auto text-xs text-ink-400">{report.tweetCount} 条推文 / {report.userCount} 位用户</span>
                </div>

                {/* Topics preview (first 2) */}
                <div className="px-6 py-4 space-y-4">
                  {report.topics.slice(0, 2).map((topic, i) => (
                    <div key={i}>
                      <h3 className="text-sm font-bold text-ink-700 mb-2">{topic.title}</h3>
                      <ul className="space-y-1">
                        {topic.items.slice(0, 2).map((item, j) => (
                          <li key={j} className="text-sm text-ink-600">
                            <span className="font-semibold text-ink-800">{item.bold}</span>
                            <span className="text-ink-400"> — {item.detail.slice(0, 60)}...</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {report.topics.length > 2 && (
                    <p className="text-xs text-ink-400">还有 {report.topics.length - 2} 个话题...</p>
                  )}
                </div>

                <div className="px-6 py-3 border-t border-ink-100">
                  <Link href={`/${report.date}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">阅读完整日报 →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 bg-ink-50">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">关于 AI 日报</h2>
            <div className="space-y-3 text-ink-600 leading-relaxed">
              <p><strong className="text-ink-900">AI 日报</strong>每天从 Vincent 关注的 X/Twitter 账号中提取 AI 行业动态，按话题聚合成易于消化的中文摘要。内容覆盖大模型更新、AI agent 架构、开源项目、研究突破、产品发布等维度。</p>
              <p>与传统 AI 新闻不同，AI 日报关注的是<strong className="text-ink-900">一线从业者的真实讨论</strong>——不是新闻稿，而是 Twitter 上正在发生的对话。每个话题附带标签，方便追踪特定领域。</p>
              <p>数据由 Haru（OpenClaw 运营 agent）每日 01:00 UTC 自动抓取，人工筛选后发布。目标读者：AI 创业者、独立开发者、产品经理、投资人。</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
