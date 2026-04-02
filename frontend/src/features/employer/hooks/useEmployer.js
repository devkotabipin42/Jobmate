import axios from 'axios'
import API_URL from '../../../config/api.js'
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

const editJob = async (id, formData) => {
    setLoading(true)
    try {
        const res = await axios.put(
            `${API_URL}/api/jobs/${id}`,
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

const uploadLogo = async (file) => {
    setLoading(true)
    try {
        const formData = new FormData()
        formData.append('logo', file)
        const token = localStorage.getItem('token')
        const res = await axios.post(
            `${API_URL}/api/employer/upload-logo`,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            }
        )
        return res.data
    } catch (err) {
        throw err
    } finally {
        setLoading(false)
    }
}

const getCRMCandidates = async () => {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${API_URL}/api/crm`, {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        return res.data.candidates
    } catch (err) {
        return []
    }
}

const addCRMCandidate = async (data) => {
    const token = localStorage.getItem('token')
    const res = await axios.post(`${API_URL}/api/crm`, data, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    return res.data
}

const updateCRMStatus = async (id, status) => {
    const token = localStorage.getItem('token')
    const res = await axios.put(`${API_URL}/api/crm/${id}/status`, { status }, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    return res.data
}

const addCRMNote = async (id, text) => {
    const token = localStorage.getItem('token')
    const res = await axios.post(`${API_URL}/api/crm/${id}/notes`, { text }, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    return res.data
}

const setCRMFollowUp = async (id, follow_up_date) => {
    const token = localStorage.getItem('token')
    const res = await axios.put(`${API_URL}/api/crm/${id}/follow-up`, { follow_up_date }, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    return res.data
}

const deleteCRMCandidate = async (id) => {
    const token = localStorage.getItem('token')
    await axios.delete(`${API_URL}/api/crm/${id}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
}

const updateCompanyProfile = async (formData) => {
    setLoading(true)
    try {
        const res = await axios.put(
            `${API_URL}/api/employer/update-profile`,
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

    return {
        loading,
        error,
        fetchMyJobs,
        postJob,
        removeJobById,
        fetchJobApplications,
        updateStatus,
        getCompanyProfile,
        editJob,
        uploadLogo,
        getCRMCandidates,
        addCRMCandidate,
        updateCRMStatus,
        addCRMNote,
        setCRMFollowUp,
        deleteCRMCandidate,
        updateCompanyProfile
    }
}

export default useEmployer