import { Router } from 'express'
import {
    getFeaturedCompanies,
    getAllFeaturedCompanies,
    createFeaturedCompany,
    deleteFeaturedCompany,
    toggleFeaturedCompany
} from '../controllers/Featuredcompany.controller.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })
const featuredCompanyRouter = Router()

// Public — anyone can see active featured companies
featuredCompanyRouter.get('/', getFeaturedCompanies)

// Admin only
featuredCompanyRouter.get('/all', authMiddleware, adminMiddleware, getAllFeaturedCompanies)
featuredCompanyRouter.post('/', authMiddleware, adminMiddleware, upload.single('logo'), createFeaturedCompany)
featuredCompanyRouter.delete('/:id', authMiddleware, adminMiddleware, deleteFeaturedCompany)
featuredCompanyRouter.put('/:id/toggle', authMiddleware, adminMiddleware, toggleFeaturedCompany)

export default featuredCompanyRouter