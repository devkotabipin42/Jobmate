import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import useEmployer from '../hooks/useEmployer.js'
import useAuth from '../../auth/hooks/useAuth.js'
import { setMyJobs, setApplications, removeJob } from '../employer.slice.js'
import { setUser } from '../../auth/auth.slice.js'
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
    const { fetchMyJobs, removeJobById, fetchJobApplications, updateStatus, loading, uploadLogo } = useEmployer()
    const [logoPreview, setLogoPreview] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [selectedJob, setSelectedJob] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)

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

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setLogoPreview(URL.createObjectURL(file))
        setUploading(true)
        try {
            const data = await uploadLogo(file)
            dispatch(setUser({ ...user, logo_url: data.logo_url }))
        } catch (err) {
            setLogoPreview(null)
        } finally {
            setUploading(false)
        }
    }

    const totalApplications = myJobs.reduce((a, j) => a + j.application_count, 0)
    const activeJobs = myJobs.filter(j => j.is_active).length

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

    const sidebarItems = [
        { id: 'overview', label: 'Dashboard', icon: '▣' },
        { id: 'jobs', label: 'My Jobs', icon: '◈', count: myJobs.length },
        { id: 'applications', label: 'Applications', icon: '◎', count: totalApplications },
        { id: 'post-job', label: 'Post a Job', icon: '+', link: '/employer/post-job' },
        { id: 'company', label: 'Company Profile', icon: '◉', link: `/companies/${user?.id}` },
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

            <div className='flex'>
                {/* Sidebar — Desktop only */}
                <div className={`hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>

                    {/* Company Info */}
                    <div className='p-4 border-b border-gray-100 dark:border-gray-700'>
                        <div className='flex items-center gap-3'>
                            <div className='relative'>
                                <div className='w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900 flex items-center justify-center overflow-hidden'>
                                    {logoPreview || user?.logo_url ? (
                                        <img src={logoPreview || user?.logo_url} alt='Logo' className='w-full h-full object-cover' />
                                    ) : (
                                        <span className='text-green-700 dark:text-green-300 font-bold text-lg'>
                                            {user?.name?.charAt(0) || user?.company_name?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <label className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center cursor-pointer'>
                                    <input type='file' accept='image/*' onChange={handleLogoUpload} className='hidden' />
                                    <span className='text-white text-xs'>+</span>
                                </label>
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-semibold text-gray-800 dark:text-white truncate'>
                                    {user?.company_name || user?.name}
                                </p>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>Employer</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className='flex-1 p-3 space-y-1'>
                        {sidebarItems.map((item) => (
                            item.link ? (
                                <Link
                                    key={item.id}
                                    to={item.link}
                                    className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                                >
                                    <span className='text-base w-5 text-center'>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ) : (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                        activeTab === item.id
                                            ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className='text-base w-5 text-center'>{item.icon}</span>
                                    <span className='flex-1 text-left'>{item.label}</span>
                                    {item.count > 0 && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            activeTab === item.id
                                                ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                                        }`}>
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            )
                        ))}
                    </nav>

                    {/* Bottom Stats */}
                    <div className='p-4 border-t border-gray-100 dark:border-gray-700'>
                        <div className='grid grid-cols-3 gap-2 mb-4'>
                            {[
                                { label: 'Jobs', value: myJobs.length, color: 'text-green-600' },
                                { label: 'Apps', value: totalApplications, color: 'text-blue-600' },
                                { label: 'Active', value: activeJobs, color: 'text-purple-600' },
                            ].map((s, i) => (
                                <div key={i} className='text-center bg-gray-50 dark:bg-gray-700 rounded-xl py-2'>
                                    <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className='bg-green-50 dark:bg-green-900 rounded-xl p-3 text-center'>
                            <p className='text-xs font-medium text-green-800 dark:text-green-200 mb-1'>Need Support?</p>
                            <p className='text-xs text-green-600 dark:text-green-400'>hello@jobmate.com.np</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'} mb-16 md:mb-0`}>

                    {/* Top Bar */}
                    <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4 flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className='hidden md:block text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-lg'
                            >
                                {sidebarOpen ? '←' : '→'}
                            </button>
                            <div>
                                <h1 className='text-base md:text-lg font-semibold text-gray-800 dark:text-white'>
                                    {activeTab === 'overview' ? 'Dashboard' :
                                     activeTab === 'jobs' ? 'My Jobs' :
                                     activeTab === 'applications' ? 'Applications' : 'Dashboard'}
                                </h1>
                                <p className='text-xs text-gray-500 dark:text-gray-400 hidden md:block'>
                                    Welcome back, {user?.name || user?.company_name}
                                </p>
                            </div>
                        </div>
                        <Link
                            to='/employer/post-job'
                            className='bg-green-600 text-white px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-green-700 transition-colors'
                        >
                            + Post Job
                        </Link>
                    </div>

                    <div className='p-4 md:p-6'>

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='space-y-6'
                            >
                                {/* Stats Cards */}
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
                                    {[
                                        { label: 'Total Jobs', value: myJobs.length, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900' },
                                        { label: 'Applications', value: totalApplications, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900' },
                                        { label: 'Active Jobs', value: activeJobs, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900' },
                                        { label: 'Hired', value: applications.filter(a => a.status === 'hired').length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900' },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className='bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 border border-gray-100 dark:border-gray-700'
                                        >
                                            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                                                <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                                            </div>
                                            <p className='text-2xl font-bold text-gray-800 dark:text-white'>{stat.value}</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Charts */}
                                {barData.length > 0 && (
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                                        <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-700'>
                                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>
                                                Applications per Job
                                            </h3>
                                            <ResponsiveContainer width='100%' height={200}>
                                                <BarChart data={barData}>
                                                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                                                    <XAxis dataKey='name' tick={{ fontSize: 10 }} />
                                                    <YAxis tick={{ fontSize: 12 }} />
                                                    <Tooltip />
                                                    <Bar dataKey='applications' fill='#22c55e' radius={[6, 6, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {pieData.length > 0 && (
                                            <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-700'>
                                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>
                                                    Application Status
                                                </h3>
                                                <div className='flex items-center gap-4'>
                                                    <ResponsiveContainer width='55%' height={180}>
                                                        <PieChart>
                                                            <Pie data={pieData} cx='50%' cy='50%' innerRadius={45} outerRadius={75} dataKey='value'>
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
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Recent Jobs */}
                                <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700'>
                                    <div className='flex items-center justify-between p-4 md:p-5 border-b border-gray-100 dark:border-gray-700'>
                                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>Recent Jobs</h3>
                                        <button onClick={() => setActiveTab('jobs')} className='text-xs text-green-600 hover:underline'>
                                            View all
                                        </button>
                                    </div>
                                    {myJobs.slice(0, 3).map((job) => (
                                        <div key={job._id} className='flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-700 last:border-0'>
                                            <div>
                                                <p className='text-sm font-medium text-gray-800 dark:text-white'>{job.title}</p>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>{job.location} · {job.type}</p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-xs text-gray-500 hidden md:block'>
                                                    {job.application_count} apps
                                                </span>
                                                <button
                                                    onClick={() => handleViewApplications(job)}
                                                    className='text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors'
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    ))}
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
                                                className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 md:p-5'
                                            >
                                                <div className='flex items-start justify-between gap-3'>
                                                    <div className='flex-1'>
                                                        <div className='flex items-center gap-2 mb-1 flex-wrap'>
                                                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>
                                                                {job.title}
                                                            </h3>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${job.is_active ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                                                                {job.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                            {job.is_verified && (
                                                                <span className='text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full'>
                                                                    Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                            {job.location} · {job.type} · {job.category}
                                                        </p>
                                                        <div className='flex gap-2 flex-wrap mt-2'>
                                                            <span className='text-xs bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full'>
                                                                Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                                                            </span>
                                                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                                {job.application_count} applications
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex gap-2 mt-4 flex-wrap'>
                                                    <button
                                                        onClick={() => handleViewApplications(job)}
                                                        className='flex-1 text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 py-2.5 rounded-xl hover:bg-green-100 transition-colors font-medium'
                                                    >
                                                        Applications ({job.application_count})
                                                    </button>
                                                    <Link
                                                        to={`/employer/edit-job/${job._id}`}
                                                        className='text-xs border border-green-200 dark:border-green-700 text-green-600 dark:text-green-300 px-4 py-2.5 rounded-xl hover:bg-green-50 transition-colors'
                                                    >
                                                        Edit
                                                    </Link>
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
                                {!selectedJob ? (
                                    <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700'>
                                        <p className='text-gray-500 dark:text-gray-400 mb-4'>
                                            Select a job from My Jobs to view applications
                                        </p>
                                        <button
                                            onClick={() => setActiveTab('jobs')}
                                            className='bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm hover:bg-green-700'
                                        >
                                            Go to My Jobs
                                        </button>
                                    </div>
                                ) : (
                                    <div className='space-y-3'>
                                        <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-4'>
                                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>
                                                Applications for: {selectedJob.title}
                                            </h3>
                                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                                {applications.length} total applicants
                                            </p>
                                        </div>

                                        {applications.length === 0 ? (
                                            <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700'>
                                                <p className='text-gray-500 dark:text-gray-400'>No applications yet</p>
                                            </div>
                                        ) : (
                                            applications.map((app, i) => (
                                                <motion.div
                                                    key={app._id}
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 md:p-5'
                                                >
                                                    <div className='flex items-start justify-between gap-3 mb-3'>
                                                        <div className='flex items-center gap-3'>
                                                            <div className='w-10 h-10 rounded-full bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold shrink-0'>
                                                                {app.user?.name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className='text-sm font-semibold text-gray-800 dark:text-white'>
                                                                    {app.user?.name}
                                                                </p>
                                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                                    {app.user?.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${statusColors[app.status] || statusColors.applied}`}>
                                                            {app.status}
                                                        </span>
                                                    </div>

                                                    {app.cover_letter && (
                                                        <div className='bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-3'>
                                                            <p className='text-xs text-gray-600 dark:text-gray-300 line-clamp-2'>
                                                                {app.cover_letter}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {app.cv_url && (
                                                        <a href={app.cv_url} target='_blank' rel='noreferrer'
                                                            className='text-xs text-green-600 hover:underline block mb-3'>
                                                            View CV
                                                        </a>
                                                    )}

                                                    <div className='flex gap-2 flex-wrap'>
                                                        {['applied', 'seen', 'shortlisted', 'interview', 'hired', 'rejected'].map(status => (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleStatusUpdate(app._id, status)}
                                                                className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
                                                                    app.status === status
                                                                        ? 'bg-green-600 text-white'
                                                                        : 'border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                                }`}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50'>
                <div className='flex items-center justify-around px-2 py-2'>
                    {[
                        { id: 'overview', label: 'Dashboard', icon: '▣' },
                        { id: 'jobs', label: 'Jobs', icon: '◈', count: myJobs.length },
                        { id: 'applications', label: 'Apps', icon: '◎', count: totalApplications },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors relative ${
                                activeTab === item.id
                                    ? 'text-green-600'
                                    : 'text-gray-400 dark:text-gray-500'
                            }`}
                        >
                            <span className='text-xl'>{item.icon}</span>
                            <span className='text-xs font-medium'>{item.label}</span>
                            {item.count > 0 && (
                                <span className='absolute -top-0.5 right-1 w-4 h-4 bg-green-600 text-white text-xs rounded-full flex items-center justify-center'>
                                    {item.count}
                                </span>
                            )}
                        </button>
                    ))}
                    <Link
                        to='/employer/post-job'
                        className='flex flex-col items-center gap-1 px-4 py-1.5 text-gray-400 dark:text-gray-500'
                    >
                        <span className='text-xl'>+</span>
                        <span className='text-xs font-medium'>Post Job</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default EmployerDashboard