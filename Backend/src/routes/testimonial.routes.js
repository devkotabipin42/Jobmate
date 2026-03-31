import { Router } from 'express'
import {
    submitTestimonial,
    getApprovedTestimonials,
    getAllTestimonials,
    approveTestimonial,
    rejectTestimonial,
    toggleFeatured,
    deleteTestimonial
} from '../controllers/testimonial.controller.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'
const testimonialRouter = Router()

testimonialRouter.get('/', getApprovedTestimonials)
testimonialRouter.post('/submit', authMiddleware, submitTestimonial)
testimonialRouter.get('/all', authMiddleware, adminMiddleware, getAllTestimonials)
testimonialRouter.put('/:id/approve', authMiddleware, adminMiddleware, approveTestimonial)
testimonialRouter.put('/:id/reject', authMiddleware, adminMiddleware, rejectTestimonial)
testimonialRouter.put('/:id/featured', authMiddleware, adminMiddleware, toggleFeatured)
testimonialRouter.delete('/:id', authMiddleware, adminMiddleware, deleteTestimonial)

export default testimonialRouter