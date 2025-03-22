import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a function to clear the token from the API instance
export const clearAuthToken = () => {
  // This will ensure that future requests don't include the token
  delete api.defaults.headers.Authorization
}

// Auth API calls
export const authAPI = {
  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData)
    return response.data
  },
  login: async (credentials: any) => {
    const response = await api.post("/auth/login", credentials)
    return response.data
  },
  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },
  logout: () => {
    // Clear token from localStorage
    localStorage.removeItem("token")
    // Clear token from API headers
    clearAuthToken()
  },
}

// User API calls
export const userAPI = {
  updateProfile: async (userData: any) => {
    const response = await api.patch("/users/update", userData)
    return response.data
  },
  updatePassword: async (passwordData: any) => {
    const response = await api.patch("/users/update-password", passwordData)
    return response.data
  },
}

// Transaction API calls
export const transactionAPI = {
  createTransaction: async (transactionData: any) => {
    const response = await api.post("/transactions", transactionData)
    return response.data
  },
  getAllTransactions: async (filters?: any) => {
    const response = await api.get("/transactions", { params: filters })
    return response.data
  },
  getTransactionById: async (id: string) => {
    const response = await api.get(`/transactions/${id}`)
    return response.data
  },
  updateTransaction: async (id: string, transactionData: any) => {
    const response = await api.patch(`/transactions/${id}`, transactionData)
    return response.data
  },
  deleteTransaction: async (id: string) => {
    const response = await api.delete(`/transactions/${id}`)
    return response.data
  },
}

// Savings Goal API calls
export const savingsGoalAPI = {
  createSavingsGoal: async (goalData: any) => {
    const response = await api.post("/savings-goals", goalData)
    return response.data
  },
  getAllSavingsGoals: async () => {
    const response = await api.get("/savings-goals")
    return response.data
  },
  getSavingsGoalById: async (id: string) => {
    const response = await api.get(`/savings-goals/${id}`)
    return response.data
  },
  updateSavingsGoal: async (id: string, goalData: any) => {
    const response = await api.patch(`/savings-goals/${id}`, goalData)
    return response.data
  },
  deleteSavingsGoal: async (id: string) => {
    const response = await api.delete(`/savings-goals/${id}`)
    return response.data
  },
  contributeToSavingsGoal: async (id: string, amount: number) => {
    const response = await api.patch(`/savings-goals/${id}/contribute`, { amount })
    return response.data
  },
}

export default api

