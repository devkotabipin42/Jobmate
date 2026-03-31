import { Router } from 'express'
import { uploadCV } from '../config/cloudinary.js'
import { uploadCV as uploadCVController } from '../controllers/auth.controller.js'
import {
    registerUser,
    registerEmployer,
    login,
    logout,
    getMe,
    updateProfile,
    saveJob,
     getSavedJobs ,
     deleteCV,
     sendOTP,
     verifyOTP,
     updateJobAlerts
} from '../controllers/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const authRouter = Router()

authRouter.post('/register/user', registerUser)
authRouter.post('/register/employer', registerEmployer)
authRouter.post('/login', login)
authRouter.post('/logout',authMiddleware, logout)
authRouter.get('/me', authMiddleware, getMe)
authRouter.put('/update', authMiddleware, updateProfile)
authRouter.post('/save-job/:id', authMiddleware, saveJob)
authRouter.get('/saved-jobs', authMiddleware, getSavedJobs)
authRouter.post('/upload-cv', authMiddleware, uploadCV.single('cv'), uploadCVController)
authRouter.delete('/delete-cv', authMiddleware, deleteCV)
authRouter.post('/send-otp', sendOTP)
authRouter.post('/verify-otp', verifyOTP)
authRouter.put('/job-alerts', authMiddleware, updateJobAlerts)

export default authRouter