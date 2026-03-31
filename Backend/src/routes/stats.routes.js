import { Router } from 'express'
import { getPublicStats } from '../controllers/stats.controller.js'

const statsRouter = Router()

statsRouter.get('/', getPublicStats)

export default statsRouter