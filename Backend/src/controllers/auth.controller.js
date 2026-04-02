import User from '../models/user.model.js'
import Employer from '../models/Employer.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import OTP from '../models/OTP.model.js'
import nodemailer from 'nodemailer'
import Blacklist from '../models/Blacklist.model.js'
import { imagekit } from '../config/cloudinary.js'
import transporter from '../config/mailer.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')
import crypto from 'crypto'
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

        // Verify token 
        const verifyToken = crypto.randomBytes(32).toString('hex')

        const user = await User.create({
            name, email,
            password: hashedPassword,
            phone, location,
            email_verify_token: verifyToken,
            email_verify_expires: Date.now() + 24 * 60 * 60 * 1000
        })

        // Verification 
        try {
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: user.email,
                subject: 'Verify your Jobmate account',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: white; margin: 0;">Jobmate</h1>
                        </div>
                        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                            <h2 style="color: #111827;">Verify your email</h2>
                            <p style="color: #6b7280;">Hi ${name}, click below to verify your account.</p>
                            <a href="${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}&role=jobseeker"
                                style="display: inline-block; background: #16a34a; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
                                Verify Email
                            </a>
                            <p style="color: #9ca3af; font-size: 12px;">Link expires in 24 hours.</p>
                        </div>
                    </div>
                `
            })
        } catch (emailErr) {
        }

        res.status(201).json({
            message: 'Registration successful! Please verify your email.',
        })
    } catch (error) {
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
        const verifyToken = crypto.randomBytes(32).toString('hex')

        // Employer create karo — User.create nahi!
        const employer = await Employer.create({
            company_name, email,
            password: hashedPassword,
            phone, location,
            email_verify_token: verifyToken,
            email_verify_expires: Date.now() + 24 * 60 * 60 * 1000
        })
       
        // Email send
        try {
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: employer.email,
                subject: 'Verify your Jobmate account',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: white; margin: 0;">Jobmate</h1>
                        </div>
                        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                            <h2 style="color: #111827;">Verify your email</h2>
                            <p style="color: #6b7280;">Hi ${company_name}, click below to verify your account.</p>
                            <a href="${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}&role=employer"
                                style="display: inline-block; background: #16a34a; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
                                Verify Email
                            </a>
                            <p style="color: #9ca3af; font-size: 12px;">Link expires in 24 hours.</p>
                        </div>
                    </div>
                `
            })
        } catch (emailErr) {
        }

        res.status(201).json({
            message: 'Registration successful! Please verify your email.',
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
        if (account.is_banned) {
        return res.status(403).json({ message: 'Your account has been banned. Contact support at hello@jobmate.com.np' })
        }       
        if (account.email_verify_token && !account.is_email_verified) {
    return res.status(403).json({ message: 'Please verify your email first. Check your inbox.' })
}
        // Database  actual role 
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
        role: actualRole,
        job_alerts: account.job_alerts || undefined,
        cv_url: account.cv_url || undefined,
        location: account.location || undefined,
        phone: account.phone || undefined
    }
})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Logout
export const logout = async (req, res) => {
    try {
        // Token get  — cookie in header or Authorization header
        let token = req.cookies.token
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (token) {
            // Token blacklist  7 days 
            await Blacklist.create({
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            })
        }

        res.clearCookie('token')
        res.status(200).json({ message: 'Logout successful' })
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


export const uploadCV = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: `cv_${req.user._id}_${Date.now()}.pdf`,
            folder: '/jobmate/cvs',
            useUniqueFileName: true
        })
        
        let cv_text = ''
