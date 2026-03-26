import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "AI 日报 — 每日 AI 行业情报";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ background: "linear-gradient(180deg, #f2eadc 0%, #ebdfcc 100%)", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "serif", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, #7d1111, #151515)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, #151515, #7d1111)" }} />
        <div style={{ fontSize: 72, fontWeight: 900, color: "#151515", marginBottom: 8, letterSpacing: "0.02em" }}>AI 日报</div>
        <div style={{ fontSize: 24, color: "#645d54", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 24 }}>每日 AI 行业情报</div>
        <div style={{ width: 120, height: 3, background: "#7d1111", marginBottom: 24 }} />
        <div style={{ fontSize: 20, color: "#302922", fontFamily: "sans-serif" }}>趋势 · 工具 · 信号 · 中文解读</div>
        <div style={{ marginTop: 32, padding: "8px 24px", fontSize: 16, color: "#645d54", fontFamily: "monospace", letterSpacing: "0.06em", border: "1px solid rgba(0,0,0,0.16)" }}>daily.toolboxlite.com</div>
      </div>
    ),
    { ...size }
  );
}
