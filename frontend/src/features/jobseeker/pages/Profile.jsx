import { useState } from 'react'
import useAuth from '../../auth/hooks/useAuth.js'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'

const Profile = () => {
    const { 
        user, updateProfile, 
        handleCVUpload, handleCVDelete, 
        handleAlertsSubmit 
    } = useAuth()

    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        location: user?.location || '',
    })
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

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
        try {
            await handleCVUpload(file)
            setCvSuccess(true)
            setTimeout(() => setCvSuccess(false), 3000)
        } catch (err) {
            console.log(err)
        } finally {
            setCvUploading(false)
        }
    }

    const onCVDelete = async () => {
        setCvDeleting(true)
        try {
            await handleCVDelete()
        } catch (err) {
            console.log(err)
        } finally {
            setCvDeleting(false)
        }
    }

    const onAlertsSubmit = async () => {
        setAlertsSaving(true)
        try {
            await handleAlertsSubmit(alerts)
            setAlertsSuccess(true)
            setTimeout(() => setAlertsSuccess(false), 3000)
        } catch (err) {
            console.log(err)
        } finally {
            setAlertsSaving(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='max-w-2xl mx-auto px-4 md:px-6 py-8'>

                {/* Success */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className='bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-600 dark:text-green-300 text-sm px-4 py-3 rounded-lg mb-4 text-center'
                        >
                            ✓ Profile updated successfully!
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden'
                >
                    <div className='h-24 bg-gradient-to-r from-green-500 to-green-700' />

                    <div className='px-6 pb-6'>
                        <div className='flex items-end justify-between -mt-10 mb-4'>
                            <div className='w-20 h-20 rounded-2xl bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 flex items-center justify-center text-green-600 font-bold text-3xl shadow-sm'>
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setEditing(!editing)}
                                className='text-sm border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors'
                            >
                                {editing ? 'Cancel' : 'Edit Profile'}
                            </motion.button>
                        </div>

                        <h1 className='text-xl font-semibold text-gray-800 dark:text-white mb-1'>
                            {user?.name}
                        </h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            {user?.email}
                        </p>
                    </div>

                    <div className='border-t border-gray-100 dark:border-gray-700 px-6 py-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            {[
                                { label: 'Phone', value: user?.phone || 'Not added' },
                                { label: 'Location', value: user?.location || 'Not added' },
                                { label: 'Role', value: 'Job Seeker' },
                                { label: 'Member since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString() },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{item.label}</p>
                                    <p className='text-sm text-gray-800 dark:text-white font-medium'>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence>
                        {editing && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className='border-t border-gray-100 dark:border-gray-700 px-6 py-4'
                            >
                                <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-4'>Edit Profile</h3>
                                {error && (
                                    <div className='bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-lg mb-4'>
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Full Name</label>
                                        <input type='text' name='name' value={formData.name} onChange={handleChange}
                                            className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all' />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Phone</label>
                                        <input type='text' name='phone' value={formData.phone} onChange={handleChange} placeholder='98XXXXXXXX'
                                            className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all' />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Location</label>
                                        <select name='location' value={formData.location} onChange={handleChange}
                                            className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'>
                                            <option value=''>Select location</option>
                                            <option>Kathmandu</option>
                                            <option>Lalitpur</option>
                                            <option>Bhaktapur</option>
                                            <option>Pokhara</option>
                                            <option>Chitwan</option>
                                            <option>Butwal</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type='submit' disabled={loading}
                                        className='w-full bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors'>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4'
                >
                    <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-3'>Quick Links</h3>
                    <div className='space-y-2'>
                        {[
                            { label: 'My Applications', path: '/my-applications', emoji: '' },
                            { label: 'Saved Jobs', path: '/saved-jobs', emoji: '' },
                            { label: 'Browse Jobs', path: '/jobs', emoji: '' },
                            { label: 'Career Tips', path: '/career-tips', emoji: '' },
                        ].map((link, i) => (
                            <a key={i} href={link.path}
                                className='flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                                <span>{link.emoji}</span>
                                <span className='text-sm text-gray-600 dark:text-gray-300'>{link.label}</span>
                                <span className='ml-auto text-gray-400'>→</span>
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* CV Upload Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'
                >
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>📄 My CV / Resume</h3>

                    {user?.cv_url && (
                        <div className='flex items-center gap-3 mb-4 p-3 bg-green-50 dark:bg-green-900 rounded-xl'>
                            <span className='text-2xl'>📄</span>
                            <div className='flex-1'>
                                <p className='text-xs font-medium text-green-700 dark:text-green-300'>CV Uploaded ✓</p>
                                <a href={user.cv_url} download className='text-xs text-green-600 hover:underline'>
                                    ⬇️ Download CV
                                </a>
                            </div>
                            <button onClick={onCVDelete} disabled={cvDeleting}
                                className='text-xs text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-200'>
                                {cvDeleting ? 'Deleting...' : '🗑️ Delete'}
                            </button>
                        </div>
                    )}

                    {cvSuccess && (
                        <div className='bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg mb-3 text-xs'>
                            ✅ CV uploaded successfully!
                        </div>
                    )}

                    <label className='flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:border-green-400 transition-colors'>
                        <input type='file' accept='.pdf,.doc,.docx' onChange={onCVUpload} className='hidden' />
                        <div className='w-10 h-10 bg-green-50 dark:bg-green-900 rounded-xl flex items-center justify-center shrink-0'>
                            {cvUploading ? (
                                <div className='w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin' />
                            ) : (
                                <span className='text-xl'>📤</span>
                            )}
                        </div>
                        <div>
                            <p className='text-sm font-medium text-gray-800 dark:text-white'>
                                {cvUploading ? 'Uploading...' : user?.cv_url ? 'Update CV' : 'Upload CV'}
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>PDF, DOC, DOCX — Max 10MB</p>
                        </div>
                    </label>
                </motion.div>

                {/* Job Alerts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className='mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'
                >
                    <div className='flex items-center justify-between mb-4'>
                        <div>
                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>🔔 Job Alerts</h3>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                Get email when new jobs match your preferences
                            </p>
                        </div>
                        <button
                            onClick={() => setAlerts({ ...alerts, enabled: !alerts.enabled })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                                alerts.enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                alerts.enabled ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                        </button>
                    </div>

                    {alerts.enabled && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className='space-y-4'
                        >
                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2'>Categories</label>
                                <div className='flex flex-wrap gap-2'>
                                    {['IT/Tech', 'Finance/Banking', 'NGO/INGO', 'Healthcare', 'Education', 'Marketing'].map(cat => (
                                        <button key={cat}
                                            onClick={() => {
                                                const cats = alerts.categories.includes(cat)
                                                    ? alerts.categories.filter(c => c !== cat)
                                                    : [...alerts.categories, cat]
                                                setAlerts({ ...alerts, categories: cats })
                                            }}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                                                alerts.categories.includes(cat)
                                                    ? 'bg-green-600 text-white border-green-600'
                                                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                                            }`}
                                        >{cat}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2'>Locations</label>
                                <div className='flex flex-wrap gap-2'>
                                    {['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Remote'].map(loc => (
                                        <button key={loc}
                                            onClick={() => {
                                                const locs = alerts.locations.includes(loc)
                                                    ? alerts.locations.filter(l => l !== loc)
                                                    : [...alerts.locations, loc]
                                                setAlerts({ ...alerts, locations: locs })
                                            }}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                                                alerts.locations.includes(loc)
                                                    ? 'bg-green-600 text-white border-green-600'
                                                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                                            }`}
                                        >{loc}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2'>Job Types</label>
                                <div className='flex flex-wrap gap-2'>
                                    {['full-time', 'part-time', 'remote', 'internship', 'contract'].map(type => (
                                        <button key={type}
                                            onClick={() => {
                                                const types = alerts.job_types.includes(type)
                                                    ? alerts.job_types.filter(t => t !== type)
                                                    : [...alerts.job_types, type]
                                                setAlerts({ ...alerts, job_types: types })
                                            }}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                                                alerts.job_types.includes(type)
                                                    ? 'bg-green-600 text-white border-green-600'
                                                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                                            }`}
                                        >{type}</button>
                                    ))}
                                </div>
                            </div>

                            {alertsSuccess && (
                                <div className='bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-4 py-2 rounded-lg'>
                                    ✅ Job alerts saved!
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onAlertsSubmit}
                                disabled={alertsSaving}
                                className='w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors'
                            >
                                {alertsSaving ? 'Saving...' : 'Save Job Alerts'}
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>

            </div>
        </div>
    )
}

export default Profile