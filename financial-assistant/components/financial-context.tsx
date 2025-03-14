"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  addIncome: (amount: number) => void
  addExpense: (amount: number, category: string) => void
  updateSavingsGoal: (goalId: string, amount: number) => void
  addSavingsGoal: (goal: Omit<SavingsGoal, "id">) => void

  // Currency formatting
  formatCurrency: (amount: number) => string

  // Data loading state
  isLoading: boolean
}

const defaultSavingsGoals = [
  {
    id: "1",
    name: "Emergency Fund",
    target: 10000,
    current: 0,
    deadline: "2023-12-31",
  },
  {
    id: "2",
    name: "Vacation",
    target: 3000,
    current: 0,
    deadline: "2023-08-15",
  },
  {
    id: "3",
    name: "New Car",
    target: 20000,
    current: 0,
    deadline: "2024-06-30",
  },
]

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [balance, setBalance] = useState(0)
  const [savingsRate, setSavingsRate] = useState(0)
  const [currency, setCurrency] = useState<Currency>("USD")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(defaultSavingsGoals)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved financial data on mount
  useEffect(() => {
    const loadFinancialData = () => {
      try {
        const savedIncome = localStorage.getItem("moneyminder_income")
        const savedExpenses = localStorage.getItem("moneyminder_expenses")
        const savedCurrency = localStorage.getItem("moneyminder_currency")
        const savedTransactions = localStorage.getItem("moneyminder_transactions")
        const savedSavingsGoals = localStorage.getItem("moneyminder_savings_goals")

        if (savedIncome) setIncome(Number.parseFloat(savedIncome))
        if (savedExpenses) setExpenses(Number.parseFloat(savedExpenses))
        if (savedCurrency) setCurrency(savedCurrency as Currency)
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions))
        if (savedSavingsGoals) setSavingsGoals(JSON.parse(savedSavingsGoals))

        // Calculate balance and savings rate
        const loadedIncome = savedIncome ? Number.parseFloat(savedIncome) : 0
        const loadedExpenses = savedExpenses ? Number.parseFloat(savedExpenses) : 0
        setBalance(loadedIncome - loadedExpenses)

        if (loadedIncome > 0) {
          setSavingsRate(((loadedIncome - loadedExpenses) / loadedIncome) * 100)
        }
      } catch (error) {
        console.error("Error loading financial data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFinancialData()
  }, [])

  // Save financial data when it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("moneyminder_income", income.toString())
      localStorage.setItem("moneyminder_expenses", expenses.toString())
      localStorage.setItem("moneyminder_currency", currency)
      localStorage.setItem("moneyminder_transactions", JSON.stringify(transactions))
      localStorage.setItem("moneyminder_savings_goals", JSON.stringify(savingsGoals))
    }
  }, [income, expenses, currency, transactions, savingsGoals, isLoading])

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    setTransactions((prev) => [newTransaction, ...prev])

    // Update income or expenses based on transaction amount
    if (transaction.amount > 0) {
      addIncome(transaction.amount)
    } else {
      addExpense(Math.abs(transaction.amount), transaction.category)
    }
  }

  // Add income
  const addIncome = (amount: number) => {
    setIncome((prev) => {
      const newIncome = prev + amount
      // Recalculate savings rate
      const newSavingsRate = newIncome > 0 ? ((newIncome - expenses) / newIncome) * 100 : 0
      setSavingsRate(newSavingsRate)
      // Update balance
      setBalance(newIncome - expenses)
      return newIncome
    })
  }

  // Add expense
  const addExpense = (amount: number, category: string) => {
    setExpenses((prev) => {
      const newExpenses = prev + amount
      // Recalculate savings rate
      const newSavingsRate = income > 0 ? ((income - newExpenses) / income) * 100 : 0
      setSavingsRate(newSavingsRate)
      // Update balance
      setBalance(income - newExpenses)
      return newExpenses
    })
  }

  // Update a savings goal
  const updateSavingsGoal = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId ? { ...goal, current: Math.min(goal.current + amount, goal.target) } : goal,
      ),
    )
  }

  // Add a new savings goal
  const addSavingsGoal = (goal: Omit<SavingsGoal, "id">) => {
    const newGoal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    setSavingsGoals((prev) => [...prev, newGoal])
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
        setCurrency,
        addTransaction,
        addIncome,
        addExpense,
        updateSavingsGoal,
        addSavingsGoal,
        formatCurrency,
        isLoading,
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

