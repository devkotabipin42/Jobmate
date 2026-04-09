import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../hooks/useAuth.js'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'jobseeker' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [loginMethod, setLoginMethod] = useState('password')
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('')
    const [otpLoading, setOtpLoading] = useState(false)

    const { login, sendOTP, verifyOTP } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const user = await login(formData)
            if (user.role === 'employer') navigate('/employer/dashboard')
            else if (user.role === 'admin') navigate('/admin')
            else navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleSendOTP = async () => {
        if (!formData.email) { setError('Please enter your email first'); return }
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
            if (user.role === 'employer') navigate('/employer/dashboard')
            else if (user.role === 'admin') navigate('/admin')
            else navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-white dark:bg-[#08111f] flex transition-colors duration-300'>

            {/* ── LEFT SIDE — Dark Premium Panel ── */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className='hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden bg-[#08111f]'
            >
                {/* Grid */}
                <div className='absolute inset-0'
                    style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.06) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                {/* Glows */}
                <div className='absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none'
                    style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 65%)' }} />
                <div className='absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none'
                    style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 65%)' }} />

                <div className='relative z-10 text-center max-w-sm'>
    {/* Logo */}
    <Link to='/' className='inline-flex items-center gap-2 mb-12'>
        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className='w-2 h-2 bg-green-400 rounded-full' />
        <span className='text-2xl font-extrabold text-white tracking-tight'>Jobmate</span>
    </Link>

    <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className='text-4xl font-extrabold text-white mb-4 leading-tight'>
        Welcome back!
    </motion.h2>

    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className='text-white/50 text-sm mb-10'>
        Nepal's first 100% verified job platform
    </motion.p>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className='space-y-4 text-left'>
        {['100% verified jobs — no fake listings', 'Salary always visible — no hidden info', 'AI-powered CV matching'].map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
                className='flex items-center gap-3'>
                <div className='w-6 h-6 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center shrink-0'>
                    <svg className='w-3 h-3 text-green-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                    </svg>
                </div>
                <span className='text-white/70 text-sm'>{b}</span>
            </motion.div>
        ))}
    </motion.div>
</div>
            </motion.div>

            {/* ── RIGHT SIDE — Form ── */}
            <div className='w-full lg:w-1/2 flex items-center justify-center px-6 py-10 bg-white dark:bg-[#08111f]'>

                {/* Grid on right too */}
                <div className='absolute inset-0 lg:left-1/2 opacity-10 dark:opacity-40 pointer-events-none'
                    style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.06) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
                    className='w-full max-w-md relative z-10'>

                    {/* Logo — mobile only */}
                    <Link to='/' className='lg:hidden flex items-center justify-center gap-2 mb-8'>
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
                            className='w-2 h-2 bg-green-500 rounded-full' />
                        <span className='text-2xl font-extrabold text-gray-900 dark:text-white'>Jobmate</span>
                    </Link>

                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>Sign in</h1>
                    <p className='text-sm text-gray-500 dark:text-white/40 mb-8'>Welcome back — login to your account</p>

                    {/* Role Toggle */}
                    <div className='flex bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-2xl p-1 mb-4'>
                        {['jobseeker', 'employer'].map((role) => (
                            <button key={role} onClick={() => setFormData({ ...formData, role })}
                                className={`flex-1 py-2.5 text-sm rounded-xl transition-all font-medium ${
                                    formData.role === role
                                        ? 'bg-white dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm'
                                        : 'text-gray-500 dark:text-white/35'
                                }`}>
                                {role === 'jobseeker' ? 'Job Seeker' : 'Employer'}
                            </button>
                        ))}
                    </div>

                    {/* Login Method Toggle */}
                    <div className='flex bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-2xl p-1 mb-6'>
                        {[{ id: 'password', label: 'Password' }, { id: 'otp', label: 'Email OTP' }].map((method) => (
                            <button key={method.id} onClick={() => { setLoginMethod(method.id); setError(''); setOtpSent(false); setOtp('') }}
                                className={`flex-1 py-2.5 text-sm rounded-xl transition-all font-medium ${
                                    loginMethod === method.id
                                        ? 'bg-white dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm'
                                        : 'text-gray-500 dark:text-white/35'
                                }`}>
                                {method.label}
                            </button>
                        ))}
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className='bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-4'>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Password Login */}
                    {loginMethod === 'password' && (
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            {[
                                { label: 'Email address', name: 'email', type: 'email', placeholder: 'your@email.com' },
                                { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' }
                            ].map((field, i) => (
                                <motion.div key={field.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>{field.label}</label>
                                    <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange}
                                        placeholder={field.placeholder} required
                                        className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 transition-colors' />
                                </motion.div>
                            ))}

                            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type='submit' disabled={loading}
                                className='w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2'>
                                {loading ? (
                                    <>
                                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className='w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block' />
                                        Logging in...
                                    </>
                                ) : 'Sign In →'}
                            </motion.button>
                        </form>
                    )}

                    {/* OTP Login */}
                    {loginMethod === 'otp' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-4'>
                            <div>
                                <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Email address</label>
                                <div className='flex gap-2'>
                                    <input type='email' name='email' value={formData.email} onChange={handleChange}
                                        placeholder='your@email.com' disabled={otpSent}
                                        className='flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 disabled:opacity-50 transition-colors' />
                                    <button onClick={handleSendOTP} disabled={otpLoading || otpSent}
                                        className='bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors whitespace-nowrap'>
                                        {otpLoading ? '...' : otpSent ? '✓ Sent' : 'Send OTP'}
                                    </button>
                                </div>
                            </div>

                            {otpSent && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className='bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2'>
                                        <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z'/></svg>
                                        OTP sent to <strong>{formData.email}</strong>
                                    </div>
                                    <form onSubmit={handleVerifyOTP} className='space-y-4'>
                                        <div>
                                            <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Enter 6-digit OTP</label>
                                            <input type='text' value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder='• • • • • •' maxLength={6} required
                                                className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-4 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white text-center text-2xl tracking-[0.5em] font-bold transition-colors' />
                                        </div>
                                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type='submit'
                                            disabled={loading || otp.length !== 6}
                                            className='w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors'>
                                            {loading ? 'Verifying...' : 'Verify & Sign In →'}
                                        </motion.button>
                                        <button type='button' onClick={() => { setOtpSent(false); setOtp(''); setError('') }}
                                            className='w-full text-xs text-gray-400 dark:text-white/25 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
                                            Resend OTP
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    <p className='text-center text-sm text-gray-500 dark:text-white/35 mt-8'>
                        Don't have an account?{' '}
                        <Link to='/register' className='text-green-600 dark:text-green-400 hover:underline font-semibold'>
                            Create account →
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default Login