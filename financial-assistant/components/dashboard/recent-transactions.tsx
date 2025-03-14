"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDownIcon, CreditCard, Home, Utensils, Car, Zap, HeartPulse, Shirt } from "lucide-react"
import { useFinancial } from "@/contexts/financial-context"

// Map of category to icon
const categoryIcons: Record<string, any> = {
  Income: ArrowDownIcon,
  Housing: Home,
  Food: Utensils,
  Transportation: Car,
  Utilities: Zap,
  Healthcare: HeartPulse,
  Shopping: Shirt,
  Entertainment: CreditCard,
  Other: CreditCard,
}

export function RecentTransactions() {
  const { transactions, formatCurrency } = useFinancial()

  // If no transactions, show a message
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions yet. Add your first transaction to get started.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          const Icon = categoryIcons[transaction.category] || CreditCard
          return (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.date}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1 bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  {transaction.description}
                </div>
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell className={`text-right ${transaction.amount > 0 ? "text-green-600" : ""}`}>
                {formatCurrency(transaction.amount)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

