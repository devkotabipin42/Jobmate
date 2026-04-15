import { generateAIText } from '../config/api.js'
import Application from '../models/Application.model.js'
import Job from '../models/Job.model.js'
import Employer from '../models/Employer.model.js'
import transporter from '../config/mailer.js'
import User from '../models/user.model.js'
// Apply for job
export const applyJob = async (req, res) => {
    try {
        
        const job = await Job.findById(req.params.id)
            .populate('employer', 'company_name email')
        if (job.cv_required && !req.user.cv_url) {
    return res.status(400).json({ message: 'This job requires a CV. Please upload your CV first.' })
}
        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        const existing = await Application.findOne({
            job: req.params.id,
            user: req.user._id
        })

        if (existing) {
            return res.status(400).json({ message: 'Already applied' })
        }
        console.log('CV Required:', job.cv_required)
console.log('User CV:', req.user.cv_url)
        const application = await Application.create({
            job: req.params.id,
            user: req.user._id,
            cv_url: req.user.cv_url || '',
            cover_letter: req.body.cover_letter || ''
        })

        await Job.findByIdAndUpdate(req.params.id, {
            $inc: { application_count: 1 }
        })

        // Email to employer
        try {
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: job.employer.email,
                subject: `🎯 New Application — ${job.title}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: white; margin: 0;">Jobmate</h1>
                        </div>
                        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                            <h2 style="color: #111827;">New Application Received! 🎉</h2>
                            <p style="color: #6b7280;">Someone applied for your job posting:</p>
                            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                                <h3 style="color: #16a34a; margin: 0 0 10px 0;">${job.title}</h3>
                                <p style="color: #6b7280; margin: 0;">📍 ${job.location} · ${job.type}</p>
                            </div>
                            <p style="color: #6b7280;">
                                <strong>Applicant:</strong> ${req.user.name}<br/>
                                <strong>Email:</strong> ${req.user.email}<br/>
                                <strong>Location:</strong> ${req.user.location || 'Not specified'}<br/>
                                ${req.body.cover_letter ? `<strong>Cover Letter:</strong> ${req.body.cover_letter}` : ''}
                            </p>
                            <a href="https://jobmate-two.vercel.app/employer/dashboard" 
                               style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 15px;">
                                View Application →
                            </a>
                        </div>
                    </div>
                `
            })
        } catch (emailErr) {
        }

        res.status(201).json({
            message: 'Applied successfully',
            application
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get my applications — Job seeker
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user._id })
            .populate({
    path: 'job',
    select: 'title location salary_min salary_max category type',
    populate: {
        path: 'employer',
        select: 'company_name logo_url'
    }
})
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Applications fetched',
            count: applications.length,
            applications
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get job applications — Employer
export const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const applications = await Application.find({ job: req.params.id })
            .populate('user', 'name location cv_url is_verified_jobseeker skills')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Applications fetched',
            count: applications.length,
            applications
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update application status — Employer
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )

        if (!application) {
            return res.status(404).json({ message: 'Application not found' })
        }

        res.status(200).json({
            message: 'Status updated',
            application
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//CV Match + Smart Apply — Job seeker
export const matchCV = async (req, res) => {
    try {
        const { jobId } = req.params
        const user = await User.findById(req.user._id)

        if (!user.cv_url) {
            return res.status(400).json({ message: 'Please upload your CV first' })
        }

        const job = await Job.findById(jobId)
        if (!job) return res.status(404).json({ message: 'Job not found' })

        const prompt = `
You are a senior HR recruiter with 10+ years of experience in Nepal's job market.

=== JOB DETAILS ===
Title: ${job.title}
Description: ${job.description}
Category: ${job.category}
Experience Required: ${job.experience}
Location: ${job.location}

=== CANDIDATE CV CONTENT ===
${user.cv_text ? user.cv_text : 'CV not available — analyze based on job requirements'}

=== INSTRUCTIONS ===
- Carefully analyze CV content against job requirements
- Give realistic match score 0-100
- List specific matched and missing skills
- should_apply true if score >= 55

Respond ONLY in this exact JSON:
{
    "match_score": 75,
    "matched_skills": ["skill1", "skill2"],
    "missing_skills": ["missing1", "missing2"],
    "verdict": "2-3 sentence personalized feedback",
    "should_apply": true
}
`
        let result
        try {
            const raw = await generateAIText(prompt)
            const clean = raw.replace(/```json|```/g, '').trim()
            result = JSON.parse(clean)
        } catch {
            result = {
                match_score: 70,
                matched_skills: [],
                missing_skills: [],
                verdict: 'Could not analyze CV — you can still apply.',
                should_apply: true
            }
        }

        res.status(200).json({ match: result })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}