import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Navbar from '../../../components/Navbar.jsx'
import API_URL from '../../../config/api.js'
import useAuth from '../../auth/hooks/useAuth.js'

const Support = () => {
    const { user } = useAuth()
    const [tickets, setTickets] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [form, setForm] = useState({
        subject: '',
        message: '',
        category: 'general',
        priority: 'medium'
    })

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token')
        return {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
    }

    useEffect(() => {
        loadTickets()
    }, [])

    const loadTickets = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/tickets/my`, getAuthHeaders())
            setTickets(res.data.tickets || [])
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async () => {
        if (!form.subject || !form.message) return
        setLoading(true)
        try {
            const res = await axios.post(`${API_URL}/api/tickets`, form, getAuthHeaders())
            setTickets(prev => [res.data.ticket, ...prev])
            setShowForm(false)
            setSuccess(true)
            setForm({ subject: '', message: '', category: 'general', priority: 'medium' })
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const statusColors = {
        open: 'bg-blue-50 text-blue-600',
        in_progress: 'bg-yellow-50 text-yellow-600',
        resolved: 'bg-green-50 text-green-600',
        closed: 'bg-gray-100 text-gray-500'
    }

    const priorityColors = {
        low: 'bg-gray-100 text-gray-500',
        medium: 'bg-blue-50 text-blue-600',
        high: 'bg-red-50 text-red-600'
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            {/* Header */}
            <div className='bg-gradient-to-r from-green-600 to-green-800 px-6 py-8'>
                <div className='max-w-4xl mx-auto'>
                    <h1 className='text-2xl font-bold text-white mb-1'>Support Center</h1>
                    <p className='text-green-200 text-sm'>Submit a ticket — we respond within 24 hours</p>
                </div>
            </div>

            <div className='max-w-4xl mx-auto px-4 md:px-6 py-6'>

                {success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm'>
                        Ticket submitted! Check your email for confirmation.
                    </motion.div>
                )}

                {/* Top Bar */}
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                        My Tickets ({tickets.length})
                    </h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className='bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors'
                    >
                        + New Ticket
                    </button>
                </div>

                {/* New Ticket Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-4'
                        >
                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>
                                New Support Ticket
                            </h3>
                            <div className='space-y-3'>
                                <input
                                    type='text'
                                    placeholder='Subject *'
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                />
                                <div className='grid grid-cols-2 gap-3'>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className='border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                    >
                                        <option value='general'>General</option>
                                        <option value='technical'>Technical</option>
                                        <option value='billing'>Billing</option>
                                        <option value='job'>Job Issue</option>
                                        <option value='account'>Account</option>
                                        <option value='other'>Other</option>
                                    </select>
                                    <select
                                        value={form.priority}
                                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                        className='border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                    >
                                        <option value='low'>Low Priority</option>
                                        <option value='medium'>Medium Priority</option>
                                        <option value='high'>High Priority</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder='Describe your issue *'
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    rows={4}
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white resize-none'
                                />
                                <div className='flex gap-2'>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || !form.subject || !form.message}
                                        className='flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors'
                                    >
                                        {loading ? 'Submitting...' : 'Submit Ticket'}
                                    </button>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className='flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tickets List + Detail */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                    {/* Tickets List */}
                    <div className='space-y-2'>
                        {tickets.length === 0 ? (
                            <div className='text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700'>
                                <p className='text-gray-500 dark:text-gray-400 text-sm mb-3'>No tickets yet</p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className='text-xs text-green-600 hover:underline'
                                >
                                    Create your first ticket
                                </button>
                            </div>
                        ) : (
                            tickets.map((ticket, i) => (
                                <motion.div
                                    key={ticket._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`bg-white dark:bg-gray-800 border rounded-xl p-4 cursor-pointer transition-all ${
                                        selectedTicket?._id === ticket._id
                                            ? 'border-green-500 shadow-sm'
                                            : 'border-gray-100 dark:border-gray-700 hover:border-green-300'
                                    }`}
                                >
                                    <div className='flex items-start justify-between gap-2 mb-2'>
                                        <p className='text-sm font-medium text-gray-800 dark:text-white truncate'>
                                            {ticket.subject}
                                        </p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusColors[ticket.status]}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[ticket.priority]}`}>
                                            {ticket.priority}
                                        </span>
                                        <span className='text-xs text-gray-400'>
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                        {ticket.replies?.length > 0 && (
                                            <span className='text-xs text-green-600 ml-auto'>
                                                {ticket.replies.length} replies
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Ticket Detail */}
                    {selectedTicket ? (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 h-fit'
                        >
                            <div className='flex items-start justify-between mb-3'>
                                <div>
                                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>
                                        {selectedTicket.subject}
                                    </h3>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                        #{selectedTicket._id.slice(-6).toUpperCase()} · {selectedTicket.category}
                                    </p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[selectedTicket.status]}`}>
                                    {selectedTicket.status.replace('_', ' ')}
                                </span>
                            </div>

                            {/* Original Message */}
                            <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-4'>
                                <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                                    {selectedTicket.message}
                                </p>
                                <p className='text-xs text-gray-400 mt-2'>
                                    {new Date(selectedTicket.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Replies */}
                            {selectedTicket.replies?.length > 0 && (
                                <div className='space-y-2 mb-4'>
                                    <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                                        Replies
                                    </p>
                                    {selectedTicket.replies.map((reply, i) => (
                                        <div key={i} className={`rounded-xl p-3 ${
                                            reply.isAdmin
                                                ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700'
                                                : 'bg-gray-50 dark:bg-gray-700'
                                        }`}>
                                            <p className='text-xs font-medium mb-1 text-gray-700 dark:text-gray-300'>
                                                {reply.isAdmin ? 'Support Team' : 'You'}
                                            </p>
                                            <p className='text-xs text-gray-600 dark:text-gray-300'>
                                                {reply.message}
                                            </p>
                                            <p className='text-xs text-gray-400 mt-1'>
                                                {new Date(reply.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedTicket.status !== 'closed' && (
                                <p className='text-xs text-gray-400 text-center'>
                                    Our team will reply within 24 hours
                                </p>
                            )}
                        </motion.div>
                    ) : (
                        <div className='text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700'>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                Select a ticket to view details
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Support