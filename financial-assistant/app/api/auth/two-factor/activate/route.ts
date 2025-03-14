import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/utils/auth-middleware"
import { activateTwoFactor } from "@/utils/auth-service"

/**
 * Two-Factor Authentication Activation API Endpoint
 *
 * This endpoint activates 2FA for a user after they've verified
 * their setup with a valid code.
 */

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 })
    }

    const result = await activateTwoFactor(user.id, code)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("2FA activation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to activate two-factor authentication" },
      { status: 500 },
    )
  }
}

