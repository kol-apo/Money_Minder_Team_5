"use client"

import type React from "react"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useFinancial } from "@/components/financial-context"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export function SavingsGoals() {
  const { savingsGoals, formatCurrency, addSavingsGoal, updateSavingsGoal } = useFinancial()
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false)
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)

  // Form states for adding a new goal
  const [goalName, setGoalName] = useState("")
  const [goalAmount, setGoalAmount] = useState("")
  const [goalDeadline, setGoalDeadline] = useState("")

  // Form state for contributing to a goal
  const [contributionAmount, setContributionAmount] = useState("")

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()

    if (!goalName || !goalAmount || Number.parseFloat(goalAmount) <= 0 || !goalDeadline) {
      toast({
        title: "Invalid goal",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      })
      return
    }

    addSavingsGoal({
      name: goalName,
      target: Number.parseFloat(goalAmount),
      current: 0,
      deadline: goalDeadline,
    })

    // Reset form and close dialog
    setGoalName("")
    setGoalAmount("")
    setGoalDeadline("")

    toast({
      title: "Goal added",
      description: "Your savings goal has been added successfully.",
    })

    setIsAddGoalDialogOpen(false)
  }

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedGoalId || !contributionAmount || Number.parseFloat(contributionAmount) <= 0) {
      toast({
        title: "Invalid contribution",
        description: "Please enter a valid contribution amount.",
        variant: "destructive",
      })
      return
    }

    updateSavingsGoal(selectedGoalId, Number.parseFloat(contributionAmount))

    // Reset form and close dialog
    setContributionAmount("")
    setSelectedGoalId(null)

    toast({
      title: "Contribution added",
      description: "Your contribution has been added to the goal.",
    })

    setIsContributeDialogOpen(false)
  }

  const openContributeDialog = (goalId: string) => {
    setSelectedGoalId(goalId)
    setIsContributeDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Goals</h3>
        <Button size="sm" variant="outline" className="gap-1" onClick={() => setIsAddGoalDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Add Goal
        </Button>
      </div>

      {savingsGoals.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center rounded-full bg-muted p-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <h3 className="font-medium mb-1">No savings goals yet</h3>
          <p className="text-muted-foreground">Create your first goal to start tracking your progress.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {savingsGoals.map((goal) => {
            const percentage = Math.round((goal.current / goal.target) * 100)
            return (
              <Card key={goal.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex justify-between">
                    <span>{goal.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openContributeDialog(goal.id)}
                      className="h-6 px-2"
                    >
                      Contribute
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{formatCurrency(goal.current)}</span>
                    <span className="text-muted-foreground">{formatCurrency(goal.target)}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage}% complete</span>
                    <span>Target date: {goal.deadline}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Goal Dialog */}
      <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Savings Goal</DialogTitle>
            <DialogDescription>Create a new savings goal to track your progress.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGoal}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., Emergency Fund"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-amount">Target Amount</Label>
                <Input
                  id="goal-amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-deadline">Target Date</Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Goal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contribute to Goal Dialog */}
      <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contribute to Goal</DialogTitle>
            <DialogDescription>Add money to your savings goal.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContribute}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contribution-amount">Contribution Amount</Label>
                <Input
                  id="contribution-amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Contribute</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

