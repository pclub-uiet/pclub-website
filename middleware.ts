import withAuth from "next-auth/middleware";  // A NextAuth helper that wraps our middleware with built-in session handling
import { NextResponse } from "next/server";

export default withAuth(
    // The middlware function will only be invoked if the authorized callback returns true
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public/auth routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/signup" ||
          pathname === "/"
        ) {
          return true;
        }

        // Protect these routes
        const protectedPaths = ["/admin", "/event", "/member", "/blog", "/project"];
        if (protectedPaths.includes(pathname)) {
          if (!token) return false;
          if (!token.approved) return false;
          return true;
        }

        return !!token;     //  !! (double NOT) operator is a shorthand trick to convert any value into a strict boolean
      },
    },
  }
);

export const config = {
  matcher: ["/admin", "/event", "/member", "/blog", "/project"],
};
