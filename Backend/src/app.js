import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import authRouter from './routes/auth.routes.js'
import jobRouter from './routes/job.routes.js'
import applicationRouter from './routes/application.routes.js'
import aiRouter from './routes/ai.routes.js'
import employerRouter from './routes/employer.routes.js'
import adminRouter from './routes/admin.routes.js'
import reportRouter from './routes/report.routes.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://jobmate-two.vercel.app'  
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

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

export default app