"use client";

import * as React from "react";

/** Footer + homepage newsletter capture, posting to /api/newsletter. */
export function NewsletterForm({ large }: { large?: boolean }) {
  const [state, setState] = React.useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className={`text-gold ${large ? "text-base" : "text-sm"}`} role="status">
        ✦ Welcome to the list. First letter arrives Friday.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
      <label htmlFor={large ? "newsletter-lg" : "newsletter"} className="sr-only">
        Email address
      </label>
      <input
        id={large ? "newsletter-lg" : "newsletter"}
        name="email"
        type="email"
        required
        placeholder="you@company.com"
        className={`min-w-0 flex-1 rounded-full border border-border bg-surface px-5 text-foreground placeholder:text-faint focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 ${
          large ? "h-13 text-base" : "h-11 text-sm"
        }`}
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className={`shrink-0 rounded-full bg-gold font-medium text-on-gold transition-all hover:bg-gold-bright disabled:opacity-50 ${
          large ? "h-13 px-7" : "h-11 px-5 text-sm"
        }`}
      >
        {state === "loading" ? "…" : "Subscribe"}
      </button>
      {state === "error" && (
        <p role="alert" className="sr-only">
          Subscription failed, please try again.
        </p>
      )}
    </form>
  );
}
