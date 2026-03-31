import { Router } from 'express'
import { getAllEmployers, getEmployerProfile, uploadLogos } from '../controllers/employer.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { uploadLogo, uploadCV } from '../config/cloudinary.js'
import { uploadCV as uploadCVController } from '../controllers/auth.controller.js'

const employerRouter = Router()

employerRouter.get('/all', getAllEmployers)
employerRouter.get('/:id', getEmployerProfile)
employerRouter.post('/upload-logo', authMiddleware, uploadLogo.single('logo'), uploadLogos)

export default employerRouter