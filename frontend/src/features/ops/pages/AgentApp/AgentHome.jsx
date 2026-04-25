import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import useOps from '../../hooks/useOps.js'
import { logout } from '../../../auth/auth.slice.js'

const AgentHome = () => {
    const { loading, fetchMyTasks, fetchMyVisits } = useOps()
    const { user } = useSelector(s => s.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])
    const [rejectedVisits, setRejectedVisits] = useState([])
    const [needsVerification, setNeedsVerification] = useState([])
    const [filter, setFilter] = useState('pending')
    const [showAlerts, setShowAlerts] = useState(true)

    useEffect(() => { load() }, [])

    const load = async () => {
        try {
            const [t, rejected, needsVer] = await Promise.all([
                fetchMyTasks(),
                fetchMyVisits({ status: 'rejected' }),
                fetchMyVisits({ status: 'needs_verification' })
            ])
            setTasks(t || [])
            setRejectedVisits(rejected || [])
            setNeedsVerification(needsVer || [])
        } catch (err) { console.error(err) }
    }

    const pending = tasks.filter(t => ['assigned', 'in_progress'].includes(t.status))
    const completed = tasks.filter(t => ['completed', 'verified'].includes(t.status))
    const displayTasks = filter === 'pending' ? pending : completed
    const totalAlerts = rejectedVisits.length + needsVerification.length

    const flagLabel = (flag) => ({
        gps_mismatch: 'Location mismatch',
        duplicate: 'Duplicate entry',
        phone_invalid: 'Invalid phone',
        photo_unclear: 'Unclear photo',
        duration_too_short: 'Too brief',
        duration_too_long: 'Excessive duration'
    }[flag] || flag)

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 pb-20'>
            <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center'>
                <div>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>Welcome back</p>
                    <p className='text-sm font-semibold text-gray-900 dark:text-white'>{user?.name || 'Agent'}</p>
                </div>
                <button onClick={() => { dispatch(logout()); navigate('/login') }} className='text-xs text-red-600'>Logout</button>
            </div>

            <div className='px-4 py-4'>

                <AnimatePresence>
                    {totalAlerts > 0 && showAlerts && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className='mb-4'
                        >
                            <div className='bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3 mb-3'>
                                <div className='flex justify-between items-start mb-2'>
                                    <p className='text-sm font-semibold text-red-800 dark:text-red-300'>
                                        {totalAlerts} submission{totalAlerts > 1 ? 's' : ''} need{totalAlerts === 1 ? 's' : ''} attention
                                    </p>
                                    <button onClick={() => setShowAlerts(false)} className='text-red-600 text-lg leading-none'>×</button>
                                </div>

                                {rejectedVisits.length > 0 && (
                                    <div className='mt-2'>
                                        <p className='text-xs font-semibold text-red-700 dark:text-red-300 mb-1'>Rejected ({rejectedVisits.length})</p>
                                        {rejectedVisits.slice(0, 3).map(v => (
                                            <div key={v._id} className='bg-white dark:bg-gray-800 rounded p-2 mb-1 border border-red-200 dark:border-red-800'>
                                                <p className='text-xs font-medium text-gray-900 dark:text-white'>{v.business_info?.name || v.task?.target_business?.name}</p>
                                                {v.review_notes && (
                                                    <p className='text-xs text-red-600 dark:text-red-400 mt-1'>Reviewer note: {v.review_notes}</p>
                                                )}
                                                {v.quality_flags?.length > 0 && (
                                                    <div className='flex flex-wrap gap-1 mt-1'>
                                                        {v.quality_flags.map((f, i) => (
                                                            <span key={i} className='text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'>
                                                                {flagLabel(f)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {needsVerification.length > 0 && (
                                    <div className='mt-2'>
                                        <p className='text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1'>Needs verification ({needsVerification.length})</p>
                                        {needsVerification.slice(0, 3).map(v => (
                                            <div key={v._id} className='bg-white dark:bg-gray-800 rounded p-2 mb-1 border border-amber-200 dark:border-amber-800'>
                                                <p className='text-xs font-medium text-gray-900 dark:text-white'>{v.business_info?.name || v.task?.target_business?.name}</p>
                                                {v.quality_flags?.length > 0 && (
                                                    <div className='flex flex-wrap gap-1 mt-1'>
                                                        {v.quality_flags.map((f, i) => (
                                                            <span key={i} className='text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'>
                                                                {flagLabel(f)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <p className='text-xs text-gray-600 dark:text-gray-400 mt-2 italic'>
                                    Please contact your supervisor or revisit the location.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className='grid grid-cols-2 gap-3 mb-4'>
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700'>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>Pending</p>
                        <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{pending.length}</p>
                    </div>
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700'>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>Completed</p>
                        <p className='text-2xl font-bold text-green-600 dark:text-green-400'>{completed.length}</p>
                    </div>
                </div>

                <div className='flex gap-2 mb-4'>
                    <button onClick={() => setFilter('pending')} className={`flex-1 py-2 rounded-lg text-sm ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                        Pending ({pending.length})
                    </button>
                    <button onClick={() => setFilter('completed')} className={`flex-1 py-2 rounded-lg text-sm ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                        Completed ({completed.length})
                    </button>
                </div>

                <div className='space-y-3'>
                    {displayTasks.length === 0 && !loading && (
                        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-500'>{filter === 'pending' ? 'No pending tasks' : 'No completed tasks yet'}</p>
                        </div>
                    )}
                    {displayTasks.map(t => (
                        <motion.div key={t._id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                            <div className='flex items-start justify-between mb-2'>
                                <div className='flex-1 min-w-0'>
                                    <h3 className='font-semibold text-gray-900 dark:text-white'>{t.target_business?.name}</h3>
                                    <p className='text-xs text-gray-500 mt-1'>{t.target_business?.address}</p>
                                </div>
                                {t.priority === 'urgent' && <span className='text-xs px-2 py-0.5 rounded bg-red-100 text-red-700'>URGENT</span>}
                            </div>
                            <div className='flex items-center justify-between mt-3'>
                                <span className='text-xs text-gray-500'>{new Date(t.scheduled_date).toLocaleDateString()}</span>
                                {['assigned','in_progress'].includes(t.status) ? (
                                    <Link to={`/agent/checkin/${t._id}`} className='px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700'>Start →</Link>
                                ) : (
                                    <span className='text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'>Completed</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around py-2'>
                <Link to='/agent' className='flex flex-col items-center py-1 px-3 text-blue-600'>
                    <span className='text-[11px] font-medium'>Tasks</span>
                </Link>
                <Link to='/agent/earnings' className='flex flex-col items-center py-1 px-3 text-gray-500'>
                    <span className='text-[11px]'>Earnings</span>
                </Link>
            </div>
        </div>
    )
}

export default AgentHome