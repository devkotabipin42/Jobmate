import { Router } from 'express'
import {
    sendAaratiFollowUp,
    receiveAaratiFollowUpReply,getAaratiFollowUpLogs,retryAaratiFollowUpLog
} from '../controllers/integration.controller.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'

const integrationRouter = Router()

integrationRouter.post(
    '/aarati-followup/send',
    authMiddleware,
    adminMiddleware,
    sendAaratiFollowUp
)

integrationRouter.get(
    '/aarati-followup/logs',
    authMiddleware,
    adminMiddleware,
    getAaratiFollowUpLogs
)
integrationRouter.put(
    '/aarati-followup/logs/:id/retry',
    authMiddleware,
    adminMiddleware,
    retryAaratiFollowUpLog
)

integrationRouter.post(
    '/aarati-followup/reply',
    receiveAaratiFollowUpReply
)

export default integrationRouter