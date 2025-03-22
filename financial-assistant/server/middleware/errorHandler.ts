import type { Request, Response, NextFunction } from "express"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)

  // Default error status and message
  let statusCode = err.statusCode || 500
  let message = err.message || "Something went wrong"

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400
    message = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(", ")
  }

  // Handle Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    statusCode = 400
    message = `Duplicate value entered for ${Object.keys(err.keyValue)} field`
  }

  // Handle Mongoose cast error
  if (err.name === "CastError") {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  res.status(statusCode).json({ message })
}

