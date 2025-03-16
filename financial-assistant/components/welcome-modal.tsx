"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("moneyMinder_hasVisited")
    const hasCompletedSetup = localStorage.getItem("moneyminder_setup_completed")

    if (!hasVisited && !hasCompletedSetup) {
      setIsOpen(true)
    }
  }, [])

  const handleGetStarted = () => {
    localStorage.setItem("moneyMinder_hasVisited", "true")
    setIsOpen(false)
    router.push("/setup")
  }

  const handleClose = () => {
    localStorage.setItem("moneyMinder_hasVisited", "true")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to MoneyMinder!</DialogTitle>
          <DialogDescription>Your personal finance tracker to help you manage your money better.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div>
              <p className="font-medium">Track Your Finances</p>
              <p className="text-sm text-muted-foreground">
                Record income and expenses to understand your spending habits
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div>
              <p className="font-medium">Set Financial Goals</p>
              <p className="text-sm text-muted-foreground">Create savings goals and track your progress</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div>
              <p className="font-medium">Get Financial Insights</p>
              <p className="text-sm text-muted-foreground">
                Visualize your spending patterns and get personalized advice
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} className="sm:w-auto w-full">
            Skip
          </Button>
          <Button onClick={handleGetStarted} className="sm:w-auto w-full">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

