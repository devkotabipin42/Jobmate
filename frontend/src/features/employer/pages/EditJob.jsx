import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import API_URL from '../../../config/api.js'
import useEmployer from '../hooks/useEmployer.js'
import Navbar from '../../../components/Navbar.jsx'

const EditJob = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { editJob, loading } = useEmployer()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        type: 'full-time',
        category: '',
        experience: '',
        salary_min: '',
        salary_max: '',
        deadline: ''
    })

    useEffect(() => {
        loadJob()
    }, [id])

    const loadJob = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/jobs/${id}`)
            const job = res.data.job
            setFormData({
                title: job.title || '',
                description: job.description || '',
                requirements: job.requirements || '',
                location: job.location || '',
                type: job.type || 'full-time',
                category: job.category || '',
                experience: job.experience || '',
                salary_min: job.salary_min || '',
                salary_max: job.salary_max || '',
                deadline: job.deadline ? job.deadline.split('T')[0] : ''
            })
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await editJob(id, formData)
            setSuccess(true)
            setTimeout(() => navigate('/employer/dashboard'), 1500)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update job')
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            {/* Header */}
            <div className='bg-gradient-to-r from-green-600 to-green-800 px-6 py-8'>
                <div className='max-w-3xl mx-auto'>
                    <span className='text-xs bg-white/20 text-white px-3 py-1 rounded-full mb-2 inline-block'>
                        ✏️ Edit Job
                    </span>
                    <h1 className='text-2xl font-bold text-white'>
                        Update Job Listing
                    </h1>
                    <p className='text-green-200 text-sm mt-1'>
                        Edit your job details below
                    </p>
                </div>
            </div>

            <div className='max-w-3xl mx-auto px-4 md:px-6 py-8'>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl mb-6 text-sm'
                    >
                        ✅ Job updated successfully! Redirecting...
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-sm'
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className='space-y-5'>

                    {/* Title */}
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'>
                        <h2 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>
                            Basic Information
                        </h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Job Title *
                                </label>
                                <input
                                    type='text'
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'
                                />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                        Category *
                                    </label>
                                    <select
                                        name='category'
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                    >
                                        <option value=''>Select category</option>
                                        <option>IT/Tech</option>
                                        <option>Finance/Banking</option>
                                        <option>NGO/INGO</option>
                                        <option>Healthcare</option>
                                        <option>Education</option>
                                        <option>Marketing</option>
                                        <option>Engineering</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                        Job Type *
                                    </label>
                                    <select
                                        name='type'
                                        value={formData.type}
                                        onChange={handleChange}
                                        className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                    >
                                        <option value='full-time'>Full Time</option>
                                        <option value='part-time'>Part Time</option>
                                        <option value='remote'>Remote</option>
                                        <option value='internship'>Internship</option>
                                        <option value='contract'>Contract</option>
                                    </select>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                        Location *
                                    </label>
                                    <input
                                        type='text'
                                        name='location'
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        placeholder='Kathmandu, Nepal'
                                        className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                    />
                                </div>

                                <div>
                                    <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                        Experience Level *
                                    </label>
                                    <select
                                        name='experience'
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                    >
                                        <option value=''>Select experience</option>
                                        <option value='fresh'>Fresh Graduate</option>
                                        <option value='1-2 years'>1-2 Years</option>
                                        <option value='3-5 years'>3-5 Years</option>
                                        <option value='5+ years'>5+ Years</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Salary */}
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'>
                        <h2 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>
                            Salary & Deadline
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Min Salary (Rs.) *
                                </label>
                                <input
                                    type='number'
                                    name='salary_min'
                                    value={formData.salary_min}
                                    onChange={handleChange}
                                    required
                                    placeholder='30000'
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Max Salary (Rs.) *
                                </label>
                                <input
                                    type='number'
                                    name='salary_max'
                                    value={formData.salary_max}
                                    onChange={handleChange}
                                    required
                                    placeholder='60000'
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Deadline *
                                </label>
                                <input
                                    type='date'
                                    name='deadline'
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    required
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'>
                        <h2 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>
                            Job Description
                        </h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Description *
                                </label>
                                <textarea
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white resize-none'
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Requirements
                                </label>
                                <textarea
                                    name='requirements'
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder='List requirements separated by comma...'
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white resize-none'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='flex gap-3'>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type='submit'
                            disabled={loading}
                            className='flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors'
                        >
                            {loading ? 'Updating...' : '✓ Update Job'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type='button'
                            onClick={() => navigate('/employer/dashboard')}
                            className='flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                        >
                            Cancel
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditJob