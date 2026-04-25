import { useState } from 'react'
import * as opsApi from '../services/ops.api.js'

const useOps = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const withLoader = async (fn) => {
    setLoading(true)
    setError('')
    try {
        return await fn()
    } catch (err) {
        const data = err.response?.data
        let msg = 'Request failed'
        
        if (data?.errors && Array.isArray(data.errors)) {
            msg = data.errors.map(e => `${e.field}: ${e.message}`).join(', ')
        } else if (data?.message) {
            msg = data.message
        } else if (data?.error) {
            msg = data.error
        }
        
        setError(msg)
        throw err
    } finally {
        setLoading(false)
    }
}

    // ── Team ──────────────────────────────────────────────────────
    const fetchTeam = () => withLoader(async () => {
        const data = await opsApi.getTeamMembers()
        return data.members
    })

    const addTeamMember = (payload) => withLoader(async () => {
        const data = await opsApi.createTeamMember(payload)
        return data.member
    })

    const editTeamMember = (id, payload) => withLoader(async () => {
        const data = await opsApi.updateTeamMember(id, payload)
        return data.member
    })

    const removeTeamMember = (id) => withLoader(async () => {
        await opsApi.deactivateTeamMember(id)
    })

    // ── Tasks ─────────────────────────────────────────────────────
    const createNewTask = (payload) => withLoader(async () => {
        const data = await opsApi.createTask(payload)
        return data.task
    })

    const fetchAllTasks = (params) => withLoader(async () => {
        const data = await opsApi.getAllTasks(params)
        return data.tasks
    })

    const fetchMyTasks = (params) => withLoader(async () => {
        const data = await opsApi.getMyTasks(params)
        return data.tasks
    })

    const changeTaskStatus = (id, status) => withLoader(async () => {
        const data = await opsApi.updateTaskStatus(id, status)
        return data.task
    })

    // ── Visits ────────────────────────────────────────────────────
    const submitFieldVisit = (payload) => withLoader(async () => {
        const data = await opsApi.submitVisit(payload)
        return data.visit
    })

    const fetchPendingReviews = () => withLoader(async () => {
        const data = await opsApi.getPendingReviews()
        return data.visits
    })

    const fetchVisitDetail = (id) => withLoader(async () => {
        const data = await opsApi.getVisitById(id)
        return data.visit
    })

    const reviewVisitSubmission = (id, payload) => withLoader(async () => {
        const data = await opsApi.reviewVisit(id, payload)
        return data.visit
    })
    const fetchApprovedLeads = (params) => withLoader(async () => {
    const data = await opsApi.getApprovedLeads(params)
    return data.leads
})

    // ── Salary ────────────────────────────────────────────────────
    const runSalaryCalculation = (payload) => withLoader(async () => {
        const data = await opsApi.calculateSalary(payload)
        return data.salary
    })

    const fetchSalaryRecords = (params) => withLoader(async () => {
        const data = await opsApi.getSalaryRecords(params)
        return data.records
    })

    const markPaid = (id, payload) => withLoader(async () => {
        const data = await opsApi.markSalaryPaid(id, payload)
        return data.record
    })
    const fetchMySalary = (params) => withLoader(async () => {
    const data = await opsApi.getMySalaryRecords(params)
    return data.records
})

    // ── Dashboard ─────────────────────────────────────────────────
    const fetchStats = () => withLoader(async () => {
        const data = await opsApi.getOpsStats()
        return data.stats
    })

    const fetchActivity = () => withLoader(async () => {
        const data = await opsApi.getRecentActivity()
        return data.activities
    })

    const fetchPerformance = () => withLoader(async () => {
        const data = await opsApi.getAgentPerformance()
        return data.performance
    })
    const createNewAgent = (payload) => withLoader(async () => {
    const data = await opsApi.createAgent(payload)
    return data
})
const fetchMyVisits = (params) => withLoader(async () => {
    const data = await opsApi.getMyVisits(params)
    return data.visits
})


    return {
        loading,
        error,

        fetchTeam,
        addTeamMember,
        editTeamMember,
        removeTeamMember,

        createNewTask,
        fetchAllTasks,
        fetchMyTasks,
        changeTaskStatus,
        fetchMyVisits,

        submitFieldVisit,
        fetchPendingReviews,
        fetchVisitDetail,
        reviewVisitSubmission,
        fetchApprovedLeads,

        runSalaryCalculation,
        fetchSalaryRecords,
        markPaid,
        fetchMySalary,

        fetchStats,
        fetchActivity,
        fetchPerformance,
        createNewAgent,
        withLoader,
    }
}

export default useOps