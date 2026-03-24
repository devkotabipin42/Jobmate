import { Router } from 'express'
import { scoreResume } from '../controllers/ai.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const aiRouter = Router()

aiRouter.post('/score-resume', authMiddleware, scoreResume)

export default aiRouter