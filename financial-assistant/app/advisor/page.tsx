import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FinancialAdvisor } from "@/components/advisor/financial-advisor"
import { FinancialTips } from "@/components/advisor/financial-tips"

export const metadata: Metadata = {
  title: "Financial Advisor | FinAssist",
  description: "Get personalized financial advice and recommendations",
}

export default function AdvisorPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Financial Advisor</h1>
          <p className="text-muted-foreground">
            Get personalized financial advice and recommendations based on your spending habits.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Ask Your Financial Assistant</CardTitle>
              <CardDescription>Get personalized financial advice by chatting with our AI assistant.</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialAdvisor />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Tips</CardTitle>
              <CardDescription>Personalized recommendations based on your spending habits.</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialTips />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Optimization</CardTitle>
              <CardDescription>Suggestions to optimize your budget and increase savings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Reduce Food Expenses</h3>
                <p className="text-sm text-muted-foreground">
                  Your food expenses are 15% higher than average. Consider meal planning and cooking at home more often
                  to reduce costs.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Optimize Subscriptions</h3>
                <p className="text-sm text-muted-foreground">
                  You're spending $45/month on unused subscriptions. Review and cancel services you don't regularly use.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Increase Retirement Contributions</h3>
                <p className="text-sm text-muted-foreground">
                  Increasing your 401(k) contribution by just 2% could result in an additional $120,000 at retirement.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

