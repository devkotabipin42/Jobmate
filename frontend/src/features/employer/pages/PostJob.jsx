import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import useEmployer from '../hooks/useEmployer.js'
const PostJob = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const { postJob } = useEmployer()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary_min: '',
        salary_max: '',
        location: '',
        category: '',
        type: '',
        experience: '',
        deadline: '',
        cv_required: false
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
        await postJob({
            ...formData,
            salary_min: Number(formData.salary_min),
            salary_max: Number(formData.salary_max),
        })
        setSuccess(true)
        setTimeout(() => navigate('/employer/dashboard'), 1500)
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to post job')
    } finally {
        setLoading(false)
    }
}

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='max-w-2xl mx-auto px-4 md:px-6 py-8'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8'
                >
                    <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-2'>
                        Post a New Job
                    </h1>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-8'>
                        Fill in the details — salary is mandatory!
                    </p>

                    {/* Success */}
                    <AnimatePresence>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className='bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-600 dark:text-green-300 text-sm px-4 py-3 rounded-lg mb-4 text-center'
                            >
                                ✓ Job posted successfully! Redirecting...
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className='bg-red-50 dark:bg-red-900 border border-red-200 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-lg mb-4'
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className='space-y-5'>

                        {/* Job Title */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                Job Title *
                            </label>
                            <input
                                type='text'
                                name='title'
                                value={formData.title}
                                onChange={handleChange}
                                placeholder='e.g. Frontend Developer'
                                required
                                className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all'
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                Job Description *
                            </label>
                            <textarea
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                placeholder='Describe the role, responsibilities, requirements...'
                                required
                                rows={5}
                                className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all resize-none'
                            />
                        </div>

                        {/* Salary — Mandatory */}
                       <div>
    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
        Salary Range (NPR) * — Mandatory
    </label>
    <div className='flex flex-col sm:flex-row gap-3'>
        <input
            type='number'
            name='salary_min'
            value={formData.salary_min}
            onChange={handleChange}
            placeholder='Min — e.g. 30000'
            required
            className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all'
        />
        <input
            type='number'
            name='salary_max'
            value={formData.salary_max}
            onChange={handleChange}
            placeholder='Max — e.g. 60000'
            required
            className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all'
        />
    </div>
</div>

                        {/* Location + Category */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Location *
                                </label>
                                <select
                                    name='location'
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'
                                >
                                    <option value=''>Select location</option>
                                    <option>Kathmandu</option>
                                    <option>Lalitpur</option>
                                    <option>Bhaktapur</option>
                                    <option>Pokhara</option>
                                    <option>Chitwan</option>
                                    <option>Butwal</option>
                                    <option>Remote</option>
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Category *
                                </label>
                                <select
                                    name='category'
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'
                                >
                                    <option value=''>Select category</option>
                                    <option>IT/Tech</option>
                                    <option>Finance/Banking</option>
                                    <option>NGO/INGO</option>
                                    <option>Healthcare</option>
                                    <option>Education</option>
                                    <option>Marketing</option>
                                    <option>Engineering</option>
                                    <option>Hospitality</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Type + Experience */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Job Type *
                                </label>
                                <select
                                    name='type'
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'
                                >
                                    <option value=''>Select type</option>
                                    <option value='full-time'>Full time</option>
                                    <option value='part-time'>Part time</option>
                                    <option value='remote'>Remote</option>
                                    <option value='contract'>Contract</option>
                                    <option value='internship'>Internship</option>
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Experience *
                                </label>
                                <select
                                    name='experience'
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'
                                >
                                    <option value=''>Select experience</option>
                                    <option value='fresh'>Fresh graduate</option>
                                    <option value='1-2 years'>1-2 years</option>
                                    <option value='3-5 years'>3-5 years</option>
                                    <option value='5+ years'>5+ years</option>
                                </select>
                            </div>
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                Application Deadline *
                            </label>
                            <input
                                type='date'
                                name='deadline'
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'
                            />
                        </div>
                        {/* CV Required Toggle */}
<div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl'>
    <div>
        <p className='text-sm font-medium text-gray-800 dark:text-white'>CV Required</p>
        <p className='text-xs text-gray-500 dark:text-gray-400'>Applicants must upload CV to apply</p>
    </div>
    <button
        type='button'
        onClick={() => setFormData({ ...formData, cv_required: !formData.cv_required })}
        className={`relative w-12 h-6 rounded-full transition-colors ${
            formData.cv_required ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
    >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            formData.cv_required ? 'translate-x-7' : 'translate-x-1'
        }`} />
    </button>
</div>
                        {/* Submit */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type='submit'
                            disabled={loading || success}
                            className='w-full bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors'
                        >
                            {loading ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className='w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block'
                                    />
                                    Posting job...
                                </span>
                            ) : 'Post Job'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default PostJob