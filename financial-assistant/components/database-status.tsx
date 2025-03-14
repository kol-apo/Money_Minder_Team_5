"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking")
  const [message, setMessage] = useState("")
  const [isInitializing, setIsInitializing] = useState(false)

  const checkDatabase = async () => {
    setStatus("checking")
    setMessage("")

    try {
      const response = await fetch("/api/init-db")
      const data = await response.json()

      if (data.success) {
        setStatus("connected")
        setMessage("Database is connected and initialized.")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to initialize database.")
      }
    } catch (error: any) {
      setStatus("error")
      setMessage(error.message || "Failed to connect to database.")
    }
  }

  const initializeDatabase = async () => {
    setIsInitializing(true)

    try {
      const response = await fetch("/api/init-db")
      const data = await response.json()

      if (data.success) {
        setStatus("connected")
        setMessage("Database initialized successfully.")
        toast({
          title: "Database initialized",
          description: "The database tables have been created successfully.",
        })
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to initialize database.")
        toast({
          title: "Initialization failed",
          description: data.error || "Failed to initialize database.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setStatus("error")
      setMessage(error.message || "Failed to initialize database.")
      toast({
        title: "Initialization failed",
        description: error.message || "Failed to initialize database.",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  // Check database status on mount
  useEffect(() => {
    checkDatabase()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Database Status
          {status === "connected" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
          {status === "checking" && <RefreshCw className="h-5 w-5 animate-spin" />}
        </CardTitle>
        <CardDescription>Check and initialize your MySQL database connection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">
            Status:{" "}
            <span
              className={
                status === "connected"
                  ? "text-green-500 font-medium"
                  : status === "error"
                    ? "text-red-500 font-medium"
                    : ""
              }
            >
              {status}
            </span>
          </div>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={checkDatabase} variant="outline" disabled={status === "checking"}>
          Check Connection
        </Button>
        <Button onClick={initializeDatabase} disabled={isInitializing || status === "checking"}>
          {isInitializing ? "Initializing..." : "Initialize Database"}
        </Button>
      </CardFooter>
    </Card>
  )
}

