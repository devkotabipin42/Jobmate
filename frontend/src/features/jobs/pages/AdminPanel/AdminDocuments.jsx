import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AdminDocuments = ({ documents, setDocuments, verifyDocument, resetDocument, getAllDocuments, loading }) => {
    const [activeTab, setActiveTab] = useState('pending')
    const [allDocs, setAllDocs] = useState([])
    const [allLoading, setAllLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [rejectReason, setRejectReason] = useState('')
    const [processing, setProcessing] = useState(false)
    const [imageModal, setImageModal] = useState(null)

    useEffect(() => {
        if (activeTab === 'all') loadAllDocs()
    }, [activeTab])

    const loadAllDocs = async () => {
        setAllLoading(true)
        const data = await getAllDocuments()
        setAllDocs(data || [])
        setAllLoading(false)
    }

    const handleVerify = async (id) => {
        setProcessing(true)
        try {
            await verifyDocument(id, 'verify', '')
            setDocuments(prev => prev.filter(d => d._id !== id))
            setSelected(null)
        } catch (err) { console.log(err) }
        finally { setProcessing(false) }
    }

    const handleReject = async (id) => {
        if (!rejectReason.trim()) return
        setProcessing(true)
        try {
            await verifyDocument(id, 'reject', rejectReason)
            setDocuments(prev => prev.filter(d => d._id !== id))
            setSelected(null)
            setRejectReason('')
        } catch (err) { console.log(err) }
        finally { setProcessing(false) }
    }

    const handleReset = async (id) => {
        if (!window.confirm('Reset this user\'s document? They will need to re-upload.')) return
        setProcessing(true)
        try {
            await resetDocument(id)
            setAllDocs(prev => prev.filter(d => d._id !== id))
            setSelected(null)
        } catch (err) { console.log(err) }
        finally { setProcessing(false) }
    }

    const DocumentCard = ({ doc, showReset = false }) => (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl overflow-hidden'>

            <div className='flex items-center gap-4 p-5'>
                <div className='w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-xl shrink-0'>
                    {doc.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                        <p className='text-sm font-semibold text-gray-800 dark:text-white'>{doc.name}</p>
                        {/* Document type badge */}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                            doc.document_type === 'citizenship'
                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                                : 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20'
                        }`}>
                            {doc.document_type === 'citizenship' ? '🪪 Citizenship' : '🚗 License'}
                        </span>
                        {/* Status badge */}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                            doc.document_status === 'verified'
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20'
                                : doc.document_status === 'rejected'
                                ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
                                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                        }`}>
                            {doc.document_status === 'verified' ? '✅ Verified' : doc.document_status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                        </span>
                    </div>
                    <p className='text-xs text-gray-500 dark:text-white/35'>{doc.email}</p>
                    <p className='text-xs text-gray-400 dark:text-white/25 mt-0.5'>
                        Doc No: <strong className='text-gray-600 dark:text-white/50'>
                            {doc.document_type === 'citizenship' ? doc.citizenship_number : doc.license_number}
                        </strong>
                    </p>
                </div>

                <div className='flex gap-2'>
    <button onClick={() => setSelected(selected?._id === doc._id ? null : doc)}
        className='text-xs border border-gray-200 dark:border-white/8 px-3 py-2 rounded-xl text-gray-600 dark:text-white/40 hover:border-green-400 dark:hover:border-green-500/40 transition-colors'>
        {selected?._id === doc._id ? 'Close' : '👁 View'}
    </button>

    {showReset && (
        <button onClick={() => handleReset(doc._id)} disabled={processing}
            className='text-xs border border-orange-200 dark:border-orange-500/20 text-orange-500 px-3 py-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-colors'>
            🔄 Reset
        </button>
    )}
</div>
            </div>

            {/* Review panel — pending only */}
           <AnimatePresence>
    {selected?._id === doc._id && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className='border-t border-gray-100 dark:border-white/5 p-5 space-y-4'>

            {/* Document image */}
            <div>
                <p className='text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Document Photo</p>
                {(doc.citizenship_url || doc.license_url) ? (
                    <div className='relative inline-block'>
                        <img
                            src={doc.document_type === 'citizenship' ? doc.citizenship_url : doc.license_url}
                            alt='document'
                            className='max-w-xs rounded-xl border border-gray-200 dark:border-white/8 cursor-pointer hover:opacity-90 transition-opacity'
                            onClick={() => setImageModal(doc.document_type === 'citizenship' ? doc.citizenship_url : doc.license_url)}
                        />
                        <button onClick={() => setImageModal(doc.document_type === 'citizenship' ? doc.citizenship_url : doc.license_url)}
                            className='absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg'>
                            View Full
                        </button>
                    </div>
                ) : (
                    <p className='text-xs text-red-400'>No document image found</p>
                )}
            </div>

            {/* User details */}
            <div className='grid grid-cols-3 gap-3'>
                {[
                    { label: 'Phone', value: doc.phone || 'N/A' },
                    { label: 'Location', value: doc.location || 'N/A' },
                    { label: 'Document Type', value: doc.document_type },
                ].map((item, i) => (
                    <div key={i} className='bg-gray-50 dark:bg-white/3 rounded-xl p-3'>
                        <p className='text-xs text-gray-400 dark:text-white/25 mb-1'>{item.label}</p>
                        <p className='text-sm font-semibold text-gray-800 dark:text-white capitalize'>{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Bio */}
            {doc.bio && (
                <div className='bg-gray-50 dark:bg-white/3 rounded-xl p-3'>
                    <p className='text-xs text-gray-400 dark:text-white/25 mb-1'>Bio</p>
                    <p className='text-sm text-gray-700 dark:text-white/60'>{doc.bio}</p>
                </div>
            )}

            {/* Skills */}
            {doc.skills?.length > 0 && (
                <div>
                    <p className='text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Skills</p>
                    <div className='flex flex-wrap gap-1.5'>
                        {doc.skills.map((skill, i) => (
                            <span key={i} className='text-xs bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full'>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {doc.education?.length > 0 && (
                <div>
                    <p className='text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Education</p>
                    <div className='space-y-2'>
                        {doc.education.map((edu, i) => (
                            <div key={i} className='flex items-start gap-3 bg-gray-50 dark:bg-white/3 rounded-xl p-3'>
                                <div className='w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0'>
                                    <svg className='w-4 h-4 text-blue-500' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/></svg>
                                </div>
                                <div>
                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{edu.institution}</p>
                                    <p className='text-xs text-gray-500 dark:text-white/35'>{edu.degree} {edu.field && `— ${edu.field}`}</p>
                                    <p className='text-xs text-gray-400 dark:text-white/25'>{edu.start_year} — {edu.is_current ? 'Present' : edu.end_year}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {doc.experience?.length > 0 && (
                <div>
                    <p className='text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Experience</p>
                    <div className='space-y-2'>
                        {doc.experience.map((exp, i) => (
                            <div key={i} className='flex items-start gap-3 bg-gray-50 dark:bg-white/3 rounded-xl p-3'>
                                <div className='w-8 h-8 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm shrink-0'>
                                    {exp.company?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{exp.position}</p>
                                    <p className='text-xs text-gray-500 dark:text-white/35'>{exp.company} {exp.location && `· ${exp.location}`}</p>
                                    <p className='text-xs text-gray-400 dark:text-white/25'>{exp.start_year} — {exp.is_current ? 'Present' : exp.end_year}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CV Link */}
            {doc.cv_url && (
                <a href={doc.cv_url} target='_blank' rel='noreferrer'
                    className='flex items-center gap-2 text-xs text-green-600 dark:text-green-400 hover:underline'>
                    <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>
                    View CV
                </a>
            )}

            {/* Pending tab — Verify + Reject */}
            {!showReset && (
                <>
                    <button onClick={() => handleVerify(doc._id)} disabled={processing}
                        className='w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2'>
                        {processing ? (
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className='w-4 h-4 border-2 border-white border-t-transparent rounded-full' />
                        ) : (
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                        )}
                        ✅ Verify & Give Golden Badge
                    </button>
                    <div className='space-y-2'>
                        <input type='text' value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                            placeholder='Rejection reason (required to reject)'
                            className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20' />
                        <button onClick={() => handleReject(doc._id)} disabled={processing || !rejectReason.trim()}
                            className='w-full border border-red-200 dark:border-red-500/20 text-red-500 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors hover:bg-red-50 dark:hover:bg-red-500/5'>
                            ❌ Reject Document
                        </button>
                    </div>
                </>
            )}

            {/* All Documents tab — Reset only */}
            {showReset && (
                <button onClick={() => handleReset(doc._id)} disabled={processing}
                    className='w-full border border-orange-200 dark:border-orange-500/20 text-orange-500 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors hover:bg-orange-50 dark:hover:bg-orange-500/5'>
                    🔄 Reset Document
                </button>
            )}
        </motion.div>
    )}
</AnimatePresence>
        </motion.div>
    )

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Document Verification</h2>
                    <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>Verify or reset user documents</p>
                </div>
            </div>

            {/* Tabs */}
            <div className='flex bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-2xl p-1 mb-6'>
                {[
                    { id: 'pending', label: `⏳ Pending (${documents.length})` },
                    { id: 'all', label: '📋 All Documents' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelected(null) }}
                        className={`flex-1 py-2.5 text-sm rounded-xl transition-all font-medium ${
                            activeTab === tab.id
                                ? 'bg-white dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm'
                                : 'text-gray-500 dark:text-white/35'
                        }`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Pending Tab */}
            {activeTab === 'pending' && (
                loading ? (
                    <div className='flex items-center justify-center py-20'>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full' />
                    </div>
                ) : documents.length === 0 ? (
                    <div className='text-center py-20 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                        <div className='w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                            <svg className='w-7 h-7 text-green-500' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
                                <path d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'/>
                            </svg>
                        </div>
                        <p className='text-gray-800 dark:text-white font-semibold mb-1'>All caught up!</p>
                        <p className='text-sm text-gray-400 dark:text-white/25'>No pending verifications</p>
                    </div>
                ) : (
                    <div className='space-y-3'>
                        {documents.map(doc => <DocumentCard key={doc._id} doc={doc} showReset={false} />)}
                    </div>
                )
            )}

            {/* All Documents Tab */}
            {activeTab === 'all' && (
                allLoading ? (
                    <div className='flex items-center justify-center py-20'>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full' />
                    </div>
                ) : allDocs.length === 0 ? (
                    <div className='text-center py-20 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                        <p className='text-gray-800 dark:text-white font-semibold mb-1'>No documents yet</p>
                        <p className='text-sm text-gray-400 dark:text-white/25'>No users have submitted documents</p>
                    </div>
                ) : (
                    <div className='space-y-3'>
                        {allDocs.map(doc => <DocumentCard key={doc._id} doc={doc} showReset={true} />)}
                    </div>
                )
            )}

            {/* Image fullscreen modal */}
            <AnimatePresence>
                {imageModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setImageModal(null)}
                        className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer'>
                        <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            src={imageModal} alt='document full'
                            className='max-w-2xl max-h-[90vh] rounded-2xl object-contain' />
                        <button className='absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center'>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M18 6 6 18M6 6l12 12'/></svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default AdminDocuments