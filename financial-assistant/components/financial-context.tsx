"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CAD"

type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  category: string
}

type SavingsGoal = {
  id: string
  name: string
  target: number
  current: number
  deadline: string
}

type FinancialContextType = {
  // User financial data
  income: number
  expenses: number
  balance: number
  savingsRate: number
  currency: Currency
  transactions: Transaction[]
  savingsGoals: SavingsGoal[]

  // Methods to update data
  setCurrency: (currency: Currency) => void
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>
  updateFinancialSummary: (income?: number, expenses?: number) => Promise<void>
  addSavingsGoal: (goal: Omit<SavingsGoal, "id" | "current">) => Promise<void>
  contributeToGoal: (goalId: string, amount: number) => Promise<void>

  // Currency formatting
  formatCurrency: (amount: number) => string

  // Data loading state
  isLoading: boolean
  refreshData: () => Promise<void>
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()

  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [balance, setBalance] = useState(0)
  const [savingsRate, setSavingsRate] = useState(0)
  const [currency, setCurrency] = useState<Currency>("USD")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load financial data when user changes
  useEffect(() => {
    if (!authLoading && user) {
      refreshData()
      // Set currency from user preferences
      if (user.currency) {
        setCurrency(user.currency as Currency)
      }
    } else if (!authLoading && !user) {
      // Reset data when user logs out
      setIncome(0)
      setExpenses(0)
      setBalance(0)
      setSavingsRate(0)
      setTransactions([])
      setSavingsGoals([])
      setIsLoading(false)
    }
  }, [user, authLoading])

  // Refresh all financial data
  const refreshData = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Load financial summary
      const summaryResponse = await fetch("/api/summary")
      if (summaryResponse.ok) {
        const { summary } = await summaryResponse.json()
        setIncome(summary.income)
        setExpenses(summary.expenses)
        setBalance(summary.balance)
        setSavingsRate(summary.savingsRate)
      }

      // Load transactions
      const transactionsResponse = await fetch("/api/transactions")
      if (transactionsResponse.ok) {
        const { transactions } = await transactionsResponse.json()
        setTransactions(transactions)
      }

      // Load savings goals
      const goalsResponse = await fetch("/api/goals")
      if (goalsResponse.ok) {
        const { goals } = await goalsResponse.json()
        setSavingsGoals(goals)
      }
    } catch (error) {
      console.error("Error loading financial data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update currency (also updates in user profile)
  const updateCurrency = async (newCurrency: Currency) => {
    setCurrency(newCurrency)

    if (user) {
      try {
        await fetch("/api/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currency: newCurrency }),
        })
      } catch (error) {
        console.error("Error updating currency:", error)
      }
    }
  }

  // Add a new transaction
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user) return

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      })

      if (!response.ok) {
        throw new Error("Failed to add transaction")
      }

      // Refresh data to get updated transactions and summary
      await refreshData()
    } catch (error) {
      console.error("Error adding transaction:", error)
      throw error
    }
  }

  // Update financial summary
  const updateFinancialSummary = async (newIncome?: number, newExpenses?: number) => {
    if (!user) return

    try {
      const response = await fetch("/api/summary", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          income: newIncome,
          expenses: newExpenses,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update financial summary")
      }

      const { summary } = await response.json()
      setIncome(summary.income)
      setExpenses(summary.expenses)
      setBalance(summary.balance)
      setSavingsRate(summary.savingsRate)
    } catch (error) {
      console.error("Error updating financial summary:", error)
      throw error
    }
  }

  // Add a new savings goal
  const addSavingsGoal = async (goal: Omit<SavingsGoal, "id" | "current">) => {
    if (!user) return

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goal),
      })

      if (!response.ok) {
        throw new Error("Failed to add savings goal")
      }

      // Refresh goals
      const goalsResponse = await fetch("/api/goals")
      if (goalsResponse.ok) {
        const { goals } = await goalsResponse.json()
        setSavingsGoals(goals)
      }
    } catch (error) {
      console.error("Error adding savings goal:", error)
      throw error
    }
  }

  // Contribute to a savings goal
  const contributeToGoal = async (goalId: string, amount: number) => {
    if (!user) return

    try {
      const response = await fetch(`/api/goals/${goalId}/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        throw new Error("Failed to contribute to savings goal")
      }

      // Refresh goals
      const goalsResponse = await fetch("/api/goals")
      if (goalsResponse.ok) {
        const { goals } = await goalsResponse.json()
        setSavingsGoals(goals)
      }
    } catch (error) {
      console.error("Error contributing to goal:", error)
      throw error
    }
  }

  // Format currency based on selected currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <FinancialContext.Provider
      value={{
        income,
        expenses,
        balance,
        savingsRate,
        currency,
        transactions,
        savingsGoals,
        setCurrency: updateCurrency,
        addTransaction,
        updateFinancialSummary,
        addSavingsGoal,
        contributeToGoal,
        formatCurrency,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </FinancialContext.Provider>
  )
}

export function useFinancial() {
  const context = useContext(FinancialContext)
  if (context === undefined) {
    throw new Error("useFinancial must be used within a FinancialProvider")
  }
  return context
}

