import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { reports, getReportByDate, getAllDates } from "@/data/reports";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";

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

  const leadTopic = report.topics[0];
  const leadItem = leadTopic?.items[0];
  const remainingLeadItems = leadTopic ? leadTopic.items.slice(1) : [];
  const remainingTopics = report.topics.slice(1);

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
            <Link href="/" className="group/back mb-6 inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-brand/80">
              <ChevronLeft className="size-4 transition-transform group-hover/back:-translate-x-0.5" />
              返回日报列表
            </Link>

            {/* ═══ Newspaper Masthead ═══ */}
            <div className="animate-fade-in mt-4 mb-10 text-center">
              <div className="border-t-4 border-double border-brand pt-6 pb-4">
                <h1 className="font-[family-name:var(--font-newspaper)] text-4xl font-bold tracking-wide text-foreground">
                  AI 日报 · AI DAILY
                </h1>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                  每日精选 X/Twitter AI 行业动态 · 中文解读
                </p>
              </div>
              <div className="border-t border-border pt-3 pb-3">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Badge className="bg-brand text-brand-foreground hover:bg-brand/90 font-mono text-sm px-3 py-1">
                    {report.date}
                  </Badge>
                  <span className="text-muted-foreground">{report.weekday}</span>
                  <span className="text-sm text-muted-foreground">
                    {report.tweetCount} 条推文 / {report.userCount} 位用户
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">时间范围：{report.timeRange}</p>
              </div>
              <div className="border-t border-border" />
            </div>

            {/* ═══ Lead Story ═══ */}
            {leadTopic && leadItem && (
              <section className="mb-10 animate-fade-up">
                <h2 className="font-[family-name:var(--font-newspaper)] text-xl font-bold text-foreground mb-1 border-b-2 border-brand pb-2">
                  {leadTopic.title}
                </h2>
                <div className="mt-6">
                  <h3 className="font-[family-name:var(--font-newspaper)] text-2xl font-bold text-foreground sm:text-3xl">
                    {leadItem.bold}
                  </h3>
                  <p className="drop-cap mt-4 text-sm leading-7 text-foreground/90 sm:text-base sm:text-justify">
                    {leadItem.detail}
                  </p>
                  {leadItem.tags && leadItem.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {leadItem.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remaining items in lead topic */}
                {remainingLeadItems.length > 0 && (
                  <div className="mt-6 space-y-5">
                    {remainingLeadItems.map((item, ii) => (
                      <div key={ii} className="break-inside-avoid">
                        <h3 className="text-base font-semibold text-foreground">{item.bold}</h3>
                        <p className="mt-1 text-sm leading-7 text-foreground/90 sm:text-base sm:text-justify">{item.detail}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Decorative separator */}
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-muted-foreground/40 text-sm select-none">◆</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </section>
            )}

            {/* ═══ Multi-Column Body ═══ */}
            {remainingTopics.length > 0 && (
              <div className="newspaper-columns">
                {remainingTopics.map((topic, ti) => (
                  <section key={ti} className="mb-8 break-inside-avoid-column">
                    <h2 className="font-[family-name:var(--font-newspaper)] text-xl font-bold text-foreground mb-4 border-b-2 border-brand pb-2">
                      {topic.title}
                    </h2>
                    <div className="space-y-5">
                      {topic.items.map((item, ii) => (
                        <div key={ii} className="break-inside-avoid">
                          <h3 className="text-base font-semibold text-foreground">{item.bold}</h3>
                          <p className="mt-1 text-sm leading-7 text-foreground/90 sm:text-base sm:text-justify">{item.detail}</p>
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Section separator */}
                    {ti < remainingTopics.length - 1 && (
                      <div className="mt-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-muted-foreground/40 text-xs select-none">§</span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}

            {/* ═══ Byline ═══ */}
            <p className="mt-8 text-xs italic text-muted-foreground text-center">
              数据来源：X/Twitter AI 相关推文
            </p>

            {/* ═══ Navigation ═══ */}
            <nav className="flex justify-between items-center border-t border-border pt-6 mt-8">
              {prev ? (
                <Link href={`/${prev.date}`} className="group/nav inline-flex items-center gap-1.5 rounded-lg px-3 py-3 text-sm text-brand transition-colors hover:text-brand/80 hover:bg-brand-muted">
                  <ArrowLeft className="size-3.5 transition-transform group-hover/nav:-translate-x-0.5" />
                  <span><span className="hidden sm:inline">Previous Edition · </span>{prev.date} {prev.weekday}</span>
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/${next.date}`} className="group/nav inline-flex items-center gap-1.5 rounded-lg px-3 py-3 text-sm text-brand transition-colors hover:text-brand/80 hover:bg-brand-muted">
                  <span><span className="hidden sm:inline">Next Edition · </span>{next.date} {next.weekday}</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover/nav:translate-x-0.5" />
                </Link>
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
