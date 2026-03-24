import { Router } from 'express'
import {
    createJob,
    getAllJobs,
    getJob,
    updateJob,
    deleteJob,
    getEmployerJobs
} from '../controllers/job.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const jobRouter = Router()

jobRouter.get('/', getAllJobs)
jobRouter.get('/:id', getJob)
jobRouter.post('/', authMiddleware, createJob)
jobRouter.put('/:id', authMiddleware, updateJob)
jobRouter.delete('/:id', authMiddleware, deleteJob)
jobRouter.get('/employer/my-jobs', authMiddleware, getEmployerJobs)

export default jobRouter