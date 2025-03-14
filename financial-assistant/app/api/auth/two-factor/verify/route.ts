import { type NextRequest, NextResponse } from "next/server"
import { verifyTwoFactorLogin } from "@/utils/auth-service"
import { cookies } from "next/headers"

/**
 * Two-Factor Authentication Verification API Endpoint
 *
 * This endpoint verifies a 2FA code during login and completes
 * the authentication process.
 */

export async function POST(req: NextRequest) {
  try {
    const { userId, code } = await req.json()

    if (!userId || !code) {
      return NextResponse.json({ error: "User ID and verification code are required" }, { status: 400 })
    }

    const result = await verifyTwoFactorLogin(userId, code)

    // Set the token as a cookie
    cookies().set({
      name: "auth_token",
      value: result.token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
    })

    return NextResponse.json({ user: result.user })
  } catch (error: any) {
    console.error("2FA verification error:", error)
    return NextResponse.json({ error: error.message || "Failed to verify two-factor authentication" }, { status: 401 })
  }
}

