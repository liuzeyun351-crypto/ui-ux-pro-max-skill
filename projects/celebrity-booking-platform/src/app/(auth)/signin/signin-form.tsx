"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";

const DEMO_ACCOUNTS = [
  { role: "Client", email: "client@aurum.demo", note: "Bookings, invoices, messages" },
  { role: "Talent", email: "talent@aurum.demo", note: "Burna Boy's dashboard" },
  { role: "Manager", email: "manager@aurum.demo", note: "Agency roster view" },
  { role: "Admin", email: "admin@aurum.demo", note: "Full platform console" },
];

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<string | null>(null);

  async function doSignIn(email: string, password: string, key: string) {
    setLoading(key);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(null);
    if (res?.error) {
      setError("Those credentials didn't match — try a demo account below.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await doSignIn(String(fd.get("email")), String(fd.get("password")), "form");
  }

  return (
    <div>
      <p className="kicker mb-3">Welcome back</p>
      <h1 className="font-display text-4xl font-medium tracking-tight text-foreground">
        Sign in to Aurum
      </h1>
      <p className="mt-3 text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="text-gold underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
        <FieldError>{error}</FieldError>
        <Button type="submit" size="lg" className="w-full" disabled={loading !== null}>
          {loading === "form" ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-10">
        <p className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-faint">
          <span aria-hidden className="h-px flex-1 bg-border" />
          Explore with a demo persona
          <span aria-hidden className="h-px flex-1 bg-border" />
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {DEMO_ACCOUNTS.map((d) => (
            <button
              key={d.email}
              type="button"
              disabled={loading !== null}
              onClick={() => doSignIn(d.email, "aurum-demo", d.email)}
              className="rounded-[var(--radius-md)] border border-border bg-surface p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50 disabled:opacity-50"
            >
              <span className="block text-sm font-medium text-foreground">
                {loading === d.email ? "Entering…" : d.role}
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-faint">{d.note}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-faint">
          All demo accounts use the password <code className="text-gold">aurum-demo</code>.
        </p>
      </div>
    </div>
  );
}
