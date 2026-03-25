import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { setMyJobs, setApplications, removeJob } from '../employer.slice.js'
import useEmployer from '../hooks/useEmployer.js'
import useAuth from '../../auth/hooks/useAuth.js'
import Navbar from '../../../components/Navbar.jsx'

const statusColors = {
    applied: 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    seen: 'bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
    shortlisted: 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
    interview: 'bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
    hired: 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300',
    rejected: 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300',
}

const EmployerDashboard = () => {
    // All hooks inside component
    const dispatch = useDispatch()
    const { user } = useAuth()
    const { myJobs, applications } = useSelector(state => state.employer)
    const { fetchMyJobs, removeJobById, fetchJobApplications, updateStatus, loading } = useEmployer()

    const [activeTab, setActiveTab] = useState('jobs')
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

    // ... rest of JSX same rahega

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
                            {loading ? (
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
                                                        <p className='text-xs text-gray-400 mt-0.5'>
                                                            Applied: {new Date(app.createdAt).toLocaleDateString()}
                                                        </p>
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

                                            {/* Cover letter preview */}
                                            {app.cover_letter && (
                                                <div className='mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium'>Cover Letter:</p>
                                                    <p className='text-xs text-gray-600 dark:text-gray-300 line-clamp-2'>
                                                        {app.cover_letter}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Action buttons */}
                                            <div className='flex gap-2 mt-3'>
                                                <button
                                                    onClick={() => setSelectedApplicant(app)}
                                                    className='text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors'
                                                >
                                                    👤 View Full Profile
                                                </button>
                                                {app.cv_url && app.cv_url !== 'https://placeholder.com/cv.pdf' && (
                                                    
                                                    <a   href={app.cv_url}
                                                        target='_blank'
                                                        rel='noreferrer'
                                                        className='text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors'
                                                    >
                                                        📄 View CV
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Applicant Profile Modal */}
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
                                className='w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 overflow-y-auto max-h-[80vh]'
                                style={{ pointerEvents: 'auto' }}
                            >
                                {/* Modal Header */}
                                <div className='flex items-start justify-between mb-6'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-14 h-14 rounded-full bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-2xl'>
                                            {selectedApplicant.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                                                {selectedApplicant.user?.name}
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[selectedApplicant.status]}`}>
                                                {selectedApplicant.status}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedApplicant(null)}
                                        className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl'
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Applicant Info */}
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

                                {/* Cover Letter */}
                                {selectedApplicant.cover_letter && (
                                    <div className='mb-6'>
                                        <h4 className='text-sm font-medium text-gray-800 dark:text-white mb-2'>
                                            Cover Letter
                                        </h4>
                                        <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3'>
                                            <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                                                {selectedApplicant.cover_letter}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Status Update */}
                                <div className='mb-4'>
                                    <h4 className='text-sm font-medium text-gray-800 dark:text-white mb-2'>
                                        Update Status
                                    </h4>
                                    <select
                                        value={selectedApplicant.status}
                                        onChange={(e) => {
                                            handleStatusUpdate(selectedApplicant._id, e.target.value)
                                            setSelectedApplicant({ ...selectedApplicant, status: e.target.value })
                                        }}
                                        className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none bg-white dark:bg-gray-700 dark:text-white'
                                    >
                                        <option value='applied'>Applied</option>
                                        <option value='seen'>Seen</option>
                                        <option value='shortlisted'>Shortlisted</option>
                                        <option value='interview'>Interview</option>
                                        <option value='hired'>Hired</option>
                                        <option value='rejected'>Rejected</option>
                                    </select>
                                </div>

                                {/* Buttons */}
                                <div className='flex gap-3'>
                                    {selectedApplicant.cv_url && selectedApplicant.cv_url !== 'https://placeholder.com/cv.pdf' && (
                                        
                                         <a   href={selectedApplicant.cv_url}
                                            target='_blank'
                                            rel='noreferrer'
                                            className='flex-1 text-center text-sm bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors'
                                        >
                                            📄 Download CV
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setSelectedApplicant(null)}
                                        className='flex-1 text-center text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
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