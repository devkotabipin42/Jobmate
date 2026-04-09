import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const LoadingSpinner = () => (
    <div className='flex items-center justify-center py-20'>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full' />
    </div>
)

const planConfig = {
    free: { label: 'Free', color: 'text-gray-400 dark:text-white/25', bg: 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/8' },
    basic: { label: 'Basic', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
    standard: { label: 'Standard', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    premium: { label: 'Premium 👑', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
}

export const AdminEmployers = ({ employers, loading, handleVerifyEmployer, handleTogglePremium, setEmployers }) => {
    const [planModal, setPlanModal] = useState(null)
    const [selectedPlan, setSelectedPlan] = useState('basic')
    const [selectedDays, setSelectedDays] = useState(30)
    const [activating, setActivating] = useState(false)
    const isDark = document.documentElement.classList.contains('dark')
    const handleActivate = async () => {
        if (!planModal) return
        setActivating(true)
        try {
            await handleTogglePremium(planModal._id, selectedPlan, selectedDays)
            setEmployers(prev => prev.map(e => e._id === planModal._id ? {
                ...e,
                is_premium: true,
                plan: selectedPlan,
                plan_expires_at: new Date(Date.now() + selectedDays * 24 * 60 * 60 * 1000)
            } : e))
            setPlanModal(null)
        } finally {
            setActivating(false)
        }
    }

    const handleDeactivate = async (employer) => {
        await handleTogglePremium(employer._id, 'free', 0)
        setEmployers(prev => prev.map(e => e._id === employer._id ? { ...e, is_premium: false, plan: 'free', plan_expires_at: null } : e))
    }

    const daysLeft = (employer) => {
        if (!employer.plan_expires_at) return null
        const days = Math.ceil((new Date(employer.plan_expires_at) - new Date()) / (1000 * 60 * 60 * 24))
        return days
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Company Management</h2>
                    <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>{employers.length} companies registered</p>
                </div>
                <div className='flex gap-2 flex-wrap'>
                    <span className='text-xs bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-full font-medium'>
                        {employers.filter(e => e.is_verified).length} Verified
                    </span>
                    <span className='text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-full font-medium'>
                        {employers.filter(e => e.is_premium).length} Premium
                    </span>
                    <span className='text-xs bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/35 border border-gray-200 dark:border-white/8 px-3 py-1.5 rounded-full font-medium'>
                        {employers.filter(e => !e.is_verified).length} Pending
                    </span>
                </div>
            </div>

            {loading ? <LoadingSpinner /> : (
                <div className='space-y-3'>
                    {employers.map((employer, i) => {
                        const days = daysLeft(employer)
                        const plan = employer.plan || 'free'
                        const config = planConfig[plan] || planConfig.free

                        return (
                            <motion.div key={employer._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                className={`bg-white dark:bg-white/3 border rounded-2xl p-5 transition-all ${
                                    employer.is_premium
                                        ? 'border-amber-200 dark:border-amber-500/20'
                                        : employer.is_verified
                                            ? 'border-green-200 dark:border-green-500/20'
                                            : 'border-gray-200 dark:border-white/7'
                                }`}>

                                <div className='flex items-start justify-between gap-3 mb-4'>
                                    <div className='flex items-start gap-3 min-w-0'>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden ${
                                            employer.is_premium
                                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                : employer.is_verified
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/30 border border-gray-200 dark:border-white/8'
                                        }`}>
                                            {employer.logo_url
                                                ? <img src={employer.logo_url} alt={employer.company_name} className='w-full h-full object-cover' />
                                                : employer.company_name?.charAt(0)}
                                        </div>
                                        <div className='min-w-0'>
                                            <div className='flex items-center gap-2 flex-wrap mb-1'>
                                                <p className='text-sm font-semibold text-gray-800 dark:text-white'>{employer.company_name}</p>
                                                {employer.is_verified && (
                                                    <span className='text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full font-medium'>Verified</span>
                                                )}
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${config.bg} ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                            <p className='text-xs text-gray-500 dark:text-white/35'>{employer.email}</p>
                                            <p className='text-xs text-gray-400 dark:text-white/25'>{employer.location || 'Nepal'} {employer.industry && `· ${employer.industry}`}</p>
                                            {employer.is_premium && days !== null && (
                                                <p className={`text-xs mt-1 font-medium ${days <= 5 ? 'text-red-500' : days <= 15 ? 'text-amber-500' : 'text-green-500'}`}>
                                                    {days > 0 ? `⏰ ${days} days left` : '❌ Plan expired!'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {!employer.is_verified && (
                                        <button onClick={() => handleVerifyEmployer(employer._id)}
                                            className='text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors font-semibold shrink-0'>
                                            Verify
                                        </button>
                                    )}
                                </div>

                                <div className='border-t border-gray-100 dark:border-white/5 pt-4 flex items-center justify-between gap-3 flex-wrap'>
                                    <div>
                                        <p className='text-xs font-semibold text-gray-600 dark:text-white/40'>Premium Access</p>
                                        {employer.is_premium && employer.plan_activated_at && (
                                            <p className='text-xs text-gray-400 dark:text-white/20 mt-0.5'>
                                                Activated: {new Date(employer.plan_activated_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        {employer.is_premium ? (
                                            <>
                                                <button onClick={() => { setPlanModal(employer); setSelectedPlan(employer.plan || 'basic') }}
                                                    className='text-xs border border-blue-200 dark:border-blue-500/20 text-blue-500 px-3 py-2 rounded-xl hover:bg-blue-500/5 transition-colors'>
                                                    Change Plan
                                                </button>
                                                <button onClick={() => handleDeactivate(employer)}
                                                    className='text-xs border border-red-200 dark:border-red-500/20 text-red-500 px-3 py-2 rounded-xl hover:bg-red-500/5 transition-colors'>
                                                    Deactivate
                                                </button>
                                                <div className='w-10 h-6 bg-green-500 rounded-full relative cursor-pointer' onClick={() => handleDeactivate(employer)}>
                                                    <div className='absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow' />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => { setPlanModal(employer); setSelectedPlan('basic'); setSelectedDays(30) }}
                                                    className='text-xs bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-colors font-semibold flex items-center gap-1'>
                                                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/></svg>
                                                    Activate Premium
                                                </button>
                                                <div className='w-10 h-6 bg-gray-200 dark:bg-white/10 rounded-full relative cursor-pointer' onClick={() => { setPlanModal(employer); setSelectedPlan('basic'); setSelectedDays(30) }}>
                                                    <div className='absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow' />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}

            {/* ── PLAN MODAL via Portal ── */}
          {planModal && createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div onClick={() => setPlanModal(null)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} />
        <div className='bg-white dark:bg-[#0c1a2e] border border-gray-200 dark:border-white/10'
            style={{
                position: 'relative', width: '90%', maxWidth: '480px',
                borderRadius: '16px', padding: '24px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                zIndex: 100000, maxHeight: '90vh', overflowY: 'auto'
            }}>

            <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-1'>Activate Premium</h3>
            <p className='text-xs text-gray-500 dark:text-white/40 mb-5'>{planModal.company_name} · {planModal.email}</p>

            {/* Plan Select */}
            <div className='mb-4'>
                <label className='block text-xs font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-3'>Select Plan</label>
                <div className='grid grid-cols-3 gap-2'>
                    {[
                        { id: 'basic', label: 'Basic', price: 'Rs. 2,000', sel: 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400', unsel: 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/30 hover:border-gray-300 dark:hover:border-white/20' },
                        { id: 'standard', label: 'Standard', price: 'Rs. 5,000', sel: 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400', unsel: 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/30 hover:border-gray-300 dark:hover:border-white/20' },
                        { id: 'premium', label: 'Premium', price: 'Rs. 10,000', sel: 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400', unsel: 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/30 hover:border-gray-300 dark:hover:border-white/20' },
                    ].map(p => (
                        <button key={p.id} onClick={() => setSelectedPlan(p.id)}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${selectedPlan === p.id ? p.sel : p.unsel}`}>
                            <p className='text-xs font-bold'>{p.label}</p>
                            <p className='text-[10px] mt-0.5 opacity-70'>{p.price}/mo</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Duration */}
            <div className='mb-5'>
                <label className='block text-xs font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-3'>Duration</label>
                <div className='grid grid-cols-4 gap-2'>
                    {[
                        { days: 7, label: '7 days', sub: 'Trial' },
                        { days: 30, label: '30 days', sub: '1 month' },
                        { days: 90, label: '90 days', sub: '3 months' },
                        { days: 365, label: '365 days', sub: '1 year' },
                    ].map(d => (
                        <button key={d.days} onClick={() => setSelectedDays(d.days)}
                            className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                                selectedDays === d.days
                                    ? 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                                    : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/30 hover:border-gray-300 dark:hover:border-white/20'
                            }`}>
                            <p className='text-xs font-bold'>{d.label}</p>
                            <p className='text-[10px] mt-0.5 opacity-70'>{d.sub}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className='bg-gray-50 dark:bg-white/4 border border-gray-200 dark:border-white/8 rounded-xl p-3 mb-5'>
                {[
                    { label: 'Company', value: planModal.company_name },
                    { label: 'Plan', value: selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1) },
                    { label: 'Duration', value: `${selectedDays} days` },
                ].map((item, i) => (
                    <div key={i} className='flex justify-between py-1.5 border-b border-gray-100 dark:border-white/5 text-xs'>
                        <span className='text-gray-400 dark:text-white/30'>{item.label}</span>
                        <span className='font-semibold text-gray-800 dark:text-white'>{item.value}</span>
                    </div>
                ))}
                <div className='flex justify-between py-1.5 text-xs'>
                    <span className='text-gray-400 dark:text-white/30'>Expires</span>
                    <span className='font-semibold text-green-600 dark:text-green-400'>
                        {new Date(Date.now() + selectedDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Email note */}
            <p className='text-xs text-gray-400 dark:text-white/25 mb-4 flex items-center gap-1.5'>
                <svg className='w-3 h-3 text-green-500 shrink-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                    <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/>
                    <polyline points='22,6 12,13 2,6'/>
                </svg>
                Company ko automatic welcome email jayega!
            </p>

            {/* Buttons */}
            <div className='flex gap-2'>
                <button onClick={handleActivate} disabled={activating}
                    className='flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2'>
                    {activating ? (
                        <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className='w-4 h-4 border-2 border-white border-t-transparent rounded-full' />
                        Activating...</>
                    ) : '✅ Activate & Send Email'}
                </button>
                <button onClick={() => setPlanModal(null)}
                    className='px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/35 text-sm hover:bg-gray-50 dark:hover:bg-white/3 transition-colors'>
                    Cancel
                </button>
            </div>
        </div>
    </div>,
    document.body
)}
        </motion.div>
    )
}

// ── ADMIN USERS ────────────────────────────────────────────
export const AdminUsers = ({ users, loading, handleBanUser, handleUnbanUser, handleRoleChange }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>User Management</h2>
                <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>{users.length} registered users</p>
            </div>
            <div className='flex gap-2'>
                <span className='text-xs bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-full font-medium'>
                    {users.length} Total
                </span>
                <span className='text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-full font-medium'>
                    {users.filter(u => u.is_banned).length} Banned
                </span>
            </div>
        </div>

        {loading ? <LoadingSpinner /> : (
            <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl overflow-hidden'>
                {users.map((user, i) => (
                    <div key={user._id}
                        className={`flex items-center justify-between gap-3 p-4 border-b border-gray-50 dark:border-white/5 last:border-0 transition-colors ${
                            user.is_banned ? 'bg-red-50 dark:bg-red-500/5' : 'hover:bg-gray-50 dark:hover:bg-white/3'
                        }`}>
                        <div className='flex items-center gap-3 min-w-0'>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
                                user.is_banned
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                            }`}>
                                {user.name?.charAt(0)}
                            </div>
                            <div className='min-w-0'>
                                <p className='text-sm font-medium text-gray-800 dark:text-white truncate'>{user.name}</p>
                                <p className='text-xs text-gray-500 dark:text-white/35 truncate'>{user.email}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2 shrink-0'>
                            <select value={user.role} onChange={e => handleRoleChange(user._id, e.target.value)}
                                className='text-xs border border-gray-200 dark:border-white/8 rounded-lg px-2 py-1.5 bg-white dark:bg-white/5 dark:text-white outline-none cursor-pointer'>
                                <option value='jobseeker'>Job Seeker</option>
                                <option value='admin'>Admin</option>
                            </select>
                            {user.is_banned ? (
                                <button onClick={() => handleUnbanUser(user._id)}
                                    className='text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors font-medium'>
                                    Unban
                                </button>
                            ) : (
                                <button onClick={() => handleBanUser(user._id)}
                                    className='text-xs border border-red-200 dark:border-red-500/20 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-500/5 transition-colors'>
                                    Ban
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </motion.div>
)