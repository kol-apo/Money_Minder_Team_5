import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart2, PieChart } from "lucide-react"
import { ReportsList } from "@/components/reports/reports-list"

export const metadata: Metadata = {
  title: "Financial Reports | MoneyMinder",
  description: "Generate and download financial reports and analysis",
}

export default function ReportsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">Generate, view, and download detailed financial reports and analysis.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Monthly Summary</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                A comprehensive overview of your monthly income, expenses, and savings.
              </div>
              <Button size="sm" className="w-full gap-1">
                <Download className="h-4 w-4" /> Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Spending Analysis</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                Detailed breakdown of your spending by category with trend analysis.
              </div>
              <Button size="sm" className="w-full gap-1">
                <Download className="h-4 w-4" /> Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Annual Review</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                Year-to-date financial performance with year-over-year comparisons.
              </div>
              <Button size="sm" className="w-full gap-1">
                <Download className="h-4 w-4" /> Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Your previously generated financial reports</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportsList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

