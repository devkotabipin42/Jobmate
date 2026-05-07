import { useMemo, useState } from 'react'

const priorityStyle = {
    critical: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
    normal: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
}

const logStatusStyle = {
    queued: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/60',
    sent: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    replied: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
    cancelled: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/60'
}

const formatDate = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return date.toLocaleString()
}

const getPhone = (item) => {
    return item?.candidate?.phone || item?.employer?.phone || ''
}

const buildWhatsAppLink = (item) => {
    const phone = getPhone(item)
    if (!phone) return null

    const cleanPhone = phone.startsWith('977')
        ? phone
        : `977${phone.replace(/\D/g, '').slice(-10)}`

    const message = `Namaste, JobMate bata follow-up ko lagi contact gareko. ${item.type} - ${item.job?.title || 'job'} ko barema kura garnu thiyo.`

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

const AdminFollowUps = ({
    data,
    teamMembers,
    aaratiLogs,
    loading,
    onRefresh,
    onCreateTask,
    onSendAarati,
    onRefreshAaratiLogs,
    onRetryAaratiLog
}) => {
    const [selectedAgents, setSelectedAgents] = useState({})
    const [busyId, setBusyId] = useState(null)
    const [sendingAaratiId, setSendingAaratiId] = useState(null)
    const [retryingLogId, setRetryingLogId] = useState(null)

    const followUps = data?.followUps || []

    const counts = data?.counts || {
        total: 0,
        critical: 0,
        high: 0,
        normal: 0
    }

    const activeAgents = useMemo(() => {
        return (teamMembers || []).filter(member => member.is_active !== false)
    }, [teamMembers])

    const handleCreateTask = async (item) => {
        const assignedTo = selectedAgents[item._id]

        if (!assignedTo) {
            alert('Please select an agent/support staff first.')
            return
        }

        setBusyId(item._id)

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        const taskData = {
            task_type: 'follow_up',
            assigned_to: assignedTo,
            target_business: {
                name: item.employer?.company_name || item.job?.title || 'Follow-up',
                address: item.location || item.employer?.location || 'Lumbini Province',
                area: item.location || '',
                owner_name: item.candidate?.name || '',
                owner_phone: item.candidate?.phone || item.employer?.phone || ''
            },
            scheduled_date: tomorrow.toISOString(),
            priority: item.priority === 'critical' ? 'urgent' : item.priority === 'high' ? 'urgent' : 'normal',
            expected_outcome: 'info_only',
            notes_for_agent: [
                `Follow-up type: ${item.type}`,
                `Reason: ${item.reason}`,
                `Candidate: ${item.candidate?.name || '-'} (${item.candidate?.phone || item.candidate?.email || '-'})`,
                `Employer: ${item.employer?.company_name || '-'}`,
                `Job: ${item.job?.title || '-'}`,
                `Status: ${item.status}`,
                `Days waiting: ${item.daysWaiting}`
            ].join('\n'),
            checklist: [
                { item: 'Contact candidate/employer', completed: false },
                { item: 'Confirm current status', completed: false },
                { item: 'Add result note after follow-up', completed: false }
            ]
        }

        await onCreateTask(taskData)
        setBusyId(null)
    }

    const handleSendAarati = async (item) => {
        if (!onSendAarati) return

        setSendingAaratiId(item._id)
        await onSendAarati(item)
        setSendingAaratiId(null)
    }

    const handleRetryLog = async (logId) => {
        if (!onRetryAaratiLog) return

        setRetryingLogId(logId)
        await onRetryAaratiLog(logId)
        setRetryingLogId(null)
    }

    return (
        <div className='space-y-6'>
            <div className='rounded-2xl bg-white dark:bg-[#0c1a2e] border border-gray-200 dark:border-white/10 p-5'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Follow-up Queue</h2>
                        <p className='text-sm text-gray-500 dark:text-white/45 mt-1'>
                            HR/Ops daily list: who to contact, why, and which agent should handle it.
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

                <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5'>
                    {Object.entries(counts).map(([key, value]) => (
                        <div key={key} className='rounded-xl bg-gray-50 dark:bg-white/5 p-4'>
                            <p className='text-xs text-gray-500 dark:text-white/40 capitalize'>{key}</p>
                            <p className='text-2xl font-bold text-gray-900 dark:text-white'>{value || 0}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='rounded-2xl bg-white dark:bg-[#0c1a2e] border border-gray-200 dark:border-white/10 overflow-hidden'>
                <div className='p-5 border-b border-gray-100 dark:border-white/10'>
                    <h3 className='font-bold text-gray-900 dark:text-white'>Follow-up Tasks to Create</h3>
                    <p className='text-sm text-gray-500 dark:text-white/45 mt-1'>
                        Select an agent/support staff, then create an Ops task or send to Aarati Bot.
                    </p>
                </div>

                {followUps.length === 0 ? (
                    <div className='p-8 text-center text-gray-500 dark:text-white/45'>
                        No follow-ups needed right now.
                    </div>
                ) : (
                    <div className='divide-y divide-gray-100 dark:divide-white/10'>
                        {followUps.map(item => {
                            const waLink = buildWhatsAppLink(item)

                            return (
                                <div key={item._id} className='p-5'>
                                    <div className='flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4'>
                                        <div className='min-w-0'>
                                            <div className='flex flex-wrap gap-2 items-center'>
                                                <h4 className='font-semibold text-gray-900 dark:text-white'>
                                                    {item.type}
                                                </h4>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyle[item.priority] || priorityStyle.normal}`}>
                                                    {item.priority}
                                                </span>
                                                <span className='px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/60'>
                                                    {item.daysWaiting} days
                                                </span>
                                            </div>

                                            <p className='text-sm text-gray-500 dark:text-white/45 mt-1'>
                                                {item.reason}
                                            </p>

                                            <div className='grid md:grid-cols-3 gap-3 mt-4 text-sm'>
                                                <div>
                                                    <p className='text-xs text-gray-400'>Candidate</p>
                                                    <p className='font-medium text-gray-800 dark:text-white'>{item.candidate?.name || '-'}</p>
                                                    <p className='text-xs text-gray-500'>{item.candidate?.phone || item.candidate?.email || '-'}</p>
                                                </div>

                                                <div>
                                                    <p className='text-xs text-gray-400'>Employer</p>
                                                    <p className='font-medium text-gray-800 dark:text-white'>{item.employer?.company_name || '-'}</p>
                                                    <p className='text-xs text-gray-500'>{item.employer?.phone || item.employer?.email || '-'}</p>
                                                </div>

                                                <div>
                                                    <p className='text-xs text-gray-400'>Job</p>
                                                    <p className='font-medium text-gray-800 dark:text-white'>{item.job?.title || '-'}</p>
                                                    <p className='text-xs text-gray-500'>{item.location || '-'} · {item.status}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col sm:flex-row xl:flex-col gap-2 xl:w-56'>
                                            <select
                                                value={selectedAgents[item._id] || ''}
                                                onChange={(e) => setSelectedAgents(prev => ({ ...prev, [item._id]: e.target.value }))}
                                                className='px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-white'
                                            >
                                                <option value=''>Select agent</option>
                                                {activeAgents.map(member => (
                                                    <option key={member._id} value={member._id}>
                                                        {member.full_name}
                                                    </option>
                                                ))}
                                            </select>

                                            {waLink && (
                                                <a
                                                    href={waLink}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='text-center px-3 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600'
                                                >
                                                    Open WhatsApp
                                                </a>
                                            )}

                                            <button
                                                onClick={() => handleSendAarati(item)}
                                                disabled={sendingAaratiId === item._id}
                                                className='px-3 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-50'
                                            >
                                                {sendingAaratiId === item._id ? 'Sending...' : 'Send to Aarati Bot'}
                                            </button>

                                            <button
                                                onClick={() => handleCreateTask(item)}
                                                disabled={busyId === item._id}
                                                className='px-3 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50'
                                            >
                                                {busyId === item._id ? 'Creating...' : 'Create Ops Task'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className='rounded-2xl bg-white dark:bg-[#0c1a2e] border border-gray-200 dark:border-white/10 overflow-hidden'>
                <div className='p-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-3'>
                    <div>
                        <h3 className='font-bold text-gray-900 dark:text-white'>Aarati Follow-up Logs</h3>
                        <p className='text-sm text-gray-500 dark:text-white/45 mt-1'>
                            Track messages sent to Aarati Bot, failed attempts, and replies.
                        </p>
                    </div>

                    <button
                        onClick={onRefreshAaratiLogs}
                        disabled={loading}
                        className='px-3 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-50'
                    >
                        Refresh Logs
                    </button>
                </div>

                <div className='grid grid-cols-2 lg:grid-cols-6 gap-3 p-5'>
                    {Object.entries(aaratiLogs?.counts || {}).map(([key, value]) => (
                        <div key={key} className='rounded-xl bg-gray-50 dark:bg-white/5 p-3'>
                            <p className='text-xs text-gray-500 dark:text-white/40 capitalize'>{key}</p>
                            <p className='text-xl font-bold text-gray-900 dark:text-white'>{value || 0}</p>
                        </div>
                    ))}
                </div>

                {(aaratiLogs?.logs || []).length === 0 ? (
                    <div className='p-6 text-center text-gray-500 dark:text-white/45'>
                        No Aarati follow-up logs yet.
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead className='bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/45'>
                                <tr>
                                    <th className='text-left px-5 py-3 font-semibold'>Recipient</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Type</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Job</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Status</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Sent</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Error / Reply</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Action</th>
                                </tr>
                            </thead>

                            <tbody className='divide-y divide-gray-100 dark:divide-white/10'>
                                {(aaratiLogs?.logs || []).map(log => (
                                    <tr key={log._id} className='hover:bg-gray-50 dark:hover:bg-white/[0.03]'>
                                        <td className='px-5 py-4'>
                                            <p className='font-semibold text-gray-900 dark:text-white'>
                                                {log.recipientName || '-'}
                                            </p>
                                            <p className='text-xs text-gray-500 dark:text-white/35'>
                                                {log.phone}
                                            </p>
                                        </td>

                                        <td className='px-5 py-4 text-gray-700 dark:text-white/70'>
                                            {log.type}
                                        </td>

                                        <td className='px-5 py-4'>
                                            <p className='text-gray-800 dark:text-white'>
                                                {log.jobTitle || '-'}
                                            </p>
                                            <p className='text-xs text-gray-500 dark:text-white/35'>
                                                {log.companyName || '-'}
                                            </p>
                                        </td>

                                        <td className='px-5 py-4'>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${logStatusStyle[log.status] || logStatusStyle.queued}`}>
                                                {log.status}
                                            </span>
                                        </td>

                                        <td className='px-5 py-4 text-gray-500 dark:text-white/40'>
                                            {formatDate(log.sentAt || log.createdAt)}
                                        </td>

                                        <td className='px-5 py-4 max-w-sm'>
                                            <p className='text-xs text-gray-600 dark:text-white/50 line-clamp-2'>
                                                {log.replyText || log.lastError || '-'}
                                            </p>
                                        </td>

                                        <td className='px-5 py-4'>
                                            {(log.status === 'failed' || log.status === 'queued') ? (
                                                <button
                                                    onClick={() => handleRetryLog(log._id)}
                                                    disabled={loading || retryingLogId === log._id}
                                                    className='px-3 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 disabled:opacity-50'
                                                >
                                                    {retryingLogId === log._id ? 'Retrying...' : 'Retry'}
                                                </button>
                                            ) : (
                                                <span className='text-xs text-gray-400 dark:text-white/35'>
                                                    -
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminFollowUps