import express, { Router } from 'express'
import { editProfile, profileInfo, toggleFollow, } from '../controller/user.controller.js'
import auth from '../middleware/auth.js'
import { getSuggestedUsers } from '../controller/user.controller.js'

const userRouter = express.Router()

userRouter.get('/profile/:username', auth, profileInfo)
userRouter.post('/profile/update-profile', auth, editProfile)
userRouter.post('/profile/follow/:userId', auth, toggleFollow)
userRouter.get('/suggested', auth, getSuggestedUsers)


export default userRouter