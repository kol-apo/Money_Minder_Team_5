"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFinancial } from "@/components/financial-context"
import { toast } from "@/hooks/use-toast"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTransactionDialog({ open, onOpenChange }: AddTransactionDialogProps) {
  const { addTransaction } = useFinancial()
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Other")
  const [transactionType, setTransactionType] = useState("expense")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description || !amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid transaction",
        description: "Please enter a valid description and amount.",
        variant: "destructive",
      })
      return
    }

    // Convert amount to positive or negative based on transaction type
    const transactionAmount = transactionType === "income" ? Number.parseFloat(amount) : -Number.parseFloat(amount)

    try {
      // Add the transaction
      await addTransaction({
        date: new Date().toISOString().split("T")[0],
        description,
        amount: transactionAmount,
        category: transactionType === "income" ? "Income" : category,
      })

      // Reset form and close dialog
      setDescription("")
      setAmount("")
      setCategory("Other")
      setTransactionType("expense")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to add transaction:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>Enter the details of your transaction below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={transactionType === "expense" ? "default" : "outline"}
                onClick={() => setTransactionType("expense")}
                className="w-full"
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={transactionType === "income" ? "default" : "outline"}
                onClick={() => setTransactionType("income")}
                className="w-full"
              >
                Income
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Grocery shopping"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            {transactionType === "expense" && (
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Housing">Housing</option>
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Add Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

