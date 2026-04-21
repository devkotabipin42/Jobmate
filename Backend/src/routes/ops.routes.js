import { Router } from 'express'
import {
    getAllTeamMembers,
    createTeamMember,
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

    calculateMonthlySalary,
    getSalaryRecords,
    markSalaryPaid,

    getOpsStats,
    getRecentActivity,
    getAgentPerformance
} from '../controllers/ops.controller.js'

import {
    authMiddleware,
    adminMiddleware,
    opsMiddleware,
    agentMiddleware,
    opsTeamMiddleware
} from '../middleware/auth.middleware.js'

const opsRouter = Router()

opsRouter.use(authMiddleware)

// ═══ ADMIN-ONLY (founder) ═══════════════════════════════════════════
opsRouter.post('/team', adminMiddleware, createTeamMember)
opsRouter.put('/team/:id', adminMiddleware, updateTeamMember)
opsRouter.delete('/team/:id', adminMiddleware, deactivateTeamMember)

opsRouter.post('/tasks', adminMiddleware, createTask)

opsRouter.post('/salary/calculate', adminMiddleware, calculateMonthlySalary)
opsRouter.put('/salary/:id/paid', adminMiddleware, markSalaryPaid)

// ═══ OPS STAFF (admin + data_entry) ═════════════════════════════════
opsRouter.get('/team', opsMiddleware, getAllTeamMembers)
opsRouter.get('/tasks', opsMiddleware, getAllTasks)
opsRouter.get('/visits/pending', opsMiddleware, getPendingReviews)
opsRouter.get('/visits/:id', opsMiddleware, getVisitById)
opsRouter.put('/visits/:id/review', opsMiddleware, reviewVisit)
opsRouter.get('/salary', opsMiddleware, getSalaryRecords)
opsRouter.get('/stats', opsMiddleware, getOpsStats)
opsRouter.get('/activity', opsMiddleware, getRecentActivity)
opsRouter.get('/performance', opsMiddleware, getAgentPerformance)

// ═══ FIELD AGENT ════════════════════════════════════════════════════
opsRouter.get('/my-tasks', agentMiddleware, getMyTasks)
opsRouter.put('/tasks/:id/status', opsTeamMiddleware, updateTaskStatus)
opsRouter.post('/visits', agentMiddleware, submitVisit)

export default opsRouter