import { Router } from 'express'
import {
    sendAaratiFollowUp,
    receiveAaratiFollowUpReply,getAaratiFollowUpLogs
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

integrationRouter.post(
    '/aarati-followup/reply',
    receiveAaratiFollowUpReply
)

export default integrationRouter