import { useState } from 'react'
import axios from 'axios'
import API_URL from '../../../config/api.js'

const useAdmin = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token')
        return {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
    }

    const getStats = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/admin/stats`, getAuthHeaders())
            return res.data.stats
        } catch (err) {
            setError(err.response?.data?.message || 'Failed')
            return null
        }
    }

    const getAnalytics = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/api/admin/analytics`, getAuthHeaders())
            return res.data.analytics
        } catch (err) {
            setError(err.response?.data?.message || 'Failed')
            return null
        } finally {
            setLoading(false)
        }
    }

    const getPendingJobs = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/api/admin/jobs/pending`, getAuthHeaders())
            return res.data.jobs
        } catch (err) {
            return []
        } finally {
            setLoading(false)
        }
    }

    const getAllJobs = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/api/admin/jobs`, getAuthHeaders())
            return res.data.jobs
        } catch (err) {
            return []
        } finally {
            setLoading(false)
        }
    }

    const getAllEmployers = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/api/admin/employers`, getAuthHeaders())
            return res.data.employers
        } catch (err) {
            return []
        } finally {
            setLoading(false)
        }
    }

    const getAllUsers = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/api/admin/users`, getAuthHeaders())
            return res.data.users
        } catch (err) {
            return []
        } finally {
            setLoading(false)
        }
    }

    const verifyJob = async (id) => {
        try {
            await axios.put(`${API_URL}/api/admin/jobs/${id}/verify`, {}, getAuthHeaders())
            return true
        } catch (err) {
            return false
        }
    }

    const rejectJob = async (id) => {
        try {
            await axios.put(`${API_URL}/api/admin/jobs/${id}/reject`, {}, getAuthHeaders())
            return true
        } catch (err) {
            return false
        }
    }

    const deleteJob = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/admin/jobs/${id}`, getAuthHeaders())
            return true
        } catch (err) {
            return false
        }
    }

    const verifyEmployer = async (id) => {
        try {
            await axios.put(`${API_URL}/api/admin/employers/${id}/verify`, {}, getAuthHeaders())
            return true
        } catch (err) {
            return false
        }
    }

    const banUser = async (id) => {
        try {
            await axios.put(`${API_URL}/api/admin/users/${id}/ban`, {}, getAuthHeaders())
            return true
        } catch (err) {
            return false
        }
    }

    const unbanUser = async (id) => {
        try {
            await axios.put(`${API_URL}/api/admin/users/${id}/unban`, {}, getAuthHeaders())
            return true
        } catch (err) {
            return false
        }
    }

    const updateUserRole = async (id, role) => {
        try {
            await axios.put(`${API_URL}/api/admin/users/${id}/role`, { role }, getAuthHeaders())
            return true
        } catch (err) {
            return false
        }
    }
    const getAllReports = async () => {
    setLoading(true)
    try {
        const res = await axios.get(`${API_URL}/api/reports/all`, getAuthHeaders())
        return res.data.reports
    } catch (err) {
        return []
    } finally {
        setLoading(false)
    }
    }

    const resolveReport = async (id) => {
    try {
        await axios.put(`${API_URL}/api/reports/${id}/resolve`, {}, getAuthHeaders())
        return true
    } catch (err) {
        return false
    }
    }

    const dismissReport = async (id) => {
    try {
        await axios.put(`${API_URL}/api/reports/${id}/dismiss`, {}, getAuthHeaders())
        return true
    } catch (err) {
        return false
    }
    }
    const getAllTestimonials = async () => {
    setLoading(true)
    try {
        const res = await axios.get(`${API_URL}/api/testimonials/all`, getAuthHeaders())
        return res.data.testimonials
    } catch (err) {
        return []
    } finally {
        setLoading(false)
    }
}

const approveTestimonial = async (id) => {
    try {
        await axios.put(`${API_URL}/api/testimonials/${id}/approve`, {}, getAuthHeaders())
        return true
    } catch (err) {
        return false
    }
}

const rejectTestimonial = async (id) => {
    try {
        await axios.put(`${API_URL}/api/testimonials/${id}/reject`, {}, getAuthHeaders())
        return true
    } catch (err) {
        return false
    }
}

const deleteTestimonialAdmin = async (id) => {
    try {
        await axios.delete(`${API_URL}/api/testimonials/${id}`, getAuthHeaders())
        return true
    } catch (err) {
        return false
    }
}

const toggleFeaturedJob = async (id) => {
    try {
        await axios.put(`${API_URL}/api/admin/jobs/${id}/feature`, {}, getAuthHeaders())
        return true
    } catch (err) {
        return false
    }
}

    return {
        loading,
        error,
        getStats,
        getAnalytics,
        getPendingJobs,
        getAllJobs,
        getAllEmployers,
        getAllUsers,
        verifyJob,
        rejectJob,
        deleteJob,
        verifyEmployer,
        banUser,
        unbanUser,
        updateUserRole,
        getAllReports,
    resolveReport,
    dismissReport,
    getAllTestimonials,
    approveTestimonial,
    rejectTestimonial,
    deleteTestimonialAdmin,
    toggleFeaturedJob

}
}
export default useAdmin