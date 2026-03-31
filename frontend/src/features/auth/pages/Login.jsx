import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../hooks/useAuth.js'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'jobseeker' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [loginMethod, setLoginMethod] = useState('password') // 'password' or 'otp'
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('')
    const [otpLoading, setOtpLoading] = useState(false)

    const { login, sendOTP, verifyOTP } = useAuth()
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
            } else if (user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleSendOTP = async () => {
        if (!formData.email) {
            setError('Please enter your email first')
            return
        }
        setOtpLoading(true)
        setError('')
        try {
            await sendOTP(formData.email, formData.role)
            setOtpSent(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP')
        } finally {
            setOtpLoading(false)
        }
    }

    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const user = await verifyOTP(formData.email, otp, formData.role)
            if (user.role === 'employer') {
                navigate('/employer/dashboard')
            } else if (user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP')
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
                            <circle cx='90' cy='230' r='18' fill='#22c55e' />
                            <path d='M82 230 L88 236 L100 222' stroke='white' strokeWidth='3' fill='none' strokeLinecap='round' />
                        </svg>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className='text-3xl font-semibold text-white mb-4'
                    >
                        Welcome back!
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className='text-green-100 mb-8 text-sm'
                    >
                        Nepal's first 100% verified job platform
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

            {/* Right Side */}
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
                        Welcome back — login to your account
                    </p>

                    {/* Role Toggle */}
                    <div className='flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-4'>
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
                    </div>

                    {/* Login Method Toggle */}
                    <div className='flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6'>
                        {[
                            { id: 'password', label: '🔑 Password' },
                            { id: 'otp', label: '📧 Email OTP' }
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => {
                                    setLoginMethod(method.id)
                                    setError('')
                                    setOtpSent(false)
                                    setOtp('')
                                }}
                                className={`flex-1 py-2 text-sm rounded-lg transition-all duration-200 ${
                                    loginMethod === method.id
                                        ? 'bg-white dark:bg-gray-600 text-green-600 font-medium shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                {method.label}
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

                    {/* Password Login */}
                    {loginMethod === 'password' && (
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
                                        className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all'
                                    />
                                </motion.div>
                            ))}

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
                                        Logging in...
                                    </span>
                                ) : 'Login'}
                            </motion.button>
                        </form>
                    )}

                    {/* OTP Login */}
                    {loginMethod === 'otp' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='space-y-4'
                        >
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Email
                                </label>
                                <div className='flex gap-2'>
                                    <input
                                        type='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder='your@email.com'
                                        disabled={otpSent}
                                        className='flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white disabled:opacity-60 transition-all'
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSendOTP}
                                        disabled={otpLoading || otpSent}
                                        className='bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors whitespace-nowrap'
                                    >
                                        {otpLoading ? '...' : otpSent ? '✓ Sent' : 'Send OTP'}
                                    </motion.button>
                                </div>
                            </div>

                            {otpSent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className='bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-sm px-4 py-3 rounded-lg mb-4'>
                                        ✅ OTP sent to {formData.email} — check your inbox!
                                    </div>

                                    <form onSubmit={handleVerifyOTP} className='space-y-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                                Enter 6-digit OTP
                                            </label>
                                            <input
                                                type='text'
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder='123456'
                                                maxLength={6}
                                                required
                                                className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white text-center text-2xl tracking-widest font-bold transition-all'
                                            />
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type='submit'
                                            disabled={loading || otp.length !== 6}
                                            className='w-full bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors'
                                        >
                                            {loading ? 'Verifying...' : 'Verify & Login'}
                                        </motion.button>

                                        <button
                                            type='button'
                                            onClick={() => {
                                                setOtpSent(false)
                                                setOtp('')
                                                setError('')
                                            }}
                                            className='w-full text-sm text-gray-500 hover:text-green-600 transition-colors'
                                        >
                                            Resend OTP
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    <p className='text-center text-sm text-gray-500 dark:text-gray-400 mt-6'>
                        Don't have an account?{' '}
                        <Link to='/register' className='text-green-600 hover:underline font-medium'>
                            Register here
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default Login