import User from '../models/user.model.js'
import Employer from '../models/Employer.model.js'
import Job from '../models/Job.model.js'
import Application from '../models/Application.model.js'

export const getPublicStats = async (req, res) => {
    try {
        const [totalJobs, totalCompanies, totalJobSeekers, fakeJobs] = await Promise.all([
            Job.countDocuments({ is_active: true, is_verified: true }),
            Employer.countDocuments({ is_verified: true }),
            User.countDocuments({ role: 'jobseeker' }),
            Job.countDocuments({ is_verified: false })
        ])

        res.status(200).json({
            totalJobs,
            totalCompanies,
            totalJobSeekers,
            fakeJobs: 0 // Always 0 — verified platform!
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}