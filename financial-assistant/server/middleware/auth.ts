import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface JwtPayload {
  userId: string
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  // Check for token in headers
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication invalid" })
  }

  const token = authHeader.split(" ")[1]
  const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key_for_development"

  try {
    // Verify token with explicit casting of the secret to string
    const payload = jwt.verify(token, String(jwtSecret)) as JwtPayload

    // Attach user to request object
    req.user = { userId: payload.userId }

    next()
  } catch (error) {
    console.error("Authentication error:", error)
    return res.status(401).json({ message: "Authentication invalid" })
  }
}

