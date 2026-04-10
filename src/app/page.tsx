import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { reports } from "@/data/reports";

const siteUrl = "https://daily.toolboxlite.com";

const schema = {
  "@context": "https://schema.org", "@type": "WebSite",
  name: "AI 日报", url: siteUrl,
  description: "每日精选 X/Twitter AI 行业动态，追踪 AI agent 趋势、模型更新、开源进展。",
  inLanguage: "zh-CN",
};

export default function Home() {
  const latest = reports[0];
  const leadTopic = latest?.topics[0];
  const leadItem = leadTopic?.items[0];

  const totalTweets = reports.reduce((sum, r) => sum + r.tweetCount, 0);
  const totalUsers = reports.reduce((sum, r) => sum + r.userCount, 0);
  const latestTopicName = leadTopic?.title.replace(/^[^\s]+\s/, "") ?? "";

  const recentItems = reports.flatMap(r =>
    r.topics.flatMap(t =>
      t.items.map(item => ({
        date: r.date,
        topic: t.title.replace(/^[^\s]+\s/, ""),
        bold: item.bold,
        detail: item.detail,
      }))
    )
  ).slice(0, 8);

  return (
    <>
      <Header />
      <main className="page animate-fade-in">
        {/* ═══ Masthead ═══ */}
        <header className="masthead">
          <div>
            <div className="topline">每日 AI 行业情报</div>
            <h1>AI 日报</h1>
            <div className="dek">每日精选 X/Twitter AI 行业动态 · 按话题聚合 · 中文解读</div>
          </div>
          <div className="signal-board">
            <div className="signal-card">
              <small>Latest</small>
              <b className="signal-value">{latest?.date}</b>
              <span>{latest?.weekday}</span>
            </div>
            <div className="signal-card">
              <small>Tweets</small>
              <b className="signal-value">{totalTweets}</b>
              <span>{reports.length} 期合计</span>
            </div>
            <div className="signal-card">
              <small>Users</small>
              <b className="signal-value">{totalUsers}</b>
              <span>活跃用户</span>
            </div>
            <div className="signal-card">
              <small>Lead Topic</small>
              <b className="signal-value is-text">{latestTopicName}</b>
              <span>{latest?.date}</span>
            </div>
          </div>
        </header>

        {/* ═══ Lead Story ═══ */}
        {leadTopic && leadItem && (
          <section className="lead-story">
            <div className="section-kicker">头版信号</div>
            <div className="lead-strip">
              <span>{leadTopic.title}</span>
              <span>{latest.date} {latest.weekday}</span>
            </div>
            <h2>{leadItem.bold}</h2>
            <p>{leadItem.detail}</p>
            <div className="lead-links">
              <Link href={`/${latest.date}`} className="lead-link is-strong">
                阅读完整日报 →
              </Link>
              {leadItem.tags?.map(tag => (
                <span key={tag} className="lead-link">{tag}</span>
              ))}
            </div>
          </section>
        )}
        <AdBanner className="mx-auto max-w-5xl px-4 py-4" />

        {/* ═══ Newsroom: Cards + Sidebar ═══ */}
        <section className="newsroom">
          <div className="board-column">
            <div className="board-head">
              <div>
                <div className="section-kicker">Archive</div>
                <h2>往期日报</h2>
              </div>
              <div className="board-note">{reports.length} 期 · 按日期排序</div>
            </div>
            <div className="np-grid">
              {reports.map((report) => {
                const firstTopic = report.topics[0];
                const firstItem = firstTopic?.items[0];
                return (
                  <Link key={report.date} href={`/${report.date}`} className="project-card">
                    <div className="card-top">
                      <span>{report.date}</span>
                      <span>{report.topics.length} 话题</span>
                    </div>
                    <h3>{report.date} {report.weekday} 日报</h3>
                    <p className="card-description">
                      {report.topics.slice(0, 2).map(t => t.title.replace(/^[^\s]+\s/, "")).join(" · ")}
                    </p>
                    {firstTopic && firstItem && (
                      <div className="activity-block">
                        <small>头条 · {firstTopic.title.replace(/^[^\s]+\s/, "")}</small>
                        <b>{firstItem.bold}</b>
                        <p>{firstItem.detail}</p>
                      </div>
                    )}
                    <div className="card-footer">
                      <span>{report.tweetCount} 推文</span>
                      <span>{report.userCount} 用户</span>
                      <span>阅读日报</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="updates-panel">
            <div className="panel-head">
              <div>
                <div className="section-kicker">Recent Updates</div>
                <h2>最近动态</h2>
              </div>
              <div className="panel-note">最近 {recentItems.length} 条</div>
            </div>
            <div className="updates-list">
              {recentItems.map((item, i) => (
                <Link key={i} href={`/${item.date}`} className="update-row">
                  <span className="update-time">{item.date}</span>
                  <span className="update-project">{item.topic}</span>
                  <span className="update-title">{item.bold}</span>
                  <span className="update-summary">{item.detail}</span>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        {/* ═══ About ═══ */}
        <section className="about-section">
          <h2>关于 AI 日报</h2>
          <p><strong>AI 日报</strong>每天从 Vincent 关注的 X/Twitter 账号中提取 AI 行业动态，按话题聚合成易于消化的中文摘要。内容覆盖大模型更新、AI agent 架构、开源项目、研究突破、产品发布等维度。</p>
          <p>与传统 AI 新闻不同，AI 日报关注的是<strong>一线从业者的真实讨论</strong>——不是新闻稿，而是 Twitter 上正在发生的对话。每个话题附带标签，方便追踪特定领域。</p>
          <p>数据由 Haru（OpenClaw 运营 agent）每日 01:00 UTC 自动抓取，人工筛选后发布。目标读者：AI 创业者、独立开发者、产品经理、投资人。</p>
        </section>

        <AdBanner className="mx-auto max-w-5xl px-4 py-6" />
        {/* ═══ Footer ═══ */}
        <Footer />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
