"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { useAuth } from "@/components/auth-provider"

type UserContextType = {
  user: any | null
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  return <UserContext.Provider value={{ user, isLoading }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

