import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie,
    Cell, LineChart, Line
} from 'recharts'
import Navbar from '../../../components/Navbar.jsx'
import API_URL from '../../../config/api.js'

const COLORS = ['#22c55e', '#f59e0b', '#8b5cf6', '#3b82f6', '#ef4444']

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [stats, setStats] = useState(null)
    const [pendingJobs, setPendingJobs] = useState([])
    const [allJobs, setAllJobs] = useState([])
    const [employers, setEmployers] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadStats()
        loadPendingJobs()
    }, [])

    const loadStats = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/admin/stats`, { withCredentials: true })
            setStats(res.data.stats)
        } catch (err) {
            console.log(err)
        }
    }

    const loadPendingJobs = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/api/admin/jobs/pending`, { withCredentials: true })
            setPendingJobs(res.data.jobs)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const loadAllJobs = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/api/admin/jobs`, { withCredentials: true })
            setAllJobs(res.data.jobs)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const loadEmployers = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/api/admin/employers`, { withCredentials: true })
            setEmployers(res.data.employers)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const loadUsers = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/api/admin/users`, { withCredentials: true })
            setUsers(res.data.users)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        if (tab === 'pending') loadPendingJobs()
        if (tab === 'all-jobs') loadAllJobs()
        if (tab === 'employers') loadEmployers()
        if (tab === 'users') loadUsers()
    }

    const handleVerifyJob = async (id) => {
        try {
            await axios.put(`${API_URL}/api/admin/jobs/${id}/verify`, {}, { withCredentials: true })
            setPendingJobs(prev => prev.filter(j => j._id !== id))
            loadStats()
        } catch (err) {
            console.log(err)
        }
    }

    const handleRejectJob = async (id) => {
        try {
            await axios.put(`${API_URL}/api/admin/jobs/${id}/reject`, {}, { withCredentials: true })
            setPendingJobs(prev => prev.filter(j => j._id !== id))
            loadStats()
        } catch (err) {
            console.log(err)
        }
    }

    const handleDeleteJob = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/admin/jobs/${id}`, { withCredentials: true })
            setAllJobs(prev => prev.filter(j => j._id !== id))
            loadStats()
        } catch (err) {
            console.log(err)
        }
    }

    const handleVerifyEmployer = async (id) => {
        try {
            await axios.put(`${API_URL}/api/admin/employers/${id}/verify`, {}, { withCredentials: true })
            setEmployers(prev => prev.map(e => e._id === id ? { ...e, is_verified: true } : e))
        } catch (err) {
            console.log(err)
        }
    }

    const tabs = [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'pending', label: `⏳ Pending (${stats?.pendingJobs || 0})` },
        { id: 'all-jobs', label: '💼 All Jobs' },
        { id: 'employers', label: '🏢 Employers' },
        { id: 'users', label: '👥 Users' },
    ]

    const pieData = stats ? [
        { name: 'Verified', value: stats.verifiedJobs },
        { name: 'Pending', value: stats.pendingJobs },
    ] : []

    const barData = stats ? [
        { name: 'Jobs', value: stats.totalJobs, fill: '#22c55e' },
        { name: 'Users', value: stats.totalUsers, fill: '#8b5cf6' },
        { name: 'Employers', value: stats.totalEmployers, fill: '#3b82f6' },
        { name: 'Applications', value: stats.totalApplications, fill: '#f59e0b' },
    ] : []

    const LoadingSpinner = () => (
        <div className='text-center py-20'>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto'
            />
        </div>
    )

    return (
        <div className='min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors'>
            <Navbar />

            {/* Header */}
            <div className='bg-gradient-to-r from-purple-700 to-purple-900 px-6 py-8'>
                <div className='max-w-7xl mx-auto'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <div>
                            <span className='text-xs bg-white/20 text-white px-3 py-1 rounded-full mb-2 inline-block font-medium'>
                                🔐 Admin Access
                            </span>
                            <h1 className='text-3xl font-bold text-white'>
                                Admin Dashboard
                            </h1>
                            <p className='text-purple-200 text-sm mt-1'>
                                Jobmate Platform Management
                            </p>
                        </div>
                        {stats && (
                            <div className='flex items-center gap-6 bg-white/10 rounded-2xl px-6 py-3'>
                                <div className='text-center'>
                                    <p className='text-2xl font-bold text-white'>{stats.totalJobs}</p>
                                    <p className='text-xs text-purple-200'>Jobs</p>
                                </div>
                                <div className='w-px h-10 bg-white/20' />
                                <div className='text-center'>
                                    <p className='text-2xl font-bold text-amber-300'>{stats.pendingJobs}</p>
                                    <p className='text-xs text-purple-200'>Pending</p>
                                </div>
                                <div className='w-px h-10 bg-white/20' />
                                <div className='text-center'>
                                    <p className='text-2xl font-bold text-green-300'>{stats.totalUsers}</p>
                                    <p className='text-xs text-purple-200'>Users</p>
                                </div>
                                <div className='w-px h-10 bg-white/20' />
                                <div className='text-center'>
                                    <p className='text-2xl font-bold text-blue-300'>{stats.totalEmployers}</p>
                                    <p className='text-xs text-purple-200'>Employers</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 md:px-6 py-6'>

                {/* Tabs */}
                <div className='flex gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-1.5 mb-6 overflow-x-auto shadow-sm'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`px-5 py-2.5 text-sm rounded-xl transition-all whitespace-nowrap font-medium ${
                                activeTab === tab.id
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && stats && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='space-y-6'
                    >
                        {/* Stats Cards */}
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            {[
                                { label: 'Total Jobs', value: stats.totalJobs, color: 'text-green-600', bg: 'bg-green-500', icon: '💼', change: '+12%' },
                                { label: 'Pending', value: stats.pendingJobs, color: 'text-amber-600', bg: 'bg-amber-500', icon: '⏳', change: 'Review now' },
                                { label: 'Total Users', value: stats.totalUsers, color: 'text-purple-600', bg: 'bg-purple-500', icon: '👥', change: '+8%' },
                                { label: 'Applications', value: stats.totalApplications, color: 'text-blue-600', bg: 'bg-blue-500', icon: '📋', change: '+24%' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700'
                                >
                                    <div className='flex items-center justify-between mb-4'>
                                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-white text-lg shadow-sm`}>
                                            {stat.icon}
                                        </div>
                                        <span className='text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900 px-2 py-1 rounded-full'>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Charts Row */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                            {/* Bar Chart */}
                            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>
                                    Platform Overview
                                </h3>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                                    Total count by category
                                </p>
                                <ResponsiveContainer width='100%' height={200}>
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                                        <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey='value' radius={[6, 6, 0, 0]}>
                                            {barData.map((entry, index) => (
                                                <Cell key={index} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Pie Chart */}
                            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>
                                    Job Verification Status
                                </h3>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                                    Verified vs Pending jobs
                                </p>
                                <div className='flex items-center gap-6'>
                                    <ResponsiveContainer width='60%' height={180}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx='50%'
                                                cy='50%'
                                                innerRadius={50}
                                                outerRadius={80}
                                                dataKey='value'
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[index]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className='space-y-3'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-3 h-3 rounded-full bg-green-500' />
                                            <div>
                                                <p className='text-xs font-medium text-gray-800 dark:text-white'>Verified</p>
                                                <p className='text-lg font-bold text-green-600'>{stats.verifiedJobs}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-3 h-3 rounded-full bg-amber-500' />
                                            <div>
                                                <p className='text-xs font-medium text-gray-800 dark:text-white'>Pending</p>
                                                <p className='text-lg font-bold text-amber-600'>{stats.pendingJobs}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* More Stats Row */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div className='bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white'>
                                <div className='text-3xl mb-2'>✅</div>
                                <p className='text-3xl font-bold mb-1'>{stats.verifiedJobs}</p>
                                <p className='text-green-100 text-sm'>Verified Jobs</p>
                                <p className='text-xs text-green-200 mt-2'>
                                    {Math.round((stats.verifiedJobs / stats.totalJobs) * 100) || 0}% of total jobs
                                </p>
                            </div>

                            <div className='bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white'>
                                <div className='text-3xl mb-2'>🏢</div>
                                <p className='text-3xl font-bold mb-1'>{stats.totalEmployers}</p>
                                <p className='text-blue-100 text-sm'>Registered Employers</p>
                                <p className='text-xs text-blue-200 mt-2'>
                                    Active on platform
                                </p>
                            </div>

                            <div className='bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white'>
                                <div className='text-3xl mb-2'>📋</div>
                                <p className='text-3xl font-bold mb-1'>{stats.totalApplications}</p>
                                <p className='text-purple-100 text-sm'>Total Applications</p>
                                <p className='text-xs text-purple-200 mt-2'>
                                    Avg {Math.round(stats.totalApplications / (stats.totalJobs || 1))} per job
                                </p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>
                                Quick Actions
                            </h3>
                            <div className='flex gap-3 flex-wrap'>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTabChange('pending')}
                                    className='flex items-center gap-2 text-sm bg-amber-500 text-white px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors font-medium shadow-sm'
                                >
                                    ⏳ Review Pending ({stats.pendingJobs})
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTabChange('employers')}
                                    className='flex items-center gap-2 text-sm bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm'
                                >
                                    🏢 Verify Employers
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTabChange('all-jobs')}
                                    className='flex items-center gap-2 text-sm bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors font-medium shadow-sm'
                                >
                                    💼 All Jobs
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTabChange('users')}
                                    className='flex items-center gap-2 text-sm bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-sm'
                                >
                                    👥 All Users
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Pending Jobs Tab */}
                {activeTab === 'pending' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                                Pending Jobs — {pendingJobs.length} waiting
                            </h2>
                        </div>
                        {loading ? <LoadingSpinner /> : pendingJobs.length === 0 ? (
                            <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700'>
                                <div className='text-5xl mb-3'>✅</div>
                                <p className='text-gray-500 dark:text-gray-400 font-medium'>All jobs verified!</p>
                                <p className='text-xs text-gray-400 mt-1'>No pending jobs at the moment</p>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {pendingJobs.map((job, i) => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className='bg-white dark:bg-gray-800 border-l-4 border-l-amber-500 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm'
                                    >
                                        <div className='flex items-start justify-between gap-3 mb-3'>
                                            <div className='flex items-start gap-3'>
                                                <div className='w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900 flex items-center justify-center text-amber-600 font-bold shrink-0'>
                                                    {job.employer?.company_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-0.5'>
                                                        {job.title}
                                                    </h3>
                                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                        🏢 {job.employer?.company_name} · 📍 {job.location} · {job.type}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className='text-xs bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-3 py-1 rounded-full font-medium shrink-0'>
                                                ⏳ Pending
                                            </span>
                                        </div>

                                        <div className='flex gap-2 flex-wrap mb-3'>
                                            <span className='text-xs bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-medium'>
                                                💰 Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                                            </span>
                                            <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full'>
                                                {job.category}
                                            </span>
                                            <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full'>
                                                📅 {new Date(job.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p className='text-xs text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl line-clamp-2'>
                                            {job.description}
                                        </p>

                                        <div className='flex gap-2'>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleVerifyJob(job._id)}
                                                className='flex-1 bg-green-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors shadow-sm'
                                            >
                                                ✓ Verify Job
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleRejectJob(job._id)}
                                                className='flex-1 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900 transition-colors'
                                            >
                                                ✕ Reject
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* All Jobs Tab */}
                {activeTab === 'all-jobs' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                                All Jobs — {allJobs.length} total
                            </h2>
                        </div>
                        {loading ? <LoadingSpinner /> : (
                            <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden'>
                                {allJobs.map((job, i) => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className='flex items-center justify-between gap-3 p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-sm shrink-0'>
                                                {job.employer?.company_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className='text-sm font-medium text-gray-800 dark:text-white'>
                                                    {job.title}
                                                </p>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                    {job.employer?.company_name} · {job.location}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2 shrink-0'>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                job.is_verified
                                                    ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300'
                                                    : 'bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300'
                                            }`}>
                                                {job.is_verified ? '✓ Verified' : '⏳ Pending'}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteJob(job._id)}
                                                className='text-xs text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors border border-red-100 dark:border-red-800'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Employers Tab */}
                {activeTab === 'employers' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                                Employers — {employers.length} registered
                            </h2>
                        </div>
                        {loading ? <LoadingSpinner /> : (
                            <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden'>
                                {employers.map((employer, i) => (
                                    <motion.div
                                        key={employer._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className='flex items-center justify-between gap-3 p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold shrink-0'>
                                                {employer.company_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className='flex items-center gap-2'>
                                                    <p className='text-sm font-medium text-gray-800 dark:text-white'>
                                                        {employer.company_name}
                                                    </p>
                                                    {employer.is_verified && (
                                                        <span className='text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full'>
                                                            ✓ Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                    {employer.email} · {employer.location || 'Nepal'}
                                                </p>
                                            </div>
                                        </div>
                                        {!employer.is_verified && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleVerifyEmployer(employer._id)}
                                                className='text-xs bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors font-medium shrink-0'
                                            >
                                                ✓ Verify
                                            </motion.button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                                Users — {users.length} registered
                            </h2>
                        </div>
                        {loading ? <LoadingSpinner /> : (
                            <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden'>
                                {users.map((user, i) => (
                                    <motion.div
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className='flex items-center justify-between gap-3 p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-semibold text-sm shrink-0'>
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className='text-sm font-medium text-gray-800 dark:text-white'>
                                                    {user.name}
                                                </p>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                    {user.email} · {user.location || 'No location'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                user.role === 'admin'
                                                    ? 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                            }`}>
                                                {user.role}
                                            </span>
                                            <span className='text-xs text-gray-400'>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default AdminPanel