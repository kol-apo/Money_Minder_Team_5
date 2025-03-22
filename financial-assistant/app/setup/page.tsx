"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { FinancialSetup } from "@/components/onboarding/financial-setup"
import { useFinancial } from "@/components/financial-context"
import { useAuth } from "@/components/auth-provider"

export default function SetupPage() {
  const router = useRouter()
  const { income, isLoading } = useFinancial()
  const { user, isLoading: authLoading } = useAuth()

  // Check if user is logged in, if not redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/setup")
    }
  }, [user, authLoading, router])

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">{user && <FinancialSetup />}</div>
  )
}

