import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/middleware"
import { addTransaction, addSavingsGoal, updateFinancialSummary } from "@/lib/financial"

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { income, expenses, transactions, savingsGoals } = await req.json()

    // Update financial summary
    if (income !== undefined || expenses !== undefined) {
      await updateFinancialSummary(user.id, { income, expenses })
    }

    // Import transactions
    let importedTransactions = 0
    if (transactions && Array.isArray(transactions)) {
      for (const tx of transactions) {
        if (tx.date && tx.description && tx.amount !== undefined && tx.category) {
          await addTransaction(user.id, tx.date, tx.description, tx.amount, tx.category)
          importedTransactions++
        }
      }
    }

    // Import savings goals
    let importedGoals = 0
    if (savingsGoals && Array.isArray(savingsGoals)) {
      for (const goal of savingsGoals) {
        if (goal.name && goal.target !== undefined && goal.deadline) {
          const newGoal = await addSavingsGoal(user.id, goal.name, goal.target, goal.deadline)

          // If the goal has progress, update it
          if (goal.current && goal.current > 0) {
            await updateSavingsGoal(newGoal.id, user.id, { current: goal.current })
          }

          importedGoals++
        }
      }
    }

    return NextResponse.json({
      success: true,
      imported: {
        transactions: importedTransactions,
        goals: importedGoals,
        financialSummary: income !== undefined || expenses !== undefined,
      },
    })
  } catch (error: any) {
    console.error("Migration error:", error)
    return NextResponse.json({ error: error.message || "Migration failed" }, { status: 500 })
  }
}

