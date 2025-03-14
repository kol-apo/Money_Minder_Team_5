"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const handleSaveChanges = () => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-transactions">Transaction Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive emails for new transactions.</p>
            </div>
            <Switch id="email-transactions" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-weekly">Weekly Summary</Label>
              <p className="text-sm text-muted-foreground">Receive a weekly summary of your finances.</p>
            </div>
            <Switch id="email-weekly" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-budget">Budget Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive alerts when you're approaching budget limits.</p>
            </div>
            <Switch id="email-budget" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-tips">Financial Tips</Label>
              <p className="text-sm text-muted-foreground">Receive personalized financial tips and advice.</p>
            </div>
            <Switch id="email-tips" defaultChecked />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-transactions">Transaction Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications for new transactions.</p>
            </div>
            <Switch id="push-transactions" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-budget">Budget Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive alerts when you're approaching budget limits.</p>
            </div>
            <Switch id="push-budget" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-security">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive alerts for suspicious account activity.</p>
            </div>
            <Switch id="push-security" defaultChecked />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">SMS Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-transactions">Large Transactions</Label>
              <p className="text-sm text-muted-foreground">Receive SMS alerts for transactions over $100.</p>
            </div>
            <Switch id="sms-transactions" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-security">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive SMS alerts for suspicious account activity.</p>
            </div>
            <Switch id="sms-security" defaultChecked />
          </div>
        </div>
      </div>

      <Button onClick={handleSaveChanges}>Save Changes</Button>
    </div>
  )
}

