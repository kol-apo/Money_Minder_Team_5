"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/profile/profile-form"
import { AccountSettings } from "@/components/profile/account-settings"
import { NotificationSettings } from "@/components/profile/notification-settings"
import { MigrationHelper } from "@/components/migration-helper"
import { useAuth } from "@/components/auth-context"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const [showMigration, setShowMigration] = useState(false)

  // Check if there's data in localStorage to migrate
  useEffect(() => {
    const hasLocalData =
      localStorage.getItem("moneyminder_income") !== null ||
      localStorage.getItem("moneyminder_transactions") !== null ||
      localStorage.getItem("moneyminder_savings_goals") !== null

    setShowMigration(hasLocalData)
  }, [])

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
        </div>

        {showMigration && (
          <div className="mb-6">
            <MigrationHelper />
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account security and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

