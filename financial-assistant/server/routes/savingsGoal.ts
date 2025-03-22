import express from "express"
import {
  createSavingsGoal,
  getAllSavingsGoals,
  getSavingsGoalById,
  updateSavingsGoal,
  deleteSavingsGoal,
  contributeTosavingsGoal,
} from "../controllers/savingsGoalController"
import { authenticateUser } from "../middleware/auth"

const router = express.Router()

// All routes require authentication
router.use(authenticateUser)

router.post("/", createSavingsGoal)
router.get("/", getAllSavingsGoals)
router.get("/:id", getSavingsGoalById)
router.patch("/:id", updateSavingsGoal)
router.delete("/:id", deleteSavingsGoal)
router.patch("/:id/contribute", contributeTosavingsGoal)

export default router

