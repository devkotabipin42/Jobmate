import { Router } from 'express'
import {
    createJob,
    getAllJobs,
    getJob,
    updateJob,
    deleteJob,
    getRecommendedJobs
} from '../controllers/job.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const jobRouter = Router()

jobRouter.get('/recommended/for-you', authMiddleware, getRecommendedJobs)
jobRouter.get('/', getAllJobs)
jobRouter.get('/:id', getJob)
jobRouter.post('/', authMiddleware, createJob)
jobRouter.put('/:id', authMiddleware, updateJob)
jobRouter.delete('/:id', authMiddleware, deleteJob)

export default jobRouter