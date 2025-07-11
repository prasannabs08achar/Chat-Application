import express from 'express'
import { login, signup, updateProfile,checkAuth } from '../controller/user.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const userRouter=express.Router()
userRouter.post('/register',signup)
userRouter.post('/login',login)
userRouter.put('/profile',protectRoute,updateProfile)
userRouter.get('/checkAuth',protectRoute,checkAuth)

export default userRouter