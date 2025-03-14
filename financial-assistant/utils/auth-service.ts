import { hash, compare } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { executeQuery } from "./database-connection"
import { sendVerificationEmail } from "./email-service"
import { generateSecret, verifyCode } from "./two-factor-auth"
import crypto from "crypto"

/**
 * Authentication Service
 *
 * This utility handles user authentication, including:
 * - User registration with email verification
 * - Login with optional 2FA
 * - Password management
 * - Token verification
 */

// Secret key for JWT from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// User type definition
export type User = {
  id: string
  name: string
  email: string
  currency: string
  bio?: string
  emailVerified: boolean
  twoFactorEnabled: boolean
}

/**
 * Register a new user
 *
 * @param name - User's full name
 * @param email - User's email address
 * @param password - User's password
 * @param currency - Preferred currency (default: USD)
 * @returns The created user object
 */
export async function registerUser(name: string, email: string, password: string, currency = "USD") {
  try {
    // Check if user already exists
    const existingUsers = await executeQuery("SELECT * FROM users WHERE email = ?", [email])
    if ((existingUsers as any[]).length > 0) {
      throw new Error("User with this email already exists")
    }

    // Hash the password
    const passwordHash = await hash(password, 10)

    // Generate a unique ID
    const userId = uuidv4()

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")

    // Insert the new user
    await executeQuery(
      "INSERT INTO users (id, name, email, password_hash, currency, verification_token) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, name, email, passwordHash, currency, verificationToken],
    )

    // Create initial financial summary
    await executeQuery(
      "INSERT INTO financial_summaries (user_id, income, expenses, balance, savings_rate) VALUES (?, 0, 0, 0, 0)",
      [userId],
    )

    // Send verification email
    await sendVerificationEmail(email, name, verificationToken)

    // Return the user object (without password)
    return {
      id: userId,
      name,
      email,
      currency,
      emailVerified: false,
      twoFactorEnabled: false,
    }
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

/**
 * Verify a user's email address
 *
 * @param token - The verification token from the email
 * @returns Whether the verification was successful
 */
export async function verifyEmail(token: string) {
  try {
    // Find the user with this verification token
    const users = await executeQuery("SELECT id FROM users WHERE verification_token = ?", [token])

    if ((users as any[]).length === 0) {
      return { success: false, message: "Invalid verification token" }
    }

    const user = (users as any[])[0]

    // Update the user's email verification status
    await executeQuery("UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE id = ?", [user.id])

    return { success: true }
  } catch (error) {
    console.error("Email verification error:", error)
    return { success: false, message: "Verification failed" }
  }
}

/**
 * Login a user
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns User object and JWT token if successful
 */
export async function loginUser(email: string, password: string) {
  try {
    // Find the user
    const users = await executeQuery("SELECT * FROM users WHERE email = ?", [email])
    const user = (users as any[])[0]

    if (!user) {
      throw new Error("User not found")
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password_hash)
    if (!isPasswordValid) {
      throw new Error("Invalid password")
    }

    // Check if email is verified
    if (!user.email_verified) {
      throw new Error("Please verify your email address before logging in")
    }

    // Check if 2FA is enabled
    if (user.two_factor_enabled) {
      // Return partial login info, requiring 2FA code
      return {
        requiresTwoFactor: true,
        userId: user.id,
        email: user.email,
        name: user.name,
      }
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
        emailVerified: !!user.email_verified,
        twoFactorEnabled: !!user.two_factor_enabled,
      },
      token,
    }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

/**
 * Complete login with 2FA
 *
 * @param userId - User's ID
 * @param code - 2FA code provided by the user
 * @returns User object and JWT token if successful
 */
export async function verifyTwoFactorLogin(userId: string, code: string) {
  try {
    // Get the user
    const users = await executeQuery("SELECT * FROM users WHERE id = ?", [userId])
    const user = (users as any[])[0]

    if (!user) {
      throw new Error("User not found")
    }

    // Verify the 2FA code
    const isCodeValid = verifyCode(code, user.two_factor_secret)

    if (!isCodeValid) {
      throw new Error("Invalid verification code")
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
        emailVerified: !!user.email_verified,
        twoFactorEnabled: !!user.two_factor_enabled,
      },
      token,
    }
  } catch (error) {
    console.error("2FA verification error:", error)
    throw error
  }
}

/**
 * Enable two-factor authentication for a user
 *
 * @param userId - User's ID
 * @returns The 2FA secret and QR code
 */
export async function enableTwoFactor(userId: string) {
  try {
    // Get the user
    const users = await executeQuery("SELECT * FROM users WHERE id = ?", [userId])
    const user = (users as any[])[0]

    if (!user) {
      throw new Error("User not found")
    }

    // Generate a new 2FA secret
    const secret = generateSecret()

    // Update the user's 2FA settings
    await executeQuery("UPDATE users SET two_factor_secret = ? WHERE id = ?", [secret, userId])

    return { secret }
  } catch (error) {
    console.error("Enable 2FA error:", error)
    throw error
  }
}

/**
 * Activate two-factor authentication after verification
 *
 * @param userId - User's ID
 * @param code - 2FA code provided by the user
 * @returns Whether activation was successful
 */
export async function activateTwoFactor(userId: string, code: string) {
  try {
    // Get the user
    const users = await executeQuery("SELECT * FROM users WHERE id = ?", [userId])
    const user = (users as any[])[0]

    if (!user) {
      throw new Error("User not found")
    }

    // Verify the 2FA code
    const isCodeValid = verifyCode(code, user.two_factor_secret)

    if (!isCodeValid) {
      throw new Error("Invalid verification code")
    }

    // Activate 2FA
    await executeQuery("UPDATE users SET two_factor_enabled = TRUE WHERE id = ?", [userId])

    return { success: true }
  } catch (error) {
    console.error("Activate 2FA error:", error)
    throw error
  }
}

/**
 * Disable two-factor authentication
 *
 * @param userId - User's ID
 * @returns Whether disabling was successful
 */
export async function disableTwoFactor(userId: string) {
  try {
    // Update the user's 2FA settings
    await executeQuery("UPDATE users SET two_factor_enabled = FALSE, two_factor_secret = NULL WHERE id = ?", [userId])

    return { success: true }
  } catch (error) {
    console.error("Disable 2FA error:", error)
    throw error
  }
}

/**
 * Verify JWT token
 *
 * @param token - JWT token
 * @returns Decoded user information
 */
export function verifyToken(token: string): User {
  try {
    const decoded = verify(token, JWT_SECRET) as User
    return decoded
  } catch (error) {
    throw new Error("Invalid token")
  }
}

/**
 * Get user by ID
 *
 * @param userId - User's ID
 * @returns User object or null if not found
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const users = await executeQuery(
      "SELECT id, name, email, currency, bio, email_verified, two_factor_enabled FROM users WHERE id = ?",
      [userId],
    )
    const user = (users as any[])[0]

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      bio: user.bio,
      emailVerified: !!user.email_verified,
      twoFactorEnabled: !!user.two_factor_enabled,
    }
  } catch (error) {
    console.error("Get user error:", error)
    throw error
  }
}

/**
 * Update user profile
 *
 * @param userId - User's ID
 * @param data - Updated user data
 * @returns Whether update was successful
 */
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

    await executeQuery(sql, params)
    return true
  } catch (error) {
    console.error("Update user error:", error)
    throw error
  }
}

