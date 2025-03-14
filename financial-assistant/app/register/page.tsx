"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Wallet, Mail } from "lucide-react"

/**
 * Registration Page
 *
 * This page handles user registration with email verification.
 */

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Show success message
      setRegistrationComplete(true)
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-2">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            {registrationComplete ? "Registration Complete" : "Create an Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {registrationComplete
              ? "Please check your email to verify your account"
              : "Sign up for MoneyMinder to start managing your finances"}
          </CardDescription>
        </CardHeader>

        {!registrationComplete ? (
          // Registration form
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          // Registration complete message
          <CardContent className="space-y-6 text-center">
            <div className="flex justify-center">
              <Mail className="h-16 w-16 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Verification Email Sent</h3>
              <p className="text-muted-foreground">
                We've sent a verification email to <span className="font-medium">{email}</span>. Please check your inbox
                and click the verification link to activate your account.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or click below to resend.
              </p>
              <Button variant="outline" className="mt-2" onClick={() => {}}>
                Resend Verification Email
              </Button>
            </div>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="link">Return to Login</Button>
              </Link>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

