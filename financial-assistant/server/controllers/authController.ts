import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

// Generate JWT token
const createToken = (userId: string): string => {
  // Get the JWT secret from environment variables or use a fallback
  const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key_for_development"
  const jwtLifetime = process.env.JWT_LIFETIME || "30d"

  // Create the payload
  const payload = { userId }

  // Use a try-catch block to handle any potential errors
  try {
    // Use the sign method with explicit casting of the secret to string
    return jwt.sign(payload, String(jwtSecret), {
      expiresIn: jwtLifetime,
    })
  } catch (error) {
    console.error("Error signing JWT:", error)
    // Return a dummy token in case of error (this should never happen in production)
    return "error.creating.token"
  }
}

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, currency } = req.body

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" })
    }

    // Create new user
    const user = await User.create({ name, email, password, currency })

    // Generate token
    const token = createToken(user._id)

    // Return user data (excluding password)
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = createToken(user._id)

    // Return user data
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error("Get current user error:", error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

