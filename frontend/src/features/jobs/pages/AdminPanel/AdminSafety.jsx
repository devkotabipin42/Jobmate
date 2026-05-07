import { useMemo, useState } from 'react'

const sectionMeta = {
    suspiciousJobs: {
        title: 'Suspicious Jobs',
        subtitle: 'Jobs with scam-like words such as fee, deposit, Telegram, daily earning.',
        badge: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300'
    },
    orphanJobs: {
        title: 'Orphan Jobs',
        subtitle: 'Jobs where employer account is missing or deleted.',
        badge: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300'
    },
    expiredJobs: {
        title: 'Expired Jobs',
        subtitle: 'Jobs with deadline already passed but still in database.',
        badge: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/70'
    },
    badDeadlineJobs: {
        title: 'Bad Deadline Jobs',
        subtitle: 'Jobs with invalid or too-far future deadline.',
        badge: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300'
    }
}

const formatDate = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    return date.toLocaleDateString()
}

const getJobId = (item) => item?.job?._id
const getEmployerName = (item) => item?.job?.employer?.company_name || 'Employer missing'

const SafetySection = ({ type, items = [], onReject, onDelete, busyId }) => {
    const meta = sectionMeta[type]

    if (!items.length) {
        return (
            <div className='rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1a2e] p-5'>
                <div className='flex items-start justify-between gap-3'>
                    <div>
                        <h3 className='text-base font-bold text-gray-900 dark:text-white'>{meta.title}</h3>
                        <p className='text-sm text-gray-500 dark:text-white/45 mt-1'>{meta.subtitle}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${meta.badge}`}>0</span>
                </div>
                <p className='mt-4 text-sm text-green-600 dark:text-green-400'>No issues found.</p>
            </div>
        )
    }

    return (
        <div className='rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1a2e] overflow-hidden'>
            <div className='p-5 border-b border-gray-100 dark:border-white/10 flex items-start justify-between gap-3'>
                <div>
                    <h3 className='text-base font-bold text-gray-900 dark:text-white'>{meta.title}</h3>
                    <p className='text-sm text-gray-500 dark:text-white/45 mt-1'>{meta.subtitle}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${meta.badge}`}>{items.length}</span>
            </div>

            <div className='divide-y divide-gray-100 dark:divide-white/10'>
                {items.map((item) => {
                    const job = item.job || {}
                    const id = getJobId(item)
                    const isBusy = busyId === id

                    return (
                        <div key={`${type}-${id}`} className='p-5'>
                            <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
                                <div className='min-w-0'>
                                    <div className='flex flex-wrap items-center gap-2'>
                                        <h4 className='font-semibold text-gray-900 dark:text-white'>{job.title || 'Untitled job'}</h4>
                                        <span className={`text-xs px-2 py-1 rounded-full ${job.is_active ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/50'}`}>
                                            {job.is_active ? 'active' : 'inactive'}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${job.is_verified ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/50'}`}>
                                            {job.is_verified ? 'verified' : 'unverified'}
                                        </span>
                                    </div>

                                    <p className='text-sm text-gray-500 dark:text-white/45 mt-1'>
                                        {getEmployerName(item)} · {job.location || '-'} · {job.category || '-'} · Deadline: {formatDate(job.deadline)}
                                    </p>

                                    {job.description && (
                                        <p className='text-sm text-gray-600 dark:text-white/60 mt-3 line-clamp-2'>
                                            {job.description}
                                        </p>
                                    )}

                                    <div className='flex flex-wrap gap-2 mt-3'>
                                        {(item.reasons || []).map(reason => (
                                            <span key={reason} className='text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'>
                                                {reason}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className='flex gap-2 shrink-0'>
                                    <button
                                        onClick={() => onReject(id)}
                                        disabled={isBusy || !id}
                                        className='px-3 py-2 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50'
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => onDelete(id)}
                                        disabled={isBusy || !id}
                                        className='px-3 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const AdminSafety = ({ report, loading, onRefresh, onReject, onDelete }) => {
    const [busyId, setBusyId] = useState(null)

    const counts = report?.counts || {
        suspiciousJobs: 0,
        orphanJobs: 0,
        expiredJobs: 0,
        badDeadlineJobs: 0
    }

    const totalIssues = useMemo(() => {
        return Object.values(counts).reduce((sum, count) => sum + Number(count || 0), 0)
    }, [counts])

    const handleReject = async (id) => {
        if (!id) return
        const ok = window.confirm('Reject/unverify this job? This will hide it from public listings.')
        if (!ok) return

        setBusyId(id)
        await onReject(id)
        setBusyId(null)
    }

    const handleDelete = async (id) => {
        if (!id) return
        const ok = window.confirm('Delete this job permanently? Use only for test/bad data.')
        if (!ok) return

        setBusyId(id)
        await onDelete(id)
        setBusyId(null)
    }

    return (
        <div className='space-y-6'>
            <div className='rounded-2xl bg-white dark:bg-[#0c1a2e] border border-gray-200 dark:border-white/10 p-5'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Job Safety Control</h2>
                        <p className='text-sm text-gray-500 dark:text-white/45 mt-1'>
                            CEO/HR review center for suspicious, orphan, expired, and bad-deadline jobs.
                        </p>
                    </div>
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className='px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50'
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                <div className='grid grid-cols-2 lg:grid-cols-5 gap-3 mt-5'>
                    <div className='rounded-xl bg-gray-50 dark:bg-white/5 p-4'>
                        <p className='text-xs text-gray-500 dark:text-white/40'>Total Issues</p>
                        <p className='text-2xl font-bold text-gray-900 dark:text-white'>{totalIssues}</p>
                    </div>
                    {Object.entries(counts).map(([key, value]) => (
                        <div key={key} className='rounded-xl bg-gray-50 dark:bg-white/5 p-4'>
                            <p className='text-xs text-gray-500 dark:text-white/40'>{sectionMeta[key]?.title || key}</p>
                            <p className='text-2xl font-bold text-gray-900 dark:text-white'>{value || 0}</p>
                        </div>
                    ))}
                </div>
            </div>

            <SafetySection type='suspiciousJobs' items={report?.suspiciousJobs || []} onReject={handleReject} onDelete={handleDelete} busyId={busyId} />
            <SafetySection type='orphanJobs' items={report?.orphanJobs || []} onReject={handleReject} onDelete={handleDelete} busyId={busyId} />
            <SafetySection type='expiredJobs' items={report?.expiredJobs || []} onReject={handleReject} onDelete={handleDelete} busyId={busyId} />
            <SafetySection type='badDeadlineJobs' items={report?.badDeadlineJobs || []} onReject={handleReject} onDelete={handleDelete} busyId={busyId} />
        </div>
    )
}

export default AdminSafety