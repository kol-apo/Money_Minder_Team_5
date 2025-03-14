import { type NextRequest, NextResponse } from "next/server"
import { verifyEmail } from "@/utils/auth-service"

/**
 * Email Verification API Endpoint
 *
 * This endpoint verifies a user's email address using the token
 * from the verification email.
 */

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ success: false, message: "Verification token is required" }, { status: 400 })
    }

    const result = await verifyEmail(token)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: result.message || "Verification failed" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Email verification error:", error)
    return NextResponse.json({ success: false, message: error.message || "Verification failed" }, { status: 500 })
  }
}

