import { motion } from 'framer-motion'

const LoadingSpinner = () => (
    <div className='flex items-center justify-center py-20'>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full' />
    </div>
)

export const AdminPendingJobs = ({ pendingJobs, loading, handleVerifyJob, handleRejectJob }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Pending Jobs</h2>
                <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>{pendingJobs.length} jobs waiting for review</p>
            </div>
            <span className='text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-full font-medium'>
                {pendingJobs.length} Pending
            </span>
        </div>

        {loading ? <LoadingSpinner /> : pendingJobs.length === 0 ? (
            <div className='text-center py-20 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                <div className='w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                    <svg className='w-7 h-7 text-green-500' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                        <polyline points='20 6 9 17 4 12'/>
                    </svg>
                </div>
                <p className='text-gray-800 dark:text-white font-semibold'>All jobs verified!</p>
                <p className='text-sm text-gray-400 dark:text-white/30 mt-1'>Nothing pending review</p>
            </div>
        ) : (
            <div className='space-y-3'>
                {pendingJobs.map((job, i) => (
                    <motion.div key={job._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className='bg-white dark:bg-white/3 border-l-4 border-l-amber-500 border border-gray-100 dark:border-white/7 rounded-2xl p-5'>
                        <div className='flex items-start justify-between gap-3 mb-3'>
                            <div className='flex items-start gap-3'>
                                <div className='w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold shrink-0'>
                                    {job.employer?.company_name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-0.5'>{job.title}</h3>
                                    <p className='text-xs text-gray-500 dark:text-white/35'>{job.employer?.company_name} · {job.location} · {job.type}</p>
                                </div>
                            </div>
                            <span className='text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full font-medium shrink-0'>Pending</span>
                        </div>

                        <div className='flex gap-2 flex-wrap mb-3'>
                            <span className='text-xs bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-1 rounded-full'>
                                Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                            </span>
                            <span className='text-xs bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/40 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full'>
                                {job.category}
                            </span>
                        </div>

                        <p className='text-xs text-gray-600 dark:text-white/40 mb-4 bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 p-3 rounded-xl line-clamp-2'>
                            {job.description}
                        </p>

                        <div className='flex gap-2'>
                            <button onClick={() => handleVerifyJob(job._id)}
                                className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-xs font-semibold transition-colors'>
                                Verify Job
                            </button>
                            <button onClick={() => handleRejectJob(job._id)}
                                className='flex-1 border border-red-200 dark:border-red-500/20 text-red-500 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors'>
                                Reject
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
    </motion.div>
)

export const AdminAllJobs = ({ allJobs, loading, handleDeleteJob, toggleFeaturedJob, setAllJobs }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>All Jobs</h2>
                <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>{allJobs.length} total jobs on platform</p>
            </div>
        </div>

        {loading ? <LoadingSpinner /> : (
            <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl overflow-hidden'>
                {allJobs.map((job, i) => (
                    <div key={job._id}
                        className='flex items-center justify-between gap-3 p-4 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors'>
                        <div className='flex items-center gap-3 min-w-0'>
                            <div className='w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-bold text-sm shrink-0'>
                                {job.employer?.company_name?.charAt(0)}
                            </div>
                            <div className='min-w-0'>
                                <p className='text-sm font-medium text-gray-800 dark:text-white truncate'>{job.title}</p>
                                <p className='text-xs text-gray-500 dark:text-white/35 truncate'>{job.employer?.company_name} · {job.location}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2 shrink-0'>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                job.is_verified
                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                                {job.is_verified ? 'Verified' : 'Pending'}
                            </span>
                            <button onClick={async () => {
                                await toggleFeaturedJob(job._id)
                                setAllJobs(prev => prev.map(j => j._id === job._id ? { ...j, is_featured: !j.is_featured } : j))
                            }}
                                className={`text-xs px-3 py-1.5 rounded-lg transition-colors border ${
                                    job.is_featured
                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        : 'text-gray-500 dark:text-white/35 border-gray-200 dark:border-white/8 hover:bg-amber-500/5 hover:text-amber-500'
                                }`}>
                                {job.is_featured ? '★ Featured' : 'Set Featured'}
                            </button>
                            <button onClick={() => handleDeleteJob(job._id)}
                                className='text-xs text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-500/5 transition-colors border border-red-200 dark:border-red-500/20'>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </motion.div>
)