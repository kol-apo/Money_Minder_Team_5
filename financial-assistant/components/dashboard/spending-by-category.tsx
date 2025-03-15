"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useFinancial } from "@/components/financial-context"
import { useMemo } from "react"

const COLORS = ["hsl(var(--primary))", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#6b7280"]

export function SpendingByCategory() {
  const { transactions, formatCurrency } = useFinancial()

  // Calculate spending by category
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {}

    // Only include expense transactions (negative amounts)
    transactions
      .filter((tx) => tx.amount < 0)
      .forEach((tx) => {
        const category = tx.category
        const amount = Math.abs(tx.amount)

        if (categories[category]) {
          categories[category] += amount
        } else {
          categories[category] = amount
        }
      })

    // Convert to array format for chart
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }))
  }, [transactions])

  // If no expense data, show a message
  if (categoryData.length === 0) {
    return (
      <div className="h-[300px] w-full flex flex-col items-center justify-center">
        <div className="rounded-full bg-muted p-3 mb-2">
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-muted-foreground">No expense data available yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Add expense transactions to see your spending breakdown</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value as number)} />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

