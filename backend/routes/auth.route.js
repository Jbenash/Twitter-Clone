import express from "express";
import { signUp, login, logout, getMe } from "../controller/auth.controller.js"
import auth from "../middleware/auth.js";

const authRouter = express.Router()

authRouter.post('/signup', signUp)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/me', auth, getMe)


export default authRouter