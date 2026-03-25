import Application from '../models/Application.model.js'
import Job from '../models/Job.model.js'

// Apply for job
export const applyJob = async (req, res) => {
    try {
        console.log('User:', req.user)
        console.log('Job ID:', req.params.id)
        console.log('Body:', req.body)

        const job = await Job.findById(req.params.id)

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

        const application = await Application.create({
            job: req.params.id,
            user: req.user._id,
            cv_url: req.user.cv_url || 'https://placeholder.com/cv.pdf',
            cover_letter: req.body.cover_letter || ''
        })

        await Job.findByIdAndUpdate(req.params.id, {
            $inc: { application_count: 1 }
        })

        res.status(201).json({
            message: 'Applied successfully',
            application
        })
    } catch (error) {
        console.log('Apply Error:', error.message)
        res.status(500).json({ message: error.message })
    }
}

// Get my applications — Job seeker
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user._id })
            .populate('job', 'title location salary_min salary_max company category type')
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
            .populate('user', 'name email phone location cv_url')
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