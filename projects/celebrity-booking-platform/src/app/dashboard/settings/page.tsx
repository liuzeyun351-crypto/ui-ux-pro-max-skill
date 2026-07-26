import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/dashboard/shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldHint } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export const metadata: Metadata = { title: "Settings" };

const profileSchema = z.object({
  name: z.string().min(2).max(80),
  company: z.string().max(120).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  bio: z.string().max(400).optional().or(z.literal("")),
});

export default async function SettingsPage() {
  const session = await auth();
  const user = await db.user.findUnique({ where: { id: session!.user.id } });

  async function saveProfile(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const parsed = profileSchema.safeParse({
      name: formData.get("name"),
      company: formData.get("company") ?? "",
      phone: formData.get("phone") ?? "",
      bio: formData.get("bio") ?? "",
    });
    if (!parsed.success) return;
    await db.user.update({
      where: { id: s.user.id },
      data: {
        name: parsed.data.name,
        company: parsed.data.company || null,
        phone: parsed.data.phone || null,
        bio: parsed.data.bio || null,
      },
    });
    await db.auditLog.create({
      data: { actorId: s.user.id, action: "user.profile_updated", entity: `User:${s.user.id}` },
    });
    revalidatePath("/dashboard/settings");
  }

  async function toggleTwoFactor() {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const u = await db.user.findUnique({ where: { id: s.user.id } });
    await db.user.update({
      where: { id: s.user.id },
      data: { twoFactorEnabled: !u?.twoFactorEnabled },
    });
    revalidatePath("/dashboard/settings");
  }

  return (
    <>
      <PageHeader title="Settings" lead="Profile, security and preferences." />

      <div className="grid grid-cols-1 max-w-4xl gap-6 lg:grid-cols-[1.4fr_1fr]">
        <form
          action={saveProfile}
          className="rounded-[var(--radius-xl)] border border-border bg-surface p-7"
        >
          <h2 className="mb-6 font-display text-xl font-medium text-foreground">Profile</h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" defaultValue={user?.name} required />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" defaultValue={user?.company ?? ""} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={user?.phone ?? ""} />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">About</Label>
              <Textarea id="bio" name="bio" defaultValue={user?.bio ?? ""} rows={3} />
              <FieldHint>Shared with managers when you submit a request.</FieldHint>
            </div>
            <Button type="submit">Save changes</Button>
          </div>
        </form>

        <div className="space-y-6">
          <section className="rounded-[var(--radius-xl)] border border-border bg-surface p-7">
            <h2 className="mb-4 font-display text-xl font-medium text-foreground">Security</h2>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  TOTP app-based second factor. (Demo toggle — enrollment flow ships with the
                  production auth provider.)
                </p>
              </div>
              <form action={toggleTwoFactor}>
                <button
                  type="submit"
                  role="switch"
                  aria-checked={user?.twoFactorEnabled}
                  aria-label="Toggle two-factor authentication"
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    user?.twoFactorEnabled ? "bg-gold" : "bg-surface-raised border border-border"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
                      user?.twoFactorEnabled ? "left-[calc(100%-1.375rem)]" : "left-0.5"
                    }`}
                  />
                </button>
              </form>
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground">Account email</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                {user?.email} <Badge tone="success">Verified</Badge>
              </p>
            </div>
          </section>

          <section className="rounded-[var(--radius-xl)] border border-danger/30 bg-surface p-7">
            <h2 className="mb-2 font-display text-xl font-medium text-danger">Danger zone</h2>
            <p className="text-xs leading-relaxed text-muted">
              Export your data or close the account. Demo accounts reset with each database seed.
            </p>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" size="sm" type="button">
                Export data
              </Button>
              <Button variant="danger" size="sm" type="button">
                Close account
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
