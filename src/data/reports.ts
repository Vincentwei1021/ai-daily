export interface DailyReport {
  date: string;        // "2026-03-16"
  weekday: string;     // "周一"
  discoveries: { title: string; detail: string; sources?: string[] }[];
  signals: { author: string; content: string; likes: number; insight: string; url?: string }[];
  summary?: string;
}

export const reports: DailyReport[] = [
  {
    date: "2026-03-16",
    weekday: "周一",
    summary: "AI agent 垃圾 PR 问题引爆舆论，OpenClaw 生态持续扩展，多个付费需求信号浮现。",
    discoveries: [
      {
        title: "AI OSS PR/Issue 垃圾过滤工具",
        detail: "OSS 维护者被 AI agent 低质量 PR 轰炸，Axios/TechCrunch/InfoWorld 密集报道。开源社区急需 AI PR 质量过滤方案，这是一个明确的工具缺口。",
        sources: ["Axios", "TechCrunch", "InfoWorld"],
      },
      {
        title: "FlashClaw = OpenClaw + DFlash",
        detail: "Qwen3.5 推理加速集成，4X 更快更便宜。OpenClaw 生态正在快速接入各家推理优化方案，性能成为关键竞争维度。",
      },
      {
        title: "MCP 协议生态爆发",
        detail: "Model Context Protocol 相关讨论量本周翻倍，多家工具厂商宣布支持 MCP，AI agent 互操作性成为热门话题。",
      },
    ],
    signals: [
      {
        author: "@steipete",
        content: "用 OpenClaw cron 清理 X 垃圾提及，效果拔群",
        likes: 1955,
        insight: "提及过滤是强需求，X/Twitter 用户对 AI 自动化内容管理有明确付费意愿",
        url: "https://x.com/steipete/status/example1",
      },
      {
        author: "@joncphillips",
        content: "想要 Sentry → AI 自动修 bug 管道，谁能做？",
        likes: 67,
        insight: "付费意愿明确——错误监控 → AI 自动修复是一个 $50+/月的 SaaS 方向",
      },
      {
        author: "@alexalbert__",
        content: "Claude Code 在 GitHub Actions 里跑 CI/CD pipeline，生产力暴增",
        likes: 342,
        insight: "AI agent 在 DevOps 流程中的应用正在从实验走向主流",
      },
    ],
  },
  {
    date: "2026-03-15",
    weekday: "周日",
    summary: "周末技术社区活跃讨论 AI coding agent 竞争格局，多个开源项目发布重要更新。",
    discoveries: [
      {
        title: "Codex vs Claude Code 性能对比热帖",
        detail: "Reddit r/LocalLLaMA 出现多篇 AI coding agent 对比评测，社区对 agent 可靠性和成本的讨论越来越深入。开发者开始关注「每行代码成本」这个新指标。",
        sources: ["Reddit r/LocalLLaMA"],
      },
      {
        title: "Vercel AI SDK 4.0 发布",
        detail: "支持流式工具调用、多模态输入、OpenAI Realtime API。AI 应用开发的基础设施层正在快速成熟。",
        sources: ["Vercel Blog"],
      },
    ],
    signals: [
      {
        author: "@levelsio",
        content: "我现在 90% 的代码都是 AI 写的，人类程序员的角色在转变",
        likes: 2843,
        insight: "头部独立开发者的背书——AI coding 从「辅助」到「主力」的转折点",
      },
      {
        author: "@swyx",
        content: "Agent 框架太多了，市场需要整合。预计 2026 Q2 会看到一波并购",
        likes: 156,
        insight: "行业观察者开始呼吁整合，可能意味着早期 agent 工具的窗口期在缩短",
      },
    ],
  },
  {
    date: "2026-03-14",
    weekday: "周六",
    summary: "AI agent 安全性讨论升温，企业采购决策越来越关注 agent 的可控性。",
    discoveries: [
      {
        title: "AI Agent 安全框架白皮书",
        detail: "Anthropic 发布新的 AI agent 安全评估框架，包含 12 项关键安全指标。企业在评估 AI agent 时有了更明确的标准，安全合规类工具需求会上升。",
        sources: ["Anthropic Blog"],
      },
      {
        title: "中国 AI 出海工具站集体涨价",
        detail: "多个面向海外的 AI 工具站宣布涨价 30-50%，市场正在从「跑量」转向「提价」阶段。竞品价格监控需求随之增加。",
      },
    ],
    signals: [
      {
        author: "@karpathy",
        content: "AI agents 最大的问题不是能力，是可预测性。用户需要知道 agent 会做什么、不会做什么。",
        likes: 4210,
        insight: "Karpathy 观点引发大量转发——agent 可解释性/可控性是下一个产品差异化方向",
      },
      {
        author: "@dhh",
        content: "Rails 8 + AI agent integration，未来的 web app 开发形态正在改变",
        likes: 892,
        insight: "传统 web 框架开始拥抱 agent——不只是 JS 生态在变",
        url: "https://x.com/dhh/status/example2",
      },
    ],
  },
];

export function getReportByDate(date: string): DailyReport | undefined {
  return reports.find(r => r.date === date);
}

export function getAllDates(): string[] {
  return reports.map(r => r.date);
}
