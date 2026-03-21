# TASK: Design Upgrade — AI Daily (AI 日报)

## Objective
Transform from plain newspaper layout to a **premium news aggregator** using shadcn/ui. Think: The Verge's clean typography meets Nikkei Asia's editorial design. Chinese content, modern presentation.

## ⚠️ CRITICAL: Preserve All Functionality
- Report listing on homepage with date, weekday, tweet/user counts
- Topic previews (first 2 topics, first 2 items each)
- "阅读完整日报 →" links to /[date] detail pages
- Dynamic [date]/page.tsx detail page
- FeedbackWidget, AdSense, SEO metadata, JSON-LD
- Privacy, Terms pages
- All data from reports.ts unchanged
- Header, Footer components

## Step 1: Install Dependencies

```bash
npx shadcn@latest init --defaults
npx shadcn@latest add button card badge separator
npm install next-themes lucide-react
npx shadcn@latest add sonner
```

## Step 2: Design System

### Brand: Editorial Blue-Black
- Brand: oklch(0.50 0.18 260) — deep editorial blue
- Brand muted: brand / 8%
- This is a news/media site, so the brand should be subtle and authoritative

### Color Palette (oklch)
Light mode:
- Background: pure white
- Foreground: ink-dark oklch(0.14 0 0)
- Cards: white with subtle border
- Muted-foreground: warm gray for secondary text
- Borders: subtle

Dark mode:
- Background: near-black
- Cards: dark with subtle border
- Text: off-white

### Typography
- Keep Plus Jakarta Sans headings + Inter body
- Headlines: larger, bolder (this is a newspaper!)
- Article text: good line-height for readability
- Date badges: monospace-like feel

## Step 3: Component Redesign

### layout.tsx
- ThemeProvider + Toaster
- Keep AdSense exactly as-is
- Dark mode support

### Header
- Sticky, backdrop-blur, border-b
- Logo: "📰 AI 日报" — font-heading font-bold text-brand
- ThemeToggle button
- Clean, authoritative look

### Homepage (page.tsx)
- Hero section:
  - "📰 AI 日报" — text-4xl font-bold
  - Subtitle: text-muted-foreground
  - Source description: text-xs text-muted-foreground
  - Stagger fade-up animation

- Report cards:
  - Use shadcn Card component
  - Date header: brand bg badge for date, muted text for weekday/counts
  - Topic previews: better typography, proper hierarchy
  - "阅读完整日报 →" link: text-brand with hover underline
  - Cards: hover shadow transition
  - Stagger entrance animation or scroll-triggered fade-in

### [date]/page.tsx detail
- Read the full file first to understand structure
- Upgrade with Card components for topics
- Better tag badges (shadcn Badge)
- Source links styled properly
- Back link: text-brand

### About section
- Clean typography
- Brand color for strong text

### Footer
- Minimal, border-t
- Brand color hover on links

### FeedbackWidget
- Brand color (editorial blue) button
- Card-based modal

## Step 4: Dark Mode
- ThemeProvider + ThemeToggle
- Report cards look good in dark (proper card bg, borders)
- Date badges visible in both modes
- Tag badges work in both modes

## Step 5: Animations
- Hero: stagger fade-up
- Report cards: scroll-triggered or entrance stagger
- Card hover: shadow + subtle lift
- Links: smooth color transition
- Page transitions: fade-in for main content

## Step 6: Build
```bash
npm run build
```
Must build cleanly.
