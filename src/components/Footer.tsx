import Link from "next/link";
export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-8 text-sm text-ink-500 sm:flex-row sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} AI 日报 · 每日 AI 行业情报</p>
        <div className="flex gap-2">
          <Link href="/" className="rounded-lg px-3 py-3 transition-colors hover:text-ink-900">首页</Link>
          <Link href="/privacy" className="rounded-lg px-3 py-3 transition-colors hover:text-ink-900">隐私政策</Link>
          <Link href="/terms" className="rounded-lg px-3 py-3 transition-colors hover:text-ink-900">使用条款</Link>
        </div>
      </div>
    </footer>
  );
}
