import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useJobseeker from '../../jobseeker/hooks/useJobseeker.js'
import Navbar from '../../../components/Navbar.jsx'

const statusConfig = {
    applied:     { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',     dot: 'bg-blue-500',     icon: '📨', label: 'Applied' },
    seen:        { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',   dot: 'bg-amber-500',    icon: '👀', label: 'Seen' },
    shortlisted: { color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',dot: 'bg-purple-500',   icon: '⭐', label: 'Shortlisted' },
    interview:   { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',dot: 'bg-orange-500',   icon: '🗓', label: 'Interview' },
    hired:       { color: 'bg-green-500/10 text-green-500 border-green-500/20',   dot: 'bg-green-500',    icon: '🎉', label: 'Hired' },
    rejected:    { color: 'bg-red-500/10 text-red-500 border-red-500/20',         dot: 'bg-red-500',      icon: '❌', label: 'Rejected' },
}

const PIPELINE = ['applied', 'seen', 'shortlisted', 'interview', 'hired']

const MyApplications = () => {
    const [applications, setApplications] = useState([])
    const [filter, setFilter] = useState('all')
    const { getMyApplications, loading } = useJobseeker()

    useEffect(() => { loadApplications() }, [])

    const loadApplications = async () => {
        const data = await getMyApplications()
        setApplications(data || [])
    }

    const filtered = filter === 'all'
        ? applications
        : applications.filter(a => a.status === filter)

    const stats = [
        { label: 'Total', value: applications.length, color: 'text-white' },
        { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, color: 'text-purple-400' },
        { label: 'Interview', value: applications.filter(a => a.status === 'interview').length, color: 'text-orange-400' },
        { label: 'Hired', value: applications.filter(a => a.status === 'hired').length, color: 'text-green-400' },
    ]

    return (
        <div className='min-h-screen bg-white dark:bg-[#08111f] transition-colors duration-300'>

            {/* Grid bg */}
            <div className='fixed inset-0 opacity-0 dark:opacity-100 pointer-events-none'
                style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <Navbar />

            <div className='relative z-10 max-w-3xl mx-auto px-4 py-8'>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-6'>
                    <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>My Applications</h1>
                    <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>Track all your job applications</p>
                </motion.div>

                {/* Stats */}
                <div className='grid grid-cols-4 border border-gray-200 dark:border-white/6 rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/1 mb-6'>
                    {stats.map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className='py-4 px-3 text-center border-r last:border-r-0 border-gray-200 dark:border-white/6'>
                            <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                            <p className='text-sm text-gray-400 dark:text-white/30 mt-0.5'>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div className='flex gap-2 flex-wrap mb-5'>
                    {['all', 'applied', 'seen', 'shortlisted', 'interview', 'hired', 'rejected'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all capitalize border ${
                                filter === f
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/35 hover:border-green-400 dark:hover:border-green-500/40'
                            }`}>
                            {f === 'all' ? `All (${applications.length})` : `${statusConfig[f]?.icon} ${f}`}
                        </button>
                    ))}
                </div>

                {/* Applications list */}
                {loading ? (
                    <div className='flex items-center justify-center py-20'>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full' />
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className='text-center py-20 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                        <div className='w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                            <svg className='w-7 h-7 text-green-500' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'><path d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'/></svg>
                        </div>
                        <p className='text-gray-800 dark:text-white font-semibold mb-1'>No applications yet</p>
                        <p className='text-sm text-gray-400 dark:text-white/25 mb-4'>Start applying to jobs today!</p>
                        <Link to='/jobs' className='bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                            Browse Jobs →
                        </Link>
                    </motion.div>
                ) : (
                    <div className='space-y-3'>
                        <AnimatePresence>
                            {filtered.map((app, i) => {
                                const cfg = statusConfig[app.status] || statusConfig.applied
                                const currentIdx = PIPELINE.indexOf(app.status)

                                return (
                                    <motion.div key={app._id}
                                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: i * 0.05 }}
                                        className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5 hover:border-green-300 dark:hover:border-green-500/30 transition-all'>

                                        <div className='flex items-start gap-3'>
                                            {/* Company logo */}
                                            <div className='w-11 h-11 rounded-xl bg-green-50 dark:bg-green-500/10 border border-gray-100 dark:border-white/5 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-base shrink-0 overflow-hidden'>
                                                {app.job?.employer?.logo_url
                                                    ? <img src={app.job.employer.logo_url} alt='' className='w-full h-full object-cover' />
                                                    : app.job?.title?.charAt(0)?.toUpperCase() || 'J'
                                                }
                                            </div>

                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-start justify-between gap-2 mb-2'>
                                                    <div>
                                                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>{app.job?.title}</h3>
                                                        <p className='text-xs text-gray-500 dark:text-white/35 mt-0.5'>
                                                            {app.job?.employer?.company_name} · {app.job?.location}
                                                        </p>
                                                    </div>
                                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border shrink-0 flex items-center gap-1 ${cfg.color}`}>
                                                        {cfg.icon} {cfg.label}
                                                    </span>
                                                </div>

                                                {/* Salary + Date */}
                                                <div className='flex items-center gap-2 flex-wrap mb-3'>
                                                    <span className='text-xs bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 px-2.5 py-1 rounded-full'>
                                                        Rs. {app.job?.salary_min?.toLocaleString()} – {app.job?.salary_max?.toLocaleString()}
                                                    </span>
                                                    <span className='text-xs text-gray-400 dark:text-white/25'>
                                                        Applied {new Date(app.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {/* Progress pipeline */}
                                                {app.status !== 'rejected' ? (
                                                    <div className='flex items-center gap-0'>
                                                        {PIPELINE.map((s, idx) => {
                                                            const isDone = idx <= currentIdx
                                                            const isCurrent = s === app.status
                                                            return (
                                                                <div key={s} className='flex items-center flex-1 last:flex-none'>
                                                                    <div className='flex flex-col items-center'>
                                                                        <div className={`w-2 h-2 rounded-full transition-all ${
                                                                            isCurrent ? 'bg-green-500 ring-2 ring-green-500/30' :
                                                                            isDone ? 'bg-green-400' : 'bg-gray-200 dark:bg-white/10'
                                                                        }`} />
                                                                        <span className={`text-[10px] mt-1 whitespace-nowrap ${
                                                                            isCurrent ? 'text-green-500 font-semibold' :
                                                                            isDone ? 'text-green-400' : 'text-gray-300 dark:text-white/20'
                                                                        }`}>{s}</span>
                                                                    </div>
                                                                    {idx < PIPELINE.length - 1 && (
                                                                        <div className={`flex-1 h-px mb-3 ${idx < currentIdx ? 'bg-green-400' : 'bg-gray-200 dark:bg-white/8'}`} />
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className='bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-3 py-2'>
                                                        <p className='text-xs text-red-500'>❌ Not selected this time — keep applying!</p>
                                                    </div>
                                                )}

                                                {/* Hired congrats */}
                                                {app.status === 'hired' && (
                                                    <div className='mt-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl px-3 py-2'>
                                                        <p className='text-xs text-green-600 dark:text-green-400 font-semibold'>🎉 Congratulations! You got the job!</p>
                                                    </div>
                                                )}

                                                {/* Interview scheduled */}
                                                {app.status === 'interview' && (
                                                    <div className='mt-2 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl px-3 py-2'>
                                                        <p className='text-xs text-orange-600 dark:text-orange-400 font-semibold'>🗓 Interview scheduled — check your email!</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyApplications
