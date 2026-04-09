import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../hooks/useAuth.js'

const Register = () => {
    const [role, setRole] = useState('jobseeker')
    const [formData, setFormData] = useState({ name: '', company_name: '', email: '', password: '', phone: '', location: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const { register } = useAuth()

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const data = role === 'employer'
                ? { company_name: formData.company_name, email: formData.email, password: formData.password, phone: formData.phone, location: formData.location }
                : { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, location: formData.location }
            await register(data, role)
            setSuccess(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    // Success screen
    if (success) return (
        <div className='min-h-screen bg-white dark:bg-[#08111f] flex items-center justify-center px-4 transition-colors'>
            <div className='absolute inset-0 opacity-10 dark:opacity-40 pointer-events-none'
                style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.06) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className='relative z-10 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-10 max-w-md w-full text-center'>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                    className='w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                    <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/>
                    </svg>
                </motion.div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>Check your email!</h2>
                <p className='text-sm text-gray-500 dark:text-white/40 mb-2'>We sent a verification link to</p>
                <p className='text-sm font-semibold text-green-600 dark:text-green-400 mb-6'>{formData.email}</p>
                <p className='text-xs text-gray-400 dark:text-white/25 mb-8'>Click the link in your email to verify your account. Link expires in 24 hours.</p>
                <Link to='/login' className='block w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl text-sm font-semibold transition-colors'>
                    Back to Login →
                </Link>
            </motion.div>
        </div>
    )

    return (
        <div className='min-h-screen bg-white dark:bg-[#08111f] flex transition-colors duration-300'>

            {/* ── LEFT SIDE ── */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
                className='hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden bg-[#08111f]'>

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
            <div className='w-full lg:w-1/2 flex items-center justify-center px-6 py-10 bg-white dark:bg-[#08111f] relative'>
                <div className='absolute inset-0 lg:left-0 opacity-10 dark:opacity-40 pointer-events-none'
                    style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.06) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
                    className='w-full max-w-md relative z-10'>

                    {/* Logo — mobile */}
                    <Link to='/' className='lg:hidden flex items-center justify-center gap-2 mb-8'>
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
                            className='w-2 h-2 bg-green-500 rounded-full' />
                        <span className='text-2xl font-extrabold text-gray-900 dark:text-white'>Jobmate</span>
                    </Link>

                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>Create account</h1>
                    <p className='text-sm text-gray-500 dark:text-white/40 mb-8'>It's free — join 15,000+ job seekers</p>

                    {/* Role Toggle */}
                    <div className='flex bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-2xl p-1 mb-6'>
                        {['jobseeker', 'employer'].map((r) => (
                            <button key={r} onClick={() => setRole(r)}
                                className={`flex-1 py-2.5 text-sm rounded-xl transition-all font-medium ${
                                    role === r
                                        ? 'bg-white dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm'
                                        : 'text-gray-500 dark:text-white/35'
                                }`}>
                                {r === 'jobseeker' ? 'Job Seeker' : 'Employer'}
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className='space-y-4'>

                        {/* Name */}
                        <div>
                            <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>
                                {role === 'employer' ? 'Company Name' : 'Full Name'}
                            </label>
                            <input type='text' name={role === 'employer' ? 'company_name' : 'name'}
                                value={role === 'employer' ? formData.company_name : formData.name}
                                onChange={handleChange}
                                placeholder={role === 'employer' ? 'TechSoft Nepal Pvt. Ltd.' : 'Bipin Devkota'}
                                required
                                className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 transition-colors' />
                        </div>

                        {/* Email */}
                        <div>
                            <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Email address</label>
                            <input type='email' name='email' value={formData.email} onChange={handleChange}
                                placeholder='your@email.com' required
                                className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 transition-colors' />
                        </div>

                        {/* Password */}
                        <div>
                            <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Password</label>
                            <input type='password' name='password' value={formData.password} onChange={handleChange}
                                placeholder='Min. 6 characters' required
                                className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 transition-colors' />
                        </div>

                        {/* Phone + Location */}
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Phone</label>
                                <input type='text' name='phone' value={formData.phone} onChange={handleChange}
                                    placeholder='98XXXXXXXX'
                                    className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 transition-colors' />
                            </div>
                            <div>
                                <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Location</label>
                                <select name='location' value={formData.location} onChange={handleChange}
                                    className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white transition-colors cursor-pointer'>
                                    <option value='' className='dark:bg-[#0c1a2e]'>Select</option>
                                    {['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal', 'Other'].map(l => (
                                        <option key={l} className='dark:bg-[#0c1a2e]'>{l}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type='submit' disabled={loading}
                            className='w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mt-2'>
                            {loading ? (
                                <>
                                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className='w-4 h-4 border-2 border-white border-t-transparent rounded-full' />
                                    Creating account...
                                </>
                            ) : `Create ${role === 'employer' ? 'Employer' : ''} Account →`}
                        </motion.button>
                    </form>

                    {/* Terms */}
                    <p className='text-xs text-gray-400 dark:text-white/20 text-center mt-4'>
                        By registering, you agree to our{' '}
                        <Link to='/terms' className='text-green-600 dark:text-green-400 hover:underline'>Terms</Link>
                        {' & '}
                        <Link to='/privacy' className='text-green-600 dark:text-green-400 hover:underline'>Privacy Policy</Link>
                    </p>

                    <p className='text-center text-sm text-gray-500 dark:text-white/35 mt-6'>
                        Already have an account?{' '}
                        <Link to='/login' className='text-green-600 dark:text-green-400 hover:underline font-semibold'>Sign in →</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default Register