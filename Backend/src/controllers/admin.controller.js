import Job from '../models/Job.model.js'
import User from '../models/user.model.js'
import Employer from '../models/Employer.model.js'
import Application from '../models/Application.model.js'

// Dashboard stats
export const getStats = async (req, res) => {
    try {
        const [
            totalJobs,
            pendingJobs,
            verifiedJobs,
            totalUsers,
            totalEmployers,
            totalApplications
        ] = await Promise.all([
            Job.countDocuments(),
            Job.countDocuments({ is_verified: false }),
            Job.countDocuments({ is_verified: true }),
            User.countDocuments(),
            Employer.countDocuments(),
            Application.countDocuments()
        ])

        res.status(200).json({
            stats: {
                totalJobs,
                pendingJobs,
                verifiedJobs,
                totalUsers,
                totalEmployers,
                totalApplications
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all jobs — pending verification
export const getPendingJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ is_verified: false })
            .populate('employer', 'company_name email location is_verified')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Pending jobs fetched',
            count: jobs.length,
            jobs
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('employer', 'company_name email location is_verified')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'All jobs fetched',
            count: jobs.length,
            jobs
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Verify job
export const verifyJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { is_verified: true },
            { new: true }
        )

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        res.status(200).json({
            message: 'Job verified successfully',
            job
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Reject job
export const rejectJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { is_active: false, is_verified: false },
            { new: true }
        )

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        res.status(200).json({
            message: 'Job rejected',
            job
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete job
export const deleteJobAdmin = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Job deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all employers
export const getAllEmployers = async (req, res) => {
    try {
        const employers = await Employer.find()
            .select('-password')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Employers fetched',
            count: employers.length,
            employers
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Verify employer
export const verifyEmployer = async (req, res) => {
    try {
        const employer = await Employer.findByIdAndUpdate(
            req.params.id,
            { is_verified: true },
            { new: true }
        )

        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' })
        }

        res.status(200).json({
            message: 'Employer verified',
            employer
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Users fetched',
            count: users.length,
            users
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}