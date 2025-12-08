import express from "express";
import { signUp } from "../controller/auth.controller.js"
import { login } from "../controller/auth.controller.js"
import { logout } from "../controller/auth.controller.js"


const userRouter = express.Router()

userRouter.post('/signup', signUp)
userRouter.post('/login', login)
userRouter.post('/logout', logout)


export default userRouter