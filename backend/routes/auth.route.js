import express from "express";
import { signUp, login, logout, getMe } from "../controller/auth.controller.js"
import auth from "../middleware/auth.js";




const userRouter = express.Router()

userRouter.post('/signup', signUp)
userRouter.post('/login', login)
userRouter.post('/logout', logout)
userRouter.get('/me', auth, getMe)


export default userRouter