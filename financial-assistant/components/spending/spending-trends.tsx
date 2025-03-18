"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useFinancial } from "@/components/financial-context"
import { useMemo } from "react"

interface SpendingTrendsProps {
  height?: number
}

export function SpendingTrends({ height = 300 }: SpendingTrendsProps) {
  const { transactions, formatCurrency } = useFinancial()

  // Generate data for spending trends
  const data = useMemo(() => {
    // If no transactions, return empty array
    if (transactions.length === 0) {
      // Return empty data with dates for the last 14 days
      const emptyData = []
      const today = new Date()

      for (let i = 13; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

        emptyData.push({
          date: dateStr,
          amount: 0,
        })
      }

      return emptyData
    }

    // Group transactions by date and calculate daily spending
    const spendingByDate: Record<string, number> = {}

    transactions
      .filter((tx) => tx.amount < 0) // Only include expenses
      .forEach((tx) => {
        const date = new Date(tx.date)
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

        if (spendingByDate[dateStr]) {
          spendingByDate[dateStr] += Math.abs(tx.amount)
        } else {
          spendingByDate[dateStr] = Math.abs(tx.amount)
        }
      })

    // Convert to array format for chart
    return Object.entries(spendingByDate)
      .map(([date, amount]) => ({
        date,
        amount,
      }))
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
  }, [transactions])

  return (
    <div className="w-full h-full">
      {transactions.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-muted-foreground">
            No spending data available yet. Add transactions to see your spending trends.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip formatter={(value) => [`$${value}`, "Amount"]} labelFormatter={(label) => `Date: ${label}`} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

