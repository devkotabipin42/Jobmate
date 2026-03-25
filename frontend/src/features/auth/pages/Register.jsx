import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../hooks/useAuth.js'

const Register = () => {
    const [role, setRole] = useState('jobseeker')
    const [formData, setFormData] = useState({
        name: '',
        company_name: '',
        email: '',
        password: '',
        phone: '',
        location: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const data = role === 'employer'
                ? { company_name: formData.company_name, email: formData.email, password: formData.password, phone: formData.phone, location: formData.location }
                : { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, location: formData.location }

            await register(data, role)

            if (role === 'employer') {
                navigate('/employer/dashboard')
            } else {
                navigate('/')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors'>

            {/* Left Side */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className='hidden lg:flex w-1/2 bg-green-600 flex-col items-center justify-center p-12 relative overflow-hidden'
            >
                <div className='absolute top-0 left-0 w-full h-full'>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className='absolute -top-20 -left-20 w-80 h-80 bg-green-500 rounded-full'
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                        className='absolute -bottom-20 -right-20 w-96 h-96 bg-green-700 rounded-full'
                    />
                </div>

                <div className='relative z-10 text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className='mb-8'
                    >
                        <svg viewBox='0 0 400 300' className='w-80 h-60 mx-auto'>
                            <rect x='50' y='50' width='300' height='200' rx='20' fill='rgba(255,255,255,0.1)' />
                            <rect x='80' y='70' width='240' height='150' rx='10' fill='rgba(255,255,255,0.15)' />
                            <rect x='100' y='90' width='200' height='35' rx='8' fill='rgba(255,255,255,0.3)' />
                            <rect x='115' y='100' width='80' height='8' rx='4' fill='white' />
                            <rect x='115' y='112' width='50' height='6' rx='3' fill='rgba(255,255,255,0.6)' />
                            <rect x='260' y='98' width='30' height='18' rx='4' fill='#22c55e' />
                            <rect x='100' y='135' width='200' height='35' rx='8' fill='rgba(255,255,255,0.3)' />
                            <rect x='115' y='145' width='70' height='8' rx='4' fill='white' />
                            <rect x='115' y='157' width='45' height='6' rx='3' fill='rgba(255,255,255,0.6)' />
                            <rect x='260' y='143' width='30' height='18' rx='4' fill='#22c55e' />
                            <rect x='100' y='180' width='200' height='30' rx='8' fill='rgba(255,255,255,0.2)' />
                            <rect x='115' y='190' width='60' height='8' rx='4' fill='rgba(255,255,255,0.7)' />
                            <circle cx='320' cy='200' r='25' fill='rgba(255,255,255,0.2)' />
                            <circle cx='320' cy='190' r='12' fill='rgba(255,255,255,0.5)' />
                            <circle cx='90' cy='230' r='18' fill='#22c55e' />
                            <path d='M82 230 L88 236 L100 222' stroke='white' strokeWidth='3' fill='none' strokeLinecap='round' />
                            <rect x='140' y='220' width='100' height='24' rx='12' fill='rgba(255,255,255,0.2)' />
                            <text x='190' y='236' textAnchor='middle' fill='white' fontSize='10' fontWeight='bold'>Rs. 50K - 80K</text>
                        </svg>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className='text-3xl font-semibold text-white mb-4'
                    >
                        Find your dream<br />job in Nepal
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className='text-green-100 mb-8 text-sm'
                    >
                        Nepal ko pehlo verified job platform
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className='space-y-3 text-left'
                    >
                        {[
                            '100% verified jobs — no fake listings',
                            'Salary always visible — no hidden info',
                            'Real-time application tracking',
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + i * 0.1 }}
                                className='flex items-center gap-3'
                            >
                                <div className='w-5 h-5 bg-white rounded-full flex items-center justify-center shrink-0'>
                                    <svg className='w-3 h-3 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                                    </svg>
                                </div>
                                <span className='text-green-50 text-sm'>{benefit}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side — Form */}
            <div className='w-full lg:w-1/2 flex items-center justify-center px-6 py-10'>
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className='w-full max-w-md'
                >
                    <Link to='/' className='block text-center text-2xl font-semibold text-green-600 mb-2'>
                        Job<span className='text-gray-800 dark:text-white'>mate</span>
                    </Link>
                    <p className='text-center text-sm text-gray-500 dark:text-gray-400 mb-8'>
                        Create your account — it's free!
                    </p>

                    {/* Role Toggle */}
                    <div className='flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6'>
                        {['jobseeker', 'employer'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 text-sm rounded-lg transition-all duration-200 ${
                                    role === r
                                        ? 'bg-white dark:bg-gray-600 text-green-600 font-medium shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                {r === 'jobseeker' ? 'Job Seeker' : 'Employer'}
                            </button>
                        ))}
                    </div>

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
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                {role === 'employer' ? 'Company Name' : 'Full Name'}
                            </label>
                            <input
                                type='text'
                                name={role === 'employer' ? 'company_name' : 'name'}
                                value={role === 'employer' ? formData.company_name : formData.name}
                                onChange={handleChange}
                                placeholder={role === 'employer' ? 'TechSoft Nepal' : 'Bipin Devkota'}
                                required
                                className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                Email
                            </label>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder='your@email.com'
                                required
                                className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                Password
                            </label>
                            <input
                                type='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                placeholder='••••••••'
                                required
                                className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all'
                            />
                        </div>

                        <div className='flex flex-col sm:flex-row gap-3'>
                            <div className='flex-1'>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Phone
                                </label>
                                <input
                                    type='text'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder='98XXXXXXXX'
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all'
                                />
                            </div>
                            <div className='flex-1'>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Location
                                </label>
                                <select
                                    name='location'
                                    value={formData.location}
                                    onChange={handleChange}
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'
                                >
                                    <option value=''>Select</option>
                                    <option>Kathmandu</option>
                                    <option>Lalitpur</option>
                                    <option>Pokhara</option>
                                    <option>Chitwan</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type='submit'
                            disabled={loading}
                            className='w-full bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors'
                        >
                            {loading ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className='w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block'
                                    />
                                    Creating account...
                                </span>
                            ) : 'Create account'}
                        </motion.button>
                    </form>

                    <p className='text-center text-sm text-gray-500 dark:text-gray-400 mt-6'>
                        Already have an account?{' '}
                        <Link to='/login' className='text-green-600 hover:underline font-medium'>
                            Login here
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default Register