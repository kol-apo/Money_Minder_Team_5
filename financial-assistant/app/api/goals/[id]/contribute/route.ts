import { type NextRequest, NextResponse } from "next/server"
import { contributeToSavingsGoal } from "@/lib/financial"
import { getUserFromRequest } from "@/lib/middleware"

// Contribute to a savings goal
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goalId = params.id
    const { amount } = await req.json()

    // Validate input
    if (amount === undefined || amount <= 0) {
      return NextResponse.json({ error: "A positive contribution amount is required" }, { status: 400 })
    }

    const success = await contributeToSavingsGoal(goalId, user.id, amount)

    return NextResponse.json({ success })
  } catch (error: any) {
    console.error("Contribute to savings goal error:", error)
    return NextResponse.json({ error: error.message || "Failed to contribute to savings goal" }, { status: 500 })
  }
}

