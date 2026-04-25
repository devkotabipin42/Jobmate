import TeamMember from '../models/TeamMember.model.js'
import FieldTask from '../models/FieldTask.model.js'
import FieldVisit from '../models/FieldVisit.model.js'
import SalaryRecord from '../models/SalaryRecord.model.js'
import User from '../models/user.model.js'
import CRM from '../models/CRM.model.js'

// ═══════════════════════════════════════════════════════════════════
// TEAM MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

export const getAllTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.find()
            .populate('user', 'name email avatar_url')
            .sort({ createdAt: -1 })
        res.json({ members })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const createTeamMember = async (req, res) => {
    try {
        const {
            user_id, full_name, phone, whatsapp, ops_role,
            assigned_areas, salary_config, bank_details
        } = req.body

        const user = await User.findById(user_id)
        if (!user) return res.status(404).json({ message: 'User not found' })

        // Don't overwrite admin/employer roles
        if (user.role !== 'admin' && user.role !== 'employer') {
            user.role = ops_role
            await user.save()
        }

        const member = await TeamMember.create({
            user: user_id,
            full_name,
            phone,
            whatsapp,
            ops_role,
            assigned_areas: assigned_areas || [],
            salary_config: salary_config || {},
            bank_details: bank_details || {}
        })

        res.status(201).json({ member })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const updateTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (req.body.ops_role && member) {
            await User.findByIdAndUpdate(member.user, { role: req.body.ops_role })
        }

        res.json({ member })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const deactivateTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            { is_active: false },
            { new: true }
        )
        res.json({ member })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ═══════════════════════════════════════════════════════════════════
// TASK MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

export const createTask = async (req, res) => {
    try {
        // Find or auto-create founder TeamMember
        let founderMember = await TeamMember.findOne({ user: req.user._id })
        
        if (!founderMember) {
            // Auto-create founder record for admin
            founderMember = await TeamMember.create({
                user: req.user._id,
                full_name: req.user.name || 'Founder',
                phone: req.user.phone || '0000000000',
                ops_role: 'founder',
                is_active: true,
                salary_config: {
                    base_type: 'monthly',
                    base_amount: 0,
                    visit_incentive: 0,
                    conversion_bonus: 0,
                    retention_bonus: 0
                }
            })
        }

        const task = await FieldTask.create({
            ...req.body,
            created_by: founderMember._id
        })

        const populated = await task.populate('assigned_to', 'full_name phone')
        res.status(201).json({ task: populated })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getAllTasks = async (req, res) => {
    try {
        const { status, agent_id, date } = req.query
        const filter = {}
        if (status) filter.status = status
        if (agent_id) filter.assigned_to = agent_id
        if (date) {
            const start = new Date(date)
            start.setHours(0, 0, 0, 0)
            const end = new Date(date)
            end.setHours(23, 59, 59, 999)
            filter.scheduled_date = { $gte: start, $lte: end }
        }

        const tasks = await FieldTask.find(filter)
            .populate('assigned_to', 'full_name phone profile_photo')
            .populate('created_by', 'full_name')
            .sort({ scheduled_date: -1 })

        res.json({ tasks })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getMyTasks = async (req, res) => {
    try {
        const member = await TeamMember.findOne({ user: req.user._id })
        if (!member) return res.status(404).json({ message: 'Member not found' })

        const { status } = req.query
        const filter = { assigned_to: member._id }
        if (status) filter.status = status

        const tasks = await FieldTask.find(filter)
            .sort({ scheduled_date: 1 })

        res.json({ tasks })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getMyVisits = async (req, res) => {
    try {
        const member = await TeamMember.findOne({ user: req.user._id })
        if (!member) return res.status(404).json({ message: 'Member not found' })

        const { status } = req.query
        const filter = { agent: member._id }
        if (status) filter.review_status = status

        const visits = await FieldVisit.find(filter)
            .populate('task', 'target_business')
            .sort({ createdAt: -1 })
            .limit(50)

        res.json({ visits })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body
        const update = { status }
        if (status === 'completed') update.completed_at = new Date()

        const task = await FieldTask.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        )
        res.json({ task })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ═══════════════════════════════════════════════════════════════════
// FIELD VISITS (AGENT SUBMISSIONS)
// ═══════════════════════════════════════════════════════════════════

const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000
    const toRad = (deg) => (deg * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    return Math.round(R * 2 * Math.asin(Math.sqrt(a)))
}

const detectQualityFlags = async (visit, task) => {
    const flags = []

    if (visit.check_in?.location?.coordinates && task?.target_business?.location?.coordinates) {
        const [agentLng, agentLat] = visit.check_in.location.coordinates
        const [targetLng, targetLat] = task.target_business.location.coordinates
        if (agentLat && targetLat) {
            const distance = calculateDistance(agentLat, agentLng, targetLat, targetLng)
            if (distance > 100) flags.push('gps_mismatch')
        }
    }

    const phone = visit.business_info?.owner_phone
    if (phone && !/^9\d{9}$/.test(phone.replace(/\D/g, ''))) {
        flags.push('phone_invalid')
    }

    if (visit.duration_minutes < 3) flags.push('duration_too_short')
    if (visit.duration_minutes > 120) flags.push('duration_too_long')

    if (phone) {
        const existing = await FieldVisit.findOne({
            'business_info.owner_phone': phone,
            _id: { $ne: visit._id }
        })
        if (existing) flags.push('duplicate')
    }

    return flags
}

export const submitVisit = async (req, res) => {
    try {
        const member = await TeamMember.findOne({ user: req.user._id })
        if (!member) return res.status(404).json({ message: 'Agent not found' })

        const { task_id, ...visitData } = req.body

        if (visitData.client_submission_id) {
            const existing = await FieldVisit.findOne({
                client_submission_id: visitData.client_submission_id
            })
            if (existing) return res.json({ visit: existing, duplicate: true })
        }

        const task = await FieldTask.findById(task_id)

        if (task?.target_business?.location?.coordinates && visitData.check_in?.location?.coordinates) {
            const [agentLng, agentLat] = visitData.check_in.location.coordinates
            const [targetLng, targetLat] = task.target_business.location.coordinates
            if (agentLat && targetLat) {
                visitData.check_in.distance_from_target = calculateDistance(
                    agentLat, agentLng, targetLat, targetLng
                )
            }
        }

        if (visitData.check_in?.timestamp && visitData.check_out?.timestamp) {
            const diff = new Date(visitData.check_out.timestamp) - new Date(visitData.check_in.timestamp)
            visitData.duration_minutes = Math.round(diff / 60000)
        }

        const visit = await FieldVisit.create({
            ...visitData,
            task: task_id,
            agent: member._id
        })

        const flags = await detectQualityFlags(visit, task)
        if (flags.length > 0) {
            visit.quality_flags = flags
            visit.review_status = 'needs_verification'
            await visit.save()
        }

        if (task) {
    // If task had no GPS, save the agent's check-in as the business location
    const hasGps = task.target_business?.location?.coordinates &&
                   (task.target_business.location.coordinates[0] !== 0 ||
                    task.target_business.location.coordinates[1] !== 0)

    if (!hasGps && visitData.check_in?.location?.coordinates) {
        task.target_business.location = {
            type: 'Point',
            coordinates: visitData.check_in.location.coordinates
        }
    }

    task.status = 'completed'
    task.completed_at = new Date()
    task.visit_id = visit._id
    await task.save()
}

        res.status(201).json({ visit })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getPendingReviews = async (req, res) => {
    try {
        const visits = await FieldVisit.find({
            review_status: { $in: ['pending', 'needs_verification'] }
        })
            .populate('agent', 'full_name phone profile_photo')
            .populate('task', 'target_business')
            .sort({ createdAt: -1 })

        res.json({ visits })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getVisitById = async (req, res) => {
    try {
        const visit = await FieldVisit.findById(req.params.id)
            .populate('agent', 'full_name phone profile_photo')
            .populate('task')
        res.json({ visit })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const reviewVisit = async (req, res) => {
    try {
        const { action, updated_data, review_notes } = req.body
        const reviewer = await TeamMember.findOne({ user: req.user._id })

        const visit = await FieldVisit.findById(req.params.id)
        if (!visit) return res.status(404).json({ message: 'Visit not found' })

        if (updated_data) {
            Object.assign(visit, updated_data)
        }

        visit.reviewed_by = reviewer?._id
        visit.reviewed_at = new Date()
        visit.review_notes = review_notes || ''

        if (action === 'approve') {
            visit.review_status = 'approved'
            if (['very_interested', 'interested'].includes(visit.pitch_outcome?.reaction)) {
                const crmLead = await CRM.create({
                    candidate: {
                        name: visit.business_info?.owner_name,
                        phone: visit.business_info?.owner_phone,
                        location: visit.business_info?.address
                    },
                    status: visit.pitch_outcome?.next_action === 'demo_scheduled' ? 'follow_up' : 'interested',
                    notes: [{
                        text: `Field visit by ${reviewer?.full_name || 'agent'}. ${visit.pitch_outcome?.agent_notes || ''}`
                    }],
                    source: 'direct'
                })
                visit.crm_lead_id = crmLead._id
            }
        } else if (action === 'reject') {
            visit.review_status = 'rejected'
        }

        await visit.save()
        res.json({ visit })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ═══════════════════════════════════════════════════════════════════
// SALARY ENGINE
// ═══════════════════════════════════════════════════════════════════

export const calculateMonthlySalary = async (req, res) => {
    try {
        const { agent_id, month, year } = req.body

        const agent = await TeamMember.findById(agent_id)
        if (!agent) return res.status(404).json({ message: 'Agent not found' })

        const start = new Date(year, month - 1, 1)
        const end = new Date(year, month, 0, 23, 59, 59)

        const visits = await FieldVisit.find({
            agent: agent_id,
            review_status: 'approved',
            createdAt: { $gte: start, $lte: end }
        })

        const conversions = visits.filter(v => v.converted_employer_id || v.crm_lead_id).length

        const cfg = agent.salary_config
        const base_amount = cfg.base_type === 'monthly' ? cfg.base_amount : cfg.base_amount * 30
        const visit_incentive_total = visits.length * (cfg.visit_incentive || 0)
        const conversion_bonus_total = conversions * (cfg.conversion_bonus || 0)

        const gross_total = base_amount + visit_incentive_total + conversion_bonus_total
        const net_payable = gross_total

        const record = await SalaryRecord.findOneAndUpdate(
            { agent: agent_id, month, year },
            {
                base_amount,
                visits_count: visits.length,
                visit_incentive_total,
                conversions_count: conversions,
                conversion_bonus_total,
                gross_total,
                net_payable
            },
            { upsert: true, new: true }
        )

        res.json({ salary: record })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getSalaryRecords = async (req, res) => {
    try {
        const { agent_id, year } = req.query
        const filter = {}
        if (agent_id) filter.agent = agent_id
        if (year) filter.year = parseInt(year)

        const records = await SalaryRecord.find(filter)
            .populate('agent', 'full_name phone profile_photo')
            .sort({ year: -1, month: -1 })
        res.json({ records })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const markSalaryPaid = async (req, res) => {
    try {
        const { payment_reference } = req.body
        const record = await SalaryRecord.findByIdAndUpdate(
            req.params.id,
            {
                payment_status: 'paid',
                paid_at: new Date(),
                payment_reference
            },
            { new: true }
        )
        res.json({ record })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════════

export const getOpsStats = async (req, res) => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const [
            totalAgents,
            activeAgents,
            todaysTasks,
            todaysVisits,
            pendingReviews,
            todaysConversions
        ] = await Promise.all([
            TeamMember.countDocuments({ ops_role: 'field_agent' }),
            TeamMember.countDocuments({ ops_role: 'field_agent', is_active: true }),
            FieldTask.countDocuments({
                scheduled_date: { $gte: today, $lt: tomorrow }
            }),
            FieldVisit.countDocuments({
                createdAt: { $gte: today, $lt: tomorrow }
            }),
            FieldVisit.countDocuments({
                review_status: { $in: ['pending', 'needs_verification'] }
            }),
            FieldVisit.countDocuments({
                createdAt: { $gte: today, $lt: tomorrow },
                crm_lead_id: { $exists: true, $ne: null }
            })
        ])

        res.json({
            stats: {
                totalAgents,
                activeAgents,
                todaysTasks,
                todaysVisits,
                pendingReviews,
                todaysConversions
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getRecentActivity = async (req, res) => {
    try {
        const activities = await FieldVisit.find()
            .populate('agent', 'full_name profile_photo')
            .populate('task', 'target_business')
            .sort({ createdAt: -1 })
            .limit(10)

        res.json({ activities })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getAgentPerformance = async (req, res) => {
    try {
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const agents = await TeamMember.find({ ops_role: 'field_agent', is_active: true })

        const performance = await Promise.all(
            agents.map(async (agent) => {
                const visits = await FieldVisit.countDocuments({
                    agent: agent._id,
                    createdAt: { $gte: startOfMonth }
                })
                const conversions = await FieldVisit.countDocuments({
                    agent: agent._id,
                    createdAt: { $gte: startOfMonth },
                    crm_lead_id: { $exists: true, $ne: null }
                })
                return {
                    agent: {
                        _id: agent._id,
                        full_name: agent.full_name,
                        profile_photo: agent.profile_photo
                    },
                    visits_count: visits,
                    conversions_count: conversions
                }
            })
        )

        res.json({ performance: performance.sort((a, b) => b.visits_count - a.visits_count) })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
// ═══ Create user + team member in one shot ═════════════════════
export const createAgent = async (req, res) => {
    try {
        const bcrypt = (await import('bcryptjs')).default
        const {
            name, email, password, full_name, phone, whatsapp, ops_role,
            assigned_areas, salary_config, bank_details
        } = req.body

        // Check if user exists
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' })
        }

        // Create user
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: ops_role,
            is_verified: true
        })

        // Create team member
        const member = await TeamMember.create({
            user: user._id,
            full_name,
            phone,
            whatsapp,
            ops_role,
            assigned_areas: assigned_areas || [],
            salary_config: salary_config || {},
            bank_details: bank_details || {}
        })

        res.status(201).json({ 
            member,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            credentials: { email, temp_password: password }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}