try {
    const pdfData = await pdfParse(req.file.buffer)
    cv_text = pdfData.text?.slice(0, 3000) // max 3000 chars
} catch (e) {
    cv_text = ''
}
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { cv_url: result.url , cv_text },
            { new: true }
        ).select('-password')

        res.status(200).json({
            message: 'CV uploaded successfully',
            cv_url: result.url,
            user
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const deleteCV = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { cv_url: '' },
            { new: true }
        ).select('-password')

        res.status(200).json({
            message: 'CV deleted successfully',
            user
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const sendOTP = async (req, res) => {
    try {
        const { email, role } = req.body

        if (!email) {
            return res.status(400).json({ message: 'Email is required' })
        }

        // Check user exists
        let account = null
        if (role === 'employer') {
            account = await Employer.findOne({ email })
        } else {
            account = await User.findOne({ email })
        }

        if (!account) {
            return res.status(404).json({ message: 'No account found with this email' })
        }

        // Check if banned
        if (account.is_banned) {
            return res.status(403).json({ message: 'Your account has been banned' })
        }

        // Rate limit — max 3 OTP per 10 minutes
        const recentOTPs = await OTP.countDocuments({
            email,
            createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }
        })

        if (recentOTPs >= 3) {
            return res.status(429).json({ message: 'Too many requests — try again after 10 minutes' })
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // Delete old OTPs
        await OTP.deleteMany({ email })

        // Save new OTP
        await OTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        })

        // Send email — with try/catch
        try {
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: email,
                subject: '🔐 Your Jobmate Login Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                        <div style="background: #16a34a; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: white; margin: 0;">Jobmate</h1>
                        </div>
                        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                            <h2 style="color: #111827;">Your Login Code</h2>
                            <p style="color: #6b7280;">Use this code to login to your Jobmate account:</p>
                            <div style="background: white; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
                                <h1 style="color: #16a34a; font-size: 48px; letter-spacing: 8px; margin: 0;">${otp}</h1>
                            </div>
                            <p style="color: #6b7280; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
                            <p style="color: #6b7280; font-size: 14px;">If you did not request this code, ignore this email.</p>
                        </div>
                    </div>
                `
            })
        } catch (emailErr) {
            return res.status(500).json({ message: 'Failed to send OTP email — try again' })
        }

        res.status(200).json({ message: 'OTP sent to your email' })

    } catch (error) {
        res.status(500).json({ message: 'Server error — try again' })
    }
}
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp, role } = req.body

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' })
        }

        const otpDoc = await OTP.findOne({ email, otp })

        if (!otpDoc) {
            return res.status(400).json({ message: 'Invalid OTP — please try again' })
        }

        if (new Date() > otpDoc.expiresAt) {
            await OTP.deleteMany({ email })
            return res.status(400).json({ message: 'OTP expired — request new one' })
        }

        await OTP.deleteMany({ email })

        let account = null
        if (role === 'employer') {
            account = await Employer.findOne({ email })
        } else {
            account = await User.findOne({ email })
        }

        if (!account) {
            return res.status(404).json({ message: 'Account not found' })
        }

        if (account.is_banned) {
    return res.status(403).json({ message: 'Your account has been banned. Contact support at hello@jobmate.com.np' })
}

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
                job_alerts: account.job_alerts ||undefined,
                role: actualRole
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error — try again' })
    }
}

export const updateJobAlerts = async (req, res) => {
    try {
        const { enabled, categories, locations, job_types } = req.body

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                job_alerts: {
                    enabled,
                    categories: categories || [],
                    locations: locations || [],
                    job_types: job_types || []
                }
            },
            { new: true }
        ).select('-password')

        res.status(200).json({
            message: 'Job alerts updated',
            user
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { token, role } = req.query

        const Model = role === 'employer' ? Employer : User

        const account = await Model.findOne({
            email_verify_token: token,
            email_verify_expires: { $gt: Date.now() }
        })

        if (!account) {
            return res.status(200).json({ message: 'Email already verified' })
        }

        if (account.is_email_verified) {
            return res.status(200).json({ message: 'Email already verified' })
        }

        account.is_email_verified = true
        account.email_verify_token = undefined
        account.email_verify_expires = undefined
        await account.save()

        res.status(200).json({ message: 'Email verified successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}