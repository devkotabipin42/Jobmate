import Job from '../models/Job.model.js'
import User from '../models/user.model.js'
import Employer from '../models/Employer.model.js'
import Application from '../models/Application.model.js'




import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})
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

        // Send verification email
        try {
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: employer.email,
                subject: '🎉 Your company is now verified on Jobmate!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: white; margin: 0;">Jobmate</h1>
                        </div>
                        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                            <h2 style="color: #111827;">🎉 Congratulations!</h2>
                            <p style="color: #6b7280;">Your company <strong>${employer.company_name}</strong> has been verified on Jobmate.</p>
                            <p style="color: #6b7280;">You can now post verified jobs and attract more candidates.</p>
                            <div style="background: #dcfce7; border: 1px solid #86efac; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <p style="color: #166534; margin: 0;">✓ Verified badge added to your profile</p>
                                <p style="color: #166534; margin: 5px 0 0;">✓ Your jobs will show "Verified Company" badge</p>
                            </div>
                            <a href="https://jobmate-two.vercel.app/employer/dashboard" 
                               style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 10px;">
                                Go to Dashboard
                            </a>
                        </div>
                    </div>
                `
            })
        } catch (emailErr) {
            console.log('Email error:', emailErr.message)
        }

        res.status(200).json({
            message: 'Employer verified successfully',
            employer
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
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

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User role updated', user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const banUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { is_banned: true },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User banned', user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const unbanUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { is_banned: false },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User unbanned', user })
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