import Link from "next/link";

export default function Footer() {
  return (
    <footer className="np-footer">
      <span>&copy; {new Date().getFullYear()} AI 日报</span>
      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/privacy">隐私政策</Link>
        <Link href="/terms">使用条款</Link>
      </div>
    </footer>
  );
}
