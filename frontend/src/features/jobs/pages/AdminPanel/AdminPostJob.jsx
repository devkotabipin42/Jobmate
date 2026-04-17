import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import API_URL from '../../../../config/api.js'

const LOCATIONS = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Chitwan', 'Nawalparasi', 'Parasi', 'Butwal', 'Bhaktapur', 'Biratnagar', 'Birgunj', 'Dharan', 'Remote']
const CATEGORIES = ['IT/Tech', 'Finance/Banking', 'NGO/INGO', 'Marketing', 'Healthcare', 'Education', 'Hospitality', 'Manufacturing', 'Logistics', 'Construction', 'Other']
const TYPES = ['full-time', 'part-time', 'remote', 'contract', 'internship']
const EXPERIENCE = ['fresh', '1-2 years', '3-5 years', '5+ years']

const AdminPostJob = ({ employers }) => {
    const [form, setForm] = useState({
        employer_id: '', title: '', description: '',
        salary_min: '', salary_max: '', location: '',
        category: '', type: 'Full-Time', experience: 'Any',
        deadline: '', cv_required: false, is_featured: false,
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token')
        return { withCredentials: true, headers: token ? { Authorization: `Bearer ${token}` } : {} }
    }

    const handleSubmit = async () => {
        if (!form.employer_id) { setError('Please select an employer'); return }
        if (!form.title) { setError('Title is required'); return }
        if (!form.description) { setError('Description is required'); return }
        if (!form.salary_min || !form.salary_max) { setError('Salary range is required'); return }
        if (!form.location) { setError('Location is required'); return }
        if (!form.category) { setError('Category is required'); return }
        if (!form.deadline) { setError('Deadline is required'); return }

        setLoading(true)
        setError('')
        setSuccess('')
        try {
            const res = await axios.post(`${API_URL}/api/admin/post-job`, form, getAuthHeaders())
            setSuccess(`✅ Job "${res.data.job.title}" posted successfully!`)
            setForm({ employer_id: '', title: '', description: '', salary_min: '', salary_max: '',
                location: '', category: '', type: 'Full-Time', experience: 'Any',
                deadline: '', cv_required: false, is_featured: false })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post job')
        } finally { setLoading(false) }
    }

    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

    const inputClass = 'w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 transition-colors'
    const labelClass = 'block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1.5'

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className='mb-6'>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Post a Job</h2>
                <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>Post a job on behalf of any employer — auto verified & active</p>
            </div>

            <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 space-y-5'>

                {/* Employer */}
                <div>
                    <label className={labelClass}>Select Employer *</label>
                    <select value={form.employer_id} onChange={e => set('employer_id', e.target.value)} className={inputClass}>
                        <option value=''>-- Select Company --</option>
                        {employers?.map(emp => <option key={emp._id} value={emp._id}>{emp.company_name}</option>)}
                    </select>
                </div>

                {/* Title */}
                <div>
                    <label className={labelClass}>Job Title *</label>
                    <input value={form.title} onChange={e => set('title', e.target.value)}
                        placeholder='e.g. Frontend Developer, Sales Officer...' className={inputClass} />
                </div>

                {/* Description */}
                <div>
                    <label className={labelClass}>Description *</label>
                    <textarea value={form.description} onChange={e => set('description', e.target.value)}
                        placeholder='Job description, requirements, responsibilities...'
                        rows={5} className={`${inputClass} resize-none`} />
                </div>

                {/* Salary */}
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className={labelClass}>Min Salary (Rs.) *</label>
                        <input type='number' value={form.salary_min} onChange={e => set('salary_min', e.target.value)}
                            placeholder='25000' className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Max Salary (Rs.) *</label>
                        <input type='number' value={form.salary_max} onChange={e => set('salary_max', e.target.value)}
                            placeholder='40000' className={inputClass} />
                    </div>
                </div>

                {/* Location + Category */}
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className={labelClass}>Location *</label>
                        <select value={form.location} onChange={e => set('location', e.target.value)} className={inputClass}>
                            <option value=''>Select Location</option>
                            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Category *</label>
                        <select value={form.category} onChange={e => set('category', e.target.value)} className={inputClass}>
                            <option value=''>Select Category</option>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Type + Experience */}
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className={labelClass}>Job Type</label>
                        <select value={form.type} onChange={e => set('type', e.target.value)} className={inputClass}>
                            {TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Experience</label>
                        <select value={form.experience} onChange={e => set('experience', e.target.value)} className={inputClass}>
                            {EXPERIENCE.map(ex => <option key={ex}>{ex}</option>)}
                        </select>
                    </div>
                </div>

                {/* Deadline */}
                <div>
                    <label className={labelClass}>Deadline *</label>
                    <input type='date' value={form.deadline} onChange={e => set('deadline', e.target.value)}
                        min={new Date().toISOString().split('T')[0]} className={inputClass} />
                </div>

                {/* Toggles */}
                <div className='flex gap-3 flex-wrap'>
                    {[
                        { field: 'cv_required', label: 'CV Required' },
                        { field: 'is_featured', label: '⭐ Featured Job' },
                    ].map(({ field, label }) => (
                        <button key={field} onClick={() => set(field, !form[field])}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                form[field]
                                    ? 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30 text-green-700 dark:text-green-400'
                                    : 'border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/35'
                            }`}>
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                                form[field] ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-white/20'
                            }`}>
                                {form[field] && <svg className='w-2.5 h-2.5 text-white' fill='none' stroke='currentColor' strokeWidth='3' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>}
                            </div>
                            {label}
                        </button>
                    ))}
                </div>

                {error && <p className='text-xs text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 rounded-xl'>{error}</p>}
                {success && <p className='text-xs text-green-600 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-4 py-3 rounded-xl'>{success}</p>}

                <button onClick={handleSubmit} disabled={loading}
                    className='w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2'>
                    {loading ? (
                        <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className='w-4 h-4 border-2 border-white border-t-transparent rounded-full' />Posting...</>
                    ) : '🚀 Post Job Now'}
                </button>
            </div>
        </motion.div>
    )
}

export default AdminPostJob