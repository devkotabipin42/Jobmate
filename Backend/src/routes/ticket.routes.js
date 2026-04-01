import { Router } from 'express'
import {
    createTicket,
    getUserTickets,
    getAllTickets,
    replyTicket,
    updateTicketStatus
} from '../controllers/ticket.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const ticketRouter = Router()

ticketRouter.post('/', authMiddleware, createTicket)
ticketRouter.get('/my', authMiddleware, getUserTickets)
ticketRouter.get('/all', authMiddleware, getAllTickets)
ticketRouter.post('/:id/reply', authMiddleware, replyTicket)
ticketRouter.put('/:id/status', authMiddleware, updateTicketStatus)

export default ticketRouter