import { hash, compare } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { query } from "./db"

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// User type definition
export type User = {
  id: string
  name: string
  email: string
  currency: string
  bio?: string
}

// Register a new user
export async function registerUser(name: string, email: string, password: string, currency = "USD") {
  try {
    // Check if user already exists
    const existingUsers = await query("SELECT * FROM users WHERE email = ?", [email])
    if ((existingUsers as any[]).length > 0) {
      throw new Error("User with this email already exists")
    }

    // Hash the password
    const passwordHash = await hash(password, 10)

    // Generate a unique ID
    const userId = uuidv4()

    // Insert the new user
    await query("INSERT INTO users (id, name, email, password_hash, currency) VALUES (?, ?, ?, ?, ?)", [
      userId,
      name,
      email,
      passwordHash,
      currency,
    ])

    // Create initial financial summary
    await query(
      "INSERT INTO financial_summaries (user_id, income, expenses, balance, savings_rate) VALUES (?, 0, 0, 0, 0)",
      [userId],
    )

    // Return the user object (without password)
    return {
      id: userId,
      name,
      email,
      currency,
    }
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

// Login a user
export async function loginUser(email: string, password: string) {
  try {
    // Find the user
    const users = await query("SELECT * FROM users WHERE email = ?", [email])
    const user = (users as any[])[0]

    if (!user) {
      throw new Error("User not found")
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password_hash)
    if (!isPasswordValid) {
      throw new Error("Invalid password")
    }

    // Generate JWT token
    const token = sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Return user and token
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        bio: user.bio,
      },
      token,
    }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

// Verify JWT token
export function verifyToken(token: string): User {
  try {
    const decoded = verify(token, JWT_SECRET) as User
    return decoded
  } catch (error) {
    throw new Error("Invalid token")
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const users = await query("SELECT id, name, email, currency, bio FROM users WHERE id = ?", [userId])
    const user = (users as any[])[0]

    if (!user) {
      return null
    }

    return user as User
  } catch (error) {
    console.error("Get user error:", error)
    throw error
  }
}

// Update user profile
export async function updateUserProfile(userId: string, data: Partial<User>) {
  try {
    const { name, email, currency, bio } = data

    // Build the query dynamically based on provided fields
    let sql = "UPDATE users SET "
    const params = []
    const updates = []

    if (name) {
      updates.push("name = ?")
      params.push(name)
    }

    if (email) {
      updates.push("email = ?")
      params.push(email)
    }

    if (currency) {
      updates.push("currency = ?")
      params.push(currency)
    }

    if (bio !== undefined) {
      updates.push("bio = ?")
      params.push(bio)
    }

    if (updates.length === 0) {
      return false // Nothing to update
    }

    sql += updates.join(", ") + " WHERE id = ?"
    params.push(userId)

    await query(sql, params)
    return true
  } catch (error) {
    console.error("Update user error:", error)
    throw error
  }
}

