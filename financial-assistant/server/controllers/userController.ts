import type { Request, Response } from "express"
import User from "../models/User"

// Update user profile
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, currency } = req.body

    // Find user by ID
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user fields
    if (name) user.name = name
    if (email) user.email = email
    if (currency) user.currency = currency

    // Save updated user
    await user.save()

    // Return updated user (excluding password)
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Update user password
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Find user by ID
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if current password is correct
    const isPasswordCorrect = await user.comparePassword(currentPassword)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Current password is incorrect" })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({ message: "Password updated successfully" })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

