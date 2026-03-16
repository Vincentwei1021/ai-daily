import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { reports } from "@/data/reports";

const siteUrl = "https://ai-daily.vercel.app";

const schema = {
  "@context": "https://schema.org", "@type": "WebSite",
  name: "AI 日报", url: siteUrl,
  description: "每日精选 AI 行业情报，追踪 AI agent 趋势、新工具发现、高互动信号。",
  inLanguage: "zh-CN",
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="px-4 pt-10 pb-6 sm:px-6 sm:pt-16 sm:pb-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              📰 AI 日报
            </h1>
            <p className="mt-2 text-lg text-ink-500">
              每日精选 AI 行业情报 · 追踪趋势 · 发现机会
            </p>
            <p className="mt-1 text-sm text-ink-400">
              从 X/Twitter 提取 AI agent 趋势、新工具发现、高互动信号，中文解读。
            </p>
          </div>
        </section>

        {/* Report List */}
        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {reports.map((report) => (
              <article key={report.date} className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <time className="rounded-lg bg-ink-900 px-3 py-1 text-sm font-bold text-white">{report.date}</time>
                  <span className="text-sm text-ink-400">{report.weekday}</span>
                </div>
                {report.summary && (
                  <p className="text-ink-700 leading-relaxed mb-4">{report.summary}</p>
                )}

                {/* Discoveries preview */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-accent-600 mb-2">🆕 新发现</h3>
                  <ul className="space-y-1">
                    {report.discoveries.slice(0, 3).map((d, i) => (
                      <li key={i} className="text-sm text-ink-700">
                        <span className="font-semibold">{d.title}</span>
                        {d.sources && <span className="text-ink-400 ml-1">({d.sources.join(", ")})</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Signals preview */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-red-500 mb-2">🔥 高互动信号</h3>
                  <ul className="space-y-1">
                    {report.signals.slice(0, 2).map((s, i) => (
                      <li key={i} className="text-sm text-ink-600">
                        <span className="font-mono text-blue-500">{s.author}</span>
                        <span className="ml-1">{s.content.slice(0, 50)}...</span>
                        <span className="ml-1 text-red-500 font-semibold">{s.likes.toLocaleString()}❤️</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={`/${report.date}`} className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
                  阅读完整日报 →
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* SEO About */}
        <section className="px-4 py-12 sm:px-6 bg-ink-50">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">关于 AI 日报</h2>
            <div className="space-y-3 text-ink-600 leading-relaxed">
              <p><strong className="text-ink-900">AI 日报</strong>是一份每日更新的 AI 行业情报简报。我们从 X/Twitter、Reddit、Hacker News 等平台提取最具价值的 AI 行业信号，包括新工具发现、高互动帖子、付费需求信号和行业趋势变化。</p>
              <p>与其他 AI 新闻站不同，AI 日报聚焦于<strong className="text-ink-900">可行动的情报</strong>——不只是告诉你发生了什么，更关注这意味着什么机会。每条信号都附有中文解读和商业洞察。</p>
              <p>目标读者：AI 创业者、独立开发者、产品经理、投资人，以及所有关注 AI agent 生态发展的人。</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
