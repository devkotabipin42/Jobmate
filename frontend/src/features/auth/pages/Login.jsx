import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../hooks/useAuth.js'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'jobseeker'
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const user = await login(formData)
            if (user.role === 'employer') {
                navigate('/employer/dashboard')
            } else {
                navigate('/')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors'>
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className='absolute -top-20 -left-20 w-72 h-72 bg-green-100 dark:bg-green-900 rounded-full'
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                    className='absolute -bottom-20 -right-20 w-96 h-96 bg-green-50 dark:bg-green-950 rounded-full'
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 w-full max-w-md relative z-10'
            >
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link to='/' className='block text-center text-2xl font-semibold text-green-600 mb-2'>
                        Job<span className='text-gray-800 dark:text-white'>mate</span>
                    </Link>
                    <p className='text-center text-sm text-gray-500 dark:text-gray-400 mb-8'>
                        Welcome back — login to your account
                    </p>
                </motion.div>

                {/* Role Toggle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className='flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6'
                >
                    {['jobseeker', 'employer'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setFormData({ ...formData, role })}
                            className={`flex-1 py-2 text-sm rounded-lg transition-all duration-200 ${
                                formData.role === role
                                    ? 'bg-white dark:bg-gray-600 text-green-600 font-medium shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            {role === 'jobseeker' ? 'Job Seeker' : 'Employer'}
                        </button>
                    ))}
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className='bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-lg mb-4'
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className='space-y-4'>
                    {[
                        { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
                        { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' }
                    ].map((field, i) => (
                        <motion.div
                            key={field.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                        >
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                required
                                className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all duration-200'
                            />
                        </motion.div>
                    ))}

                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type='submit'
                        disabled={loading}
                        className='w-full bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                        {loading ? (
                            <span className='flex items-center justify-center gap-2'>
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className='w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block'
                                />
                                Logging in...
                            </span>
                        ) : 'Login'}
                    </motion.button>
                </form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className='text-center text-sm text-gray-500 dark:text-gray-400 mt-6'
                >
                    Don't have an account?{' '}
                    <Link to='/register' className='text-green-600 hover:underline font-medium'>
                        Register here
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    )
}

export default Login