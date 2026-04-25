import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../../../components/Navbar.jsx'
import useOps from '../../hooks/useOps.js'

const OpsDashboard = () => {
    const {
        loading, error,
        fetchStats, fetchActivity, fetchPerformance, fetchPendingReviews
    } = useOps()

    const [stats, setStats] = useState(null)
    const [activities, setActivities] = useState([])
    const [performance, setPerformance] = useState([])
    const [pendingCount, setPendingCount] = useState(0)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        loadDashboard()
    }, [refreshKey])

    const loadDashboard = async () => {
        try {
            const [s, a, p, pr] = await Promise.all([
                fetchStats(),
                fetchActivity(),
                fetchPerformance(),
                fetchPendingReviews()
            ])
            setStats(s)
            setActivities(a || [])
            setPerformance(p || [])
            setPendingCount(pr?.length || 0)
        } catch (err) {
            console.error('Dashboard load failed:', err)
        }
    }

    const getReactionColor = (reaction) => {
        const map = {
            very_interested: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            interested: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            neutral: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
            not_interested: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
        }
        return map[reaction] || map.neutral
    }

    const timeAgo = (date) => {
        const now = new Date()
        const then = new Date(date)
        const diff = Math.floor((now - then) / 1000)
        if (diff < 60) return `${diff}s ago`
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        return `${Math.floor(diff / 86400)}d ago`
    }

    const metricCards = [
        { label: 'Active Agents', value: stats ? `${stats.activeAgents}/${stats.totalAgents}` : '—', color: 'text-blue-600 dark:text-blue-400' },
        { label: "Today's Visits", value: stats?.todaysVisits ?? '—', color: 'text-purple-600 dark:text-purple-400' },
        { label: 'Conversions', value: stats?.todaysConversions ?? '—', color: 'text-green-600 dark:text-green-400' },
        { label: 'Pending Review', value: pendingCount, color: 'text-amber-600 dark:text-amber-400' }
    ]

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>

                {/* Header */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>JobMate Ops</h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Field operations overview · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        <Link to='/ops/tasks' className='px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition'>
                            + New Task
                        </Link>
                        <Link to='/ops/leads' className='px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition'>
    Leads
</Link>
                        <Link to='/ops/data-entry' className='px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
                            Review Queue ({pendingCount})
                        </Link>
                        <button onClick={() => setRefreshKey(k => k + 1)} className='px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition'>
                            ↻ Refresh
                        </button>
                    </div>
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300'>
                        {error}
                    </div>
                )}

                {/* Metric cards */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    {metricCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'
                        >
                            <p className='text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider'>{card.label}</p>
                            <p className={`text-2xl font-semibold mt-1 ${card.color}`}>
                                {loading && !stats ? '...' : card.value}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Main grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6'>

                    {/* Recent Activity - 2 cols */}
                    <div className='lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Recent Field Activity</h2>
                            <Link to='/ops/tasks' className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
                                View all →
                            </Link>
                        </div>

                        {activities.length === 0 && !loading && (
                            <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                                <p className='text-sm'>No activity yet</p>
                                <p className='text-xs mt-1'>Create a task to get your agents started</p>
                            </div>
                        )}

                        <div className='space-y-3'>
                            <AnimatePresence>
                                {activities.map((a) => (
                                    <motion.div
                                        key={a._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition'
                                    >
                                        <div className='w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0'>
                                            <span className='text-sm font-semibold text-blue-600 dark:text-blue-300'>
                                                {a.agent?.full_name?.charAt(0) || '?'}
                                            </span>
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center justify-between gap-2'>
                                                <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                                                    {a.agent?.full_name || 'Agent'} visited {a.business_info?.name || a.task?.target_business?.name || 'business'}
                                                </p>
                                                <span className='text-xs text-gray-500 dark:text-gray-400 flex-shrink-0'>
                                                    {timeAgo(a.createdAt)}
                                                </span>
                                            </div>
                                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate'>
                                                {a.business_info?.address || a.task?.target_business?.address || '—'}
                                            </p>
                                            <div className='flex items-center gap-2 mt-2 flex-wrap'>
                                                {a.pitch_outcome?.reaction && (
                                                    <span className={`text-xs px-2 py-0.5 rounded ${getReactionColor(a.pitch_outcome.reaction)}`}>
                                                        {a.pitch_outcome.reaction.replace('_', ' ')}
                                                    </span>
                                                )}
                                                {a.quality_flags?.length > 0 && (
                                                    <span className='text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'>
                                                        {a.quality_flags.length} flag{a.quality_flags.length > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                                {a.crm_lead_id && (
                                                    <span className='text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'>
                                                        ✓ Lead created
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Pipeline Summary - 1 col */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5'>
                        <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Today's Pipeline</h2>

                        <div className='space-y-3'>
                            <div className='flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700'>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>Visits completed</span>
                                <span className='text-sm font-semibold text-gray-900 dark:text-white'>{stats?.todaysVisits ?? 0}</span>
                            </div>
                            <div className='flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700'>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>Pending review</span>
                                <span className='text-sm font-semibold text-amber-600 dark:text-amber-400'>{pendingCount}</span>
                            </div>
                            <div className='flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700'>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>Conversions</span>
                                <span className='text-sm font-semibold text-green-600 dark:text-green-400'>{stats?.todaysConversions ?? 0}</span>
                            </div>
                            <div className='flex items-center justify-between py-2'>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>Conversion rate</span>
                                <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                                    {stats?.todaysVisits > 0 ? Math.round((stats.todaysConversions / stats.todaysVisits) * 100) : 0}%
                                </span>
                            </div>
                        </div>

                        <Link to='/ops/data-entry' className='block text-center w-full mt-4 py-2 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition'>
                            Open pipeline →
                        </Link>
                    </div>
                </div>

                {/* Agent Performance */}
                <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5'>
                    <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Agent Performance — This Month</h2>

                    {performance.length === 0 && !loading && (
                        <p className='text-sm text-gray-500 dark:text-gray-400 text-center py-6'>
                            No agents yet. <Link to='/ops/team' className='text-blue-600 dark:text-blue-400 hover:underline'>Add your first team member →</Link>
                        </p>
                    )}

                    <div className='space-y-4'>
                        {performance.map((p) => {
                            const maxVisits = Math.max(...performance.map(x => x.visits_count), 1)
                            const percent = (p.visits_count / maxVisits) * 100

                            return (
                                <div key={p.agent._id}>
                                    <div className='flex items-center justify-between mb-1'>
                                        <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                            {p.agent.full_name}
                                        </span>
                                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                                            {p.visits_count} visits · {p.conversions_count} conversions
                                        </span>
                                    </div>
                                    <div className='h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ duration: 0.6 }}
                                            className='h-full bg-blue-500 dark:bg-blue-400 rounded-full'
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default OpsDashboard