import Link from "next/link";

export default function Header() {
  return (
    <header className="np-header">
      <nav>
        <Link href="/" className="logo">AI 日报</Link>
      </nav>
    </header>
  );
}
