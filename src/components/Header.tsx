import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-[family-name:var(--font-heading)] text-xl font-bold text-brand tracking-tight transition-colors hover:text-brand/80">
          AI 日报
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/" className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">首页</Link>
          <Link href="/privacy" className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">隐私</Link>
          <Separator orientation="vertical" className="mx-1 h-5" />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
