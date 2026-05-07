import { Router } from 'express'
import {
    sendAaratiFollowUp,
    receiveAaratiFollowUpReply
} from '../controllers/integration.controller.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'

const integrationRouter = Router()

integrationRouter.post(
    '/aarati-followup/send',
    authMiddleware,
    adminMiddleware,
    sendAaratiFollowUp
)

integrationRouter.post(
    '/aarati-followup/reply',
    receiveAaratiFollowUpReply
)

export default integrationRouter