import { Router } from 'express'
import { getAllEmployers, getEmployerProfile, uploadLogos,updateCompanyProfile } from '../controllers/employer.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { uploadLogo, uploadCV } from '../config/cloudinary.js'

const employerRouter = Router()

employerRouter.get('/all', getAllEmployers)
employerRouter.get('/:id', getEmployerProfile)
employerRouter.post('/upload-logo', authMiddleware, uploadLogo.single('logo'), uploadLogos)
employerRouter.put('/update-profile', authMiddleware, updateCompanyProfile)
export default employerRouter