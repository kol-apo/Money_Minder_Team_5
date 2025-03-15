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
import { QuickAddTransaction } from "@/components/dashboard/quick-add-transaction"

export default function DashboardPage() {
  const router = useRouter()
  const { income, expenses, balance, savingsRate, formatCurrency, isLoading } = useFinancial()
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)

  // If user has no financial data, redirect to setup
  useEffect(() => {
    if (!isLoading && income === 0) {
      router.push("/setup")
    }
  }, [income, isLoading, router])

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {income === 0 && !isLoading && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h2 className="text-lg font-medium mb-2">Welcome to MoneyMinder!</h2>
          <p className="text-muted-foreground mb-4">
            You're starting with a clean slate. To get the most out of MoneyMinder, start by adding your income and
            expenses.
          </p>
          <Button onClick={() => setIsTransactionDialogOpen(true)}>Add Your First Transaction</Button>
        </div>
      )}
      {income === 0 && !isLoading && (
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Add Transaction</CardTitle>
              <CardDescription>Record your income or expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <QuickAddTransaction />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Tips to make the most of MoneyMinder</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-2 rounded-full bg-primary/10 p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Add your transactions</h4>
                    <p className="text-sm text-muted-foreground">
                      Record your income and expenses to track your spending
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 rounded-full bg-primary/10 p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Set savings goals</h4>
                    <p className="text-sm text-muted-foreground">Create financial goals to work towards</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 rounded-full bg-primary/10 p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Analyze your spending</h4>
                    <p className="text-sm text-muted-foreground">View reports to understand your financial habits</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
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
                <span className="text-xs text-muted-foreground">
                  {balance === 0 ? "Add transactions to calculate your balance" : "Current balance"}
                </span>
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
                <span className="text-xs text-muted-foreground">
                  {income === 0 ? "No income recorded yet" : "Total monthly income"}
                </span>
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
                <span className="text-xs text-muted-foreground">
                  {expenses === 0 ? "No expenses recorded yet" : "Total monthly expenses"}
                </span>
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
                <span className="text-xs text-muted-foreground">
                  {income === 0 ? "Add income to calculate savings rate" : "Percentage of income saved"}
                </span>
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

