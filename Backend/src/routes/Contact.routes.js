import { Router } from 'express'
import { requestContact, getContactStatus } from '../controllers/Contact.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
 
const contactRouter = Router()
 
// Employer routes
contactRouter.post('/request', authMiddleware, requestContact)
contactRouter.get('/status/:jobseeker_id', authMiddleware, getContactStatus)
 
export default contactRouter