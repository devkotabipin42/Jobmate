import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#22c55e', '#f59e0b', '#8b5cf6', '#3b82f6', '#ef4444']

const AdminOverview = ({ stats, handleTabChange }) => {
    if (!stats) return (
        <div className='flex items-center justify-center py-20'>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full' />
        </div>
    )

    const pieData = [
        { name: 'Verified', value: stats.verifiedJobs },
        { name: 'Pending', value: stats.pendingJobs },
    ]

    const barData = [
        { name: 'Jobs', value: stats.totalJobs, fill: '#22c55e' },
        { name: 'Users', value: stats.totalUsers, fill: '#8b5cf6' },
        { name: 'Employers', value: stats.totalEmployers, fill: '#3b82f6' },
        { name: 'Apps', value: stats.totalApplications, fill: '#f59e0b' },
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>

            {/* Stat Cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {[
                    { label: 'Total Jobs', value: stats.totalJobs, color: 'text-green-400', iconBg: 'bg-green-500/10 border-green-500/20', icon: '◈', change: '+12%', changeBg: 'bg-green-500/10 text-green-400' },
                    { label: 'Pending Review', value: stats.pendingJobs, color: 'text-amber-400', iconBg: 'bg-amber-500/10 border-amber-500/20', icon: '⏳', change: 'Now', changeBg: 'bg-amber-500/10 text-amber-400' },
                    { label: 'Total Users', value: stats.totalUsers, color: 'text-purple-400', iconBg: 'bg-purple-500/10 border-purple-500/20', icon: '◎', change: '+8%', changeBg: 'bg-purple-500/10 text-purple-400' },
                    { label: 'Applications', value: stats.totalApplications, color: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20', icon: '◆', change: '+24%', changeBg: 'bg-blue-500/10 text-blue-400' },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-white/12 transition-all'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className={`w-10 h-10 ${stat.iconBg} border rounded-xl flex items-center justify-center text-lg`}>
                                <span className={stat.color}>{stat.icon}</span>
                            </div>
                            <span className={`text-xs font-medium ${stat.changeBg} px-2 py-1 rounded-full`}>{stat.change}</span>
                        </div>
                        <p className={`text-3xl font-extrabold ${stat.color} mb-1`}>{stat.value}</p>
                        <p className='text-xs text-gray-500 dark:text-white/30 font-medium'>{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Platform Overview</h3>
                    <ResponsiveContainer width='100%' height={200}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
                            <XAxis dataKey='name' tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                            <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                            <Tooltip contentStyle={{ background: '#0c1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                            <Bar dataKey='value' radius={[6, 6, 0, 0]}>
                                {barData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Job Verification Status</h3>
                    <div className='flex items-center gap-6'>
                        <ResponsiveContainer width='55%' height={180}>
                            <PieChart>
                                <Pie data={pieData} cx='50%' cy='50%' innerRadius={50} outerRadius={80} dataKey='value'>
                                    {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#0c1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-2'>
                                <div className='w-3 h-3 rounded-full bg-green-500' />
                                <div>
                                    <p className='text-xs text-gray-500 dark:text-white/40'>Verified</p>
                                    <p className='text-xl font-bold text-green-500'>{stats.verifiedJobs}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='w-3 h-3 rounded-full bg-amber-500' />
                                <div>
                                    <p className='text-xs text-gray-500 dark:text-white/40'>Pending</p>
                                    <p className='text-xl font-bold text-amber-500'>{stats.pendingJobs}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Extra stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {[
                    { val: stats.verifiedJobs, label: 'Verified Jobs', sub: `${Math.round((stats.verifiedJobs / stats.totalJobs) * 100) || 0}% of total`, color: 'text-green-400', border: 'border-green-500/20', bg: 'bg-green-500/5' },
                    { val: stats.totalEmployers, label: 'Registered Employers', sub: 'Active on platform', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
                    { val: stats.totalApplications, label: 'Total Applications', sub: `Avg ${Math.round(stats.totalApplications / (stats.totalJobs || 1))} per job`, color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5' },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} border ${s.border} rounded-2xl p-6`}>
                        <p className={`text-3xl font-extrabold ${s.color} mb-1`}>{s.val}</p>
                        <p className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>{s.label}</p>
                        <p className='text-xs text-gray-500 dark:text-white/30'>{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Quick Actions</h3>
                <div className='flex gap-3 flex-wrap'>
                    {[
                        { label: `Review Pending (${stats.pendingJobs})`, tab: 'pending', color: 'bg-amber-500 hover:bg-amber-600' },
                        { label: 'Verify Employers', tab: 'employers', color: 'bg-blue-600 hover:bg-blue-700' },
                        { label: 'All Jobs', tab: 'all-jobs', color: 'bg-green-600 hover:bg-green-700' },
                        { label: 'All Users', tab: 'users', color: 'bg-purple-600 hover:bg-purple-700' },
                    ].map((btn, i) => (
                        <button key={i} onClick={() => handleTabChange(btn.tab)}
                            className={`text-sm ${btn.color} text-white px-5 py-2.5 rounded-xl transition-colors font-semibold`}>
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default AdminOverview