import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import Navbar from '../../../../components/Navbar.jsx'
import useAdmin from '../../hooks/useAdmin.js'
import AdminOverview from './AdminOverview.jsx'
import { AdminPendingJobs, AdminAllJobs } from './AdminJobs.jsx'
import { AdminEmployers, AdminUsers } from './AdminEmployersUsers.jsx'
import { AdminReports, AdminTestimonials, AdminBroadcast, AdminFeaturedCompanies } from './AdminOthers.jsx'
import AdminTickets from './AdminTickets.jsx'

const COLORS = ['#22c55e', '#f59e0b', '#8b5cf6', '#3b82f6', '#ef4444']

const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='3' width='7' height='7'/><rect x='14' y='3' width='7' height='7'/><rect x='14' y='14' width='7' height='7'/><rect x='3' y='14' width='7' height='7'/></svg> },
    { id: 'pending', label: 'Pending Jobs', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg> },
    { id: 'all-jobs', label: 'All Jobs', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='2' y='7' width='20' height='14' rx='2'/><path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'/></svg> },
    { id: 'employers', label: 'Employers', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/></svg> },
    { id: 'users', label: 'Users', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg> },
    { id: 'analytics', label: 'Analytics', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><polyline points='22 12 18 12 15 21 9 3 6 12 2 12'/></svg> },
    { id: 'reports', label: 'Reports', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'/></svg> },
    { id: 'testimonials', label: 'Testimonials', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/></svg> },
    { id: 'tickets', label: 'Tickets', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M20 12V22H4V12'/><path d='M22 7H2v5h20V7z'/><path d='M12 22V7'/><path d='M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z'/><path d='M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'/></svg> },
    { id: 'broadcast', label: 'Broadcast', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10a16 16 0 0 0 6 6z'/></svg> },
    { id: 'featured-companies', label: 'Featured Companies', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg> },
]

const AdminPanel = () => {
    const {
        loading, getStats, getAnalytics, getPendingJobs, getAllJobs,
        getAllEmployers, getAllUsers, verifyJob, rejectJob, deleteJob,
        verifyEmployer, banUser, unbanUser, updateUserRole, getAllReports,
        resolveReport, dismissReport, getAllTestimonials, approveTestimonial,
        rejectTestimonial, deleteTestimonialAdmin, getAllTickets, replyTicket,
        updateTicketStatus, broadcastEmail, toggleFeaturedJob,
    toggleEmployerPremium 
    } = useAdmin()

    const [activeTab, setActiveTab] = useState('dashboard')
    const [stats, setStats] = useState(null)
    const [pendingJobs, setPendingJobs] = useState([])
    const [allJobs, setAllJobs] = useState([])
    const [employers, setEmployers] = useState([])
    const [users, setUsers] = useState([])
    const [analytics, setAnalytics] = useState(null)
    const [reports, setReports] = useState([])
    const [testimonials, setTestimonials] = useState([])
    const [tickets, setTickets] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [replyText, setReplyText] = useState('')
    const [broadcastForm, setBroadcastForm] = useState({ subject: '', message: '', target: 'all' })
    const [broadcastSuccess, setBroadcastSuccess] = useState('')
    const [featuredCompanies, setFeaturedCompanies] = useState([])
    const [featuredLoading, setFeaturedLoading] = useState(false)
    const [featuredUploading, setFeaturedUploading] = useState(false)
    const [featuredForm, setFeaturedForm] = useState({ name: '', location: 'Nepal', industry: '', website: '', description: '', logo: null })
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        loadStats()
        loadPendingJobs()
    }, [])

    useEffect(() => {
        if (activeTab === 'testimonials') getAllTestimonials().then(data => setTestimonials(data || []))
    }, [activeTab])

    const loadStats = async () => { const data = await getStats(); setStats(data) }
    const loadPendingJobs = async () => { const data = await getPendingJobs(); setPendingJobs(data) }
    const loadAllJobs = async () => { const data = await getAllJobs(); setAllJobs(data) }
    const loadEmployers = async () => { const data = await getAllEmployers(); setEmployers(data) }
    const loadUsers = async () => { const data = await getAllUsers(); setUsers(data) }
    const loadAnalytics = async () => { const data = await getAnalytics(); setAnalytics(data) }
    const loadReports = async () => { const data = await getAllReports(); setReports(data) }

    const handleVerifyJob = async (id) => { await verifyJob(id); setPendingJobs(prev => prev.filter(j => j._id !== id)); loadStats() }
    const handleRejectJob = async (id) => { await rejectJob(id); setPendingJobs(prev => prev.filter(j => j._id !== id)); loadStats() }
    const handleDeleteJob = async (id) => { await deleteJob(id); setAllJobs(prev => prev.filter(j => j._id !== id)); loadStats() }
    const handleVerifyEmployer = async (id) => { await verifyEmployer(id); setEmployers(prev => prev.map(e => e._id === id ? { ...e, is_verified: true } : e)) }
    const handleBanUser = async (id) => { await banUser(id); setUsers(prev => prev.map(u => u._id === id ? { ...u, is_banned: true } : u)) }
    const handleUnbanUser = async (id) => { await unbanUser(id); setUsers(prev => prev.map(u => u._id === id ? { ...u, is_banned: false } : u)) }
    const handleRoleChange = async (id, role) => { await updateUserRole(id, role); setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u)) }
    const handleResolveReport = async (id) => { await resolveReport(id); setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'resolved' } : r)) }
    const handleDismissReport = async (id) => { await dismissReport(id); setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'dismissed' } : r)) }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setMobileMenuOpen(false)
        if (tab === 'pending') loadPendingJobs()
        if (tab === 'all-jobs') loadAllJobs()
        if (tab === 'employers') loadEmployers()
        if (tab === 'users') loadUsers()
        if (tab === 'analytics') loadAnalytics()
        if (tab === 'reports') loadReports()
        if (tab === 'testimonials') getAllTestimonials().then(data => setTestimonials(data || []))
        if (tab === 'tickets') getAllTickets().then(data => setTickets(data || []))
        if (tab === 'featured-companies') loadFeaturedCompanies()
    }

    const loadFeaturedCompanies = async () => {
        setFeaturedLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/featured-companies`, {
                credentials: 'include'
            })
            const data = await res.json()
            setFeaturedCompanies(data.companies || [])
        } catch (err) { console.log(err) }
        finally { setFeaturedLoading(false) }
    }

    const handleAddFeaturedCompany = async () => {
        if (!featuredForm.name) return
        setFeaturedUploading(true)
        try {
            const formData = new FormData()
            formData.append('name', featuredForm.name)
            formData.append('location', featuredForm.location)
            formData.append('industry', featuredForm.industry)
            formData.append('website', featuredForm.website)
            formData.append('description', featuredForm.description)
            if (featuredForm.logo) formData.append('logo', featuredForm.logo)

            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/featured-companies`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })
            const data = await res.json()
            setFeaturedCompanies(prev => [data.company, ...prev])
            setFeaturedForm({ name: '', location: 'Nepal', industry: '', website: '', description: '', logo: null })
        } catch (err) { console.log(err) }
        finally { setFeaturedUploading(false) }
    }

    const handleDeleteFeaturedCompany = async (id) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/featured-companies/${id}`, {
                method: 'DELETE', credentials: 'include'
            })
            setFeaturedCompanies(prev => prev.filter(c => c._id !== id))
        } catch (err) { console.log(err) }
    }

    const handleToggleFeaturedCompany = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/featured-companies/${id}/toggle`, {
                method: 'PUT', credentials: 'include'
            })
            const data = await res.json()
            setFeaturedCompanies(prev => prev.map(c => c._id === id ? data.company : c))
        } catch (err) { console.log(err) }
    }

    const activeItem = sidebarItems.find(i => i.id === activeTab)

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-[#08111f] transition-colors duration-300'>

            {/* Grid bg */}
            <div className='fixed inset-0 opacity-0 dark:opacity-100 pointer-events-none'
                style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <Navbar />

            <div className='flex'>

                {/* ── DESKTOP SIDEBAR ── */}
                <aside className='hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex-col z-[10] bg-white dark:bg-[#0c1a2e] border-r border-gray-200 dark:border-white/6'>

                    {/* Admin info */}
                    <div className='p-4 border-b border-gray-100 dark:border-white/6'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 font-bold text-lg'>A</div>
                            <div>
                                <p className='text-sm font-semibold text-gray-800 dark:text-white'>Admin Panel</p>
                                <p className='text-xs text-gray-500 dark:text-white/35'>Jobmate Platform</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className='flex-1 p-3 space-y-1 overflow-y-auto'>
                        {sidebarItems.map(item => (
                            <button key={item.id} onClick={() => handleTabChange(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                    activeTab === item.id
                                        ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-semibold border border-green-200 dark:border-green-500/20'
                                        : 'text-gray-600 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/3 hover:text-gray-800 dark:hover:text-white'
                                }`}>
                                <span className={activeTab === item.id ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-white/25'}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {item.id === 'pending' && stats?.pendingJobs > 0 && (
                                    <span className='ml-auto text-xs bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold'>
                                        {stats.pendingJobs}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className='p-4 border-t border-gray-100 dark:border-white/6'>
                        <p className='text-xs text-gray-400 dark:text-white/25 text-center'>Jobmate Admin v1.0</p>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main className='flex-1 md:ml-64 p-4 md:p-6 pb-24 md:pb-6 relative z-10'>

                    {/* Page header */}
                    <div className='flex items-center justify-between mb-6'>
                        <div>
                            <h1 className='text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2'>
                                <span className='text-green-600 dark:text-green-400'>{activeItem?.icon}</span>
                                {activeItem?.label}
                            </h1>
                            <p className='text-xs text-gray-500 dark:text-white/30 mt-0.5'>Jobmate Admin Panel</p>
                        </div>
                        {/* Mobile menu toggle */}
                        <button onClick={() => setMobileMenuOpen(true)}
                            className='md:hidden flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-3 py-2 text-sm text-gray-600 dark:text-white/50'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='18' x2='21' y2='18'/></svg>
                            Menu
                        </button>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode='wait'>
                        {activeTab === 'dashboard' && (
                            <AdminOverview key='dashboard' stats={stats} handleTabChange={handleTabChange} />
                        )}
                        {activeTab === 'pending' && (
                            <AdminPendingJobs key='pending' pendingJobs={pendingJobs} loading={loading}
                                handleVerifyJob={handleVerifyJob} handleRejectJob={handleRejectJob} />
                        )}
                        {activeTab === 'all-jobs' && (
                            <AdminAllJobs key='all-jobs' allJobs={allJobs} loading={loading}
                                handleDeleteJob={handleDeleteJob} toggleFeaturedJob={toggleFeaturedJob} setAllJobs={setAllJobs} />
                        )}
                        {activeTab === 'employers' && (
    <AdminEmployers key='employers' employers={employers} loading={loading}
        handleVerifyEmployer={handleVerifyEmployer}
        handleTogglePremium={toggleEmployerPremium}
        setEmployers={setEmployers} />
)}
                        {activeTab === 'users' && (
                            <AdminUsers key='users' users={users} loading={loading}
                                handleBanUser={handleBanUser} handleUnbanUser={handleUnbanUser} handleRoleChange={handleRoleChange} />
                        )}
                        {activeTab === 'analytics' && (
                            <motion.div key='analytics' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
                                <div className='mb-6'>
                                    <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Analytics</h2>
                                    <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>Platform performance overview</p>
                                </div>
                                {loading ? (
                                    <div className='flex items-center justify-center py-20'>
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full' />
                                    </div>
                                ) : !analytics ? (
                                    <div className='text-center py-20 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                                        <p className='text-gray-500 dark:text-white/35'>Loading analytics...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Row 1 — Category + Type */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                            <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
                                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Jobs by Category</h3>
                                                <ResponsiveContainer width='100%' height={220}>
                                                    <BarChart data={analytics.jobsByCategory?.map(j => ({ name: j._id, value: j.count }))}>
                                                        <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
                                                        <XAxis dataKey='name' tick={{ fontSize: 10, fill: 'rgba(150,150,150,0.8)' }} />
                                                        <YAxis tick={{ fontSize: 11, fill: 'rgba(150,150,150,0.8)' }} />
                                                        <Tooltip contentStyle={{ background: '#0c1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                                                        <Bar dataKey='value' fill='#22c55e' radius={[6, 6, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
                                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Jobs by Type</h3>
                                                <div className='flex items-center gap-4'>
                                                    <ResponsiveContainer width='55%' height={180}>
                                                        <PieChart>
                                                            <Pie data={analytics.jobsByType?.map(j => ({ name: j._id, value: j.count }))}
                                                                cx='50%' cy='50%' innerRadius={45} outerRadius={75} dataKey='value'>
                                                                {analytics.jobsByType?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                                            </Pie>
                                                            <Tooltip contentStyle={{ background: '#0c1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                    <div className='space-y-2'>
                                                        {analytics.jobsByType?.map((item, i) => (
                                                            <div key={i} className='flex items-center gap-2'>
                                                                <div className='w-2.5 h-2.5 rounded-full shrink-0' style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                                <span className='text-xs text-gray-600 dark:text-white/40 capitalize'>{item._id}</span>
                                                                <span className='text-xs font-bold text-gray-800 dark:text-white ml-auto'>{item.count}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 2 — Applications + Location */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                            <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
                                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Applications by Status</h3>
                                                <ResponsiveContainer width='100%' height={200}>
                                                    <BarChart data={analytics.applicationsByStatus?.map(a => ({ name: a._id, value: a.count }))}>
                                                        <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
                                                        <XAxis dataKey='name' tick={{ fontSize: 10, fill: 'rgba(150,150,150,0.8)' }} />
                                                        <YAxis tick={{ fontSize: 11, fill: 'rgba(150,150,150,0.8)' }} />
                                                        <Tooltip contentStyle={{ background: '#0c1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                                                        <Bar dataKey='value' radius={[6, 6, 0, 0]}>
                                                            {analytics.applicationsByStatus?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
                                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Jobs by Location</h3>
                                                <div className='space-y-3'>
                                                    {analytics.jobsByLocation?.map((loc, i) => (
                                                        <div key={i}>
                                                            <div className='flex justify-between items-center mb-1'>
                                                                <span className='text-xs text-gray-600 dark:text-white/40'>{loc._id}</span>
                                                                <span className='text-xs font-bold text-gray-800 dark:text-white'>{loc.count}</span>
                                                            </div>
                                                            <div className='w-full bg-gray-100 dark:bg-white/5 rounded-full h-2'>
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${(loc.count / analytics.jobsByLocation[0].count) * 100}%` }}
                                                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                                                    className='h-2 rounded-full bg-green-500'
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 3 — User Growth */}
                                        <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
                                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>User Growth</h3>
                                            <ResponsiveContainer width='100%' height={200}>
                                                <LineChart data={analytics.usersByMonth?.map(u => ({ name: `${u._id.month}/${u._id.year}`, users: u.count }))}>
                                                    <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
                                                    <XAxis dataKey='name' tick={{ fontSize: 11, fill: 'rgba(150,150,150,0.8)' }} />
                                                    <YAxis tick={{ fontSize: 12, fill: 'rgba(150,150,150,0.8)' }} />
                                                    <Tooltip contentStyle={{ background: '#0c1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                                                    <Line type='monotone' dataKey='users' stroke='#8b5cf6' strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                        {activeTab === 'reports' && (
                            <AdminReports key='reports' reports={reports} loading={loading}
                                handleResolveReport={handleResolveReport} handleDismissReport={handleDismissReport} />
                        )}
                        {activeTab === 'testimonials' && (
                            <AdminTestimonials key='testimonials' testimonials={testimonials} setTestimonials={setTestimonials}
                                approveTestimonial={approveTestimonial} rejectTestimonial={rejectTestimonial}
                                deleteTestimonialAdmin={deleteTestimonialAdmin} />
                        )}
                        {activeTab === 'tickets' && (
                            <AdminTickets key='tickets' tickets={tickets} setTickets={setTickets}
                                selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket}
                                replyText={replyText} setReplyText={setReplyText}
                                replyTicket={replyTicket} updateTicketStatus={updateTicketStatus} />
                        )}
                        {activeTab === 'broadcast' && (
                            <AdminBroadcast key='broadcast' broadcastForm={broadcastForm} setBroadcastForm={setBroadcastForm}
                                broadcastEmail={broadcastEmail} broadcastSuccess={broadcastSuccess}
                                setBroadcastSuccess={setBroadcastSuccess} loading={loading} />
                        )}
                        {activeTab === 'featured-companies' && (
                            <AdminFeaturedCompanies key='featured-companies'
                                companies={featuredCompanies} loading={featuredLoading}
                                onAdd={handleAddFeaturedCompany} onDelete={handleDeleteFeaturedCompany}
                                onToggle={handleToggleFeaturedCompany}
                                form={featuredForm} setForm={setFeaturedForm}
                                uploading={featuredUploading} />
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* ── MOBILE MENU DRAWER ── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className='fixed inset-0 bg-black/60 z-50 md:hidden' />
                        <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className='fixed left-0 top-0 h-full w-72 bg-white dark:bg-[#0c1a2e] border-r border-gray-200 dark:border-white/6 z-50 flex flex-col md:hidden'>
                            <div className='p-4 border-b border-gray-100 dark:border-white/6 flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 font-bold'>A</div>
                                    <div>
                                        <p className='text-sm font-semibold text-gray-800 dark:text-white'>Admin Panel</p>
                                        <p className='text-xs text-gray-500 dark:text-white/35'>Jobmate</p>
                                    </div>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)}
                                    className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-white/50'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><path d='M18 6 6 18M6 6l12 12'/></svg>
                                </button>
                            </div>
                            <nav className='flex-1 p-3 space-y-1 overflow-y-auto'>
                                {sidebarItems.map(item => (
                                    <button key={item.id} onClick={() => handleTabChange(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                            activeTab === item.id
                                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-semibold border border-green-200 dark:border-green-500/20'
                                                : 'text-gray-600 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/3'
                                        }`}>
                                        <span className={activeTab === item.id ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-white/25'}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                        {item.id === 'pending' && stats?.pendingJobs > 0 && (
                                            <span className='ml-auto text-xs bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold'>
                                                {stats.pendingJobs}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── MOBILE BOTTOM NAV ── */}
            <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0c1a2e] border-t border-gray-200 dark:border-white/6 z-40'>
                <div className='flex items-center justify-around px-2 py-2 overflow-x-auto'>
                    {sidebarItems.slice(0, 5).map(item => (
                        <button key={item.id} onClick={() => handleTabChange(item.id)}
                            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors relative shrink-0 ${
                                activeTab === item.id ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-white/25'
                            }`}>
                            {item.icon}
                            <span className='text-[10px] font-medium'>{item.label.split(' ')[0]}</span>
                            {item.id === 'pending' && stats?.pendingJobs > 0 && (
                                <span className='absolute -top-0.5 right-0 w-4 h-4 bg-amber-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold'>
                                    {stats.pendingJobs}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminPanel