import { type NextRequest, NextResponse } from "next/server"
import { getFinancialSummary, updateFinancialSummary } from "@/lib/financial"
import { getUserFromRequest } from "@/lib/middleware"

// Get financial summary for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const summary = await getFinancialSummary(user.id)
    return NextResponse.json({ summary })
  } catch (error: any) {
    console.error("Get financial summary error:", error)
    return NextResponse.json({ error: error.message || "Failed to get financial summary" }, { status: 500 })
  }
}

// Update financial summary
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { income, expenses } = await req.json()

    // Validate input
    if (income === undefined && expenses === undefined) {
      return NextResponse.json({ error: "At least one of income or expenses must be provided" }, { status: 400 })
    }

    const success = await updateFinancialSummary(user.id, { income, expenses })

    if (success) {
      const updatedSummary = await getFinancialSummary(user.id)
      return NextResponse.json({ summary: updatedSummary })
    } else {
      return NextResponse.json({ error: "No changes were made" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Update financial summary error:", error)
    return NextResponse.json({ error: error.message || "Failed to update financial summary" }, { status: 500 })
  }
}

