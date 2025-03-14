import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import { updateUserProfile } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: error.message || "Failed to get profile" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const success = await updateUserProfile(user.id, data)

    if (success) {
      // Get updated user data
      const updatedUser = await getUserFromRequest(req)
      return NextResponse.json({ user: updatedUser })
    } else {
      return NextResponse.json({ error: "No changes were made" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 })
  }
}

