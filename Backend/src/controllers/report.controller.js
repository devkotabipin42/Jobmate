import Report from '../models/Report.model.js'
import Job from '../models/Job.model.js'

// Create report
export const createReport = async (req, res) => {
    try {
        const { reason, description } = req.body
        const jobId = req.params.id

        // Check already reported
        const existing = await Report.findOne({
            job: jobId,
            reportedBy: req.user._id
        })

        if (existing) {
            return res.status(400).json({ message: 'Already reported this job' })
        }

        const report = await Report.create({
            job: jobId,
            reportedBy: req.user._id,
            reason,
            description
        })

        res.status(201).json({ message: 'Report submitted', report })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get all reports — admin
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('job', 'title location employer')
            .populate('reportedBy', 'name email')
            .sort({ createdAt: -1 })

        res.status(200).json({ reports })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Resolve report
export const resolveReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status: 'resolved' },
            { new: true }
        )

        
        if (report?.job) {
            await Job.findByIdAndDelete(report.job)
        }

        res.status(200).json({ message: 'Report resolved — job removed', report })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Dismiss report
export const dismissReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status: 'dismissed' },
            { new: true }
        )

        res.status(200).json({ message: 'Report dismissed', report })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}