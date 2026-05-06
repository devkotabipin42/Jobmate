import { Router } from 'express'
import {
    applyJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
    matchCV
} from '../controllers/application.controller.js'
import { authMiddleware, employerMiddleware } from '../middleware/auth.middleware.js'

const applicationRouter = Router()

applicationRouter.post('/apply/:id', authMiddleware, applyJob)
applicationRouter.get('/my', authMiddleware, getMyApplications)
applicationRouter.get('/job/:id', authMiddleware, employerMiddleware, getJobApplications)
applicationRouter.put('/status/:id', authMiddleware, employerMiddleware, updateApplicationStatus)
applicationRouter.get('/match/:jobId', authMiddleware, matchCV)

export default applicationRouter