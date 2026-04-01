import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import Navbar from "../../../components/Navbar.jsx";
import useAdmin from "../hooks/useAdmin.js";

const COLORS = ["#22c55e", "#f59e0b", "#8b5cf6", "#3b82f6", "#ef4444"];

const AdminPanel = () => {
  const { 
    loading, getStats, getAnalytics, getPendingJobs, getAllJobs,
    getAllEmployers, getAllUsers, verifyJob, rejectJob, deleteJob,
    verifyEmployer, banUser, unbanUser, updateUserRole, getAllReports,
    resolveReport, dismissReport, getAllTestimonials, approveTestimonial,
    rejectTestimonial, deleteTestimonialAdmin,
    getAllTickets, replyTicket, updateTicketStatus,
    broadcastEmail
} = useAdmin()

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [reports, setReports] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [broadcastForm, setBroadcastForm] = useState({
    subject: '',
    message: '',
    target: 'all'
})
const [broadcastSuccess, setBroadcastSuccess] = useState('')

  useEffect(() => {
    loadStats();
    loadPendingJobs();
  }, []);

  useEffect(() => {
    if (activeTab === "testimonials") {
      getAllTestimonials().then((data) => setTestimonials(data || []));
    }
  }, [activeTab]);

  const loadStats = async () => { const data = await getStats(); setStats(data); };
  const loadPendingJobs = async () => { const data = await getPendingJobs(); setPendingJobs(data); };
  const loadAllJobs = async () => { const data = await getAllJobs(); setAllJobs(data); };
  const loadEmployers = async () => { const data = await getAllEmployers(); setEmployers(data); };
  const loadUsers = async () => { const data = await getAllUsers(); setUsers(data); };
  const loadAnalytics = async () => { const data = await getAnalytics(); setAnalytics(data); };
  const loadReports = async () => { const data = await getAllReports(); setReports(data); };

  const handleVerifyJob = async (id) => { await verifyJob(id); setPendingJobs((prev) => prev.filter((j) => j._id !== id)); loadStats(); };
  const handleRejectJob = async (id) => { await rejectJob(id); setPendingJobs((prev) => prev.filter((j) => j._id !== id)); loadStats(); };
  const handleDeleteJob = async (id) => { await deleteJob(id); setAllJobs((prev) => prev.filter((j) => j._id !== id)); loadStats(); };
  const handleVerifyEmployer = async (id) => { await verifyEmployer(id); setEmployers((prev) => prev.map((e) => (e._id === id ? { ...e, is_verified: true } : e))); };
  const handleBanUser = async (id) => { await banUser(id); setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, is_banned: true } : u))); };
  const handleUnbanUser = async (id) => { await unbanUser(id); setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, is_banned: false } : u))); };
  const handleRoleChange = async (id, role) => { await updateUserRole(id, role); setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u))); };
  const handleResolveReport = async (id) => { await resolveReport(id); setReports((prev) => prev.map((r) => (r._id === id ? { ...r, status: "resolved" } : r))); };
  const handleDismissReport = async (id) => { await dismissReport(id); setReports((prev) => prev.map((r) => (r._id === id ? { ...r, status: "dismissed" } : r))); };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "pending") loadPendingJobs();
    if (tab === "all-jobs") loadAllJobs();
    if (tab === "employers") loadEmployers();
    if (tab === "users") loadUsers();
    if (tab === "analytics") loadAnalytics();
    if (tab === "reports") loadReports();
    if (tab === "testimonials") getAllTestimonials().then((data) => setTestimonials(data || []));
    if (tab === "tickets") getAllTickets().then(data => setTickets(data || []))
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "▣" },
    { id: "pending", label: "Pending", icon: "⏳", count: stats?.pendingJobs || 0 },
    { id: "all-jobs", label: "All Jobs", icon: "◈" },
    { id: "employers", label: "Employers", icon: "◉" },
    { id: "users", label: "Users", icon: "◎" },
    { id: "analytics", label: "Analytics", icon: "◆" },
    { id: "reports", label: "Reports", icon: "⚑" },
    { id: "testimonials", label: "Testimonials", icon: "◗" },
    { id: "tickets", label: "Tickets", icon: "◑" },
    { id: "broadcast", label: "Broadcast", icon: "◎" },
  ];

  const pieData = stats ? [{ name: "Verified", value: stats.verifiedJobs }, { name: "Pending", value: stats.pendingJobs }] : [];
  const barData = stats ? [
    { name: "Jobs", value: stats.totalJobs, fill: "#22c55e" },
    { name: "Users", value: stats.totalUsers, fill: "#8b5cf6" },
    { name: "Employers", value: stats.totalEmployers, fill: "#3b82f6" },
    { name: "Applications", value: stats.totalApplications, fill: "#f59e0b" },
  ] : [];

  const LoadingSpinner = () => (
    <div className="text-center py-20">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Navbar />

      <div className="flex">
        {/* Sidebar — Desktop */}
        <div className={`hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>

          {/* Admin Info */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-lg">A</div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">Admin Panel</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Jobmate Platform</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-3 space-y-1">
            {sidebarItems.map((item) => (
              <button key={item.id} onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  activeTab === item.id
                    ? 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}>
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.count > 0 && (
                  <span className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Stats */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Jobs', value: stats?.totalJobs || 0, color: 'text-green-600' },
                { label: 'Users', value: stats?.totalUsers || 0, color: 'text-purple-600' },
                { label: 'Employers', value: stats?.totalEmployers || 0, color: 'text-blue-600' },
                { label: 'Pending', value: stats?.pendingJobs || 0, color: 'text-amber-600' },
              ].map((s, i) => (
                <div key={i} className="text-center bg-gray-50 dark:bg-gray-700 rounded-xl py-2">
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'} mb-16 md:mb-0`}>

          {/* Top Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden md:block text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg">
                {sidebarOpen ? '←' : '→'}
              </button>
              <div>
                <h1 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
                  {sidebarItems.find(t => t.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Jobmate Admin Panel</p>
              </div>
            </div>
            {stats && (
              <span className="text-xs bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-3 py-1.5 rounded-full font-medium">
                {stats.pendingJobs} Pending
              </span>
            )}
          </div>

          <div className="p-4 md:p-6">

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && stats && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Jobs", value: stats.totalJobs, color: "text-green-600", bg: "bg-green-500", change: "+12%" },
                    { label: "Pending", value: stats.pendingJobs, color: "text-amber-600", bg: "bg-amber-500", change: "Review now" },
                    { label: "Total Users", value: stats.totalUsers, color: "text-purple-600", bg: "bg-purple-500", change: "+8%" },
                    { label: "Applications", value: stats.totalApplications, color: "text-blue-600", bg: "bg-blue-500", change: "+24%" },
                  ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-white text-lg shadow-sm`} />
                        <span className="text-xs text-green-600 font-medium bg-green-50 dark:bg-green-900 px-2 py-1 rounded-full">{stat.change}</span>
                      </div>
                      <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Platform Overview</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {barData.map((entry, index) => (<Cell key={index} fill={entry.fill} />))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Job Verification Status</h3>
                    <div className="flex items-center gap-6">
                      <ResponsiveContainer width="60%" height={180}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                            {pieData.map((entry, index) => (<Cell key={index} fill={COLORS[index]} />))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <div><p className="text-xs font-medium text-gray-800 dark:text-white">Verified</p><p className="text-lg font-bold text-green-600">{stats.verifiedJobs}</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                          <div><p className="text-xs font-medium text-gray-800 dark:text-white">Pending</p><p className="text-lg font-bold text-amber-600">{stats.pendingJobs}</p></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{stats.verifiedJobs}</p>
                    <p className="text-green-100 text-sm">Verified Jobs</p>
                    <p className="text-xs text-green-200 mt-2">{Math.round((stats.verifiedJobs / stats.totalJobs) * 100) || 0}% of total</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{stats.totalEmployers}</p>
                    <p className="text-blue-100 text-sm">Registered Employers</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{stats.totalApplications}</p>
                    <p className="text-purple-100 text-sm">Total Applications</p>
                    <p className="text-xs text-purple-200 mt-2">Avg {Math.round(stats.totalApplications / (stats.totalJobs || 1))} per job</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { label: `Review Pending (${stats.pendingJobs})`, tab: 'pending', color: 'bg-amber-500 hover:bg-amber-600' },
                      { label: 'Verify Employers', tab: 'employers', color: 'bg-blue-600 hover:bg-blue-700' },
                      { label: 'All Jobs', tab: 'all-jobs', color: 'bg-green-600 hover:bg-green-700' },
                      { label: 'All Users', tab: 'users', color: 'bg-purple-600 hover:bg-purple-700' },
                    ].map((btn, i) => (
                      <button key={i} onClick={() => handleTabChange(btn.tab)}
                        className={`text-sm ${btn.color} text-white px-5 py-2.5 rounded-xl transition-colors font-medium shadow-sm`}>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Pending Jobs Tab */}
            {activeTab === "pending" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Pending Jobs — {pendingJobs.length} waiting
                </h2>
                {loading ? <LoadingSpinner /> : pendingJobs.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 font-medium">All jobs verified!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingJobs.map((job, i) => (
                      <motion.div key={job._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="bg-white dark:bg-gray-800 border-l-4 border-l-amber-500 border border-gray-100 dark:border-gray-700 rounded-2xl p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900 flex items-center justify-center text-amber-600 font-bold shrink-0">
                              {job.employer?.company_name?.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-0.5">{job.title}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{job.employer?.company_name} · {job.location} · {job.type}</p>
                            </div>
                          </div>
                          <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-medium shrink-0">Pending</span>
                        </div>
                        <div className="flex gap-2 flex-wrap mb-3">
                          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{job.category}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl line-clamp-2">{job.description}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleVerifyJob(job._id)}
                            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors">
                            Verify Job
                          </button>
                          <button onClick={() => handleRejectJob(job._id)}
                            className="flex-1 border border-red-200 text-red-600 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-50 transition-colors">
                            Reject
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* All Jobs Tab */}
            {activeTab === "all-jobs" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">All Jobs — {allJobs.length} total</h2>
                {loading ? <LoadingSpinner /> : (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    {allJobs.map((job, i) => (
                      <div key={job._id} className="flex items-center justify-between gap-3 p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
                            {job.employer?.company_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">{job.title}</p>
                            <p className="text-xs text-gray-500">{job.employer?.company_name} · {job.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${job.is_verified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                            {job.is_verified ? 'Verified' : 'Pending'}
                          </span>
                          <button
                          onClick={async () => {
                          await toggleFeaturedJob(job._id)
                          setAllJobs(prev => prev.map(j => j._id === job._id ? { ...j, is_featured: !j.is_featured } : j))
                  }}
        className={`text-xs px-3 py-1.5 rounded-lg transition-colors border ${
            job.is_featured
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'text-gray-500 border-gray-200 hover:bg-amber-50 hover:text-amber-600'
        }`}
    >
        {job.is_featured ? 'Featured' : 'Set Featured'}
    </button>
                          <button onClick={() => handleDeleteJob(job._id)}
                            className="text-xs text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-red-100">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Employers Tab */}
            {activeTab === "employers" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Company Verification</h2>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full font-medium">{employers.filter((e) => e.is_verified).length} Verified</span>
                    <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full font-medium">{employers.filter((e) => !e.is_verified).length} Pending</span>
                  </div>
                </div>
                {loading ? <LoadingSpinner /> : (
                  <div className="space-y-3">
                    {employers.map((employer, i) => (
                      <motion.div key={employer._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className={`bg-white dark:bg-gray-800 border rounded-2xl p-5 ${employer.is_verified ? 'border-green-200' : 'border-amber-200'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${employer.is_verified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                              {employer.company_name?.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{employer.company_name}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${employer.is_verified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                  {employer.is_verified ? 'Verified' : 'Pending'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{employer.email}</p>
                              <p className="text-xs text-gray-500">{employer.location || 'Nepal'}</p>
                            </div>
                          </div>
                          {!employer.is_verified && (
                            <button onClick={() => handleVerifyEmployer(employer._id)}
                              className="text-xs bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors font-semibold">
                              Verify Company
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">User Management</h2>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full">{users.length} Total</span>
                    <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full">{users.filter((u) => u.is_banned).length} Banned</span>
                  </div>
                </div>
                {loading ? <LoadingSpinner /> : (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    {users.map((user, i) => (
                      <div key={user._id} className={`flex items-center justify-between gap-3 p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 ${user.is_banned ? 'bg-red-50 dark:bg-red-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${user.is_banned ? 'bg-red-100 text-red-600' : 'bg-purple-50 text-purple-700'}`}>
                            {user.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-700 dark:text-white outline-none">
                            <option value="jobseeker">Job Seeker</option>
                            <option value="admin">Admin</option>
                          </select>
                          {user.is_banned ? (
                            <button onClick={() => handleUnbanUser(user._id)}
                              className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">Unban</button>
                          ) : (
                            <button onClick={() => handleBanUser(user._id)}
                              className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Ban</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {loading ? <LoadingSpinner /> : !analytics ? (
                  <div className="text-center py-20"><p className="text-gray-500">Loading analytics...</p></div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Jobs by Category</h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={analytics.jobsByCategory.map((j) => ({ name: j._id, value: j.count }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Jobs by Type</h3>
                        <div className="flex items-center gap-4">
                          <ResponsiveContainer width="55%" height={180}>
                            <PieChart>
                              <Pie data={analytics.jobsByType.map((j) => ({ name: j._id, value: j.count }))} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                                {analytics.jobsByType.map((entry, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="space-y-2">
                            {analytics.jobsByType.map((item, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">{item._id}</span>
                                <span className="text-xs font-bold text-gray-800 dark:text-white ml-auto">{item.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Applications by Status</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={analytics.applicationsByStatus.map((a) => ({ name: a._id, value: a.count }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                              {analytics.applicationsByStatus.map((entry, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Jobs by Location</h3>
                        <div className="space-y-3">
                          {analytics.jobsByLocation.map((loc, i) => (
                            <div key={i}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-600 dark:text-gray-300">{loc._id}</span>
                                <span className="text-xs font-bold text-gray-800 dark:text-white">{loc.count}</span>
                              </div>
                              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(loc.count / analytics.jobsByLocation[0].count) * 100}%` }}
                                  transition={{ duration: 0.8, delay: i * 0.1 }} className="h-2 rounded-full bg-green-500" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">User Growth</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={analytics.usersByMonth.map((u) => ({ name: `${u._id.month}/${u._id.year}`, users: u.count }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Report System</h2>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full">{reports.filter((r) => r.status === "pending").length} Pending</span>
                    <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full">{reports.filter((r) => r.status === "resolved").length} Resolved</span>
                  </div>
                </div>
                {loading ? <LoadingSpinner /> : reports.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 font-medium">No reports yet!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report, i) => (
                      <motion.div key={report._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className={`bg-white dark:bg-gray-800 border rounded-2xl p-5 ${report.status === "pending" ? "border-red-200" : report.status === "resolved" ? "border-green-200" : "border-gray-200"}`}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-0.5">{report.job?.title || "Job Deleted"}</h3>
                            <p className="text-xs text-gray-500">Reported by: {report.reportedBy?.name} · {report.reportedBy?.email}</p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${report.status === "pending" ? "bg-red-50 text-red-600" : report.status === "resolved" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                            {report.status}
                          </span>
                        </div>
                        {report.description && (
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-3">
                            <p className="text-xs text-gray-600 dark:text-gray-300">"{report.description}"</p>
                          </div>
                        )}
                        {report.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => handleResolveReport(report._id)}
                              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors">
                              Resolve — Remove Job
                            </button>
                            <button onClick={() => handleDismissReport(report._id)}
                              className="flex-1 border border-gray-200 text-gray-500 py-2.5 rounded-xl text-xs hover:bg-gray-50 transition-colors">
                              Dismiss
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Testimonials Tab */}
            {activeTab === "testimonials" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Testimonials</h2>
                {testimonials.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500">No testimonials yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {testimonials.map((t, i) => (
                      <motion.div key={t._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{t.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === "approved" ? "bg-green-50 text-green-600" : t.status === "rejected" ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600"}`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{t.role} · {t.company}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">"{t.text}"</p>
                        <div className="flex gap-2 mt-4">
                          {t.status !== "approved" && (
                            <button onClick={async () => { await approveTestimonial(t._id); setTestimonials((prev) => prev.map((x) => x._id === t._id ? { ...x, status: "approved" } : x)); }}
                              className="text-xs bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors">Approve</button>
                          )}
                          {t.status !== "rejected" && (
                            <button onClick={async () => { await rejectTestimonial(t._id); setTestimonials((prev) => prev.map((x) => x._id === t._id ? { ...x, status: "rejected" } : x)); }}
                              className="text-xs border border-red-200 text-red-500 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">Reject</button>
                          )}
                          <button onClick={async () => { await deleteTestimonialAdmin(t._id); setTestimonials((prev) => prev.filter((x) => x._id !== t._id)); }}
                            className="text-xs border border-gray-200 text-gray-500 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">Delete</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === "broadcast" && (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Email Broadcast
        </h2>

        <div className="max-w-2xl">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 space-y-4">
                
                {broadcastSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                        {broadcastSuccess}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Target Audience
                    </label>
                    <select
                        value={broadcastForm.target}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, target: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">All Users + Employers</option>
                        <option value="jobseekers">Job Seekers Only</option>
                        <option value="employers">Employers Only</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject *
                    </label>
                    <input
                        type="text"
                        placeholder="Email subject..."
                        value={broadcastForm.subject}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                        className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Message *
                    </label>
                    <textarea
                        placeholder="Write your message..."
                        value={broadcastForm.message}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                        rows={6}
                        className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white resize-none"
                    />
                </div>

                <button
                    onClick={async () => {
                        if (!broadcastForm.subject || !broadcastForm.message) return
                        const data = await broadcastEmail(broadcastForm)
                        if (data) {
                            setBroadcastSuccess(`✓ ${data.message}`)
                            setBroadcastForm({ subject: '', message: '', target: 'all' })
                            setTimeout(() => setBroadcastSuccess(''), 5000)
                        }
                    }}
                    disabled={loading || !broadcastForm.subject || !broadcastForm.message}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Sending...' : 'Send Broadcast Email'}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Email will be sent to all selected users
                </p>
            </div>
        </div>
    </motion.div>
)}
            {activeTab === "tickets" && (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Support Tickets
            </h2>
            <div className="flex gap-2 text-xs">
                <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full">
                    {tickets.filter(t => t.status === 'open').length} Open
                </span>
                <span className="bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full">
                    {tickets.filter(t => t.status === 'in_progress').length} In Progress
                </span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tickets List */}
            <div className="space-y-2">
                {tickets.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <p className="text-gray-500 text-sm">No tickets yet</p>
                    </div>
                ) : (
                    tickets.map((ticket, i) => (
                        <div key={ticket._id}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`bg-white dark:bg-gray-800 border rounded-xl p-4 cursor-pointer transition-all ${
                                selectedTicket?._id === ticket._id
                                    ? 'border-purple-500 shadow-sm'
                                    : 'border-gray-100 dark:border-gray-700 hover:border-purple-300'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                    {ticket.subject}
                                </p>
                                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                                    ticket.status === 'open' ? 'bg-blue-50 text-blue-600' :
                                    ticket.status === 'in_progress' ? 'bg-yellow-50 text-yellow-600' :
                                    ticket.status === 'resolved' ? 'bg-green-50 text-green-600' :
                                    'bg-gray-100 text-gray-500'
                                }`}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">{ticket.name} · {ticket.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    ticket.priority === 'high' ? 'bg-red-50 text-red-600' :
                                    ticket.priority === 'medium' ? 'bg-blue-50 text-blue-600' :
                                    'bg-gray-100 text-gray-500'
                                }`}>
                                    {ticket.priority}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
                
            {/* Ticket Detail */}
            {selectedTicket ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 h-fit">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                                {selectedTicket.subject}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {selectedTicket.name} · {selectedTicket.email}
                            </p>
                        </div>
                        <select
                            value={selectedTicket.status}
                            onChange={async (e) => {
                                await updateTicketStatus(selectedTicket._id, e.target.value)
                                setTickets(prev => prev.map(t => t._id === selectedTicket._id ? { ...t, status: e.target.value } : t))
                                setSelectedTicket(prev => ({ ...prev, status: e.target.value }))
                            }}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-700 dark:text-white outline-none"
                        >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    {/* Message */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-4">
                        <p className="text-xs text-gray-600 dark:text-gray-300">{selectedTicket.message}</p>
                    </div>

                    {/* Replies */}
                    {selectedTicket.replies?.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {selectedTicket.replies.map((reply, i) => (
                                <div key={i} className={`rounded-xl p-3 ${reply.isAdmin ? 'bg-purple-50 dark:bg-purple-900' : 'bg-gray-50 dark:bg-gray-700'}`}>
                                    <p className="text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                        {reply.isAdmin ? 'Support Team' : selectedTicket.name}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">{reply.message}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reply Input */}
                    <div className="space-y-2">
                        <textarea
                            placeholder="Type your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white resize-none"
                        />
                        <button
                            onClick={async () => {
                                if (!replyText.trim()) return
                                const updated = await replyTicket(selectedTicket._id, replyText)
                                if (updated) {
                                    setSelectedTicket(updated)
                                    setTickets(prev => prev.map(t => t._id === updated._id ? updated : t))
                                    setReplyText('')
                                }
                            }}
                            className="w-full bg-purple-600 text-white py-2 rounded-xl text-xs font-medium hover:bg-purple-700 transition-colors"
                        >
                            Send Reply
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500">Select a ticket to reply</p>
                </div>
            )}
        </div>
    </motion.div>
)}

          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-around px-2 py-2 overflow-x-auto">
          {sidebarItems.slice(0, 5).map((item) => (
            <button key={item.id} onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors relative shrink-0 ${activeTab === item.id ? 'text-purple-600' : 'text-gray-400'}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {item.count > 0 && (
                <span className="absolute -top-0.5 right-0 w-4 h-4 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">{item.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;