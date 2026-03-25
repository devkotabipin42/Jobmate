import axios from 'axios'
import API_URL from '../../../config/api.js'

const api = axios.create({
    baseURL: API_URL,
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