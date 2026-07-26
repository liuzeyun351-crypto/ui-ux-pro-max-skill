import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { SignInForm } from "./signin-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Access your Aurum dashboard — bookings, contracts, escrow and messages.",
};

export default function SignInPage() {
  return (
    <AuthShell>
      {/* SignInForm reads the callbackUrl search param, so it renders on the client */}
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
