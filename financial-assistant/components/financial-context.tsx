"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { transactionAPI, savingsGoalAPI } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"

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
  addIncome: (amount: number) => void
  addExpense: (amount: number, category: string) => void
  updateSavingsGoal: (goalId: string, amount: number) => Promise<void>
  addSavingsGoal: (goal: Omit<SavingsGoal, "id">) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  deleteSavingsGoal: (id: string) => Promise<void>

  // Currency formatting
  formatCurrency: (amount: number) => string

  // Data loading state
  isLoading: boolean
  fetchTransactions: () => Promise<void>
  fetchSavingsGoals: () => Promise<void>
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [balance, setBalance] = useState(0)
  const [savingsRate, setSavingsRate] = useState(0)
  const [currency, setCurrency] = useState<Currency>("USD")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch user's transactions and savings goals when user changes
  useEffect(() => {
    if (user) {
      fetchTransactions()
      fetchSavingsGoals()

      // Set currency from user preferences
      if (user.currency) {
        setCurrency(user.currency as Currency)
      }
    }
  }, [user])

  // Calculate financial metrics when transactions change
  useEffect(() => {
    calculateFinancialMetrics()
  }, [transactions])

  // Fetch transactions from API
  const fetchTransactions = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { transactions } = await transactionAPI.getAllTransactions()

      // Transform transactions to match our format
      const formattedTransactions = transactions.map((tx: any) => ({
        id: tx._id,
        date: new Date(tx.date).toISOString().split("T")[0],
        description: tx.description,
        amount: tx.amount,
        category: tx.category,
      }))

      setTransactions(formattedTransactions)
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch transactions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

  // Add the rest of your functions here...
  // calculateFinancialMetrics, fetchSavingsGoals, addTransaction, etc.

  // Placeholder implementations for the remaining functions
  const calculateFinancialMetrics = () => {
    let totalIncome = 0
    let totalExpenses = 0

    transactions.forEach((tx) => {
      if (tx.amount > 0) {
        totalIncome += tx.amount
      } else {
        totalExpenses += Math.abs(tx.amount)
      }
    })

    setIncome(totalIncome)
    setExpenses(totalExpenses)
    setBalance(totalIncome - totalExpenses)

    // Calculate savings rate
    const newSavingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
    setSavingsRate(newSavingsRate)
  }

  const fetchSavingsGoals = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { savingsGoals } = await savingsGoalAPI.getAllSavingsGoals()

      // Transform savings goals to match our format
      const formattedGoals = savingsGoals.map((goal: any) => ({
        id: goal._id,
        name: goal.name,
        target: goal.target,
        current: goal.current,
        deadline: new Date(goal.deadline).toISOString().split("T")[0],
      }))

      setSavingsGoals(formattedGoals)
    } catch (error) {
      console.error("Failed to fetch savings goals:", error)
      toast({
        title: "Error",
        description: "Failed to fetch savings goals. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user) return

    setIsLoading(true)
    try {
      const { transaction: newTransaction } = await transactionAPI.createTransaction({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
      })

      // Add new transaction to state
      const formattedTransaction = {
        id: newTransaction._id,
        date: new Date(newTransaction.date).toISOString().split("T")[0],
        description: newTransaction.description,
        amount: newTransaction.amount,
        category: newTransaction.category,
      }

      setTransactions((prev) => [formattedTransaction, ...prev])

      toast({
        title: "Transaction added",
        description: "Your transaction has been recorded successfully.",
      })
    } catch (error) {
      console.error("Failed to add transaction:", error)
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTransaction = async (id: string) => {
    if (!user) return

    setIsLoading(true)
    try {
      await transactionAPI.deleteTransaction(id)

      // Remove transaction from state
      setTransactions((prev) => prev.filter((tx) => tx.id !== id))

      toast({
        title: "Transaction deleted",
        description: "Your transaction has been deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete transaction:", error)
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const addIncome = (amount: number) => {
    addTransaction({
      date: new Date().toISOString().split("T")[0],
      description: "Income",
      amount: Math.abs(amount),
      category: "Income",
    })
  }

  const addExpense = (amount: number, category: string) => {
    addTransaction({
      date: new Date().toISOString().split("T")[0],
      description: category,
      amount: -Math.abs(amount),
      category,
    })
  }

  const addSavingsGoal = async (goal: Omit<SavingsGoal, "id">) => {
    if (!user) return

    setIsLoading(true)
    try {
      const { savingsGoal } = await savingsGoalAPI.createSavingsGoal({
        name: goal.name,
        target: goal.target,
        current: goal.current || 0,
        deadline: goal.deadline,
      })

      // Add new goal to state
      const formattedGoal = {
        id: savingsGoal._id,
        name: savingsGoal.name,
        target: savingsGoal.target,
        current: savingsGoal.current,
        deadline: new Date(savingsGoal.deadline).toISOString().split("T")[0],
      }

      setSavingsGoals((prev) => [...prev, formattedGoal])

      toast({
        title: "Savings goal added",
        description: "Your savings goal has been added successfully.",
      })
    } catch (error) {
      console.error("Failed to add savings goal:", error)
      toast({
        title: "Error",
        description: "Failed to add savings goal. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateSavingsGoal = async (goalId: string, amount: number) => {
    if (!user) return

    setIsLoading(true)
    try {
      const { savingsGoal } = await savingsGoalAPI.contributeToSavingsGoal(goalId, amount)

      // Update goal in state
      setSavingsGoals((prev) =>
        prev.map((goal) =>
          goal.id === goalId
            ? {
                ...goal,
                current: savingsGoal.current,
              }
            : goal,
        ),
      )

      toast({
        title: "Contribution added",
        description: "Your contribution has been added to the goal.",
      })
    } catch (error) {
      console.error("Failed to update savings goal:", error)
      toast({
        title: "Error",
        description: "Failed to update savings goal. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSavingsGoal = async (id: string) => {
    if (!user) return

    setIsLoading(true)
    try {
      await savingsGoalAPI.deleteSavingsGoal(id)

      // Remove goal from state
      setSavingsGoals((prev) => prev.filter((goal) => goal.id !== id))

      toast({
        title: "Savings goal deleted",
        description: "Your savings goal has been deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete savings goal:", error)
      toast({
        title: "Error",
        description: "Failed to delete savings goal. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
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
        deleteTransaction,
        deleteSavingsGoal,
        formatCurrency,
        isLoading,
        fetchTransactions,
        fetchSavingsGoals,
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

