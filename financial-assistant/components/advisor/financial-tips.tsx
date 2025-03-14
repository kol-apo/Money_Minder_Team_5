"use client"

import { Check } from "lucide-react"

const tips = [
  {
    id: "1",
    tip: "Set up automatic transfers to your savings account on payday",
    category: "Saving",
  },
  {
    id: "2",
    tip: "Review your subscriptions monthly and cancel unused services",
    category: "Budgeting",
  },
  {
    id: "3",
    tip: "Consider refinancing your mortgage to take advantage of lower rates",
    category: "Housing",
  },
  {
    id: "4",
    tip: "Increase your 401(k) contribution by 1% every six months",
    category: "Retirement",
  },
  {
    id: "5",
    tip: "Use cash-back credit cards for regular purchases, but pay in full monthly",
    category: "Credit",
  },
  {
    id: "6",
    tip: "Build an emergency fund that covers 3-6 months of expenses",
    category: "Emergency",
  },
]

export function FinancialTips() {
  return (
    <div className="space-y-4">
      {tips.map((tip) => (
        <div key={tip.id} className="flex items-start gap-2">
          <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm">{tip.tip}</p>
            <p className="text-xs text-muted-foreground">{tip.category}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

