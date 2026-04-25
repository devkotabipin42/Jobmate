import { Router } from 'express'
import {
    getAllTeamMembers,
    createTeamMember,
    createAgent,
    updateTeamMember,
    deactivateTeamMember,
    createTask,
    getAllTasks,
    getMyTasks,
    updateTaskStatus,
    submitVisit,
    getPendingReviews,
    getVisitById,
    reviewVisit,
    getMyVisits,
    calculateMonthlySalary,
    getSalaryRecords,
    markSalaryPaid,
    getOpsStats,
    getRecentActivity,
    getAgentPerformance,
    getMySalaryRecords,
    getApprovedLeads,
} from '../controllers/ops.controller.js'

import {
    authMiddleware,
    adminMiddleware,
    opsMiddleware,
    agentMiddleware,
    opsTeamMiddleware
} from '../middleware/auth.middleware.js'

import { validate } from '../middleware/validate.middleware.js'
import {
    createTeamMemberSchema,
    createAgentSchema,
    createTaskSchema,
    submitVisitSchema,
    reviewVisitSchema,
    calculateSalarySchema
} from '../validators/ops.validators.js'

const opsRouter = Router()

opsRouter.use(authMiddleware)

// ═══ ADMIN-ONLY ═════════════════════════════════════════════════════
opsRouter.post('/team', adminMiddleware, validate(createTeamMemberSchema), createTeamMember)
opsRouter.post('/agents', adminMiddleware, validate(createAgentSchema), createAgent)
opsRouter.put('/team/:id', adminMiddleware, updateTeamMember)
opsRouter.delete('/team/:id', adminMiddleware, deactivateTeamMember)

opsRouter.post('/tasks', adminMiddleware, validate(createTaskSchema), createTask)

opsRouter.post('/salary/calculate', adminMiddleware, validate(calculateSalarySchema), calculateMonthlySalary)
opsRouter.put('/salary/:id/paid', adminMiddleware, markSalaryPaid)

// ═══ OPS STAFF (admin + data_entry) ═════════════════════════════════
opsRouter.get('/team', opsMiddleware, getAllTeamMembers)
opsRouter.get('/tasks', opsMiddleware, getAllTasks)
opsRouter.get('/visits/pending', opsMiddleware, getPendingReviews)
opsRouter.get('/visits/:id', opsMiddleware, getVisitById)
opsRouter.put('/visits/:id/review', opsMiddleware, validate(reviewVisitSchema), reviewVisit)
opsRouter.get('/salary', opsMiddleware, getSalaryRecords)
opsRouter.get('/stats', opsMiddleware, getOpsStats)
opsRouter.get('/activity', opsMiddleware, getRecentActivity)
opsRouter.get('/performance', opsMiddleware, getAgentPerformance)
opsRouter.get('/leads', opsMiddleware, getApprovedLeads)

// ═══ FIELD AGENT ════════════════════════════════════════════════════
opsRouter.get('/my-tasks', agentMiddleware, getMyTasks)
opsRouter.get('/my-visits', agentMiddleware, getMyVisits)
opsRouter.put('/tasks/:id/status', opsTeamMiddleware, updateTaskStatus)
opsRouter.post('/visits', agentMiddleware, validate(submitVisitSchema), submitVisit)
opsRouter.get('/my-salary', agentMiddleware, getMySalaryRecords)

export default opsRouter