import type { Request, Response } from "express"
import Transaction from "../models/Transaction"

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { date, description, amount, category } = req.body

    // Create transaction with user ID from auth middleware
    const transaction = await Transaction.create({
      user: req.user.userId,
      date,
      description,
      amount,
      category,
    })

    res.status(201).json({ transaction })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Get all transactions for the current user
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    // Get query parameters for filtering
    const { startDate, endDate, category } = req.query

    // Build query object
    const queryObject: any = { user: req.user.userId }

    // Add date range filter if provided
    if (startDate && endDate) {
      queryObject.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      }
    }

    // Add category filter if provided
    if (category) {
      queryObject.category = category
    }

    // Find transactions matching query
    const transactions = await Transaction.find(queryObject).sort({ date: -1 })

    res.status(200).json({ transactions, count: transactions.length })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Get a single transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Find transaction by ID and user ID
    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user.userId,
    })

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.status(200).json({ transaction })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Update a transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { date, description, amount, category } = req.body

    // Find and update transaction
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      { date, description, amount, category },
      { new: true, runValidators: true },
    )

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.status(200).json({ transaction })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Find and delete transaction
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    })

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    res.status(200).json({ message: "Transaction deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

