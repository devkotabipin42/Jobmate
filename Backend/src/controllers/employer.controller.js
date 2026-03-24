import Employer from '../models/Employer.model.js'

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