import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import useEmployer from '../../hooks/useEmployer.js'
import useAuth from '../../../auth/hooks/useAuth.js'
import useCRM from '../../hooks/useCRM.js'
import { setMyJobs, setApplications, removeJob } from '../../employer.slice.js'
import { setUser } from '../../../auth/auth.slice.js'
import Navbar from '../../../../components/Navbar.jsx'
import EmployerOverview from './EmployerOverview.jsx'
import { EmployerJobs, EmployerApplications } from './EmployerJobsApps.jsx'
import { EmployerCRM, EmployerSettings } from './EmployerCRMSettings.jsx'

const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='3' width='7' height='7'/><rect x='14' y='3' width='7' height='7'/><rect x='14' y='14' width='7' height='7'/><rect x='3' y='14' width='7' height='7'/></svg> },
    { id: 'jobs', label: 'My Jobs', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='2' y='7' width='20' height='14' rx='2'/><path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'/></svg> },
    { id: 'applications', label: 'Applications', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg> },
    { id: 'crm', label: 'CRM', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/></svg> },
    { id: 'company-settings', label: 'Company Settings', icon: <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='3'/><path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'/></svg> },
]

const EmployerDashboard = () => {
    const dispatch = useDispatch()
    const { user } = useAuth()
    const { myJobs, applications } = useSelector(state => state.employer)
    const { fetchMyJobs, removeJobById, fetchJobApplications, updateStatus, loading, uploadLogo, updateCompanyProfile } = useEmployer()
    const { candidates: crmCandidates, loading: crmLoading, loadCandidates, addCandidate, updateStatus: updateCRMStatus, addNote, setFollowUp, deleteCandidate } = useCRM()

    const [activeTab, setActiveTab] = useState('overview')
    const [selectedJob, setSelectedJob] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [viewMode, setViewMode] = useState('list')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [logoPreview, setLogoPreview] = useState(null)
    const [uploading, setUploading] = useState(false)

    const [showAddCandidate, setShowAddCandidate] = useState(false)
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [newNote, setNewNote] = useState('')
    const [candidateForm, setCandidateForm] = useState({ name: '', email: '', phone: '', location: '', skills: '', source: 'jobmate' })

    const [companyForm, setCompanyForm] = useState({
        description: user?.description || '', location: user?.location || '', customLocation: '',
        industry: user?.industry || '', company_size: user?.company_size || '',
        founded_year: user?.founded_year || '', website: user?.website || '', phone: user?.phone || '',
        social_links: { linkedin: user?.social_links?.linkedin || '', facebook: user?.social_links?.facebook || '' }
    })
    const [companySaving, setCompanySaving] = useState(false)
    const [companySuccess, setCompanySuccess] = useState(false)

    useEffect(() => { loadJobs() }, [])
    useEffect(() => { if (activeTab === 'crm') loadCandidates() }, [activeTab])

    const loadJobs = async () => { const jobs = await fetchMyJobs(); dispatch(setMyJobs(jobs)) }

    const totalApplications = myJobs.reduce((a, j) => a + j.application_count, 0)
    const activeJobs = myJobs.filter(j => j.is_active).length

    const handleViewApplications = async (job) => {
        setSelectedJob(job)
        setActiveTab('applications')
        const apps = await fetchJobApplications(job._id)
        dispatch(setApplications(apps))
    }

    const handleDeleteJob = async (id) => {
        setDeleting(id)
        await removeJobById(id)
        dispatch(removeJob(id))
        setDeleting(null)
    }

    const handleStatusUpdate = async (appId, status) => {
        await updateStatus(appId, status)
        const apps = await fetchJobApplications(selectedJob._id)
        dispatch(setApplications(apps))
    }

    const handleDragEnd = async (result) => {
        if (!result.destination) return
        await handleStatusUpdate(result.draggableId, result.destination.droppableId)
    }

    const handleAddCandidate = async () => {
        if (!candidateForm.name) return
        await addCandidate({ candidate: candidateForm, source: candidateForm.source })
        setShowAddCandidate(false)
        setCandidateForm({ name: '', email: '', phone: '', location: '', skills: '', source: 'jobmate' })
    }

    const handleCRMStatus = async (id, status) => {
        await updateCRMStatus(id, status)
        if (selectedCandidate?._id === id) setSelectedCandidate(prev => ({ ...prev, status }))
    }

    const handleAddNote = async (id) => {
        if (!newNote.trim()) return
        const updated = await addNote(id, newNote)
        setSelectedCandidate(updated)
        setNewNote('')
    }

    const handleDeleteCandidate = async (id) => {
        await deleteCandidate(id)
        setSelectedCandidate(null)
    }

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setLogoPreview(URL.createObjectURL(file))
        setUploading(true)
        try { const data = await uploadLogo(file); dispatch(setUser({ ...user, logo_url: data.logo_url })) }
        catch (err) { setLogoPreview(null) }
        finally { setUploading(false) }
    }

    const handleCompanySave = async () => {
        setCompanySaving(true)
        try {
            const finalLocation = companyForm.location === 'Other' ? companyForm.customLocation : companyForm.location
            await updateCompanyProfile({ ...companyForm, location: finalLocation })
            setCompanySuccess(true)
            setTimeout(() => setCompanySuccess(false), 3000)
        } catch (err) { console.error(err) }
        finally { setCompanySaving(false) }
    }

    const handleTabChange = (tab) => { setActiveTab(tab); setMobileMenuOpen(false) }

    const activeItem = sidebarItems.find(i => i.id === activeTab)

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-[#08111f] transition-colors duration-300'>
            <div className='fixed inset-0 opacity-0 dark:opacity-100 pointer-events-none'
                style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <Navbar />

            <div className='flex overflow-hidden'>
                {/* ── DESKTOP SIDEBAR ── */}
                <aside className='hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex-col z-40 bg-white dark:bg-[#0c1a2e] border-r border-gray-200 dark:border-white/6'>

                    {/* Company Info */}
                    <div className='p-4 border-b border-gray-100 dark:border-white/6'>
                        <div className='flex items-center gap-3'>
                            <div className='relative'>
                                <div className='w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 border border-gray-100 dark:border-white/5 flex items-center justify-center overflow-hidden'>
                                    {logoPreview || user?.logo_url ? (
                                        <img src={logoPreview || user?.logo_url} alt='Logo' className='w-full h-full object-cover' />
                                    ) : (
                                        <span className='text-green-600 dark:text-green-400 font-bold text-lg'>
                                            {user?.company_name?.charAt(0) || user?.name?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <label className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center cursor-pointer transition-colors'>
                                    <input type='file' accept='image/*' onChange={handleLogoUpload} className='hidden' />
                                    <svg className='w-3 h-3 text-white' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>
                                </label>
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-semibold text-gray-800 dark:text-white truncate'>{user?.company_name || user?.name}</p>
                                <p className='text-xs text-gray-400 dark:text-white/30'>Employer</p>
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
                                <span className={activeTab === item.id ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-white/25'}>{item.icon}</span>
                                <span className='flex-1 text-left'>{item.label}</span>
                                {item.id === 'jobs' && myJobs.length > 0 && (
                                    <span className='text-xs bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-white/35 px-2 py-0.5 rounded-full'>{myJobs.length}</span>
                                )}
                                {item.id === 'applications' && totalApplications > 0 && (
                                    <span className='text-xs bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold'>{totalApplications}</span>
                                )}
                            </button>
                        ))}

                        {/* Company Profile link */}
                        <Link to={`/companies/${user?._id || user?.id}`}
                            className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/3 hover:text-gray-800 dark:hover:text-white transition-all'>
                            <span className='text-gray-400 dark:text-white/25'>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>
                            </span>
                            Company Profile
                        </Link>

                        {/* Post Job link */}
                        <Link to='/employer/post-job'
                            className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/3 hover:text-gray-800 dark:hover:text-white transition-all'>
                            <span className='text-gray-400 dark:text-white/25'>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>
                            </span>
                            Post a Job
                        </Link>
                    </nav>

                    {/* Bottom stats */}
                    <div className='p-4 border-t border-gray-100 dark:border-white/6'>
                        <div className='grid grid-cols-3 gap-2 mb-3'>
                            {[
                                { label: 'Jobs', value: myJobs.length, color: 'text-green-500' },
                                { label: 'Apps', value: totalApplications, color: 'text-blue-500' },
                                { label: 'Active', value: activeJobs, color: 'text-purple-500' },
                            ].map((s, i) => (
                                <div key={i} className='text-center bg-gray-50 dark:bg-white/3 rounded-xl py-2'>
                                    <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
                                    <p className='text-xs text-gray-400 dark:text-white/25'>{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className='bg-green-50 dark:bg-green-500/8 border border-green-100 dark:border-green-500/15 rounded-xl p-3 text-center'>
                            <p className='text-xs font-medium text-green-700 dark:text-green-400 mb-0.5'>Need Support?</p>
                            <p className='text-xs text-green-600 dark:text-green-400/70'>hello@jobmate.com.np</p>
                        </div>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main className='flex-1 md:ml-64 p-4 md:p-6 pb-24 md:pb-6 relative z-10 overflow-x-auto'>

                    {/* Top bar */}
                    <div className='flex items-center justify-between mb-6'>
                        <div className='flex items-center gap-3'>
                            <div>
                                <h1 className='text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2'>
                                    <span className='text-green-600 dark:text-green-400'>{activeItem?.icon}</span>
                                    {activeItem?.label}
                                </h1>
                                <p className='text-xs text-gray-400 dark:text-white/25 mt-0.5 hidden md:block'>
                                    Welcome back, {user?.company_name || user?.name}
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Link to='/employer/post-job'
                                className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                                <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>
                                <span className='hidden sm:block'>Post Job</span>
                            </Link>
                            <button onClick={() => setMobileMenuOpen(true)}
                                className='md:hidden flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-3 py-2.5 text-gray-600 dark:text-white/50'>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='18' x2='21' y2='18'/></svg>
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode='wait'>
                        {activeTab === 'overview' && (
                            <EmployerOverview key='overview' myJobs={myJobs} applications={applications}
                                totalApplications={totalApplications} activeJobs={activeJobs}
                                handleViewApplications={handleViewApplications} handleTabChange={handleTabChange} />
                        )}
                        {activeTab === 'jobs' && (
                            <EmployerJobs key='jobs' myJobs={myJobs} loading={loading}
                                handleViewApplications={handleViewApplications} handleDeleteJob={handleDeleteJob} deleting={deleting} />
                        )}
                        {activeTab === 'applications' && (
                            <EmployerApplications key='applications' applications={applications} selectedJob={selectedJob}
                                viewMode={viewMode} setViewMode={setViewMode}
                                handleStatusUpdate={handleStatusUpdate} handleDragEnd={handleDragEnd}
                                handleTabChange={handleTabChange} />
                        )}
                        {activeTab === 'crm' && (
                            <EmployerCRM key='crm' crmCandidates={crmCandidates} crmLoading={crmLoading}
                                showAddCandidate={showAddCandidate} setShowAddCandidate={setShowAddCandidate}
                                candidateForm={candidateForm} setCandidateForm={setCandidateForm}
                                selectedCandidate={selectedCandidate} setSelectedCandidate={setSelectedCandidate}
                                newNote={newNote} setNewNote={setNewNote}
                                handleAddCandidate={handleAddCandidate} handleCRMStatus={handleCRMStatus}
                                handleAddNote={handleAddNote} handleDeleteCandidate={handleDeleteCandidate}
                                setFollowUp={setFollowUp} />
                        )}
                        {activeTab === 'company-settings' && (
                            <EmployerSettings key='company-settings' user={user}
                                companyForm={companyForm} setCompanyForm={setCompanyForm}
                                handleCompanySave={handleCompanySave} companySaving={companySaving} companySuccess={companySuccess} />
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* ── MOBILE DRAWER ── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)} className='fixed inset-0 bg-black/60 z-50 md:hidden' />
                        <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className='fixed left-0 top-0 h-full w-72 bg-white dark:bg-[#0c1a2e] border-r border-gray-200 dark:border-white/6 z-50 flex flex-col md:hidden'>
                            <div className='p-4 border-b border-gray-100 dark:border-white/6 flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 font-bold'>
                                        {user?.company_name?.charAt(0) || user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className='text-sm font-semibold text-gray-800 dark:text-white'>{user?.company_name || user?.name}</p>
                                        <p className='text-xs text-gray-400 dark:text-white/30'>Employer</p>
                                    </div>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-white/50'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><path d='M18 6 6 18M6 6l12 12'/></svg>
                                </button>
                            </div>
                            <nav className='flex-1 p-3 space-y-1'>
                                {sidebarItems.map(item => (
                                    <button key={item.id} onClick={() => handleTabChange(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                            activeTab === item.id
                                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-semibold'
                                                : 'text-gray-600 dark:text-white/40'
                                        }`}>
                                        <span>{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                                <Link to={`/companies/${user?._id || user?.id}`} className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-white/40'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>
                                    Company Profile
                                </Link>
                                <Link to='/employer/post-job' className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-white/40'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>
                                    Post a Job
                                </Link>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── MOBILE BOTTOM NAV ── */}
            <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0c1a2e] border-t border-gray-200 dark:border-white/6 z-40'>
                <div className='flex items-center justify-around px-2 py-2'>
                    {[
                        { id: 'overview', label: 'Dashboard', icon: <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='3' width='7' height='7'/><rect x='14' y='3' width='7' height='7'/><rect x='14' y='14' width='7' height='7'/><rect x='3' y='14' width='7' height='7'/></svg> },
                        { id: 'jobs', label: 'Jobs', icon: <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='2' y='7' width='20' height='14' rx='2'/><path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'/></svg>, count: myJobs.length },
                        { id: 'applications', label: 'Apps', icon: <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/></svg>, count: totalApplications },
                        { id: 'crm', label: 'CRM', icon: <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 0 0-3-3.87'/></svg> },
                    ].map(item => (
                        <button key={item.id} onClick={() => handleTabChange(item.id)}
                            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors relative shrink-0 ${activeTab === item.id ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-white/25'}`}>
                            {item.icon}
                            <span className='text-[10px] font-medium'>{item.label}</span>
                            {item.count > 0 && (
                                <span className='absolute -top-0.5 right-0 w-4 h-4 bg-green-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold'>{item.count}</span>
                            )}
                        </button>
                    ))}
                    <Link to='/employer/post-job' className='flex flex-col items-center gap-1 px-3 py-1.5 text-gray-400 dark:text-white/25'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>
                        <span className='text-[10px] font-medium'>Post</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default EmployerDashboard