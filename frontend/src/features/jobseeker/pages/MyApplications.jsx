import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import useJobseeker from '../../jobseeker/hooks/useJobseeker.js'
import Navbar from '../../../components/Navbar.jsx'
import { createSlice } from '@reduxjs/toolkit'
import API_URL from '../../../config/api.js'

// Simple local state use karenge
import { useState } from 'react'

const statusColors = {
    applied: 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    seen: 'bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
    shortlisted: 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
    interview: 'bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
    hired: 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300',
    rejected: 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300',
}

const statusIcons = {
    applied: '📨',
    seen: '👀',
    shortlisted: '⭐',
    interview: '🗓',
    hired: '🎉',
    rejected: '❌',
}

const MyApplications = () => {
    const [applications, setApplications] = useState([])
    const { getMyApplications, loading } = useJobseeker()
    useEffect(() => {
        loadApplications()
    }, [])

    const loadApplications = async () => {
    const data = await getMyApplications()
    setApplications(data)
}

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='max-w-4xl mx-auto px-4 md:px-6 py-6'>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-6'
                >
                    <h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
                        My Applications
                    </h1>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                        Track all your job applications
                    </p>
                </motion.div>

                {/* Stats */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
                    {[
                        { label: 'Total', value: applications.length, color: 'text-gray-800 dark:text-white' },
                        { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, color: 'text-purple-600' },
                        { label: 'Interview', value: applications.filter(a => a.status === 'interview').length, color: 'text-orange-600' },
                        { label: 'Hired', value: applications.filter(a => a.status === 'hired').length, color: 'text-green-600' },
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

                {/* Applications */}
                {loading ? (
                    <div className='text-center py-20'>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto'
                        />
                    </div>
                ) : applications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-center py-20'
                    >
                        <p className='text-gray-500 dark:text-gray-400 mb-4'>
                            No applications yet
                        </p>
                        <Link
                            to='/jobs'
                            className='bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-green-700'
                        >
                            Browse jobs
                        </Link>
                    </motion.div>
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
                                <div className='flex items-start gap-3'>
                                    {/* Company logo */}
                                    <div className='w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold shrink-0'>
                                        {app.job?.title?.charAt(0) || 'J'}
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-start justify-between gap-2'>
                                            <div>
                                                <h3 className='text-sm font-medium text-gray-800 dark:text-white'>
                                                    {app.job?.title}
                                                </h3>
                                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                                    {app.job?.location} · {app.job?.type}
                                                </p>
                                            </div>

                                            {/* Status badge */}
                                            <span className={`text-xs px-2 py-1 rounded-full capitalize shrink-0 flex items-center gap-1 ${statusColors[app.status]}`}>
                                                <span>{statusIcons[app.status]}</span>
                                                {app.status}
                                            </span>
                                        </div>

                                        {/* Salary */}
                                        <div className='flex gap-2 flex-wrap mt-2'>
                                            <span className='text-xs bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full'>
                                                Rs. {app.job?.salary_min?.toLocaleString()} – {app.job?.salary_max?.toLocaleString()}
                                            </span>
                                            <span className='text-xs text-gray-400 dark:text-gray-500'>
                                                Applied: {new Date(app.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Status timeline */}
                                        <div className='mt-3 flex items-center gap-1 overflow-x-auto pb-1'>
                                            {['applied', 'seen', 'shortlisted', 'interview', 'hired'].map((s, idx) => {
                                                const statuses = ['applied', 'seen', 'shortlisted', 'interview', 'hired']
                                                const currentIdx = statuses.indexOf(app.status)
                                                const isDone = idx <= currentIdx && app.status !== 'rejected'
                                                const isCurrent = s === app.status

                                                return (
                                                    <div key={s} className='flex items-center'>
                                                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                                                            isCurrent ? 'bg-green-500 ring-2 ring-green-200 dark:ring-green-800' :
                                                            isDone ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-600'
                                                        }`} />
                                                        <span className={`text-xs mx-1 whitespace-nowrap ${
                                                            isCurrent ? 'text-green-600 dark:text-green-400 font-medium' :
                                                            isDone ? 'text-green-500' : 'text-gray-400'
                                                        }`}>
                                                            {s}
                                                        </span>
                                                        {idx < 4 && (
                                                            <div className={`w-4 h-px ${isDone && idx < currentIdx ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Rejected message */}
                                        {app.status === 'rejected' && (
                                            <p className='text-xs text-red-500 mt-2'>
                                                ❌ Application was not selected this time
                                            </p>
                                        )}

                                        {/* Hired message */}
                                        {app.status === 'hired' && (
                                            <p className='text-xs text-green-600 dark:text-green-400 font-medium mt-2'>
                                                🎉 Congratulations! You got the job!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyApplications