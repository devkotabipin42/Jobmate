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
            setError(err.response?.data?.message || 'Request failed')
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

        submitFieldVisit,
        fetchPendingReviews,
        fetchVisitDetail,
        reviewVisitSubmission,

        runSalaryCalculation,
        fetchSalaryRecords,
        markPaid,

        fetchStats,
        fetchActivity,
        fetchPerformance
    }
}

export default useOps