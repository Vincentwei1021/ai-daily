import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { reports, getReportByDate, getAllDates } from "@/data/reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

            {/* Title area */}
            <div className="mb-10 animate-fade-up">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge className="bg-brand text-brand-foreground hover:bg-brand/90 font-mono text-sm px-3 py-1">
                  {report.date}
                </Badge>
                <span className="text-muted-foreground">{report.weekday}</span>
                <Badge variant="secondary" className="font-normal">
                  {report.tweetCount} 条推文
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  {report.userCount} 位用户
                </Badge>
              </div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {report.date} AI 日报
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">时间范围：{report.timeRange}</p>
            </div>

            {/* Topics */}
            <div className="space-y-8">
              {report.topics.map((topic, ti) => (
                <section key={ti} className="animate-fade-up" style={{ animationDelay: `${0.1 + ti * 0.06}s` }}>
                  <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-foreground mb-4">{topic.title}</h2>
                  <div className="space-y-4">
                    {topic.items.map((item, ii) => (
                      <Card key={ii} className="transition-shadow hover:shadow-md hover:shadow-brand/5">
                        <CardHeader>
                          <CardTitle className="text-base font-bold">{item.bold}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Navigation */}
            <nav className="flex justify-between items-center border-t border-border pt-6 mt-10">
              {prev ? (
                <Link href={`/${prev.date}`} className="group/nav inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-brand/80">
                  <ArrowLeft className="size-3.5 transition-transform group-hover/nav:-translate-x-0.5" />
                  {prev.date} {prev.weekday}
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/${next.date}`} className="group/nav inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-brand/80">
                  {next.date} {next.weekday}
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
