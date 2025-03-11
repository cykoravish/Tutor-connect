import express from "express"
import { protect } from "../middlewares/auth.js"
import { loginUser, profile, registerUser, logout } from "../controllers/user.controller.js"

const userRouter = express.Router()

// Auth routes
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/logout", logout)
userRouter.get("/profile", protect, profile)

export default userRouter

