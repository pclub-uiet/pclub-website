import withAuth from "next-auth/middleware";    //  A NextAuth helper that wraps our middleware with built-in session handling
import { NextResponse } from "next/server";

export default withAuth(
    // The middlware function will only be invoked if the authorized callback returns true
    function middleware() {
        return NextResponse.next();
    },

    {
        callbacks: {
            authorized: async ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // allow auth related routes
                if (pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/signup") {
                    return true;
                }

                // public paths
                if (pathname === "/") {
                    return true;
                }

                if ((pathname === "/admin" || pathname === "/event" || pathname === "/member" || pathname === "/blog" || pathname === "/project") && (token?.approved !== true)) {
                    return false;
                }

                return !!token;   //  !! (double NOT) operator is a shorthand trick to convert any value into a strict boolean
            }
        }
    }
)


export const config = {
    matcher: [
        '/admin',
        '/event',
        '/member',
        '/blog',
        '/project'
    ]
}