import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import useEmployer from '../hooks/useEmployer.js'
import useAuth from '../../auth/hooks/useAuth.js'
import { setMyJobs, setApplications, removeJob } from '../employer.slice.js'
import Navbar from '../../../components/Navbar.jsx'

const statusColors = {
    applied: 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    seen: 'bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
    shortlisted: 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
    interview: 'bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
    hired: 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300',
    rejected: 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300',
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const EmployerDashboard = () => {
    const dispatch = useDispatch()
    const { user } = useAuth()
    const { myJobs, applications } = useSelector(state => state.employer)
    const { fetchMyJobs, removeJobById, fetchJobApplications, updateStatus, loading } = useEmployer()

    const [activeTab, setActiveTab] = useState('overview')
    const [selectedJob, setSelectedJob] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [selectedApplicant, setSelectedApplicant] = useState(null)

    useEffect(() => {
        loadJobs()
    }, [])

    const loadJobs = async () => {
        const jobs = await fetchMyJobs()
        dispatch(setMyJobs(jobs))
    }

    const handleViewApplications = async (job) => {
        setSelectedJob(job)
        setActiveTab('applications')
        const apps = await fetchJobApplications(job._id)
        dispatch(setApplications(apps))
    }

    const handleDeleteJob = async (id) => {
        setDeleting(id)
        await removeJobById(id)
        dispatch(removeJob(id))
        setDeleting(null)
    }

    const handleStatusUpdate = async (appId, status) => {
        await updateStatus(appId, status)
        const apps = await fetchJobApplications(selectedJob._id)
        dispatch(setApplications(apps))
    }

    const totalApplications = myJobs.reduce((a, j) => a + j.application_count, 0)
    const activeJobs = myJobs.filter(j => j.is_active).length
    const featuredJobs = myJobs.filter(j => j.is_featured).length

    const barData = myJobs.slice(0, 6).map(job => ({
        name: job.title.length > 12 ? job.title.substring(0, 12) + '...' : job.title,
        applications: job.application_count
    }))

    const pieData = [
        { name: 'Applied', value: applications.filter(a => a.status === 'applied').length },
        { name: 'Seen', value: applications.filter(a => a.status === 'seen').length },
        { name: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length },
        { name: 'Interview', value: applications.filter(a => a.status === 'interview').length },
        { name: 'Hired', value: applications.filter(a => a.status === 'hired').length },
        { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length },
    ].filter(d => d.value > 0)

    const tabs = [
        { id: 'overview', label: '📊 Overview' },
        { id: 'jobs', label: `💼 My Jobs (${myJobs.length})` },
        { id: 'applications', label: `📋 Applications (${totalApplications})` },
    ]

    const LoadingSpinner = () => (
        <div className='text-center py-20'>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto'
            />
        </div>
    )

    return (
        <div className='min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors'>
            <Navbar />

            {/* Header */}
            <div className='bg-gradient-to-r from-green-600 to-green-800 px-6 py-8'>
                <div className='max-w-7xl mx-auto'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <div>
                            <span className='text-xs bg-white/20 text-white px-3 py-1 rounded-full mb-2 inline-block font-medium'>
                                🏢 Employer Dashboard
                            </span>
                            <h1 className='text-3xl font-bold text-white'>
                                Welcome, {user?.name || user?.company_name}!
                            </h1>
                            <p className='text-green-200 text-sm mt-1'>
                                Manage your job listings and track applications
                            </p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center gap-4 bg-white/10 rounded-2xl px-6 py-3'>
                                <div className='text-center'>
                                    <p className='text-2xl font-bold text-white'>{myJobs.length}</p>
                                    <p className='text-xs text-green-200'>Jobs</p>
                                </div>
                                <div className='w-px h-10 bg-white/20' />
                                <div className='text-center'>
                                    <p className='text-2xl font-bold text-white'>{totalApplications}</p>
                                    <p className='text-xs text-green-200'>Applications</p>
                                </div>
                                <div className='w-px h-10 bg-white/20' />
                                <div className='text-center'>
                                    <p className='text-2xl font-bold text-white'>{activeJobs}</p>
                                    <p className='text-xs text-green-200'>Active</p>
                                </div>
                            </div>
                            <Link
                                to='/employer/post-job'
                                className='bg-white text-green-700 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors shadow-sm'
                            >
                                + Post New Job
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 md:px-6 py-6'>

                {/* Tabs */}
                <div className='flex gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-1.5 mb-6 overflow-x-auto shadow-sm'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 text-sm rounded-xl transition-all whitespace-nowrap font-medium ${
                                activeTab === tab.id
                                    ? 'bg-green-600 text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='space-y-6'
                    >
                        {/* Stats Cards */}
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                            {[
                                { label: 'Total Jobs', value: myJobs.length, color: 'text-green-600', bg: 'bg-green-500', icon: '💼', sub: 'Posted' },
                                { label: 'Active Jobs', value: activeJobs, color: 'text-blue-600', bg: 'bg-blue-500', icon: '✅', sub: 'Live now' },
                                { label: 'Applications', value: totalApplications, color: 'text-purple-600', bg: 'bg-purple-500', icon: '📋', sub: 'Total received' },
                                { label: 'Featured', value: featuredJobs, color: 'text-amber-600', bg: 'bg-amber-500', icon: '⭐', sub: 'Boosted jobs' },
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
                                    </div>
                                    <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                                    <p className='text-xs font-medium text-gray-800 dark:text-white'>{stat.label}</p>
                                    <p className='text-xs text-gray-400 mt-0.5'>{stat.sub}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                            {/* Applications per job */}
                            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>
                                    Applications per Job
                                </h3>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                                    How many candidates applied to each job
                                </p>
                                {barData.length > 0 ? (
                                    <ResponsiveContainer width='100%' height={200}>
                                        <BarChart data={barData}>
                                            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                                            <XAxis dataKey='name' tick={{ fontSize: 10 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Bar dataKey='applications' fill='#22c55e' radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className='h-48 flex items-center justify-center text-gray-400 text-sm'>
                                        No data yet — post jobs first!
                                    </div>
                                )}
                            </div>

                            {/* Application Status Pie */}
                            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700'>
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>
                                    Application Status
                                </h3>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                                    Current status of all applications
                                </p>
                                {pieData.length > 0 ? (
                                    <div className='flex items-center gap-4'>
                                        <ResponsiveContainer width='55%' height={180}>
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx='50%'
                                                    cy='50%'
                                                    innerRadius={45}
                                                    outerRadius={75}
                                                    dataKey='value'
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className='space-y-2'>
                                            {pieData.map((item, i) => (
                                                <div key={i} className='flex items-center gap-2'>
                                                    <div className='w-2.5 h-2.5 rounded-full shrink-0' style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                    <span className='text-xs text-gray-600 dark:text-gray-300'>{item.name}</span>
                                                    <span className='text-xs font-bold text-gray-800 dark:text-white ml-auto'>{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className='h-48 flex items-center justify-center text-gray-400 text-sm'>
                                        No applications yet!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Jobs */}
                        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
                            <div className='flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700'>
                                <div>
                                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>
                                        Your Job Listings
                                    </h3>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                        Click "View Applications" to see candidates
                                    </p>
                                </div>
                                <Link
                                    to='/employer/post-job'
                                    className='text-xs bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors font-medium'
                                >
                                    + New Job
                                </Link>
                            </div>
                            {myJobs.length === 0 ? (
                                <div className='text-center py-10 px-6'>
                                    <div className='text-4xl mb-3'>💼</div>
                                    <p className='text-gray-500 dark:text-gray-400 mb-3 text-sm'>No jobs posted yet</p>
                                    <Link
                                        to='/employer/post-job'
                                        className='text-sm bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700'
                                    >
                                        Post your first job
                                    </Link>
                                </div>
                            ) : (
                                myJobs.slice(0, 5).map((job, i) => (
                                    <div
                                        key={job._id}
                                        className='flex items-center justify-between gap-3 px-6 py-4 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-sm shrink-0'>
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className='text-sm font-medium text-gray-800 dark:text-white'>
                                                    {job.title}
                                                </p>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                    {job.location} · {job.type} · Deadline: {new Date(job.deadline).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3 shrink-0'>
                                            <div className='text-center'>
                                                <p className='text-sm font-bold text-gray-800 dark:text-white'>{job.application_count}</p>
                                                <p className='text-xs text-gray-400'>Applied</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                job.is_verified
                                                    ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300'
                                                    : 'bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300'
                                            }`}>
                                                {job.is_verified ? '✓' : '⏳'}
                                            </span>
                                            <button
                                                onClick={() => handleViewApplications(job)}
                                                className='text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors'
                                            >
                                                View →
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Jobs Tab */}
                {activeTab === 'jobs' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {loading ? <LoadingSpinner /> : myJobs.length === 0 ? (
                            <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700'>
                                <div className='text-4xl mb-3'>💼</div>
                                <p className='text-gray-500 dark:text-gray-400 mb-4'>No jobs posted yet</p>
                                <Link to='/employer/post-job' className='bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm hover:bg-green-700'>
                                    Post your first job
                                </Link>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {myJobs.map((job, i) => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm'
                                    >
                                        <div className='flex items-start justify-between gap-3'>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>
                                                        {job.title}
                                                    </h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                        job.is_active
                                                            ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                                                    }`}>
                                                        {job.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                    {job.is_featured && (
                                                        <span className='text-xs bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full'>
                                                            ⭐ Featured
                                                        </span>
                                                    )}
                                                    {job.is_verified && (
                                                        <span className='text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full'>
                                                            ✓ Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                    📍 {job.location} · {job.type} · {job.category}
                                                </p>
                                                <div className='flex gap-2 flex-wrap mt-2'>
                                                    <span className='text-xs bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full'>
                                                        💰 Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                                                    </span>
                                                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                        👥 {job.application_count} applications
                                                    </span>
                                                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                        📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-2 mt-4'>
                                            <button
                                                onClick={() => handleViewApplications(job)}
                                                className='flex-1 text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 py-2.5 rounded-xl hover:bg-green-100 transition-colors font-medium'
                                            >
                                                👥 View Applications ({job.application_count})
                                            </button>
                                            <button
                                                onClick={() => handleDeleteJob(job._id)}
                                                disabled={deleting === job._id}
                                                className='text-xs border border-red-200 dark:border-red-700 text-red-500 dark:text-red-300 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900 transition-colors disabled:opacity-50'
                                            >
                                                {deleting === job._id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {selectedJob && (
                            <div className='flex items-center gap-2 mb-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm'>
                                <span className='text-xs text-gray-500 dark:text-gray-400'>Applications for:</span>
                                <span className='text-sm font-semibold text-green-600'>{selectedJob.title}</span>
                                <span className='text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full ml-auto'>
                                    {applications.length} total
                                </span>
                            </div>
                        )}

                        {applications.length === 0 ? (
                            <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700'>
                                <div className='text-4xl mb-3'>📋</div>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    {selectedJob ? 'No applications yet' : 'Select a job from My Jobs tab to view applications'}
                                </p>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {applications.map((app, i) => (
                                    <motion.div
                                        key={app._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm'
                                    >
                                        <div className='flex items-start justify-between gap-3'>
                                            <div className='flex items-start gap-3'>
                                                <div className='w-11 h-11 rounded-full bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-lg shrink-0'>
                                                    {app.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>
                                                        {app.user?.name}
                                                    </p>
                                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                        📧 {app.user?.email} · 📍 {app.user?.location}
                                                    </p>
                                                    <p className='text-xs text-gray-400 mt-0.5'>
                                                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='flex flex-col items-end gap-2'>
                                                <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${statusColors[app.status]}`}>
                                                    {app.status}
                                                </span>
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                                    className='text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-700 dark:text-white outline-none'
                                                >
                                                    <option value='applied'>Applied</option>
                                                    <option value='seen'>Seen</option>
                                                    <option value='shortlisted'>Shortlisted</option>
                                                    <option value='interview'>Interview</option>
                                                    <option value='hired'>Hired</option>
                                                    <option value='rejected'>Rejected</option>
                                                </select>
                                            </div>
                                        </div>

                                        {app.cover_letter && (
                                            <div className='mt-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-3'>
                                                <p className='text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>Cover Letter:</p>
                                                <p className='text-xs text-gray-600 dark:text-gray-300 line-clamp-2'>
                                                    {app.cover_letter}
                                                </p>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setSelectedApplicant(app)}
                                            className='mt-3 text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-4 py-2 rounded-xl hover:bg-green-100 transition-colors font-medium'
                                        >
                                            👤 View Full Profile
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Applicant Modal */}
            <AnimatePresence>
                {selectedApplicant && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedApplicant(null)}
                            className='fixed inset-0 bg-black/50 z-40'
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className='fixed inset-0 flex items-center justify-center z-50 px-4'
                            style={{ pointerEvents: 'none' }}
                        >
                            <div
                                className='w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl'
                                style={{ pointerEvents: 'auto' }}
                            >
                                {/* Modal Header */}
                                <div className='bg-gradient-to-r from-green-600 to-green-700 p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl'>
                                                {selectedApplicant.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className='text-lg font-bold text-white'>
                                                    {selectedApplicant.user?.name}
                                                </h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full bg-white/20 text-white capitalize`}>
                                                    {selectedApplicant.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedApplicant(null)}
                                            className='text-white/80 hover:text-white text-xl'
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div className='p-6 overflow-y-auto max-h-96'>
                                    <div className='space-y-3 mb-6'>
                                        {[
                                            { label: '📧 Email', value: selectedApplicant.user?.email },
                                            { label: '📱 Phone', value: selectedApplicant.user?.phone || 'Not provided' },
                                            { label: '📍 Location', value: selectedApplicant.user?.location || 'Not provided' },
                                            { label: '📅 Applied', value: new Date(selectedApplicant.createdAt).toLocaleDateString() },
                                        ].map((item, i) => (
                                            <div key={i} className='flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700'>
                                                <span className='text-xs text-gray-500 dark:text-gray-400'>{item.label}</span>
                                                <span className='text-xs font-medium text-gray-800 dark:text-white'>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedApplicant.cover_letter && (
                                        <div className='mb-6'>
                                            <h4 className='text-sm font-semibold text-gray-800 dark:text-white mb-2'>Cover Letter</h4>
                                            <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-3'>
                                                <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                                                    {selectedApplicant.cover_letter}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className='mb-4'>
                                        <h4 className='text-sm font-semibold text-gray-800 dark:text-white mb-2'>Update Status</h4>
                                        <select
                                            value={selectedApplicant.status}
                                            onChange={(e) => {
                                                handleStatusUpdate(selectedApplicant._id, e.target.value)
                                                setSelectedApplicant({ ...selectedApplicant, status: e.target.value })
                                            }}
                                            className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none bg-white dark:bg-gray-700 dark:text-white'
                                        >
                                            <option value='applied'>Applied</option>
                                            <option value='seen'>Seen</option>
                                            <option value='shortlisted'>Shortlisted</option>
                                            <option value='interview'>Interview</option>
                                            <option value='hired'>Hired</option>
                                            <option value='rejected'>Rejected</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => setSelectedApplicant(null)}
                                        className='w-full text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default EmployerDashboard