# TASK: AI Daily — 中文实体报纸版式重构

## 目标
将 AI 日报从现代卡片式布局改版为**中国实体报纸数字版**。核心感觉：宣纸 + 油墨 + 宋体 + 分栏 + 版头装饰。

## 参考设计
`/tmp/OpenClaw-Newspaper/site/index.html` — 完整 CSS/HTML 参考。关键设计元素：

### 色调系统
```css
--paper: #f2eadc;      /* 宣纸色背景 */
--paper-2: #ebdfcc;    /* 宣纸深色 */
--ink: #151515;        /* 深墨色文字 */
--muted: #645d54;      /* 灰褐辅助色 */
--soft: #8e8476;       /* 更淡辅助色 */
--rule: #1e1a15;       /* 分割线色 */
--accent: #7d1111;     /* 暗红强调色 */
--panel: #f7f0e4;      /* 面板背景 */
```

### 字体系统
```css
--serif: "Source Han Serif SC", "Songti SC", "STSong", serif;  /* 正文/标题 */
--sans: "Inter", "PingFang SC", "Noto Sans CJK SC", sans-serif; /* 辅助信息 */
--mono: "JetBrains Mono", "SFMono-Regular", "Consolas", monospace; /* 数据 */
```

### Dark Mode（夜间阅读版）
- 背景: 深墨色 #1a1812，纸面 #242018
- 文字: 偏黄白 #e8e0d0
- 暗红强调色保持但调亮
- 分割线用 rgba(255,255,255,0.12)
- 像是在昏暗灯光下看报纸的感觉

## ⚠️ 必须保留
- reports.ts 数据结构和内容 — **不得修改**
- /[date] 详情页路由
- FeedbackWidget（保留浮动按钮+表单）
- AdSense script（layout.tsx head 中）
- 所有 SEO metadata, JSON-LD, sitemap, robots
- Privacy/Terms 页面
- ThemeProvider + ThemeToggle（dark/light mode）
- /api/feedback route
- opengraph-image.tsx

## 具体设计

### 1. globals.css — 完全重写

Light mode:
- body 背景: radial-gradient + 宣纸底色 #d8cdb9
- `.page` 容器: 宣纸色渐变背景 + 边框 + 阴影，max-width: 1200px
- 用 CSS 变量定义全部颜色
- 报纸字体 @theme 注册

Dark mode (.dark):
- body 背景: #0f0e0a
- `.page` 容器: #1a1812 → #1e1a14 渐变
- 文字: #e8e0d0
- 暗红调亮: #a03030
- 分割线: rgba(255,255,255,0.10)

### 2. layout.tsx

- 加载 Source Han Serif SC（通过 Google Fonts 的 Noto Serif SC 替代，因为 Source Han Serif 不在 Google Fonts）
- 保留 Inter + Plus Jakarta Sans
- 注册 CSS 变量 `--font-serif`, `--font-sans`, `--font-mono`
- ThemeProvider + Toaster 保留
- AdSense 保留

```typescript
import { Noto_Serif_SC } from "next/font/google";
const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "900"],
});
```

### 3. page.tsx（首页）— 报纸门户

整体结构：
```
┌─────────────────────────────────────────┐
│  .page 容器（宣纸色）                    │
│                                         │
│  ┌─ MASTHEAD ─────────────────────────┐ │
│  │ AI 日报                  信号板     │ │
│  │ 每日精选 X/Twitter...   推文/用户   │ │
│  └────────── 3px double ──────────────┘ │
│                                         │
│  ┌─ LEAD STORY ───────────────────────┐ │
│  │ ▌最新一期的头条话题                 │ │
│  │  标题 + 摘要 + 「阅读完整日报」     │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ NEWSROOM ──────────┬─ SIDEBAR ────┐ │
│  │  往期日报卡片网格    │ 最近更新面板  │ │
│  │  （每日一张卡片）    │ 时间线列表    │ │
│  │  2-3列响应式        │              │ │
│  └─────────────────────┴──────────────┘ │
│                                         │
│  ┌─ ABOUT ────────────────────────────┐ │
│  │  关于 AI 日报                       │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ═══════ 3px double footer ═══════════  │
└─────────────────────────────────────────┘
```

#### Masthead
- 左侧：`<div class="topline">` "每日 AI 行业情报" 小字 uppercase
- `<h1>` "AI 日报" 用 serif 字体，clamp(34px, 4.4vw, 48px)
- `<div class="dek">` 副标题
- 右侧 signal-board：最新日期 + 推文总数 + 用户总数 + 最新话题
- 底部 `3px double var(--rule)` 分隔线

