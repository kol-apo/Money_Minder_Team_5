import express from "express"
import { updateUser, updatePassword } from "../controllers/userController"
import { authenticateUser } from "../middleware/auth"

const router = express.Router()

// All routes require authentication
router.use(authenticateUser)

router.patch("/update", updateUser)
router.patch("/update-password", updatePassword)

export default router

