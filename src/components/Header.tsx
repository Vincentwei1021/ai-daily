import Link from "next/link";
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-200 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-[family-name:var(--font-heading)] text-xl font-bold text-ink-900 tracking-tight">📰 AI 日报</Link>
        <div className="flex items-center gap-1">
          <Link href="/" className="rounded-lg px-3 py-3 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900">首页</Link>
          <Link href="/privacy" className="rounded-lg px-3 py-3 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900">隐私</Link>
        </div>
      </nav>
    </header>
  );
}
