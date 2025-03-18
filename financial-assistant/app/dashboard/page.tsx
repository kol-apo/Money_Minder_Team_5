"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SpendingByCategory } from "@/components/dashboard/spending-by-category"
import { SavingsGoals } from "@/components/dashboard/savings-goals"
import { Button } from "@/components/ui/button"
import { Download, Filter, Plus } from "lucide-react"
import { useFinancial } from "@/components/financial-context"
import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog"
import { useState } from "react"

export default function DashboardPage() {
  const router = useRouter()
  const { income, expenses, balance, savingsRate, formatCurrency, isLoading } = useFinancial()
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)

  // If user has no financial data, redirect to setup
  useEffect(() => {
    // No redirection needed
  }, [])

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your finances.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsTransactionDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-muted-foreground">Current balance</span>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{formatCurrency(income)}</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-muted-foreground">Total monthly income</span>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{formatCurrency(expenses)}</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-muted-foreground">Total monthly expenses</span>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30">
              <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-muted-foreground">Percentage of income saved</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Income vs. Expenses</CardTitle>
                    <CardDescription>Monthly comparison for the past 6 months</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Last 6 Months
                  </Button>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>Current month breakdown</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    This Month
                  </Button>
                </CardHeader>
                <CardContent>
                  <SpendingByCategory />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your most recent financial transactions across all accounts.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsTransactionDialogOpen(true)}>
                  <Plus className="h-4 w-4" /> Add Transaction
                </Button>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Savings Goals</CardTitle>
                  <CardDescription>Track your progress towards your financial goals.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" /> Add Goal
                </Button>
              </CardHeader>
              <CardContent>
                <SavingsGoals />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddTransactionDialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen} />
    </div>
  )
}

