import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit } from "@/lib/security/rate-limit";

/**
 * Route guards (RBAC) + basic rate limiting on API surface.
 * Roles: USER < TALENT/MANAGER < ADMIN. See src/lib/types.ts.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate-limit API + auth endpoints per IP
  if (pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const limit = pathname.startsWith("/api/auth") ? 30 : 120;
    if (!rateLimit(`${ip}:${pathname.split("/")[2]}`, limit, 60_000)) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Retry-After": "60" },
      });
    }
    return NextResponse.next();
  }

  const needsAuth =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/talent") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/book/");

  if (!needsAuth) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    // next-auth v5 cookie names
    cookieName: process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
  });

  if (!token) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = (token.role as string) ?? "USER";
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/talent") && !["TALENT", "MANAGER", "ADMIN"].includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/talent/:path*", "/admin/:path*", "/book/:path*", "/api/:path*"],
};
