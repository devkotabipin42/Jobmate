import { Router } from 'express'
import {
    applyJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus
} from '../controllers/application.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const applicationRouter = Router()

applicationRouter.post('/apply/:id', authMiddleware, applyJob)
applicationRouter.get('/my', authMiddleware, getMyApplications)
applicationRouter.get('/job/:id', authMiddleware, getJobApplications)
applicationRouter.put('/status/:id', authMiddleware, updateApplicationStatus)

export default applicationRouter