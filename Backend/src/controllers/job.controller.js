import Job from '../models/Job.model.js'
import User from '../models/user.model.js'
import transporter from '../config/mailer.js'
import redis, { isRedisConnected } from '../config/redis.js'
// Create Job — Employer only
export const createJob = async (req, res) => {
    try {
        const {
            title, description,
            salary_min, salary_max,
            location, category,
            type, experience, deadline,
            cv_required 
        } = req.body

        const job = await Job.create({
            title, description,
            salary_min, salary_max,
            location, category,
            type, experience, deadline,
            employer: req.user._id,
            cv_required 
        })

        // Job alerts — matching users email sent
        try {
            const matchingUsers = await User.find({
                'job_alerts.enabled': true,
                $or: [
                    { 'job_alerts.categories': category },
                    { 'job_alerts.locations': location },
                    { 'job_alerts.job_types': type },
                    {
                        'job_alerts.categories': { $size: 0 },
                        'job_alerts.locations': { $size: 0 },
                        'job_alerts.job_types': { $size: 0 }
                    }
                ]
            })

            if (matchingUsers.length > 0) {
                const emailPromises = matchingUsers.map(user =>
                    transporter.sendMail({
                        from: process.env.MAIL_USER,
                        to: user.email,
                        subject: `🔔 New Job Alert — ${title}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                                    <h1 style="color: white; margin: 0;">Jobmate</h1>
                                </div>
                                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                                    <h2 style="color: #111827;">New Job Alert! 🎯</h2>
                                    <p style="color: #6b7280;">Hi ${user.name}, a new job matches your preferences:</p>
                                    <div style="background: white; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; margin: 20px 0;">
                                        <h3 style="color: #16a34a; margin: 0 0 8px 0;">${title}</h3>
                                        <p style="color: #6b7280; margin: 0;">📍 ${location} · ${type}</p>
                                        <p style="color: #6b7280; margin: 8px 0 0;">💰 Rs. ${Number(salary_min).toLocaleString()} – ${Number(salary_max).toLocaleString()}</p>
                                    </div>
                                    <a href="https://jobmate-two.vercel.app/jobs/${job._id}"
                                       style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
                                        View & Apply →
                                    </a>
                                    <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
                                        To unsubscribe, go to Profile → Job Alerts.
                                    </p>
                                </div>
                            </div>
                        `
                    })
                )
                await Promise.allSettled(emailPromises)
            }
        } catch (alertErr) {
        }
        try {
    const keys = await redis.keys('jobs:*')
    if (keys.length > 0) await redis.del(keys)
} catch (e) {}
        res.status(201).json({
            message: 'Job created successfully',
            job
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get All Jobs — with search + filter
export const getAllJobs = async (req, res) => {
    try {
        const {
            keyword, location,
            category, type,
            experience, salary_min,
            salary_max, featured
        } = req.query

        // Check cache first
        const cacheKey = `jobs:${JSON.stringify(req.query)}`
        try {
            const cached = await redis.get(cacheKey)
            if (cached) return res.status(200).json(JSON.parse(cached))
        } catch (e) {}

        let query = { is_active: true, is_verified: true }

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }

        if (location) query.location = { $regex: location, $options: 'i' }
        if (category) query.category = category
        if (type) query.type = type
        if (experience) query.experience = experience
        if (featured) query.is_featured = true

        if (salary_min || salary_max) {
            query.salary_min = {}
            if (salary_min) query.salary_min.$gte = Number(salary_min)
            if (salary_max) query.salary_max = { $lte: Number(salary_max) }
        }

        query.deadline = { $gte: new Date() }
query.is_active = true
const jobs = await Job.find(query)
    .populate('employer', 'company_name logo_url location is_verified')
    .sort({ is_featured: -1, createdAt: -1 })

        const responseData = {
            message: 'Jobs fetched successfully',
            count: jobs.length,
            jobs
        }
        if (isRedisConnected) {
    try {
        const cached = await redis.get(cacheKey)
        console.log('getAllJobs called')
        if (cached) return res.status(200).json(JSON.parse(cached))
    } catch (e) {}
}
if (isRedisConnected) {
    try {
        await redis.setEx(cacheKey, 300, JSON.stringify(responseData))
    } catch (e) {}
}
if (isRedisConnected) {
    try {
        const keys = await redis.keys('jobs:*')
        if (keys.length > 0) await redis.del(keys)
    } catch (e) {}
}
        // Save to cache — 5 minutes
        try {
            await redis.setEx(cacheKey, 300, JSON.stringify(responseData))
        } catch (e) {}

        res.status(200).json(responseData)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get Single Job
export const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('employer', 'company_name logo_url location website is_verified')

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        res.status(200).json({ job })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update Job — Employer only
export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.status(200).json({
            message: 'Job updated successfully',
            job: updatedJob
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete Job — Employer only
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        await Job.findByIdAndDelete(req.params.id)

        res.status(200).json({ message: 'Job deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get Employer Jobs
export const getRecommendedJobs = async (req, res) => {
    try {
        const user = req.user
 
        // Build match query based on user profile
        const query = {
            is_active: true,
            is_verified: true,
            deadline: { $gte: new Date() }
        }
 
        const orConditions = []
 
        // Match by preferred location or actual location
        if (user.preferred_location || user.location) {
            orConditions.push({ location: user.preferred_location || user.location })
            orConditions.push({ location: 'Remote' })
        }
 
        // Match by preferred category
        if (user.preferred_category) {
            orConditions.push({ category: user.preferred_category })
        }
 
        // Match by skills
        if (user.skills && user.skills.length > 0) {
            orConditions.push({
                $or: user.skills.map(skill => ({
                    $or: [
                        { title: { $regex: skill, $options: 'i' } },
                        { description: { $regex: skill, $options: 'i' } }
                    ]
                }))
            })
        }
 
        if (orConditions.length > 0) {
            query.$or = orConditions
        }
 
        const jobs = await Job.find(query)
            .populate('employer', 'company_name logo_url location is_verified')
            .sort({ is_featured: -1, createdAt: -1 })
            .limit(10)
 
        res.status(200).json({
            message: 'Recommended jobs fetched',
            count: jobs.length,
            jobs,
            based_on: {
                location: user.preferred_location || user.location,
                category: user.preferred_category,
                skills: user.skills
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}