import { useState } from 'react'
import {
    getMyJobs,
    createJob,
    deleteJob,
    getJobApplications,
    updateApplicationStatus
} from '../services/employer.api.js'

const useEmployer = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchMyJobs = async () => {
        setLoading(true)
        try {
            const data = await getMyJobs()
            return data.jobs
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch jobs')
            return []
        } finally {
            setLoading(false)
        }
    }

    const postJob = async (formData) => {
        setLoading(true)
        try {
            const data = await createJob(formData)
            return data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    const removeJobById = async (id) => {
        setLoading(true)
        try {
            await deleteJob(id)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete')
        } finally {
            setLoading(false)
        }
    }

    const fetchJobApplications = async (jobId) => {
        setLoading(true)
        try {
            const data = await getJobApplications(jobId)
            return data.applications
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch applications')
            return []
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (appId, status) => {
        try {
            await updateApplicationStatus(appId, status)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status')
        }
    }

    const getCompanyProfile = async (id) => {
    setLoading(true)
    try {
        const [companyRes, jobsRes] = await Promise.all([
            axios.get(`${API_URL}/api/employer/${id}`),
            axios.get(`${API_URL}/api/jobs?employer=${id}`)
        ])
        return {
            company: companyRes.data.employer,
            jobs: jobsRes.data.jobs
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch')
        return null
    } finally {
        setLoading(false)
    }
}

    return {
        loading,
        error,
        fetchMyJobs,
        postJob,
        removeJobById,
        fetchJobApplications,
        updateStatus,
        getCompanyProfile
    }
}

export default useEmployer