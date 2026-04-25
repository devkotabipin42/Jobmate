import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../../../components/Navbar.jsx'
import useOps from '../../hooks/useOps.js'

const REACTION_LABELS = {
    very_interested: { label: 'Very Interested', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    interested: { label: 'Interested', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    neutral: { label: 'Neutral', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' },
    not_interested: { label: 'Not Interested', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
}

const NEXT_ACTION_LABELS = {
    signup_now: 'Sign up now',
    demo_scheduled: 'Demo scheduled',
    call_later: 'Call back later',
    brochure: 'Send brochure',
    dead: 'Dead lead'
}

const OpsLeads = () => {
    const { loading, error, fetchApprovedLeads } = useOps()
    const [leads, setLeads] = useState([])
    const [search, setSearch] = useState('')
    const [reactionFilter, setReactionFilter] = useState('')
    const [actionFilter, setActionFilter] = useState('')

    useEffect(() => { load() }, [reactionFilter, actionFilter])

    const load = async () => {
        try {
            const params = {}
            if (reactionFilter) params.reaction = reactionFilter
            if (actionFilter) params.next_action = actionFilter
            const data = await fetchApprovedLeads(params)
            setLeads(data || [])
        } catch (err) { console.error(err) }
    }

    const filteredLeads = useMemo(() => {
        if (!search) return leads
        const q = search.toLowerCase()
        return leads.filter(l =>
            l.business_info?.name?.toLowerCase().includes(q) ||
            l.business_info?.owner_name?.toLowerCase().includes(q) ||
            l.business_info?.owner_phone?.includes(q)
        )
    }, [leads, search])

    const groupedByAction = useMemo(() => {
        const groups = {}
        filteredLeads.forEach(lead => {
            const action = lead.pitch_outcome?.next_action || 'unknown'
            if (!groups[action]) groups[action] = []
            groups[action].push(lead)
        })
        return groups
    }, [filteredLeads])

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>

                <div className='mb-6 flex flex-wrap justify-between items-end gap-4'>
                    <div>
                        <Link to='/ops' className='text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600'>
                            ← Dashboard
                        </Link>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>Approved Leads</h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            {filteredLeads.length} leads · ready for follow-up
                        </p>
                    </div>
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300'>
                        {error}
                    </div>
                )}

                <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                        <input
                            type='text'
                            placeholder='Search by name, phone...'
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                        />
                        <select
                            value={reactionFilter}
                            onChange={e => setReactionFilter(e.target.value)}
                            className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                        >
                            <option value=''>All reactions</option>
                            <option value='very_interested'>Very Interested</option>
                            <option value='interested'>Interested</option>
                            <option value='neutral'>Neutral</option>
                            <option value='not_interested'>Not Interested</option>
                        </select>
                        <select
                            value={actionFilter}
                            onChange={e => setActionFilter(e.target.value)}
                            className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                        >
                            <option value=''>All next actions</option>
                            <option value='signup_now'>Sign up now</option>
                            <option value='demo_scheduled'>Demo scheduled</option>
                            <option value='call_later'>Call back later</option>
                            <option value='brochure'>Send brochure</option>
                            <option value='dead'>Dead lead</option>
                        </select>
                    </div>
                </div>

                {filteredLeads.length === 0 && !loading && (
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700'>
                        <p className='text-gray-500 dark:text-gray-400 font-medium'>No approved leads yet</p>
                        <p className='text-xs text-gray-400 mt-1'>Approve field visits to populate leads here</p>
                    </div>
                )}

                <div className='space-y-3'>
                    {filteredLeads.map(lead => {
                        const reactionStyle = REACTION_LABELS[lead.pitch_outcome?.reaction] || REACTION_LABELS.neutral

                        return (
                            <motion.div
                                key={lead._id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition'
                            >
                                <div className='flex flex-wrap justify-between items-start gap-3'>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-2 flex-wrap mb-2'>
                                            <h3 className='font-semibold text-gray-900 dark:text-white'>
                                                {lead.business_info?.name}
                                            </h3>
                                            <span className={`text-xs px-2 py-0.5 rounded ${reactionStyle.color}`}>
                                                {reactionStyle.label}
                                            </span>
                                            {lead.pitch_outcome?.next_action && (
                                                <span className='text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'>
                                                    {NEXT_ACTION_LABELS[lead.pitch_outcome.next_action]}
                                                </span>
                                            )}
                                        </div>

                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-2 text-sm'>
                                            <div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>Owner</p>
                                                <p className='text-gray-900 dark:text-white font-medium'>{lead.business_info?.owner_name || '—'}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>Phone</p>
                                                <a href={`tel:${lead.business_info?.owner_phone}`} className='text-blue-600 dark:text-blue-400 font-medium font-mono hover:underline'>
                                                    {lead.business_info?.owner_phone || '—'}
                                                </a>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>Hiring</p>
                                                <p className='text-gray-900 dark:text-white font-medium capitalize'>
                                                    {lead.hiring_needs?.looking_to_hire || '—'}
                                                    {lead.hiring_needs?.positions && ` · ${lead.hiring_needs.positions}`}
                                                </p>
                                            </div>
                                        </div>

                                        {lead.pitch_outcome?.agent_notes && (
                                            <p className='text-sm text-gray-600 dark:text-gray-400 mt-2 italic'>
                                                "{lead.pitch_outcome.agent_notes}"
                                            </p>
                                        )}

                                        <div className='flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400'>
                                            <span>Agent: {lead.agent?.full_name}</span>
                                            <span>·</span>
                                            <span>{new Date(lead.reviewed_at).toLocaleDateString()}</span>
                                            {lead.business_info?.address && (
                                                <>
                                                    <span>·</span>
                                                    <span>{lead.business_info.address}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex gap-2'>
                                        {lead.business_info?.whatsapp && (
                                            
                                           <a     href={`https://wa.me/977${lead.business_info.whatsapp}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium'
                                            >
                                                WhatsApp
                                            </a>
                                        )}
                                        {lead.business_info?.owner_phone && (
                                            
                                             <a   href={`tel:${lead.business_info.owner_phone}`}
                                                className='px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium'
                                            >
                                                Call
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default OpsLeads