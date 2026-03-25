# TASK: AI Daily — Newspaper Style Redesign

## Objective
Redesign the AI Daily detail pages (/{date}) to look like a **real newspaper**. Think: New York Times front page meets modern web design. The homepage listing stays as card-based, but the detail pages get the full newspaper treatment.

## ⚠️ CRITICAL: Preserve All Functionality
- All data from reports.ts — DO NOT MODIFY
- Homepage listing with report cards + "阅读完整日报" links
- Detail page with all topics and items
- Navigation (prev/next day)
- FeedbackWidget, AdSense, Header, Footer
- Dark/Light mode (already exists)
- ALL SEO metadata, JSON-LD, sitemap, robots
- Touch targets ≥ 44px on all interactive elements

## Step 1: Add Newspaper Fonts

In layout.tsx, add a serif font for newspaper headings:
```typescript
import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-newspaper",
  weight: ["400", "500", "600", "700", "800", "900"]
});
```
Add the variable to body className and register in CSS theme:
```css
--font-newspaper: var(--font-newspaper), Georgia, 'Times New Roman', serif;
```

## Step 2: Redesign /{date} Detail Page — Newspaper Layout

This is the main change. The detail page should feel like opening a newspaper.

### Newspaper Masthead (top of article)
```
═══════════════════════════════════════════════
              AI 日报 · AI DAILY
    每日精选 X/Twitter AI 行业动态 · 中文解读
═══════════════════════════════════════════════
  2026-03-16 周一    30 条推文 / 9 位用户
  时间范围：03-15 08:30 ~ 03-16 08:30 (UTC+8)
───────────────────────────────────────────────
```

Implementation:
- Top decorative double border (border-t-4 border-double)
- "AI 日报" in font-newspaper, text-4xl, font-bold, tracking-wide
- Subtitle in small text-muted-foreground, uppercase tracking-widest
- Date line: date badge + weekday + stats
- Bottom decorative separator (thin border)
- Text-center for the masthead area

### Lead Story (first topic, first item)
- Featured/hero layout — full width
- Headline: font-newspaper, text-2xl sm:text-3xl, font-bold
- First paragraph: text-lg, first-letter drop cap on first item
  ```css
  .drop-cap::first-letter {
    float: left;
    font-size: 3.5rem;
    line-height: 1;
    font-family: var(--font-newspaper);
    font-weight: 700;
    margin-right: 0.5rem;
    color: var(--brand);
  }
  ```
- Tags below in small badges
- Separator after lead story

### Multi-Column Layout (remaining content)
- Desktop: 2-column layout using CSS columns or grid
  ```css
  .newspaper-columns {
    column-count: 2;
    column-gap: 2rem;
    column-rule: 1px solid var(--border);
  }
  @media (max-width: 640px) {
    .newspaper-columns { column-count: 1; }
  }
  ```
- Each topic = a "section" within the newspaper
- Topic title: font-newspaper, text-xl, font-bold, with decorative underline (border-b-2 border-brand)
- Items within topics: regular body text flow
  - Item bold title: font-semibold (inline or as sub-heading)
  - Item detail: regular text, good line-height (leading-7)
  - Tags: tiny inline badges
  - break-inside-avoid on each item to prevent awkward column breaks

### Column Separators
- Vertical rule between columns (column-rule in CSS)
- Horizontal separators between topics (thin border + small decorative element)

### Typography Rules
- Headings: font-newspaper (Playfair Display) — serif, elegant
- Body text: Inter (sans-serif) — clean, readable
- Font sizes:
  - Masthead title: text-4xl
  - Lead headline: text-2xl sm:text-3xl
  - Topic titles: text-xl
  - Item titles: text-base font-semibold
  - Body: text-sm sm:text-base, leading-7
- Justified text on desktop for newspaper feel: `text-justify` on body paragraphs
  (but NOT on mobile — `sm:text-justify`)

### Navigation (prev/next)
- Keep at bottom, but style like "Previous Edition / Next Edition"
- Clean border-t separator

## Step 3: Homepage Enhancement

The homepage listing stays card-based but add newspaper flair:
- Section title "AI 日报" in font-newspaper
- Each report card: keep existing Card design but add subtle serif accent on dates
- Maybe add a thin decorative border (double) at top of the section

## Step 4: Dark Mode Newspaper
- Dark mode: parchment-like dark bg, cream text
- Borders and rules: subtle oklch(1 0 0 / 12%) 
- Drop cap: text-brand (brand color works in both modes)
- Column rule: border color adjusts automatically

## Step 5: Print-Inspired Details
- Small decorative "§" or "◆" between sections
- "CONTINUED" or "接下页" not needed (it's a single page)
- Byline: "数据来源：X/Twitter AI 相关推文" — small, italic

## Step 6: Animations (subtle for newspaper)
- Masthead: fade-in on load
- Lead story: subtle fade-up
- Column content: no animation (newspapers don't animate!)
- Keep existing scroll animations on homepage

## Step 7: Build
```bash
npm run build
```
Must pass cleanly.

## What NOT to do
- Don't change the data structure or reports.ts
- Don't make it look like a toy/novelty "old newspaper" — keep it MODERN + newspaper-inspired
- Don't use brown/sepia filters — keep the clean brand color system
- Don't break mobile readability with multi-column on small screens
- Don't over-decorate — subtlety is key
- Don't remove existing navigation or SEO elements
