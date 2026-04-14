import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../auth/hooks/useAuth.js'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import Footer from '../../../components/Footer.jsx'

// Document Upload Form Component
const DocumentUploadForm = ({ user, onSuccess }) => {
    const { uploadDocument } = useAuth()
    const [docType, setDocType] = useState('citizenship')
    const [docNumber, setDocNumber] = useState('')
    const [docFile, setDocFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setDocFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async () => {
        if (!docNumber.trim()) { setError('Document number is required'); return }
        if (!docFile) { setError('Please upload a photo of your document'); return }
        setLoading(true)
        setError('')
        alert('✅ Document submitted! Admin will verify within 24 hours.')
        onSuccess()
        try {
            await uploadDocument(docType, docNumber.trim(), docFile)
            onSuccess()
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Upload failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='space-y-4'>
            {/* Document type toggle */}
            <div className='flex bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl p-1'>
                {[
                    { id: 'citizenship', label: '🪪 Citizenship' },
                    { id: 'license', label: '🚗 Driving License' }
                ].map(d => (
                    <button key={d.id} onClick={() => setDocType(d.id)}
                        className={`flex-1 py-2 text-xs rounded-lg transition-all font-medium ${
                            docType === d.id
                                ? 'bg-white dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm'
                                : 'text-gray-500 dark:text-white/35'
                        }`}>
                        {d.label}
                    </button>
                ))}
            </div>

            {/* Document number */}
            <div>
                <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1.5'>
                    {docType === 'citizenship' ? 'Citizenship Number' : 'License Number'}
                </label>
                <input type='text' value={docNumber} onChange={e => setDocNumber(e.target.value)}
                    placeholder={docType === 'citizenship' ? 'e.g. 12345-67890' : 'e.g. 012-345-6789'}
                    className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 transition-colors' />
            </div>

            {/* Photo upload */}
            <div>
                <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1.5'>
                    {docType === 'citizenship' ? 'Citizenship Photo' : 'License Photo'}
                </label>
                <label className='flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-200 dark:border-white/8 rounded-xl p-4 hover:border-green-400 dark:hover:border-green-500/40 transition-colors'>
                    <input type='file' accept='image/*,.pdf' onChange={handleFileChange} className='hidden' />
                    {preview ? (
                        <img src={preview} alt='preview' className='w-16 h-16 object-cover rounded-lg shrink-0' />
                    ) : (
                        <div className='w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center shrink-0'>
                            <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>
                        </div>
                    )}
                    <div>
                        <p className='text-sm font-semibold text-gray-800 dark:text-white'>{docFile ? docFile.name : 'Upload clear photo'}</p>
                        <p className='text-xs text-gray-400 dark:text-white/25'>JPG, PNG, PDF — Max 5MB</p>
                    </div>
                </label>
            </div>

            {/* Warning */}
            <div className='bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-700 dark:text-amber-400'>
                ⚠️ This is a one-time submission. Once submitted, you cannot change your document. Make sure the photo is clear and the number is correct.
            </div>

            {error && (
                <p className='text-xs text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-2 rounded-xl'>{error}</p>
            )}

            <button onClick={handleSubmit} disabled={loading || !docNumber || !docFile}
                className='w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2'>
                {loading ? (
                    <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className='w-4 h-4 border-2 border-white border-t-transparent rounded-full' />Submitting...</>
                ) : 'Submit for Verification →'}
            </button>
        </div>
    )
}

const SKILL_SUGGESTIONS = [
    'Driving', 'Computer', 'Hindi', 'Nepali', 'English',
    'Accounting', 'Teaching', 'Cooking', 'Security', 'Sales',
    'Marketing', 'Photography', 'Electrician', 'Plumbing', 'Tailoring',
    'React', 'Node.js', 'Python', 'Java', 'Excel', 'Tally',
]

const CATEGORIES = [
    'IT/Tech', 'Finance/Banking', 'NGO/INGO', 'Healthcare', 'Education',
    'Marketing', 'Transport', 'Manufacturing', 'Hospitality', 'Other'
]

const LOCATIONS = [
    'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan',
    'Butwal', 'Nawalparasi', 'Parasi', 'Lumbini', 'Remote', 'Other'
]

const DEGREES = ['SLC/SEE', '+2 / Intermediate', 'Bachelor', 'Master', 'PhD', 'Diploma', 'Other']

const inputClass = 'w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/50 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/20 transition-colors'

const SectionHeader = ({ icon, title, subtitle }) => (
    <div className='flex items-center gap-3 mb-5'>
        <div className='w-9 h-9 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 shrink-0'>
            {icon}
        </div>
        <div>
            <h3 className='text-sm font-bold text-gray-800 dark:text-white'>{title}</h3>
            {subtitle && <p className='text-xs text-gray-400 dark:text-white/25 mt-0.5'>{subtitle}</p>}
        </div>
    </div>
)

const Profile = () => {
    const { user, updateProfile, handleCVUpload, handleCVDelete, handleAlertsSubmit, submitTestimonial, uploadAvatar, refreshUser } = useAuth()

    // Basic info
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        location: user?.location || '',
        bio: user?.bio || '',
        preferred_location: user?.preferred_location || '',
        preferred_category: user?.preferred_category || '',
        expected_salary: user?.expected_salary || '',
    })

    // Skills
    const [skills, setSkills] = useState(user?.skills || [])
    const [skillInput, setSkillInput] = useState('')

    // Education
    const [education, setEducation] = useState(user?.education || [])
    const [addingEdu, setAddingEdu] = useState(false)
    const [eduForm, setEduForm] = useState({ institution: '', degree: '', field: '', start_year: '', end_year: '', is_current: false })

    // Experience
    const [experience, setExperience] = useState(user?.experience || [])
    const [addingExp, setAddingExp] = useState(false)
    const [expForm, setExpForm] = useState({ company: '', position: '', location: '', start_year: '', end_year: '', is_current: false, description: '' })

    // CV
    const [cvUploading, setCvUploading] = useState(false)
    const [cvSuccess, setCvSuccess] = useState(false)
    const [cvDeleting, setCvDeleting] = useState(false)

    // Job Alerts
    const [alerts, setAlerts] = useState({
        enabled: user?.job_alerts?.enabled || false,
        categories: user?.job_alerts?.categories || [],
        locations: user?.job_alerts?.locations || [],
        job_types: user?.job_alerts?.job_types || []
    })
    const [alertsSaving, setAlertsSaving] = useState(false)
    const [alertsSuccess, setAlertsSuccess] = useState(false)

    // Testimonial
    const [testimonialForm, setTestimonialForm] = useState({ name: user?.name || '', role: '', company: '', text: '', rating: 5 })
    const [testimonialLoading, setTestimonialLoading] = useState(false)
    const [testimonialSuccess, setTestimonialSuccess] = useState(false)

    // Profile completion %
    const calcCompletion = () => {
        let score = 0
        if (formData.name) score += 15
        if (formData.phone) score += 10
        if (formData.location) score += 10
        if (formData.bio && formData.bio.length > 10) score += 15
        if (skills.length > 0) score += 20
        if (education.length > 0) score += 15
        if (experience.length > 0) score += 15
        return score
    }
    const completion = calcCompletion()
    const isGolden = completion >= 80 && user?.is_email_verified

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await updateProfile({ ...formData, skills, education, experience })
            setSuccess('Profile updated successfully!')
            setEditing(false)
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed')
        } finally {
            setLoading(false)
        }
    }

    const addSkill = (skill) => {
        const s = skill.trim()
        if (s && !skills.includes(s)) setSkills([...skills, s])
        setSkillInput('')
    }

    const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill))

    const addEducation = () => {
        if (!eduForm.institution || !eduForm.degree) return
        setEducation([...education, { ...eduForm, id: Date.now() }])
        setEduForm({ institution: '', degree: '', field: '', start_year: '', end_year: '', is_current: false })
        setAddingEdu(false)
    }

    const addExperience = () => {
        if (!expForm.company || !expForm.position) return
        setExperience([...experience, { ...expForm, id: Date.now() }])
        setExpForm({ company: '', position: '', location: '', start_year: '', end_year: '', is_current: false, description: '' })
        setAddingExp(false)
    }

    const onCVUpload = async (e) => {
        const file = e.target.files[0]
        setCvUploading(true)
        try { await handleCVUpload(file); setCvSuccess(true); setTimeout(() => setCvSuccess(false), 3000) }
        catch (err) { console.log(err) }
        finally { setCvUploading(false) }
    }

    const onCVDelete = async () => {
        setCvDeleting(true)
        try { await handleCVDelete() }
        catch (err) { console.log(err) }
        finally { setCvDeleting(false) }
    }

    const onAlertsSubmit = async () => {
        setAlertsSaving(true)
        try { await handleAlertsSubmit(alerts); setAlertsSuccess(true); setTimeout(() => setAlertsSuccess(false), 3000) }
        catch (err) { console.log(err) }
        finally { setAlertsSaving(false) }
    }

    const handleTestimonialSubmit = async () => {
        setTestimonialLoading(true)
        try { await submitTestimonial(testimonialForm); setTestimonialSuccess(true); setTimeout(() => setTestimonialSuccess(false), 3000) }
        catch (err) { console.log(err) }
        finally { setTestimonialLoading(false) }
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-[#08111f] transition-colors duration-300'>
            <div className='fixed inset-0 opacity-0 dark:opacity-100 pointer-events-none'
                style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <Navbar />

            <div className='max-w-2xl mx-auto px-4 sm:px-6 py-8 relative z-10'>

                {/* Success toast */}
                <AnimatePresence>
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className='flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-xl mb-4'>
                            <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── PROFILE CARD ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl overflow-hidden mb-4'>

                    {/* Cover */}
                    <div className='h-28 relative bg-gradient-to-br from-green-600 to-green-800 dark:from-green-900 dark:to-[#0c1a2e]'>
                        <div className='absolute inset-0 opacity-20'
                            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    </div>

                    <div className='px-6 pb-6'>
                        <div className='flex items-end justify-between -mt-10 mb-5'>
                            {/* Avatar */}
                            <div className='relative'>
                                <div className='w-20 h-20 rounded-2xl bg-white dark:bg-[#0c1a2e] border-4 border-white dark:border-[#08111f] flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-3xl shadow-sm overflow-hidden'>
                                    {user?.avatar_url
                                        ? <img src={user.avatar_url} alt='avatar' className='w-full h-full object-cover' />
                                        : user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <label className='absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors'>
                                    <svg className='w-3.5 h-3.5 text-white' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/><circle cx='12' cy='13' r='4'/></svg>
                                    <input type='file' accept='image/*' onChange={async (e) => {
                                        const file = e.target.files[0]
                                        if (!file) return
                                        try { await uploadAvatar(file) } catch (err) { console.log(err) }
                                    }} className='hidden' />
                                </label>
                            </div>

                            <div className='flex items-center gap-2'>
                                {/* Golden Badge */}
                                {isGolden && (
                                    <div className='flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full'>
                                        <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
                                            <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/>
                                        </svg>
                                        <span className='text-xs font-semibold'>Verified</span>
                                    </div>
                                )}
                                <button onClick={() => setEditing(!editing)}
                                    className='text-sm border border-gray-200 dark:border-white/8 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/3 dark:text-white/60 transition-colors'>
                                    {editing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>
                        </div>

                        <div className='flex items-center gap-2 mb-1'>
                            <h1 className='text-xl font-bold text-gray-800 dark:text-white'>{user?.name}</h1>
                        </div>
                        <p className='text-sm text-gray-500 dark:text-white/35 mb-2'>{user?.email}</p>
                        {user?.bio && <p className='text-sm text-gray-600 dark:text-white/50 leading-relaxed'>{user.bio}</p>}

                        {/* Profile Completion Bar */}
                        <div className='mt-4 p-4 bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl'>
                            <div className='flex items-center justify-between mb-2'>
                                <p className='text-xs font-semibold text-gray-600 dark:text-white/50'>Profile Completion</p>
                                <p className={`text-xs font-bold ${completion >= 80 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>{completion}%</p>
                            </div>
                            <div className='w-full bg-gray-200 dark:bg-white/5 rounded-full h-2'>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${completion}%` }} transition={{ duration: 1 }}
                                    className={`h-2 rounded-full ${completion >= 80 ? 'bg-green-500' : completion >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} />
                            </div>
                            {completion < 80 && (
                                <p className='text-xs text-gray-400 dark:text-white/25 mt-2'>
                                    Complete your profile to get the ⭐ Golden Verified Badge!
                                </p>
                            )}
                        </div>

                        {/* Info grid */}
                        <div className='grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-white/5'>
                            {[
                                { label: 'Phone', value: user?.phone || 'Not added' },
                                { label: 'Location', value: user?.location || 'Not added' },
                                { label: 'Preferred Location', value: user?.preferred_location || 'Not set' },
                                { label: 'Expected Salary', value: user?.expected_salary ? `Rs. ${Number(user.expected_salary).toLocaleString()}` : 'Not set' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className='text-xs text-gray-400 dark:text-white/25 mb-1'>{item.label}</p>
                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Edit form */}
                    <AnimatePresence>
                        {editing && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className='border-t border-gray-100 dark:border-white/5 px-6 py-5'>
                                <h3 className='text-sm font-bold text-gray-800 dark:text-white mb-4'>Edit Basic Info</h3>
                                {error && <div className='bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-4'>{error}</div>}
                                <form onSubmit={handleSubmit} className='space-y-3'>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1.5'>Full Name</label>
                                        <input type='text' name='name' value={formData.name} onChange={handleChange} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1.5'>Bio / Summary</label>
                                        <textarea name='bio' value={formData.bio} onChange={handleChange} rows={3} placeholder='Tell employers about yourself...' className={`${inputClass} resize-none`} />
                                    </div>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <div>
                                            <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1.5'>Phone</label>
                                            <input type='text' name='phone' value={formData.phone} onChange={handleChange} placeholder='98XXXXXXXX' className={inputClass} />
                                        </div>
                                        <div>
                                            <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1.5'>Location</label>
                                            <select name='location' value={formData.location} onChange={handleChange} className={inputClass}>
                                                <option value=''>Select</option>
                                                {LOCATIONS.map(l => <option key={l} className='dark:bg-[#0c1a2e]'>{l}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <div>
                                            <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1.5'>Preferred Location</label>
                                            <select name='preferred_location' value={formData.preferred_location} onChange={handleChange} className={inputClass}>
                                                <option value=''>Any</option>
                                                {LOCATIONS.map(l => <option key={l} className='dark:bg-[#0c1a2e]'>{l}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1.5'>Preferred Category</label>
                                            <select name='preferred_category' value={formData.preferred_category} onChange={handleChange} className={inputClass}>
                                                <option value=''>Any</option>
                                                {CATEGORIES.map(c => <option key={c} className='dark:bg-[#0c1a2e]'>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1.5'>Expected Salary (Rs.)</label>
                                        <input type='number' name='expected_salary' value={formData.expected_salary} onChange={handleChange} placeholder='e.g. 25000' className={inputClass} />
                                    </div>
                                    <button type='submit' disabled={loading}
                                        className='w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors'>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── SKILLS ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 mb-4'>
                    <SectionHeader
                        icon={<svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/></svg>}
                        title='Skills'
                        subtitle='Add your skills — employers will see these'
                    />

                    {/* Current skills */}
                    <div className='flex flex-wrap gap-2 mb-4'>
                        {skills.map((skill, i) => (
                            <span key={i} className='flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-medium'>
                                {skill}
                                <button onClick={() => removeSkill(skill)} className='hover:text-red-500 transition-colors'>
                                    <svg className='w-3 h-3' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>
                                </button>
                            </span>
                        ))}
                        {skills.length === 0 && <p className='text-xs text-gray-400 dark:text-white/25'>No skills added yet</p>}
                    </div>

                    {/* Add skill input */}
                    <div className='flex gap-2 mb-3'>
                        <input type='text' value={skillInput} onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                            placeholder='Type a skill and press Enter'
                            className={`${inputClass} flex-1`} />
                        <button onClick={() => addSkill(skillInput)}
                            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                            Add
                        </button>
                    </div>

                    {/* Suggestions */}
                    <div className='flex flex-wrap gap-1.5'>
                        {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 10).map(s => (
                            <button key={s} onClick={() => addSkill(s)}
                                className='text-xs border border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/35 px-2.5 py-1 rounded-full hover:border-green-400 dark:hover:border-green-500/40 hover:text-green-600 dark:hover:text-green-400 transition-all'>
                                + {s}
                            </button>
                        ))}
                    </div>

                    {skills.length > 0 && (
                        <button onClick={async () => {
                            try {
                                await updateProfile({ ...formData, skills, education, experience })
                                setSuccess('Skills saved!')
                                setTimeout(() => setSuccess(''), 3000)
                            } catch (err) { console.log(err) }
                        }} className='w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                            Save Skills
                        </button>
                    )}
                </motion.div>

                {/* ── EDUCATION ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 mb-4'>
                    <SectionHeader
                        icon={<svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>}
                        title='Education'
                        subtitle='Add your educational background'
                    />

                    {/* Education list */}
                    <div className='space-y-3 mb-4'>
                        {education.map((edu, i) => (
                            <div key={i} className='flex items-start gap-3 p-4 bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl'>
                                <div className='w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0'>
                                    <svg className='w-4 h-4 text-blue-500' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/></svg>
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{edu.institution}</p>
                                    <p className='text-xs text-gray-500 dark:text-white/35'>{edu.degree} {edu.field && `— ${edu.field}`}</p>
                                    <p className='text-xs text-gray-400 dark:text-white/25'>{edu.start_year} — {edu.is_current ? 'Present' : edu.end_year}</p>
                                </div>
                                <button onClick={() => setEducation(education.filter((_, j) => j !== i))}
                                    className='text-red-400 hover:text-red-500 transition-colors shrink-0'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>
                                </button>
                            </div>
                        ))}
                        {education.length === 0 && <p className='text-xs text-gray-400 dark:text-white/25'>No education added yet</p>}
                    </div>

                    {/* Add education form */}
                    <AnimatePresence>
                        {addingEdu && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className='border border-gray-200 dark:border-white/8 rounded-xl p-4 mb-3 space-y-3'>
                                <input type='text' placeholder='School / College name *' value={eduForm.institution}
                                    onChange={e => setEduForm({ ...eduForm, institution: e.target.value })} className={inputClass} />
                                <div className='grid grid-cols-2 gap-3'>
                                    <select value={eduForm.degree} onChange={e => setEduForm({ ...eduForm, degree: e.target.value })} className={inputClass}>
                                        <option value=''>Degree *</option>
                                        {DEGREES.map(d => <option key={d} className='dark:bg-[#0c1a2e]'>{d}</option>)}
                                    </select>
                                    <input type='text' placeholder='Subject/Faculty' value={eduForm.field}
                                        onChange={e => setEduForm({ ...eduForm, field: e.target.value })} className={inputClass} />
                                </div>
                                <div className='grid grid-cols-2 gap-3'>
                                    <input type='text' placeholder='Start year (e.g. 2018)' value={eduForm.start_year}
                                        onChange={e => setEduForm({ ...eduForm, start_year: e.target.value })} className={inputClass} />
                                    <input type='text' placeholder='End year (e.g. 2022)' value={eduForm.end_year}
                                        disabled={eduForm.is_current}
                                        onChange={e => setEduForm({ ...eduForm, end_year: e.target.value })} className={`${inputClass} disabled:opacity-50`} />
                                </div>
                                <label className='flex items-center gap-2 text-xs text-gray-600 dark:text-white/50 cursor-pointer'>
                                    <input type='checkbox' checked={eduForm.is_current} onChange={e => setEduForm({ ...eduForm, is_current: e.target.checked })} className='accent-green-600' />
                                    Currently studying here
                                </label>
                                <div className='flex gap-2'>
                                    <button onClick={addEducation} className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                                        Add Education
                                    </button>
                                    <button onClick={() => setAddingEdu(false)} className='px-4 py-2.5 border border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/35 rounded-xl text-sm transition-colors'>
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button onClick={() => setAddingEdu(!addingEdu)}
                        className='w-full border-2 border-dashed border-gray-200 dark:border-white/8 hover:border-green-400 dark:hover:border-green-500/40 text-gray-500 dark:text-white/35 hover:text-green-600 dark:hover:text-green-400 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>
                        Add Education
                    </button>

                    {education.length > 0 && (
                        <button onClick={async () => {
                            try {
                                await updateProfile({ ...formData, skills, education, experience })
                                setSuccess('Education saved!')
                                setTimeout(() => setSuccess(''), 3000)
                            } catch (err) { console.log(err) }
                        }} className='w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                            Save Education
                        </button>
                    )}
                </motion.div>

                {/* ── EXPERIENCE ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 mb-4'>
                    <SectionHeader
                        icon={<svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='2' y='7' width='20' height='14' rx='2'/><path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'/></svg>}
                        title='Work Experience'
                        subtitle='Add your work history'
                    />

                    {/* Experience list */}
                    <div className='space-y-3 mb-4'>
                        {experience.map((exp, i) => (
                            <div key={i} className='flex items-start gap-3 p-4 bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl'>
                                <div className='w-9 h-9 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm shrink-0'>
                                    {exp.company?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>{exp.position}</p>
                                    <p className='text-xs text-gray-500 dark:text-white/35'>{exp.company} {exp.location && `· ${exp.location}`}</p>
                                    <p className='text-xs text-gray-400 dark:text-white/25'>{exp.start_year} — {exp.is_current ? 'Present' : exp.end_year}</p>
                                    {exp.description && <p className='text-xs text-gray-500 dark:text-white/30 mt-1 line-clamp-2'>{exp.description}</p>}
                                </div>
                                <button onClick={() => setExperience(experience.filter((_, j) => j !== i))}
                                    className='text-red-400 hover:text-red-500 transition-colors shrink-0'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>
                                </button>
                            </div>
                        ))}
                        {experience.length === 0 && <p className='text-xs text-gray-400 dark:text-white/25'>No experience added yet</p>}
                    </div>

                    {/* Add experience form */}
                    <AnimatePresence>
                        {addingExp && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className='border border-gray-200 dark:border-white/8 rounded-xl p-4 mb-3 space-y-3'>
                                <div className='grid grid-cols-2 gap-3'>
                                    <input type='text' placeholder='Company name *' value={expForm.company}
                                        onChange={e => setExpForm({ ...expForm, company: e.target.value })} className={inputClass} />
                                    <input type='text' placeholder='Job title *' value={expForm.position}
                                        onChange={e => setExpForm({ ...expForm, position: e.target.value })} className={inputClass} />
                                </div>
                                <input type='text' placeholder='Location (e.g. Kathmandu)' value={expForm.location}
                                    onChange={e => setExpForm({ ...expForm, location: e.target.value })} className={inputClass} />
                                <div className='grid grid-cols-2 gap-3'>
                                    <input type='text' placeholder='Start year (e.g. 2020)' value={expForm.start_year}
                                        onChange={e => setExpForm({ ...expForm, start_year: e.target.value })} className={inputClass} />
                                    <input type='text' placeholder='End year (e.g. 2023)' value={expForm.end_year}
                                        disabled={expForm.is_current}
                                        onChange={e => setExpForm({ ...expForm, end_year: e.target.value })} className={`${inputClass} disabled:opacity-50`} />
                                </div>
                                <label className='flex items-center gap-2 text-xs text-gray-600 dark:text-white/50 cursor-pointer'>
                                    <input type='checkbox' checked={expForm.is_current} onChange={e => setExpForm({ ...expForm, is_current: e.target.checked })} className='accent-green-600' />
                                    Currently working here
                                </label>
                                <textarea placeholder='What did you do? (optional)' value={expForm.description}
                                    onChange={e => setExpForm({ ...expForm, description: e.target.value })} rows={2}
                                    className={`${inputClass} resize-none`} />
                                <div className='flex gap-2'>
                                    <button onClick={addExperience} className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                                        Add Experience
                                    </button>
                                    <button onClick={() => setAddingExp(false)} className='px-4 py-2.5 border border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/35 rounded-xl text-sm transition-colors'>
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button onClick={() => setAddingExp(!addingExp)}
                        className='w-full border-2 border-dashed border-gray-200 dark:border-white/8 hover:border-green-400 dark:hover:border-green-500/40 text-gray-500 dark:text-white/35 hover:text-green-600 dark:hover:text-green-400 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>
                        Add Experience
                    </button>

                    {experience.length > 0 && (
                        <button onClick={async () => {
                            try {
                                await updateProfile({ ...formData, skills, education, experience })
                                setSuccess('Experience saved!')
                                setTimeout(() => setSuccess(''), 3000)
                            } catch (err) { console.log(err) }
                        }} className='w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                            Save Experience
                        </button>
                    )}
                </motion.div>

                {/* ── DOCUMENT VERIFICATION ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 mb-4'>
                    <SectionHeader
                        icon={<svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'/></svg>}
                        title='Identity Verification'
                        subtitle='Upload Citizenship or Driving License to get Golden Badge ⭐'
                    />

                    {/* Status badges */}
                    {user?.document_status === 'none' && (
                        <div className='bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2'>
                            <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><line x1='12' y1='8' x2='12' y2='12'/><line x1='12' y1='16' x2='12.01' y2='16'/></svg>
                            Submit your document to get the Verified Badge
                        </div>
                    )}

                    {user?.document_status === 'pending' && (
                        <div className='bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2'>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className='w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full shrink-0' />
                            Document submitted — Admin verifying within 24 hours...
                        </div>
                    )}

                    {user?.document_status === 'verified' && (
                        <div className='bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2'>
                            <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                            ⭐ Identity Verified — Golden Badge Active!
                        </div>
                    )}

                    {user?.document_status === 'rejected' && (
                        <div className='bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs px-4 py-3 rounded-xl mb-4'>
                            <p className='font-semibold mb-1'>❌ Document Rejected</p>
                            <p>{user?.document_reject_reason}</p>
                            <p className='mt-1'>Please re-submit a clear photo.</p>
                        </div>
                    )}

                    {/* Upload form — only if not submitted or rejected */}
                    {(user?.document_status === 'none' || user?.document_status === 'rejected' || !user?.document_status) && (
                       <DocumentUploadForm user={user} onSuccess={async () => {
    await refreshUser()
    window.location.reload() 
}} />
                    )}
                </motion.div>

                {/* ── CV SECTION ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 mb-4'>
                    <SectionHeader
                        icon={<svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>}
                        title='CV / Resume'
                        subtitle='Upload your CV — employers can view it'
                    />

                    {user?.cv_url && (
                        <div className='flex items-center gap-3 mb-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl'>
                            <div className='w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0'>
                                <svg className='w-5 h-5 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>
                            </div>
                            <div className='flex-1'>
                                <p className='text-xs font-semibold text-green-700 dark:text-green-400'>CV Uploaded ✓</p>
                                <a href={user.cv_url} target='_blank' rel='noreferrer' className='text-xs text-green-600 dark:text-green-400 hover:underline'>View CV</a>
                            </div>
                            <button onClick={onCVDelete} disabled={cvDeleting}
                                className='text-xs text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/5 border border-red-200 dark:border-red-500/20 transition-colors'>
                                {cvDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    )}

                    {cvSuccess && (
                        <div className='bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl mb-3 text-xs flex items-center gap-2'>
                            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                            CV uploaded successfully!
                        </div>
                    )}

                    <label className='flex items-center gap-4 cursor-pointer border-2 border-dashed border-gray-200 dark:border-white/8 rounded-2xl p-4 hover:border-green-400 dark:hover:border-green-500/40 transition-colors group'>
                        <input type='file' accept='.pdf,.doc,.docx' onChange={onCVUpload} className='hidden' />
                        <div className='w-11 h-11 bg-gray-50 dark:bg-white/5 group-hover:bg-green-50 dark:group-hover:bg-green-500/10 rounded-xl flex items-center justify-center shrink-0 transition-colors'>
                            {cvUploading
                                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className='w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full' />
                                : <svg className='w-5 h-5 text-gray-400 dark:text-white/25 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='17 8 12 3 7 8'/><line x1='12' y1='3' x2='12' y2='15'/></svg>
                            }
                        </div>
                        <div>
                            <p className='text-sm font-semibold text-gray-800 dark:text-white'>{cvUploading ? 'Uploading...' : user?.cv_url ? 'Update CV' : 'Upload CV'}</p>
                            <p className='text-xs text-gray-400 dark:text-white/25'>PDF, DOC, DOCX — Max 10MB</p>
                        </div>
                    </label>
                </motion.div>

                {/* ── QUICK LINKS ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5 mb-4'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-3'>Quick Links</h3>
                    <div className='grid grid-cols-2 gap-2'>
                        {[
                            { label: 'My Applications', path: '/my-applications' },
                            { label: 'Saved Jobs', path: '/saved-jobs' },
                            { label: 'Browse Jobs', path: '/jobs' },
                            { label: 'Resume Builder', path: '/resume-builder' },
                            { label: 'Career Tips', path: '/career-tips' },
                            { label: 'Support', path: '/support' },
                        ].map((link, i) => (
                            <Link key={i} to={link.path}
                                className='flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/3 transition-colors text-sm text-gray-600 dark:text-white/50 hover:text-gray-800 dark:hover:text-white'>
                                {link.label}
                                <svg className='w-3.5 h-3.5 ml-auto text-gray-300 dark:text-white/15' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M5 12h14M12 5l7 7-7 7'/></svg>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* ── JOB ALERTS ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 mb-4'>
                    <div className='flex items-center justify-between mb-4'>
                        <div>
                            <h3 className='text-sm font-bold text-gray-800 dark:text-white'>Job Alerts</h3>
                            <p className='text-xs text-gray-400 dark:text-white/25 mt-0.5'>Get email when new jobs match your preferences</p>
                        </div>
                        <button onClick={() => setAlerts({ ...alerts, enabled: !alerts.enabled })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${alerts.enabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-white/10'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${alerts.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <AnimatePresence>
                        {alerts.enabled && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className='space-y-4'>
                                {[
                                    { label: 'Categories', key: 'categories', options: ['IT/Tech', 'Finance/Banking', 'NGO/INGO', 'Healthcare', 'Education', 'Marketing'] },
                                    { label: 'Locations', key: 'locations', options: ['Kathmandu', 'Pokhara', 'Chitwan', 'Butwal', 'Nawalparasi', 'Remote'] },
                                    { label: 'Job Types', key: 'job_types', options: ['full-time', 'part-time', 'remote', 'internship', 'contract'] },
                                ].map(({ label, key, options }) => (
                                    <div key={key}>
                                        <label className='block text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-2'>{label}</label>
                                        <div className='flex flex-wrap gap-2'>
                                            {options.map(opt => (
                                                <button key={opt} onClick={() => {
                                                    const arr = alerts[key].includes(opt) ? alerts[key].filter(x => x !== opt) : [...alerts[key], opt]
                                                    setAlerts({ ...alerts, [key]: arr })
                                                }}
                                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
                                                        alerts[key].includes(opt)
                                                            ? 'bg-green-600 text-white border-green-600'
                                                            : 'border-gray-200 dark:border-white/8 text-gray-600 dark:text-white/40 hover:border-green-400'
                                                    }`}>{opt}</button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {alertsSuccess && (
                                    <div className='bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2'>
                                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                                        Job alerts saved!
                                    </div>
                                )}
                                <button onClick={onAlertsSubmit} disabled={alertsSaving}
                                    className='w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors'>
                                    {alertsSaving ? 'Saving...' : 'Save Job Alerts'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── TESTIMONIAL ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6 mb-4'>
                    <SectionHeader
                        icon={<svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/></svg>}
                        title='Share Your Experience'
                        subtitle='Help others by sharing your Jobmate experience'
                    />

                    {testimonialSuccess && (
                        <div className='bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs px-4 py-2.5 rounded-xl mb-3 flex items-center gap-2'>
                            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                            Submitted! Admin will review it soon.
                        </div>
                    )}

                    <div className='space-y-3'>
                        <input type='text' placeholder='Your role (e.g. Software Engineer)' value={testimonialForm.role}
                            onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })} className={inputClass} />
                        <input type='text' placeholder='Company (e.g. Hired at TechCorp Nepal)' value={testimonialForm.company}
                            onChange={e => setTestimonialForm({ ...testimonialForm, company: e.target.value })} className={inputClass} />
                        <textarea placeholder='Share your experience with Jobmate...' value={testimonialForm.text}
                            onChange={e => setTestimonialForm({ ...testimonialForm, text: e.target.value })} rows={3}
                            className={`${inputClass} resize-none`} />
                        <select value={testimonialForm.rating} onChange={e => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })} className={inputClass}>
                            <option value={5}>⭐⭐⭐⭐⭐ — Excellent</option>
                            <option value={4}>⭐⭐⭐⭐ — Very Good</option>
                            <option value={3}>⭐⭐⭐ — Good</option>
                            <option value={2}>⭐⭐ — Fair</option>
                            <option value={1}>⭐ — Poor</option>
                        </select>
                    </div>

                    <button onClick={handleTestimonialSubmit} disabled={testimonialLoading || !testimonialForm.role || !testimonialForm.text}
                        className='w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors'>
                        {testimonialLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </motion.div>

            </div>
            <Footer />
        </div>
    )
}

export default Profile