"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatabaseStatus } from "@/components/database-status"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is admin (this is a simple check - in a real app, you'd check roles)
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login?redirect=/admin")
      } else {
        // For demo purposes, we'll consider the first registered user as admin
        // In a real app, you'd check user roles from the database
        setIsAdmin(true)
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your application's database and settings.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <DatabaseStatus />

          <Card>
            <CardHeader>
              <CardTitle>Database Information</CardTitle>
              <CardDescription>Your MySQL database connection details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Host:</div>
                  <div className="text-sm">{process.env.MYSQL_HOST || "Not set"}</div>

                  <div className="text-sm font-medium">Database:</div>
                  <div className="text-sm">{process.env.MYSQL_DATABASE || "Not set"}</div>

                  <div className="text-sm font-medium">User:</div>
                  <div className="text-sm">{process.env.MYSQL_USER || "Not set"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

