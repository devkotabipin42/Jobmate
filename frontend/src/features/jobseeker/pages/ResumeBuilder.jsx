import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import useJobseeker from '../hooks/useJobseeker.js'
import Footer from '../../../components/Footer.jsx'

const steps = [
    { id: 1, label: 'Personal Info', icon: '👤' },
    { id: 2, label: 'Experience', icon: '💼' },
    { id: 3, label: 'Education', icon: '🎓' },
    { id: 4, label: 'Skills', icon: '⚡' },
]

const ResumeBuilder = () => {
    const { generateResume, loading } = useJobseeker()
    const [step, setStep] = useState(1)
    const [pdfUrl, setPdfUrl] = useState(null)
    const [aiSummary, setAiSummary] = useState('')
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        experience: '',
        education: '',
        skills: '',
        languages: '',
        linkedin: '',
        website: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

   const handleGenerate = async () => {
    setError('')
    try {
        const data = await generateResume(formData)
        setPdfUrl(data.pdf_url)
        setAiSummary(data.ai_summary)
        setStep(5)
    } catch (err) {
        setError('Failed to generate resume — try again')
    }
}

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            {/* Header */}
            <div className='bg-gradient-to-r from-green-600 to-green-800 px-6 py-8'>
                <div className='max-w-3xl mx-auto text-center'>
                    <span className='text-xs bg-white/20 text-white px-3 py-1 rounded-full mb-2 inline-block'>
                        🤖 AI Powered
                    </span>
                    <h1 className='text-3xl font-bold text-white mb-2'>
                        Resume Builder
                    </h1>
                    <p className='text-green-200 text-sm'>
                        Fill your details — AI generates a professional resume PDF
                    </p>
                </div>
            </div>

            <div className='max-w-3xl mx-auto px-4 md:px-6 py-8'>

                {/* Steps indicator */}
                {step < 5 && (
                    <div className='flex items-center justify-center gap-2 mb-8'>
                        {steps.map((s, i) => (
                            <div key={s.id} className='flex items-center gap-2'>
                                <div
                                    onClick={() => setStep(s.id)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer transition-all ${
                                        step === s.id
                                            ? 'bg-green-600 text-white scale-110'
                                            : step > s.id
                                            ? 'bg-green-100 dark:bg-green-900 text-green-600'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                    }`}
                                >
                                    {step > s.id ? '✓' : s.icon}
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 ${step > s.id ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className='bg-red-50 dark:bg-red-900 border border-red-200 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl mb-4 text-sm'>
                        {error}
                    </div>
                )}

                {/* Step 1 — Personal Info */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'
                    >
                        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-6'>
                            👤 Personal Information
                        </h2>
                        <div className='space-y-4'>
                            {[
                                { label: 'Full Name *', name: 'fullName', placeholder: 'Bipin Devkota' },
                                { label: 'Email *', name: 'email', placeholder: 'your@email.com' },
                                { label: 'Phone', name: 'phone', placeholder: '+977-98XXXXXXXX' },
                                { label: 'Location', name: 'location', placeholder: 'Kathmandu, Nepal' },
                                { label: 'LinkedIn URL', name: 'linkedin', placeholder: 'linkedin.com/in/yourname' },
                                { label: 'Website/Portfolio', name: 'website', placeholder: 'yourwebsite.com' },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                        {field.label}
                                    </label>
                                    <input
                                        type='text'
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                    />
                                </div>
                            ))}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep(2)}
                            disabled={!formData.fullName || !formData.email}
                            className='w-full mt-6 bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors'
                        >
                            Next — Experience →
                        </motion.button>
                    </motion.div>
                )}

                {/* Step 2 — Experience */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'
                    >
                        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
                            💼 Work Experience
                        </h2>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                            Separate multiple experiences with a blank line
                        </p>
                        <textarea
                            name='experience'
                            value={formData.experience}
                            onChange={handleChange}
                            rows={8}
                            placeholder={`Software Engineer — TechCorp Nepal\nJan 2023 - Present\n- Built React applications\n- Managed team of 3 developers\n\nJunior Developer — StartupXYZ\nJun 2021 - Dec 2022\n- Developed REST APIs with Node.js`}
                            className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white resize-none'
                        />
                        <div className='flex gap-3 mt-6'>
                            <button onClick={() => setStep(1)} className='flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700'>
                                ← Back
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStep(3)}
                                className='flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700'
                            >
                                Next — Education →
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3 — Education */}
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'
                    >
                        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
                            🎓 Education
                        </h2>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                            Separate multiple entries with a blank line
                        </p>
                        <textarea
                            name='education'
                            value={formData.education}
                            onChange={handleChange}
                            rows={6}
                            placeholder={`Bachelor in Computer Science\nTribhuvan University, Kathmandu\n2018 - 2022\nGPA: 3.8/4.0\n\n+2 Science\nSt. Xavier's College\n2016 - 2018`}
                            className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white resize-none'
                        />
                        <div className='flex gap-3 mt-6'>
                            <button onClick={() => setStep(2)} className='flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700'>
                                ← Back
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStep(4)}
                                className='flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700'
                            >
                                Next — Skills →
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Step 4 — Skills */}
                {step === 4 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'
                    >
                        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-6'>
                            ⚡ Skills & Languages
                        </h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Skills * (comma separated)
                                </label>
                                <input
                                    type='text'
                                    name='skills'
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder='React, Node.js, MongoDB, Python, Git'
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Languages (comma separated)
                                </label>
                                <input
                                    type='text'
                                    name='languages'
                                    value={formData.languages}
                                    onChange={handleChange}
                                    placeholder='Nepali, English, Hindi'
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
                                />
                            </div>
                            <div>
                                <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    Additional Summary (optional — AI will enhance it)
                                </label>
                                <textarea
                                    name='summary'
                                    value={formData.summary}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder='Brief about yourself...'
                                    className='w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white resize-none'
                                />
                            </div>
                        </div>

                        <div className='flex gap-3 mt-6'>
                            <button onClick={() => setStep(3)} className='flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700'>
                                ← Back
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGenerate}
                                disabled={loading || !formData.skills}
                                className='flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50'
                            >
                                {loading ? (
                                    <span className='flex items-center justify-center gap-2'>
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className='w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block'
                                        />
                                        Generating...
                                    </span>
                                ) : '🤖 Generate Resume'}
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Step 5 — Result */}
                {step === 5 && pdfUrl && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='space-y-4'
                    >
                        {/* Success */}
                        <div className='bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-2xl p-6 text-center'>
                            <div className='text-5xl mb-3'>🎉</div>
                            <h2 className='text-xl font-semibold text-green-800 dark:text-green-200 mb-2'>
                                Resume Generated!
                            </h2>
                            <p className='text-sm text-green-700 dark:text-green-300 mb-6'>
                                Your AI-powered resume is ready!
                            </p>
                           <div className='flex gap-3 justify-center flex-wrap'>
   <a href={pdfUrl}
    target='_blank'
    rel='noreferrer'
    className='bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors'
>
    ⬇️ Download PDF
</a>
    <button
        onClick={() => {
            setStep(1)
            setPdfUrl(null)
            setFormData({
                fullName: '', email: '', phone: '', location: '',
                summary: '', experience: '', education: '',
                skills: '', languages: '', linkedin: '', website: ''
            })
        }}
        className='border border-green-600 text-green-600 dark:text-green-400 px-6 py-3 rounded-xl text-sm hover:bg-green-50 dark:hover:bg-green-900 transition-colors'
    >
        Build Another
    </button>
</div>
                        </div>

                        {/* AI Summary */}
                        {aiSummary && (
                            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'>
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-3'>
                                    🤖 AI Generated Summary
                                </h3>
                                <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
                                    {aiSummary}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default ResumeBuilder