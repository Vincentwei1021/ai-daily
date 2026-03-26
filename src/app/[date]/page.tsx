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
      <main className="page animate-fade-in">
        <Link href="/" className="back-link">← 返回日报列表</Link>

        {/* ═══ Masthead ═══ */}
        <div className="detail-masthead">
          <h1>AI 日报 · {report.date} {report.weekday}</h1>
          <div className="detail-meta">
            <span>{report.date}</span>
            <span>{report.tweetCount} 条推文</span>
            <span>{report.userCount} 位用户</span>
            <span>{report.timeRange}</span>
          </div>
        </div>

        {/* ═══ Lead Story ═══ */}
        {leadTopic && leadItem && (
          <section className="detail-lead">
            <h2 className="topic-title">{leadTopic.title}</h2>
            <h3 className="item-title">{leadItem.bold}</h3>
            <p className="item-detail drop-cap">{leadItem.detail}</p>
            {leadItem.tags && leadItem.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {leadItem.tags.map(tag => (
                  <span key={tag} className="np-tag">{tag}</span>
                ))}
              </div>
            )}

            {remainingLeadItems.map((item, ii) => (
              <div key={ii} className="topic-item" style={{ marginTop: ii === 0 ? 14 : 10 }}>
                <div className="item-title">{item.bold}</div>
                <div className="item-detail">{item.detail}</div>
                {item.tags && item.tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                    {item.tags.map(tag => (
                      <span key={tag} className="np-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* ◆ Separator */}
        <div className="np-separator"><span>◆</span></div>

        {/* ═══ Multi-Column Body ═══ */}
        {remainingTopics.length > 0 && (
          <div className="newspaper-columns">
            {remainingTopics.map((topic, ti) => (
              <section key={ti} className="topic-section">
                <h2 className="topic-title">{topic.title}</h2>
                {topic.items.map((item, ii) => (
                  <div key={ii} className="topic-item">
                    <div className="item-title">{item.bold}</div>
                    <div className="item-detail">{item.detail}</div>
                    {item.tags && item.tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {item.tags.map(tag => (
                          <span key={tag} className="np-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}

        {/* Byline */}
        <p className="byline">数据来源：X/Twitter AI 相关推文</p>

        {/* ═══ Prev / Next ═══ */}
        <nav className="np-nav">
          {prev ? (
            <Link href={`/${prev.date}`}>← {prev.date} {prev.weekday}</Link>
          ) : <span />}
          {next ? (
            <Link href={`/${next.date}`}>{next.date} {next.weekday} →</Link>
          ) : <span />}
        </nav>

        {/* ═══ Footer ═══ */}
        <Footer />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </>
  );
}
