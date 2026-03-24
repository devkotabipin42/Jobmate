import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Navbar from '../../../components/Navbar.jsx'

const ResumeScorer = () => {
    const [resumeText, setResumeText] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleScore = async () => {
        if (!resumeText.trim()) {
            setError('Please paste your resume text!')
            return
        }
        setLoading(true)
        setError('')
        setResult(null)
        try {
            const res = await axios.post(
                'http://localhost:3000/api/ai/score-resume',
                { resumeText },
                { withCredentials: true }
            )
            setResult(res.data.result)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to score resume')
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-amber-500'
        return 'text-red-500'
    }

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700'
        if (score >= 60) return 'bg-amber-50 dark:bg-amber-900 border-amber-200 dark:border-amber-700'
        return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
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
                       Paste your resume — get an AI score and personalized improvement tips!
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
                            Resume Text Paste karo
                        </h2>
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder='Apna resume text yahan paste karo...

Name: Bipin Devkota
Email: bipin@email.com
Phone: 98XXXXXXXX

Skills: React.js, Node.js, MongoDB...

Experience:
- Full Stack Developer at XYZ...

Education:
- BIT from XYZ College...'
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
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='space-y-4'
                    >
                        {!result && !loading && (
                            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center'>
                                <div className='text-5xl mb-4'>📄</div>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                   Paste your resume — get an AI score!
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center'>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className='w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full mx-auto mb-4'
                                />
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                    AI analyzing your resume...
                                </p>
                            </div>
                        )}

                        <AnimatePresence>
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className='space-y-4'
                                >
                                    {/* Overall Score */}
                                    <div className={`border rounded-2xl p-6 text-center ${getScoreBg(result.overall_score)}`}>
                                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Overall Score</p>
                                        <div className={`text-6xl font-bold ${getScoreColor(result.overall_score)}`}>
                                            {result.overall_score}
                                        </div>
                                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>out of 100</p>
                                        <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mt-2'>
                                            {result.verdict}
                                        </p>
                                    </div>

                                    {/* Section Scores */}
                                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4'>
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
                                                    <div className='w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5'>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${score}%` }}
                                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                                            className={`h-1.5 rounded-full ${getBarColor(score)}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Strengths */}
                                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4'>
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
                                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4'>
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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default ResumeScorer