import { Router } from 'express'
import { getAllEmployers, getEmployerProfile } from '../controllers/employer.controller.js'

const employerRouter = Router()

employerRouter.get('/all', getAllEmployers)
employerRouter.get('/:id', getEmployerProfile)

export default employerRouter