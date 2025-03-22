import type { Request, Response } from "express"
import SavingsGoal from "../models/SavingsGoal"

// Create a new savings goal
export const createSavingsGoal = async (req: Request, res: Response) => {
  try {
    const { name, target, current, deadline } = req.body

    // Create savings goal with user ID from auth middleware
    const savingsGoal = await SavingsGoal.create({
      user: req.user.userId,
      name,
      target,
      current: current || 0,
      deadline,
    })

    res.status(201).json({ savingsGoal })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Get all savings goals for the current user
export const getAllSavingsGoals = async (req: Request, res: Response) => {
  try {
    // Find savings goals for current user
    const savingsGoals = await SavingsGoal.find({ user: req.user.userId }).sort({ createdAt: -1 })

    res.status(200).json({ savingsGoals, count: savingsGoals.length })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Get a single savings goal by ID
export const getSavingsGoalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Find savings goal by ID and user ID
    const savingsGoal = await SavingsGoal.findOne({
      _id: id,
      user: req.user.userId,
    })

    if (!savingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" })
    }

    res.status(200).json({ savingsGoal })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Update a savings goal
export const updateSavingsGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, target, deadline } = req.body

    // Find and update savings goal
    const savingsGoal = await SavingsGoal.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      { name, target, deadline },
      { new: true, runValidators: true },
    )

    if (!savingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" })
    }

    res.status(200).json({ savingsGoal })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Delete a savings goal
export const deleteSavingsGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Find and delete savings goal
    const savingsGoal = await SavingsGoal.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    })

    if (!savingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" })
    }

    res.status(200).json({ message: "Savings goal deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Contribute to a savings goal
export const contributeTosavingsGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { amount } = req.body

    // Find savings goal
    const savingsGoal = await SavingsGoal.findOne({
      _id: id,
      user: req.user.userId,
    })

    if (!savingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" })
    }

    // Update current amount
    savingsGoal.current = Math.min(savingsGoal.current + amount, savingsGoal.target)
    await savingsGoal.save()

    res.status(200).json({ savingsGoal })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

