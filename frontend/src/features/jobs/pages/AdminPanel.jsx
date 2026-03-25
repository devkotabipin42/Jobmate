import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Navbar from '../../../components/Navbar.jsx'
import API_URL from '../../../config/api.js'

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('stats')
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
        { id: 'stats', label: 'Dashboard' },
        { id: 'pending', label: `Pending (${stats?.pendingJobs || 0})` },
        { id: 'all-jobs', label: 'All Jobs' },
        { id: 'employers', label: 'Employers' },
        { id: 'users', label: 'Users' },
    ]

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='max-w-6xl mx-auto px-4 md:px-6 py-6'>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-6'
                >
                    <h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
                        Admin Panel
                    </h1>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                        Manage jobs, employers and users
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className='flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 overflow-x-auto'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`px-4 py-2 text-sm rounded-lg transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-white dark:bg-gray-700 text-green-600 font-medium shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Stats Tab */}
                {activeTab === 'stats' && stats && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
                            {[
                                { label: 'Total Jobs', value: stats.totalJobs, color: 'text-blue-600' },
                                { label: 'Pending Verification', value: stats.pendingJobs, color: 'text-amber-600' },
                                { label: 'Verified Jobs', value: stats.verifiedJobs, color: 'text-green-600' },
                                { label: 'Total Users', value: stats.totalUsers, color: 'text-purple-600' },
                                { label: 'Total Employers', value: stats.totalEmployers, color: 'text-blue-600' },
                                { label: 'Total Applications', value: stats.totalApplications, color: 'text-green-600' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4'
                                >
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{stat.label}</p>
                                    <p className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6'>
                            <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-4'>
                                Quick Actions
                            </h3>
                            <div className='flex gap-3 flex-wrap'>
                                <button
                                    onClick={() => handleTabChange('pending')}
                                    className='text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors'
                                >
                                    Review Pending Jobs ({stats.pendingJobs})
                                </button>
                                <button
                                    onClick={() => handleTabChange('employers')}
                                    className='text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                                >
                                    Verify Employers
                                </button>
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
                        {loading ? (
                            <div className='text-center py-20'>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto'
                                />
                            </div>
                        ) : pendingJobs.length === 0 ? (
                            <div className='text-center py-20'>
                                <div className='text-4xl mb-3'>✅</div>
                                <p className='text-gray-500 dark:text-gray-400'>All jobs verified!</p>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {pendingJobs.map((job, i) => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className='bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-xl p-5'
                                    >
                                        <div className='flex items-start justify-between gap-3'>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <h3 className='text-sm font-medium text-gray-800 dark:text-white'>
                                                        {job.title}
                                                    </h3>
                                                    <span className='text-xs bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full'>
                                                        Pending
                                                    </span>
                                                </div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                    {job.employer?.company_name} · {job.location} · {job.type}
                                                </p>
                                                <div className='flex gap-2 flex-wrap mt-2'>
                                                    <span className='text-xs bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full'>
                                                        Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                                                    </span>
                                                    <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full'>
                                                        {job.category}
                                                    </span>
                                                    <span className='text-xs text-gray-400'>
                                                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className='text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2'>
                                                    {job.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className='flex gap-2 mt-4'>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleVerifyJob(job._id)}
                                                className='flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors'
                                            >
                                                ✓ Verify Job
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleRejectJob(job._id)}
                                                className='flex-1 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 py-2 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors'
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
                        {loading ? (
                            <div className='text-center py-20'>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto'
                                />
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {allJobs.map((job, i) => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4'
                                    >
                                        <div className='flex items-start justify-between gap-3'>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <h3 className='text-sm font-medium text-gray-800 dark:text-white'>
                                                        {job.title}
                                                    </h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                        job.is_verified
                                                            ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300'
                                                            : 'bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300'
                                                    }`}>
                                                        {job.is_verified ? 'Verified' : 'Pending'}
                                                    </span>
                                                    {!job.is_active && (
                                                        <span className='text-xs bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-full'>
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                    {job.employer?.company_name} · {job.location} · {job.type}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteJob(job._id)}
                                                className='text-xs bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors shrink-0'
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
                        {loading ? (
                            <div className='text-center py-20'>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto'
                                />
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {employers.map((employer, i) => (
                                    <motion.div
                                        key={employer._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4'
                                    >
                                        <div className='flex items-center justify-between gap-3'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold shrink-0'>
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
                                                        {employer.email} · {employer.location}
                                                    </p>
                                                </div>
                                            </div>
                                            {!employer.is_verified && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleVerifyEmployer(employer._id)}
                                                    className='text-xs bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shrink-0'
                                                >
                                                    Verify
                                                </motion.button>
                                            )}
                                        </div>
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
                        {loading ? (
                            <div className='text-center py-20'>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto'
                                />
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {users.map((user, i) => (
                                    <motion.div
                                        key={user._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 rounded-full bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold shrink-0'>
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div className='flex-1'>
                                                <p className='text-sm font-medium text-gray-800 dark:text-white'>
                                                    {user.name}
                                                </p>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                    {user.email} · {user.location || 'No location'}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                user.role === 'admin'
                                                    ? 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                            }`}>
                                                {user.role}
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