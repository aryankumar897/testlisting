import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/dashboard/user/:path*",
    "/dashboard/admin/:path*",
    "/dashboard/agent/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
    "/api/agent/:path*",
  ],
};

export default withAuth(
  async function middleware(req) {
    const url = req.nextUrl.pathname;
    const token = req.nextauth?.token;
    const userRole = token?.user?.role;

    // Admin routes - only accessible by admin
    if (url?.includes("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // User routes - only accessible by user
    if (url?.includes("/user") && userRole !== "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Agent routes - only accessible by agent
    if (url?.includes("/agent") && userRole !== "agent") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (!token) {
          return false;
        }
        return true;
      },
    },
  }
);