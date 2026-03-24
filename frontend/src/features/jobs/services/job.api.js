import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
})

export const fetchJobs = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    const res = await api.get(`/api/jobs?${params}`)
    return res.data
}

export const fetchJob = async (id) => {
    const res = await api.get(`/api/jobs/${id}`)
    return res.data
}