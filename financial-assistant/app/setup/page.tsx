"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { FinancialSetup } from "@/components/onboarding/financial-setup"
import { useFinancial } from "@/components/financial-context"

export default function SetupPage() {
  const router = useRouter()
  const { income, isLoading } = useFinancial()

  // If user already has financial data, redirect to dashboard
  useEffect(() => {
    // Check if the user has completed setup before
    const hasCompletedSetup = localStorage.getItem("moneyminder_setup_completed")
    if (!isLoading && hasCompletedSetup === "true") {
      router.push("/dashboard")
    }
  }, [isLoading, router])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <FinancialSetup />
    </div>
  )
}

