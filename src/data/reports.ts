export interface Topic {
  title: string;
  items: { bold: string; detail: string; tags?: string[] }[];
}

export interface DailyReport {
  date: string;
  weekday: string;
  timeRange: string;
  tweetCount: number;
  userCount: number;
  topics: Topic[];
}

export const reports: DailyReport[] = [
  {
    date: "2026-03-16", weekday: "周一",
    timeRange: "03-15 08:30 ~ 03-16 08:30 (UTC+8)", tweetCount: 30, userCount: 9,
    topics: [
      {
        title: "🧩 Agent 架构与 MCP 讨论",
        items: [
          { bold: "MCP vs CLI vs Skills 分层论", detail: "Vincent 提出三者不是竞争关系而是分层：MCP 做 tool consumption，CLI 做 one-shot scripting，Skills 做持久 agent 行为。关键是 runtime 如何编排三者。进一步讨论了 agent 编排 agent 时层级如何复合。", tags: ["MCP", "Skills", "Agent Orchestration"] },
          { bold: "MCP 生产环境踩坑", detail: "Vincent 分享 MCP 部署经验——部分失败、工具版本漂移、零可观测性。Demo 掩盖了这些问题，需要在协议之上构建控制层。", tags: ["MCP", "Production"] },
          { bold: "OpenClaw 插件进化", detail: "Peter Steinberger 思考如何让 OpenClaw 插件更强大、核心更精简，计划支持 Claude Code / Codex 插件 bundles。Twitter 自动 block spam 的 cron 也运行良好。", tags: ["OpenClaw", "Plugin Architecture"] },
        ],
      },
      {
        title: "💡 Vibe Coding 与开发者工具",
        items: [
          { bold: "Vibe Coding 的真相", detail: "Vincent 指出 30 分钟原型推文是真的，但 100 小时的生产差距也是真的。知道自己处于哪种模式才是真正的技能。", tags: ["Vibe Coding", "Reality Check"] },
          { bold: "多 Provider 管理痛点", detail: "6 套 API key、6 个计费面板、6 套重复工具。模型选择只占 20%，管道工程占 80%。推荐 agent-toolbox-mcp 统一工具集。", tags: ["Multi-Provider", "Developer Experience"] },
        ],
      },
      {
        title: "🔬 前沿研究与投资",
        items: [
          { bold: "LeCun AMI Labs $10.3 亿种子轮", detail: "Yann LeCun 的 AMI Labs 获史上最大种子轮融资。12 人团队、无产品。Vincent 评论 LLM 触顶，世界模型 + 类人机器人才是物理世界的真正突破。", tags: ["AMI Labs", "World Models", "Robotics"] },
          { bold: "AlphaFold 治愈狗的癌症", detail: "澳洲技术人员用 AlphaFold 为癌症晚期收养狗设计个性化 mRNA 疫苗并成功治愈。Demis Hassabis、Greg Brockman、Elon Musk 均转发讨论，称为数字生物学时代的开端。", tags: ["AlphaFold", "Digital Biology"] },
          { bold: "Stanford OpenJarvis", detail: "斯坦福发布在本地设备运行的个人 AI 系统 OpenJarvis，强调隐私优先的个人 AI 方向。", tags: ["Stanford", "On-Device AI"] },
        ],
      },
      {
        title: "🎨 产品动态",
        items: [
          { bold: "Grok Imagine 视频编辑", detail: "xAI 的 Grok Imagine 在 Video Editing Arena 排名第一（Elo 1290），支持多图生成视频。Elon 密集转发宣传。", tags: ["Grok Imagine", "Video"] },
          { bold: "GPT-4 三周年", detail: "Greg Brockman 回忆 GPT-4 发布日手绘草图变网站的演示，感慨从「写 1000 行代码」的不可能目标到今天的进步。", tags: ["GPT-4", "Anniversary"] },
          { bold: "Google AR 眼镜", detail: "MWC 上展示 Android prototype display glasses，Google 对 Android + Gemini 整合到 AR 眼镜的 vision。", tags: ["Google AR", "Gemini"] },
        ],
      },
    ],
  },
  {
    date: "2026-03-15", weekday: "周日",
    timeRange: "03-14 08:30 ~ 03-15 08:30 (UTC+8)", tweetCount: 48, userCount: 11,
    topics: [
      {
        title: "🦞 OpenClaw 生态大更新",
        items: [
          { bold: "Chrome 实时浏览器控制", detail: "新 beta 支持 agent 直接连接用户 Chrome tab（通过 chrome://inspect#remote-debugging），访问 cookies/登录状态，需额外确认启用。", tags: ["OpenClaw 2026.3.13", "Chrome MCP"] },
          { bold: "NVIDIA GTC 合作", detail: "NVIDIA 派工程师帮 OpenClaw 做安全审计；GTC 将举办 Build-A-Claw 活动，可现场购买 DGX Spark 并由 NVIDIA 工程师安装 OpenClaw。", tags: ["NVIDIA GTC", "Security Audit"] },
          { bold: "更多更新", detail: "Parallel tool calling 即将支持 · MS Teams 集成改进 · SGLang 原生支持 · qmd memory plugin 推荐。", tags: ["Parallel Tools", "MS Teams"] },
        ],
      },
      {
        title: "🤖 Grok 系列密集更新",
        items: [
          { bold: "Grok 4.20 Beta 登顶", detail: "Artificial Analysis 排行榜第一；τ²-Bench 电信 Agentic Tool Use 96.5% 准确率（超越 Claude）。", tags: ["Grok 4.20", "Benchmark"] },
          { bold: "Grok Imagine 大升级", detail: "Multi-image to video、风格控制改进、5 分钟完成图片 + 30 秒视频全流程。", tags: ["Grok Imagine", "Video"] },
        ],
      },
      {
        title: "📚 Anthropic & Claude 生态",
        items: [
          { bold: "Anthropic Academy 发布", detail: "13 门免费课程（MCP、Claude Code、Agent Skills、Bedrock），含证书。", tags: ["Anthropic Academy", "Education"] },
          { bold: "1M context window 正式 GA", detail: "Claude Opus 4.6 和 Sonnet 4.6 同时支持——Vincent 评价：「this changes what an agent can hold mid-task」。", tags: ["1M Context", "Anthropic"] },
        ],
      },
      {
        title: "🌐 Web & AI Agent 趋势",
        items: [
          { bold: "WebMCP vs MCP", detail: "Ephemeral browser → WebMCP，persistent server → MCP。Chrome 团队推动「agent-native web」。", tags: ["WebMCP", "Chrome"] },
          { bold: "ACPX 协议", detail: "让任何 harness 互相通信——OpenClaw/Codex/Claude Code 可互调。", tags: ["ACPX", "Interop"] },
          { bold: "AI 实际应用", detail: "OpenClaw 帮农民在柴油期货谈判省 $25K · 15 岁少年用 OpenClaw 赚 $30K+ 合同 · AI 辅助设计 mRNA 疫苗治犬癌。", tags: ["Real Use Cases"] },
        ],
      },
      {
        title: "🔬 开源 & 模型发布",
        items: [
          { bold: "WAXAL 开源", detail: "非洲语言多语种语音数据集（17 语言 TTS / 19 语言 ASR）。", tags: ["HuggingFace", "Open Source"] },
          { bold: "LiquidAI LFM2-VL", detail: "浏览器中 WebGPU 实时视频字幕（无需服务器）。", tags: ["LiquidAI", "WebGPU"] },
        ],
      },
    ],
  },
  {
    date: "2026-03-14", weekday: "周六",
    timeRange: "03-13 08:30 ~ 03-14 08:30 (UTC+8)", tweetCount: 42, userCount: 18,
    topics: [
      {
        title: "🧠 大模型与基础设施",
        items: [
          { bold: "Anthropic 1M Context Window", detail: "Opus/Sonnet 升级到 1M context window，标准定价。Vincent 评论：别过度优化当前定价，成本结构重置比基建设计快。", tags: ["Anthropic", "1M Context"] },
          { bold: "Grok 4.20 Beta", detail: "性能接近 Opus 4.5，推理速度更快、模型更小。Grok Imagine 更新 consistent characters/objects 功能、视频尺寸/质量选择。", tags: ["xAI", "Grok 4.20"] },
          { bold: "NVIDIA Vera Rubin NVL72", detail: "Microsoft/Azure 成为首个完成验证的云厂商，下一代 AI 基础设施里程碑。PyTorch 团队将在 NVIDIA GTC Booth #338 亮相。", tags: ["NVIDIA", "Microsoft"] },
        ],
      },
      {
        title: "🔬 AI 研究突破",
        items: [
          { bold: "AlphaEvolve × Ramsey 数", detail: "DeepMind 的 AlphaEvolve 改进了 5 个经典 Ramsey 数的下界，部分为 10+ 年来首次突破。Demis Hassabis、LeCun 均转发祝贺。", tags: ["AlphaEvolve", "DeepMind"] },
          { bold: "世界模型融资潮", detail: "AMI Labs 融 $1.03B、World Labs 融 $1B，两家都押注 world models 但路径不同。LeCun 转发讨论世界建模的潜空间研究。", tags: ["AMI Labs", "World Labs", "World Models"] },
          { bold: "多语言语音数据集 WAXAL", detail: "开源非洲语言语音数据集，覆盖 17 语言 TTS + 19 语言 ASR。Jeff Dean 转发推荐。", tags: ["WAXAL", "HuggingFace"] },
        ],
      },
      {
        title: "🛠️ 开发工具与平台",
        items: [
          { bold: "Google 生态更新", detail: "Gemini 接入 Google Maps（多步推理 + 3 亿照片/评论）、Gemini Embedding 2 预览版（首个原生多模态嵌入模型）。Chrome 146 单 toggle 即可通过 MCP 暴露浏览器给 CLI agent。", tags: ["Gemini", "Chrome 146", "MCP"] },
          { bold: "OpenAI Codex App 更新", detail: "Greg Brockman 推荐：「If you haven't tried Codex yet, you're missing something BIG」。两项新更新发布。", tags: ["OpenAI", "Codex"] },
          { bold: "Arena.ai 排行榜升级", detail: "新增价格和 context 长度维度对比。匿名「香蕉模型」成为历史上投票最多的模型。", tags: ["Arena.ai", "Benchmark"] },
        ],
      },
      {
        title: "🦞 OpenClaw 生态",
        items: [
          { bold: "社区动态", detail: "OpenClaw Dashboard v2 发布。Peter Steinberger 警告不要用 AI bot 给 PR 加噪音。vincent_koc 征集插件开发者反馈。OpenClaw 被部署到无人机上自主构建技能。", tags: ["Dashboard v2", "Drone Deployment"] },
          { bold: "Vincent 发推", detail: "评论 Anthropic 1M context 的成本影响、OpenClaw 按复杂度路由模型节省成本、回应 skills.md 过时论（format 会变 concept 不会）。", tags: ["@YihaoWei1021"] },
        ],
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
