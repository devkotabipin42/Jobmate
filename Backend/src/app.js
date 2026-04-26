import express from 'express'
import * as Sentry from '@sentry/node'
import { requestLogger } from './middleware/requestLogger.middleware.js'
import logger from './config/logger.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { apiLimiter, authLimiter, publicLimiter } from './middleware/rateLimit.middleware.js'
import compression from 'compression'
import authRouter from './routes/auth.routes.js'
import jobRouter from './routes/job.routes.js'
import applicationRouter from './routes/application.routes.js'
import aiRouter from './routes/ai.routes.js'
import employerRouter from './routes/employer.routes.js'
import adminRouter from './routes/admin.routes.js'
import reportRouter from './routes/report.routes.js'
import resumeRouter from './routes/resume.routes.js'
import statsRouter from './routes/stats.routes.js'
import testimonialRouter from './routes/testimonial.routes.js'
import crmRouter from './routes/crm.routes.js'
import ticketRouter from './routes/ticket.routes.js'
import featuredCompanyRouter from './routes/Featuredcompany.routes.js'
import contactRouter from './routes/Contact.routes.js'
import opsRouter from './routes/ops.routes.js'

const app = express()
app.set('trust proxy', 1)

const corsOptions = {
    origin: ['http://localhost:5173', 'https://jobmate-two.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}
// Trust Render's proxy (required for accurate IP detection)
app.set('trust proxy', 1)

// CORS first
app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))

// Security headers
app.use(helmet({ crossOriginResourcePolicy: false, crossOriginOpenerPolicy: false, contentSecurityPolicy: false }))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(requestLogger)

// Rate limiting — MUST be before routes
app.use('/api/auth', authLimiter)
app.use('/api/jobs', publicLimiter)
app.use('/api', apiLimiter)

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))


app.get('/', (req, res) => res.json({ message: 'Jobmate API running!' }))

app.use('/api/auth', authRouter)
app.use('/api/jobs', jobRouter)
app.use('/api/applications', applicationRouter)
app.use('/api/ai', aiRouter)
app.use('/api/employer', employerRouter)
app.use('/api/admin', adminRouter)
app.use('/api/reports', reportRouter)
app.use('/api/resume', resumeRouter)
app.use('/api/stats', statsRouter)
app.use('/api/testimonials', testimonialRouter)
app.use('/api/crm', crmRouter)
app.use('/api/tickets', ticketRouter)
app.use('/api/admin/featured-companies', featuredCompanyRouter)
app.use('/api/contact', contactRouter)
app.use('/api/ops', opsRouter)

// Sentry error handler — MUST be after all routes
Sentry.setupExpressErrorHandler(app)

import { errorHandler, notFoundHandler } from './middleware/error.middleware.js'

// ... after all routes

// 404 for unknown routes
app.use(notFoundHandler)

// Sentry handler (already there)
Sentry.setupExpressErrorHandler(app)

// Global error handler — MUST be last
app.use(errorHandler)
export default app