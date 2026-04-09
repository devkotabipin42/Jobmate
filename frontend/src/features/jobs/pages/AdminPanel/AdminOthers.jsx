import { motion } from 'framer-motion'

// ── REPORTS ──────────────────────────────────────────────
export const AdminReports = ({ reports, loading, handleResolveReport, handleDismissReport }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Report System</h2>
                <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>{reports.length} total reports</p>
            </div>
            <div className='flex gap-2'>
                <span className='text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-full font-medium'>
                    {reports.filter(r => r.status === 'pending').length} Pending
                </span>
                <span className='text-xs bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-full font-medium'>
                    {reports.filter(r => r.status === 'resolved').length} Resolved
                </span>
            </div>
        </div>

        {reports.length === 0 ? (
            <div className='text-center py-20 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                <div className='w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                    <svg className='w-7 h-7 text-green-500' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                </div>
                <p className='text-gray-800 dark:text-white font-semibold'>No reports yet!</p>
                <p className='text-sm text-gray-400 dark:text-white/30 mt-1'>Platform is clean</p>
            </div>
        ) : (
            <div className='space-y-3'>
                {reports.map((report, i) => (
                    <motion.div key={report._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className={`bg-white dark:bg-white/3 border rounded-2xl p-5 ${
                            report.status === 'pending' ? 'border-red-200 dark:border-red-500/20' :
                            report.status === 'resolved' ? 'border-green-200 dark:border-green-500/20' :
                            'border-gray-200 dark:border-white/7'
                        }`}>
                        <div className='flex items-start justify-between gap-3 mb-3'>
                            <div>
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-0.5'>
                                    {report.job?.title || 'Job Deleted'}
                                </h3>
                                <p className='text-xs text-gray-500 dark:text-white/35'>
                                    Reported by: {report.reportedBy?.name} · {report.reportedBy?.email}
                                </p>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${
                                report.status === 'pending' ? 'bg-red-500/10 text-red-500' :
                                report.status === 'resolved' ? 'bg-green-500/10 text-green-500' :
                                'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40'
                            }`}>
                                {report.status}
                            </span>
                        </div>
                        {report.description && (
                            <div className='bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl p-3 mb-3'>
                                <p className='text-xs text-gray-600 dark:text-white/40'>"{report.description}"</p>
                            </div>
                        )}
                        {report.status === 'pending' && (
                            <div className='flex gap-2'>
                                <button onClick={() => handleResolveReport(report._id)}
                                    className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-xs font-semibold transition-colors'>
                                    Resolve — Remove Job
                                </button>
                                <button onClick={() => handleDismissReport(report._id)}
                                    className='flex-1 border border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/40 py-2.5 rounded-xl text-xs hover:bg-gray-50 dark:hover:bg-white/3 transition-colors'>
                                    Dismiss
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        )}
    </motion.div>
)

// ── TESTIMONIALS ─────────────────────────────────────────
export const AdminTestimonials = ({ testimonials, setTestimonials, approveTestimonial, rejectTestimonial, deleteTestimonialAdmin }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Testimonials</h2>
                <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>{testimonials.length} total testimonials</p>
            </div>
            <div className='flex gap-2'>
                <span className='text-xs bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-full font-medium'>
                    {testimonials.filter(t => t.status === 'approved').length} Approved
                </span>
                <span className='text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-full font-medium'>
                    {testimonials.filter(t => t.status === 'pending').length} Pending
                </span>
            </div>
        </div>

        {testimonials.length === 0 ? (
            <div className='text-center py-20 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                <p className='text-gray-800 dark:text-white font-semibold'>No testimonials yet</p>
            </div>
        ) : (
            <div className='space-y-3'>
                {testimonials.map((t, i) => (
                    <motion.div key={t._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className='bg-white dark:bg-white/3 border border-gray-100 dark:border-white/7 rounded-2xl p-5'>
                        <div className='flex items-center gap-2 mb-2'>
                            <div className='w-9 h-9 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-bold text-sm'>
                                {t.name?.charAt(0)}
                            </div>
                            <div>
                                <div className='flex items-center gap-2'>
                                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>{t.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        t.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                        t.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                        'bg-amber-500/10 text-amber-500'
                                    }`}>
                                        {t.status}
                                    </span>
                                </div>
                                <p className='text-xs text-gray-500 dark:text-white/35'>{t.role} · {t.company}</p>
                            </div>
                        </div>
                        <p className='text-sm text-gray-600 dark:text-white/50 bg-gray-50 dark:bg-white/3 rounded-xl p-3 mb-4'>"{t.text}"</p>
                        <div className='flex gap-2'>
                            {t.status !== 'approved' && (
                                <button onClick={async () => {
                                    await approveTestimonial(t._id)
                                    setTestimonials(prev => prev.map(x => x._id === t._id ? { ...x, status: 'approved' } : x))
                                }} className='text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors font-medium'>
                                    Approve
                                </button>
                            )}
                            {t.status !== 'rejected' && (
                                <button onClick={async () => {
                                    await rejectTestimonial(t._id)
                                    setTestimonials(prev => prev.map(x => x._id === t._id ? { ...x, status: 'rejected' } : x))
                                }} className='text-xs border border-red-200 dark:border-red-500/20 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500/5 transition-colors'>
                                    Reject
                                </button>
                            )}
                            <button onClick={async () => {
                                await deleteTestimonialAdmin(t._id)
                                setTestimonials(prev => prev.filter(x => x._id !== t._id))
                            }} className='text-xs border border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/35 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/3 transition-colors'>
                                Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
    </motion.div>
)

// ── BROADCAST ────────────────────────────────────────────
export const AdminBroadcast = ({ broadcastForm, setBroadcastForm, broadcastEmail, broadcastSuccess, setBroadcastSuccess, loading }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className='mb-6'>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Email Broadcast</h2>
            <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>Send announcements to all users</p>
        </div>

        <div className='max-w-2xl'>
            <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 space-y-4'>
                {broadcastSuccess && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className='bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2'>
                        <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                        {broadcastSuccess}
                    </motion.div>
                )}

                <div>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Target Audience</label>
                    <select value={broadcastForm.target} onChange={e => setBroadcastForm({ ...broadcastForm, target: e.target.value })}
                        className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 dark:text-white cursor-pointer'>
                        <option value='all'>All Users + Employers</option>
                        <option value='jobseekers'>Job Seekers Only</option>
                        <option value='employers'>Employers Only</option>
                    </select>
                </div>

                <div>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Subject</label>
                    <input type='text' placeholder='Email subject...' value={broadcastForm.subject}
                        onChange={e => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                        className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 dark:text-white placeholder-gray-400 dark:placeholder-white/20' />
                </div>

                <div>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Message</label>
                    <textarea placeholder='Write your message...' value={broadcastForm.message}
                        onChange={e => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                        rows={6}
                        className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 dark:text-white placeholder-gray-400 dark:placeholder-white/20 resize-none' />
                </div>

                <button onClick={async () => {
                    if (!broadcastForm.subject || !broadcastForm.message) return
                    const data = await broadcastEmail(broadcastForm)
                    if (data) {
                        setBroadcastSuccess(`Email sent successfully!`)
                        setBroadcastForm({ subject: '', message: '', target: 'all' })
                        setTimeout(() => setBroadcastSuccess(''), 5000)
                    }
                }} disabled={loading || !broadcastForm.subject || !broadcastForm.message}
                    className='w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors'>
                    {loading ? 'Sending...' : 'Send Broadcast Email'}
                </button>

                <p className='text-xs text-gray-400 dark:text-white/25 text-center'>Email will be sent to all selected users</p>
            </div>
        </div>
    </motion.div>
)

// ── FEATURED COMPANIES ────────────────────────────────────
export const AdminFeaturedCompanies = ({ companies, loading, onAdd, onDelete, onToggle, form, setForm, uploading }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Featured Companies</h2>
                <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>Manually add companies to showcase on the Companies page</p>
            </div>
        </div>

        {/* Add Form */}
        <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 mb-6'>
            <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Add New Company</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Company Name *</label>
                    <input type='text' placeholder='e.g. Ncell Pvt. Ltd.' value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:text-white placeholder-gray-400 dark:placeholder-white/20' />
                </div>
                <div>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Location</label>
                    <input type='text' placeholder='e.g. Kathmandu' value={form.location}
                        onChange={e => setForm({ ...form, location: e.target.value })}
                        className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:text-white placeholder-gray-400 dark:placeholder-white/20' />
                </div>
                <div>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Industry</label>
                    <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}
                        className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:text-white'>
                        <option value=''>Select industry</option>
                        {['IT/Tech', 'Finance/Banking', 'Healthcare', 'Education', 'NGO/INGO', 'Telecom', 'Manufacturing', 'Hospitality', 'Other'].map(i => (
                            <option key={i} value={i} className='dark:bg-[#0c1a2e]'>{i}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Website</label>
                    <input type='text' placeholder='https://company.com' value={form.website}
                        onChange={e => setForm({ ...form, website: e.target.value })}
                        className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:text-white placeholder-gray-400 dark:placeholder-white/20' />
                </div>
                <div className='md:col-span-2'>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Description</label>
                    <textarea placeholder='Brief description of the company...' value={form.description} rows={2}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:text-white placeholder-gray-400 dark:placeholder-white/20 resize-none' />
                </div>
                <div className='md:col-span-2'>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Company Logo</label>
                    <label className='flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-200 dark:border-white/8 rounded-xl p-4 hover:border-green-400 dark:hover:border-green-500/40 transition-colors'>
                        <input type='file' accept='image/*' onChange={e => setForm({ ...form, logo: e.target.files[0] })} className='hidden' />
                        <div className='w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center shrink-0'>
                            {form.logo
                                ? <img src={URL.createObjectURL(form.logo)} alt='preview' className='w-full h-full object-cover rounded-xl' />
                                : <svg className='w-5 h-5 text-gray-400 dark:text-white/25' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>
                            }
                        </div>
                        <div>
                            <p className='text-sm font-medium text-gray-800 dark:text-white'>{form.logo ? form.logo.name : 'Upload Logo'}</p>
                            <p className='text-xs text-gray-400 dark:text-white/25'>PNG, JPG — Max 5MB</p>
                        </div>
                    </label>
                </div>
            </div>
            <button onClick={onAdd} disabled={!form.name || uploading}
                className='w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2'>
                {uploading ? (
                    <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className='w-4 h-4 border-2 border-white border-t-transparent rounded-full' />Adding...</>
                ) : 'Add Featured Company'}
            </button>
        </div>

        {/* Companies List */}
        {loading ? (
            <div className='flex items-center justify-center py-20'>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full' />
            </div>
        ) : companies.length === 0 ? (
            <div className='text-center py-16 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                <p className='text-gray-800 dark:text-white font-semibold mb-1'>No featured companies yet</p>
                <p className='text-sm text-gray-400 dark:text-white/30'>Add companies above to showcase them</p>
            </div>
        ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {companies.map((company, i) => (
                    <motion.div key={company._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className={`bg-white dark:bg-white/3 border rounded-2xl p-4 transition-all ${company.is_active ? 'border-gray-200 dark:border-white/7' : 'border-gray-200 dark:border-white/3 opacity-60'}`}>
                        <div className='flex items-start gap-3 mb-3'>
                            <div className='w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 flex items-center justify-center overflow-hidden shrink-0'>
                                {company.logo_url
                                    ? <img src={company.logo_url} alt={company.name} className='w-full h-full object-cover' />
                                    : <span className='text-lg font-bold text-gray-500 dark:text-white/30'>{company.name?.charAt(0)}</span>
                                }
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white truncate'>{company.name}</h3>
                                <p className='text-xs text-gray-400 dark:text-white/35'>{company.location} {company.industry && `· ${company.industry}`}</p>
                                {company.website && (
                                    <a href={company.website} target='_blank' rel='noreferrer' className='text-xs text-green-600 dark:text-green-400 hover:underline'>Website ↗</a>
                                )}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${company.is_active ? 'bg-green-500/10 text-green-500' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/25'}`}>
                                {company.is_active ? 'Active' : 'Hidden'}
                            </span>
                        </div>
                        {company.description && (
                            <p className='text-xs text-gray-500 dark:text-white/35 mb-3 line-clamp-2'>{company.description}</p>
                        )}
                        <div className='flex gap-2'>
                            <button onClick={() => onToggle(company._id)}
                                className='flex-1 text-xs border border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/40 py-2 rounded-xl hover:border-green-400 dark:hover:border-green-500/40 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
                                {company.is_active ? 'Hide' : 'Show'}
                            </button>
                            <button onClick={() => onDelete(company._id)}
                                className='flex-1 text-xs border border-red-200 dark:border-red-500/20 text-red-500 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors'>
                                Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
    </motion.div>
)