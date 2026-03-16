import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "AI 日报 — 每日 AI 行业情报";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>📰</div>
        <div style={{ fontSize: 60, fontWeight: 800, color: "#ffffff", marginBottom: 12 }}>AI 日报</div>
        <div style={{ fontSize: 26, color: "rgba(255,255,255,0.7)" }}>每日 AI 行业情报 · 趋势 · 机会</div>
        <div style={{ marginTop: 32, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 28px", fontSize: 20, color: "rgba(255,255,255,0.8)" }}>ai.toolboxlite.com</div>
      </div>
    ),
    { ...size }
  );
}
