"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { useFinancial } from "@/components/financial-context"

export function MigrationHelper() {
  const [isMigrating, setIsMigrating] = useState(false)
  const { refreshData } = useFinancial()

  const migrateFromLocalStorage = async () => {
    setIsMigrating(true)

    try {
      // Get data from localStorage
      const income = localStorage.getItem("moneyminder_income")
      const expenses = localStorage.getItem("moneyminder_expenses")
      const transactions = localStorage.getItem("moneyminder_transactions")
      const savingsGoals = localStorage.getItem("moneyminder_savings_goals")

      // Prepare data for migration
      const migrationData = {
        income: income ? Number.parseFloat(income) : undefined,
        expenses: expenses ? Number.parseFloat(expenses) : undefined,
        transactions: transactions ? JSON.parse(transactions) : [],
        savingsGoals: savingsGoals ? JSON.parse(savingsGoals) : [],
      }

      // Send data to migration API
      const response = await fetch("/api/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(migrationData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Migration failed")
      }

      const result = await response.json()

      // Refresh financial data
      await refreshData()

      // Show success message
      toast({
        title: "Migration successful",
        description: `Imported ${result.imported.transactions} transactions and ${result.imported.goals} savings goals.`,
      })

      // Clear localStorage data
      localStorage.removeItem("moneyminder_income")
      localStorage.removeItem("moneyminder_expenses")
      localStorage.removeItem("moneyminder_currency")
      localStorage.removeItem("moneyminder_transactions")
      localStorage.removeItem("moneyminder_savings_goals")
    } catch (error: any) {
      console.error("Migration error:", error)
      toast({
        title: "Migration failed",
        description: error.message || "There was an error migrating your data.",
        variant: "destructive",
      })
    } finally {
      setIsMigrating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Migration</CardTitle>
        <CardDescription>
          Migrate your existing data from browser storage to your account in the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          If you've been using MoneyMinder before we implemented database storage, you can migrate your existing data to
          your account. This will transfer your transactions, savings goals, and financial summary to the database.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={migrateFromLocalStorage} disabled={isMigrating}>
          {isMigrating ? "Migrating..." : "Migrate My Data"}
        </Button>
      </CardFooter>
    </Card>
  )
}

