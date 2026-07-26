import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { ChatThread } from "@/components/dashboard/chat-thread";
import { Avatar } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn, relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const session = await auth();
  const { c } = await searchParams;

  const conversations = await db.conversation.findMany({
    where: { participants: { some: { userId: session!.user.id } } },
    include: {
      participants: { include: { user: { select: { id: true, name: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  const activeId = c ?? conversations[0]?.id;
  const active = conversations.find((conv) => conv.id === activeId);
  const counterpart = active?.participants.find((p) => p.user.id !== session!.user.id)?.user;

  return (
    <>
      <PageHeader
        title="Messages"
        lead="Every commitment on the record — chat runs through verified management channels."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <nav aria-label="Conversations" className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
          <ul className="divide-y divide-border">
            {conversations.map((conv) => {
              const other = conv.participants.find((p) => p.user.id !== session!.user.id)?.user;
              const last = conv.messages[0];
              const isActive = conv.id === activeId;
              return (
                <li key={conv.id}>
                  <Link
                    href={`/dashboard/messages?c=${conv.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "flex gap-3 p-4 transition-colors",
                      isActive ? "bg-gold/8" : "hover:bg-surface-raised"
                    )}
                  >
                    <Avatar name={other?.name ?? "?"} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={cn("truncate text-sm", isActive ? "font-semibold text-gold" : "font-medium text-foreground")}>
                          {other?.name ?? "Conversation"}
                        </p>
                        {last && (
                          <span className="shrink-0 text-[10px] text-faint">
                            {relativeTime(last.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted">{last?.body ?? conv.subject}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
            {conversations.length === 0 && (
              <li className="p-8 text-center text-sm text-faint">
                Conversations open automatically with each booking.
              </li>
            )}
          </ul>
        </nav>

        {active && counterpart ? (
          <ChatThread
            conversationId={active.id}
            subject={active.subject}
            counterpartName={counterpart.name}
          />
        ) : (
          <div className="grid place-items-center rounded-[var(--radius-xl)] border border-dashed border-border-strong p-16 text-sm text-faint">
            Select a conversation
          </div>
        )}
      </div>
    </>
  );
}
