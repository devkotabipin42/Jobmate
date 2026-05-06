import { Router } from 'express'
import {
    getAllEmployers,
    getEmployerProfile,
    uploadLogos,
    updateCompanyProfile,
    getJobseekerProfile
} from '../controllers/employer.controller.js'
import { authMiddleware, employerMiddleware } from '../middleware/auth.middleware.js'
import { uploadLogo } from '../config/cloudinary.js'

const employerRouter = Router()

employerRouter.get('/all', getAllEmployers)
employerRouter.get('/jobseeker/:id', authMiddleware, employerMiddleware, getJobseekerProfile)
employerRouter.post('/upload-logo', authMiddleware, employerMiddleware, uploadLogo.single('logo'), uploadLogos)
employerRouter.put('/update-profile', authMiddleware, employerMiddleware, updateCompanyProfile)
employerRouter.get('/:id', getEmployerProfile)

export default employerRouter