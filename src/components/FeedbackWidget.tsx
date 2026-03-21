"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      {/* Floating button */}
      <Button
        onClick={() => setOpen(!open)}
        aria-label="Send feedback"
        size="icon-lg"
        className="fixed bottom-5 right-5 z-50 size-12 rounded-full bg-brand text-brand-foreground shadow-lg transition-transform hover:scale-110 hover:bg-brand/90"
      >
        {open ? <X className="size-5" /> : <MessageSquare className="size-5" />}
      </Button>

      {/* Modal */}
      {open && (
        <Card className="fixed bottom-20 right-5 z-50 w-80 animate-fade-up shadow-2xl">
          {status === "success" ? (
            <CardContent className="py-8 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="font-semibold text-foreground">Thanks!</p>
              <p className="text-sm text-muted-foreground">We&apos;ll review your feedback.</p>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-sm">Send Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={3}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email (optional, for replies)"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
                {status === "error" && <p className="text-xs text-destructive">Something went wrong. Try again.</p>}
                <Button
                  type="submit"
                  disabled={status === "loading" || !message.trim()}
                  className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  {status === "loading" ? "Sending..." : "Send Feedback"}
                </Button>
              </CardContent>
            </form>
          )}
        </Card>
      )}
    </>
  );
}
