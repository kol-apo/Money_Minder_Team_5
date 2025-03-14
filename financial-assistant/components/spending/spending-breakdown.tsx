"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const categories = [
  {
    id: "1",
    name: "Housing",
    amount: 1200,
    percentage: 42.1,
    change: -2.5,
  },
  {
    id: "2",
    name: "Food",
    amount: 500,
    percentage: 17.5,
    change: 5.2,
  },
  {
    id: "3",
    name: "Transportation",
    amount: 350,
    percentage: 12.3,
    change: -1.8,
  },
  {
    id: "4",
    name: "Utilities",
    amount: 280,
    percentage: 9.8,
    change: 0,
  },
  {
    id: "5",
    name: "Entertainment",
    amount: 220,
    percentage: 7.7,
    change: 12.5,
  },
  {
    id: "6",
    name: "Other",
    amount: 300,
    percentage: 10.5,
    change: -4.2,
  },
]

export function SpendingBreakdown() {
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
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">
              <div className="space-y-1">
                <div>{category.name}</div>
                <Progress value={category.percentage} className="h-1" />
              </div>
            </TableCell>
            <TableCell>${category.amount.toLocaleString()}</TableCell>
            <TableCell>{category.percentage}%</TableCell>
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

