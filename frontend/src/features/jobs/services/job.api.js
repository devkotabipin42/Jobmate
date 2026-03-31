import axios from 'axios'
import API_URL from '../../../config/api.js'

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

export const fetchJobs = async (filters = {}) => {
    const res = await axios.get(`${API_URL}/api/jobs`, {
        params: {
            keyword: filters.keyword || '',
            location: filters.location || '',
            category: filters.category || '',
            type: filters.type || '',
            experience: filters.experience || ''
        }
    })
    return res.data.jobs
}

export const fetchJob = async (id) => {
    const res = await api.get(`/api/jobs/${id}`)
    return res.data
}

export const fetchStats = async () => {
    const res = await axios.get(`${API_URL}/api/stats`)
    return res.data
}