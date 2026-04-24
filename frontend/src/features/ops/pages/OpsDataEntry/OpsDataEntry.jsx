import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../../../components/Navbar.jsx'
import useOps from '../../hooks/useOps.js'

const OpsDataEntry = () => {
    const { loading, error, fetchPendingReviews, reviewVisitSubmission } = useOps()
    const [visits, setVisits] = useState([])
    const [selected, setSelected] = useState(null)
    const [notes, setNotes] = useState('')

    useEffect(() => { loadVisits() }, [])

    const loadVisits = async () => {
        try {
            const data = await fetchPendingReviews()
            setVisits(data || [])
        } catch (err) { console.error(err) }
    }

    const handleReview = async (action) => {
        if (!selected) return
        try {
            await reviewVisitSubmission(selected._id, { action, review_notes: notes })
            setSelected(null)
            setNotes('')
            loadVisits()
        } catch (err) { alert(err.response?.data?.message || 'Failed') }
    }

    const flagLabel = (flag) => ({
        gps_mismatch: 'GPS mismatch',
        duplicate: 'Duplicate',
        phone_invalid: 'Phone invalid',
        photo_unclear: 'Photo unclear',
        duration_too_short: 'Too short',
        duration_too_long: 'Too long'
    }[flag] || flag)

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='mb-6'>
                    <Link to='/ops' className='text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600'>← Dashboard</Link>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>Data Entry Queue</h1>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>{visits.length} pending review</p>
                </div>

                {error && <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300'>{error}</div>}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <div className='space-y-3'>
                        {visits.length === 0 && !loading && (
                            <div className='bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700'>
                                <p className='text-gray-500 dark:text-gray-400'>🎉 No pending reviews</p>
                                <p className='text-xs text-gray-400 mt-1'>All field submissions are processed</p>
                            </div>
                        )}
                        {visits.map(v => (
                            <motion.div key={v._id} onClick={() => setSelected(v)} whileHover={{ scale: 1.01 }} className={`bg-white dark:bg-gray-800 rounded-lg p-4 border cursor-pointer ${selected?._id === v._id ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'}`}>
                                <div className='flex justify-between items-start mb-2 flex-wrap gap-2'>
                                    <h3 className='font-semibold text-gray-900 dark:text-white'>{v.business_info?.name || v.task?.target_business?.name || 'Unknown'}</h3>
                                    {v.review_status === 'needs_verification' && <span className='text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'>Needs verification</span>}
                                </div>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>By {v.agent?.full_name} · {new Date(v.createdAt).toLocaleString()}</p>
                                {v.quality_flags?.length > 0 && (
                                    <div className='flex flex-wrap gap-1 mt-2'>
                                        {v.quality_flags.map((f, i) => <span key={i} className='text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'>⚠ {flagLabel(f)}</span>)}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {selected && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 h-fit sticky top-4'>
                            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-1'>{selected.business_info?.name}</h2>
                            <p className='text-xs text-gray-500 mb-4'>Submitted by {selected.agent?.full_name}</p>

                            {selected.quality_flags?.length > 0 && (
                                <div className='mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded'>
                                    <p className='text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1'>Quality Issues</p>
                                    <ul className='text-xs text-amber-700 dark:text-amber-300 list-disc list-inside'>
                                        {selected.quality_flags.map((f, i) => <li key={i}>{flagLabel(f)}</li>)}
                                    </ul>
                                </div>
                            )}

                            <div className='space-y-2 text-sm mb-4'>
                                <div><span className='text-gray-500'>Owner:</span> <span className='text-gray-900 dark:text-white'>{selected.business_info?.owner_name || '—'}</span></div>
                                <div><span className='text-gray-500'>Phone:</span> <span className='text-gray-900 dark:text-white'>{selected.business_info?.owner_phone || '—'}</span></div>
                                <div><span className='text-gray-500'>Type:</span> <span className='text-gray-900 dark:text-white'>{selected.business_info?.type || '—'}</span></div>
                                <div><span className='text-gray-500'>Duration:</span> <span className='text-gray-900 dark:text-white'>{selected.duration_minutes} min</span></div>
                                <div><span className='text-gray-500'>GPS distance:</span> <span className='text-gray-900 dark:text-white'>{selected.check_in?.distance_from_target || 0}m from target</span></div>
                                <div><span className='text-gray-500'>Reaction:</span> <span className='text-gray-900 dark:text-white'>{selected.pitch_outcome?.reaction?.replace('_', ' ') || '—'}</span></div>
                                <div><span className='text-gray-500'>Next action:</span> <span className='text-gray-900 dark:text-white'>{selected.pitch_outcome?.next_action?.replace('_', ' ') || '—'}</span></div>
                            </div>

                            {selected.pitch_outcome?.agent_notes && (
                                <div className='mb-4'>
                                    <p className='text-xs text-gray-500 mb-1'>Agent notes:</p>
                                    <p className='text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2 rounded'>{selected.pitch_outcome.agent_notes}</p>
                                </div>
                            )}

                            {selected.proofs?.shop_photo_url && (
                                <div className='mb-4'>
                                    <p className='text-xs text-gray-500 mb-1'>Shop photo:</p>
                                    <img src={selected.proofs.shop_photo_url} alt='Shop' className='w-full rounded border border-gray-200 dark:border-gray-700' />
                                </div>
                            )}

                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows='2' placeholder='Review notes (optional)' className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm mb-3' />

                            <div className='flex gap-2'>
                                <button onClick={() => handleReview('reject')} disabled={loading} className='flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50'>Reject</button>
                                <button onClick={() => handleReview('approve')} disabled={loading} className='flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50'>Approve & Save to CRM</button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OpsDataEntry