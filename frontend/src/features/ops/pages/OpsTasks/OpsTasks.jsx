import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../../../components/Navbar.jsx'
import useOps from '../../hooks/useOps.js'

const formatDateTime = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return date.toLocaleString()
}

const normalizeWhatsAppPhone = (phone = '') => {
    const digits = String(phone).replace(/\D/g, '')
    if (!digits) return ''
    if (digits.startsWith('977')) return digits
    return `977${digits.slice(-10)}`
}

const buildWhatsAppLink = (task) => {
    const phone = task?.target_business?.owner_phone
    const cleanPhone = normalizeWhatsAppPhone(phone)

    if (!cleanPhone) return null

    const message = [
        'Namaste, JobMate bata follow-up ko lagi contact gareko.',
        task?.target_business?.name ? `Task: ${task.target_business.name}` : '',
        task?.notes_for_agent ? 'Details admin le task ma dinu bhayeko cha.' : ''
    ].filter(Boolean).join(' ')

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

const TaskDetailModal = ({ task, onClose, statusBadge }) => {
    if (!task) return null

    const waLink = buildWhatsAppLink(task)

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4'>
            <div className='w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden'>
                <div className='flex items-center justify-between gap-4 p-5 border-b border-gray-100 dark:border-gray-700'>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                            Task Details
                        </h2>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            <span className={`text-xs px-2 py-1 rounded ${statusBadge(task.status)}`}>
                                {task.status?.replace('_', ' ') || 'unknown'}
                            </span>
                            <span className='text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
                                {task.task_type || '-'}
                            </span>
                            {task.priority === 'urgent' && (
                                <span className='text-xs px-2 py-1 rounded bg-red-100 text-red-700'>
                                    URGENT
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className='px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white text-sm hover:bg-gray-200 dark:hover:bg-gray-600'
                    >
                        Close
                    </button>
                </div>

                <div className='p-5 space-y-5 max-h-[75vh] overflow-y-auto'>
                    <div className='grid md:grid-cols-2 gap-4'>
                        <div className='rounded-xl bg-gray-50 dark:bg-gray-900/60 p-4 border border-gray-200 dark:border-gray-700'>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Target / Business</p>
                            <p className='font-semibold text-gray-900 dark:text-white'>
                                {task.target_business?.name || '-'}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                                📍 {task.target_business?.address || '-'}
                            </p>
                            {task.target_business?.area && (
                                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                                    Area: {task.target_business.area}
                                </p>
                            )}
                        </div>

                        <div className='rounded-xl bg-gray-50 dark:bg-gray-900/60 p-4 border border-gray-200 dark:border-gray-700'>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Contact Person</p>
                            <p className='font-semibold text-gray-900 dark:text-white'>
                                {task.target_business?.owner_name || '-'}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                                📞 {task.target_business?.owner_phone || '-'}
                            </p>
                        </div>

                        <div className='rounded-xl bg-gray-50 dark:bg-gray-900/60 p-4 border border-gray-200 dark:border-gray-700'>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Assigned Agent</p>
                            <p className='font-semibold text-gray-900 dark:text-white'>
                                {task.assigned_to?.full_name || 'Unassigned'}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                                {task.assigned_to?.phone || '-'}
                            </p>
                        </div>

                        <div className='rounded-xl bg-gray-50 dark:bg-gray-900/60 p-4 border border-gray-200 dark:border-gray-700'>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Schedule</p>
                            <p className='font-semibold text-gray-900 dark:text-white'>
                                {formatDateTime(task.scheduled_date)}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                                {task.time_window?.start || '09:00'} - {task.time_window?.end || '18:00'}
                            </p>
                        </div>

                        <div className='rounded-xl bg-gray-50 dark:bg-gray-900/60 p-4 border border-gray-200 dark:border-gray-700'>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Priority</p>
                            <p className='font-semibold text-gray-900 dark:text-white capitalize'>
                                {task.priority || '-'}
                            </p>
                        </div>

                        <div className='rounded-xl bg-gray-50 dark:bg-gray-900/60 p-4 border border-gray-200 dark:border-gray-700'>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Expected Outcome</p>
                            <p className='font-semibold text-gray-900 dark:text-white'>
                                {task.expected_outcome?.replace('_', ' ') || '-'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>Notes for Agent</p>
                        <pre className='whitespace-pre-wrap rounded-xl bg-gray-50 dark:bg-gray-900/60 p-4 text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700'>
                            {task.notes_for_agent || 'No notes'}
                        </pre>
                    </div>

                    <div>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>Checklist</p>

                        {(task.checklist || []).length === 0 ? (
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                No checklist
                            </p>
                        ) : (
                            <div className='space-y-2'>
                                {task.checklist.map((item, index) => (
                                    <div
                                        key={`${item.item}-${index}`}
                                        className='flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 p-3 border border-gray-200 dark:border-gray-700'
                                    >
                                        <span className={`w-3 h-3 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        <p className='text-sm text-gray-700 dark:text-gray-200'>
                                            {item.item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col sm:flex-row gap-3'>
                        {waLink && (
                            <a
                                href={waLink}
                                target='_blank'
                                rel='noreferrer'
                                className='flex-1 text-center rounded-xl bg-green-600 text-white font-semibold py-3 hover:bg-green-700'
                            >
                                Open WhatsApp
                            </a>
                        )}

                        <button
                            onClick={onClose}
                            className='flex-1 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-semibold py-3 hover:bg-gray-200 dark:hover:bg-gray-600'
                        >
                            Done Viewing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const OpsTasks = () => {
    const { loading, error, fetchAllTasks, fetchTeam, createNewTask } = useOps()
    const [tasks, setTasks] = useState([])
    const [agents, setAgents] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState('all')
    const [selectedTask, setSelectedTask] = useState(null)

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

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [t, team] = await Promise.all([fetchAllTasks(), fetchTeam()])
            setTasks(t || [])
            setAgents((team || []).filter(m => m.ops_role === 'field_agent' && m.is_active !== false))
        } catch (err) {
            console.error(err)
        }
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
            setForm({
                ...form,
                business_name: '',
                address: '',
                owner_name: '',
                owner_phone: '',
                notes_for_agent: ''
            })
            loadData()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create task')
        }
    }

    const statusBadge = (status) => ({
        assigned: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        in_progress: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
        completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        verified: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
        cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    }[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200')

    const filteredTasks = filter === 'all'
        ? tasks
        : tasks.filter(t => t.status === filter)

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='flex justify-between items-center mb-6 flex-wrap gap-3'>
                    <div>
                        <Link to='/ops' className='text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600'>
                            ← Dashboard
                        </Link>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>
                            Tasks
                        </h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            {tasks.length} total tasks
                        </p>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm'
                    >
                        {showForm ? 'Cancel' : '+ New Task'}
                    </button>
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300'>
                        {error}
                    </div>
                )}

                <AnimatePresence>
                    {showForm && (
                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden'
                        >
                            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                                Create New Task
                            </h2>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Task Type *</label>
                                    <select
                                        value={form.task_type}
                                        onChange={e => setForm({ ...form, task_type: e.target.value })}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                    >
                                        <option value='visit'>Visit</option>
                                        <option value='survey'>Survey</option>
                                        <option value='follow_up'>Follow-up</option>
                                        <option value='demo'>Demo</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Assign to Agent *</label>
                                    <select
                                        required
                                        value={form.assigned_to}
                                        onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                    >
                                        <option value=''>Select agent</option>
                                        {agents.map(a => (
                                            <option key={a._id} value={a._id}>
                                                {a.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Business Name *</label>
                                    <input
                                        required
                                        value={form.business_name}
                                        onChange={e => setForm({ ...form, business_name: e.target.value })}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                    />
                                </div>

                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Address *</label>
                                    <input
                                        required
                                        value={form.address}
                                        onChange={e => setForm({ ...form, address: e.target.value })}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                    />
                                </div>

                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Area</label>
                                    <input
                                        value={form.area}
                                        onChange={e => setForm({ ...form, area: e.target.value })}
                                        placeholder='Bardaghat / Butwal'
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <details className='border border-gray-200 dark:border-gray-700 rounded-lg p-3'>
                                        <summary className='cursor-pointer text-xs text-gray-600 dark:text-gray-400 font-medium'>
                                            GPS coordinates optional — skip if unknown
                                        </summary>

                                        <div className='grid grid-cols-2 gap-3 mt-3'>
                                            <div>
                                                <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Longitude</label>
                                                <input
                                                    type='number'
                                                    step='any'
                                                    value={form.longitude}
                                                    onChange={e => setForm({ ...form, longitude: e.target.value })}
                                                    placeholder='Leave blank'
                                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                                />
                                            </div>

                                            <div>
                                                <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Latitude</label>
                                                <input
                                                    type='number'
                                                    step='any'
                                                    value={form.latitude}
                                                    onChange={e => setForm({ ...form, latitude: e.target.value })}
                                                    placeholder='Leave blank'
                                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                                />
                                            </div>
                                        </div>

                                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                                            If left blank, agent check-in location will be used as the business location.
                                        </p>
                                    </details>
                                </div>

                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Owner Name</label>
                                    <input
                                        value={form.owner_name}
                                        onChange={e => setForm({ ...form, owner_name: e.target.value })}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                    />
                                </div>

                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Owner Phone</label>
                                    <input
                                        value={form.owner_phone}
                                        onChange={e => setForm({ ...form, owner_phone: e.target.value })}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                    />
                                </div>

                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Scheduled Date *</label>
                                    <input
                                        required
                                        type='datetime-local'
                                        value={form.scheduled_date}
                                        onChange={e => setForm({ ...form, scheduled_date: e.target.value })}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                    />
                                </div>

                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Priority</label>
                                    <select
                                        value={form.priority}
                                        onChange={e => setForm({ ...form, priority: e.target.value })}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                    >
                                        <option value='low'>Low</option>
                                        <option value='normal'>Normal</option>
                                        <option value='urgent'>Urgent</option>
                                    </select>
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Notes for Agent</label>
                                    <textarea
                                        rows='3'
                                        value={form.notes_for_agent}
                                        onChange={e => setForm({ ...form, notes_for_agent: e.target.value })}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'
                                    />
                                </div>
                            </div>

                            <button
                                type='submit'
                                disabled={loading}
                                className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm'
                            >
                                {loading ? 'Creating...' : 'Create Task'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className='flex gap-2 mb-4 flex-wrap'>
                    {['all', 'assigned', 'in_progress', 'completed', 'verified'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-full text-xs ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className='space-y-3'>
                    {filteredTasks.map(t => (
                        <div
                            key={t._id}
                            onClick={() => setSelectedTask(t)}
                            className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4 flex-wrap cursor-pointer hover:border-green-500/50 transition'
                        >
                            <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2 mb-1 flex-wrap'>
                                    <span className={`text-xs px-2 py-0.5 rounded ${statusBadge(t.status)}`}>
                                        {t.status?.replace('_', ' ')}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                        {t.task_type}
                                    </span>
                                    {t.priority === 'urgent' && (
                                        <span className='text-xs px-2 py-0.5 rounded bg-red-100 text-red-700'>
                                            URGENT
                                        </span>
                                    )}
                                </div>

                                <h3 className='font-semibold text-gray-900 dark:text-white'>
                                    {t.target_business?.name}
                                </h3>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                    📍 {t.target_business?.address}
                                </p>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                    👤 {t.assigned_to?.full_name || 'Unassigned'} · 📅 {formatDateTime(t.scheduled_date)}
                                </p>
                            </div>

                            <div className='text-xs text-gray-400 dark:text-gray-500'>
                                Click to view
                            </div>
                        </div>
                    ))}

                    {filteredTasks.length === 0 && !loading && (
                        <p className='text-center text-gray-500 py-8'>
                            No tasks found
                        </p>
                    )}
                </div>
            </div>

            <TaskDetailModal
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                statusBadge={statusBadge}
            />
        </div>
    )
}

export default OpsTasks