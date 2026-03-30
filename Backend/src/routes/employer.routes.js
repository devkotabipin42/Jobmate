import { Router } from 'express'
import { getAllEmployers, getEmployerProfile } from '../controllers/employer.controller.js'
import { upload } from '../config/cloudinary.js'
import { uploadLogo } from '../controllers/employer.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
const employerRouter = Router()

employerRouter.get('/all', getAllEmployers)
employerRouter.get('/:id', getEmployerProfile)
employerRouter.post('/upload-logo', authMiddleware, upload.single('logo'), uploadLogo)

export default employerRouter