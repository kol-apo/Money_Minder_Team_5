"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

const reports = [
  {
    id: "1",
    name: "Monthly Summary - April 2023",
    date: "2023-04-30",
    type: "Monthly",
  },
  {
    id: "2",
    name: "Spending Analysis - Q1 2023",
    date: "2023-03-31",
    type: "Quarterly",
  },
  {
    id: "3",
    name: "Annual Review - 2022",
    date: "2023-01-15",
    type: "Annual",
  },
  {
    id: "4",
    name: "Monthly Summary - March 2023",
    date: "2023-03-31",
    type: "Monthly",
  },
  {
    id: "5",
    name: "Monthly Summary - February 2023",
    date: "2023-02-28",
    type: "Monthly",
  },
]

export function ReportsList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Report Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell className="font-medium">{report.name}</TableCell>
            <TableCell>{report.date}</TableCell>
            <TableCell>{report.type}</TableCell>
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
        ))}
      </TableBody>
    </Table>
  )
}

