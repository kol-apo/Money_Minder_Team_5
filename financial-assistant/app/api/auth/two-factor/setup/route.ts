import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/utils/auth-middleware"
import { enableTwoFactor } from "@/utils/auth-service"

/**
 * Two-Factor Authentication Setup API Endpoint
 *
 * This endpoint initiates the 2FA setup process by generating
 * a secret key for the user.
 */

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await enableTwoFactor(user.id)

    return NextResponse.json({ secret: result.secret })
  } catch (error: any) {
    console.error("2FA setup error:", error)
    return NextResponse.json({ error: error.message || "Failed to set up two-factor authentication" }, { status: 500 })
  }
}

