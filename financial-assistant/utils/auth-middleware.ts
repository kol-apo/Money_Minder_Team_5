import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { verifyToken, getUserById, type User } from "./auth-service"

/**
 * Authentication Middleware
 *
 * This utility handles extracting and verifying user authentication
 * from incoming requests.
 */

/**
 * Get the authenticated user from the request
 *
 * @param req - The incoming request
 * @returns The authenticated user or null if not authenticated
 */
export async function getUserFromRequest(req: NextRequest): Promise<User | null> {
  try {
    // Get the token from cookies
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return null
    }

    // Verify the token
    const decoded = verifyToken(token)

    // Get the user from the database
    const user = await getUserById(decoded.id)

    return user
  } catch (error) {
    console.error("Auth middleware error:", error)
    return null
  }
}

