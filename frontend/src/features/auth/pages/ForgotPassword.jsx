import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import API_URL from '../../../config/api.js'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('jobseeker')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) { setError('Please enter your email'); return }
        setLoading(true)
        setError('')
        try {
            await axios.post(`${API_URL}/api/auth/forgot-password`, { email, role })
            setSuccess(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-white dark:bg-[#08111f] flex items-center justify-center px-4 transition-colors'>
            <div className='absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none'
                style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className='w-full max-w-md relative z-10'>

                {/* Logo */}
                <div className='text-center mb-8'>
                    <Link to='/' className='inline-flex items-center gap-2 mb-6'>
                        <div className='w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center'>
                            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'>
                                <rect x='2' y='7' width='20' height='14' rx='2'/><path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'/>
                            </svg>
                        </div>
                        <span className='text-xl font-bold'>
                            <span className='text-green-600'>Job</span>
                            <span className='text-gray-800 dark:text-white'>mate</span>
                        </span>
                    </Link>

                    <AnimatePresence mode='wait'>
                        {success ? (
                            <motion.div key='success' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                <div className='w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                                        <polyline points='20 6 9 17 4 12'/>
                                    </svg>
                                </div>
                                <h1 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>Check your email!</h1>
                                <p className='text-sm text-gray-500 dark:text-white/40'>
                                    We sent a password reset link to <strong className='text-gray-700 dark:text-white/70'>{email}</strong>
                                </p>
                                <p className='text-xs text-gray-400 dark:text-white/30 mt-2'>Link expires in 1 hour</p>
                            </motion.div>
                        ) : (
                            <motion.div key='form'>
                                <h1 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>Forgot Password?</h1>
                                <p className='text-sm text-gray-500 dark:text-white/40'>
                                    Enter your email — we'll send you a reset link
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {!success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/8 rounded-2xl p-6 shadow-sm'>

                        {/* Role Toggle */}
                        <div className='flex bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl p-1 mb-5'>
                            {['jobseeker', 'employer'].map(r => (
                                <button key={r} onClick={() => setRole(r)}
                                    className={`flex-1 py-2 text-xs rounded-lg transition-all font-medium capitalize ${
                                        role === r
                                            ? 'bg-white dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm'
                                            : 'text-gray-500 dark:text-white/35'
                                    }`}>
                                    {r === 'jobseeker' ? 'Job Seeker' : 'Employer'}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            {/* Email */}
                            <div>
                                <label className='block text-xs font-medium text-gray-600 dark:text-white/50 mb-1.5'>
                                    Email Address
                                </label>
                                <div className='relative'>
                                    <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/25' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                                        <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/><polyline points='22,6 12,13 2,6'/>
                                    </svg>
                                    <input type='email' value={email} onChange={e => setEmail(e.target.value)}
                                        placeholder='Enter your email'
                                        className='w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-green-400 dark:focus:border-green-500/50 transition-colors' />
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className='text-xs text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-2 rounded-xl'>
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Submit */}
                            <button type='submit' disabled={loading}
                                className='w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2'>
                                {loading ? (
                                    <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className='w-4 h-4 border-2 border-white border-t-transparent rounded-full' />Sending...</>
                                ) : 'Send Reset Link →'}
                            </button>
                        </form>

                        <p className='text-center text-xs text-gray-400 dark:text-white/25 mt-4'>
                            Remember your password?{' '}
                            <Link to='/login' className='text-green-600 dark:text-green-400 hover:underline font-medium'>
                                Login
                            </Link>
                        </p>
                    </motion.div>
                )}

                {success && (
                    <div className='text-center'>
                        <Link to='/login'
                            className='inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors'>
                            Back to Login
                        </Link>
                        <p className='text-xs text-gray-400 dark:text-white/25 mt-3'>
                            Didn't receive? Check spam folder or{' '}
                            <button onClick={() => setSuccess(false)} className='text-green-600 dark:text-green-400 hover:underline'>
                                try again
                            </button>
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default ForgotPassword
