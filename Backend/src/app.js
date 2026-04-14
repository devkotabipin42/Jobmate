import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
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
const app = express()
app.set('trust proxy', 1)

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://jobmate-two.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests — try again after 15 minutes' }
})
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))
app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: false,
}))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use('/api/', limiter)

app.get('/', (req, res) => {
    res.json({ message: 'Jobmate API running!' })
})

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
export default app