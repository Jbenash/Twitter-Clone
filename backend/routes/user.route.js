import express, { Router } from 'express'
import { editProfile, profileInfo } from '../controller/user.controller.js'
import auth from '../middleware/auth.js'


const userRouter = express.Router()

userRouter.get('/profile/:username', auth, profileInfo)
userRouter.post('/profile/update-profile', auth, editProfile)



export default userRouter