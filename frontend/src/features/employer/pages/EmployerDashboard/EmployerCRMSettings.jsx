import { motion, AnimatePresence } from 'framer-motion'

const inputClass = 'w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 transition-colors'

// ── EMPLOYER CRM ──────────────────────────────────────────
export const EmployerCRM = ({
    crmCandidates, crmLoading, showAddCandidate, setShowAddCandidate,
    candidateForm, setCandidateForm, selectedCandidate, setSelectedCandidate,
    newNote, setNewNote, handleAddCandidate, handleCRMStatus, handleAddNote,
    handleDeleteCandidate, setFollowUp
}) => {
    const statusConfig = {
        new: { color: 'text-gray-500 dark:text-white/35', bg: 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/8' },
        interested: { color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
        follow_up: { color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
        interview: { color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
        hired: { color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
        rejected: { color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='space-y-5'>

            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Candidate CRM</h2>
                    <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>Track and manage your candidates</p>
                </div>
                <button onClick={() => setShowAddCandidate(true)}
                    className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>
                    Add Candidate
                </button>
            </div>

            {/* Add Candidate Form */}
            <AnimatePresence>
                {showAddCandidate && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5'>
                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Add New Candidate</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            {[
                                { name: 'name', placeholder: 'Full Name *' },
                                { name: 'email', placeholder: 'Email' },
                                { name: 'phone', placeholder: 'Phone' },
                                { name: 'location', placeholder: 'Location' },
                            ].map(field => (
                                <input key={field.name} type='text' placeholder={field.placeholder}
                                    value={candidateForm[field.name]}
                                    onChange={e => setCandidateForm({ ...candidateForm, [field.name]: e.target.value })}
                                    className={inputClass} />
                            ))}
                            <input type='text' placeholder='Skills (comma separated)' value={candidateForm.skills}
                                onChange={e => setCandidateForm({ ...candidateForm, skills: e.target.value })}
                                className={inputClass} />
                            <select value={candidateForm.source} onChange={e => setCandidateForm({ ...candidateForm, source: e.target.value })} className={inputClass}>
                                <option value='jobmate'>Jobmate</option>
                                <option value='linkedin'>LinkedIn</option>
                                <option value='referral'>Referral</option>
                                <option value='direct'>Direct</option>
                                <option value='other'>Other</option>
                            </select>
                        </div>
                        <div className='flex gap-2 mt-4'>
                            <button onClick={handleAddCandidate} disabled={!candidateForm.name}
                                className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors'>
                                Add Candidate
                            </button>
                            <button onClick={() => setShowAddCandidate(false)}
                                className='flex-1 border border-gray-200 dark:border-white/8 text-gray-600 dark:text-white/40 py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-white/3 transition-colors'>
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats */}
            <div className='grid grid-cols-3 md:grid-cols-6 gap-2'>
                {Object.entries(statusConfig).map(([status, config]) => (
                    <div key={status} className={`bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-xl p-3 text-center`}>
                        <p className={`text-lg font-extrabold ${config.color}`}>{crmCandidates.filter(c => c.status === status).length}</p>
                        <p className='text-xs text-gray-400 dark:text-white/25 capitalize'>{status.replace('_', ' ')}</p>
                    </div>
                ))}
            </div>

            {/* List + Detail */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Left */}
                <div className='space-y-2'>
                    {crmCandidates.length === 0 ? (
                        <div className='text-center py-16 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                            <p className='text-gray-800 dark:text-white font-semibold mb-1'>No candidates yet</p>
                            <button onClick={() => setShowAddCandidate(true)} className='mt-2 text-xs text-green-600 dark:text-green-400 hover:underline'>Add your first candidate</button>
                        </div>
                    ) : crmCandidates.map((candidate, i) => (
                        <motion.div key={candidate._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                            onClick={() => setSelectedCandidate(candidate)}
                            className={`bg-white dark:bg-white/3 border rounded-2xl p-4 cursor-pointer transition-all ${
                                selectedCandidate?._id === candidate._id
                                    ? 'border-green-400 dark:border-green-500/50 ring-1 ring-green-400/10'
                                    : 'border-gray-200 dark:border-white/7 hover:border-green-300 dark:hover:border-green-500/30'
                            }`}>
                            <div className='flex items-center justify-between gap-3'>
                                <div className='flex items-center gap-3 min-w-0'>
                                    <div className='w-9 h-9 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-semibold text-sm shrink-0'>
                                        {candidate.candidate.name?.charAt(0)}
                                    </div>
                                    <div className='min-w-0'>
                                        <p className='text-sm font-medium text-gray-800 dark:text-white truncate'>{candidate.candidate.name}</p>
                                        <p className='text-xs text-gray-400 dark:text-white/30 truncate'>{candidate.candidate.location || 'No location'} · {candidate.source}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border shrink-0 ${statusConfig[candidate.status]?.bg || statusConfig.new.bg} ${statusConfig[candidate.status]?.color || statusConfig.new.color}`}>
                                    {candidate.status.replace('_', ' ')}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Right — Detail */}
                {selectedCandidate ? (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                        className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5 h-fit'>
                        <div className='flex items-start justify-between mb-4'>
                            <div className='flex items-center gap-3'>
                                <div className='w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-bold text-lg'>
                                    {selectedCandidate.candidate.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>{selectedCandidate.candidate.name}</h3>
                                    <p className='text-xs text-gray-400 dark:text-white/35'>{selectedCandidate.candidate.email}</p>
                                    <p className='text-xs text-gray-400 dark:text-white/25'>{selectedCandidate.candidate.phone} · {selectedCandidate.candidate.location}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDeleteCandidate(selectedCandidate._id)}
                                className='text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors'>
                                Delete
                            </button>
                        </div>

                        {/* Skills */}
                        {selectedCandidate.candidate.skills && (
                            <div className='mb-4'>
                                <p className='text-xs font-semibold text-gray-500 dark:text-white/30 uppercase tracking-widest mb-2'>Skills</p>
                                <div className='flex flex-wrap gap-1'>
                                    {selectedCandidate.candidate.skills.split(',').map((skill, i) => (
                                        <span key={i} className='text-xs bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 px-2 py-1 rounded-full'>{skill.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Status */}
                        <div className='mb-4'>
                            <p className='text-xs font-semibold text-gray-500 dark:text-white/30 uppercase tracking-widest mb-2'>Status</p>
                            <div className='flex flex-wrap gap-2'>
                                {Object.keys(statusConfig).map(status => (
                                    <button key={status} onClick={() => handleCRMStatus(selectedCandidate._id, status)}
                                        className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
                                            selectedCandidate.status === status
                                                ? 'bg-green-600 text-white'
                                                : 'border border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/35 hover:border-green-400'
                                        }`}>
                                        {status.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Follow Up */}
                        <div className='mb-4'>
                            <p className='text-xs font-semibold text-gray-500 dark:text-white/30 uppercase tracking-widest mb-2'>Follow Up Date</p>
                            <input type='date' defaultValue={selectedCandidate.follow_up_date?.split('T')[0]}
                                onChange={e => setFollowUp(selectedCandidate._id, e.target.value)}
                                className={inputClass} />
                        </div>

                        {/* Notes */}
                        <div>
                            <p className='text-xs font-semibold text-gray-500 dark:text-white/30 uppercase tracking-widest mb-2'>Notes ({selectedCandidate.notes?.length || 0})</p>
                            <div className='space-y-2 mb-3 max-h-40 overflow-y-auto'>
                                {selectedCandidate.notes?.map((note, i) => (
                                    <div key={i} className='bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl p-3'>
                                        <p className='text-xs text-gray-700 dark:text-white/60'>{note.text}</p>
                                        <p className='text-xs text-gray-400 dark:text-white/20 mt-1'>{new Date(note.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='flex gap-2'>
                                <input type='text' placeholder='Add a note...' value={newNote} onChange={e => setNewNote(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddNote(selectedCandidate._id)}
                                    className={`${inputClass} flex-1 py-2`} />
                                <button onClick={() => handleAddNote(selectedCandidate._id)}
                                    className='bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors'>
                                    Add
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className='text-center py-16 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                        <p className='text-sm text-gray-400 dark:text-white/30'>Select a candidate to view details</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// ── COMPANY SETTINGS ──────────────────────────────────────
export const EmployerSettings = ({ user, companyForm, setCompanyForm, handleCompanySave, companySaving, companySuccess }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className='mb-6'>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Company Settings</h2>
            <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>Update your company profile information</p>
        </div>

        <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
            <div className='space-y-5'>
                {/* Company Name — disabled */}
                <div>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Company Name</label>
                    <input type='text' value={user?.company_name || ''} disabled
                        className='w-full bg-gray-100 dark:bg-white/3 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm text-gray-500 dark:text-white/30' />
                </div>

                {/* Description */}
                <div>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>About Company</label>
                    <textarea rows={4} placeholder='Describe your company...' value={companyForm.description}
                        onChange={e => setCompanyForm({ ...companyForm, description: e.target.value })}
                        className={`${inputClass} resize-none`} />
                </div>

                {/* Location */}
                <div>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Location</label>
                    <select value={companyForm.location} onChange={e => setCompanyForm({ ...companyForm, location: e.target.value })} className={inputClass}>
                        <option value=''>Select location</option>
                        {['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal', 'Biratnagar', 'Dharan', 'Hetauda', 'Other'].map(l => (
                            <option key={l} value={l} className='dark:bg-[#0c1a2e]'>{l}</option>
                        ))}
                    </select>
                    {companyForm.location === 'Other' && (
                        <input type='text' placeholder='Enter your location...' value={companyForm.customLocation}
                            onChange={e => setCompanyForm({ ...companyForm, customLocation: e.target.value })}
                            className={`${inputClass} mt-2`} />
                    )}
                </div>

                {/* Industry */}
                <div>
                    <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Industry</label>
                    <select value={companyForm.industry} onChange={e => setCompanyForm({ ...companyForm, industry: e.target.value })} className={inputClass}>
                        <option value=''>Select industry</option>
                        {['IT/Tech', 'Finance/Banking', 'Healthcare', 'Education', 'NGO/INGO', 'Manufacturing', 'Hospitality', 'Other'].map(i => (
                            <option key={i} value={i} className='dark:bg-[#0c1a2e]'>{i}</option>
                        ))}
                    </select>
                </div>

                {/* Size + Year */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Company Size</label>
                        <select value={companyForm.company_size} onChange={e => setCompanyForm({ ...companyForm, company_size: e.target.value })} className={inputClass}>
                            <option value=''>Select size</option>
                            {['1-10', '11-50', '51-200', '200+'].map(s => <option key={s} value={s} className='dark:bg-[#0c1a2e]'>{s} employees</option>)}
                        </select>
                    </div>
                    <div>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Founded Year</label>
                        <input type='text' placeholder='e.g. 2015' value={companyForm.founded_year}
                            onChange={e => setCompanyForm({ ...companyForm, founded_year: e.target.value })} className={inputClass} />
                    </div>
                </div>

                {/* Website + Phone */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Website</label>
                        <input type='text' placeholder='https://yourcompany.com' value={companyForm.website}
                            onChange={e => setCompanyForm({ ...companyForm, website: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Phone</label>
                        <input type='text' placeholder='98XXXXXXXX' value={companyForm.phone}
                            onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })} className={inputClass} />
                    </div>
                </div>

                {/* Social Links */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>LinkedIn</label>
                        <input type='text' placeholder='linkedin.com/company/...' value={companyForm.social_links.linkedin}
                            onChange={e => setCompanyForm({ ...companyForm, social_links: { ...companyForm.social_links, linkedin: e.target.value } })} className={inputClass} />
                    </div>
                    <div>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>Facebook</label>
                        <input type='text' placeholder='facebook.com/...' value={companyForm.social_links.facebook}
                            onChange={e => setCompanyForm({ ...companyForm, social_links: { ...companyForm.social_links, facebook: e.target.value } })} className={inputClass} />
                    </div>
                </div>

                {companySuccess && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className='flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm'>
                        <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                        Company profile saved!
                    </motion.div>
                )}

                <button onClick={handleCompanySave} disabled={companySaving}
                    className='w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2'>
                    {companySaving ? (
                        <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className='w-4 h-4 border-2 border-white border-t-transparent rounded-full' />Saving...</>
                    ) : 'Save Changes'}
                </button>
            </div>
        </div>
    </motion.div>
)