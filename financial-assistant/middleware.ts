import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

// Paths that require authentication
const protectedPaths = ["/dashboard", "/spending", "/advisor", "/reports", "/profile"]

// Paths that should redirect to dashboard if already authenticated
const authPaths = ["/login", "/register", "/setup"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token from cookies
  const token = request.cookies.get("auth_token")?.value

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path))

  // If the path requires authentication and there's no token, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // If the user is already authenticated and tries to access auth paths, redirect to dashboard
  if (isAuthPath && token) {
    try {
      // Verify the token
      verifyToken(token)

      // If verification succeeds, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch (error) {
      // If token verification fails, continue to the auth page
      // This will allow the user to log in again
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (they handle their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}

