import { Router } from 'express'
import {
    registerUser,
    registerEmployer,
    login,
    logout,
    getMe,
    updateProfile 
} from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const authRouter = Router()

authRouter.post('/register/user', registerUser)
authRouter.post('/register/employer', registerEmployer)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/me', authMiddleware, getMe)
authRouter.put('/update', authMiddleware, updateProfile)

export default authRouter