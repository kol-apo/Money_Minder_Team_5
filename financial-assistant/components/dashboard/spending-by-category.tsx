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
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No expense data available yet.</p>
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

