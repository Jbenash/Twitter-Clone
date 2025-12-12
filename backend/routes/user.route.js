import express, { Router } from 'express'
import { editProfile, profileInfo, toggleFollow, } from '../controller/user.controller.js'
import auth from '../middleware/auth.js'


const userRouter = express.Router()

userRouter.get('/profile/:username', auth, profileInfo)
userRouter.post('/profile/update-profile', auth, editProfile)
userRouter.post('/profile/follow/:userId', auth, toggleFollow)


export default userRouter