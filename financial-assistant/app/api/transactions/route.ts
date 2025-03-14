import { type NextRequest, NextResponse } from "next/server"
import { getTransactions, addTransaction } from "@/lib/financial"
import { getUserFromRequest } from "@/lib/middleware"

// Get all transactions for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactions = await getTransactions(user.id)
    return NextResponse.json({ transactions })
  } catch (error: any) {
    console.error("Get transactions error:", error)
    return NextResponse.json({ error: error.message || "Failed to get transactions" }, { status: 500 })
  }
}

// Add a new transaction
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { date, description, amount, category } = await req.json()

    // Validate input
    if (!date || !description || amount === undefined || !category) {
      return NextResponse.json({ error: "Date, description, amount, and category are required" }, { status: 400 })
    }

    const transaction = await addTransaction(user.id, date, description, amount, category)

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error: any) {
    console.error("Add transaction error:", error)
    return NextResponse.json({ error: error.message || "Failed to add transaction" }, { status: 500 })
  }
}

