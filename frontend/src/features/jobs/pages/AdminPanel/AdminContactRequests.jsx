import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AdminContactRequests = ({ requests, setRequests, reviewContactRequest, loading }) => {
    const [processing, setProcessing] = useState(null)
    const [adminNote, setAdminNote] = useState('')
    const [selected, setSelected] = useState(null)

    const handleReview = async (id, action) => {
        setProcessing(id)
        try {
            await reviewContactRequest(id, action, adminNote)
            setRequests(prev => prev.map(r => r._id === id
                ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' }
                : r
            ))
            setSelected(null)
            setAdminNote('')
        } catch (err) { console.log(err) }
        finally { setProcessing(null) }
    }

    const pending = requests.filter(r => r.status === 'pending')
    const reviewed = requests.filter(r => r.status !== 'pending')
    const [tab, setTab] = useState('pending')

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className='mb-6'>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Contact Requests</h2>
                <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>Employers requesting jobseeker contact details</p>
            </div>

            {/* Tabs */}
            <div className='flex bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-2xl p-1 mb-6'>
                {[
                    { id: 'pending', label: `⏳ Pending (${pending.length})` },
                    { id: 'reviewed', label: `📋 Reviewed (${reviewed.length})` },
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex-1 py-2.5 text-sm rounded-xl transition-all font-medium ${
                            tab === t.id
                                ? 'bg-white dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm'
                                : 'text-gray-500 dark:text-white/35'
                        }`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className='flex items-center justify-center py-20'>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full' />
                </div>
            ) : (
                <div className='space-y-3'>
                    {(tab === 'pending' ? pending : reviewed).length === 0 ? (
                        <div className='text-center py-20 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                            <p className='text-gray-800 dark:text-white font-semibold mb-1'>No {tab} requests</p>
                        </div>
                    ) : (
                        (tab === 'pending' ? pending : reviewed).map((req, i) => (
                            <motion.div key={req._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl overflow-hidden'>

                                {/* Card */}
                                <div className='p-5'>
                                    <div className='flex items-start justify-between gap-3'>
                                        <div className='flex-1 min-w-0'>
                                            {/* Employer */}
                                            <div className='flex items-center gap-2 mb-1'>
                                                <div className='w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0'>
                                                    {req.employer?.company_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{req.employer?.company_name}</p>
                                                    <p className='text-xs text-gray-400 dark:text-white/30'>{req.employer?.email}</p>
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-1 my-2 text-gray-400 dark:text-white/20'>
                                                <svg className='w-3 h-3' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><line x1='12' y1='5' x2='12' y2='19'/><polyline points='19 12 12 19 5 12'/></svg>
                                                <span className='text-xs'>wants contact of</span>
                                            </div>

                                            {/* Jobseeker */}
                                            <div className='flex items-center gap-2'>
                                                <div className='w-8 h-8 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 font-bold text-sm shrink-0'>
                                                    {req.jobseeker?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{req.jobseeker?.name}</p>
                                                    <p className='text-xs text-gray-400 dark:text-white/30'>{req.jobseeker?.phone} · {req.jobseeker?.email}</p>
                                                </div>
                                            </div>

                                            {req.employer_message && (
                                                <div className='mt-3 bg-gray-50 dark:bg-white/3 rounded-xl p-3'>
                                                    <p className='text-xs text-gray-500 dark:text-white/35 italic'>"{req.employer_message}"</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex flex-col items-end gap-2'>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                                                req.status === 'approved'
                                                    ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20'
                                                    : req.status === 'rejected'
                                                    ? 'bg-red-50 dark:bg-red-500/10 text-red-500 border-red-200 dark:border-red-500/20'
                                                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                            }`}>
                                                {req.status === 'approved' ? '✅ Approved' : req.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                                            </span>
                                            <p className='text-xs text-gray-400 dark:text-white/25'>{new Date(req.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Pending actions */}
                                    {req.status === 'pending' && (
                                        <div className='mt-4 space-y-3'>
                                            <input type='text' value={selected === req._id ? adminNote : ''} 
                                                onChange={e => { setSelected(req._id); setAdminNote(e.target.value) }}
                                                placeholder='Admin note (optional)'
                                                className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20' />
                                            <div className='flex gap-2'>
                                                <button onClick={() => handleReview(req._id, 'approve')}
                                                    disabled={processing === req._id}
                                                    className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors'>
                                                    ✅ Approve
                                                </button>
                                                <button onClick={() => handleReview(req._id, 'reject')}
                                                    disabled={processing === req._id}
                                                    className='flex-1 border border-red-200 dark:border-red-500/20 text-red-500 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors hover:bg-red-50 dark:hover:bg-red-500/5'>
                                                    ❌ Reject
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </motion.div>
    )
}

export default AdminContactRequests