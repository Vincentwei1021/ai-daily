import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="np-header">
      <nav>
        <Link href="/" className="logo">AI 日报</Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
