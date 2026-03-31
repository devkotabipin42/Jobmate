import { useState } from 'react'
import axios from 'axios'
import API_URL from '../../../config/api.js'

const useCRM = () => {
    const [candidates, setCandidates] = useState([])
    const [loading, setLoading] = useState(false)

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token')
        return {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
    }

    const loadCandidates = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/api/crm`, getAuthHeaders())
            setCandidates(res.data.candidates || [])
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const addCandidate = async (data) => {
        const res = await axios.post(`${API_URL}/api/crm`, data, getAuthHeaders())
        setCandidates(prev => [res.data.candidate, ...prev])
        return res.data
    }

    const updateStatus = async (id, status) => {
        await axios.put(`${API_URL}/api/crm/${id}/status`, { status }, getAuthHeaders())
        setCandidates(prev => prev.map(c => c._id === id ? { ...c, status } : c))
    }

    const addNote = async (id, text) => {
        const res = await axios.post(`${API_URL}/api/crm/${id}/notes`, { text }, getAuthHeaders())
        setCandidates(prev => prev.map(c => c._id === id ? res.data.candidate : c))
        return res.data.candidate
    }

    const setFollowUp = async (id, follow_up_date) => {
        await axios.put(`${API_URL}/api/crm/${id}/follow-up`, { follow_up_date }, getAuthHeaders())
        setCandidates(prev => prev.map(c => c._id === id ? { ...c, follow_up_date } : c))
    }

    const deleteCandidate = async (id) => {
        await axios.delete(`${API_URL}/api/crm/${id}`, getAuthHeaders())
        setCandidates(prev => prev.filter(c => c._id !== id))
    }

    return {
        candidates,
        loading,
        loadCandidates,
        addCandidate,
        updateStatus,
        addNote,
        setFollowUp,
        deleteCandidate
    }
}

export default useCRM