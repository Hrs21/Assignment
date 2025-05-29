import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (
          req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname === "/login" ||
          req.nextUrl.pathname === "/register" ||
          req.nextUrl.pathname.startsWith("/api/auth") ||
          req.nextUrl.pathname.startsWith("/api/register") ||
          req.nextUrl.pathname.startsWith("/api/seed")
        ) {
          return true
        }

        // Require authentication for protected routes
        if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin")) {
          return !!token
        }

        // Admin routes require admin role
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin"
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
