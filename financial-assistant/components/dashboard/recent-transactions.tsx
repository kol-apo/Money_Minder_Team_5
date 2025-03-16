"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDownIcon, CreditCard, Home, Utensils, Car, Zap, HeartPulse, Shirt } from "lucide-react"
import { useFinancial } from "@/components/financial-context"

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
        <div className="inline-flex items-center justify-center rounded-full bg-muted p-3 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </div>
        <h3 className="font-medium mb-1">No transactions yet</h3>
        <p className="text-muted-foreground">Add your first transaction to get started tracking your finances.</p>
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

