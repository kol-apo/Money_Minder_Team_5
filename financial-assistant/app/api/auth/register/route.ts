import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, currency } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Register the user
    const user = await registerUser(name, email, password, currency || "USD")

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}

