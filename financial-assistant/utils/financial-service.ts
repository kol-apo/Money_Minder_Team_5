import { v4 as uuidv4 } from "uuid"
import { executeQuery } from "./database-connection"

/**
 * Financial Service
 *
 * This utility handles all financial operations, including:
 * - Transactions management
 * - Savings goals
 * - Financial summaries
 */

// Type definitions
export type Transaction = {
  id: string
  userId: string
  date: string
  description: string
  amount: number
  category: string
}

export type SavingsGoal = {
  id: string
  userId: string
  name: string
  target: number
  current: number
  deadline: string
}

export type FinancialSummary = {
  income: number
  expenses: number
  balance: number
  savingsRate: number
}

/**
 * Get financial summary for a user
 *
 * @param userId - User's ID
 * @returns The user's financial summary
 */
export async function getFinancialSummary(userId: string): Promise<FinancialSummary> {
  try {
    const summaries = await executeQuery("SELECT * FROM financial_summaries WHERE user_id = ?", [userId])
    const summary = (summaries as any[])[0]

    if (!summary) {
      // Create a default summary if none exists
      await executeQuery(
        "INSERT INTO financial_summaries (user_id, income, expenses, balance, savings_rate) VALUES (?, 0, 0, 0, 0)",
        [userId],
      )

      return {
        income: 0,
        expenses: 0,
        balance: 0,
        savingsRate: 0,
      }
    }

    return {
      income: Number.parseFloat(summary.income),
      expenses: Number.parseFloat(summary.expenses),
      balance: Number.parseFloat(summary.balance),
      savingsRate: Number.parseFloat(summary.savings_rate),
    }
  } catch (error) {
    console.error("Get financial summary error:", error)
    throw error
  }
}

/**
 * Update financial summary
 *
 * @param userId - User's ID
 * @param data - Updated financial data
 * @returns Whether update was successful
 */
export async function updateFinancialSummary(userId: string, data: Partial<FinancialSummary>) {
  try {
    const { income, expenses } = data

    // Calculate balance and savings rate if income and expenses are provided
    let balance = undefined
    let savingsRate = undefined

    if (income !== undefined && expenses !== undefined) {
      balance = income - expenses
      savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
    } else if (income !== undefined) {
      // Get current expenses
      const summary = await getFinancialSummary(userId)
      balance = income - summary.expenses
      savingsRate = income > 0 ? ((income - summary.expenses) / income) * 100 : 0
    } else if (expenses !== undefined) {
      // Get current income
      const summary = await getFinancialSummary(userId)
      balance = summary.income - expenses
      savingsRate = summary.income > 0 ? ((summary.income - expenses) / summary.income) * 100 : 0
    }

    // Build the query dynamically based on provided fields
    let sql = "UPDATE financial_summaries SET "
    const params = []
    const updates = []

    if (income !== undefined) {
      updates.push("income = ?")
      params.push(income)
    }

    if (expenses !== undefined) {
      updates.push("expenses = ?")
      params.push(expenses)
    }

    if (balance !== undefined) {
      updates.push("balance = ?")
      params.push(balance)
    }

    if (savingsRate !== undefined) {
      updates.push("savings_rate = ?")
      params.push(savingsRate)
    }

    if (updates.length === 0) {
      return false // Nothing to update
    }

    updates.push("last_updated = CURRENT_TIMESTAMP")

    sql += updates.join(", ") + " WHERE user_id = ?"
    params.push(userId)

    await executeQuery(sql, params)
    return true
  } catch (error) {
    console.error("Update financial summary error:", error)
    throw error
  }
}

/**
 * Get transactions for a user
 *
 * @param userId - User's ID
 * @returns List of user's transactions
 */
export async function getTransactions(userId: string): Promise<Transaction[]> {
  try {
    const transactions = await executeQuery("SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC", [userId])

    return (transactions as any[]).map((tx) => ({
      id: tx.id,
      userId: tx.user_id,
      date: tx.date.toISOString().split("T")[0],
      description: tx.description,
      amount: Number.parseFloat(tx.amount),
      category: tx.category,
    }))
  } catch (error) {
    console.error("Get transactions error:", error)
    throw error
  }
}

/**
 * Add a transaction
 *
 * @param userId - User's ID
 * @param date - Transaction date
 * @param description - Transaction description
 * @param amount - Transaction amount (positive for income, negative for expenses)
 * @param category - Transaction category
 * @returns The created transaction
 */
