import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Link } from 'react-router-dom'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const EmployerOverview = ({ myJobs, applications, totalApplications, activeJobs, handleViewApplications, handleTabChange }) => {
    const barData = myJobs.slice(0, 6).map(job => ({
        name: job.title.length > 12 ? job.title.substring(0, 12) + '...' : job.title,
        applications: job.application_count
    }))

    const pieData = [
        { name: 'Applied', value: applications.filter(a => a.status === 'applied').length },
        { name: 'Seen', value: applications.filter(a => a.status === 'seen').length },
        { name: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length },
        { name: 'Interview', value: applications.filter(a => a.status === 'interview').length },
        { name: 'Hired', value: applications.filter(a => a.status === 'hired').length },
        { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length },
    ].filter(d => d.value > 0)

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>

            {/* Stat Cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {[
                    { label: 'Total Jobs', value: myJobs.length, color: 'text-green-400', iconBg: 'bg-green-500/10 border-green-500/20', icon: <svg className='w-5 h-5 text-green-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='2' y='7' width='20' height='14' rx='2'/><path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'/></svg> },
                    { label: 'Applications', value: totalApplications, color: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20', icon: <svg className='w-5 h-5 text-blue-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg> },
                    { label: 'Active Jobs', value: activeJobs, color: 'text-purple-400', iconBg: 'bg-purple-500/10 border-purple-500/20', icon: <svg className='w-5 h-5 text-purple-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><polyline points='22 12 18 12 15 21 9 3 6 12 2 12'/></svg> },
                    { label: 'Hired', value: applications.filter(a => a.status === 'hired').length, color: 'text-amber-400', iconBg: 'bg-amber-500/10 border-amber-500/20', icon: <svg className='w-5 h-5 text-amber-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg> },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-white/12 transition-all'>
                        <div className={`w-10 h-10 ${stat.iconBg} border rounded-xl flex items-center justify-center mb-4`}>
                            {stat.icon}
                        </div>
                        <p className={`text-3xl font-extrabold ${stat.color} mb-1`}>{stat.value}</p>
                        <p className='text-xs text-gray-500 dark:text-white/30 font-medium'>{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                {[
                    { label: 'Post New Job', path: '/employer/post-job', color: 'bg-green-600 hover:bg-green-700 text-white', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg> },
                    { label: 'View Applications', tab: 'applications', color: 'bg-blue-500/10 hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/></svg> },
                    { label: 'CRM', tab: 'crm', color: 'bg-purple-500/10 hover:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg> },
                    { label: 'Company Settings', tab: 'company-settings', color: 'bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='3'/><path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'/></svg> },
                ].map((btn, i) => (
                    btn.path
                        ? <Link key={i} to={btn.path} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${btn.color}`}>
                            {btn.icon}{btn.label}
                        </Link>
                        : <button key={i} onClick={() => handleTabChange(btn.tab)} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${btn.color}`}>
                            {btn.icon}{btn.label}
                        </button>
                ))}
            </div>

            {/* Charts */}
            {barData.length > 0 && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Applications per Job</h3>
                        <ResponsiveContainer width='100%' height={200}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' />
                                <XAxis dataKey='name' tick={{ fontSize: 10, fill: 'rgba(150,150,150,0.8)' }} />
                                <YAxis tick={{ fontSize: 11, fill: 'rgba(150,150,150,0.8)' }} />
                                <Tooltip contentStyle={{ background: '#0c1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                                <Bar dataKey='applications' fill='#22c55e' radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {pieData.length > 0 && (
                        <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Application Status</h3>
                            <div className='flex items-center gap-4'>
                                <ResponsiveContainer width='55%' height={180}>
                                    <PieChart>
                                        <Pie data={pieData} cx='50%' cy='50%' innerRadius={45} outerRadius={75} dataKey='value'>
                                            {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#0c1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className='space-y-2'>
                                    {pieData.map((item, i) => (
                                        <div key={i} className='flex items-center gap-2'>
                                            <div className='w-2.5 h-2.5 rounded-full shrink-0' style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className='text-xs text-gray-600 dark:text-white/40'>{item.name}</span>
                                            <span className='text-xs font-bold text-gray-800 dark:text-white ml-auto'>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Jobs */}
            <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl overflow-hidden'>
                <div className='flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>Recent Jobs</h3>
                    <button onClick={() => handleTabChange('jobs')} className='text-xs text-green-600 dark:text-green-400 hover:underline'>View all →</button>
                </div>
                {myJobs.length === 0 ? (
                    <div className='text-center py-10'>
                        <p className='text-sm text-gray-400 dark:text-white/25 mb-3'>No jobs posted yet</p>
                        <Link to='/employer/post-job' className='text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors'>Post your first job</Link>
                    </div>
                ) : myJobs.slice(0, 4).map(job => (
                    <div key={job._id} className='flex items-center justify-between p-4 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/2 transition-colors'>
                        <div className='min-w-0'>
                            <p className='text-sm font-medium text-gray-800 dark:text-white truncate'>{job.title}</p>
                            <p className='text-xs text-gray-500 dark:text-white/30'>{job.location} · {job.type} · {job.application_count} apps</p>
                        </div>
                        <button onClick={() => handleViewApplications(job)}
                            className='text-xs bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/15 transition-colors shrink-0 ml-3'>
                            View
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

export default EmployerOverview