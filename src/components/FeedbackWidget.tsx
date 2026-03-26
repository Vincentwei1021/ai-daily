"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), email: email.trim() || undefined, url: window.location.href, timestamp: new Date().toISOString() }),
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(() => { setOpen(false); setStatus("idle"); setMessage(""); setEmail(""); }, 2000);
      } else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Send feedback"
        className="feedback-btn"
      >
        {open ? <X className="size-5" /> : <MessageSquare className="size-5" />}
      </button>

      {open && (
        <div className="feedback-card animate-fade-up">
          {status === "success" ? (
            <div style={{ padding: "32px 16px", textAlign: "center" }}>
              <p style={{ fontSize: 24, marginBottom: 8 }}>🎉</p>
              <p style={{ fontWeight: 700, fontFamily: "var(--font-serif)" }}>Thanks!</p>
              <p style={{ fontSize: 12, color: "var(--np-muted)", fontFamily: "var(--font-sans)" }}>We&apos;ll review your feedback.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ padding: "12px 14px 6px", fontWeight: 700, fontSize: 13, fontFamily: "var(--font-serif)" }}>
                Send Feedback
              </div>
              <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={3}
                  required
                  className="feedback-input"
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="feedback-input"
                />
                {status === "error" && <p style={{ fontSize: 11, color: "#dc2626", margin: 0 }}>Something went wrong. Try again.</p>}
                <button
                  type="submit"
                  disabled={status === "loading" || !message.trim()}
                  className="feedback-submit"
                >
                  {status === "loading" ? "Sending..." : "Send Feedback"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
