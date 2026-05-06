import { Router } from 'express'
import {
    createJob,
    getAllJobs,
    getJob,
    updateJob,
    deleteJob,
    getRecommendedJobs
} from '../controllers/job.controller.js'
import { authMiddleware, employerMiddleware } from '../middleware/auth.middleware.js'

const jobRouter = Router()

jobRouter.get('/recommended/for-you', authMiddleware, getRecommendedJobs)
jobRouter.get('/', getAllJobs)
jobRouter.get('/:id', getJob)

jobRouter.post('/', authMiddleware, employerMiddleware, createJob)
jobRouter.put('/:id', authMiddleware, employerMiddleware, updateJob)
jobRouter.delete('/:id', authMiddleware, employerMiddleware, deleteJob)

export default jobRouter