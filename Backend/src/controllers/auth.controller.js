import User from '../models/user.model.js'
import Employer from '../models/Employer.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

// Job Seeker Register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, location } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' })
        }

       const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name, email,
            password: hashedPassword,
            phone, location
        })

        const token = generateToken(user._id, 'jobseeker')

        res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000
})

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.log('Error:', error)
        res.status(500).json({ message: error.message })
    }
}

// Employer Register
export const registerEmployer = async (req, res) => {
    try {
        const { company_name, email, password, phone, location, website } = req.body

        const existingEmployer = await Employer.findOne({ email })
        if (existingEmployer) {
            return res.status(400).json({ message: 'Email already exists' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const employer = await Employer.create({
            company_name, email, password:hashedPassword,
            phone, location, website
        })

        const token = generateToken(employer._id, 'employer')

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: 'Employer registration successful',
            token,
            employer: {
                id: employer._id,
                company_name: employer.company_name,
                email: employer.email,
                role: employer.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Login
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body

        let account = null

        if (role === 'employer') {
            account = await Employer.findOne({ email })
        } else {
            account = await User.findOne({ email })
        }

        if (!account) {
            return res.status(404).json({ message: 'Account not found' })
        }

        const isMatch = await account.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' })
        }

        // Database se actual role lo
        const actualRole = account.role || role

        const token = generateToken(account._id, actualRole)

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: account._id,
                name: account.name || account.company_name,
                email: account.email,
                role: actualRole
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token')
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get Me
export const getMe = async (req, res) => {
    try {
        res.status(200).json({ user: req.user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, phone, location } = req.body

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, location },
            { new: true }
        ).select('-password')

        res.status(200).json({
            message: 'Profile updated',
            user
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const saveJob = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const jobId = req.params.id

        const alreadySaved = user.saved_jobs.includes(jobId)

        if (alreadySaved) {
            user.saved_jobs = user.saved_jobs.filter(id => id.toString() !== jobId)
        } else {
            user.saved_jobs.push(jobId)
        }

        await user.save()

        res.status(200).json({
            message: alreadySaved ? 'Job removed' : 'Job saved',
            saved_jobs: user.saved_jobs
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'saved_jobs',
                populate: {
                    path: 'employer',
                    select: 'company_name location is_verified'
                }
            })

        res.status(200).json({
            message: 'Saved jobs fetched',
            saved_jobs: user.saved_jobs
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}