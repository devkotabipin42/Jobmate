import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import useJobseeker from '../hooks/useJobseeker.js'
import gsap from 'gsap'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import API_URL from '../../../config/api.js'

const ResumeScorer = () => {
    const [resumeText, setResumeText] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [downloading, setDownloading] = useState(false)
    const { scoreResume, loading: aiLoading } = useJobseeker()
    const resultRef = useRef(null)
    const barsRef = useRef([])

    // GSAP animation jab result aaye
    useEffect(() => {
        if (result) {
            // Score counter animate
            gsap.fromTo('.score-number',
                { innerText: 0 },
                {
                    innerText: result.overall_score,
                    duration: 1.5,
                    ease: 'power2.out',
                    snap: { innerText: 1 },
                    onUpdate: function () {
                        const el = document.querySelector('.score-number')
                        if (el) el.innerText = Math.round(this.targets()[0].innerText)
                    }
                }
            )

            // Progress bars animate
            gsap.fromTo('.progress-bar',
                { width: '0%' },
                {
                    width: (i, el) => el.getAttribute('data-width') + '%',
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out',
                    delay: 0.3
                }
            )

            // Cards fade in
            gsap.fromTo('.result-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power3.out'
                }
            )
        }
    }, [result])

    const handleScore = async () => {
    if (!resumeText.trim()) {
        setError('Please paste your resume text!')
        return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
        const data = await scoreResume(resumeText)
        setResult(data)
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to score resume')
    } finally {
        setLoading(false)
    }
}

    const handleDownloadPDF = async () => {
        if (!resultRef.current) return
        setDownloading(true)
        try {
            const canvas = await html2canvas(resultRef.current, {
                backgroundColor: '#1f2937',
                scale: 2,
            })
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const imgWidth = 210
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
            pdf.save('resume-score-report.pdf')
        } catch (err) {
            console.log(err)
        } finally {
            setDownloading(false)
        }
    }

    const handleShareLinkedIn = () => {
        if (!result) return
        const text = `🎯 My resume scored ${result.overall_score}/100 on Jobmate AI Resume Scorer!\n\n✅ Key strengths:\n${result.strengths.slice(0, 2).map(s => `• ${s}`).join('\n')}\n\n🚀 Improving my resume with AI-powered feedback!\n\nTry it free: http://localhost:5173/resume-scorer\n\n#JobSearch #Nepal #Resume #AI`
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('http://localhost:5173/resume-scorer')}&summary=${encodeURIComponent(text)}`
        window.open(url, '_blank')
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-amber-400'
        return 'text-red-400'
    }

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-900 border-green-700'
        if (score >= 60) return 'bg-amber-900 border-amber-700'
        return 'bg-red-900 border-red-700'
    }

    const getBarColor = (score) => {
        if (score >= 80) return 'bg-green-500'
        if (score >= 60) return 'bg-amber-500'
        return 'bg-red-500'
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='max-w-4xl mx-auto px-4 md:px-6 py-8'>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center mb-8'
                >
                    <div className='text-4xl mb-3'>🤖</div>
                    <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-2'>
                        AI Resume Scorer
                    </h1>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Paste your resume to receive an AI score and personalized improvements.
                    </p>
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

                    {/* Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'
                    >
                        <h2 className='text-sm font-medium text-gray-800 dark:text-white mb-3'>
                            Paste your resume here
                        </h2>
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder='Apna resume text yahan paste karo...'
                            rows={16}
                            className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all resize-none'
                        />

                        {error && (
                            <p className='text-red-500 text-xs mt-2'>{error}</p>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleScore}
                            disabled={loading}
                            className='w-full mt-4 bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors'
                        >
                            {loading ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className='w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block'
                                    />
                                    AI analyzing...
                                </span>
                            ) : '🤖 Score My Resume'}
                        </motion.button>
                    </motion.div>

                    {/* Result */}
                    <div>
                        {!result && !loading && (
                            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center min-h-64'>
                                <div className='text-5xl mb-4'>📄</div>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                    Paste your resume — get an AI score!
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center min-h-64'>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className='w-12 h-12 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4'
                                />
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                    AI analyzing your resume...
                                </p>
                            </div>
                        )}

                        <AnimatePresence>
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='space-y-4'
                                >
                                    {/* PDF download area */}
                                    <div ref={resultRef} className='space-y-4'>

                                        {/* Overall Score */}
                                        <div className={`result-card border rounded-2xl p-6 text-center ${getScoreBg(result.overall_score)}`}>
                                            <p className='text-xs text-gray-400 mb-1'>Overall Score</p>
                                            <div className={`score-number text-6xl font-bold ${getScoreColor(result.overall_score)}`}>
                                                {result.overall_score}
                                            </div>
                                            <p className='text-xs text-gray-400 mt-1'>out of 100</p>
                                            <p className='text-sm font-medium text-white mt-2'>
                                                {result.verdict}
                                            </p>
                                        </div>

                                        {/* Section Scores */}
                                        <div className='result-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4'>
                                            <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-3'>
                                                Section Scores
                                            </h3>
                                            <div className='space-y-3'>
                                                {Object.entries(result.sections).map(([key, score]) => (
                                                    <div key={key}>
                                                        <div className='flex justify-between items-center mb-1'>
                                                            <span className='text-xs text-gray-600 dark:text-gray-300 capitalize'>
                                                                {key.replace(/_/g, ' ')}
                                                            </span>
                                                            <span className={`text-xs font-medium ${getScoreColor(score)}`}>
                                                                {score}/100
                                                            </span>
                                                        </div>
                                                        <div className='w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2'>
                                                            <div
                                                                className={`progress-bar h-2 rounded-full ${getBarColor(score)}`}
                                                                data-width={score}
                                                                style={{ width: '0%' }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Strengths */}
                                        <div className='result-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4'>
                                            <h3 className='text-sm font-medium text-green-600 mb-3'>
                                                ✓ Strengths
                                            </h3>
                                            <ul className='space-y-2'>
                                                {result.strengths.map((s, i) => (
                                                    <li key={i} className='text-xs text-gray-600 dark:text-gray-300 flex gap-2'>
                                                        <span className='text-green-500 shrink-0'>✓</span>
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Suggestions */}
                                        <div className='result-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4'>
                                            <h3 className='text-sm font-medium text-amber-600 mb-3'>
                                                💡 Improvements
                                            </h3>
                                            <ul className='space-y-2'>
                                                {result.suggestions.map((s, i) => (
                                                    <li key={i} className='text-xs text-gray-600 dark:text-gray-300 flex gap-2'>
                                                        <span className='text-amber-500 shrink-0'>{i + 1}.</span>
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className='flex flex-col sm:flex-row gap-3'>
                                        {/* Download PDF */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleDownloadPDF}
                                            disabled={downloading}
                                            className='flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors'
                                        >
                                            {downloading ? (
                                                <>
                                                    <motion.span
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        className='w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block'
                                                    />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    📄 Download PDF Report
                                                </>
                                            )}
                                        </motion.button>

                                        {/* Share LinkedIn */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleShareLinkedIn}
                                            className='flex-1 flex items-center justify-center gap-2 bg-[#0077B5] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#006097] transition-colors'
                                        >
                                            💼 Share on LinkedIn
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResumeScorer