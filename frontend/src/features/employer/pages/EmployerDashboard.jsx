import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { setMyJobs, setApplications, setLoading, removeJob } from '../employer.slice.js'
import { getMyJobs, deleteJob, getJobApplications, updateApplicationStatus } from '../services/employer.api.js'
import Navbar from '../../../components/Navbar.jsx'

const EmployerDashboard = () => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { myJobs, applications, isLoading } = useSelector(state => state.employer)
    const [activeTab, setActiveTab] = useState('jobs')
    const [selectedJob, setSelectedJob] = useState(null)
    const [deleting, setDeleting] = useState(null)

    useEffect(() => {
        loadJobs()
    }, [])

    const loadJobs = async () => {
        dispatch(setLoading(true))
        try {
            const data = await getMyJobs()
            dispatch(setMyJobs(data.jobs))
        } catch (err) {
            console.log(err)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleViewApplications = async (job) => {
        setSelectedJob(job)
        setActiveTab('applications')
        try {
            const data = await getJobApplications(job._id)
            dispatch(setApplications(data.applications))
        } catch (err) {
            console.log(err)
        }
    }

    const handleDeleteJob = async (id) => {
        setDeleting(id)
        try {
            await deleteJob(id)
            dispatch(removeJob(id))
        } catch (err) {
            console.log(err)
        } finally {
            setDeleting(null)
        }
    }

    const handleStatusUpdate = async (appId, status) => {
        try {
            await updateApplicationStatus(appId, status)
            const data = await getJobApplications(selectedJob._id)
            dispatch(setApplications(data.applications))
        } catch (err) {
            console.log(err)
        }
    }

    const statusColors = {
        applied: 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
        seen: 'bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
        shortlisted: 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
        interview: 'bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
        hired: 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300',
        rejected: 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300',
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='max-w-6xl mx-auto px-4 md:px-6 py-6'>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'
                >
                    <div>
                        <h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
                            Welcome, {user?.name || user?.company_name}!
                        </h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                            Manage your job listings and applications
                        </p>
                    </div>
                    <Link
                        to='/employer/post-job'
                        className='bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors text-center'
                    >
                        + Post New Job
                    </Link>
                </motion.div>

                {/* Stats */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
                    {[
                        { label: 'Total Jobs', value: myJobs.length, color: 'text-green-600' },
                        { label: 'Active Jobs', value: myJobs.filter(j => j.is_active).length, color: 'text-blue-600' },
                        { label: 'Total Applications', value: myJobs.reduce((a, j) => a + j.application_count, 0), color: 'text-purple-600' },
                        { label: 'Featured Jobs', value: myJobs.filter(j => j.is_featured).length, color: 'text-amber-600' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4'
                        >
                            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{stat.label}</p>
                            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className='flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit'>
                    {['jobs', 'applications'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 text-sm rounded-lg transition-all capitalize ${
                                activeTab === tab
                                    ? 'bg-white dark:bg-gray-700 text-green-600 font-medium shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Jobs Tab */}
                <AnimatePresence mode='wait'>
                    {activeTab === 'jobs' && (
                        <motion.div
                            key='jobs'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {isLoading ? (
                                <div className='text-center py-20'>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto'
                                    />
                                </div>
                            ) : myJobs.length === 0 ? (
                                <div className='text-center py-20'>
                                    <p className='text-gray-500 dark:text-gray-400 mb-4'>No jobs posted yet</p>
                                    <Link
                                        to='/employer/post-job'
                                        className='bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-green-700'
                                    >
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
                                            className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5'
                                        >
                                            <div className='flex items-start gap-3'>
                                                <div className='flex-1 min-w-0'>
                                                    <div className='flex items-start justify-between gap-2'>
                                                        <div>
                                                            <h3 className='text-sm font-medium text-gray-800 dark:text-white'>
                                                                {job.title}
                                                            </h3>
                                                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                                                {job.location} · {job.type} · {job.category}
                                                            </p>
                                                        </div>
                                                        <div className='flex items-center gap-2 shrink-0'>
                                                            {job.is_featured && (
                                                                <span className='text-xs bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-2 py-1 rounded-full'>
                                                                    Featured
                                                                </span>
                                                            )}
                                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                                job.is_active
                                                                    ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                                                            }`}>
                                                                {job.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className='flex gap-2 flex-wrap mt-2'>
                                                        <span className='text-xs bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full'>
                                                            Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                                                        </span>
                                                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                            {job.application_count} applications
                                                        </span>
                                                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    <div className='flex gap-2 mt-3'>
                                                        <button
                                                            onClick={() => handleViewApplications(job)}
                                                            className='text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors'
                                                        >
                                                            View Applications ({job.application_count})
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteJob(job._id)}
                                                            disabled={deleting === job._id}
                                                            className='text-xs bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition-colors disabled:opacity-50'
                                                        >
                                                            {deleting === job._id ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </div>
                                                </div>
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
                            key='applications'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {selectedJob && (
                                <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                                    Applications for: <span className='text-green-600 font-medium'>{selectedJob.title}</span>
                                </p>
                            )}

                            {applications.length === 0 ? (
                                <div className='text-center py-20 text-gray-500 dark:text-gray-400'>
                                    {selectedJob ? 'No applications yet' : 'Select a job to view applications'}
                                </div>
                            ) : (
                                <div className='space-y-3'>
                                    {applications.map((app, i) => (
                                        <motion.div
                                            key={app._id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5'
                                        >
                                            <div className='flex items-start justify-between gap-3'>
                                                <div className='flex items-start gap-3'>
                                                    <div className='w-10 h-10 rounded-full bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold shrink-0'>
                                                        {app.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className='text-sm font-medium text-gray-800 dark:text-white'>
                                                            {app.user?.name}
                                                        </p>
                                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                            {app.user?.email} · {app.user?.location}
                                                        </p>
                                                        {app.cover_letter && (
                                                            <p className='text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2'>
                                                                {app.cover_letter}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className='flex flex-col items-end gap-2'>
                                                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[app.status]}`}>
                                                        {app.status}
                                                    </span>
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                                        className='text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 dark:text-white outline-none'
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
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default EmployerDashboard