"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useFinancial } from "@/components/financial-context"
import { useMemo } from "react"

export function SpendingBreakdown() {
  const { transactions, formatCurrency } = useFinancial()

  // Calculate spending by category
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {}
    let totalSpending = 0

    // Only include expense transactions (negative amounts)
    transactions
      .filter((tx) => tx.amount < 0)
      .forEach((tx) => {
        const category = tx.category
        const amount = Math.abs(tx.amount)
        totalSpending += amount

        if (categories[category]) {
          categories[category] += amount
        } else {
          categories[category] = amount
        }
      })

    // Convert to array format with percentages
    return Object.entries(categories).map(([name, value]) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      amount: value,
      percentage: totalSpending > 0 ? (value / totalSpending) * 100 : 0,
      change: 0, // No previous data to compare
    }))
  }, [transactions])

  // If no expense data, show a message
  if (categoryData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No spending data available yet. Add transactions to see your spending breakdown.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>% of Total</TableHead>
          <TableHead>Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categoryData.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">
              <div className="space-y-1">
                <div>{category.name}</div>
                <Progress value={category.percentage} className="h-1" />
              </div>
            </TableCell>
            <TableCell>{formatCurrency(category.amount)}</TableCell>
            <TableCell>{category.percentage.toFixed(1)}%</TableCell>
            <TableCell className={category.change > 0 ? "text-red-500" : category.change < 0 ? "text-green-500" : ""}>
              {category.change > 0 ? "+" : ""}
              {category.change}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

