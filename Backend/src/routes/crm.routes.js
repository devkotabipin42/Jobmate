import { Router } from 'express'
import {
    getCandidates,
    addCandidate,
    updateCandidateStatus,
    addNote,
    setFollowUp,
    deleteCandidate
} from '../controllers/crm.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const crmRouter = Router()

crmRouter.get('/', authMiddleware, getCandidates)
crmRouter.post('/', authMiddleware, addCandidate)
crmRouter.put('/:id/status', authMiddleware, updateCandidateStatus)
crmRouter.post('/:id/notes', authMiddleware, addNote)
crmRouter.put('/:id/follow-up', authMiddleware, setFollowUp)
crmRouter.delete('/:id', authMiddleware, deleteCandidate)

export default crmRouter