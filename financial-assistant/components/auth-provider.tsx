"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI, userAPI } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

type User = {
  id: string
  name: string
  email: string
  currency: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token")

      if (token) {
        try {
          setIsLoading(true)
          const { user } = await authAPI.getCurrentUser()
          setUser({
            id: user._id,
            name: user.name,
            email: user.email,
            currency: user.currency,
            avatar: user.avatar,
          })
        } catch (error) {
          console.error("Failed to get current user:", error)
          localStorage.removeItem("token")
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user, token } = await authAPI.login({ email, password })

      // Save token to localStorage
      localStorage.setItem("token", token)

      // Set user in state
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        avatar: user.avatar,
      })

      toast({
        title: "Login successful",
        description: "Welcome back to MoneyMinder!",
      })
    } catch (error: any) {
      console.error("Login failed:", error)
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user, token } = await authAPI.register({ name, email, password })

      // Save token to localStorage
      localStorage.setItem("token", token)

      // Set user in state
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        avatar: user.avatar,
      })

      toast({
        title: "Registration successful",
        description: "Welcome to MoneyMinder!",
      })
    } catch (error: any) {
      console.error("Registration failed:", error)
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "There was an error creating your account.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    authAPI.logout()
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    // Redirect to home page after logout
    window.location.href = "/"
  }

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true)
    try {
      const { user } = await userAPI.updateProfile(userData)

      // Update user in state
      setUser((prevUser) => {
        if (!prevUser) return null
        return {
          ...prevUser,
          ...user,
        }
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Update user failed:", error)
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "There was an error updating your profile.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

