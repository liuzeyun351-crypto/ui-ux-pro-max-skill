"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { createAccount } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError, FieldHint } from "@/components/ui/input";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      company: String(fd.get("company") ?? ""),
    };
    setLoading(true);
    setError(null);
    const res = await createAccount(payload);
    if (!res.ok) {
      setLoading(false);
      setError(res.error);
      return;
    }
    await signIn("credentials", { email: payload.email, password: payload.password, redirect: false });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <p className="kicker mb-3">Join the house</p>
      <h1 className="font-display text-4xl font-medium tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-3 text-sm text-muted">
        Already with us?{" "}
        <Link href="/signin" className="text-gold underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required autoComplete="name" placeholder="Ava Sinclair" />
        </div>
        <div>
          <Label htmlFor="company">Company or organization</Label>
          <Input id="company" name="company" autoComplete="organization" placeholder="Solstice Events" />
          <FieldHint>Optional — helps managers respond faster.</FieldHint>
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </div>
        <FieldError>{error}</FieldError>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-[11px] leading-relaxed text-faint">
          By continuing you agree to the{" "}
          <Link href="/legal/terms" className="underline-offset-4 hover:text-gold hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline-offset-4 hover:text-gold hover:underline">
            Privacy Policy
          </Link>
          . This is a demonstration platform — do not use real credentials.
        </p>
      </form>
    </div>
  );
}
