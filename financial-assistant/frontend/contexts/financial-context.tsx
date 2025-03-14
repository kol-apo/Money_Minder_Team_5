"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { generateId } from "@/backend/utils/format"
import type { Transaction, SavingsGoal } from "@/backend/models/types"
import { formatCurrency } from "@/backend/utils/format"

interface FinancialContextType {
  // Financial data
  balance: number
  income: number
  expenses: number
  savingsRate: number
  transactions: Transaction[]
  savingsGoals: SavingsGoal[]

  // Actions
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  addSavingsGoal: (goal: Omit<SavingsGoal, "id" | "current">) => void
  updateSavingsGoal: (id: string, amount: number) => void

  // Utilities
  formatCurrency: (amount: number) => string
  isLoading: boolean
}

// Create context
const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

// Provider component
export function FinancialProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])

  // Calculate derived values
  const income = transactions.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0)
  const expenses = Math.abs(transactions.reduce((sum, tx) => sum + (tx.amount < 0 ? tx.amount : 0), 0))
  const balance = income - expenses
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

  // Add transaction
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: generateId() }
    setTransactions((prev) => [newTransaction, ...prev])
  }

  // Add savings goal
  const addSavingsGoal = (goal: Omit<SavingsGoal, "id" | "current">) => {
    const newGoal = { ...goal, id: generateId(), current: 0 }
    setSavingsGoals((prev) => [...prev, newGoal])
  }

  // Update savings goal
  const updateSavingsGoal = (id: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, current: Math.min(goal.current + amount, goal.target) } : goal)),
    )
  }

  // Load initial data
  useEffect(() => {
    // Simulate loading data from API
    const loadData = async () => {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sample data
      setTransactions([
        {
          id: "tx1",
          date: "2023-05-01",
          description: "Salary",
          amount: 5000,
          category: "Income",
        },
        {
          id: "tx2",
          date: "2023-05-02",
          description: "Rent",
          amount: -1500,
          category: "Housing",
        },
        {
          id: "tx3",
          date: "2023-05-03",
          description: "Groceries",
          amount: -200,
          category: "Food",
        },
        {
          id: "tx4",
          date: "2023-05-05",
          description: "Gas",
          amount: -60,
          category: "Transportation",
        },
        {
          id: "tx5",
          date: "2023-05-10",
          description: "Electricity",
          amount: -120,
          category: "Utilities",
        },
      ])

      setSavingsGoals([
        {
          id: "goal1",
          name: "Emergency Fund",
          target: 10000,
          current: 5000,
          deadline: "2023-12-31",
        },
        {
          id: "goal2",
          name: "Vacation",
          target: 3000,
          current: 1200,
          deadline: "2023-08-15",
        },
      ])

      setIsLoading(false)
    }

    loadData()
  }, [])

  return (
    <FinancialContext.Provider
      value={{
        balance,
        income,
        expenses,
        savingsRate,
        transactions,
        savingsGoals,
        addTransaction,
        addSavingsGoal,
        updateSavingsGoal,
        formatCurrency,
        isLoading,
      }}
    >
      {children}
    </FinancialContext.Provider>
  )
}

// Hook for using the context
export function useFinancial() {
  const context = useContext(FinancialContext)
  if (context === undefined) {
    throw new Error("useFinancial must be used within a FinancialProvider")
  }
  return context
}

