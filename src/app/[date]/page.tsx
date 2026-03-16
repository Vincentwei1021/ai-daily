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
  return {
    title: `${date} ${report.weekday} AI 情报`,
    description: report.summary || `${date} AI 行业日报：${report.discoveries.map(d => d.title).join("、")}`,
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
    headline: `${report.date} AI 日报`,
    datePublished: report.date,
    description: report.summary,
    publisher: { "@type": "Organization", name: "AI 日报" },
    inLanguage: "zh-CN",
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <article className="px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 block">← 返回日报列表</Link>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <time className="rounded-lg bg-ink-900 px-3 py-1.5 text-sm font-bold text-white">{report.date}</time>
                <span className="text-ink-400">{report.weekday}</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                {report.date} AI 日报
              </h1>
              {report.summary && (
                <p className="mt-3 text-lg text-ink-600 leading-relaxed">{report.summary}</p>
              )}
            </div>

            {/* Discoveries */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-ink-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🆕</span> 新发现
              </h2>
              <div className="space-y-4">
                {report.discoveries.map((d, i) => (
                  <div key={i} className="rounded-xl border border-ink-200 bg-ink-50 p-5">
                    <h3 className="text-base font-bold text-ink-900 mb-2">{d.title}</h3>
                    <p className="text-sm text-ink-700 leading-relaxed">{d.detail}</p>
                    {d.sources && d.sources.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {d.sources.map((s) => (
                          <span key={s} className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-600">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Signals */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-ink-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔥</span> 高互动信号
              </h2>
              <div className="space-y-4">
                {report.signals.map((s, i) => (
                  <div key={i} className="rounded-xl border border-ink-200 bg-white p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-bold text-blue-500">{s.author}</span>
                      <span className="text-sm font-semibold text-red-500">{s.likes.toLocaleString()} ❤️</span>
                    </div>
                    <blockquote className="text-ink-800 leading-relaxed mb-3 italic border-l-4 border-accent-500 pl-4">
                      &ldquo;{s.content}&rdquo;
                    </blockquote>
                    <p className="text-sm text-ink-600">
                      <span className="font-semibold text-accent-600">💡 洞察：</span>{s.insight}
                    </p>
                    {s.url && (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-blue-500 hover:underline">查看原帖 →</a>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Navigation */}
            <nav className="flex justify-between items-center border-t border-ink-200 pt-6">
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
