"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  password: z.string().min(8).max(100),
  company: z.string().max(120).optional().or(z.literal("")),
});

export async function createAccount(input: z.infer<typeof signupSchema>) {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid details." };
  }
  const { name, email, password, company } = parsed.data;
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { ok: false as const, error: "An account with this email already exists." };

  await db.user.create({
    data: {
      name,
      email,
      company: company || null,
      role: "USER",
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
  await db.auditLog.create({
    data: { action: "user.signup", entity: `User:${email}` },
  });
  return { ok: true as const };
}
