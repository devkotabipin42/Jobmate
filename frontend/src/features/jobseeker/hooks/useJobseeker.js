import { useState } from 'react'
import axios from 'axios'
import API_URL from '../../../config/api.js'

const useJobseeker = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const getMyApplications = async () => {
        setLoading(true)
        try {
            const res = await axios.get(
                `${API_URL}/api/applications/my`,
                { withCredentials: true }
            )
            return res.data.applications
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch')
            return []
        } finally {
            setLoading(false)
        }
    }

    const applyJob = async (jobId, coverLetter) => {
        setLoading(true)
        try {
            const res = await axios.post(
                `${API_URL}/api/applications/apply/${jobId}`,
                { cover_letter: coverLetter },
                { withCredentials: true }
            )
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (formData) => {
        setLoading(true)
        try {
            const res = await axios.put(
                `${API_URL}/api/auth/update`,
                formData,
                { withCredentials: true }
            )
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    const scoreResume = async (resumeText) => {
        setLoading(true)
        try {
            const res = await axios.post(
                `${API_URL}/api/ai/score-resume`,
                { resumeText },
                { withCredentials: true }
            )
            return res.data.result
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }
    const getSavedJobs = async () => {
    setLoading(true)
    try {
        const res = await axios.get(
            `${API_URL}/api/auth/saved-jobs`,
            { withCredentials: true }
        )
        return res.data.saved_jobs
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch')
        return []
    } finally {
        setLoading(false)
    }
    }

    const toggleSaveJob = async (jobId) => {
    try {
        const res = await axios.post(
            `${API_URL}/api/auth/save-job/${jobId}`,
            {},
            { withCredentials: true }
        )
        return res.data
    } catch (err) {
        throw err
    }
    }
    const reportJob = async (jobId, reason, description) => {
    try {
        const res = await axios.post(
            `${API_URL}/api/reports/job/${jobId}`,
            { reason, description },
            { withCredentials: true }
        )
        return res.data
    } catch (err) {
        throw err
    }
}
    return {
        loading,
        error,
        getMyApplications,
        applyJob,
        updateProfile,
        scoreResume,
        getSavedJobs,
        toggleSaveJob,
        reportJob
    }
}

export default useJobseeker