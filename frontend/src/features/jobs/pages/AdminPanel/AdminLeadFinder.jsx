import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useAdmin from '../../hooks/useAdmin.js'

const priorityClasses = {
    high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
    low: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-white/45 dark:border-white/10'
}

const verificationClasses = {
    verified: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20',
    needs_review: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
    rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20',
    unverified: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-white/45 dark:border-white/10'
}

const formatLabel = (value = '') => String(value).replace(/_/g, ' ')

const AdminLeadFinder = () => {
    const { loading, error, getLeadFinderLeads, runLeadFinder } = useAdmin()
    const [leads, setLeads] = useState([])
    const [form, setForm] = useState({
        city: '',
        sector: '',
        count: 10,
        outputLanguage: 'english'
    })
    const [notice, setNotice] = useState('')
    const [copiedId, setCopiedId] = useState('')

    useEffect(() => {
        loadLeads()
    }, [])

    const loadLeads = async () => {
        const data = await getLeadFinderLeads()
        setLeads(data?.leads || [])
    }

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setNotice('')

        const result = await runLeadFinder({
            ...form,
            count: Number(form.count)
        })

        if (!result) return

        setNotice(`${result.count || 0} leads saved from ${formatLabel(result.sourceType || 'lead finder')}.`)
        await loadLeads()
    }

    const handleCopyMessage = async (lead) => {
        const message = lead?.outreachMessage || ''
        if (!message) return

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(message)
            } else {
                const textarea = document.createElement('textarea')
                textarea.value = message
                textarea.setAttribute('readonly', '')
                textarea.style.position = 'absolute'
                textarea.style.left = '-9999px'
                document.body.appendChild(textarea)
                textarea.select()
                document.execCommand('copy')
                document.body.removeChild(textarea)
            }
            setCopiedId(lead._id)
            window.setTimeout(() => setCopiedId(''), 1500)
        } catch (err) {
            setNotice('Could not copy message.')
        }
    }

    return (
        <motion.div
            key='lead-finder'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='min-w-0 max-w-full space-y-6'
        >
            <div className='min-w-0 max-w-full bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-4 sm:p-5'>
                <form onSubmit={handleSubmit} className='flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end'>
                    <div className='min-w-0 sm:basis-[160px] sm:flex-1'>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/35 mb-1'>City</label>
                        <input
                            type='text'
                            value={form.city}
                            onChange={e => handleChange('city', e.target.value)}
                            required
                            className='min-w-0 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white outline-none focus:border-green-500'
                        />
                    </div>
                    <div className='min-w-0 sm:basis-[160px] sm:flex-1'>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/35 mb-1'>Sector</label>
                        <input
                            type='text'
                            value={form.sector}
                            onChange={e => handleChange('sector', e.target.value)}
                            required
                            className='min-w-0 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white outline-none focus:border-green-500'
                        />
                    </div>
                    <div className='min-w-0 sm:basis-24 sm:flex-none'>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/35 mb-1'>Count</label>
                        <input
                            type='number'
                            min='1'
                            max='50'
                            value={form.count}
                            onChange={e => handleChange('count', e.target.value)}
                            required
                            className='min-w-0 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white outline-none focus:border-green-500'
                        />
                    </div>
                    <div className='min-w-0 sm:basis-[180px] sm:flex-1'>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/35 mb-1'>Output Language</label>
                        <select
                            value={form.outputLanguage}
                            onChange={e => handleChange('outputLanguage', e.target.value)}
                            className='min-w-0 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white outline-none focus:border-green-500'
                        >
                            <option value='english'>English</option>
                            <option value='nepali'>Nepali</option>
                            <option value='roman_nepali'>Roman Nepali</option>
                        </select>
                    </div>
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full sm:w-auto sm:flex-none px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold whitespace-nowrap hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Running...' : 'Run Search'}
                    </button>
                </form>

                {(error || notice) && (
                    <div className={`mt-4 rounded-xl px-4 py-3 text-sm border ${
                        error
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20'
                            : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20'
                    }`}>
                        {error || notice}
                    </div>
                )}
            </div>

            <div className='min-w-0 max-w-full bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl overflow-hidden'>
                <div className='flex min-w-0 items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/7'>
                    <div className='min-w-0'>
                        <h2 className='text-sm font-bold text-gray-800 dark:text-white'>Lead Finder Results</h2>
                        <p className='text-xs text-gray-500 dark:text-white/35 mt-0.5'>{leads.length} saved leads</p>
                    </div>
                    <button
                        type='button'
                        onClick={loadLeads}
                        disabled={loading}
                        className='flex-none px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60'
                    >
                        Refresh
                    </button>
                </div>

                <div className='min-w-0 max-w-full overflow-x-auto'>
                    <table className='min-w-[1200px] w-full text-sm'>
                        <thead className='bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500 dark:text-white/35'>
                            <tr>
                                <th className='text-left font-semibold px-4 py-3'>Company</th>
                                <th className='text-left font-semibold px-4 py-3'>City</th>
                                <th className='text-left font-semibold px-4 py-3'>Sector</th>
                                <th className='text-left font-semibold px-4 py-3'>Phone</th>
                                <th className='text-left font-semibold px-4 py-3'>Source</th>
                                <th className='text-left font-semibold px-4 py-3'>Score</th>
                                <th className='text-left font-semibold px-4 py-3'>Priority</th>
                                <th className='text-left font-semibold px-4 py-3'>Outreach Message</th>
                                <th className='text-left font-semibold px-4 py-3'>Verification Status</th>
                                <th className='text-left font-semibold px-4 py-3'>Duplicate Flag</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 dark:divide-white/7'>
                            {leads.map(lead => (
                                <tr key={lead._id} className='hover:bg-gray-50 dark:hover:bg-white/4'>
                                    <td className='px-4 py-3 font-semibold text-gray-800 dark:text-white'>{lead.company || '-'}</td>
                                    <td className='px-4 py-3 text-gray-600 dark:text-white/50'>{lead.city || '-'}</td>
                                    <td className='px-4 py-3 text-gray-600 dark:text-white/50'>{lead.sector || '-'}</td>
                                    <td className='px-4 py-3 text-gray-600 dark:text-white/50'>
                                        <div className='space-y-1'>
                                            <p className='font-mono text-xs'>{lead.phone || '-'}</p>
                                            <p className='text-[11px] capitalize'>{formatLabel(lead.phoneType || 'unknown')}</p>
                                        </div>
                                    </td>
                                    <td className='px-4 py-3 text-gray-600 dark:text-white/50'>
                                        <div className='space-y-1'>
                                            <p>{formatLabel(lead.source || '-')}</p>
                                            <p className='text-[11px]'>{formatLabel(lead.sourceType || '')}</p>
                                        </div>
                                    </td>
                                    <td className='px-4 py-3 text-gray-800 dark:text-white font-semibold'>{lead.score ?? 0}</td>
                                    <td className='px-4 py-3'>
                                        <span className={`inline-flex px-2 py-1 rounded-full border text-xs font-semibold capitalize ${priorityClasses[lead.priority] || priorityClasses.low}`}>
                                            {lead.priority || 'low'}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 text-gray-600 dark:text-white/55 w-[320px]'>
                                        <div className='space-y-2'>
                                            <p className='text-xs leading-relaxed whitespace-normal'>{lead.outreachMessage || '-'}</p>
                                            <button
                                                type='button'
                                                onClick={() => handleCopyMessage(lead)}
                                                disabled={!lead.outreachMessage}
                                                className='px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-600 dark:text-white/55 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50'
                                            >
                                                {copiedId === lead._id ? 'Copied' : 'Copy Message'}
                                            </button>
                                        </div>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span className={`inline-flex px-2 py-1 rounded-full border text-xs font-semibold capitalize ${verificationClasses[lead.verificationStatus] || verificationClasses.unverified}`}>
                                            {formatLabel(lead.verificationStatus || 'unverified')}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span className={`inline-flex px-2 py-1 rounded-full border text-xs font-semibold ${
                                            lead.duplicateWarning
                                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-white/45 dark:border-white/10'
                                        }`}>
                                            {lead.duplicateWarning ? 'Duplicate' : 'Clear'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan='10' className='px-4 py-12 text-center text-sm text-gray-500 dark:text-white/35'>
                                        No lead finder records yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    )
}

export default AdminLeadFinder
