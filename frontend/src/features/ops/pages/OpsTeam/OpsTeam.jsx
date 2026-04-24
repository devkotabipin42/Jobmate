import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../../../components/Navbar.jsx'
import useOps from '../../hooks/useOps.js'

const OpsTeam = () => {
    const { loading, error, fetchTeam, addTeamMember, editTeamMember, removeTeamMember } = useOps()
    const [members, setMembers] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        user_id: '',
        full_name: '',
        phone: '',
        whatsapp: '',
        ops_role: 'field_agent',
        assigned_areas: '',
        base_amount: 12000,
        visit_incentive: 50,
        conversion_bonus: 500,
        retention_bonus: 2000,
        bank_account_holder: '',
        bank_name: '',
        bank_account_number: '',
        bank_branch: ''
    })

    useEffect(() => { loadMembers() }, [])

    const loadMembers = async () => {
        try {
            const data = await fetchTeam()
            setMembers(data || [])
        } catch (err) { console.error(err) }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addTeamMember({
                user_id: formData.user_id,
                full_name: formData.full_name,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
                ops_role: formData.ops_role,
                assigned_areas: formData.assigned_areas.split(',').map(a => a.trim()).filter(Boolean),
                salary_config: {
                    base_type: 'monthly',
                    base_amount: Number(formData.base_amount),
                    visit_incentive: Number(formData.visit_incentive),
                    conversion_bonus: Number(formData.conversion_bonus),
                    retention_bonus: Number(formData.retention_bonus)
                },
                bank_details: {
                    account_holder: formData.bank_account_holder,
                    bank_name: formData.bank_name,
                    account_number: formData.bank_account_number,
                    branch: formData.bank_branch
                }
            })
            setShowForm(false)
            setFormData({ ...formData, user_id: '', full_name: '', phone: '', whatsapp: '', assigned_areas: '' })
            loadMembers()
        } catch (err) { alert(err.response?.data?.message || 'Failed to add') }
    }

    const handleDeactivate = async (id) => {
        if (!window.confirm('Deactivate this member?')) return
        await removeTeamMember(id)
        loadMembers()
    }

    const roleColor = (role) => ({
        founder: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
        field_agent: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        data_entry: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    }[role] || 'bg-gray-100 text-gray-700')

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='flex justify-between items-center mb-6 flex-wrap gap-3'>
                    <div>
                        <div className='flex gap-3 text-sm text-gray-500 dark:text-gray-400 mb-1'>
                            <Link to='/ops' className='hover:text-blue-600'>← Dashboard</Link>
                        </div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Team Members</h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>{members.length} members</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm'>
                        {showForm ? 'Cancel' : '+ Add Member'}
                    </button>
                </div>

                {error && <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300'>{error}</div>}

                <AnimatePresence>
                    {showForm && (
                        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden'>
                            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Add New Team Member</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='md:col-span-2'>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>User ID (from Users collection) *</label>
                                    <input required value={formData.user_id} onChange={e => setFormData({ ...formData, user_id: e.target.value })} placeholder='MongoDB User ID' className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Full Name *</label>
                                    <input required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Role *</label>
                                    <select value={formData.ops_role} onChange={e => setFormData({ ...formData, ops_role: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'>
                                        <option value='field_agent'>Field Agent</option>
                                        <option value='data_entry'>Data Entry</option>
                                        <option value='founder'>Founder</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Phone *</label>
                                    <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>
                                <div>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>WhatsApp</label>
                                    <input value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>
                                <div className='md:col-span-2'>
                                    <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Assigned Areas (comma-separated)</label>
                                    <input value={formData.assigned_areas} onChange={e => setFormData({ ...formData, assigned_areas: e.target.value })} placeholder='Bhardghat, Butaha, Jimirbar' className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' />
                                </div>

                                <div className='md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700'>
                                    <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-3'>Salary Configuration (NPR)</h3>
                                </div>
                                <div><label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Base Monthly</label><input type='number' value={formData.base_amount} onChange={e => setFormData({ ...formData, base_amount: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' /></div>
                                <div><label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Per Visit Incentive</label><input type='number' value={formData.visit_incentive} onChange={e => setFormData({ ...formData, visit_incentive: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' /></div>
                                <div><label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Conversion Bonus</label><input type='number' value={formData.conversion_bonus} onChange={e => setFormData({ ...formData, conversion_bonus: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' /></div>
                                <div><label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Retention Bonus</label><input type='number' value={formData.retention_bonus} onChange={e => setFormData({ ...formData, retention_bonus: e.target.value })} className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm' /></div>
                            </div>
                            <button type='submit' disabled={loading} className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm'>
                                {loading ? 'Adding...' : 'Add Member'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {members.map(m => (
                        <motion.div key={m._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700'>
                            <div className='flex items-start justify-between mb-3'>
                                <div className='w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center'>
                                    <span className='text-lg font-bold text-blue-600 dark:text-blue-300'>{m.full_name?.charAt(0)}</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${roleColor(m.ops_role)}`}>{m.ops_role?.replace('_', ' ')}</span>
                            </div>
                            <h3 className='font-semibold text-gray-900 dark:text-white'>{m.full_name}</h3>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>📞 {m.phone}</p>
                            {m.assigned_areas?.length > 0 && (
                                <div className='mt-2 flex flex-wrap gap-1'>
                                    {m.assigned_areas.map((a, i) => <span key={i} className='text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>{a}</span>)}
                                </div>
                            )}
                            <div className='mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400'>
                                Base: NPR {m.salary_config?.base_amount?.toLocaleString() || 0}/mo
                            </div>
                            {m.is_active === false && <span className='text-xs text-red-500 mt-2 block'>Inactive</span>}
                            <button onClick={() => handleDeactivate(m._id)} className='mt-3 text-xs text-red-600 hover:underline'>Deactivate</button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OpsTeam