export async function addTransaction(
  userId: string,
  date: string,
  description: string,
  amount: number,
  category: string,
): Promise<Transaction> {
  try {
    const transactionId = uuidv4()

    await executeQuery(
      "INSERT INTO transactions (id, user_id, date, description, amount, category) VALUES (?, ?, ?, ?, ?, ?)",
      [transactionId, userId, date, description, amount, category],
    )

    // Update financial summary
    const summary = await getFinancialSummary(userId)

    if (amount > 0) {
      // Income transaction
      await updateFinancialSummary(userId, {
        income: summary.income + amount,
      })
    } else {
      // Expense transaction
      await updateFinancialSummary(userId, {
        expenses: summary.expenses + Math.abs(amount),
      })
    }

    return {
      id: transactionId,
      userId,
      date,
      description,
      amount,
      category,
    }
  } catch (error) {
    console.error("Add transaction error:", error)
    throw error
  }
}

/**
 * Get savings goals for a user
 *
 * @param userId - User's ID
 * @returns List of user's savings goals
 */
export async function getSavingsGoals(userId: string): Promise<SavingsGoal[]> {
  try {
    const goals = await executeQuery("SELECT * FROM savings_goals WHERE user_id = ? ORDER BY deadline ASC", [userId])

    return (goals as any[]).map((goal) => ({
      id: goal.id,
      userId: goal.user_id,
      name: goal.name,
      target: Number.parseFloat(goal.target),
      current: Number.parseFloat(goal.current),
      deadline: goal.deadline.toISOString().split("T")[0],
    }))
  } catch (error) {
    console.error("Get savings goals error:", error)
    throw error
  }
}

/**
 * Add a savings goal
 *
 * @param userId - User's ID
 * @param name - Goal name
 * @param target - Target amount
 * @param deadline - Goal deadline
 * @returns The created savings goal
 */
export async function addSavingsGoal(
  userId: string,
  name: string,
  target: number,
  deadline: string,
): Promise<SavingsGoal> {
  try {
    const goalId = uuidv4()

    await executeQuery(
      "INSERT INTO savings_goals (id, user_id, name, target, current, deadline) VALUES (?, ?, ?, ?, 0, ?)",
      [goalId, userId, name, target, deadline],
    )

    return {
      id: goalId,
      userId,
      name,
      target,
      current: 0,
      deadline,
    }
  } catch (error) {
    console.error("Add savings goal error:", error)
    throw error
  }
}

/**
 * Update a savings goal
 *
 * @param goalId - Goal ID
 * @param userId - User's ID
 * @param data - Updated goal data
 * @returns Whether update was successful
 */
export async function updateSavingsGoal(goalId: string, userId: string, data: Partial<SavingsGoal>): Promise<boolean> {
  try {
    // Build the query dynamically based on provided fields
    let sql = "UPDATE savings_goals SET "
    const params = []
    const updates = []

    if (data.name) {
      updates.push("name = ?")
      params.push(data.name)
    }

    if (data.target !== undefined) {
      updates.push("target = ?")
      params.push(data.target)
    }

    if (data.current !== undefined) {
      updates.push("current = ?")
      params.push(data.current)
    }

    if (data.deadline) {
      updates.push("deadline = ?")
      params.push(data.deadline)
    }

    if (updates.length === 0) {
      return false // Nothing to update
    }

    sql += updates.join(", ") + " WHERE id = ? AND user_id = ?"
    params.push(goalId, userId)

    await executeQuery(sql, params)
    return true
  } catch (error) {
    console.error("Update savings goal error:", error)
    throw error
  }
}

/**
 * Contribute to a savings goal
 *
 * @param goalId - Goal ID
 * @param userId - User's ID
 * @param amount - Contribution amount
 * @returns Whether contribution was successful
 */
export async function contributeToSavingsGoal(goalId: string, userId: string, amount: number): Promise<boolean> {
  try {
    // Get the current goal
    const goals = await executeQuery("SELECT * FROM savings_goals WHERE id = ? AND user_id = ?", [goalId, userId])

    const goal = (goals as any[])[0]
    if (!goal) {
      throw new Error("Savings goal not found")
    }

    // Calculate new current amount (don't exceed target)
    const currentAmount = Number.parseFloat(goal.current)
    const targetAmount = Number.parseFloat(goal.target)
    const newAmount = Math.min(currentAmount + amount, targetAmount)

    // Update the goal
    await executeQuery("UPDATE savings_goals SET current = ? WHERE id = ? AND user_id = ?", [newAmount, goalId, userId])

    return true
  } catch (error) {
    console.error("Contribute to savings goal error:", error)
    throw error
  }
}

