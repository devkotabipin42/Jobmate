import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
})

export const getMyJobs = async () => {
    const res = await api.get('/api/jobs/employer/my-jobs')
    return res.data
}

export const createJob = async (data) => {
    const res = await api.post('/api/jobs', data)
    return res.data
}

export const deleteJob = async (id) => {
    const res = await api.delete(`/api/jobs/${id}`)
    return res.data
}

export const getJobApplications = async (id) => {
    const res = await api.get(`/api/applications/job/${id}`)
    return res.data
}

export const updateApplicationStatus = async (id, status) => {
    const res = await api.put(`/api/applications/status/${id}`, { status })
    return res.data
}