import { type NextRequest, NextResponse } from "next/server"
import { getSavingsGoals, addSavingsGoal } from "@/lib/financial"
import { getUserFromRequest } from "@/lib/middleware"

// Get all savings goals for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goals = await getSavingsGoals(user.id)
    return NextResponse.json({ goals })
  } catch (error: any) {
    console.error("Get savings goals error:", error)
    return NextResponse.json({ error: error.message || "Failed to get savings goals" }, { status: 500 })
  }
}

// Add a new savings goal
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, target, deadline } = await req.json()

    // Validate input
    if (!name || target === undefined || !deadline) {
      return NextResponse.json({ error: "Name, target amount, and deadline are required" }, { status: 400 })
    }

    const goal = await addSavingsGoal(user.id, name, target, deadline)

    return NextResponse.json({ goal }, { status: 201 })
  } catch (error: any) {
    console.error("Add savings goal error:", error)
    return NextResponse.json({ error: error.message || "Failed to add savings goal" }, { status: 500 })
  }
}

