import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import API_URL from '../../../config/api.js'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')
    const role = searchParams.get('role') || 'jobseeker'

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!token) navigate('/forgot-password')
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        try {
            await axios.post(`${API_URL}/api/auth/reset-password`, { token, password, role })
            setSuccess(true)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    // Password strength
    const getStrength = (pw) => {
        if (pw.length === 0) return { label: '', color: '', width: 0 }
        if (pw.length < 6) return { label: 'Too short', color: 'bg-red-500', width: 25 }
        if (pw.length < 8) return { label: 'Weak', color: 'bg-amber-500', width: 50 }
        if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return { label: 'Fair', color: 'bg-yellow-500', width: 75 }
        return { label: 'Strong', color: 'bg-green-500', width: 100 }
    }

    const strength = getStrength(password)

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
                                <h1 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>Password Reset!</h1>
                                <p className='text-sm text-gray-500 dark:text-white/40'>
                                    Your password has been updated successfully. Redirecting to login...
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div key='form'>
                                <h1 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>Create New Password</h1>
                                <p className='text-sm text-gray-500 dark:text-white/40'>
                                    Choose a strong password for your account
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {!success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/8 rounded-2xl p-6 shadow-sm'>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            {/* New Password */}
                            <div>
                                <label className='block text-xs font-medium text-gray-600 dark:text-white/50 mb-1.5'>
                                    New Password
                                </label>
                                <div className='relative'>
                                    <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/25' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                                        <rect x='3' y='11' width='18' height='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/>
                                    </svg>
                                    <input type={showPassword ? 'text' : 'password'}
                                        value={password} onChange={e => setPassword(e.target.value)}
                                        placeholder='Min. 6 characters'
                                        className='w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-green-400 dark:focus:border-green-500/50 transition-colors' />
                                    <button type='button' onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25 hover:text-gray-600 dark:hover:text-white/50'>
                                        {showPassword
                                            ? <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94'/><path d='M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19'/><line x1='1' y1='1' x2='23' y2='23'/></svg>
                                            : <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>
                                        }
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {password.length > 0 && (
                                    <div className='mt-2'>
                                        <div className='w-full bg-gray-100 dark:bg-white/5 rounded-full h-1.5'>
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${strength.width}%` }}
                                                className={`h-1.5 rounded-full transition-all ${strength.color}`} />
                                        </div>
                                        <p className='text-xs text-gray-400 dark:text-white/30 mt-1'>{strength.label}</p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className='block text-xs font-medium text-gray-600 dark:text-white/50 mb-1.5'>
                                    Confirm Password
                                </label>
                                <div className='relative'>
                                    <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/25' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                                        <rect x='3' y='11' width='18' height='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/>
                                    </svg>
                                    <input type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder='Repeat your password'
                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none transition-colors ${
                                            confirmPassword && password !== confirmPassword
                                                ? 'border-red-300 dark:border-red-500/40 focus:border-red-400'
                                                : confirmPassword && password === confirmPassword
                                                ? 'border-green-300 dark:border-green-500/40 focus:border-green-400'
                                                : 'border-gray-200 dark:border-white/8 focus:border-green-400 dark:focus:border-green-500/50'
                                        }`} />
                                    {confirmPassword && password === confirmPassword && (
                                        <svg className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'>
                                            <polyline points='20 6 9 17 4 12'/>
                                        </svg>
                                    )}
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
                                        className='w-4 h-4 border-2 border-white border-t-transparent rounded-full' />Resetting...</>
                                ) : 'Reset Password →'}
                            </button>
                        </form>

                        <p className='text-center text-xs text-gray-400 dark:text-white/25 mt-4'>
                            <Link to='/login' className='text-green-600 dark:text-green-400 hover:underline font-medium'>
                                ← Back to Login
                            </Link>
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default ResetPassword
