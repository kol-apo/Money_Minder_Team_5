// User related types
export interface User {
  id: string
  name: string
  email: string
  currency: string
  bio?: string
}

// Transaction related types
export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
}

// Savings goal related types
export interface SavingsGoal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
}

// Financial summary types
export interface FinancialSummary {
  income: number
  expenses: number
  balance: number
  savingsRate: number
}

// Authentication types
export interface AuthResponse {
  user: User
  token: string
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

