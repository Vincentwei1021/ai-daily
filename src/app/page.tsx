import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { reports } from "@/data/reports";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ArrowRight } from "lucide-react";

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
        {/* Hero */}
        <section className="px-4 pt-12 pb-8 sm:px-6 sm:pt-20 sm:pb-12">
          <div className="mx-auto max-w-4xl">
            <div className="animate-fade-up">
              <div className="mb-4 flex items-center gap-2">
                <Newspaper className="size-8 text-brand" />
                <h1 className="font-[family-name:var(--font-heading)] text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                  AI 日报
                </h1>
              </div>
              <p className="text-lg text-muted-foreground" style={{ animationDelay: "0.1s" }}>
                每日精选 X/Twitter AI 行业动态 · 按话题聚合 · 中文解读
              </p>
              <p className="mt-2 text-xs text-muted-foreground/70" style={{ animationDelay: "0.2s" }}>
                数据来源：Vincent 关注的 X 账号过去 24 小时 AI 相关推文摘要
              </p>
            </div>
          </div>
        </section>

        {/* Report Cards */}
        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {reports.map((report, idx) => (
              <Card
                key={report.date}
                className="animate-fade-up transition-shadow hover:shadow-lg hover:shadow-brand/5"
                style={{ animationDelay: `${0.15 + idx * 0.08}s` }}
              >
                <CardHeader className="border-b">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-brand text-brand-foreground hover:bg-brand/90 font-mono text-sm px-3 py-1">
                      {report.date}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{report.weekday}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {report.tweetCount} 条推文 / {report.userCount} 位用户
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {report.topics.slice(0, 2).map((topic, i) => (
                    <div key={i}>
                      <h3 className="text-sm font-bold text-foreground mb-2">{topic.title}</h3>
                      <ul className="space-y-1.5">
                        {topic.items.slice(0, 2).map((item, j) => (
                          <li key={j} className="text-sm leading-relaxed">
                            <span className="font-semibold text-foreground">{item.bold}</span>
                            <span className="text-muted-foreground"> — {item.detail.slice(0, 60)}...</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {report.topics.length > 2 && (
                    <p className="text-xs text-muted-foreground">还有 {report.topics.length - 2} 个话题...</p>
                  )}
                </CardContent>

                <CardFooter>
                  <Link href={`/${report.date}`} className="group/link inline-flex items-center gap-1.5 rounded-lg px-3 py-3 -ml-3 text-sm font-semibold text-brand transition-colors hover:text-brand/80 hover:bg-brand-muted">
                    阅读完整日报
                    <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="border-t border-border bg-muted/50 px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-4xl animate-fade-up">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground mb-4">关于 AI 日报</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p><strong className="text-foreground">AI 日报</strong>每天从 Vincent 关注的 X/Twitter 账号中提取 AI 行业动态，按话题聚合成易于消化的中文摘要。内容覆盖大模型更新、AI agent 架构、开源项目、研究突破、产品发布等维度。</p>
              <p>与传统 AI 新闻不同，AI 日报关注的是<strong className="text-foreground">一线从业者的真实讨论</strong>——不是新闻稿，而是 Twitter 上正在发生的对话。每个话题附带标签，方便追踪特定领域。</p>
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
