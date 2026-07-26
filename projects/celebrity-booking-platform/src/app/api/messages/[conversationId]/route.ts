import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Message feed for one conversation, polled by the chat client.
 * A production deployment swaps this polling loop for a WebSocket/SSE relay
 * (see docs/ARCHITECTURE.md → Real-time) with the same payload shape.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { conversationId } = await params;

  const participant = await db.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: session.user.id } },
  });
  if (!participant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [messages, others] = await Promise.all([
    db.message.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, name: true, role: true } } },
      orderBy: { createdAt: "asc" },
      take: 200,
    }),
    db.conversationParticipant.findMany({
      where: { conversationId, userId: { not: session.user.id } },
      select: { lastReadAt: true },
    }),
  ]);

  // Read receipt: the furthest point any other participant has read
  const otherLastRead = others.reduce<string | null>((acc, p) => {
    if (!p.lastReadAt) return acc;
    const iso = p.lastReadAt.toISOString();
    return !acc || iso > acc ? iso : acc;
  }, null);

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      body: m.body,
      kind: m.kind,
      createdAt: m.createdAt.toISOString(),
      mine: m.senderId === session.user.id,
      sender: m.sender.name,
    })),
    otherLastRead,
  });
}
