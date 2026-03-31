import { Router } from 'express'
import { generateResume } from '../controllers/resume.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const resumeRouter = Router()

resumeRouter.post('/generate', authMiddleware, generateResume)

export default resumeRouter