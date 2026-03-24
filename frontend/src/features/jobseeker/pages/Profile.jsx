import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { setUser } from '../../auth/auth.slice.js'
import axios from 'axios'
import Navbar from '../../../components/Navbar.jsx'

const Profile = () => {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        location: user?.location || '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await axios.put(
                'http://localhost:3000/api/auth/update',
                formData,
                { withCredentials: true }
            )
            dispatch(setUser({ ...user, ...formData }))
            setSuccess(true)
            setEditing(false)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed')
        } finally {
            setLoading(false)
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
                    {/* Cover */}
                    <div className='h-24 bg-gradient-to-r from-green-500 to-green-700' />

                    {/* Avatar + Name */}
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

                    {/* Info */}
                    <div className='border-t border-gray-100 dark:border-gray-700 px-6 py-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            {[
                                { label: 'Phone', value: user?.phone || 'Not added' },
                                { label: 'Location', value: user?.location || 'Not added' },
                                { label: 'Role', value: 'Job Seeker' },
                                { label: 'Member since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString() },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                                        {item.label}
                                    </p>
                                    <p className='text-sm text-gray-800 dark:text-white font-medium'>
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Edit Form */}
                    <AnimatePresence>
                        {editing && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className='border-t border-gray-100 dark:border-gray-700 px-6 py-4'
                            >
                                <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-4'>
                                    Edit Profile
                                </h3>

                                {error && (
                                    <div className='bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-lg mb-4'>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                            Full Name
                                        </label>
                                        <input
                                            type='text'
                                            name='name'
                                            value={formData.name}
                                            onChange={handleChange}
                                            className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                            Phone
                                        </label>
                                        <input
                                            type='text'
                                            name='phone'
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder='98XXXXXXXX'
                                            className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                            Location
                                        </label>
                                        <select
                                            name='location'
                                            value={formData.location}
                                            onChange={handleChange}
                                            className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'
                                        >
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

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type='submit'
                                        disabled={loading}
                                        className='w-full bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors'
                                    >
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
                    <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-3'>
                        Quick Links
                    </h3>
                    <div className='space-y-2'>
                        {[
                            { label: 'My Applications', path: '/my-applications', emoji: '📋' },
                            { label: 'Saved Jobs', path: '/saved-jobs', emoji: '🔖' },
                            { label: 'Browse Jobs', path: '/jobs', emoji: '🔍' },
                            { label: 'Career Tips', path: '/career-tips', emoji: '💡' },
                        ].map((link, i) => (
                            
                               <a key={i}
                                href={link.path}
                                className='flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                            >
                                <span>{link.emoji}</span>
                                <span className='text-sm text-gray-600 dark:text-gray-300'>
                                    {link.label}
                                </span>
                                <span className='ml-auto text-gray-400'>→</span>
                            </a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Profile