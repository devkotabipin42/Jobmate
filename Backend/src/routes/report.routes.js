import { Router } from 'express'
import { createReport, getAllReports, resolveReport, dismissReport } from '../controllers/report.controller.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'

const reportRouter = Router()

// User routes
reportRouter.post('/job/:id', authMiddleware, createReport)

// Admin routes
reportRouter.get('/all', authMiddleware, adminMiddleware, getAllReports)
reportRouter.put('/:id/resolve', authMiddleware, adminMiddleware, resolveReport)
reportRouter.put('/:id/dismiss', authMiddleware, adminMiddleware, dismissReport)

export default reportRouter