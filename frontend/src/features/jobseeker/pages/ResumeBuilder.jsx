import { motion } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import useResumeBuilder from '../hooks/useResumeBuilder.js'
import ResumePreview from './ResumePreview.jsx'

const ResumeBuilder = () => {
    const {
        formData, pdfReady, error, loading,
        handleChange, handleGenerate, handleDownload, handleReset
    } = useResumeBuilder()

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
            <Navbar />

            {/* Header */}
            <div className='bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4'>
                <div className='max-w-6xl mx-auto flex items-center justify-between'>
                    <div>
                        <h1 className='text-lg font-bold text-gray-900 dark:text-white'>🤖 AI Resume Builder</h1>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>Fill details — live preview updates instantly</p>
                    </div>
                    {pdfReady && (
                        <button onClick={handleDownload}
                            className='bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors'>
                            ⬇️ Download PDF
                        </button>
                    )}
                </div>
            </div>

            <div className='max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6'>

                {/* LEFT — Form */}
                <div className='space-y-4'>
                    {error && (
                        <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm'>
                            {error}
                        </div>
                    )}

                    {/* Personal Info */}
                    <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5'>
                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>👤 Personal Info</h3>
                        <div className='grid grid-cols-2 gap-3'>
                            {[
                                { label: 'Full Name *', name: 'fullName', placeholder: 'Bipin Devkota' },
                                { label: 'Email *', name: 'email', placeholder: 'your@email.com' },
                                { label: 'Phone', name: 'phone', placeholder: '+977-98XXXXXXXX' },
                                { label: 'Location', name: 'location', placeholder: 'Kathmandu, Nepal' },
                                { label: 'LinkedIn', name: 'linkedin', placeholder: 'linkedin.com/in/yourname' },
                                { label: 'Website', name: 'website', placeholder: 'yourwebsite.com' },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>{field.label}</label>
                                    <input type='text' name={field.name} value={formData[field.name]}
                                        onChange={handleChange} placeholder={field.placeholder}
                                        className='w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-800 dark:text-white' />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5'>
                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>💼 Work Experience</h3>
                        <p className='text-xs text-gray-400 mb-3'>Separate multiple jobs with a blank line</p>
                        <textarea name='experience' value={formData.experience} onChange={handleChange} rows={5}
                            placeholder={'Software Engineer — TechCorp\nJan 2023 - Present\n- Built React apps'}
                            className='w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-800 dark:text-white resize-none' />
                    </div>

                    {/* Education */}
                    <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5'>
                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>🎓 Education</h3>
                        <p className='text-xs text-gray-400 mb-3'>Separate multiple entries with a blank line</p>
                        <textarea name='education' value={formData.education} onChange={handleChange} rows={4}
                            placeholder={'BSc Computer Science\nTribhuvan University\n2018 - 2022'}
                            className='w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-800 dark:text-white resize-none' />
                    </div>

                    {/* Skills */}
                    <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5'>
                        <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>⚡ Skills & Languages</h3>
                        <div className='space-y-3'>
                            <div>
                                <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>Skills * (comma separated)</label>
                                <input type='text' name='skills' value={formData.skills} onChange={handleChange}
                                    placeholder='React, Node.js, MongoDB, Git'
                                    className='w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-800 dark:text-white' />
                            </div>
                            <div>
                                <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>Languages (comma separated)</label>
                                <input type='text' name='languages' value={formData.languages} onChange={handleChange}
                                    placeholder='Nepali, English, Hindi'
                                    className='w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-800 dark:text-white' />
                            </div>
                            <div>
                                <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>Summary (optional — AI will enhance)</label>
                                <textarea name='summary' value={formData.summary} onChange={handleChange} rows={3}
                                    placeholder='Brief about yourself...'
                                    className='w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-800 dark:text-white resize-none' />
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={handleGenerate}
                        disabled={loading || !formData.fullName || !formData.email}
                        className='w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors'>
                        {loading ? (
                            <span className='flex items-center justify-center gap-2'>
                                <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                AI is generating your resume...
                            </span>
                        ) : '🤖 Generate AI Resume'}
                    </motion.button>

                    {/* Download + Reset */}
                    {pdfReady && (
                        <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center'>
                            <p className='text-green-700 dark:text-green-400 text-sm font-medium mb-3'>🎉 Resume ready!</p>
                            <div className='flex gap-3 justify-center'>
                                <button onClick={handleDownload}
                                    className='bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700'>
                                    ⬇️ Download PDF
                                </button>
                                <button onClick={handleReset}
                                    className='border border-green-600 text-green-600 px-5 py-2 rounded-lg text-sm hover:bg-green-50'>
                                    Build Another
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT — Live Preview */}
                <div className='lg:sticky lg:top-6 lg:self-start'>
                    <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm'>
                        <div className='bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2'>
                            <div className='w-2.5 h-2.5 rounded-full bg-red-400' />
                            <div className='w-2.5 h-2.5 rounded-full bg-yellow-400' />
                            <div className='w-2.5 h-2.5 rounded-full bg-green-400' />
                            <span className='text-xs text-gray-400 ml-2'>Live Preview</span>
                        </div>
                        <div className='overflow-y-auto max-h-[80vh]'>
                            <div id='resume-preview'>
                                <ResumePreview data={formData} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ResumeBuilder