import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true, user })
  } catch (error: any) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      { authenticated: false, error: error.message || "Authentication check failed" },
      { status: 500 },
    )
  }
}

