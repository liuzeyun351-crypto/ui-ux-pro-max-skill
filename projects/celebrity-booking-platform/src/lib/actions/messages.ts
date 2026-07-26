"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const sendSchema = z.object({
  conversationId: z.string().min(1),
  body: z.string().min(1).max(4000),
});

export async function sendMessage(input: z.infer<typeof sendSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Not signed in" };
  const parsed = sendSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid message" };

  // Sender must be a participant
  const participant = await db.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId: parsed.data.conversationId,
        userId: session.user.id,
      },
    },
  });
  if (!participant) return { ok: false as const, error: "Not part of this conversation" };

  const message = await db.message.create({
    data: {
      conversationId: parsed.data.conversationId,
      senderId: session.user.id,
      body: parsed.data.body.trim(),
    },
  });
  await Promise.all([
    db.conversation.update({
      where: { id: parsed.data.conversationId },
      data: { updatedAt: new Date() },
    }),
    db.conversationParticipant.update({
      where: { id: participant.id },
      data: { lastReadAt: new Date() },
    }),
  ]);
  return { ok: true as const, id: message.id };
}

export async function markConversationRead(conversationId: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await db.conversationParticipant.updateMany({
    where: { conversationId, userId: session.user.id },
    data: { lastReadAt: new Date() },
  });
}
