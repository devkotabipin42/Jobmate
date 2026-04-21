import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import Employer from '../models/Employer.model.js'
import Blacklist from '../models/Blacklist.model.js'

export const authMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies.token

        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized' })
        }

        const isBlacklisted = await Blacklist.findOne({ token })
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token invalid — please login again' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        let user = null

        if (decoded.role === 'employer') {
            user = await Employer.findById(decoded.id).select('-password')
        } else {
            user = await User.findById(decoded.id).select('-password')
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }

        req.user = user
        req.user = { ...req.user._doc, role: decoded.role }

        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token invalid' })
    }
}
export const adminMiddleware = async (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' })
    }
    next()
}
// ── NEW: Ops access — founder (admin) + data_entry staff ────────────
export const opsMiddleware = async (req, res, next) => {
    const role = req.user?.role
    if (role !== 'admin' && role !== 'data_entry') {
        return res.status(403).json({ message: 'Ops access required' })
    }
    next()
}

// ── NEW: Field agent only ───────────────────────────────────────────
export const agentMiddleware = async (req, res, next) => {
    if (req.user?.role !== 'field_agent') {
        return res.status(403).json({ message: 'Field agent access required' })
    }
    next()
}

// ── NEW: Ops team (any ops role including agent) ────────────────────
export const opsTeamMiddleware = async (req, res, next) => {
    const role = req.user?.role
    const allowed = ['admin', 'data_entry', 'field_agent']
    if (!allowed.includes(role)) {
        return res.status(403).json({ message: 'Ops team access required' })
    }
    next()
}