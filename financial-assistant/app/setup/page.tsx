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
    // No redirection needed, we'll always show the setup page
  }, [])

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <FinancialSetup />
    </div>
  )
}

