import { Router } from 'express'
import {
    exportLeadFinderCsv,
    getLeadFinderLeads,
    runLeadFinderSearch,
    updateLeadFinderLeadStatus
} from '../controllers/leadFinder.controller.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import {
    leadFinderRunSchema,
    leadFinderStatusSchema
} from '../validators/leadFinder.validators.js'

const leadFinderRouter = Router()

leadFinderRouter.use(authMiddleware)
leadFinderRouter.use(adminMiddleware)

leadFinderRouter.get('/', getLeadFinderLeads)
leadFinderRouter.post('/run', validate(leadFinderRunSchema), runLeadFinderSearch)
leadFinderRouter.patch('/:id/status', validate(leadFinderStatusSchema), updateLeadFinderLeadStatus)
leadFinderRouter.get('/export/csv', exportLeadFinderCsv)

export default leadFinderRouter
