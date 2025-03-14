"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    date: "Jan 1",
    amount: 95,
  },
  {
    date: "Jan 5",
    amount: 75,
  },
  {
    date: "Jan 10",
    amount: 125,
  },
  {
    date: "Jan 15",
    amount: 85,
  },
  {
    date: "Jan 20",
    amount: 115,
  },
  {
    date: "Jan 25",
    amount: 75,
  },
  {
    date: "Jan 30",
    amount: 135,
  },
  {
    date: "Feb 5",
    amount: 85,
  },
  {
    date: "Feb 10",
    amount: 65,
  },
  {
    date: "Feb 15",
    amount: 125,
  },
  {
    date: "Feb 20",
    amount: 95,
  },
  {
    date: "Feb 25",
    amount: 65,
  },
  {
    date: "Mar 1",
    amount: 115,
  },
  {
    date: "Mar 5",
    amount: 85,
  },
]

interface SpendingTrendsProps {
  height?: number
}

export function SpendingTrends({ height = 300 }: SpendingTrendsProps) {
  return (
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
  )
}

