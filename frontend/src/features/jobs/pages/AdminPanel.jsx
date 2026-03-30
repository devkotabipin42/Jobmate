import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie,
    Cell, LineChart, Line
} from 'recharts'
import Navbar from '../../../components/Navbar.jsx'
import useAdmin from '../hooks/useAdmin.js'

const COLORS = ['#22c55e', '#f59e0b', '#8b5cf6', '#3b82f6', '#ef4444']

const AdminPanel = () => {
    const {
        loading,
        getStats,
        getAnalytics,
        getPendingJobs,
        getAllJobs,
        getAllEmployers,
        getAllUsers,
        verifyJob,
        rejectJob,
        deleteJob,
        verifyEmployer,
        banUser,
        unbanUser,
        updateUserRole,
        getAllReports,
        resolveReport, 
        dismissReport  
    } = useAdmin()

    const [activeTab, setActiveTab] = useState('dashboard')
    const [stats, setStats] = useState(null)
    const [pendingJobs, setPendingJobs] = useState([])
    const [allJobs, setAllJobs] = useState([])
    const [employers, setEmployers] = useState([])
    const [users, setUsers] = useState([])
    const [analytics, setAnalytics] = useState(null)
    const [reports, setReports] = useState([])

    useEffect(() => {
        loadStats()
        loadPendingJobs()
    }, [])

   // loadStats
const loadStats = async () => {
    const data = await getStats()
    setStats(data)
}

// loadPendingJobs
const loadPendingJobs = async () => {
    const data = await getPendingJobs()
    setPendingJobs(data)
}

// loadAllJobs
const loadAllJobs = async () => {
    const data = await getAllJobs()
    setAllJobs(data)
}

// loadEmployers
const loadEmployers = async () => {
    const data = await getAllEmployers()
    setEmployers(data)
}

// loadUsers
const loadUsers = async () => {
    const data = await getAllUsers()
    setUsers(data)
}

// loadAnalytics
const loadAnalytics = async () => {
    const data = await getAnalytics()
    setAnalytics(data)
}

// handleVerifyJob
const handleVerifyJob = async (id) => {
    await verifyJob(id)
    setPendingJobs(prev => prev.filter(j => j._id !== id))
    loadStats()
}

// handleRejectJob
const handleRejectJob = async (id) => {
    await rejectJob(id)
    setPendingJobs(prev => prev.filter(j => j._id !== id))
    loadStats()
}

// handleDeleteJob
const handleDeleteJob = async (id) => {
    await deleteJob(id)
    setAllJobs(prev => prev.filter(j => j._id !== id))
    loadStats()
}

// handleVerifyEmployer
const handleVerifyEmployer = async (id) => {
    await verifyEmployer(id)
    setEmployers(prev => prev.map(e => e._id === id ? { ...e, is_verified: true } : e))
}

// handleBanUser
const handleBanUser = async (id) => {
    await banUser(id)
    setUsers(prev => prev.map(u => u._id === id ? { ...u, is_banned: true } : u))
}

// handleUnbanUser
const handleUnbanUser = async (id) => {
    await unbanUser(id)
    setUsers(prev => prev.map(u => u._id === id ? { ...u, is_banned: false } : u))
}

// handleRoleChange
const handleRoleChange = async (id, role) => {
    await updateUserRole(id, role)
    setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u))
}
const loadReports = async () => {
    const data = await getAllReports()
    setReports(data)
}

const handleResolveReport = async (id) => {
    await resolveReport(id)
    setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'resolved' } : r))
}

