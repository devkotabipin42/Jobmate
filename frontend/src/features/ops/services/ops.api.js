import axios from 'axios'
import API_URL from '../../../config/api.js'

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// ─── TEAM ──────────────────────────────────────────────────────────
export const getTeamMembers = async () => {
    const res = await api.get('/api/ops/team')
    return res.data
}

export const createTeamMember = async (data) => {
    const res = await api.post('/api/ops/team', data)
    return res.data
}

export const updateTeamMember = async (id, data) => {
    const res = await api.put(`/api/ops/team/${id}`, data)
    return res.data
}

export const deactivateTeamMember = async (id) => {
    const res = await api.delete(`/api/ops/team/${id}`)
    return res.data
}

// ─── TASKS ─────────────────────────────────────────────────────────
export const createTask = async (data) => {
    const res = await api.post('/api/ops/tasks', data)
    return res.data
}

export const getAllTasks = async (params = {}) => {
    const res = await api.get('/api/ops/tasks', { params })
    return res.data
}

export const getMyTasks = async (params = {}) => {
    const res = await api.get('/api/ops/my-tasks', { params })
    return res.data
}

export const updateTaskStatus = async (id, status) => {
    const res = await api.put(`/api/ops/tasks/${id}/status`, { status })
    return res.data
}

// ─── VISITS ────────────────────────────────────────────────────────
export const submitVisit = async (data) => {
    const res = await api.post('/api/ops/visits', data)
    return res.data
}

export const getPendingReviews = async () => {
    const res = await api.get('/api/ops/visits/pending')
    return res.data
}

export const getVisitById = async (id) => {
    const res = await api.get(`/api/ops/visits/${id}`)
    return res.data
}

export const reviewVisit = async (id, data) => {
    const res = await api.put(`/api/ops/visits/${id}/review`, data)
    return res.data
}

// ─── SALARY ────────────────────────────────────────────────────────
export const calculateSalary = async (data) => {
    const res = await api.post('/api/ops/salary/calculate', data)
    return res.data
}

export const getSalaryRecords = async (params = {}) => {
    const res = await api.get('/api/ops/salary', { params })
    return res.data
}

export const markSalaryPaid = async (id, data) => {
    const res = await api.put(`/api/ops/salary/${id}/paid`, data)
    return res.data
}

// ─── DASHBOARD ─────────────────────────────────────────────────────
export const getOpsStats = async () => {
    const res = await api.get('/api/ops/stats')
    return res.data
}

export const getRecentActivity = async () => {
    const res = await api.get('/api/ops/activity')
    return res.data
}

export const getAgentPerformance = async () => {
    const res = await api.get('/api/ops/performance')
    return res.data
}
export const createAgent = async (data) => {
    const res = await api.post('/api/ops/agents', data)
    return res.data
}
export const getMyVisits = async (params = {}) => {
    const res = await api.get('/api/ops/my-visits', { params })
    return res.data
}