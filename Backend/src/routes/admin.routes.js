import { Router } from 'express'
import {
    getStats,
    getPendingJobs,
    getAllJobs,
    verifyJob,
    rejectJob,
    deleteJobAdmin,
    getAllEmployers,
    verifyEmployer,
    getAllUsers,
    updateUserRole,
     banUser, unbanUser,
     getAnalytics,
     toggleFeaturedJob,
     broadcastEmail,
     toggleEmployerPremium ,
     getPendingDocuments,
      verifyDocument ,
      resetDocument,
      getAllDocuments,
    
      
} from '../controllers/admin.controller.js'
import { getContactRequests, reviewContactRequest } from '../controllers/Contact.controller.js'
import {  authMiddleware,adminMiddleware } from '../middleware/auth.middleware.js'

const adminRouter = Router()

adminRouter.use(authMiddleware)
adminRouter.use(adminMiddleware)

adminRouter.get('/stats', getStats)
adminRouter.get('/jobs/pending', getPendingJobs)
adminRouter.get('/jobs', getAllJobs)
adminRouter.put('/jobs/:id/verify', verifyJob)
adminRouter.put('/jobs/:id/reject', rejectJob)
adminRouter.delete('/jobs/:id', deleteJobAdmin)
adminRouter.get('/employers', getAllEmployers)
adminRouter.put('/employers/:id/verify', verifyEmployer)
adminRouter.get('/users', getAllUsers)
adminRouter.put('/users/:id/role', updateUserRole)
adminRouter.put('/users/:id/ban', banUser)
adminRouter.put('/users/:id/unban', unbanUser)
adminRouter.get('/analytics', getAnalytics)
adminRouter.put('/jobs/:id/feature', authMiddleware, adminMiddleware, toggleFeaturedJob)
adminRouter.post('/broadcast', authMiddleware, adminMiddleware, broadcastEmail)
adminRouter.put('/employers/:id/premium', toggleEmployerPremium)
adminRouter.get('/documents/pending', getPendingDocuments)
adminRouter.put('/documents/:id/verify', verifyDocument)
adminRouter.put('/documents/:id/reset', resetDocument)
adminRouter.get('/documents/all', getAllDocuments)
adminRouter.get('/contact-requests', getContactRequests)
adminRouter.put('/contact-requests/:id/review', reviewContactRequest)
export default adminRouter