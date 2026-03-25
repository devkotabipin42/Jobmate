import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useJobseeker from '../hooks/useJobseeker.js'
import Navbar from '../../../components/Navbar.jsx'

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([])
    const { getSavedJobs, toggleSaveJob, loading } = useJobseeker()

    useEffect(() => {
        loadSavedJobs()
    }, [])

    const loadSavedJobs = async () => {
        const jobs = await getSavedJobs()
        setSavedJobs(jobs)
    }

    const handleRemove = async (jobId) => {
        await toggleSaveJob(jobId)
        setSavedJobs(prev => prev.filter(job => job._id !== jobId))
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='max-w-4xl mx-auto px-4 md:px-6 py-6'>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex items-center justify-between mb-6'
                >
                    <div>
                        <h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
                            Saved Jobs
                        </h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                            {savedJobs.length} jobs saved
                        </p>
                    </div>
                    <Link
                        to='/jobs'
                        className='text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
                    >
                        Browse more jobs
                    </Link>
                </motion.div>

                {/* Jobs */}
                {loading ? (
                    <div className='text-center py-20'>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto'
                        />
                    </div>
                ) : savedJobs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-center py-20'
                    >
                        <div className='text-5xl mb-4'>🔖</div>
                        <p className='text-gray-500 dark:text-gray-400 mb-4'>
                            No saved jobs yet
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
                        {savedJobs.map((job, i) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5'
                            >
                                <div className='flex items-start gap-3'>
                                    <div className='w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold shrink-0'>
                                        {job.employer?.company_name?.charAt(0) || 'C'}
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-start justify-between gap-2'>
                                            <div>
                                                <h3 className='text-sm font-medium text-gray-800 dark:text-white'>
                                                    {job.title}
                                                </h3>
                                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                                    {job.employer?.company_name} · {job.location}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(job._id)}
                                                className='text-xs text-red-500 hover:text-red-600 shrink-0'
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className='flex gap-2 flex-wrap mt-2'>
                                            <span className='text-xs bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium'>
                                                ✓ Verified
                                            </span>
                                            <span className='text-xs bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full'>
                                                Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                                            </span>
                                            <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full'>
                                                {job.type}
                                            </span>
                                        </div>

                                        <div className='flex gap-2 mt-3'>
                                            <Link
                                                to={`/jobs/${job._id}`}
                                                className='text-xs bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition-colors'
                                            >
                                                View & Apply
                                            </Link>
                                            <span className='text-xs text-gray-400 self-center'>
                                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
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

export default SavedJobs