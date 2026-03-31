import { useState } from 'react'
import useAuth from '../../auth/hooks/useAuth.js'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'

const Profile = () => {
  

    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const { user, updateProfile ,uploadCV,deleteCV} = useAuth()
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        location: user?.location || '',
    })
    const [cvUploading, setCvUploading] = useState(false)
    const [cvSuccess, setCvSuccess] = useState(false)
    const [cvDeleting, setCvDeleting] = useState(false)
    const [showCV, setShowCV] = useState(false)
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
    const handleCVUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCvUploading(true)
    try {
        await uploadCV(file)
        setCvSuccess(true)
        setTimeout(() => setCvSuccess(false), 3000)
    } catch (err) {
        console.log(err)
    } finally {
        setCvUploading(false)
    }
}
const handleCVDelete = async () => {
    setCvDeleting(true)
    try {
        await deleteCV()
    } catch (err) {
        console.log(err)
    } finally {
        setCvDeleting(false)
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
                {/* CV Upload Section */}
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className='mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'
>
    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>
        📄 My CV / Resume
    </h3>



{user?.cv_url && (
    <div className='flex items-center gap-3 mb-4 p-3 bg-green-50 dark:bg-green-900 rounded-xl'>
        <span className='text-2xl'>📄</span>
        <div className='flex-1'>
            <p className='text-xs font-medium text-green-700 dark:text-green-300'>
                CV Uploaded ✓
            </p>
            <button
                onClick={() => setShowCV(!showCV)}
                className='text-xs text-green-600 hover:underline'
            >
                {showCV ? 'Hide CV' : '📄 View CV'}
            </button>
        </div>
        <button
            onClick={handleCVDelete}
            disabled={cvDeleting}
            className='text-xs text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-200'
        >
            {cvDeleting ? 'Deleting...' : '🗑️ Delete'}
        </button>
    </div>
)}

{showCV && user?.cv_url && (
    <div className='mb-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600'>
        <iframe
            src={user.cv_url}
            width='100%'
            height='500px'
            title='CV Preview'
        />
    </div>
)}

    {cvSuccess && (
        <div className='bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg mb-3 text-xs'>
            ✅ CV uploaded successfully!
        </div>
    )}

    <label className='flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:border-green-400 transition-colors'>
        <input
            type='file'
            accept='.pdf,.doc,.docx'
            onChange={handleCVUpload}
            className='hidden'
        />
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
            <p className='text-xs text-gray-500 dark:text-gray-400'>
                PDF, DOC, DOCX — Max 10MB
            </p>
        </div>
    </label>
</motion.div>
            </div>
        </div>
    )
}

export default Profile