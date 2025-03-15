"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinancial } from "@/components/financial-context"
import { toast } from "@/hooks/use-toast"
import { Wallet, DollarSign, CreditCard, Building, ShoppingBag, Home } from "lucide-react"

export function FinancialSetup() {
  const router = useRouter()
  const { addIncome, addExpense, setCurrency, formatCurrency } = useFinancial()

  const [monthlySalary, setMonthlySalary] = useState("")
  const [housingExpense, setHousingExpense] = useState("")
  const [foodExpense, setFoodExpense] = useState("")
  const [transportationExpense, setTransportationExpense] = useState("")
  const [otherExpenses, setOtherExpenses] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [step, setStep] = useState(1)

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value)
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!monthlySalary || Number.parseFloat(monthlySalary) <= 0) {
        toast({
          title: "Invalid income",
          description: "Please enter a valid monthly income amount.",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      // Save all financial data
      setCurrency(selectedCurrency as any)
      addIncome(Number.parseFloat(monthlySalary))

      if (housingExpense && Number.parseFloat(housingExpense) > 0) {
        addExpense(Number.parseFloat(housingExpense), "Housing")
      }

      if (foodExpense && Number.parseFloat(foodExpense) > 0) {
        addExpense(Number.parseFloat(foodExpense), "Food")
      }

      if (transportationExpense && Number.parseFloat(transportationExpense) > 0) {
        addExpense(Number.parseFloat(transportationExpense), "Transportation")
      }

      if (otherExpenses && Number.parseFloat(otherExpenses) > 0) {
        addExpense(Number.parseFloat(otherExpenses), "Other")
      }

      // Mark setup as completed
      localStorage.setItem("moneyminder_setup_completed", "true")

      toast({
        title: "Financial setup complete",
        description: "Your financial information has been saved.",
      })

      router.push("/dashboard")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-center mb-2">
          <Wallet className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">
          {step === 1 ? "Set Up Your Finances" : "Enter Your Monthly Expenses"}
        </CardTitle>
        <CardDescription className="text-center">
          {step === 1
            ? "Let's set up your financial profile to personalize your experience"
            : "Enter your typical monthly expenses to track your spending"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="currency">Preferred Currency</Label>
              <select
                id="currency"
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-salary">Monthly Income</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="monthly-salary"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="housing-expense">Housing (Rent/Mortgage)</Label>
              <div className="relative">
                <Home className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="housing-expense"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={housingExpense}
                  onChange={(e) => setHousingExpense(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="food-expense">Food & Groceries</Label>
              <div className="relative">
                <ShoppingBag className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="food-expense"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={foodExpense}
                  onChange={(e) => setFoodExpense(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transportation-expense">Transportation</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="transportation-expense"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={transportationExpense}
                  onChange={(e) => setTransportationExpense(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="other-expenses">Other Expenses</Label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="other-expenses"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(e.target.value)}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === 2 && (
          <Button variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>
        )}
        <Button onClick={handleNextStep} className={step === 1 ? "w-full" : ""}>
          {step === 1 ? "Next" : "Complete Setup"}
        </Button>
      </CardFooter>
    </Card>
  )
}

