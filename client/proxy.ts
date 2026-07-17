import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/admin"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read cookies directly from the request
  const token = req.cookies.get("library_token")?.value || null;

  const userCookie = req.cookies.get("user_data")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Redirect unauthenticated users
  if (isProtected && (!token || !user)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Prevent logged-in users from visiting login/register
  if (
    token &&
    user &&
    (pathname === "/login" || pathname === "/register")
  ) {
    if (user.role === "Admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Student cannot access admin pages
  if (
    pathname.startsWith("/admin") &&
    user?.role !== "Admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Admin cannot access student pages
  if (
    pathname.startsWith("/dashboard") &&
    user?.role === "Admin"
  ) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};