import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import useEmployer from '../../hooks/useEmployer.js'

const JobseekerProfileModal = ({ userId, userName, onClose }) => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [contactStatus, setContactStatus] = useState('none')
    const [contact, setContact] = useState(null)
    const [requestMsg, setRequestMsg] = useState('')
    const [requesting, setRequesting] = useState(false)
    const [showRequestForm, setShowRequestForm] = useState(false)
    const { getJobseekerProfile, requestContact, getContactStatus } = useEmployer()

    useEffect(() => {
        const fetchData = async () => {
            const [profileData, statusData] = await Promise.all([
                getJobseekerProfile(userId),
                getContactStatus(userId)
            ])
            setProfile(profileData)
            setContactStatus(statusData?.status || 'none')
            if (statusData?.status === 'approved') setContact(statusData.contact)
            setLoading(false)
        }
        fetchData()
    }, [userId])

    const handleRequestContact = async () => {
        setRequesting(true)
        try {
            await requestContact(userId, requestMsg)
            setContactStatus('pending')
            setShowRequestForm(false)
        } catch (err) {
            console.log(err)
        } finally {
            setRequesting(false)
        }
    }

    return createPortal(
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className='fixed inset-0 z-50 flex items-center justify-center p-4'
                style={{ background: 'rgba(0,0,0,0.75)' }}
                onClick={onClose}>

                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    onClick={e => e.stopPropagation()}
                    className='bg-white dark:bg-[#0c1a2e] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto'
                    style={{ scrollbarWidth: 'none' }}>

                    {/* Header */}
                    <div className='flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/8 sticky top-0 bg-white dark:bg-[#0c1a2e] z-10'>
                        <h3 className='text-base font-bold text-gray-800 dark:text-white'>Candidate Profile</h3>
                        <button onClick={onClose}
                            className='w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/12 transition-colors'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><path d='M18 6 6 18M6 6l12 12'/></svg>
                        </button>
                    </div>

                    {loading ? (
                        <div className='flex items-center justify-center py-20'>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full' />
                        </div>
                    ) : !profile ? (
                        <div className='text-center py-20'>
                            <p className='text-gray-400 dark:text-white/30'>Profile not found</p>
                        </div>
                    ) : (
                        <div className='p-5 space-y-5'>

                            {/* Avatar + Name */}
                            <div className='flex items-center gap-4'>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden ${
                                    profile.is_verified_jobseeker
                                        ? 'bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-400 dark:border-amber-500/50 text-amber-600 dark:text-amber-400'
                                        : 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400'
                                }`}>
                                    {profile.avatar_url
                                        ? <img src={profile.avatar_url} alt={profile.name} className='w-full h-full object-cover' />
                                        : profile.name?.charAt(0)?.toUpperCase()
                                    }
                                </div>
                                <div>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <h2 className='text-lg font-bold text-gray-800 dark:text-white'>{profile.name}</h2>
                                        {profile.is_verified_jobseeker && (
                                            <span className='inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-semibold'>
                                                ⭐ Verified
                                            </span>
                                        )}
                                    </div>
                                    <p className='text-sm text-gray-500 dark:text-white/40 mt-0.5'>{profile.location || 'Location not set'}</p>
                                    {profile.expected_salary > 0 && (
                                        <p className='text-xs text-green-600 dark:text-green-400 mt-0.5'>
                                            Expected: Rs. {Number(profile.expected_salary).toLocaleString()}/month
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* ── CONTACT SECTION ── */}
                            {contactStatus === 'none' && (
                                <div className='bg-gray-50 dark:bg-white/3 border border-gray-200 dark:border-white/8 rounded-xl p-4'>
                                    {!showRequestForm ? (
                                        <div className='flex items-center justify-between gap-3'>
                                            <div>
                                                <p className='text-sm font-semibold text-gray-800 dark:text-white'>Contact Details</p>
                                                <p className='text-xs text-gray-400 dark:text-white/30 mt-0.5'>🔒 Phone & Email hidden — request access</p>
                                            </div>
                                            <button onClick={() => setShowRequestForm(true)}
                                                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0'>
                                                Request Contact
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='space-y-3'>
                                            <p className='text-sm font-semibold text-gray-800 dark:text-white'>Why do you want to contact?</p>
                                            <textarea value={requestMsg} onChange={e => setRequestMsg(e.target.value)}
                                                placeholder='e.g. We want to interview this candidate for our Frontend Developer position...'
                                                rows={3}
                                                className='w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 resize-none' />
                                            <div className='flex gap-2'>
                                                <button onClick={() => setShowRequestForm(false)}
                                                    className='flex-1 border border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/40 py-2 rounded-xl text-xs font-medium'>
                                                    Cancel
                                                </button>
                                                <button onClick={handleRequestContact} disabled={requesting}
                                                    className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-1'>
                                                    {requesting ? (
                                                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                            className='w-3 h-3 border-2 border-white border-t-transparent rounded-full' />
                                                    ) : '📨 Send Request'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {contactStatus === 'pending' && (
                                <div className='bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex items-center gap-3'>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        className='w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full shrink-0' />
                                    <div>
                                        <p className='text-sm font-semibold text-blue-700 dark:text-blue-400'>Request Pending</p>
                                        <p className='text-xs text-blue-600/70 dark:text-blue-400/60'>Admin will approve within 24 hours</p>
                                    </div>
                                </div>
                            )}

                            {contactStatus === 'approved' && contact && (
                                <div className='bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4'>
                                    <p className='text-sm font-semibold text-green-700 dark:text-green-400 mb-3'>✅ Contact Approved</p>
                                    <div className='space-y-2'>
                                        {contact.phone && (
                                            <a href={`tel:${contact.phone}`}
                                                className='flex items-center gap-3 bg-white dark:bg-white/5 rounded-xl px-3 py-2.5 hover:bg-green-50 dark:hover:bg-green-500/5 transition-colors'>
                                                <div className='w-8 h-8 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center shrink-0'>
                                                    <svg className='w-4 h-4 text-green-600' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10a16 16 0 0 0 6 6z'/></svg>
                                                </div>
                                                <div>
                                                    <p className='text-xs text-gray-400 dark:text-white/30'>Phone</p>
                                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{contact.phone}</p>
                                                </div>
                                            </a>
                                        )}
                                        {contact.email && (
                                            <a href={`mailto:${contact.email}`}
                                                className='flex items-center gap-3 bg-white dark:bg-white/5 rounded-xl px-3 py-2.5 hover:bg-green-50 dark:hover:bg-green-500/5 transition-colors'>
                                                <div className='w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0'>
                                                    <svg className='w-4 h-4 text-blue-600' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/><polyline points='22,6 12,13 2,6'/></svg>
                                                </div>
                                                <div>
                                                    <p className='text-xs text-gray-400 dark:text-white/30'>Email</p>
                                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{contact.email}</p>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Bio */}
                            {profile.bio && (
                                <div>
                                    <p className='text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-2'>About</p>
                                    <p className='text-sm text-gray-600 dark:text-white/60 leading-relaxed'>{profile.bio}</p>
                                </div>
                            )}

                            {/* Skills */}
                            {profile.skills?.length > 0 && (
                                <div>
                                    <p className='text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-2'>Skills</p>
                                    <div className='flex flex-wrap gap-2'>
                                        {profile.skills.map((skill, i) => (
                                            <span key={i} className='text-xs bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full font-medium'>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Preferences */}
                            {(profile.preferred_location || profile.preferred_category) && (
                                <div>
                                    <p className='text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-2'>Job Preferences</p>
                                    <div className='flex gap-2 flex-wrap'>
                                        {profile.preferred_location && (
                                            <span className='text-xs bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full'>
                                                📍 {profile.preferred_location}
                                            </span>
                                        )}
                                        {profile.preferred_category && (
                                            <span className='text-xs bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-full'>
                                                💼 {profile.preferred_category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {profile.education?.length > 0 && (
                                <div>
                                    <p className='text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-2'>Education</p>
                                    <div className='space-y-2'>
                                        {profile.education.map((edu, i) => (
                                            <div key={i} className='flex items-start gap-3 bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl p-3'>
                                                <div className='w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0'>
                                                    <svg className='w-4 h-4 text-blue-500' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>
                                                </div>
                                                <div>
                                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{edu.institution}</p>
                                                    <p className='text-xs text-gray-500 dark:text-white/35'>{edu.degree} {edu.field && `— ${edu.field}`}</p>
                                                    <p className='text-xs text-gray-400 dark:text-white/25'>{edu.start_year} — {edu.is_current ? 'Present' : edu.end_year}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience */}
                            {profile.experience?.length > 0 && (
                                <div>
                                    <p className='text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-2'>Experience</p>
                                    <div className='space-y-2'>
                                        {profile.experience.map((exp, i) => (
                                            <div key={i} className='flex items-start gap-3 bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl p-3'>
                                                <div className='w-9 h-9 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm shrink-0'>
                                                    {exp.company?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{exp.position}</p>
                                                    <p className='text-xs text-gray-500 dark:text-white/35'>{exp.company} {exp.location && `· ${exp.location}`}</p>
                                                    <p className='text-xs text-gray-400 dark:text-white/25'>{exp.start_year} — {exp.is_current ? 'Present' : exp.end_year}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CV */}
                            {profile.cv_url && (
                                <div>
                                    <p className='text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-2'>Resume / CV</p>
                                    <a href={profile.cv_url} target='_blank' rel='noreferrer'
                                        className='flex items-center gap-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-3 hover:bg-green-100 dark:hover:bg-green-500/15 transition-colors'>
                                        <div className='w-9 h-9 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center shrink-0'>
                                            <svg className='w-4 h-4 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>
                                        </div>
                                        <div>
                                            <p className='text-sm font-semibold text-green-700 dark:text-green-400'>View CV</p>
                                            <p className='text-xs text-green-600/60 dark:text-green-400/50'>Click to open</p>
                                        </div>
                                        <svg className='w-4 h-4 text-green-500 ml-auto' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/><polyline points='15 3 21 3 21 9'/><line x1='10' y1='14' x2='21' y2='3'/></svg>
                                    </a>
                                </div>
                            )}

                            {/* Member since */}
                            <p className='text-xs text-gray-400 dark:text-white/20 text-center pt-2 border-t border-gray-100 dark:border-white/5'>
                                Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            </p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    )
}

export default JobseekerProfileModal
