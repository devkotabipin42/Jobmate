import Employer from '../models/Employer.model.js'
import User from '../models/user.model.js'

export const getAllEmployers = async (req, res) => {
    try {
        const employers = await Employer.find()
            .select('-password')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Employers fetched',
            employers
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getEmployerProfile = async (req, res) => {
    try {
        const employer = await Employer.findById(req.params.id)
            .select('-password')

        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' })
        }

        res.status(200).json({ employer })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const uploadLogos = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }

        const employer = await Employer.findByIdAndUpdate(
            req.user._id,
            { logo_url: req.file.path },
            { new: true }
        ).select('-password')

        res.status(200).json({
            message: 'Logo uploaded successfully',
            logo_url: req.file.path,
            employer
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateCompanyProfile = async (req, res) => {
    try {
        const { description, location, industry, company_size, founded_year, website, phone, social_links } = req.body

        const employer = await Employer.findByIdAndUpdate(
            req.user._id,
            { description, location, industry, company_size, founded_year, website, phone, social_links },
            { new: true }
        ).select('-password')

        res.status(200).json({
            message: 'Company profile updated',
            employer
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const getJobseekerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('name avatar_url location bio skills education experience cv_url is_verified_jobseeker profile_complete document_status createdAt preferred_location preferred_category expected_salary')
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}