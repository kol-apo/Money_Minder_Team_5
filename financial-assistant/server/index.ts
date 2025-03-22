import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/user"
import transactionRoutes from "./routes/transaction"
import savingsGoalRoutes from "./routes/savingsGoal"
import { errorHandler } from "./middleware/errorHandler"

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/savings-goals", savingsGoalRoutes)

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

