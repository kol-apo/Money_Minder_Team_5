import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, BarChart2, PieChart, TrendingUp, AlertTriangle, ThumbsUp } from "lucide-react"

export default function InsightsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Financial Insights</h1>
          <p className="text-muted-foreground">AI-powered analysis and recommendations for your financial health.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Budget Performance</CardTitle>
              <ThumbsUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">On Track</div>
              <p className="text-sm text-muted-foreground mb-4">
                You're staying within budget in most categories this month.
              </p>
              <Button size="sm" className="w-full gap-1">
                <BarChart2 className="h-4 w-4" /> View Detailed Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Spending Alert</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Entertainment</div>
              <p className="text-sm text-muted-foreground mb-4">
                Your entertainment spending is 25% higher than your monthly average.
              </p>
              <Button size="sm" className="w-full gap-1">
                <PieChart className="h-4 w-4" /> See Spending Breakdown
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Savings Opportunity</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$125 / month</div>
              <p className="text-sm text-muted-foreground mb-4">
                Potential savings identified from subscription services and food delivery.
              </p>
              <Button size="sm" className="w-full gap-1">
                <Download className="h-4 w-4" /> Get Savings Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Financial Health Score</CardTitle>
            <CardDescription>An overview of your financial wellbeing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6">
              <div className="relative h-40 w-40">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-muted"
                    fill="none"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <circle
                    className="stroke-primary"
                    fill="none"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset="50.24"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold">80</div>
                    <div className="text-sm text-muted-foreground">out of 100</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="font-medium">Debt Management</div>
                  <div className="mt-1 text-sm text-muted-foreground">90/100</div>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="font-medium">Savings Rate</div>
                  <div className="mt-1 text-sm text-muted-foreground">75/100</div>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="font-medium">Budget Adherence</div>
                  <div className="mt-1 text-sm text-muted-foreground">82/100</div>
                </div>
              </div>
              <div className="mt-8 text-center max-w-xl">
                <h3 className="font-medium text-lg">Recommendations to Improve Your Score</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground text-left">
                  <li className="flex gap-2">
                    <ThumbsUp className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>Increase your emergency fund from 3 to 6 months of expenses</span>
                  </li>
                  <li className="flex gap-2">
                    <ThumbsUp className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>Consider increasing retirement contributions by an additional 2%</span>
                  </li>
                  <li className="flex gap-2">
                    <ThumbsUp className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>Reduce dining out expenses to stay within your food budget</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

