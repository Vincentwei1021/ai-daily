import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { reports, getReportByDate, getAllDates } from "@/data/reports";

interface PageProps { params: Promise<{ date: string }> }

export function generateStaticParams() {
  return getAllDates().map(date => ({ date }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  const report = getReportByDate(date);
  if (!report) return { title: "未找到" };
  const topicNames = report.topics.map(t => t.title.replace(/^[^\s]+\s/, "")).join("、");
  return {
    title: `${date} ${report.weekday} — ${report.tweetCount} 条 AI 推文`,
    description: `${date} X/Twitter AI 动态：${topicNames}。${report.tweetCount} 条推文 / ${report.userCount} 位用户。`,
    alternates: { canonical: `/${date}` },
  };
}

export default async function ReportPage({ params }: PageProps) {
  const { date } = await params;
  const report = getReportByDate(date);
  if (!report) notFound();

  const dateIdx = reports.findIndex(r => r.date === date);
  const prev = dateIdx < reports.length - 1 ? reports[dateIdx + 1] : null;
  const next = dateIdx > 0 ? reports[dateIdx - 1] : null;

  const articleSchema = {
    "@context": "https://schema.org", "@type": "NewsArticle",
    headline: `${report.date} AI 日报 — X/Twitter AI 动态`,
    datePublished: report.date,
    description: `${report.tweetCount} 条 AI 推文 / ${report.userCount} 位用户的 X/Twitter 动态摘要`,
    publisher: { "@type": "Organization", name: "AI 日报" },
    inLanguage: "zh-CN",
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <article className="px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-4xl">
            <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 block">← 返回日报列表</Link>

            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <time className="rounded-lg bg-ink-900 px-3 py-1.5 text-sm font-bold text-white">{report.date}</time>
                <span className="text-ink-400">{report.weekday}</span>
                <span className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-600">{report.tweetCount} 条推文</span>
                <span className="rounded-full bg-purple-50 px-3 py-0.5 text-xs font-medium text-purple-600">{report.userCount} 位用户</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                {report.date} AI 日报
              </h1>
              <p className="mt-2 text-sm text-ink-400">时间范围：{report.timeRange}</p>
            </div>

            {/* Topics */}
            <div className="space-y-8">
              {report.topics.map((topic, ti) => (
                <section key={ti}>
                  <h2 className="text-xl font-bold text-ink-900 mb-4">{topic.title}</h2>
                  <div className="space-y-4">
                    {topic.items.map((item, ii) => (
                      <div key={ii} className="rounded-xl border border-ink-200 bg-white p-5">
                        <h3 className="text-base font-bold text-ink-900 mb-2">{item.bold}</h3>
                        <p className="text-sm text-ink-700 leading-relaxed">{item.detail}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <nav className="flex justify-between items-center border-t border-ink-200 pt-6 mt-10">
              {prev ? (
                <Link href={`/${prev.date}`} className="text-sm text-blue-600 hover:underline">← {prev.date} {prev.weekday}</Link>
              ) : <span />}
              {next ? (
                <Link href={`/${next.date}`} className="text-sm text-blue-600 hover:underline">{next.date} {next.weekday} →</Link>
              ) : <span />}
            </nav>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </>
  );
}