#### Lead Story
- 取 reports[0]（最新一期）的第一个话题第一条
- 左侧 4px 暗红竖线 (::before)
- SECTION KICKER: "头版信号" + 日期
- h2: 第一条 item.bold
- p: item.detail（截断 2 行）
- 链接按钮: "阅读完整日报 →" (is-strong) + 话题标签

#### Report Cards Grid（往期）
- Board head: "往期日报" + "section-kicker: ARCHIVE"
- 每日一张 project-card 风格卡片：
  - 顶部 3px 渐变线 (accent → ink)
  - card-top: 日期 + 话题数
  - h3: "{date} {weekday} 日报"
  - card-description: 前 2 个话题名
  - activity-block: 头条摘要（左侧暗红竖线）
  - card-footer: 推文数 + 用户数 + "阅读日报"
- Grid: 3列 → 2列 → 1列 响应式

#### Sidebar — 最近更新面板
- updates-panel 样式
- 从所有 reports 提取最近 8 条 items，按日期排序
- 每行: update-time + update-project(话题名) + update-title(item.bold) + update-summary(detail 截断)
- 点线分隔 border-bottom: 1px dotted

#### About 区域
- 保留现有内容
- 用 serif 字体标题 + sans 正文
- 宣纸色背景融入

#### Footer
- `3px double var(--rule)` 顶线
- mono 字体小字: © 2026 AI 日报 + Privacy + Terms
- 暗红 hover

### 4. [date]/page.tsx（详情页）— 单日报纸

结构：
```
┌─────────────────────────────────────────┐
│  .page 容器                             │
│                                         │
│  ← 返回日报列表                         │
│                                         │
│  ┌─ MASTHEAD ─────────────────────────┐ │
│  │ AI 日报 · {date} {weekday}         │ │
│  │ 信号板: 推文数 / 用户数 / 时间范围  │ │
│  └────────── 3px double ──────────────┘ │
│                                         │
│  ┌─ LEAD STORY ───────────────────────┐ │
│  │ ▌第一个话题第一条 → 大标题+全文     │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ◆ 分隔符                               │
│                                         │
│  ┌─ 多栏正文 ─────────────────────────┐ │
│  │ 剩余话题，newspaper-columns 2列    │ │
│  │ 每个话题 = section kicker + 标题   │ │
│  │ 每条 item = activity-block 样式    │ │
│  │ 标签用 tag badges                  │ │
│  └────────────────────────────────────┘ │
│                                         │
│  数据来源：X/Twitter                     │
│  ← prev  ────────────────  next →       │
│  ═══════ 3px double footer ═══════════  │
└─────────────────────────────────────────┘
```

- Lead story: drop-cap 保留，但改为 serif font + 暗红色
- Topic titles: serif 字体 + 暗红 border-b-2
- Items: activity-block 样式（左侧 2px 暗红竖线 + 浅背景）
- Tags: mono 字体 uppercase 小标签
- 多栏: CSS column-count:2 + column-rule

### 5. Header.tsx

- 极简：透明背景（让 .page 容器说话）
- sticky, 不要 backdrop-blur（破坏纸张感）
- Logo: "AI 日报" serif 字体 + 暗红色
- ThemeToggle（太阳/月亮图标，暗红 hover）
- 移动端不需要汉堡菜单（链接少）

### 6. Footer.tsx

- 不用 HTML footer 组件，直接在 .page 容器底部
- `3px double var(--rule)` 顶线
- mono 字体: © + Privacy + Terms
- 暗红 hover

### 7. FeedbackWidget.tsx

- 浮动按钮改为暗红色
- 表单卡片用宣纸色背景 + 边框

### 8. 响应式断点

```
1200px+ → 3列卡片网格 + 侧边栏
820px  → 2列卡片 + 侧边栏变全宽（在卡片下方）
640px  → 1列 + 全宽
```

### 9. 动画（极简）

- 报纸不需要花哨动画
- 仅保留: 页面 fade-in + hover 状态
- 卡片 hover: 微微抬起 + 阴影加深
- 链接 hover: 暗红色过渡

### 10. Build & Deploy

```bash
npm run build  # 必须 clean pass
npx vercel --prod
```

确认 https://daily.toolboxlite.com 正常。

## 不要做的事
- 不要改 reports.ts
- 不要用 framer-motion 或重动画库
- 不要用明亮的现代色板 — 这是报纸，用油墨+宣纸色
- 不要保留之前的 shadcn Card 样式 — 全部换成报纸风格
- 不要让移动端不可读
- 不要丢 SEO 或 AdSense