const handleDismissReport = async (id) => {
    await dismissReport(id)
    setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'dismissed' } : r))
}

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        if (tab === 'pending') loadPendingJobs()
        if (tab === 'all-jobs') loadAllJobs()
        if (tab === 'employers') loadEmployers()
        if (tab === 'users') loadUsers()
        if (tab === 'analytics') loadAnalytics()
        if (tab === 'reports') loadReports()
    }

  

    const tabs = [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'pending', label: `⏳ Pending (${stats?.pendingJobs || 0})` },
        { id: 'all-jobs', label: '💼 All Jobs' },
        { id: 'employers', label: '🏢 Employers' },
        { id: 'users', label: '👥 Users' },
        { id: 'analytics', label: '📈 Analytics' },
        { id: 'reports', label: '🚩 Reports' },
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
                {/* Employers Tab */}
{activeTab === 'employers' && (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <div className='flex items-center justify-between mb-4'>
            <div>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                    Company Verification
                </h2>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                    Verify companies — verified badge will be added
                </p>
            </div>
            <div className='flex gap-2 text-xs'>
                <span className='bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1.5 rounded-full font-medium'>
                    ✓ {employers.filter(e => e.is_verified).length} Verified
                </span>
                <span className='bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-3 py-1.5 rounded-full font-medium'>
                    ⏳ {employers.filter(e => !e.is_verified).length} Pending
                </span>
            </div>
        </div>

        {loading ? <LoadingSpinner /> : (
            <div className='space-y-3'>
                {employers.map((employer, i) => (
                    <motion.div
                        key={employer._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-white dark:bg-gray-800 border rounded-2xl p-5 shadow-sm ${
                            employer.is_verified
                                ? 'border-green-200 dark:border-green-700'
                                : 'border-amber-200 dark:border-amber-700'
                        }`}
                    >
                        <div className='flex items-start justify-between gap-3'>
                            <div className='flex items-start gap-3'>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                                    employer.is_verified
                                        ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300'
                                        : 'bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                                }`}>
                                    {employer.company_name?.charAt(0)}
                                </div>
                                <div>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <p className='text-sm font-semibold text-gray-800 dark:text-white'>
                                            {employer.company_name}
                                        </p>
                                        {employer.is_verified ? (
                                            <span className='text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full font-medium'>
                                                ✓ Verified
                                            </span>
                                        ) : (
                                            <span className='text-xs bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium'>
                                                ⏳ Pending Verification
                                            </span>
                                        )}
                                        {employer.is_premium && (
                                            <span className='text-xs bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full'>
                                                ⭐ Premium
                                            </span>
                                        )}
                                    </div>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        📧 {employer.email}
                                    </p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        📍 {employer.location || 'Nepal'}
                                        {employer.website && (
                                            <> · <a href={employer.website} target='_blank' rel='noreferrer' className='text-blue-500 hover:underline'>
                                                🌐 Website
                                            </a></>
                                        )}
                                    </p>
                                    <p className='text-xs text-gray-400 mt-0.5'>
                                        Joined: {new Date(employer.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {!employer.is_verified && (
                                <div className='flex flex-col gap-2 shrink-0'>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleVerifyEmployer(employer._id)}
                                        className='text-xs bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-sm'
                                    >
                                        ✓ Verify Company
                                    </motion.button>
                                    <button
                                        className='text-xs border border-red-200 dark:border-red-700 text-red-500 dark:text-red-300 px-5 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900 transition-colors'
                                    >
                                        ✕ Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
    </motion.div>
)}

                {/* Users Tab */}
                {/* Users Tab */}
{activeTab === 'users' && (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <div className='flex items-center justify-between mb-4'>
            <div>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                    User Management
                </h2>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                    Manage user roles and access
                </p>
            </div>
            <div className='flex gap-2 text-xs'>
                <span className='bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1.5 rounded-full font-medium'>
                    👥 {users.length} Total
                </span>
                <span className='bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1.5 rounded-full font-medium'>
                    🚫 {users.filter(u => u.is_banned).length} Banned
                </span>
            </div>
        </div>

        {loading ? <LoadingSpinner /> : (
            <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden'>
                {users.map((user, i) => (
                    <motion.div
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex items-center justify-between gap-3 p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 transition-colors ${
                            user.is_banned
                                ? 'bg-red-50 dark:bg-red-900/20'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        <div className='flex items-center gap-3'>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
                                user.is_banned
                                    ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
                                    : 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                            }`}>
                                {user.name?.charAt(0)}
                            </div>
                            <div>
                                <div className='flex items-center gap-2'>
                                    <p className='text-sm font-medium text-gray-800 dark:text-white'>
                                        {user.name}
                                    </p>
                                    {user.is_banned && (
                                        <span className='text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-full'>
                                            🚫 Banned
                                        </span>
                                    )}
                                </div>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    {user.email} · {user.location || 'No location'}
                                </p>
                                <p className='text-xs text-gray-400'>
                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center gap-2 shrink-0'>
                            {/* Role Change */}
                            <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                className='text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-700 dark:text-white outline-none'
                            >
                                <option value='jobseeker'>Job Seeker</option>
                                <option value='admin'>Admin</option>
                            </select>

                            {/* Ban/Unban */}
                            {user.is_banned ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleUnbanUser(user._id)}
                                    className='text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors font-medium'
                                >
                                    Unban
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleBanUser(user._id)}
                                    className='text-xs border border-red-200 dark:border-red-700 text-red-500 dark:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors'
                                >
                                    Ban
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
    </motion.div>
)}
            </div>
            {/* Analytics Tab */}
{activeTab === 'analytics' && (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='space-y-6'
    >
        {loading ? <LoadingSpinner /> : !analytics ? (
            <div className='text-center py-20'>
                <p className='text-gray-500'>Loading analytics...</p>
            </div>
        ) : (
            <>
                {/* Jobs by Category */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>
                            Jobs by Category
                        </h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                            Distribution across categories
                        </p>
                        <ResponsiveContainer width='100%' height={220}>
                            <BarChart data={analytics.jobsByCategory.map(j => ({ name: j._id, value: j.count }))}>
                                <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                                <XAxis dataKey='name' tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey='value' fill='#22c55e' radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Jobs by Type */}
                    <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>
                            Jobs by Type
                        </h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                            Full time, Part time, Remote etc.
                        </p>
                        <div className='flex items-center gap-4'>
                            <ResponsiveContainer width='55%' height={180}>
                                <PieChart>
                                    <Pie
                                        data={analytics.jobsByType.map(j => ({ name: j._id, value: j.count }))}
                                        cx='50%'
                                        cy='50%'
                                        innerRadius={45}
                                        outerRadius={75}
                                        dataKey='value'
                                    >
                                        {analytics.jobsByType.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className='space-y-2'>
                                {analytics.jobsByType.map((item, i) => (
                                    <div key={i} className='flex items-center gap-2'>
                                        <div className='w-2.5 h-2.5 rounded-full shrink-0' style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className='text-xs text-gray-600 dark:text-gray-300 capitalize'>{item._id}</span>
                                        <span className='text-xs font-bold text-gray-800 dark:text-white ml-auto'>{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications by Status + Jobs by Location */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>
                            Applications by Status
                        </h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                            Current status breakdown
                        </p>
                        <ResponsiveContainer width='100%' height={200}>
                            <BarChart data={analytics.applicationsByStatus.map(a => ({ name: a._id, value: a.count }))}>
                                <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                                <XAxis dataKey='name' tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey='value' radius={[6, 6, 0, 0]}>
                                    {analytics.applicationsByStatus.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Jobs by Location */}
                    <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>
                            Jobs by Location
                        </h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                            Top locations with most jobs
                        </p>
                        <div className='space-y-3'>
                            {analytics.jobsByLocation.map((loc, i) => (
                                <div key={i}>
                                    <div className='flex justify-between items-center mb-1'>
                                        <span className='text-xs text-gray-600 dark:text-gray-300'>{loc._id}</span>
                                        <span className='text-xs font-bold text-gray-800 dark:text-white'>{loc.count}</span>
                                    </div>
                                    <div className='w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2'>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(loc.count / analytics.jobsByLocation[0].count) * 100}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.1 }}
                                            className='h-2 rounded-full bg-green-500'
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Employers */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>
                        Top Employers
                    </h3>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                        Most active employers on platform
                    </p>
                    <div className='space-y-3'>
                        {analytics.topEmployers.map((emp, i) => (
                            <div key={i} className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl'>
                                <div className='w-8 h-8 rounded-xl bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-sm shrink-0'>
                                    {i + 1}
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm font-medium text-gray-800 dark:text-white'>
                                        {emp.employer.company_name}
                                    </p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        {emp.employer.location || 'Nepal'}
                                    </p>
                                </div>
                                <div className='flex gap-4 text-center'>
                                    <div>
                                        <p className='text-sm font-bold text-green-600'>{emp.jobCount}</p>
                                        <p className='text-xs text-gray-400'>Jobs</p>
                                    </div>
                                    <div>
                                        <p className='text-sm font-bold text-blue-600'>{emp.totalApplications}</p>
                                        <p className='text-xs text-gray-400'>Applications</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Growth */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>
                        User Growth
                    </h3>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                        New users registered per month
                    </p>
                    <ResponsiveContainer width='100%' height={200}>
                        <LineChart data={analytics.usersByMonth.map(u => ({
                            name: `${u._id.month}/${u._id.year}`,
                            users: u.count
                        }))}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                            <XAxis dataKey='name' tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line type='monotone' dataKey='users' stroke='#8b5cf6' strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </>
        )}
    </motion.div>
)}
{/* Reports Tab */}
{activeTab === 'reports' && (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <div className='flex items-center justify-between mb-4'>
            <div>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                    Report System
                </h2>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                    User reported jobs — review and take action
                </p>
            </div>
            <div className='flex gap-2 text-xs'>
                <span className='bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1.5 rounded-full font-medium'>
                    🚩 {reports.filter(r => r.status === 'pending').length} Pending
                </span>
                <span className='bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1.5 rounded-full font-medium'>
                    ✓ {reports.filter(r => r.status === 'resolved').length} Resolved
                </span>
            </div>
        </div>

        {loading ? <LoadingSpinner /> : reports.length === 0 ? (
            <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700'>
                <div className='text-5xl mb-3'>🎉</div>
                <p className='text-gray-500 dark:text-gray-400 font-medium'>No reports yet!</p>
                <p className='text-xs text-gray-400 mt-1'>Users have not reported any jobs</p>
            </div>
        ) : (
            <div className='space-y-3'>
                {reports.map((report, i) => (
                    <motion.div
                        key={report._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-white dark:bg-gray-800 border rounded-2xl p-5 shadow-sm ${
                            report.status === 'pending'
                                ? 'border-red-200 dark:border-red-700'
                                : report.status === 'resolved'
                                ? 'border-green-200 dark:border-green-700'
                                : 'border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        <div className='flex items-start justify-between gap-3 mb-3'>
                            <div className='flex items-start gap-3'>
                                <div className='w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900 flex items-center justify-center text-red-600 font-bold shrink-0'>
                                    🚩
                                </div>
                                <div>
                                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-0.5'>
                                        {report.job?.title || 'Job Deleted'}
                                    </h3>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        Reported by: {report.reportedBy?.name} · {report.reportedBy?.email}
                                    </p>
                                    <p className='text-xs text-gray-400 mt-0.5'>
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${
                                report.status === 'pending'
                                    ? 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300'
                                    : report.status === 'resolved'
                                    ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                            }`}>
                                {report.status === 'pending' ? '⏳ Pending' : report.status === 'resolved' ? '✓ Resolved' : 'Dismissed'}
                            </span>
                        </div>

                        <div className='flex gap-2 flex-wrap mb-3'>
                            <span className='text-xs bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-1 rounded-full font-medium'>
                                {report.reason?.replace('_', ' ').toUpperCase()}
                            </span>
                            {report.job?.location && (
                                <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full'>
                                    📍 {report.job.location}
                                </span>
                            )}
                        </div>

                        {report.description && (
                            <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-3'>
                                <p className='text-xs text-gray-600 dark:text-gray-300'>
                                    "{report.description}"
                                </p>
                            </div>
                        )}

                        {report.status === 'pending' && (
                            <div className='flex gap-2'>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleResolveReport(report._id)}
                                    className='flex-1 bg-green-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors'
                                >
                                    ✓ Resolve — Remove Job
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleDismissReport(report._id)}
                                    className='flex-1 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                                >
                                    Dismiss
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        )}
    </motion.div>
)}
        </div>
    )
}

export default AdminPanel