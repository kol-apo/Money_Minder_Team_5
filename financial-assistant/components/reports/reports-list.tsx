"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText, PieChart, BarChart2 } from "lucide-react"

const reports = [
  {
    id: "1",
    name: "February 2023 Monthly Summary",
    type: "Monthly Summary",
    date: "2023-03-01",
    icon: FileText,
  },
  {
    id: "2",
    name: "Q1 2023 Spending Analysis",
    type: "Spending Analysis",
    date: "2023-04-05",
    icon: PieChart,
  },
  {
    id: "3",
    name: "2022 Annual Financial Review",
    type: "Annual Review",
    date: "2023-01-15",
    icon: BarChart2,
  },
  {
    id: "4",
    name: "January 2023 Monthly Summary",
    type: "Monthly Summary",
    date: "2023-02-01",
    icon: FileText,
  },
  {
    id: "5",
    name: "December 2022 Monthly Summary",
    type: "Monthly Summary",
    date: "2023-01-02",
    icon: FileText,
  },
]

export function ReportsList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Report Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date Generated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => {
          const Icon = report.icon
          return (
            <TableRow key={report.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1 bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{report.name}</span>
                </div>
              </TableCell>
              <TableCell>{report.type}</TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

