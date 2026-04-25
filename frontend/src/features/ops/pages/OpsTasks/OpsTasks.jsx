import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../../../components/Navbar.jsx'
import useOps from '../../hooks/useOps.js'

const OpsTasks = () => {
    const { loading, error, fetchAllTasks, fetchTeam, createNewTask } = useOps()
    const [tasks, setTasks] = useState([])
    const [agents, setAgents] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState('all')
    const [form, setForm] = useState({
        task_type: 'visit',
        assigned_to: '',
        business_name: '',
        address: '',
        area: '',
        longitude: '',
        latitude: '',
        owner_name: '',
        owner_phone: '',
        scheduled_date: new Date().toISOString().slice(0, 16),
        priority: 'normal',
        expected_outcome: 'lead',
        notes_for_agent: ''
    })

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        try {
            const [t, team] = await Promise.all([fetchAllTasks(), fetchTeam()])
            setTasks(t || [])
            setAgents((team || []).filter(m => m.ops_role === 'field_agent' && m.is_active !== false))
        } catch (err) { console.error(err) }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createNewTask({
                task_type: form.task_type,
                assigned_to: form.assigned_to,
                target_business: {
                    name: form.business_name,
                    address: form.address,
                    area: form.area,
                    location: {
                        type: 'Point',
                        coordinates: [Number(form.longitude) || 0, Number(form.latitude) || 0]
                    },
                    owner_name: form.owner_name,
                    owner_phone: form.owner_phone
                },
                scheduled_date: new Date(form.scheduled_date).toISOString(),
                priority: form.priority,
                expected_outcome: form.expected_outcome,
                notes_for_agent: form.notes_for_agent
            })
            setShowForm(false)
            setForm({ ...form, business_name: '', address: '', owner_name: '', owner_phone: '', notes_for_agent: '' })
            loadData()
        } catch (err) { alert(err.response?.data?.message || 'Failed to create task') }
    }

    const statusBadge = (status) => ({
        assigned: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        in_progress: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
        completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        verified: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
        cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    }[status] || 'bg-gray-100 text-gray-700')

    const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='flex justify-between items-center mb-6 flex-wrap gap-3'>
                    <div>
                        <Link to='/ops' className='text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600'>← Dashboard</Link>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>Tasks</h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>{tasks.length} total tasks</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm'>
                        {showForm ? 'Cancel' : '+ New Task'}
                    </button>
                </div>

                {error && <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300'>{error}</div>}

                <AnimatePresence>
                    {showForm && (
                        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden'>
                            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Create New Task</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Task Type *</label>
                                    <select value={form.task_type} onChange={e => setForm({ ...form, task_type: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'>
                                        <option value='visit'>Visit</option>
                                        <option value='survey'>Survey</option>
                                        <option value='follow_up'>Follow-up</option>
                                        <option value='demo'>Demo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Assign to Agent *</label>
                                    <select required value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'>
                                        <option value=''>Select agent</option>
                                        {agents.map(a => <option key={a._id} value={a._id}>{a.full_name}</option>)}
                                    </select>
                                </div>
                                <div className='md:col-span-2'>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Business Name *</label>
                                    <input required value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Address *</label>
                                    <input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Area</label>
                                    <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder='Bhardghat' className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>
                                <div className='md:col-span-2'>
    <details className='border border-gray-200 dark:border-gray-700 rounded-lg p-3'>
        <summary className='cursor-pointer text-xs text-gray-600 dark:text-gray-400 font-medium'>
            GPS coordinates (optional — skip if unknown)
        </summary>
        <div className='grid grid-cols-2 gap-3 mt-3'>
            <div>
                <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Longitude</label>
                <input type='number' step='any' value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} placeholder='Leave blank' className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
            </div>
            <div>
                <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Latitude</label>
                <input type='number' step='any' value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} placeholder='Leave blank' className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
            </div>
        </div>
        <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>If left blank, agent's check-in location will be used as the business location.</p>
    </details>
</div>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Owner Name</label>
                                    <input value={form.owner_name} onChange={e => setForm({ ...form, owner_name: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Owner Phone</label>
                                    <input value={form.owner_phone} onChange={e => setForm({ ...form, owner_phone: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Scheduled Date *</label>
                                    <input required type='datetime-local' value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Priority</label>
                                    <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'>
                                        <option value='low'>Low</option>
                                        <option value='normal'>Normal</option>
                                        <option value='urgent'>Urgent</option>
                                    </select>
                                </div>
                                <div className='md:col-span-2'>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Notes for Agent</label>
                                    <textarea rows='3' value={form.notes_for_agent} onChange={e => setForm({ ...form, notes_for_agent: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>
                            </div>
                            <button type='submit' disabled={loading} className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm'>
                                {loading ? 'Creating...' : 'Create Task'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className='flex gap-2 mb-4 flex-wrap'>
                    {['all', 'assigned', 'in_progress', 'completed', 'verified'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className='space-y-3'>
                    {filteredTasks.map(t => (
                        <div key={t._id} className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4 flex-wrap'>
                            <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2 mb-1 flex-wrap'>
                                    <span className={`text-xs px-2 py-0.5 rounded ${statusBadge(t.status)}`}>{t.status?.replace('_', ' ')}</span>
                                    <span className='text-xs text-gray-500'>{t.task_type}</span>
                                    {t.priority === 'urgent' && <span className='text-xs px-2 py-0.5 rounded bg-red-100 text-red-700'>URGENT</span>}
                                </div>
                                <h3 className='font-semibold text-gray-900 dark:text-white'>{t.target_business?.name}</h3>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>📍 {t.target_business?.address}</p>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>👤 {t.assigned_to?.full_name || 'Unassigned'} · 📅 {new Date(t.scheduled_date).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {filteredTasks.length === 0 && !loading && <p className='text-center text-gray-500 py-8'>No tasks found</p>}
                </div>
            </div>
        </div>
    )
}

export default OpsTasks