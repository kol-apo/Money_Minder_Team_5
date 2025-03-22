import express from "express"
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController"
import { authenticateUser } from "../middleware/auth"

const router = express.Router()

// All routes require authentication
router.use(authenticateUser)

router.post("/", createTransaction)
router.get("/", getAllTransactions)
router.get("/:id", getTransactionById)
router.patch("/:id", updateTransaction)
router.delete("/:id", deleteTransaction)

export default router

