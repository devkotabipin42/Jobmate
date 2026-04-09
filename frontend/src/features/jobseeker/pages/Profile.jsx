import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../auth/hooks/useAuth.js'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import Footer from '../../../components/Footer.jsx'

const Profile = () => {
    const { user, updateProfile, handleCVUpload, handleCVDelete, handleAlertsSubmit, submitTestimonial, uploadAvatar } = useAuth()

    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '', location: user?.location || '' })
    const [testimonialForm, setTestimonialForm] = useState({ name: user?.name || '', role: '', company: '', text: '', rating: 5 })
    const [testimonialLoading, setTestimonialLoading] = useState(false)
    const [testimonialSuccess, setTestimonialSuccess] = useState(false)
    const [cvUploading, setCvUploading] = useState(false)
    const [cvSuccess, setCvSuccess] = useState(false)
    const [cvDeleting, setCvDeleting] = useState(false)
    const [alerts, setAlerts] = useState({
        enabled: user?.job_alerts?.enabled || false,
        categories: user?.job_alerts?.categories || [],
        locations: user?.job_alerts?.locations || [],
        job_types: user?.job_alerts?.job_types || []
    })
    const [alertsSaving, setAlertsSaving] = useState(false)
    const [alertsSuccess, setAlertsSuccess] = useState(false)

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await updateProfile(formData)
            setSuccess(true)
            setEditing(false)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed')
        } finally {
            setLoading(false)
        }
    }

    const onCVUpload = async (e) => {
        const file = e.target.files[0]
        setCvUploading(true)
        try { await handleCVUpload(file); setCvSuccess(true); setTimeout(() => setCvSuccess(false), 3000) }
        catch (err) { console.log(err) }
        finally { setCvUploading(false) }
    }

    const onCVDelete = async () => {
        setCvDeleting(true)
        try { await handleCVDelete() }
        catch (err) { console.log(err) }
        finally { setCvDeleting(false) }
    }

    const onAlertsSubmit = async () => {
        setAlertsSaving(true)
        try { await handleAlertsSubmit(alerts); setAlertsSuccess(true); setTimeout(() => setAlertsSuccess(false), 3000) }
        catch (err) { console.log(err) }
        finally { setAlertsSaving(false) }
    }

    const handleTestimonialSubmit = async () => {
        setTestimonialLoading(true)
        try { await submitTestimonial(testimonialForm); setTestimonialSuccess(true); setTimeout(() => setTestimonialSuccess(false), 3000) }
        catch (err) { console.log(err) }
        finally { setTestimonialLoading(false) }
    }

    const inputClass = 'w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 transition-colors'

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-[#08111f] transition-colors duration-300'>
            <div className='fixed inset-0 opacity-0 dark:opacity-100 pointer-events-none'
                style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <Navbar />

            <div className='max-w-2xl mx-auto px-4 sm:px-6 py-8 relative z-10'>

                {/* Success toast */}
                <AnimatePresence>
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className='flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-xl mb-4'>
                            <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                            Profile updated successfully!
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── PROFILE CARD ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl overflow-hidden mb-4'>

                    {/* Cover */}
                    <div className='h-28 relative bg-gradient-to-br from-green-600 to-green-800 dark:from-green-900 dark:to-[#0c1a2e]'>
                        <div className='absolute inset-0 opacity-20'
                            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    </div>

                    <div className='px-6 pb-6'>
                        <div className='flex items-end justify-between -mt-10 mb-5'>
                            {/* Avatar */}
                            <div className='relative'>
                                <div className='w-20 h-20 rounded-2xl bg-white dark:bg-[#0c1a2e] border-4 border-white dark:border-[#08111f] flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-3xl shadow-sm overflow-hidden'>
                                    {user?.avatar_url
                                        ? <img src={user.avatar_url} alt='avatar' className='w-full h-full object-cover' />
                                        : user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <label className='absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors'>
                                    <svg className='w-3.5 h-3.5 text-white' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/><circle cx='12' cy='13' r='4'/></svg>
                                    <input type='file' accept='image/*' onChange={async (e) => {
                                        const file = e.target.files[0]
                                        if (!file) return
                                        try { await uploadAvatar(file) } catch (err) { console.log(err) }
                                    }} className='hidden' />
                                </label>
                            </div>

                            <button onClick={() => setEditing(!editing)}
                                className='text-sm border border-gray-200 dark:border-white/8 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/3 dark:text-white/60 transition-colors'>
                                {editing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        <h1 className='text-xl font-bold text-gray-800 dark:text-white mb-1'>{user?.name}</h1>
                        <p className='text-sm text-gray-500 dark:text-white/35'>{user?.email}</p>

                        {/* Info grid */}
                        <div className='grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-100 dark:border-white/5'>
                            {[
                                { label: 'Phone', value: user?.phone || 'Not added', icon: <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10a16 16 0 0 0 6 6z'/></svg> },
                                { label: 'Location', value: user?.location || 'Not added', icon: <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/><circle cx='12' cy='10' r='3'/></svg> },
                                { label: 'Role', value: 'Job Seeker', icon: <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg> },
                                { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString(), icon: <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='4' width='18' height='18' rx='2'/><line x1='16' y1='2' x2='16' y2='6'/><line x1='8' y1='2' x2='8' y2='6'/><line x1='3' y1='10' x2='21' y2='10'/></svg> },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className='flex items-center gap-1 text-xs text-gray-400 dark:text-white/25 mb-1'>
                                        <span className='text-gray-400 dark:text-white/25'>{item.icon}</span>
                                        {item.label}
                                    </p>
                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Edit form */}
                    <AnimatePresence>
                        {editing && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className='border-t border-gray-100 dark:border-white/5 px-6 py-5'>
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Edit Profile</h3>
                                {error && (
                                    <div className='bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-4'>{error}</div>
                                )}
                                <form onSubmit={handleSubmit} className='space-y-4'>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Full Name</label>
                                        <input type='text' name='name' value={formData.name} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Phone</label>
                                        <input type='text' name='phone' value={formData.phone} onChange={handleChange} placeholder='98XXXXXXXX' className={inputClass} />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Location</label>
                                        <select name='location' value={formData.location} onChange={handleChange} className={inputClass}>
                                            <option value=''>Select location</option>
                                            {['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal', 'Other'].map(l => (
                                                <option key={l} className='dark:bg-[#0c1a2e]'>{l}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type='submit' disabled={loading}
                                        className='w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors'>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── QUICK LINKS ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5 mb-4'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-3'>Quick Links</h3>
                    <div className='grid grid-cols-2 gap-2'>
                        {[
                            { label: 'My Applications', path: '/my-applications', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg> },
                            { label: 'Saved Jobs', path: '/saved-jobs', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'/></svg> },
                            { label: 'Browse Jobs', path: '/jobs', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='2' y='7' width='20' height='14' rx='2'/><path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'/></svg> },
                            { label: 'Career Tips', path: '/career-tips', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M12 16v-4M12 8h.01'/></svg> },
                            { label: 'Resume Builder', path: '/resume-builder', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'/><path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'/></svg> },
                            { label: 'Support', path: '/support', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/></svg> },
                        ].map((link, i) => (
                            <Link key={i} to={link.path}
                                className='flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/3 transition-colors group'>
                                <span className='text-gray-400 dark:text-white/25 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors'>{link.icon}</span>
                                <span className='text-sm text-gray-600 dark:text-white/50 group-hover:text-gray-800 dark:group-hover:text-white transition-colors'>{link.label}</span>
                                <svg className='w-3.5 h-3.5 ml-auto text-gray-300 dark:text-white/15 group-hover:text-green-500 transition-colors' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M5 12h14M12 5l7 7-7 7'/></svg>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* ── CV SECTION ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 mb-4'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2'>
                        <svg className='w-4 h-4 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><polyline points='10 9 9 9 8 9'/></svg>
                        My CV / Resume
                    </h3>

                    {user?.cv_url && (
                        <div className='flex items-center gap-3 mb-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl'>
                            <div className='w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center shrink-0'>
                                <svg className='w-5 h-5 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>
                            </div>
                            <div className='flex-1'>
                                <p className='text-xs font-semibold text-green-700 dark:text-green-400'>CV Uploaded</p>
                                <a href={user.cv_url} download className='text-xs text-green-600 dark:text-green-400 hover:underline flex items-center gap-1'>
                                    <svg className='w-3 h-3' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='7 10 12 15 17 10'/><line x1='12' y1='15' x2='12' y2='3'/></svg>
                                    Download CV
                                </a>
                            </div>
                            <button onClick={onCVDelete} disabled={cvDeleting}
                                className='text-xs text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/5 border border-red-200 dark:border-red-500/20 transition-colors'>
                                {cvDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    )}

                    {cvSuccess && (
                        <div className='bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl mb-3 text-xs flex items-center gap-2'>
                            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                            CV uploaded successfully!
                        </div>
                    )}

                    <label className='flex items-center gap-4 cursor-pointer border-2 border-dashed border-gray-200 dark:border-white/8 rounded-2xl p-4 hover:border-green-400 dark:hover:border-green-500/40 transition-colors group'>
                        <input type='file' accept='.pdf,.doc,.docx' onChange={onCVUpload} className='hidden' />
                        <div className='w-11 h-11 bg-gray-50 dark:bg-white/5 group-hover:bg-green-50 dark:group-hover:bg-green-500/10 rounded-xl flex items-center justify-center shrink-0 transition-colors'>
                            {cvUploading
                                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className='w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full' />
                                : <svg className='w-5 h-5 text-gray-400 dark:text-white/25 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='17 8 12 3 7 8'/><line x1='12' y1='3' x2='12' y2='15'/></svg>
                            }
                        </div>
                        <div>
                            <p className='text-sm font-semibold text-gray-800 dark:text-white'>
                                {cvUploading ? 'Uploading...' : user?.cv_url ? 'Update CV' : 'Upload CV'}
                            </p>
                            <p className='text-xs text-gray-400 dark:text-white/25'>PDF, DOC, DOCX — Max 10MB</p>
                        </div>
                    </label>
                </motion.div>

                {/* ── JOB ALERTS ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 mb-4'>
                    <div className='flex items-center justify-between mb-4'>
                        <div>
                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2'>
                                <svg className='w-4 h-4 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'/><path d='M13.73 21a2 2 0 0 1-3.46 0'/></svg>
                                Job Alerts
                            </h3>
                            <p className='text-xs text-gray-400 dark:text-white/25 mt-0.5'>Get email when new jobs match your preferences</p>
                        </div>
                        <button onClick={() => setAlerts({ ...alerts, enabled: !alerts.enabled })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${alerts.enabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-white/10'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${alerts.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <AnimatePresence>
                        {alerts.enabled && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className='space-y-4'>
                                {[
                                    { label: 'Categories', key: 'categories', options: ['IT/Tech', 'Finance/Banking', 'NGO/INGO', 'Healthcare', 'Education', 'Marketing'] },
                                    { label: 'Locations', key: 'locations', options: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Remote'] },
                                    { label: 'Job Types', key: 'job_types', options: ['full-time', 'part-time', 'remote', 'internship', 'contract'] },
                                ].map(({ label, key, options }) => (
                                    <div key={key}>
                                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>{label}</label>
                                        <div className='flex flex-wrap gap-2'>
                                            {options.map(opt => (
                                                <button key={opt} onClick={() => {
                                                    const arr = alerts[key].includes(opt) ? alerts[key].filter(x => x !== opt) : [...alerts[key], opt]
                                                    setAlerts({ ...alerts, [key]: arr })
                                                }}
                                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
                                                        alerts[key].includes(opt)
                                                            ? 'bg-green-600 text-white border-green-600'
                                                            : 'border-gray-200 dark:border-white/8 text-gray-600 dark:text-white/40 hover:border-green-400 dark:hover:border-green-500/40'
                                                    }`}>{opt}</button>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {alertsSuccess && (
                                    <div className='bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2'>
                                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                                        Job alerts saved!
                                    </div>
                                )}

                                <button onClick={onAlertsSubmit} disabled={alertsSaving}
                                    className='w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors'>
                                    {alertsSaving ? 'Saving...' : 'Save Job Alerts'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── TESTIMONIAL ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 mb-4'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1 flex items-center gap-2'>
                        <svg className='w-4 h-4 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/></svg>
                        Share Your Experience
                    </h3>
                    <p className='text-xs text-gray-400 dark:text-white/25 mb-4'>Help others by sharing your Jobmate experience</p>

                    {testimonialSuccess && (
                        <div className='bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs px-4 py-2.5 rounded-xl mb-3 flex items-center gap-2'>
                            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                            Submitted! Admin will review it soon.
                        </div>
                    )}

                    <div className='space-y-3'>
                        <input type='text' placeholder='Your role (e.g. Software Engineer)' value={testimonialForm.role}
                            onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })} className={inputClass} />
                        <input type='text' placeholder='Company (e.g. Hired at TechCorp Nepal)' value={testimonialForm.company}
                            onChange={e => setTestimonialForm({ ...testimonialForm, company: e.target.value })} className={inputClass} />
                        <textarea placeholder='Share your experience with Jobmate...' value={testimonialForm.text}
                            onChange={e => setTestimonialForm({ ...testimonialForm, text: e.target.value })} rows={3}
                            className={`${inputClass} resize-none`} />
                        <select value={testimonialForm.rating} onChange={e => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })} className={inputClass}>
                            <option value={5}>⭐⭐⭐⭐⭐ — Excellent</option>
                            <option value={4}>⭐⭐⭐⭐ — Very Good</option>
                            <option value={3}>⭐⭐⭐ — Good</option>
                            <option value={2}>⭐⭐ — Fair</option>
                            <option value={1}>⭐ — Poor</option>
                        </select>
                    </div>

                    <button onClick={handleTestimonialSubmit} disabled={testimonialLoading || !testimonialForm.role || !testimonialForm.text}
                        className='w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors'>
                        {testimonialLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </motion.div>

            </div>

            <Footer />
        </div>
    )
}

export default Profile