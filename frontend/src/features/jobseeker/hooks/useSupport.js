import { useState } from 'react'
import axios from 'axios'
import API_URL from '../../../config/api.js'

const useSupport = () => {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(false)

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token')
        return {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
    }

    const loadTickets = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/tickets/my`, getAuthHeaders())
            setTickets(res.data.tickets || [])
        } catch (err) {
            console.log(err)
        }
    }

    const createTicket = async (form) => {
        setLoading(true)
        try {
            const res = await axios.post(`${API_URL}/api/tickets`, form, getAuthHeaders())
            setTickets(prev => [res.data.ticket, ...prev])
            return res.data.ticket
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { tickets, loading, loadTickets, createTicket }
}

export default useSupport