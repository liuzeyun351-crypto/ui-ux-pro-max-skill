"use client";

import * as React from "react";
import { sendMessage, markConversationRead } from "@/lib/actions/messages";
import { Avatar } from "@/components/ui/avatar";
import { cn, relativeTime } from "@/lib/utils";

interface WireMessage {
  id: string;
  body: string;
  kind: string;
  createdAt: string;
  mine: boolean;
  sender: string;
}

/**
 * Conversation thread. Polls the feed every 5s (production swaps this for a
 * WebSocket relay — the payload contract is identical) and reports read
 * receipts via lastReadAt.
 */
export function ChatThread({
  conversationId,
  subject,
  counterpartName,
}: {
  conversationId: string;
  subject: string;
  counterpartName: string;
}) {
  const [messages, setMessages] = React.useState<WireMessage[]>([]);
  const [otherLastRead, setOtherLastRead] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const stickBottom = React.useRef(true);

  const load = React.useCallback(async () => {
    const res = await fetch(`/api/messages/${conversationId}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { messages: WireMessage[]; otherLastRead: string | null };
    setMessages(data.messages);
    setOtherLastRead(data.otherLastRead);
  }, [conversationId]);

  React.useEffect(() => {
    load();
    markConversationRead(conversationId);
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load, conversationId]);

  React.useEffect(() => {
    if (stickBottom.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setDraft("");
    // optimistic append
    setMessages((m) => [
      ...m,
      {
        id: `tmp-${Date.now()}`,
        body,
        kind: "text",
        createdAt: new Date().toISOString(),
        mine: true,
        sender: "You",
      },
    ]);
    await sendMessage({ conversationId, body });
    await load();
    setSending(false);
  }

  const lastMine = [...messages].reverse().find((m) => m.mine);
  const lastMineRead =
    lastMine && otherLastRead ? otherLastRead >= lastMine.createdAt : false;

  return (
    <div className="flex h-[34rem] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <Avatar name={counterpartName} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{counterpartName}</p>
          <p className="truncate text-xs text-faint">{subject}</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-success">
          <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-success" />
          Secure channel
        </span>
      </header>

      <div
        ref={scrollRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          stickBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
        }}
        className="flex-1 space-y-4 overflow-y-auto px-5 py-6"
        aria-live="polite"
      >
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-soft",
                m.mine
                  ? "rounded-br-md bg-gold text-on-gold"
                  : "rounded-bl-md border border-border bg-surface-raised text-foreground"
              )}
            >
              <p className="whitespace-pre-wrap">{m.body}</p>
              <p
                className={cn(
                  "mt-1 text-right text-[10px]",
                  m.mine ? "text-on-gold/60" : "text-faint"
                )}
              >
                {relativeTime(m.createdAt)}
              </p>
            </div>
          </div>
        ))}
        {lastMine && (
          <p className="text-right text-[10px] uppercase tracking-[0.14em] text-faint">
            {lastMineRead ? "Read ✓✓" : "Delivered ✓"}
          </p>
        )}
        {messages.length === 0 && (
          <p className="pt-16 text-center text-sm text-faint">
            Opening the channel — say hello.
          </p>
        )}
      </div>

      <form onSubmit={onSend} className="flex items-end gap-3 border-t border-border p-4">
        <button
          type="button"
          aria-label="Attach file (demo)"
          className="grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-raised hover:text-gold"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend(e);
            }
          }}
          rows={1}
          placeholder="Write a message…"
          aria-label="Message"
          className="max-h-32 min-h-11 flex-1 resize-none rounded-[var(--radius-md)] border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-faint focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-gold text-on-gold transition-all hover:bg-gold-bright disabled:opacity-40"
          aria-label="Send message"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m22 2-7 20-4-9-9-4z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </form>
    </div>
  );
}
