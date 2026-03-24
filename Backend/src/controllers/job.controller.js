import Job from '../models/Job.model.js'

// Create Job — Employer only
export const createJob = async (req, res) => {
    try {
        const {
            title, description,
            salary_min, salary_max,
            location, category,
            type, experience, deadline
        } = req.body

        const job = await Job.create({
            title, description,
            salary_min, salary_max,
            location, category,
            type, experience, deadline,
            employer: req.user._id
        })

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

        let query = { is_active: true }

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

        const jobs = await Job.find(query)
            .populate('employer', 'company_name logo_url location is_verified')
            .sort({ is_featured: -1, createdAt: -1 })

        res.status(200).json({
            message: 'Jobs fetched successfully',
            count: jobs.length,
            jobs
        })
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
export const getEmployerJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user._id })
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Employer jobs fetched',
            count: jobs.length,
            jobs
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}