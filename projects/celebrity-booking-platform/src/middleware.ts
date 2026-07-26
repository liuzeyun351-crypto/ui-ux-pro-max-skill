import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit } from "@/lib/security/rate-limit";

/**
 * Route guards (RBAC) + basic rate limiting on API surface.
 * Roles: USER < TALENT/MANAGER < ADMIN. See src/lib/types.ts.
 */
/** Anything with a file extension is a static asset, never a guarded route. */
const STATIC_ASSET = /\.[a-z0-9]{2,5}$/i;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // A guarded prefix must never swallow files served from public/. Talent
  // photography lives at /media/talent/** precisely to stay clear of the
  // /talent console namespace, but this guard makes the rule structural: an
  // asset can never be redirected to /signin, which would break it silently.
  if (STATIC_ASSET.test(pathname)) return NextResponse.next();

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

  // Auth.js prefixes the session cookie with `__Secure-` only on HTTPS, which is
  // a property of the request, not of NODE_ENV. Keying it off NODE_ENV locks
  // every signed-in user out of every console on any production deployment
  // served over plain HTTP — Docker behind a proxy, a VPS before TLS, cPanel
  // Node — because the cookie is there but read under the wrong name. Derive it
  // from the actual scheme, honouring the proxy header.
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const secureCookie = (forwardedProto ?? req.nextUrl.protocol.replace(":", "")) === "https";

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie,
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
