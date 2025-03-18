"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { useFinancial } from "@/components/financial-context"
import { useMemo } from "react"

export function Overview() {
  const { income, expenses, formatCurrency } = useFinancial()

  // Generate mock data for the past 6 months based on current income/expenses
  const data = useMemo(() => {
    const currentDate = new Date()
    const months = []

    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = month.toLocaleString("default", { month: "short" })

      // Add some variation to make the chart more interesting
      const variationIncome = Math.random() * 0.2 - 0.1 // -10% to +10%
      const variationExpenses = Math.random() * 0.2 - 0.1 // -10% to +10%

      months.push({
        name: monthName,
        income: income * (1 + variationIncome),
        expenses: expenses * (1 + variationExpenses),
      })
    }

    return months
  }, [income, expenses])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value).split(".")[0]} // Remove decimal part for cleaner display
        />
        <Tooltip
          formatter={(value) => [formatCurrency(value as number), ""]}
          labelFormatter={(label) => `Month: ${label}`}
          contentStyle={{ borderRadius: "8px" }}
        />
        <Legend />
        <Bar dataKey="income" name="Income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

