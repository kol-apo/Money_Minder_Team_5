"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

/**
 * Email Verification Page
 *
 * This page handles verifying a user's email address
 * when they click the link in their verification email.
 */

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [verificationStatus, setVerificationStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMessage, setErrorMessage] = useState("")

  // Verify the email when the page loads
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error")
        setErrorMessage("Verification token is missing")
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (data.success) {
          setVerificationStatus("success")
        } else {
          setVerificationStatus("error")
          setErrorMessage(data.message || "Verification failed")
        }
      } catch (error: any) {
        setVerificationStatus("error")
        setErrorMessage(error.message || "An error occurred during verification")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Wallet className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {verificationStatus === "verifying" && "Verifying Your Email"}
            {verificationStatus === "success" && "Email Verified!"}
            {verificationStatus === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {verificationStatus === "verifying" && "Please wait while we verify your email address..."}
            {verificationStatus === "success" && "Your email has been successfully verified."}
            {verificationStatus === "error" && errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {verificationStatus === "verifying" && (
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          )}
          {verificationStatus === "success" && <CheckCircle className="h-16 w-16 text-green-500" />}
          {verificationStatus === "error" && <XCircle className="h-16 w-16 text-red-500" />}
        </CardContent>
        <CardFooter className="flex justify-center">
          {verificationStatus === "success" && (
            <Link href="/login">
              <Button>Log In to Your Account</Button>
            </Link>
          )}
          {verificationStatus === "error" && (
            <Link href="/login">
              <Button variant="outline">Return to Login</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

