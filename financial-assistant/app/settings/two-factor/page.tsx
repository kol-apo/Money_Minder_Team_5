"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-context"
import { generateQRCode } from "@/utils/two-factor-auth"
import { Shield, CheckCircle, AlertCircle } from "lucide-react"

/**
 * Two-Factor Authentication Setup Page
 *
 * This page allows users to set up 2FA for their account.
 */

export default function TwoFactorSetupPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const [setupStep, setSetupStep] = useState<"initial" | "setup" | "verify" | "complete">("initial")
  const [secret, setSecret] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/settings/two-factor")
    }
  }, [user, isLoading, router])

  // Start 2FA setup
  const startSetup = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/two-factor/setup", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to start 2FA setup")
      }

      const data = await response.json()
      setSecret(data.secret)

      // Generate QR code
      const qrCodeUrl = await generateQRCode(user?.email || "", data.secret)
      setQrCode(qrCodeUrl)

      setSetupStep("setup")
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message || "Failed to start 2FA setup",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Verify the 2FA code
  const verifySetup = async () => {
    if (!verificationCode) {
      toast({
        title: "Verification code required",
        description: "Please enter the verification code from your authenticator app",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/two-factor/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      })

      if (!response.ok) {
        throw new Error("Failed to verify 2FA setup")
      }

      setSetupStep("complete")
      toast({
        title: "Two-factor authentication enabled",
        description: "Your account is now more secure with 2FA",
      })
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Failed to verify 2FA setup",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Two-Factor Authentication</h1>
          <p className="text-muted-foreground">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Set Up Two-Factor Authentication</CardTitle>
            </div>
            <CardDescription>Protect your account with an additional security layer</CardDescription>
          </CardHeader>
          <CardContent>
            {setupStep === "initial" && (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Enhanced Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Two-factor authentication adds an extra layer of security to your account by requiring a second
                      verification step when you log in.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">How It Works</h3>
                    <p className="text-sm text-muted-foreground">
                      After enabling 2FA, you'll need to enter a verification code from your authenticator app each time
                      you log in, in addition to your password.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {setupStep === "setup" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Scan this QR code with your authenticator app</h3>
                  <div className="bg-white p-4 inline-block rounded-lg">
                    <img src={qrCode || "/placeholder.svg"} alt="QR Code for 2FA" className="w-48 h-48" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Manual Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    If you can't scan the QR code, you can manually enter this secret key in your authenticator app:
                  </p>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">{secret}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Recommended Apps</h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Google Authenticator (Android/iOS)</li>
                    <li>Microsoft Authenticator (Android/iOS)</li>
                    <li>Authy (Android/iOS/Desktop)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <Button onClick={() => setSetupStep("verify")} className="w-full">
                    Next: Verify Setup
                  </Button>
                </div>
              </div>
            )}

            {setupStep === "verify" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit verification code from your authenticator app to complete the setup.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
              </div>
            )}

            {setupStep === "complete" && (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-medium">Two-Factor Authentication Enabled</h3>
                <p className="text-muted-foreground">
                  Your account is now protected with an additional layer of security.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {setupStep === "initial" && (
              <Button onClick={startSetup} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Setting up..." : "Set Up Two-Factor Authentication"}
              </Button>
            )}

            {setupStep === "verify" && (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => setSetupStep("setup")}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={verifySetup} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Verifying..." : "Verify"}
                </Button>
              </div>
            )}

            {setupStep === "complete" && (
              <Button onClick={() => router.push("/settings")} className="w-full">
                Return to Settings
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

